import { expandedVocabulary } from './vocabulary';

export type Language = 'en' | 'sw';
export type PhraseCategory = 'Greetings' | 'Classroom' | 'Everyday' | 'Travel' | 'Words';

export interface Phrase {
  en: string;
  sw: string;
  category: PhraseCategory;
  enAliases?: string[];
  swAliases?: string[];
  topic?: string;
  partOfSpeech?: string;
  note?: string;
  provenance?: 'school' | 'extended' | 'custom';
}

const greetings: Phrase[] = [
  { en: 'Hello', sw: 'Habari', category: 'Greetings', enAliases: ['hi', 'hey'], swAliases: ['jambo', 'hujambo'] },
  { en: 'Thank you', sw: 'Asante', category: 'Greetings', enAliases: ['thanks'] },
  { en: 'How are you?', sw: 'Habari yako?', category: 'Greetings', enAliases: ['how are you doing'], swAliases: ['habari gani'] },
  { en: 'Welcome', sw: 'Karibu', category: 'Greetings' },
  { en: 'Good morning', sw: 'Habari za asubuhi', category: 'Greetings', swAliases: ['habari ya asubuhi'] },
  { en: 'Good afternoon', sw: 'Habari za mchana', category: 'Greetings', swAliases: ['habari ya mchana'] },
  { en: 'Good evening', sw: 'Habari za jioni', category: 'Greetings', swAliases: ['habari ya jioni'] },
  { en: 'Good night', sw: 'Usiku mwema', category: 'Greetings' },
  { en: 'Goodbye', sw: 'Kwaheri', category: 'Greetings', enAliases: ['bye', 'farewell'] },
  { en: 'See you later', sw: 'Tutaonana baadaye', category: 'Greetings' },
  { en: 'See you tomorrow', sw: 'Tutaonana kesho', category: 'Greetings' },
  { en: 'I am fine', sw: 'Sijambo', category: 'Greetings', enAliases: ["I'm fine", 'I am doing well'] },
  { en: 'Very well', sw: 'Vizuri sana', category: 'Greetings' },
  { en: 'Thank you very much', sw: 'Asante sana', category: 'Greetings', enAliases: ['thanks a lot', 'thanks very much'] },
  { en: 'You are welcome', sw: 'Karibu', category: 'Greetings', enAliases: ["you're welcome"] },
  { en: 'Please', sw: 'Tafadhali', category: 'Greetings' },
  { en: 'Sorry', sw: 'Samahani', category: 'Greetings', enAliases: ['I am sorry', "I'm sorry", 'excuse me'] },
  { en: 'What is your name?', sw: 'Unaitwa nani?', category: 'Greetings', enAliases: ["what's your name"], swAliases: ['jina lako ni nani'] },
  { en: 'Nice to meet you', sw: 'Nimefurahi kukutana nawe', category: 'Greetings' },
  { en: 'How is your family?', sw: 'Familia yako inaendeleaje?', category: 'Greetings' },
  { en: 'Hello, how are you?', sw: 'Habari, unaendeleaje?', category: 'Greetings', enAliases: ['hi how are you'] },
  { en: 'Hello world', sw: 'Salamu dunia', category: 'Greetings' },
  { en: 'Peace be with you', sw: 'Amani iwe nawe', category: 'Greetings' },
  { en: 'Have a good day', sw: 'Uwe na siku njema', category: 'Greetings' },
  { en: 'Happy birthday', sw: 'Heri ya siku ya kuzaliwa', category: 'Greetings' },
  { en: 'Congratulations', sw: 'Hongera', category: 'Greetings' },
  { en: 'Good luck', sw: 'Kila la heri', category: 'Greetings' },
];

const classroom: Phrase[] = [
  { en: 'Welcome to our school', sw: 'Karibu katika shule yetu', category: 'Classroom' },
  { en: 'Welcome to St. Charles Lwanga S.S.', sw: 'Karibu katika Shule ya Sekondari ya St. Charles Lwanga.', category: 'Classroom' },
  { en: 'The Kiswahili project', sw: 'Mradi wa Kiswahili', category: 'Classroom' },
  { en: 'We are learning Kiswahili', sw: 'Tunajifunza Kiswahili', category: 'Classroom', enAliases: ['we are learning Swahili'] },
  { en: 'We are learning English', sw: 'Tunajifunza Kiingereza', category: 'Classroom' },
  { en: 'I am a student', sw: 'Mimi ni mwanafunzi', category: 'Classroom', enAliases: ["I'm a student"] },
  { en: 'I am a teacher', sw: 'Mimi ni mwalimu', category: 'Classroom', enAliases: ["I'm a teacher"] },
  { en: 'I am learning Kiswahili', sw: 'Ninajifunza Kiswahili', category: 'Classroom', enAliases: ['I am learning Swahili', "I'm learning Swahili", "I'm learning Kiswahili"] },
  { en: 'I am learning English', sw: 'Ninajifunza Kiingereza', category: 'Classroom' },
  { en: 'I like learning', sw: 'Ninapenda kujifunza', category: 'Classroom' },
  { en: 'I am going to school', sw: 'Ninaenda shuleni', category: 'Classroom', enAliases: ["I'm going to school"] },
  { en: 'This is my school', sw: 'Hii ni shule yangu', category: 'Classroom' },
  { en: 'I love my school', sw: 'Ninapenda shule yangu', category: 'Classroom' },
  { en: 'Good morning, teacher', sw: 'Habari za asubuhi, mwalimu', category: 'Classroom' },
  { en: 'Open your book', sw: 'Fungua kitabu chako', category: 'Classroom' },
  { en: 'Close your book', sw: 'Funga kitabu chako', category: 'Classroom' },
  { en: 'Read the sentence', sw: 'Soma sentensi', category: 'Classroom' },
  { en: 'Write your name', sw: 'Andika jina lako', category: 'Classroom' },
  { en: 'Listen carefully', sw: 'Sikiliza kwa makini', category: 'Classroom' },
  { en: 'Please repeat', sw: 'Tafadhali rudia', category: 'Classroom', enAliases: ['please repeat that', 'please say that again'] },
  { en: 'I have a question', sw: 'Nina swali', category: 'Classroom' },
  { en: 'I understand', sw: 'Ninaelewa', category: 'Classroom' },
  { en: 'I do not understand', sw: 'Sielewi', category: 'Classroom', enAliases: ["I don't understand"] },
  { en: 'Can you help me?', sw: 'Unaweza kunisaidia?', category: 'Classroom', enAliases: ['could you help me'] },
  { en: 'What does this mean?', sw: 'Hii inamaanisha nini?', category: 'Classroom' },
  { en: 'How do you say this in Kiswahili?', sw: 'Unasemaje hili kwa Kiswahili?', category: 'Classroom', enAliases: ['how do you say this in Swahili'] },
  { en: 'Speak slowly, please', sw: 'Tafadhali zungumza polepole', category: 'Classroom', enAliases: ['please speak slowly'] },
  { en: 'May I come in?', sw: 'Naweza kuingia?', category: 'Classroom' },
  { en: 'May I go outside?', sw: 'Naweza kwenda nje?', category: 'Classroom' },
  { en: 'Raise your hand', sw: 'Inua mkono wako', category: 'Classroom' },
  { en: 'Sit down', sw: 'Keti', category: 'Classroom' },
  { en: 'Stand up', sw: 'Simama', category: 'Classroom' },
  { en: 'Be quiet', sw: 'Nyamaza', category: 'Classroom' },
  { en: 'Work together', sw: 'Fanyeni kazi pamoja', category: 'Classroom' },
  { en: 'Well done', sw: 'Umefanya vizuri', category: 'Classroom' },
  { en: 'Education is important', sw: 'Elimu ni muhimu', category: 'Classroom' },
  { en: 'Knowledge is power', sw: 'Maarifa ni nguvu', category: 'Classroom' },
  { en: 'Let us learn together', sw: 'Tujifunze pamoja', category: 'Classroom', enAliases: ["let's learn together"] },
  { en: 'Where is the library?', sw: 'Maktaba iko wapi?', category: 'Classroom' },
  { en: 'The lesson is over', sw: 'Somo limekwisha', category: 'Classroom' },
  { en: 'I have finished my homework', sw: 'Nimemaliza kazi yangu ya nyumbani', category: 'Classroom' },
];

const everyday: Phrase[] = [
  { en: 'Yes', sw: 'Ndiyo', category: 'Everyday' },
  { en: 'No', sw: 'Hapana', category: 'Everyday' },
  { en: 'Okay', sw: 'Sawa', category: 'Everyday', enAliases: ['ok', 'all right'] },
  { en: 'I love you', sw: 'Nakupenda', category: 'Everyday' },
  { en: 'I am happy', sw: 'Nina furaha', category: 'Everyday', enAliases: ["I'm happy"] },
  { en: 'I am tired', sw: 'Nimechoka', category: 'Everyday', enAliases: ["I'm tired"] },
  { en: 'I am hungry', sw: 'Nina njaa', category: 'Everyday', enAliases: ["I'm hungry"] },
  { en: 'I am thirsty', sw: 'Nina kiu', category: 'Everyday', enAliases: ["I'm thirsty"] },
  { en: 'I am sick', sw: 'Mimi ni mgonjwa', category: 'Everyday', enAliases: ["I'm sick", 'I am ill'] },
  { en: 'I need help', sw: 'Ninahitaji msaada', category: 'Everyday' },
  { en: 'Help me, please', sw: 'Tafadhali nisaidie', category: 'Everyday', enAliases: ['please help me', 'help me'] },
  { en: 'I need water', sw: 'Ninahitaji maji', category: 'Everyday' },
  { en: 'I want water', sw: 'Ninataka maji', category: 'Everyday' },
  { en: 'I would like some food', sw: 'Ningependa chakula', category: 'Everyday' },
  { en: 'Where are you?', sw: 'Uko wapi?', category: 'Everyday' },
  { en: 'Where are you going?', sw: 'Unaenda wapi?', category: 'Everyday' },
  { en: 'Come here', sw: 'Njoo hapa', category: 'Everyday' },
  { en: 'Let us go', sw: 'Twende', category: 'Everyday', enAliases: ["let's go"] },
  { en: 'Wait a moment', sw: 'Subiri kidogo', category: 'Everyday', enAliases: ['wait a minute'] },
  { en: 'What time is it?', sw: 'Ni saa ngapi?', category: 'Everyday' },
  { en: 'I do not know', sw: 'Sijui', category: 'Everyday', enAliases: ["I don't know"] },
  { en: 'No problem', sw: 'Hakuna shida', category: 'Everyday', swAliases: ['hakuna matata'] },
  { en: 'Everything is fine', sw: 'Kila kitu kiko sawa', category: 'Everyday' },
  { en: 'Take care', sw: 'Jitunze', category: 'Everyday' },
  { en: 'Do you speak English?', sw: 'Unazungumza Kiingereza?', category: 'Everyday' },
  { en: 'Do you speak Kiswahili?', sw: 'Unazungumza Kiswahili?', category: 'Everyday', enAliases: ['do you speak Swahili'] },
  { en: 'I speak a little Kiswahili', sw: 'Ninazungumza Kiswahili kidogo', category: 'Everyday', enAliases: ['I speak a little Swahili'] },
  { en: 'I am from Uganda', sw: 'Ninatoka Uganda', category: 'Everyday' },
  { en: 'I live in Uganda', sw: 'Ninaishi Uganda', category: 'Everyday' },
  { en: 'We are friends', sw: 'Sisi ni marafiki', category: 'Everyday' },
  { en: 'I like this', sw: 'Ninapenda hiki', category: 'Everyday' },
  { en: 'It is beautiful', sw: 'Ni nzuri', category: 'Everyday' },
  { en: 'God bless you', sw: 'Mungu akubariki', category: 'Everyday' },
];

const travel: Phrase[] = [
  { en: 'Where is the hospital?', sw: 'Hospitali iko wapi?', category: 'Travel' },
  { en: 'Where is the market?', sw: 'Soko liko wapi?', category: 'Travel' },
  { en: 'Where is the bus station?', sw: 'Kituo cha mabasi kiko wapi?', category: 'Travel' },
  { en: 'Where is the toilet?', sw: 'Choo kiko wapi?', category: 'Travel', enAliases: ['where is the bathroom', 'where is the restroom'] },
  { en: 'How much is this?', sw: 'Hii ni bei gani?', category: 'Travel' },
  { en: 'It is too expensive', sw: 'Ni ghali sana', category: 'Travel' },
  { en: 'Turn left', sw: 'Geuka kushoto', category: 'Travel' },
  { en: 'Turn right', sw: 'Geuka kulia', category: 'Travel' },
  { en: 'Go straight', sw: 'Nenda moja kwa moja', category: 'Travel', enAliases: ['go straight ahead'] },
  { en: 'I am lost', sw: 'Nimepotea', category: 'Travel', enAliases: ["I'm lost"] },
  { en: 'I need a doctor', sw: 'Ninahitaji daktari', category: 'Travel' },
  { en: 'I need a taxi', sw: 'Ninahitaji teksi', category: 'Travel' },
  { en: 'Where do you come from?', sw: 'Unatoka wapi?', category: 'Travel', enAliases: ['where are you from'] },
  { en: 'Have a safe journey', sw: 'Safari njema', category: 'Travel', enAliases: ['have a good journey'] },
  { en: 'Can I pay by cash?', sw: 'Naweza kulipa kwa pesa taslimu?', category: 'Travel' },
  { en: 'I would like to buy this', sw: 'Ningependa kununua hiki', category: 'Travel' },
];

const vocabulary: [string, string][] = [
  ['School', 'Shule'], ['Student', 'Mwanafunzi'], ['Teacher', 'Mwalimu'],
  ['Students', 'Wanafunzi'], ['Teachers', 'Walimu'], ['Book', 'Kitabu'],
  ['Books', 'Vitabu'], ['Pen', 'Kalamu'], ['Pencil', 'Penseli'],
  ['Paper', 'Karatasi'], ['Classroom', 'Darasa'], ['Library', 'Maktaba'],
  ['Lesson', 'Somo'], ['Homework', 'Kazi ya nyumbani'], ['Education', 'Elimu'],
  ['Knowledge', 'Maarifa'], ['Question', 'Swali'], ['Answer', 'Jibu'],
  ['Language', 'Lugha'], ['English', 'Kiingereza'], ['Swahili', 'Kiswahili'],
  ['Read', 'Soma'], ['Write', 'Andika'], ['Learn', 'Jifunze'],
  ['Listen', 'Sikiliza'], ['Speak', 'Zungumza'], ['Understand', 'Elewa'],
  ['Friend', 'Rafiki'], ['Friends', 'Marafiki'], ['Family', 'Familia'],
  ['Mother', 'Mama'], ['Father', 'Baba'], ['Child', 'Mtoto'],
  ['Children', 'Watoto'], ['Sister', 'Dada'], ['Brother', 'Kaka'],
  ['Grandmother', 'Bibi'], ['Grandfather', 'Babu'], ['Person', 'Mtu'],
  ['People', 'Watu'], ['Home', 'Nyumbani'], ['House', 'Nyumba'],
  ['Water', 'Maji'], ['Food', 'Chakula'], ['Tea', 'Chai'],
  ['Coffee', 'Kahawa'], ['Milk', 'Maziwa'], ['Bread', 'Mkate'],
  ['Rice', 'Mchele'], ['Cooked rice', 'Wali'], ['Meat', 'Nyama'],
  ['Fish', 'Samaki'], ['Fruit', 'Tunda'], ['Fruits', 'Matunda'],
  ['Banana', 'Ndizi'], ['Mango', 'Embe'], ['Orange', 'Chungwa'],
  ['Egg', 'Yai'], ['Vegetables', 'Mboga'], ['Salt', 'Chumvi'],
  ['Sugar', 'Sukari'], ['Breakfast', 'Kiamsha kinywa'], ['Lunch', 'Chakula cha mchana'],
  ['Dinner', 'Chakula cha jioni'], ['Day', 'Siku'], ['Night', 'Usiku'],
  ['Morning', 'Asubuhi'], ['Afternoon', 'Mchana'], ['Evening', 'Jioni'],
  ['Today', 'Leo'], ['Tomorrow', 'Kesho'], ['Yesterday', 'Jana'],
  ['Now', 'Sasa'], ['Later', 'Baadaye'], ['Week', 'Wiki'],
  ['Month', 'Mwezi'], ['Year', 'Mwaka'], ['Time', 'Wakati'],
  ['Monday', 'Jumatatu'], ['Tuesday', 'Jumanne'], ['Wednesday', 'Jumatano'],
  ['Thursday', 'Alhamisi'], ['Friday', 'Ijumaa'], ['Saturday', 'Jumamosi'],
  ['Sunday', 'Jumapili'], ['One', 'Moja'], ['Two', 'Mbili'],
  ['Three', 'Tatu'], ['Four', 'Nne'], ['Five', 'Tano'],
  ['Six', 'Sita'], ['Seven', 'Saba'], ['Eight', 'Nane'],
  ['Nine', 'Tisa'], ['Ten', 'Kumi'], ['Eleven', 'Kumi na moja'],
  ['Twelve', 'Kumi na mbili'], ['Twenty', 'Ishirini'], ['Thirty', 'Thelathini'],
  ['Forty', 'Arobaini'], ['Fifty', 'Hamsini'], ['Hundred', 'Mia'],
  ['Thousand', 'Elfu'], ['Hospital', 'Hospitali'], ['Doctor', 'Daktari'],
  ['Market', 'Soko'], ['Shop', 'Duka'], ['Road', 'Barabara'],
  ['Car', 'Gari'], ['Bus', 'Basi'], ['Bicycle', 'Baiskeli'],
  ['Town', 'Mji'], ['Village', 'Kijiji'], ['Country', 'Nchi'],
  ['Money', 'Pesa'], ['Price', 'Bei'], ['Left', 'Kushoto'],
  ['Right', 'Kulia'], ['Here', 'Hapa'], ['There', 'Pale'],
  ['Sun', 'Jua'], ['Rain', 'Mvua'], ['Tree', 'Mti'],
  ['Flower', 'Ua'], ['River', 'Mto'], ['Lake', 'Ziwa'],
  ['Mountain', 'Mlima'], ['Earth', 'Dunia'], ['Sky', 'Anga'],
  ['Love', 'Upendo'], ['Peace', 'Amani'], ['Hope', 'Tumaini'],
  ['Unity', 'Umoja'], ['Respect', 'Heshima'], ['Work', 'Kazi'],
  ['Good', 'Nzuri'], ['Bad', 'Mbaya'], ['Big', 'Kubwa'],
  ['Small', 'Ndogo'], ['New', 'Mpya'], ['Old', 'Ya zamani'],
  ['Hot', 'Moto'], ['Cold', 'Baridi'], ['Fast', 'Haraka'],
  ['Slowly', 'Polepole'], ['Together', 'Pamoja'], ['Again', 'Tena'],
  ['Who', 'Nani'], ['What', 'Nini'], ['Where', 'Wapi'],
  ['Why', 'Kwa nini'], ['How', 'Vipi'], ['When', 'Lini'],
  ['Red', 'Nyekundu'], ['Blue', 'Bluu'], ['Green', 'Kijani'],
  ['White', 'Nyeupe'], ['Black', 'Nyeusi'], ['Yellow', 'Njano'],
];

const allPhrases: Phrase[] = [
  ...greetings, ...classroom, ...everyday, ...travel,
  ...vocabulary.map(([en, sw]) => ({ en, sw, category: 'Words' as const })),
  ...expandedVocabulary,
];

const seen = new Set<string>();
export const phrases = allPhrases.filter(phrase => {
  const key = `${phrase.en.toLowerCase()}:${phrase.sw.toLowerCase()}`;
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

export const builtInWordCount = phrases.filter(phrase => phrase.category === 'Words').length;

export const featuredPhrases = greetings.slice(0, 4);
export const categories: PhraseCategory[] = ['Greetings', 'Classroom', 'Everyday', 'Travel', 'Words'];

export function normalize(text: string): string {
  return text.normalize('NFKC').toLowerCase().replace(/[\u2018\u2019]/g, "'")
    .replace(/[.,!?;:"()]/g, '').replace(/\s+/g, ' ').trim().replace(/^'+|'+$/g, '');
}

const dictionaries: Record<Language, Map<string, string>> = { en: new Map(), sw: new Map() };
for (const phrase of phrases) {
  for (const key of [phrase.en, ...(phrase.enAliases ?? [])]) {
    if (!dictionaries.en.has(normalize(key))) dictionaries.en.set(normalize(key), phrase.sw);
  }
  for (const key of [phrase.sw, ...(phrase.swAliases ?? [])]) {
    if (!dictionaries.sw.has(normalize(key))) dictionaries.sw.set(normalize(key), phrase.en);
  }
}

// Only translate known phrases or supported templates; never disguise word substitution as grammar.
export function translateOffline(text: string, source: Language): string | null {
  const exact = dictionaries[source].get(normalize(text));
  if (exact) return exact;

  const templates: [RegExp, string][] = source === 'en' ? [
    [/^(?:my name is|i am called) ([\p{L}\p{M}][\p{L}\p{M} '-]{0,70})[.!?]*$/iu, 'Jina langu ni $1'],
    [/^i come from ([\p{L}\p{M}][\p{L}\p{M} '-]{0,70})[.!?]*$/iu, 'Ninatoka $1'],
    [/^i live in ([\p{L}\p{M}][\p{L}\p{M} '-]{0,70})[.!?]*$/iu, 'Ninaishi $1'],
  ] : [
    [/^(?:jina langu ni|ninaitwa) ([\p{L}\p{M}][\p{L}\p{M} '-]{0,70})[.!?]*$/iu, 'My name is $1'],
    [/^ninatoka ([\p{L}\p{M}][\p{L}\p{M} '-]{0,70})[.!?]*$/iu, 'I come from $1'],
    [/^ninaishi ([\p{L}\p{M}][\p{L}\p{M} '-]{0,70})[.!?]*$/iu, 'I live in $1'],
  ];
  for (const [pattern, replacement] of templates) {
    const match = text.trim().match(pattern);
    if (match && !/^(?:my|our|your|the|a|an|this|that|hii|yangu)\b/i.test(match[1])) return text.trim().replace(pattern, replacement);
  }

  const sentences = text.trim().split(/[.!?]\s+|\n+/).filter(Boolean);
  if (sentences.length > 1) {
    const translated = sentences.map(sentence => translateOffline(sentence, source));
    if (translated.every((item): item is string => item !== null)) {
      return translated.map(item => /[.!?]$/.test(item) ? item : `${item}.`).join(' ');
    }
  }
  return null;
}