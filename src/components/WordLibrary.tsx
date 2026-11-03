import { useId } from 'react';
import { ArrowUpRight, CheckCircle2, Download, LoaderCircle, X } from 'lucide-react';
import { builtInWordCount } from '../data/phrases';
import type { useDictionaryPack } from '../hooks/useDictionaryPack';

type DictionaryPack = ReturnType<typeof useDictionaryPack>;

export default function WordLibrary({ pack, offline, onDetails, showDetails = true }: { pack: DictionaryPack; offline: boolean; onDetails: () => void; showDetails?: boolean }) {
  const headingId = useId();
  const ready = pack.status === 'ready';
  const downloading = pack.status === 'downloading';
  const saving = downloading && pack.progress >= 90;
  return (
    <section className="word-library" aria-labelledby={headingId}>
      <div className="word-library-main">
        <div><h2 id={headingId}>A bigger world of words.</h2><p>{ready ? `${pack.entries.length.toLocaleString()} extended dictionary meanings ${pack.persisted ? 'saved for offline use' : 'available for this visit'}.` : `${builtInWordCount.toLocaleString()} built-in word pairs, plus a downloadable extended school dictionary.`}</p></div>
        <div className="word-library-actions">
          {ready ? <span className="library-ready"><CheckCircle2 size={16} />{pack.persisted ? 'Saved on this device' : 'Loaded for this visit'}</span>
            : <button className="secondary-button" disabled={offline || downloading || pack.status === 'restoring'} onClick={() => void pack.download()}>
              {downloading || pack.status === 'restoring' ? <LoaderCircle size={15} className="spin" /> : <Download size={15} />}
              {saving ? 'Saving for offline use...' : downloading ? 'Downloading words...' : pack.status === 'restoring' ? 'Checking saved library...' : 'Add offline word library'}
            </button>}
          {downloading && !saving && <button className="icon-button" onClick={pack.cancel} aria-label="Cancel dictionary download" title="Cancel download"><X size={17} /></button>}
        </div>
      </div>
      {downloading && <div className="library-progress" role="progressbar" aria-label="Downloading extended dictionary" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pack.progress)}><span style={{ width: `${pack.progress}%` }} /></div>}
      <div className="word-library-footnote"><span>{offline && !ready ? 'Connect and turn off Offline mode to download. Built-in words are already available.' : 'Extended data: NooJ / Kamusi. Non-commercial school use, CC BY-NC-SA 3.0.'}</span>{showDetails && <button className="text-link" onClick={onDetails}>{ready ? 'Manage library & credits' : 'Coverage & credits'} <ArrowUpRight size={13} /></button>}</div>
      {pack.message && <p className="library-message" role="status">{pack.message}</p>}
    </section>
  );
}