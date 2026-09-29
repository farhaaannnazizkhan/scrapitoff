"use client";

import React, { useState } from 'react';

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors ml-2"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
