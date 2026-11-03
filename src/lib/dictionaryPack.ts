import type { Phrase } from '../data/phrases';

export const DICTIONARY_SOURCE_URL = 'https://github.com/Mawazoni/KiswahiliModuleNooJ';
export const DICTIONARY_LICENSE_URL = 'https://creativecommons.org/licenses/by-nc-sa/3.0/';
export const DICTIONARY_ATTRIBUTION = 'Mathieu Roy and Max Silberztein (2017), NooJ Kiswahili Module; based on M. Benjamin (2008), Kamusi Project International.';
const COMMIT = 'd4b3c6852e9093dd841b2fb89235179ffce763da';
const BASE_URL = `https://raw.githubusercontent.com/Mawazoni/KiswahiliModuleNooJ/${COMMIT}/NooJKiswahiliModuleRoy2017/sw/Lexical%20Analysis/`;
const FILES = ['swahili_nouns.dic', 'swahili_verbs.dic', 'swahili_adjectives.dic', 'swahili_other_categories.dic'];
const PACK_ID = `nooj-${COMMIT}-v1`;
const DATABASE = 'lwanga-word-library';
type PackedEntry = [en: string, sw: string, partOfSpeech: string, note: string];

interface StoredPack {
  id: string;
  entries: PackedEntry[];
  source: string;
  attribution: string;
  license: string;
  changes: string;
  downloadedAt: number;
}

const partsOfSpeech: Record<string, string> = {
  N: 'noun', V: 'verb', A: 'adjective', ADV: 'adverb', PRON: 'pronoun',
  PREP: 'preposition', CONJ: 'conjunction', INTJ: 'interjection', INTERJ: 'interjection', NUM: 'number',
};

const specialInfinitives: Record<string, string> = { enda: 'kwenda', isha: 'kwisha' };

export function parseNooJDictionary(text: string): Phrase[] {
  const result: Phrase[] = [];
  for (const rawLine of text.replace(/^\uFEFF/, '').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#') || /\+NW(?:\+|$)/.test(line)) continue;
    const translationStart = line.indexOf('+EN=');
    if (translationStart < 0) continue;
    const prefix = line.slice(0, translationStart);
    const grammarStart = prefix.lastIndexOf(',');
    if (grammarStart < 0) continue;
    const grammar = prefix.slice(grammarStart + 1);
    const code = grammar.split('+')[0];
    const partOfSpeech = partsOfSpeech[code];
    if (!partOfSpeech) continue;
    const swLemma = prefix.slice(0, grammarStart).split(',')[0].trim().replace(/\\([,"+-])/g, '$1');
    const en = line.slice(translationStart + 4).split('+')[0].trim().replace(/\s+/g, ' ');
    if (!en || !swLemma || en.length > 250 || swLemma.length > 120 || /[<>\u0000-\u001f]/.test(en + swLemma)) continue;
    if (swLemma === 'jaribio la mhariri') continue;
    let sw = swLemma;
    let note = '';
    if (code === 'V' && !['ni', 'si'].includes(swLemma)) {
      sw = specialInfinitives[swLemma] ?? `ku${swLemma}`;
      note = 'Verb infinitive. The form changes with the subject and tense.';
    } else if (code === 'A' && /\+(?:FLX|DRV)=/.test(grammar)) {
      sw = `-${swLemma}`;
      note = 'Adjective stem. Add the agreement prefix required by the noun class.';
    }
    result.push({ en, sw, category: 'Words', partOfSpeech, note, provenance: 'extended',
      swAliases: sw !== swLemma ? [swLemma] : undefined });
  }
  return result;
}

function decodeDictionary(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const encoding = bytes[0] === 0xff && bytes[1] === 0xfe ? 'utf-16le'
    : bytes[0] === 0xfe && bytes[1] === 0xff ? 'utf-16be' : 'utf-8';
  return new TextDecoder(encoding).decode(bytes);
}

export async function downloadDictionary(onProgress: (completed: number, total: number) => void, signal: AbortSignal): Promise<Phrase[]> {
  let completed = 0;
  onProgress(0, FILES.length);
  const files = await Promise.all(FILES.map(async file => {
    const response = await fetch(`${BASE_URL}${file}`, { signal });
    if (!response.ok) throw new Error('The extended dictionary could not be downloaded. The built-in words still work; please retry when you are online.');
    const entries = parseNooJDictionary(decodeDictionary(await response.arrayBuffer()));
    if (entries.length < 100) throw new Error('The dictionary file was not in the expected format. Please try downloading again later.');
    onProgress(++completed, FILES.length);
    return entries;
  }));
  if (signal.aborted) throw new DOMException('Download cancelled', 'AbortError');
  const unique = new Map<string, Phrase>();
  for (const entry of files.flat()) {
    const key = `${entry.en.toLowerCase()}\t${entry.sw.toLowerCase()}\t${entry.partOfSpeech}`;
    if (!unique.has(key)) unique.set(key, entry);
  }
  if (unique.size < 1000) throw new Error('The downloaded dictionary was incomplete. Please retry while connected.');
  return [...unique.values()];
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) { reject(new Error('Offline dictionary storage is unavailable in this browser.')); return; }
    const request = indexedDB.open(DATABASE, 1);
    let settled = false;
    const timeout = setTimeout(() => { settled = true; reject(new Error('Offline dictionary storage took too long to open.')); }, 6000);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains('packs')) request.result.createObjectStore('packs', { keyPath: 'id' });
    };
    request.onsuccess = () => {
      clearTimeout(timeout);
      if (settled) { request.result.close(); return; }
      settled = true;
      request.result.onversionchange = () => request.result.close();
      resolve(request.result);
    };
    request.onerror = () => { clearTimeout(timeout); settled = true; reject(new Error('This browser could not open offline dictionary storage.')); };
    request.onblocked = () => { clearTimeout(timeout); settled = true; reject(new Error('Close other Lwanga Translate tabs, then retry the dictionary download.')); };
  });
}

async function transact<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction('packs', mode);
    const request = action(transaction.objectStore('packs'));
    const timeout = setTimeout(() => transaction.abort(), 12000);
    transaction.oncomplete = () => { clearTimeout(timeout); database.close(); resolve(request.result); };
    transaction.onerror = transaction.onabort = () => {
      clearTimeout(timeout);
      database.close();
      reject(new Error('The word library could not be saved on this device. Browser storage may be full or restricted.'));
    };
  });
}

export async function readDictionaryPack(): Promise<Phrase[]> {
  const value = await transact<StoredPack | undefined>('readonly', store => store.get(PACK_ID));
  if (!value || !Array.isArray(value.entries)) return [];
  return value.entries.filter((entry): entry is PackedEntry => Array.isArray(entry) && entry.length === 4 && entry.every(part => typeof part === 'string'))
    .slice(0, 90000).map(([en, sw, partOfSpeech, note]) => ({ en, sw, category: 'Words', partOfSpeech, note, provenance: 'extended',
      swAliases: sw.startsWith('-') ? [sw.slice(1)] : partOfSpeech === 'verb' && sw === 'kwenda' ? ['enda'] : partOfSpeech === 'verb' && sw === 'kwisha' ? ['isha'] : partOfSpeech === 'verb' && sw.startsWith('ku') ? [sw.slice(2)] : undefined }));
}

export async function saveDictionaryPack(entries: Phrase[]): Promise<void> {
  const pack: StoredPack = {
    id: PACK_ID,
    entries: entries.map(entry => [entry.en, entry.sw, entry.partOfSpeech ?? '', entry.note ?? '']),
    source: DICTIONARY_SOURCE_URL,
    attribution: DICTIONARY_ATTRIBUTION,
    license: DICTIONARY_LICENSE_URL,
    changes: 'Parsed into bilingual pairs, deduplicated, verb roots displayed as infinitives, and agreement-dependent adjective stems marked with a hyphen. Adapted data remains CC BY-NC-SA 3.0.',
    downloadedAt: Date.now(),
  };
  await transact('readwrite', store => store.put(pack));
}

export async function removeDictionaryPack(): Promise<void> {
  await transact('readwrite', store => store.delete(PACK_ID));
}