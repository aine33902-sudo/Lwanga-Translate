import type { Language } from './phrases';

type Verb = [infinitive: string, present: string, thirdPerson: string, past: string, participle: string, perfect: string];
const verbs: Verb[] = [
  ['kula', 'eat', 'eats', 'ate', 'eating', 'eaten'],
  ['kunywa', 'drink', 'drinks', 'drank', 'drinking', 'drunk'],
  ['kwenda', 'go', 'goes', 'went', 'going', 'gone'],
  ['kuja', 'come', 'comes', 'came', 'coming', 'come'],
  ['kulala', 'sleep', 'sleeps', 'slept', 'sleeping', 'slept'],
  ['kusoma', 'read', 'reads', 'read', 'reading', 'read'],
  ['kuandika', 'write', 'writes', 'wrote', 'writing', 'written'],
  ['kusikia', 'hear', 'hears', 'heard', 'hearing', 'heard'],
  ['kuona', 'see', 'sees', 'saw', 'seeing', 'seen'],
  ['kusema', 'say', 'says', 'said', 'saying', 'said'],
  ['kuzungumza', 'speak', 'speaks', 'spoke', 'speaking', 'spoken'],
  ['kutembea', 'walk', 'walks', 'walked', 'walking', 'walked'],
  ['kukimbia', 'run', 'runs', 'ran', 'running', 'run'],
  ['kucheza', 'play', 'plays', 'played', 'playing', 'played'],
  ['kuimba', 'sing', 'sings', 'sang', 'singing', 'sung'],
  ['kucheka', 'laugh', 'laughs', 'laughed', 'laughing', 'laughed'],
  ['kulia', 'cry', 'cries', 'cried', 'crying', 'cried'],
  ['kupika', 'cook', 'cooks', 'cooked', 'cooking', 'cooked'],
  ['kuosha', 'wash', 'washes', 'washed', 'washing', 'washed'],
  ['kununua', 'buy', 'buys', 'bought', 'buying', 'bought'],
  ['kuuza', 'sell', 'sells', 'sold', 'selling', 'sold'],
  ['kulipa', 'pay', 'pays', 'paid', 'paying', 'paid'],
  ['kuleta', 'bring', 'brings', 'brought', 'bringing', 'brought'],
  ['kuchukua', 'take', 'takes', 'took', 'taking', 'taken'],
  ['kutoa', 'give', 'gives', 'gave', 'giving', 'given'],
  ['kutuma', 'send', 'sends', 'sent', 'sending', 'sent'],
  ['kupokea', 'receive', 'receives', 'received', 'receiving', 'received'],
  ['kusaidia', 'help', 'helps', 'helped', 'helping', 'helped'],
  ['kusubiri', 'wait', 'waits', 'waited', 'waiting', 'waited'],
  ['kujaribu', 'try', 'tries', 'tried', 'trying', 'tried'],
  ['kufungua', 'open', 'opens', 'opened', 'opening', 'opened'],
  ['kufunga', 'close', 'closes', 'closed', 'closing', 'closed'],
  ['kujenga', 'build', 'builds', 'built', 'building', 'built'],
  ['kuvunja', 'break', 'breaks', 'broke', 'breaking', 'broken'],
  ['kukata', 'cut', 'cuts', 'cut', 'cutting', 'cut'],
  ['kutumia', 'use', 'uses', 'used', 'using', 'used'],
  ['kuanza', 'begin', 'begins', 'began', 'beginning', 'begun'],
  ['kumaliza', 'finish', 'finishes', 'finished', 'finishing', 'finished'],
  ['kuchagua', 'choose', 'chooses', 'chose', 'choosing', 'chosen'],
  ['kupata', 'get', 'gets', 'got', 'getting', 'got'],
  ['kupoteza', 'lose', 'loses', 'lost', 'losing', 'lost'],
  ['kushinda', 'win', 'wins', 'won', 'winning', 'won'],
  ['kukutana', 'meet', 'meets', 'met', 'meeting', 'met'],
  ['kurudi', 'return', 'returns', 'returned', 'returning', 'returned'],
  ['kuondoka', 'leave', 'leaves', 'left', 'leaving', 'left'],
  ['kuingia', 'enter', 'enters', 'entered', 'entering', 'entered'],
  ['kusafiri', 'travel', 'travels', 'travelled', 'travelling', 'travelled'],
  ['kufundisha', 'teach', 'teaches', 'taught', 'teaching', 'taught'],
  ['kuuliza', 'ask', 'asks', 'asked', 'asking', 'asked'],
  ['kujibu', 'answer', 'answers', 'answered', 'answering', 'answered'],
  ['kueleza', 'explain', 'explains', 'explained', 'explaining', 'explained'],
  ['kutafsiri', 'translate', 'translates', 'translated', 'translating', 'translated'],
  ['kuhesabu', 'count', 'counts', 'counted', 'counting', 'counted'],
  ['kuchora', 'draw', 'draws', 'drew', 'drawing', 'drawn'],
  ['kusafisha', 'clean', 'cleans', 'cleaned', 'cleaning', 'cleaned'],
  ['kufikiri', 'think', 'thinks', 'thought', 'thinking', 'thought'],
  ['kukumbuka', 'remember', 'remembers', 'remembered', 'remembering', 'remembered'],
  ['kusahau', 'forget', 'forgets', 'forgot', 'forgetting', 'forgotten'],
  ['kuamka', 'wake', 'wakes', 'woke', 'waking', 'woken'],
  ['kuogelea', 'swim', 'swims', 'swam', 'swimming', 'swum'],
  ['kuendesha', 'drive', 'drives', 'drove', 'driving', 'driven'],
  ['kuruka', 'jump', 'jumps', 'jumped', 'jumping', 'jumped'],
  ['kuanguka', 'fall', 'falls', 'fell', 'falling', 'fallen'],
  ['kubeba', 'carry', 'carries', 'carried', 'carrying', 'carried'],
  ['kushika', 'hold', 'holds', 'held', 'holding', 'held'],
  ['kusukuma', 'push', 'pushes', 'pushed', 'pushing', 'pushed'],
  ['kuvuta', 'pull', 'pulls', 'pulled', 'pulling', 'pulled'],
  ['kutupa', 'throw', 'throws', 'threw', 'throwing', 'thrown'],
  ['kulinda', 'protect', 'protects', 'protected', 'protecting', 'protected'],
  ['kutafuta', 'search', 'searches', 'searched', 'searching', 'searched'],
  ['kuhifadhi', 'save', 'saves', 'saved', 'saving', 'saved'],
  ['kuishi', 'live', 'lives', 'lived', 'living', 'lived'],
  ['kukua', 'grow', 'grows', 'grew', 'growing', 'grown'],
  ['kufa', 'die', 'dies', 'died', 'dying', 'died'],
  ['kujifunza', 'learn', 'learns', 'learned', 'learning', 'learned'],
  ['kuelewa', 'understand', 'understands', 'understood', 'understanding', 'understood'],
  ['kujua', 'know', 'knows', 'knew', 'knowing', 'known'],
  ['kutaka', 'want', 'wants', 'wanted', 'wanting', 'wanted'],
  ['kuhitaji', 'need', 'needs', 'needed', 'needing', 'needed'],
  ['kupenda', 'love', 'loves', 'loved', 'loving', 'loved'],
  ['kuchukia', 'hate', 'hates', 'hated', 'hating', 'hated'],
  ['kuamini', 'believe', 'believes', 'believed', 'believing', 'believed'],
  ['kusikiliza', 'listen', 'listens', 'listened', 'listening', 'listened'],
  ['kufanya', 'do', 'does', 'did', 'doing', 'done'],
];

const subjects = [
  { prefix: 'ni', negative: 'si', english: ['I'], be: 'am', have: 'have' },
  { prefix: 'u', negative: 'hu', english: ['You'], be: 'are', have: 'have' },
  { prefix: 'a', negative: 'ha', english: ['He', 'She'], be: 'is', have: 'has' },
  { prefix: 'tu', negative: 'hatu', english: ['We'], be: 'are', have: 'have' },
  { prefix: 'm', negative: 'ham', english: ['You all'], be: 'are', have: 'have' },
  { prefix: 'wa', negative: 'hawa', english: ['They'], be: 'are', have: 'have' },
];
const stativeVerbs = new Set(['understand', 'know', 'want', 'need', 'love', 'hate', 'believe']);

const englishForms = new Map<string, string>();
const swahiliForms = new Map<string, string>();
const normalizeForm = (text: string) => text.normalize('NFKC').toLowerCase().replace(/[\u2018\u2019]/g, "'").replace(/\s+/g, ' ').trim().replace(/[.!?]+$/g, '');

for (const [infinitive, present, thirdPerson, past, participle, perfect] of verbs) {
  const stem = infinitive === 'kwenda' ? 'enda' : infinitive.slice(2);
  const monosyllabic = ['kula', 'kunywa', 'kuja', 'kufa'].includes(infinitive);
  const tenseStem = monosyllabic ? infinitive : stem;
  for (const subject of subjects) {
    const forms = [
      { marker: 'na', phrase: (who: string) => stativeVerbs.has(present) ? `${who} ${subject.prefix === 'a' ? thirdPerson : present}` : `${who} ${subject.be} ${participle}`, alternate: (who: string) => `${who} ${subject.prefix === 'a' ? thirdPerson : present}` },
      { marker: 'li', phrase: (who: string) => `${who} ${past}` },
      { marker: 'ta', phrase: (who: string) => `${who} will ${present}` },
      { marker: 'me', phrase: (who: string) => `${who} ${subject.have} ${perfect}` },
    ];
    for (const form of forms) {
      const sw = `${subject.prefix}${form.marker}${tenseStem}`;
      const who = subject.prefix === 'a' ? 'He or she' : subject.english[0];
      swahiliForms.set(sw, form.phrase(who));
      if (infinitive === 'kwenda') swahiliForms.set(`${subject.prefix}${form.marker}kwenda`, form.phrase(who));
      for (const englishSubject of subject.english) {
        const full = form.phrase(englishSubject);
        if (!englishForms.has(normalizeForm(full))) englishForms.set(normalizeForm(full), sw);
        if (form.alternate) {
          const alternate = form.alternate(englishSubject);
          if (!englishForms.has(normalizeForm(alternate))) englishForms.set(normalizeForm(alternate), sw);
        }
      }
    }
    const negativePresent = stem.endsWith('a') ? `${stem.slice(0, -1)}i` : stem;
    const negatives = [
      { sw: `${subject.negative}${negativePresent}`, phrase: (who: string) => `${who} ${subject.prefix === 'a' ? 'does' : 'do'} not ${present}` },
      { sw: `${subject.negative}ku${stem}`, phrase: (who: string) => `${who} did not ${present}` },
      { sw: `${subject.negative}ta${tenseStem}`, phrase: (who: string) => `${who} will not ${present}` },
    ];
    for (const form of negatives) {
      swahiliForms.set(form.sw, form.phrase(subject.prefix === 'a' ? 'He or she' : subject.english[0]));
      for (const who of subject.english) {
        const en = form.phrase(who);
        englishForms.set(normalizeForm(en), form.sw);
        const contracted = en.replace('do not', "don't").replace('does not', "doesn't").replace('did not', "didn't").replace('will not', "won't");
        englishForms.set(normalizeForm(contracted), form.sw);
      }
    }
  }
}

export const recognizedVerbFormCount = swahiliForms.size;

// Restricted, explicit personal verb forms only. Do not guess objects, relatives, or noun-class agreement.
export function translateVerbForm(text: string, source: Language): string | null {
  return (source === 'en' ? englishForms : swahiliForms).get(normalizeForm(text)) ?? null;
}