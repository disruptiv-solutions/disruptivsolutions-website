"use client";

import { useEffect, useRef, useState } from "react";

export default function CopyButton({ promptId }: { promptId: string }) {
  const [message, setMessage] = useState("Copy");
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timeout.current), []);

  async function copyPrompt() {
    const prompt = document.getElementById(promptId);
    if (!prompt) return;
    const clone = prompt.cloneNode(true) as HTMLElement;
    clone
      .querySelectorAll("[data-marker]")
      .forEach((marker) => marker.remove());
    const text = (clone.textContent || "").replace(/\s+/g, " ").trim();
    let result = "Copied";
    try {
      if (!navigator.clipboard?.writeText)
        throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(text);
    } catch {
      const range = document.createRange();
      range.selectNodeContents(prompt);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      result = "Selected — copy manually";
    }
    setMessage(result);
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setMessage("Copy"), 2200);
  }

  return (
    <button
      type="button"
      data-copy={promptId.replace("prompt-", "")}
      onClick={copyPrompt}
      className={
        "cp z17 copy-button" + (message === "Copied" ? " cp-done" : "")
      }
      aria-label={
        message === "Copy"
          ? `Copy prompt ${promptId.replace("prompt-", "")}`
          : message
      }
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden="true"
      >
        <rect x="5.5" y="5.5" width="8.5" height="8.5" rx="1.8" />
        <path d="M10.5 3 V2.8 A1.3 1.3 0 0 0 9.2 1.5 H3 A1.5 1.5 0 0 0 1.5 3 V9.2 A1.3 1.3 0 0 0 2.8 10.5 H3" />
      </svg>
      <span className="cp-label" role="status">
        {message}
      </span>
    </button>
  );
}
