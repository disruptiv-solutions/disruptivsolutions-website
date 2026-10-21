'use client';

import { useEffect, useId, useRef, useState } from 'react';
import styles from './lesson.module.css';

export default function CopyPrompt({ text, install = false, compact = false }: { text: string; install?: boolean; compact?: boolean }) {
  const id = useId();
  const [status, setStatus] = useState('');
  const [expanded, setExpanded] = useState(!compact);
  const disclosure = useRef<HTMLDetailsElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('Copied');
    } catch {
      setExpanded(true);
      if (disclosure.current) disclosure.current.open = true;
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
    {compact ? <details ref={disclosure} open={expanded} onToggle={event => setExpanded(event.currentTarget.open)}><summary>{install ? 'Read the install prompt' : 'Read & adapt the prompt'}<span aria-hidden="true">+</span></summary><pre id={id} tabIndex={0}>{text}</pre></details> : <pre id={id} tabIndex={0}>{text}</pre>}
    <span className={styles.copyStatus} role="status" aria-live="polite">{status}</span>
  </div>;
}
