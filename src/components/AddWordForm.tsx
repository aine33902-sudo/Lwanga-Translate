import { useState } from 'react';
import { Check, Plus, X } from 'lucide-react';

export default function AddWordForm({ onAdd }: { onAdd: (en: string, sw: string, note: string) => string | null }) {
  const [open, setOpen] = useState(false);
  const [english, setEnglish] = useState('');
  const [swahili, setSwahili] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  function close() { setOpen(false); setError(null); }

  return <div className="add-word">
    <button className="text-link add-word-trigger" onClick={() => { setOpen(current => !current); setError(null); }} aria-expanded={open} aria-controls="add-word-form">{open ? <X size={15} /> : <Plus size={15} />}{open ? 'Close word form' : 'Add your own word'}</button>
    {open && <form id="add-word-form" className="add-word-form" onSubmit={event => {
      event.preventDefault();
      const issue = onAdd(english, swahili, note);
      if (issue) { setError(issue); return; }
      setEnglish(''); setSwahili(''); setNote(''); close();
    }}>
      <p>Have a teacher-checked word? Keep it here for both translation directions. Your entries stay on this device and are not automatically verified.</p>
      <div className="add-word-fields"><label>English word or phrase<input value={english} onChange={event => { setEnglish(event.target.value); setError(null); }} maxLength={100} required autoFocus placeholder="For example: library" lang="en" /></label><label>Kiswahili word or phrase<input value={swahili} onChange={event => { setSwahili(event.target.value); setError(null); }} maxLength={100} required placeholder="Kwa mfano: maktaba" lang="sw" /></label></div>
      <label className="word-context-field">Context or note <span>(optional)</span><input value={note} onChange={event => setNote(event.target.value)} maxLength={200} placeholder="A subject, noun class, or example to remember" /></label>
      {error && <p className="word-form-error" role="alert">{error}</p>}
      <div className="add-word-submit"><button type="button" className="text-link" onClick={close}>Cancel</button><button type="submit" className="primary-button"><Check size={15} />Save word offline</button></div>
    </form>}
  </div>;
}