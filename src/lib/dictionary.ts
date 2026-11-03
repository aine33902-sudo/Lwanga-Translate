import { normalize, phrases, type Language, type Phrase } from '../data/phrases';

export interface DictionaryIndex {
  en: Map<string, Phrase[]>;
  sw: Map<string, Phrase[]>;
  entries: Phrase[];
}

function add(index: Map<string, Phrase[]>, key: string, entry: Phrase) {
  const normalized = normalize(key).replace(/^-/, '');
  if (!normalized) return;
  const bucket = index.get(normalized) ?? [];
  if (bucket.length < 40 && !bucket.some(item => item.en === entry.en && item.sw === entry.sw)) bucket.push(entry);
  index.set(normalized, bucket);
}

export function createDictionaryIndex(extended: Phrase[] = [], custom: Phrase[] = []): DictionaryIndex {
  const index: DictionaryIndex = { en: new Map(), sw: new Map(), entries: [] };
  const unique = new Set<string>();
  for (const phrase of [...custom, ...phrases, ...extended]) {
    const key = `${normalize(phrase.en)}:${normalize(phrase.sw)}`;
    if (unique.has(key)) continue;
    unique.add(key);
    index.entries.push(phrase);
    for (const en of [phrase.en, ...(phrase.enAliases ?? [])]) add(index.en, en, phrase);
    for (const sw of [phrase.sw, ...(phrase.swAliases ?? [])]) {
      add(index.sw, sw, phrase);
      if (sw.includes("'")) add(index.sw, sw.replace(/'/g, ''), phrase);
    }
    if (phrase.provenance === 'extended') {
      const gloss = phrase.en.replace(/\s*\([^)]*\)/g, '').trim();
      if (gloss) add(index.en, gloss, phrase);
      if (phrase.partOfSpeech === 'verb' && /^to\s/i.test(gloss)) add(index.en, gloss.replace(/^to\s+/i, ''), phrase);
      if (phrase.partOfSpeech === 'verb') add(index.en, `to ${gloss.replace(/^to\s+/i, '')}`, phrase);
    }
  }
  return index;
}

export function dictionaryMeanings(text: string, source: Language, index: DictionaryIndex): Phrase[] {
  return index[source].get(normalize(text).replace(/^-/, '')) ?? [];
}

export function isDictionaryTerm(text: string): boolean {
  return text.trim().length <= 100 && /^[\p{L}\p{M}0-9 '\u2019-]+[.!?]?$/u.test(text.trim()) && text.trim().split(/\s+/).length <= 4;
}

function boundedDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) current[j] = Math.min(current[j - 1] + 1, previous[j] + 1, previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    if (Math.min(...current) > max) return max + 1;
    previous = current;
  }
  return previous[b.length];
}

export function spellingSuggestions(text: string, source: Language, index: DictionaryIndex): string[] {
  const key = normalize(text);
  if (key.length < 4 || key.length > 28 || /\s/.test(key)) return [];
  const matches: { word: string; distance: number }[] = [];
  for (const [word, entries] of index[source]) {
    if (/\s/.test(word) || Math.abs(word.length - key.length) > 1) continue;
    const distance = boundedDistance(key, word, 1);
    if (distance === 1) matches.push({ word: entries[0][source], distance });
    if (matches.length >= 12) break;
  }
  return [...new Set(matches.map(item => item.word))].slice(0, 3);
}