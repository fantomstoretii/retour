"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="btn-cta mt-4 inline-flex h-12 items-center justify-center rounded-full border-2 border-ink px-6 font-bold hover:bg-white"
    >
      {copied ? "Copié" : "Copier le message"}
    </button>
  );
}
