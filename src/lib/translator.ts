import { normalize, translateOffline, type Language, type Phrase } from '../data/phrases';
import { translateVerbForm } from '../data/verbForms';
import { createDictionaryIndex, dictionaryMeanings, type DictionaryIndex } from './dictionary';

export interface TranslationAlternative {
  text: string;
  partOfSpeech?: string;
  note?: string;
  dictionarySource?: 'school' | 'extended' | 'custom';
}

export interface Translation {
  id: string;
  input: string;
  output: string;
  source: Language;
  origin: 'online' | 'phrasebook' | 'dictionary' | 'verb' | 'custom' | 'cache';
  createdAt: number;
  alternatives?: TranslationAlternative[];
  note?: string;
  dictionarySource?: 'school' | 'extended' | 'custom';
  partOfSpeech?: string;
}

const CACHE_KEY = 'lwanga-translation-cache-v2';
export const CACHE_LIMIT = 1000;
export const SAVED_KEY = 'lwanga-saved-translations-v1';
const builtInIndex = createDictionaryIndex();

export function readStored<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
}

export function store(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function translationKey(input: string, source: Language): string {
  return `${source}:${input.normalize('NFKC').replace(/\s+/g, ' ').trim()}`;
}

export function getCache(): Translation[] {
  const value = readStored<unknown>(CACHE_KEY, []);
  return Array.isArray(value) ? value.filter(isTranslation).slice(0, CACHE_LIMIT).map(item => ({ ...item, id: translationKey(item.input, item.source) })) : [];
}

export function isTranslation(value: unknown): value is Translation {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<Translation>;
  return typeof item.id === 'string' && typeof item.input === 'string' && typeof item.output === 'string'
    && (item.source === 'en' || item.source === 'sw') && typeof item.createdAt === 'number'
    && ['online', 'phrasebook', 'dictionary', 'verb', 'custom', 'cache'].includes(item.origin ?? '')
    && (item.note === undefined || typeof item.note === 'string')
    && (item.partOfSpeech === undefined || typeof item.partOfSpeech === 'string')
    && (item.dictionarySource === undefined || ['school', 'extended', 'custom'].includes(item.dictionarySource))
    && (item.alternatives === undefined || Array.isArray(item.alternatives) && item.alternatives.every(alternative => alternative && typeof alternative.text === 'string'
      && (alternative.note === undefined || typeof alternative.note === 'string') && (alternative.partOfSpeech === undefined || typeof alternative.partOfSpeech === 'string')));
}

export function makeTranslation(input: string, output: string, source: Language, origin: Translation['origin']): Translation {
  return { id: translationKey(input, source), input: input.trim(), output, source, origin, createdAt: Date.now() };
}

export function cacheTranslation(translation: Translation): boolean {
  if (translation.origin === 'custom') return true;
  const old = getCache().filter(item => item.id !== translation.id);
  // Machine translation is not reversible. Store only the direction that was actually translated.
  return store(CACHE_KEY, [translation, ...old].slice(0, CACHE_LIMIT));
}

export function translationFromEntry(primary: Phrase, input: string, source: Language, index: DictionaryIndex = builtInIndex): Translation {
  const meanings = dictionaryMeanings(input, source, index);
  const target = source === 'en' ? 'sw' : 'en';
  const seen = new Set([normalize(primary[target])]);
  const alternatives: TranslationAlternative[] = [];
  for (const meaning of meanings) {
    const key = normalize(meaning[target]);
    if (seen.has(key)) continue;
    seen.add(key);
    alternatives.push({ text: meaning[target], partOfSpeech: meaning.partOfSpeech, note: meaning.note, dictionarySource: meaning.provenance ?? 'school' });
    if (alternatives.length === 7) break;
  }
  const origin = primary.provenance === 'custom' ? 'custom' : primary.category === 'Words' ? 'dictionary' : 'phrasebook';
  return { ...makeTranslation(input, primary[target], source, origin), alternatives,
    dictionarySource: primary.provenance ?? 'school', partOfSpeech: primary.partOfSpeech,
    note: primary.note || (alternatives.length ? 'This word has several meanings. Use a short sentence online for context.' : primary.category === 'Words' && primary.partOfSpeech === 'adjective' ? 'Adjective agreement can change with the noun class.' : undefined) };
}

export function localTranslation(input: string, source: Language, index: DictionaryIndex = builtInIndex): Translation | null {
  const meanings = dictionaryMeanings(input, source, index);
  if (meanings.length) return translationFromEntry(meanings[0], input, source, index);
  const phrase = translateOffline(input, source);
  if (phrase) return makeTranslation(input, phrase, source, 'phrasebook');
  const verb = translateVerbForm(input, source);
  if (verb) return { ...makeTranslation(input, verb, source, 'verb'), note: 'A recognized personal verb form. Complex clauses and noun-class agreement need an online translation.' };
  const cached = getCache().find(item => item.id === translationKey(input, source));
  return cached ? { ...cached, input: input.trim(), origin: 'cache' } : null;
}

// MyMemory accepts at most 500 UTF-8 bytes per request, not 500 characters.
export function splitIntoChunks(text: string): string[] {
  const encoder = new TextEncoder();
  const chunks: string[] = [];
  let current = '';
  for (const char of text) {
    if (encoder.encode(current + char).length > 470) {
      const sentenceBoundaries = [...current.matchAll(/[.!?]\s/g)];
      const sentenceBoundary = sentenceBoundaries.length ? (sentenceBoundaries[sentenceBoundaries.length - 1].index ?? -1) + 1 : -1;
      const boundary = sentenceBoundary > current.length / 2 ? sentenceBoundary : current.lastIndexOf(' ');
      if (boundary > current.length / 2) {
        chunks.push(current.slice(0, boundary).trim());
        current = current.slice(boundary + 1) + char;
      } else {
        chunks.push(current.trim());
        current = char;
      }
    } else {
      current += char;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

interface MemoryMatch {
  id?: number | string;
  segment?: string;
  translation?: string;
  source?: string;
  target?: string;
  quality?: number | string;
}

interface MemoryResponse {
  responseStatus?: number | string;
  responseData?: { translatedText?: string; match?: number };
  quotaFinished?: boolean;
  matches?: MemoryMatch[];
}

function normalizeSegment(text: string): string {
  return text.normalize('NFKC').toLowerCase().replace(/[\u2018\u2019]/g, "'").replace(/\s+/g, ' ').trim().replace(/[.!?]+$/g, '');
}

export function selectOnlineTranslation(data: MemoryResponse, input: string, source: Language): string | null {
  const target = source === 'en' ? 'sw' : 'en';
  const matches = Array.isArray(data.matches) ? data.matches : [];
  const usable = matches.filter(match => match && typeof match.translation === 'string' && match.translation.trim()
    && (match.source === undefined || typeof match.source === 'string' && match.source.toLowerCase().startsWith(source))
    && (match.target === undefined || typeof match.target === 'string' && match.target.toLowerCase().startsWith(target)));
  const exact = usable.filter(match => typeof match.segment === 'string' && normalizeSegment(match.segment) === normalizeSegment(input));
  exact.sort((a, b) => Number(b.quality ?? 0) - Number(a.quality ?? 0));
  if (exact.length) return exact[0].translation!.trim();
  const machine = usable.find(match => Number(match.id) === 0);
  if (machine) return machine.translation!.trim();
  if (typeof data.responseData?.translatedText === 'string' && data.responseData.match === 1) return data.responseData.translatedText.trim() || null;
  return null;
}

export async function translateOnline(input: string, source: Language, signal: AbortSignal): Promise<Translation> {
  const target = source === 'en' ? 'sw' : 'en';
  const output: string[] = [];
  let unchangedSegments = 0;
  for (const block of input.trim().split(/(\n+)/)) {
    if (!block) continue;
    if (/^\n+$/.test(block)) { output.push(block); continue; }
    const translatedBlock: string[] = [];
    for (const chunk of splitIntoChunks(block)) {
      if (signal.aborted) throw new DOMException('Translation cancelled', 'AbortError');
      const params = new URLSearchParams({ q: chunk, langpair: `${source}|${target}`, mt: '1' });
      const response = await fetch(`https://api.mymemory.translated.net/get?${params}`, { signal });
      if (response.status === 429) throw new Error('The free online service has reached its daily limit. Downloaded dictionary words are still available offline.');
      if (!response.ok) throw new Error('The online service is unavailable. Please try again shortly, or use the offline phrasebook.');
      const data = await response.json().catch(() => {
        throw new Error('The online service returned an unexpected response. Please try again shortly.');
      }) as MemoryResponse | null;
      if (!data || typeof data !== 'object') throw new Error('The online service returned an unexpected response. Please try again shortly.');
      if (data.quotaFinished || Number(data.responseStatus) === 429) {
        throw new Error('The free online service has reached its daily limit. The offline phrasebook is still available.');
      }
      const selected = Number(data.responseStatus) === 200 ? selectOnlineTranslation(data, chunk, source) : null;
      if (!selected) {
        throw new Error('The online service could not translate this text. Please try again or choose a phrase from the phrasebook.');
      }
      const decoder = document.createElement('textarea');
      decoder.innerHTML = selected;
      if (normalizeSegment(decoder.value) === normalizeSegment(chunk)) unchangedSegments += 1;
      translatedBlock.push(decoder.value);
    }
    output.push(translatedBlock.join(' '));
  }
  const translation = makeTranslation(input, output.join(''), source, 'online');
  if (normalize(translation.output) === normalize(input)) {
    translation.note = 'The service kept this text unchanged. It may be a shared word, a name, or an unavailable translation. Try adding context; this result has not been cached.';
  } else if (unchangedSegments) {
    translation.note = 'Some text was kept unchanged. It may contain names, shared words, or terms the service could not translate. Check those sections; this result has not been cached.';
  } else if (!cacheTranslation(translation)) {
    translation.note = 'Translated online, but browser storage is full or restricted. This result was not saved for offline use.';
  }
  return translation;
}