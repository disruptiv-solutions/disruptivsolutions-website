'use client';

import { useEffect, useId, useRef, useState } from 'react';
import styles from './lesson.module.css';

export default function CopyPrompt({ text, install = false }: { text: string; install?: boolean }) {
  const id = useId();
  const [status, setStatus] = useState('');
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
        window.getSelection()?.removeAllRanges();
        window.getSelection()?.addRange(range);
      }
      setStatus('Select the text below and copy');
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus(''), 3500);
  }
  return <div className={styles.prompt}>
    <div className={styles.promptBar}><span>{install ? 'The skill + instructions, in one prompt' : 'Make it yours / replace the brackets'}</span><button type="button" onClick={copy}>{install ? 'Copy for my agent' : 'Copy prompt'} <span aria-hidden="true">↗</span></button></div>
    <pre id={id} tabIndex={0}>{text}</pre>
    <span className={styles.copyStatus} role="status" aria-live="polite">{status}</span>
  </div>;
}
