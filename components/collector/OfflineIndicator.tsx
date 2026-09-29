"use client";

import React, { useState, useEffect } from 'react';

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Check initial state
    setIsOffline(!navigator.onLine);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="w-full bg-orange-500 text-white font-medium py-3 px-4 text-center shadow-md z-50">
      Offline Mode — changes will sync when you're back online
    </div>
  );
}
