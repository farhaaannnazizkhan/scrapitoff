"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DemoRole } from '@/lib/auth/demoRole';

interface DemoUser {
  id: string;
  name: string;
  area: string;
}

export function RoleSwitcher({ currentRole }: { currentRole: DemoRole }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dropdownRole, setDropdownRole] = useState<'collector' | 'recycler' | null>(null);
  const [users, setUsers] = useState<DemoUser[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownRole(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const switchRole = async (role: DemoRole) => {
    if (role === 'collector' || role === 'recycler') {
      if (dropdownRole === role) {
        setDropdownRole(null);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/demo/users?role=${role}`);
        const data = await res.json();
        setUsers(data);
        setDropdownRole(role);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (role === currentRole) return;
    setLoading(true);
    try {
      await fetch('/api/demo/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      router.refresh();
      router.push(`/${role}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectUser = async (role: 'collector' | 'recycler', userId: string) => {
    setLoading(true);
    try {
      await fetch('/api/demo/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, userId }),
      });
      await fetch('/api/demo/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      setDropdownRole(null);
      router.refresh();
      router.push(`/${role}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const btnClass = (role: DemoRole) => 
    `px-3 py-1 text-xs font-bold rounded-full transition-colors ${
      currentRole === role 
        ? 'bg-green-600 text-white shadow-sm' 
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`;

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center gap-2 bg-white p-1.5 rounded-full border border-gray-200 shadow-sm relative z-50">
        <button disabled={loading} onClick={() => switchRole('citizen')} className={btnClass('citizen')}>Citizen</button>
        <button disabled={loading} onClick={() => switchRole('collector')} className={btnClass('collector')}>Collector</button>
        <button disabled={loading} onClick={() => switchRole('recycler')} className={btnClass('recycler')}>Recycler</button>
        <button disabled={loading} onClick={() => switchRole('admin')} className={btnClass('admin')}>Admin</button>
        <button disabled={loading} onClick={() => switchRole('municipal')} className={btnClass('municipal')}>Municipal</button>
      </div>

      {dropdownRole && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-[100] overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
            Select {dropdownRole}
          </div>
          <div className="max-h-48 overflow-y-auto">
            {users.map(u => (
              <button
                key={u.id}
                onClick={() => selectUser(dropdownRole, u.id)}
                className="w-full text-left px-4 py-3 hover:bg-green-50 border-b border-gray-100 transition-colors last:border-0"
              >
                <div className="font-bold text-sm text-gray-900">{u.name}</div>
                <div className="text-xs text-gray-500 font-medium mt-0.5">{u.area}</div>
              </button>
            ))}
            {users.length === 0 && (
              <div className="px-4 py-4 text-sm text-gray-500 text-center font-medium">No users found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
