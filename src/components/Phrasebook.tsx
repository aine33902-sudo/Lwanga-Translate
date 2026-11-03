import { useDeferredValue, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Bookmark, BookOpen, Search, Trash2, Volume2, WifiOff, X } from 'lucide-react';
import { categories, normalize, type Language, type Phrase, type PhraseCategory } from '../data/phrases';
import type { Translation } from '../lib/translator';
import AddWordForm from './AddWordForm';

interface Props {
  saved: Translation[];
  entries: Phrase[];
  onLookup: (text: string) => void;
  onAddWord: (en: string, sw: string, note: string) => string | null;
  onRemoveWord: (entry: Phrase) => void;
  onUsePhrase: (phrase: Phrase) => void;
  onUseSaved: (translation: Translation) => void;
  onRemoveSaved: (id: string) => void;
  onListen: (text: string, language: Language) => void;
}

type Filter = 'All entries' | PhraseCategory | 'Your words' | 'Saved';
const filters: Filter[] = ['All entries', ...categories, 'Your words', 'Saved'];
const filterId = (filter: Filter) => `phrase-filter-${filter.toLowerCase().replace(/\s+/g, '-')}`;

export default function Phrasebook({ saved, entries, onLookup, onAddWord, onRemoveWord, onUsePhrase, onUseSaved, onRemoveSaved, onListen }: Props) {
  const [filter, setFilter] = useState<Filter>('All entries');
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(30);
  const query = useDeferredValue(normalize(search));

  const filteredPhrases = useMemo(() => entries.filter(phrase =>
    (filter === 'All entries' || phrase.category === filter || filter === 'Your words' && phrase.provenance === 'custom') &&
    (!query || normalize(`${phrase.en} ${phrase.sw} ${(phrase.enAliases ?? []).join(' ')} ${(phrase.swAliases ?? []).join(' ')}`).includes(query))), [entries, filter, query]);
  const filteredSaved = useMemo(() => saved.filter(item =>
    !query || normalize(`${item.input} ${item.output}`).includes(query)), [saved, query]);
  const count = filter === 'Saved' ? filteredSaved.length : filteredPhrases.length;

  function changeFilter(next: Filter) { setFilter(next); setLimit(30); }

  return (
    <motion.section className="phrasebook" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }} aria-label="Offline English and Kiswahili dictionary and phrasebook">
      <div className="hub-section-heading"><h2>A word for <em>everyday life.</em></h2><p>Search words, phrases, and dictionary meanings in either language. {entries.length.toLocaleString()} entries available on this device.</p></div>
      <div className="phrasebook-toolbar">
        <div className="phrase-search"><Search size={18} /><input aria-label="Search English or Kiswahili phrases" value={search} onChange={event => { setSearch(event.target.value); setLimit(30); }} placeholder="Find a word in either language..." />{search && <button className="icon-button" onClick={() => { setSearch(''); setLimit(30); }} aria-label="Clear search"><X size={16} /></button>}</div>
        <span className="phrasebook-offline"><WifiOff size={15} />Always available offline</span>
      </div>
      <AddWordForm onAdd={onAddWord} />
      <div className="phrasebook-filters" role="tablist" aria-label="Phrase categories">
        {filters.map((item, index) => <button key={item} id={filterId(item)} role="tab" aria-selected={filter === item} aria-controls="phrase-results" tabIndex={filter === item ? 0 : -1} onClick={() => changeFilter(item)} onKeyDown={event => {
          let next = index;
          if (event.key === 'ArrowRight') next = (index + 1) % filters.length;
          else if (event.key === 'ArrowLeft') next = (index - 1 + filters.length) % filters.length;
          else if (event.key === 'Home') next = 0;
          else if (event.key === 'End') next = filters.length - 1;
          else return;
          event.preventDefault();
          changeFilter(filters[next]);
          const button = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next];
          button?.focus();
          button?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        }} className={`phrase-filter ${filter === item ? 'selected' : ''}`}>{item === 'Saved' && <Bookmark size={14} />}{item}{item === 'Saved' && <span className="saved-count">{saved.length}</span>}</button>)}
      </div>

      <div className="phrasebook-results" id="phrase-results" role="tabpanel" aria-labelledby={filterId(filter)} tabIndex={0}>
        <div className="phrase-table-heading"><span>ENGLISH</span><span>KISWAHILI</span><span>{count.toLocaleString()} {count === 1 ? 'entry' : 'entries'}</span></div>
        {count === 0 ? <div className="phrasebook-empty">{filter === 'Saved' && !query ? <Bookmark size={29} strokeWidth={1.4} /> : <BookOpen size={29} strokeWidth={1.4} />}<h2>{filter === 'Saved' && !query ? 'Keep the words that mean something.' : filter === 'Your words' && !query ? 'Make this dictionary yours.' : 'There is more to discover online.'}</h2><p>{filter === 'Saved' && !query ? 'Translate a word or phrase, then select the bookmark to keep it here.' : filter === 'Your words' && !query ? 'Use Add your own word to save a teacher-checked English and Kiswahili pair.' : 'This search has no entries in the current category. Try all entries, or look it up in the translator.'}</p>{query && <div className="dictionary-empty-actions"><button className="text-link" onClick={() => onLookup(search.trim())}>Look up this text <ArrowUpRight size={15} /></button><button className="text-link" onClick={() => { setSearch(''); changeFilter('All entries'); }}>See all entries <ArrowRight size={15} /></button></div>}</div> :
          filter === 'Saved' ? filteredSaved.slice(0, limit).map(item => <div className="phrase-row" key={item.id}><button className="phrase-row-content" onClick={() => onUseSaved(item)} aria-label={`Use saved translation: ${item.input}`}><span>{item.source === 'en' ? item.input : item.output}</span><span lang="sw">{item.source === 'sw' ? item.input : item.output}</span></button><div className="phrase-row-actions"><button className="icon-button" onClick={() => onRemoveSaved(item.id)} aria-label={`Remove saved phrase: ${item.input}`} title="Remove saved phrase"><Trash2 size={16} /></button><button className="icon-button" onClick={() => onUseSaved(item)} aria-label={`Open translation: ${item.input}`} title="Open translation"><ArrowUpRight size={18} /></button></div></div>) :
            filteredPhrases.slice(0, limit).map(phrase => <div className="phrase-row" key={`${phrase.en}:${phrase.sw}`}><button className="phrase-row-content" onClick={() => onUsePhrase(phrase)} aria-label={`Translate ${phrase.en} to ${phrase.sw}`}><span>{phrase.en}{phrase.partOfSpeech && <small className="dictionary-word-type">{phrase.partOfSpeech}{phrase.provenance === 'extended' ? ' / NooJ' : phrase.provenance === 'custom' ? ' / your word' : ''}</small>}</span><span lang="sw">{phrase.sw}{phrase.note && <small className="dictionary-word-note" lang="en">{phrase.note}</small>}</span></button><div className="phrase-row-actions">{phrase.provenance === 'custom' ? <button className="icon-button" onClick={() => onRemoveWord(phrase)} aria-label={`Remove your word: ${phrase.en}`} title="Remove your word"><Trash2 size={16} /></button> : <button className="icon-button" onClick={() => onListen(phrase.sw, 'sw')} aria-label={`Listen to ${phrase.sw}`} title="Listen in Kiswahili"><Volume2 size={17} /></button>}<button className="icon-button" onClick={() => onUsePhrase(phrase)} aria-label={`Use entry: ${phrase.en}`} title="Use in translator"><ArrowUpRight size={18} /></button></div></div>)}
        {count > limit && <div className="load-phrases"><button className="secondary-button" onClick={() => setLimit(current => current + 30)}>A few more words <ArrowRight size={16} /></button><span>Showing {Math.min(limit, count).toLocaleString()} of {count.toLocaleString()} entries</span></div>}
      </div>
      <p className="phrasebook-note">Dictionary entries are word meanings, not a full sentence translator. A leading hyphen marks an adjective stem; noun-class agreement changes its form. Extended NooJ / Kamusi data is for non-commercial use under CC BY-NC-SA 3.0. Check important work with your teacher.</p>
    </motion.section>
  );
}