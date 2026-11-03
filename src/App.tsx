import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import {
  ArrowDownUp, ArrowRight, ArrowUpRight, AudioLines, BookOpen, Bookmark,
  Check, CheckCircle2, ChevronDown, CircleHelp, CloudOff, Copy, Info,
  Languages, Leaf, LoaderCircle, LockKeyhole, Mic, ShieldCheck, Smartphone, Sparkles,
  Volume2, Wifi, WifiOff, X,
} from 'lucide-react';
import { builtInWordCount, featuredPhrases, normalize, phrases, type Language, type Phrase } from './data/phrases';
import { recognizedVerbFormCount, translateVerbForm } from './data/verbForms';
import {
  CACHE_LIMIT, cacheTranslation, getCache, isTranslation, localTranslation, makeTranslation,
  readStored, SAVED_KEY, store, translationFromEntry, translationKey, translateOnline, type Translation, type TranslationAlternative,
} from './lib/translator';
import { createDictionaryIndex, dictionaryMeanings, isDictionaryTerm, spellingSuggestions } from './lib/dictionary';
import { DICTIONARY_ATTRIBUTION, DICTIONARY_LICENSE_URL, DICTIONARY_SOURCE_URL } from './lib/dictionaryPack';
import Phrasebook from './components/Phrasebook';
import Project from './components/Project';
import SchoolLogo from './components/SchoolLogo';
import ThemeSwitch from './components/ThemeSwitch';
import LearningHubNavigation, { LearningHubPanel, type HubView as Page } from './components/LearningHubNavigation';
import { useTheme } from './hooks/useTheme';
import { useDictionaryPack } from './hooks/useDictionaryPack';
import WordLibrary from './components/WordLibrary';

type Modal = 'offline' | 'privacy' | 'dictionary' | null;
type Toast = { message: string; kind: 'success' | 'notice' };
type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }> };

interface Recognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}
type RecognitionConstructor = new () => Recognition;

const languageNames: Record<Language, string> = { en: 'English', sw: 'Kiswahili' };
const MAX_LENGTH = 2000;
const CUSTOM_WORDS_KEY = 'lwanga-custom-words-v1';
const originLabels: Record<Translation['origin'], string> = {
  online: 'Online translation / MyMemory', phrasebook: 'Offline phrasebook',
  dictionary: 'Bilingual word dictionary', verb: 'Recognized verb form', custom: 'Your own dictionary entry', cache: 'Saved offline translation',
};

function Sunburst({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 52 52" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
        <path d="M26 4v11M26 37v11M4 26h11M37 26h11M10.5 10.5l7.8 7.8M33.7 33.7l7.8 7.8M10.5 41.5l7.8-7.8M33.7 18.3l7.8-7.8" />
      </g>
    </svg>
  );
}

function Hero() {
  return (
    <motion.section className="page-hero" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
      <div className="hero-eyebrow"><Languages size={15} strokeWidth={1.7} /><span>YOUR KISWAHILI LEARNING HUB</span></div>
      <h1>Lwanga <em>Translate</em><Sunburst className="hero-sun" /></h1>
      <p>English and Kiswahili. One place to learn, online or offline.</p>
    </motion.section>
  );
}

function LanguageSelector({ language, onChange, target = false }: { language: Language; onChange: (language: Language) => void; target?: boolean }) {
  return (
    <div className="language-selector">
      <span className={`language-symbol ${target ? 'target-symbol' : ''}`} aria-hidden="true">{language === 'en' ? 'Aa' : 'Sw'}</span>
      <span className="language-name">{languageNames[language]}</span>
      <ChevronDown size={16} className="language-chevron" />
      <span className="language-code" aria-hidden="true">{language === 'en' ? 'EN' : 'SW'}</span>
      <select value={language} onChange={event => onChange(event.target.value as Language)} aria-label={target ? 'Translation language' : 'Text language'}>
        <option value="en">English</option>
        <option value="sw">Kiswahili</option>
      </select>
    </div>
  );
}

function EmptyTranslation() {
  return (
    <div className="empty-translation">
      <p>Your translation will<br />appear here...</p>
      <svg className="translation-sketch" viewBox="0 0 200 110" fill="none" aria-hidden="true">
        <path d="M27 17h81q10 0 10 10v28q0 10-10 10H63L47 79l3-14H27q-10 0-10-10V27q0-10 10-10Z" stroke="currentColor" strokeWidth="1.25" />
        <path d="M103 46h69q10 0 10 10v25q0 10-10 10h-21l4 12-18-12h-34q-10 0-10-10V56q0-10 10-10Z" fill="var(--surface-target)" stroke="currentColor" strokeWidth="1.25" />
        <text x="65" y="48" textAnchor="middle" fill="currentColor" fontSize="22" fontFamily="Georgia,serif" fontStyle="italic">hello</text>
        <text x="137" y="77" textAnchor="middle" fill="currentColor" fontSize="20" fontFamily="Georgia,serif" fontStyle="italic">habari</text>
        <path d="m156 15 2 7m-13-2 6 4m20-4-6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function App() {
  const { theme, selectTheme } = useTheme();
  const dictionaryPack = useDictionaryPack();
  const [customWords, setCustomWords] = useState<Phrase[]>(() => {
    const value = readStored<unknown>(CUSTOM_WORDS_KEY, []);
    if (!Array.isArray(value)) return [];
    return value.filter((entry): entry is Phrase => !!entry && typeof entry === 'object' && typeof entry.en === 'string'
      && typeof entry.sw === 'string' && entry.en.trim().length > 0 && entry.sw.trim().length > 0 && entry.en.length <= 100 && entry.sw.length <= 100)
      .slice(0, 500).map(entry => ({ en: entry.en, sw: entry.sw, category: 'Words', provenance: 'custom', partOfSpeech: 'your entry', note: typeof entry.note === 'string' ? entry.note.slice(0, 200) : undefined }));
  });
  const dictionaryIndex = useMemo(() => createDictionaryIndex(dictionaryPack.entries, customWords), [dictionaryPack.entries, customWords]);
  const [page, setPage] = useState<Page>(() => {
    const hash = window.location.hash.slice(1);
    return hash === 'phrasebook' || hash === 'about' ? hash : 'translator';
  });
  const [source, setSource] = useState<Language>(() => {
    const draft = readStored<{ source?: Language }>('lwanga-draft-v1', {});
    return draft?.source === 'sw' ? 'sw' : 'en';
  });
  const [input, setInput] = useState(() => {
    const draft = readStored<{ input?: string }>('lwanga-draft-v1', {});
    return typeof draft?.input === 'string' ? draft.input.slice(0, MAX_LENGTH) : '';
  });
  const [result, setResult] = useState<Translation | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(navigator.onLine);
  const [forceOffline, setForceOffline] = useState(() => readStored<boolean>('lwanga-offline-mode', false) === true);
  const [offlineReady, setOfflineReady] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(() => window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true);
  const [offlinePreparing, setOfflinePreparing] = useState(import.meta.env.PROD && 'serviceWorker' in navigator);
  const [saved, setSaved] = useState<Translation[]>(() => {
    const data = readStored<unknown>(SAVED_KEY, []);
    return Array.isArray(data) ? data.filter(isTranslation).slice(0, 100).map(item => ({ ...item, id: translationKey(item.input, item.source) })) : [];
  });
  const [modal, setModal] = useState<Modal>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [swapCount, setSwapCount] = useState(0);
  const [speaking, setSpeaking] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmRemovePack, setConfirmRemovePack] = useState(false);
  const hubRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const requestRef = useRef(0);
  const recognitionRef = useRef<Recognition | null>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onlineAudioRef = useRef<HTMLAudioElement | null>(null);
  const onlineAudioQueueRef = useRef<string[]>([]);
  const onlineAudioIndexRef = useRef(0);

  const offline = forceOffline || !connected;
  const target: Language = source === 'en' ? 'sw' : 'en';
  const resultSaved = !!result && saved.some(item => item.id === result.id && item.output === result.output);
  const sourceSuggestion = useMemo(() => isDictionaryTerm(input) && !dictionaryMeanings(input, source, dictionaryIndex).length && !translateVerbForm(input, source)
    && (dictionaryMeanings(input, target, dictionaryIndex).length || translateVerbForm(input, target)) ? target : null, [input, source, target, dictionaryIndex]);
  const spellingHints = useMemo(() => error ? spellingSuggestions(input, source, dictionaryIndex) : [], [error, input, source, dictionaryIndex]);

  useEffect(() => {
    const update = () => setConnected(navigator.onLine);
    // Old section links still open their tool, then resolve to the single app URL.
    if (['#translator', '#phrasebook', '#about'].includes(window.location.hash)) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    }
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    if ('speechSynthesis' in window) window.speechSynthesis.getVoices();
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
      controllerRef.current?.abort();
      recognitionRef.current?.abort();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      onlineAudioRef.current?.pause();
      onlineAudioRef.current = null;
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  useEffect(() => {
    store('lwanga-draft-v1', { input, source });
  }, [input, source]);

  useEffect(() => {
    setCopied(false);
  }, [result?.id, result?.output]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    setConfirmRemovePack(false);
    if (modal && !dialog.open) dialog.showModal();
    else if (!modal && dialog.open) dialog.close();
  }, [modal]);

  useEffect(() => {
    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
      notify('Lwanga Translate is installed on this device.', 'success');
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  async function installApp() {
    if (installed) {
      notify('Lwanga Translate is already installed on this device.');
      return;
    }
    if (!installPrompt) {
      const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
      notify(isIOS
        ? 'To install: tap Share in Safari, then choose Add to Home Screen.'
        : 'To install: open your browser menu (⋮ or ⋯) and choose Install app or Add to Home screen. If you do not see it, open this site over HTTPS first.');
      return;
    }
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === 'accepted') notify('Follow your device prompt to finish installing.', 'success');
    setInstallPrompt(null);
  }

  useEffect(() => {
    if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;
    let active = true;
    const timeout = setTimeout(() => { if (active) setOfflinePreparing(false); }, 20000);
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`)
      .then(() => navigator.serviceWorker.ready)
      .then(() => { clearTimeout(timeout); if (active) { setOfflineReady(true); setOfflinePreparing(false); } })
      .catch(() => { clearTimeout(timeout); if (active) { setOfflineReady(false); setOfflinePreparing(false); } });
    return () => { active = false; clearTimeout(timeout); };
  }, []);

  function notify(message: string, kind: Toast['kind'] = 'notice') {
    setToast({ message, kind });
  }

  function navigate(next: Page) {
    if (next === page) return;
    const focusIsOnHubTab = !!document.activeElement?.closest('.hub-tabs');
    stopSpeech();
    recognitionRef.current?.abort();
    setRecording(false);
    setPage(next);
    if (hubRef.current && hubRef.current.getBoundingClientRect().top < 0) {
      hubRef.current.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }
    if (!focusIsOnHubTab) {
      requestAnimationFrame(() => {
        const element = next === 'translator' ? textareaRef.current : document.getElementById(`hub-panel-${next}`);
        element?.focus({ preventScroll: true });
      });
    }
  }

  function stopSpeech() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    onlineAudioQueueRef.current = [];
    onlineAudioIndexRef.current = 0;
    if (onlineAudioRef.current) {
      onlineAudioRef.current.onended = null;
      onlineAudioRef.current.onerror = null;
      onlineAudioRef.current.pause();
      onlineAudioRef.current.src = '';
      onlineAudioRef.current = null;
    }
    setSpeaking(null);
  }

  function playOnlineSwahili(text: string, key: string) {
    if (offline) {
      notify('The online Kiswahili voice needs an internet connection. Connect and turn off Offline mode to use it.');
      return;
    }
    // Google Translate's publicly accessible speech endpoint is used as a no-key fallback.
    // Keep chunks short so long paragraphs can be read in sequence.
    const chunks: string[] = [];
    let remaining = text.trim();
    while (remaining.length > 180) {
      const limit = remaining.slice(0, 180);
      const boundary = Math.max(limit.lastIndexOf('. '), limit.lastIndexOf('? '), limit.lastIndexOf('! '), limit.lastIndexOf(', '), limit.lastIndexOf(' '));
      const cut = boundary > 60 ? boundary + 1 : 180;
      chunks.push(remaining.slice(0, cut).trim());
      remaining = remaining.slice(cut).trim();
    }
    if (remaining) chunks.push(remaining);
    onlineAudioQueueRef.current = chunks;
    onlineAudioIndexRef.current = 0;
    setSpeaking(key);

    const playNext = () => {
      const currentIndex = onlineAudioIndexRef.current;
      const chunk = onlineAudioQueueRef.current[currentIndex];
      if (!chunk) {
        onlineAudioRef.current = null;
        setSpeaking(null);
        return;
      }
      const audio = new Audio();
      onlineAudioRef.current = audio;
      audio.preload = 'auto';
      const hosts = ['translate.google.com', 'translate.google.co.ug'];
      let hostIndex = 0;
      let triedCurrentHost = false;
      const tryHost = (index: number) => {
        hostIndex = index;
        triedCurrentHost = false;
        audio.src = `https://${hosts[index]}/translate_tts?ie=UTF-8&client=tw-ob&tl=sw&q=${encodeURIComponent(chunk)}`;
        const retryOrReport = () => {
          if (triedCurrentHost) return;
          triedCurrentHost = true;
          if (hostIndex + 1 < hosts.length) {
            tryHost(hostIndex + 1);
          } else {
            // Last-resort fallback: ask the browser/operating system to speak
            // the Kiswahili text with the Swahili locale instead of failing silently.
            // This may sound less natural if the device has no Swahili voice installed.
            const fallbackText = onlineAudioQueueRef.current.join(' ');
            stopSpeech();
            if ('speechSynthesis' in window && fallbackText) {
              const utterance = new SpeechSynthesisUtterance(fallbackText);
              utterance.lang = 'sw-TZ';
              utterance.rate = 0.82;
              utterance.onend = () => setSpeaking(null);
              utterance.onerror = () => {
                setSpeaking(null);
                notify('The online voice failed, and this device could not speak Kiswahili. Try Microsoft Edge or install a Kiswahili voice in your device settings.');
              };
              setSpeaking(key);
              window.speechSynthesis.speak(utterance);
            } else {
              notify('The online voice service is unavailable and this browser has no speech fallback. Your written translation is still available.');
            }
          }
        };
        audio.onerror = retryOrReport;
        audio.play().catch(retryOrReport);
      };
      audio.onended = () => {
        onlineAudioIndexRef.current += 1;
        playNext();
      };
      tryHost(0);
    };
    playNext();
  }

  function cancelRequest() {
    requestRef.current += 1;
    controllerRef.current?.abort();
    controllerRef.current = null;
    recognitionRef.current?.abort();
    setRecording(false);
    setBusy(false);
  }

  function changeInput(text: string) {
    cancelRequest();
    stopSpeech();
    setInput(text.slice(0, MAX_LENGTH));
    setResult(null);
    setError(null);
  }

  function changeDirection(next: Language) {
    if (next === source) return;
    cancelRequest();
    stopSpeech();
    recognitionRef.current?.abort();
    setSource(next);
    setError(null);
    setSwapCount(count => count + 1);
    if (result) {
      setInput(result.output.slice(0, MAX_LENGTH));
      if (result.output.length > MAX_LENGTH) {
        setResult(null);
        notify('The swapped text is longer than 2,000 characters. Review the shortened text before translating.');
      } else {
        const reversed = makeTranslation(result.output, result.input, next, result.origin);
        reversed.note = 'Languages swapped. Press Translate to look up the new direction and its possible meanings.';
        setResult(reversed);
      }
    } else {
      setResult(null);
    }
  }

  function toggleOffline() {
    const next = !forceOffline;
    cancelRequest();
    setForceOffline(next);
    store('lwanga-offline-mode', next);
    setError(null);
    notify(next ? 'Offline mode is on. Your dictionary, verb forms, and cached translations are ready.' : connected ? 'Online mode is on. Words and full sentences can use the online service.' : 'You are still offline. Your downloaded dictionary and saved words are available.');
  }

  async function translate(useOnline = false) {
    if (!input.trim() || busy) return;
    if (useOnline && connected && forceOffline) {
      setForceOffline(false);
      store('lwanga-offline-mode', false);
    }
    const text = input.trim();
    cancelRequest();
    const request = requestRef.current;
    setBusy(true);
    setError(null);
    setResult(null);
    const controller = new AbortController();
    controllerRef.current = controller;
    const timeout = setTimeout(() => controller.abort(), 45000);

    try {
      const local = useOnline ? null : localTranslation(text, source, dictionaryIndex);
      if (local) {
        cacheTranslation(local);
        setResult(local);
        return;
      }
      const remembered = !useOnline && saved.find(item => item.id === translationKey(text, source));
      if (remembered) {
        setResult(makeTranslation(text, remembered.output, source, 'cache'));
        return;
      }
      if (offline && !(useOnline && connected)) {
        throw new Error('This word or sentence is not in your offline library yet. Connect for an online translation, download the extended dictionary, or add a teacher-checked word.');
      }
      const translated = await translateOnline(text, source, controller.signal);
      if (requestRef.current === request) setResult(translated);
    } catch (cause) {
      if (requestRef.current !== request) return;
      if (controller.signal.aborted) {
        setError('The online service took too long. Please try again, or use a phrase from the offline phrasebook.');
      } else if (cause instanceof TypeError) {
        setError('We could not reach the online service. Check your connection, or keep learning with the offline phrasebook.');
      } else {
        setError(cause instanceof Error ? cause.message : 'Something went wrong. Please try again.');
      }
    } finally {
      clearTimeout(timeout);
      if (requestRef.current === request) {
        setBusy(false);
        controllerRef.current = null;
      }
    }
  }

  function usePhrase(phrase: Phrase) {
    cancelRequest();
    stopSpeech();
    const translation = translationFromEntry(phrase, phrase[source], source, dictionaryIndex);
    setInput(translation.input);
    setResult(translation);
    setError(null);
    cacheTranslation(translation);
    if (page !== 'translator') navigate('translator');
  }

  function useSaved(translation: Translation) {
    cancelRequest();
    stopSpeech();
    setSource(translation.source);
    setInput(translation.input);
    setResult({ ...translation, origin: 'cache' });
    setError(null);
    cacheTranslation(translation);
    navigate('translator');
  }

  function updateSaved(next: Translation[], success: string) {
    setSaved(next);
    if (store(SAVED_KEY, next)) notify(success, 'success');
    else notify('Saved for this visit, but browser storage is unavailable. This will not persist after closing the app.');
  }

  function saveResult() {
    if (!result) return;
    if (resultSaved) updateSaved(saved.filter(item => item.id !== result.id), 'Removed from your saved phrases.');
    else if (saved.length >= 100 && !saved.some(item => item.id === result.id)) notify('Your phrasebook has 100 saved phrases. Remove one before adding another.');
    else updateSaved([{ ...result, createdAt: Date.now() }, ...saved.filter(item => item.id !== result.id)], 'A word worth keeping. Added to your phrasebook.');
  }

  function selectMeaning(alternative: TranslationAlternative) {
    if (!result) return;
    stopSpeech();
    const next: Translation = { ...result, output: alternative.text, partOfSpeech: alternative.partOfSpeech,
      dictionarySource: alternative.dictionarySource ?? result.dictionarySource,
      origin: alternative.dictionarySource === 'custom' ? 'custom' : 'dictionary',
      note: alternative.note || 'Selected dictionary meaning. A short sentence gives better context online.',
      alternatives: [{ text: result.output, partOfSpeech: result.partOfSpeech, note: result.note, dictionarySource: result.dictionarySource }, ...(result.alternatives ?? []).filter(item => item.text !== alternative.text)] };
    setResult(next);
    cacheTranslation(next);
  }

  function addWord(en: string, sw: string, note: string): string | null {
    const english = en.trim().replace(/\s+/g, ' ');
    const swahili = sw.trim().replace(/\s+/g, ' ');
    if (!english || !swahili) return 'Add both the English and Kiswahili text.';
    if (english.length > 100 || swahili.length > 100 || /[<>\u0000-\u001f]/.test(english + swahili)) return 'Use a word or short phrase of up to 100 characters in each language.';
    if (customWords.some(item => normalize(item.en) === normalize(english) && normalize(item.sw) === normalize(swahili))) return 'This pair is already in your words.';
    if (customWords.length >= 500) return 'Your custom library has 500 entries. Remove one before adding another.';
    const next: Phrase[] = [{ en: english, sw: swahili, category: 'Words', provenance: 'custom', partOfSpeech: 'your entry', note: note.trim().slice(0, 200) || 'Your own entry. Check its meaning with your teacher.' }, ...customWords];
    setCustomWords(next);
    if (store(CUSTOM_WORDS_KEY, next)) notify('Your word is now available offline in both directions.', 'success');
    else notify('The word works for this visit, but browser storage is unavailable. It will not survive a reload.');
    return null;
  }

  function removeWord(entry: Phrase) {
    const next = customWords.filter(item => item.en !== entry.en || item.sw !== entry.sw);
    setCustomWords(next);
    if (store(CUSTOM_WORDS_KEY, next)) notify('Removed from your own words.', 'success');
    else notify('Removed for this visit only. Browser storage could not be updated.');
  }

  function lookupText(text: string) {
    changeInput(text);
    navigate('translator');
    requestAnimationFrame(() => textareaRef.current?.focus({ preventScroll: true }));
  }

  async function copyResult() {
    if (!result) return;
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(result.output);
      else {
        const element = document.createElement('textarea');
        element.value = result.output;
        element.style.position = 'fixed';
        element.style.opacity = '0';
        document.body.appendChild(element);
        element.select();
        const success = document.execCommand('copy');
        element.remove();
        if (!success) throw new Error('Clipboard not available');
      }
      setCopied(true);
      notify('Translation copied. Share a little understanding.', 'success');
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      notify('Copy is unavailable in this browser. Select the translated text to copy it manually.');
    }
  }

  function listen(text: string, language: Language, key: string) {
    if (!text.trim()) return;
    if (speaking === key) { stopSpeech(); return; }
    if (!('speechSynthesis' in window) && language === 'sw') {
      stopSpeech();
      playOnlineSwahili(text, key);
      return;
    }
    if (!('speechSynthesis' in window)) {
      notify('Audio is not supported in this browser. Your written translation is still available.');
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    let voice: SpeechSynthesisVoice | undefined;

    if (language === 'sw') {
      // Prefer a clearly female Kiswahili voice when the device exposes one.
      // Zuri and Rehema are commonly used names for female Kiswahili voices;
      // language-region tags remain the next-best signal. Browser voice names
      // are not standardized, so this is a preference, not a guarantee.
      const swahiliVoices = voices.filter(item => /^sw(?:-|$)/i.test(item.lang));
      const femaleName = /female|woman|zira|zuri|rehema|sara|sarah|linda|amina/i;
      const tanzania = (item: SpeechSynthesisVoice) => /^sw[-_]TZ(?:$|-)/i.test(item.lang);
      const kenya = (item: SpeechSynthesisVoice) => /^sw[-_]KE(?:$|-)/i.test(item.lang);
      voice =
        swahiliVoices.find(item => tanzania(item) && femaleName.test(item.name)) ??
        swahiliVoices.find(item => kenya(item) && femaleName.test(item.name)) ??
        swahiliVoices.find(item => femaleName.test(item.name)) ??
        swahiliVoices.find(tanzania) ??
        swahiliVoices.find(kenya) ??
        swahiliVoices[0];

      if (!voice) {
        stopSpeech();
        playOnlineSwahili(text, key);
        return;
      }
    } else {
      voice = voices.find(item => item.lang.toLowerCase().startsWith('en'));
    }

    if (offline && voice && !voice.localService) {
      notify('This audio voice needs an internet connection. Your written translation works offline.');
      return;
    }

    stopSpeech();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'sw' ? (voice?.lang || 'sw-TZ') : 'en-GB';
    if (voice) utterance.voice = voice;
    utterance.rate = language === 'sw' ? 0.82 : 0.85;
    utterance.onend = () => setSpeaking(null);
    utterance.onerror = event => {
      setSpeaking(null);
      if (event.error !== 'interrupted' && event.error !== 'canceled') notify('Audio could not play. Check the voices installed on your device.');
    };
    setSpeaking(key);
    window.speechSynthesis.speak(utterance);
  }

  function startVoiceInput() {
    if (recording) { recognitionRef.current?.stop(); return; }
    if (offline) { notify('Voice input needs an internet connection. You can still type and translate offline phrases.'); return; }
    const speechWindow = window as unknown as { SpeechRecognition?: RecognitionConstructor; webkitSpeechRecognition?: RecognitionConstructor };
    const Constructor = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!Constructor) { notify('Voice input is not supported in this browser. Try Chrome, or type your words instead.'); return; }
    const recognition = new Constructor();
    recognitionRef.current = recognition;
    recognition.lang = source === 'en' ? 'en-GB' : 'sw-KE';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = event => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) {
        cancelRequest();
        setInput(current => `${current.trim()}${current.trim() ? ' ' : ''}${transcript}`.slice(0, MAX_LENGTH));
        setResult(null);
        setError(null);
      }
    };
    recognition.onerror = event => {
      setRecording(false);
      if (event.error !== 'aborted') notify(event.error === 'not-allowed' ? 'Microphone permission was not granted. You can type your text instead.' : 'We could not hear your words. Please try again, or type them.');
    };
    recognition.onend = () => setRecording(false);
    try { stopSpeech(); recognition.start(); setRecording(true); }
    catch { notify('The microphone could not start. Please try typing your text.'); }
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="app-shell">
        <a className="skip-link" href="#main-content" onClick={event => {
          event.preventDefault();
          const main = document.getElementById('main-content');
          main?.focus({ preventScroll: true });
          main?.scrollIntoView({ block: 'start' });
        }}>Skip to main content</a>
        <header className="site-header">
          <div className="header-inner">
            <button className="school-brand" onClick={() => navigate('translator')} aria-label="Lwanga Translate home">
              <SchoolLogo />
              <span className="school-brand-text"><strong>St. Charles Lwanga S.S.</strong><span>THE KISWAHILI PROJECT</span></span>
            </button>
            <div className="header-actions">
              <ThemeSwitch theme={theme} onChange={selectTheme} />
              <button className="offline-header-button install-app-button" onClick={installApp} aria-label={installed ? 'App already installed' : 'Install Lwanga Translate'}><Smartphone size={16} strokeWidth={1.7} /><span>{installed ? 'Installed' : 'Install app'}</span></button>
              <button className="offline-header-button" onClick={() => setModal('offline')} aria-label="Learn about offline translation">
                <WifiOff size={17} strokeWidth={1.7} /><span>Works offline</span><span className="availability-dot" />
              </button>
            </div>
          </div>
        </header>

        <main id="main-content" className="main-container" tabIndex={-1}>
          <Hero />
          <div className="learning-hub" ref={hubRef}>
            <LearningHubNavigation view={page} onChange={navigate} />
            <LearningHubPanel view="translator" active={page === 'translator'}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}>
                  <div className="workspace-heading">
                    <h2>Let's find the right words.</h2>
                    <div className="mode-controls">
                      <span className={`connection-status ${offline ? 'is-offline' : ''}`}>{offline ? <WifiOff size={14} /> : <Wifi size={14} />}<span>{offline ? 'Offline' : 'Online'}</span></span>
                      <span className="control-divider" />
                      <label className="offline-toggle-label"><span>Offline mode</span><button type="button" className={`toggle-switch ${forceOffline ? 'is-on' : ''}`} role="switch" aria-checked={forceOffline} aria-label="Use offline mode" onClick={toggleOffline}><span /></button></label>
                      <button className="mode-help" aria-label="What works offline?" title="What works offline?" onClick={() => setModal('offline')}><CircleHelp size={15} /></button>
                    </div>
                  </div>

                  <section className="translation-workspace" aria-label="English and Kiswahili translator">
                    <div className="language-row">
                      <LanguageSelector language={source} onChange={changeDirection} />
                      <LanguageSelector language={target} onChange={language => changeDirection(language === 'en' ? 'sw' : 'en')} target />
                      <motion.button className="swap-button" aria-label="Swap English and Kiswahili" title="Swap languages" onClick={() => changeDirection(target)} animate={{ rotate: swapCount * 180 }} transition={{ type: 'spring', stiffness: 240, damping: 21 }}><ArrowDownUp size={18} className="swap-icon" /></motion.button>
                    </div>
                    <div className="editors-grid">
                      <div className="source-editor">
                        <div className="textarea-wrap">
                          <textarea ref={textareaRef} value={input} onChange={event => changeInput(event.target.value)} maxLength={MAX_LENGTH} placeholder={`Type something in ${languageNames[source]}...`} aria-label={`Text to translate from ${languageNames[source]}`} spellCheck={source === 'en'} lang={source} onKeyDown={event => {
                            if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); void translate(); }
                          }} />
                          {input && <button className="clear-input" onClick={() => { changeInput(''); textareaRef.current?.focus(); }} aria-label="Clear text" title="Clear text"><X size={17} /></button>}
                        </div>
                        <div className="editor-tools">
                          <div className="tool-buttons">
                            <button className={`icon-button ${recording ? 'recording' : ''}`} onClick={startVoiceInput} aria-label={recording ? 'Stop voice input' : `Speak in ${languageNames[source]}`} title={recording ? 'Stop recording' : 'Voice input'}>{recording ? <AudioLines size={19} /> : <Mic size={18} />}</button>
                            <span className="tool-divider" />
                            <button className={`icon-button ${speaking === 'input' ? 'is-active' : ''}`} disabled={!input.trim()} onClick={() => listen(input, source, 'input')} aria-label={speaking === 'input' ? 'Stop reading source text' : 'Listen to source text'} title="Listen">{speaking === 'input' ? <AudioLines size={19} /> : <Volume2 size={19} />}</button>
                          </div>
                          <span className={`character-count ${input.length >= MAX_LENGTH ? 'at-limit' : ''}`}>{input.length.toLocaleString()} <span>/ 2,000</span></span>
                        </div>
                      </div>

                      <div className="target-editor" aria-live="polite" aria-busy={busy}>
                        <div className="translation-content">
                          <AnimatePresence mode="wait" initial={false}>
                            {busy ? (
                              <motion.div key="loading" className="translation-loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><LoaderCircle size={25} className="spin" /><p>Finding the right words...</p><span>A little understanding is on its way.</span></motion.div>
                            ) : error ? (
                              <motion.div key="error" className="translation-error" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                <CloudOff size={24} strokeWidth={1.5} /><h3>{offline ? 'Not in this offline library yet.' : 'A small pause in the conversation.'}</h3><p>{error}</p>
                                {spellingHints.length > 0 && <div className="spelling-hints"><span>Did you mean:</span>{spellingHints.map(word => <button key={word} className="text-link" onClick={() => changeInput(word)}>{word}</button>)}</div>}
                                <div className="translation-recovery">{connected && <button className="text-link" onClick={() => void translate(true)}>Try online translation <ArrowRight size={15} /></button>}<button className="text-link" onClick={() => navigate('phrasebook')}>Open word library <ArrowUpRight size={14} /></button></div>
                              </motion.div>
                            ) : result ? (
                              <motion.div key={result.id} className="translation-result" initial={{ opacity: 0, y: 7, filter: 'blur(3px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                                <p className="translated-text" lang={target}>{result.output}</p><span className="result-origin"><CheckCircle2 size={13} />{originLabels[result.origin]}{result.partOfSpeech ? ` / ${result.partOfSpeech}` : ''}</span>
                                {result.note && <p className="translation-note">{result.note}</p>}
                                {!!result.alternatives?.length && <details className="meaning-alternatives"><summary>Other meanings ({result.alternatives.length}) <ChevronDown size={14} /></summary><div>{result.alternatives.map(alternative => <button key={alternative.text} onClick={() => selectMeaning(alternative)}><span lang={target}>{alternative.text}</span>{alternative.partOfSpeech && <small>{alternative.partOfSpeech}</small>}<ArrowUpRight size={13} /></button>)}</div></details>}
                                {result.dictionarySource === 'extended' && <button className="dictionary-source-credit text-link" onClick={() => setModal('dictionary')}>NooJ / Kamusi dictionary credits <ArrowUpRight size={11} /></button>}
                                {result.origin !== 'online' && connected && <button className="online-lookup-link text-link" onClick={() => void translate(true)}>Try an online lookup <ArrowUpRight size={12} /></button>}
                              </motion.div>
                            ) : <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><EmptyTranslation /></motion.div>}
                          </AnimatePresence>
                        </div>
                        <div className="editor-tools target-tools">
                          <button className={`icon-button ${speaking === 'output' ? 'is-active' : ''}`} disabled={!result} onClick={() => result && listen(result.output, target, 'output')} aria-label={speaking === 'output' ? 'Stop reading translation' : 'Listen to translation'} title="Listen to translation">{speaking === 'output' ? <AudioLines size={19} /> : <Volume2 size={19} />}</button>
                          <div className="tool-buttons">
                            <button className={`icon-button ${copied ? 'is-active' : ''}`} disabled={!result} onClick={() => void copyResult()} aria-label="Copy translation" title="Copy translation">{copied ? <Check size={18} /> : <Copy size={17} />}</button>
                            <button className={`icon-button ${resultSaved ? 'is-active' : ''}`} disabled={!result} onClick={saveResult} aria-label={resultSaved ? 'Remove translation from saved phrases' : 'Save translation to phrasebook'} title={resultSaved ? 'Saved to phrasebook' : 'Save to phrasebook'}><Bookmark size={18} fill={resultSaved ? 'currentColor' : 'none'} /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="workspace-action-bar">
                      <p><Sparkles size={16} strokeWidth={1.5} /><span>{offline ? 'A familiar phrase can still open a new door.' : 'A word, a phrase, a whole new conversation.'}</span></p>
                      <motion.button className="translate-button" onClick={() => void translate()} disabled={!input.trim() || busy} whileHover={!busy && input.trim() ? { scale: 1.025 } : {}} whileTap={{ scale: 0.98 }}>{busy ? <><LoaderCircle size={17} className="spin" />Translating</> : <>Translate <ArrowRight size={18} /></>}</motion.button>
                    </div>
                  </section>

                  <div className="workspace-footnote">
                    <span><ShieldCheck size={14} />{offline ? 'Dictionary words and known verb forms translate on your device.' : 'Type any word or sentence. Unlisted text uses the online service.'}</span>
                    <span className="keyboard-hint"><kbd>Ctrl</kbd><span>+</span><kbd>Enter</kbd><span>to translate</span></span>
                  </div>
                  {sourceSuggestion && <p className="language-suggestion"><Info size={14} /><span>This looks like {languageNames[sourceSuggestion]}.</span><button className="text-link" onClick={() => changeDirection(sourceSuggestion)}>Switch text language <ArrowRight size={13} /></button></p>}

                  <section className="starter-phrases" aria-labelledby="starter-heading">
                    <div className="section-heading"><div><h2 id="starter-heading">A good place to start</h2><p>Small words. Meaningful connections.</p></div><button className="text-link" onClick={() => navigate('phrasebook')}>Explore phrasebook <ArrowUpRight size={16} /></button></div>
                    <div className="featured-phrase-grid">
                      {featuredPhrases.map((phrase, index) => (
                        <motion.button key={phrase.en} className="featured-phrase" onClick={() => usePhrase(phrase)} whileHover={{ y: -3 }} whileTap={{ scale: 0.985 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.28 + index * 0.06 }}>
                          <span><strong>{phrase[source]}</strong><span>{phrase[target]}</span></span><ArrowUpRight size={17} strokeWidth={1.5} />
                        </motion.button>
                      ))}
                    </div>
                  </section>
                  <WordLibrary pack={dictionaryPack} offline={offline} onDetails={() => setModal('dictionary')} />
                </motion.div>
            </LearningHubPanel>
            <LearningHubPanel view="phrasebook" active={page === 'phrasebook'}>
              <Phrasebook saved={saved} entries={dictionaryIndex.entries} onLookup={lookupText} onAddWord={addWord} onRemoveWord={removeWord} onUsePhrase={usePhrase} onUseSaved={useSaved} onRemoveSaved={id => updateSaved(saved.filter(item => item.id !== id), 'Removed from your saved phrases.')} onListen={(text, language) => listen(text, language, `phrase:${text}`)} />
              <WordLibrary pack={dictionaryPack} offline={offline} onDetails={() => setModal('dictionary')} />
            </LearningHubPanel>
            <LearningHubPanel view="about" active={page === 'about'}>
              <Project onTranslate={() => navigate('translator')} onOfflineHelp={() => setModal('offline')} />
            </LearningHubPanel>
          </div>
        </main>

        <footer className="site-footer"><div className="footer-inner"><div className="footer-project"><Leaf size={20} strokeWidth={1.4} /><span>A St. Charles Lwanga S.S. Kiswahili project.<small>Made for learning. Made to connect.</small></span></div><div className="footer-links"><button onClick={() => navigate('about')}>About the project</button><span aria-hidden="true">/</span><button onClick={() => setModal('privacy')}>Privacy & credits</button></div></div></footer>

        <dialog ref={dialogRef} className="help-dialog" aria-labelledby="dialog-heading" onCancel={event => { event.preventDefault(); setModal(null); }} onClick={event => { if (event.target === event.currentTarget) setModal(null); }}>
          <div className="dialog-content">
            <button className="dialog-close icon-button" onClick={() => setModal(null)} aria-label="Close dialog"><X size={20} /></button>
            {modal === 'dictionary' ? <>
              <BookOpen className="dialog-icon" size={29} strokeWidth={1.5} /><span className="section-kicker">WORDS, WITH ROOM TO GROW</span><h2 id="dialog-heading">More meanings.<br /><em>Better understanding.</em></h2>
              <p>No dictionary contains every possible word. This library broadens word coverage; whole sentences, slang, specialist terms, and unfamiliar forms may still need internet.</p>
              <div className="dialog-detail"><CheckCircle2 size={19} /><div><h3>{builtInWordCount.toLocaleString()} built-in word pairs</h3><p>School, science, technology, health, food, nature, travel, and everyday vocabulary. Plus {recognizedVerbFormCount.toLocaleString()} explicitly supported Swahili personal verb forms and your {customWords.length} custom entries.</p></div></div>
              <WordLibrary pack={dictionaryPack} offline={offline} onDetails={() => setModal(null)} showDetails={false} />
              <div className="privacy-details dictionary-credits"><h3>Source & license</h3><p>{DICTIONARY_ATTRIBUTION} Source: <a href={DICTIONARY_SOURCE_URL} target="_blank" rel="noreferrer">NooJ Kiswahili Module <ArrowUpRight size={12} /></a>. The extended data is <a href={DICTIONARY_LICENSE_URL} target="_blank" rel="noreferrer">CC BY-NC-SA 3.0 <ArrowUpRight size={12} /></a> for non-commercial use. This school project parses and deduplicates entries, displays verb roots as infinitives, and marks agreement-dependent adjective stems with a hyphen. Adapted data retains the same license. <a href={`${import.meta.env.BASE_URL}dictionary-notice.txt`} target="_blank" rel="noreferrer">Full attribution notice <ArrowUpRight size={12} /></a>.</p><h3>Meanings are not unique words</h3><p>Several senses can belong to the same word. Download counts show dictionary entries, not a claim of complete English or Kiswahili coverage. Use a short sentence online to resolve context.</p><h3>Stored on this device</h3><p>The extended data downloads once, about 2 MB, and is saved in browser storage. Clearing site data removes it. If storage is restricted, the app will tell you that the pack is available for this visit only.</p></div>
              {dictionaryPack.entries.length > 0 && <div className="remove-library">{confirmRemovePack ? <><p>Remove the extended dictionary from this device? Your own words and saved translations will stay.</p><div><button className="text-link" onClick={() => setConfirmRemovePack(false)}>Keep library</button><button className="secondary-button" onClick={() => { void dictionaryPack.remove(); setConfirmRemovePack(false); }}>Remove extended library</button></div></> : <button className="text-link" onClick={() => setConfirmRemovePack(true)}>Remove downloaded dictionary</button>}</div>}
              <button className="primary-button" onClick={() => { setModal(null); navigate('phrasebook'); }}>Explore words & phrases <ArrowRight size={17} /></button>
            </> : modal === 'offline' ? <>
              <WifiOff className="dialog-icon" size={29} strokeWidth={1.5} />
              <span className="section-kicker">LEARN ANYWHERE</span><h2 id="dialog-heading">No Wi-Fi?<br /><em>No worries.</em></h2>
              <p>Your learning does not have to stop when your connection does.</p>
              <div className="dialog-detail"><BookOpen size={19} /><div><h3>{phrases.length.toLocaleString()} built-in words & phrases</h3><p>Available in both directions, plus {recognizedVerbFormCount.toLocaleString()} supported personal verb forms. {dictionaryPack.persisted ? `${dictionaryPack.entries.length.toLocaleString()} extended meanings are also saved on this device.` : 'Download the extended school dictionary for thousands more meanings.'}</p><button className="text-link" onClick={() => setModal('dictionary')}>Expand offline vocabulary <ArrowUpRight size={14} /></button></div></div>
              <div className="dialog-detail"><Bookmark size={19} /><div><h3>Your translations, remembered</h3><p>Up to {CACHE_LIMIT.toLocaleString()} actual translation results are cached on this device, in their original direction. You have {saved.length} saved {saved.length === 1 ? 'phrase' : 'phrases'}, {customWords.length} custom word pairs, and {getCache().length} cached results.</p></div></div>
              <div className="dialog-detail"><Info size={19} /><div><h3>Unfamiliar sentences need a connection</h3><p>Offline mode is a dictionary and a phrase library, not a full translation model. It never guesses a sentence by simply replacing each word. Voice input and some audio voices also need internet.</p></div></div>
              <div className={`offline-readiness ${offlineReady ? 'ready' : ''}`} role="status">{offlineReady ? <CheckCircle2 size={17} /> : offlinePreparing ? <LoaderCircle size={17} className="spin" /> : <Info size={17} />}<span>{offlineReady ? 'This app is cached and ready for your next offline visit.' : offlinePreparing ? 'Preparing the app for offline visits. Please keep this page open for a moment.' : import.meta.env.PROD ? 'The phrasebook works in this visit. Offline reload is not ready; reopen online in a supported browser on HTTPS.' : 'The phrasebook works offline now. Open the published app online once to enable offline visits.'}</span></div>
              <button className="primary-button" onClick={() => { setModal(null); navigate('phrasebook'); }}>Open the phrasebook <ArrowRight size={17} /></button>
            </> : <>
              <LockKeyhole className="dialog-icon" size={28} strokeWidth={1.5} /><span className="section-kicker">A LITTLE TRANSPARENCY</span><h2 id="dialog-heading">Your words.<br /><em>Your choice.</em></h2>
              <div className="privacy-details"><h3>Online translation</h3><p>Unlisted text and explicit online lookups are sent to <a href="https://mymemory.translated.net/" target="_blank" rel="noreferrer">MyMemory <ArrowUpRight size={12} /></a>. Anonymous use is limited to 5,000 characters per day. Do not send passwords or sensitive information. Words kept unchanged by the service are flagged rather than presented as a guaranteed translation.</p><h3>On your device</h3><p>Dictionary words, phrases, recognized verb forms, and your own entries are translated locally. Drafts, saved phrases, and actual translation results are kept in browser storage, not in a school account. Clearing site data removes them.</p><h3>Extended dictionary credits</h3><p>{DICTIONARY_ATTRIBUTION} The optional <a href={DICTIONARY_SOURCE_URL} target="_blank" rel="noreferrer">extended dictionary <ArrowUpRight size={12} /></a> is for non-commercial use under <a href={DICTIONARY_LICENSE_URL} target="_blank" rel="noreferrer">CC BY-NC-SA 3.0 <ArrowUpRight size={12} /></a>. We parse and deduplicate its data, display verb infinitives, and mark adjective stems. Downloading contacts GitHub; your input text is not sent with the dictionary download.</p><h3>A learning companion</h3><p>There is no guarantee of every word or perfect accuracy. Context, spelling, and noun-class agreement matter. Check important work with your teacher. Audio depends on installed device voices.</p><h3>Our school identity</h3><p>This is a Kiswahili project for St. Charles Lwanga S.S. The original school crest is sourced from the school website and cached for offline use.</p></div>
              <button className="primary-button" onClick={() => setModal(null)}>Back to learning <ArrowRight size={17} /></button>
            </>}
          </div>
        </dialog>

        <AnimatePresence>{toast && <motion.div className="toast" style={{ x: '-50%' }} role="status" aria-live="polite" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.2 }}>{toast.kind === 'success' ? <CheckCircle2 size={18} /> : <Info size={18} />}<span>{toast.message}</span><button onClick={() => setToast(null)} aria-label="Dismiss notification"><X size={16} /></button></motion.div>}</AnimatePresence>
      </div>
    </MotionConfig>
  );
}
