import { useEffect, useRef, useState } from 'react';
import type { Phrase } from '../data/phrases';
import { downloadDictionary, readDictionaryPack, removeDictionaryPack, saveDictionaryPack } from '../lib/dictionaryPack';

export type PackStatus = 'restoring' | 'idle' | 'downloading' | 'ready' | 'error';

export function useDictionaryPack() {
  const [entries, setEntries] = useState<Phrase[]>([]);
  const [status, setStatus] = useState<PackStatus>('restoring');
  const [progress, setProgress] = useState(0);
  const [persisted, setPersisted] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const controller = useRef<AbortController | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    let active = true;
    readDictionaryPack().then(stored => {
      if (!active) return;
      setEntries(stored);
      setPersisted(stored.length > 0);
      setStatus(stored.length > 0 ? 'ready' : 'idle');
    }).catch(() => { if (active) setStatus('idle'); });
    return () => { active = false; mounted.current = false; controller.current?.abort(); };
  }, []);

  async function download() {
    if (controller.current || status === 'restoring') return;
    const abort = new AbortController();
    controller.current = abort;
    const timeout = setTimeout(() => abort.abort(), 90000);
    setStatus('downloading');
    setMessage(null);
    setProgress(0);
    try {
      const downloaded = await downloadDictionary((completed, total) => {
        if (mounted.current) setProgress(completed / total * 90);
      }, abort.signal);
      if (!mounted.current) return;
      if (abort.signal.aborted) throw new DOMException('Download cancelled', 'AbortError');
      setEntries(downloaded);
      try {
        await saveDictionaryPack(downloaded);
        if (mounted.current) setPersisted(true);
      } catch (cause) {
        if (mounted.current) {
          setPersisted(false);
          setMessage(`${cause instanceof Error ? cause.message : 'Browser storage is unavailable.'} The downloaded dictionary works for this visit only.`);
        }
      }
      if (mounted.current) { setProgress(100); setStatus('ready'); }
    } catch (cause) {
      if (!mounted.current) return;
      setStatus(entries.length ? 'ready' : 'error');
      setMessage(abort.signal.aborted ? 'Download stopped. Keep your connection on and try again; built-in words are still available.'
        : cause instanceof Error ? cause.message : 'The extended word library could not be downloaded. Please try again.');
      abort.abort();
    } finally {
      clearTimeout(timeout);
      controller.current = null;
    }
  }

  async function remove() {
    if (controller.current) return;
    try {
      await removeDictionaryPack();
      setEntries([]);
      setPersisted(false);
      setStatus('idle');
      setMessage('Extended dictionary removed. Built-in words and your saved translations are unchanged.');
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : 'The dictionary could not be removed.');
    }
  }

  return { entries, status, progress, persisted, message, download, cancel: () => controller.current?.abort(), remove };
}