"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export function CleanlinessForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      category: formData.get('category') as string,
      severity: formData.get('severity') as string,
      description: formData.get('description') as string,
      area: formData.get('area') as string,
      address: formData.get('address') as string,
      photo_url: ''
    };

    if (data.description.length < 10) {
      setError('Description must be at least 10 characters.');
      setLoading(false);
      return;
    }

    const photoFile = formData.get('photo') as File;
    if (photoFile && photoFile.size > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(photoFile);
      await new Promise<void>((resolve) => {
        reader.onload = () => {
          data.photo_url = reader.result as string;
          resolve();
        };
      });
    }

    try {
      const res = await fetch('/api/cleanliness/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (result.success) {
        router.push('/citizen/reports/success');
      } else {
        setError(result.error || 'Failed to submit report');
      }
    } catch (err: any) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
      
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
        <select name="category" required className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-green-500 focus:outline-none">
          <option value="Overflowing garbage bin">Overflowing garbage bin</option>
          <option value="Dirty public toilet">Dirty public toilet</option>
          <option value="Stagnant water">Stagnant water</option>
          <option value="Open garbage dump">Open garbage dump</option>
          <option value="Sewage overflow">Sewage overflow</option>
          <option value="Unclean public space">Unclean public space</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Severity</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input type="radio" name="severity" value="LOW" defaultChecked className="w-5 h-5 text-green-600 focus:ring-green-500" />
            <span className="text-gray-900 font-medium">Low</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="severity" value="MEDIUM" className="w-5 h-5 text-amber-500 focus:ring-amber-400" />
            <span className="text-gray-900 font-medium">Medium</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="severity" value="HIGH" className="w-5 h-5 text-red-600 focus:ring-red-500" />
            <span className="text-gray-900 font-medium text-red-700">High</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
        <textarea name="description" required minLength={10} maxLength={300} rows={4} placeholder="Describe the issue in detail..." className="w-full p-4 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-green-500 focus:outline-none resize-none"></textarea>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Area</label>
        <input type="text" name="area" required placeholder="e.g. Bandra West" className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-green-500 focus:outline-none" />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Specific Address (Optional)</label>
        <input type="text" name="address" placeholder="Near the bus stop..." className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-green-500 focus:outline-none" />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Photo (Optional)</label>
        <input type="file" name="photo" accept="image/*" className="w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
      </div>

      <button type="submit" disabled={loading} className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors mt-6">
        {loading ? 'Submitting...' : 'Submit Report'}
      </button>
    </form>
  );
}
