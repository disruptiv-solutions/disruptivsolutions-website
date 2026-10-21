'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './lesson.module.css';

export default function Prompt({ id, text }: { id: string; text: string }) {
  const [status, setStatus] = useState('Copy prompt');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('Copied');
    } catch {
      const node = document.getElementById(id);
      if (node) {
        const range = document.createRange();
        range.selectNodeContents(node);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      setStatus('Selected — copy manually');
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus('Copy prompt'), 2500);
  }

  return <div className={styles.prompt}>
    <div className={styles.promptBar}><span>Make it yours / replace the brackets</span><button type="button" onClick={copy} aria-label={`Copy prompt for ${id.replace('prompt-', '').replaceAll('-', ' ')}`}><span role="status">{status}</span><span aria-hidden="true">↗</span></button></div>
    <pre id={id} tabIndex={0}>{text}</pre>
  </div>;
}
