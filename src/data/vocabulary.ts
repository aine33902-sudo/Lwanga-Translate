import type { Phrase } from './phrases';

function words(topic: string, partOfSpeech: string, text: string): Phrase[] {
  return text.trim().split('\n').map(line => {
    const [en, sw] = line.trim().split('|');
    return { en, sw, category: 'Words', topic, partOfSpeech };
  });
}

export const expandedVocabulary: Phrase[] = [
  ...words('School', 'noun', `
Alphabet|Alfabeti
Letter|Herufi
Word|Neno
Words|Maneno
Sentence|Sentensi
Paragraph|Aya
Grammar|Sarufi
Vocabulary|Msamiati
Dictionary|Kamusi
Translation|Tafsiri
Translator|Mtafsiri
Meaning|Maana
Pronunciation|Matamshi
Spelling|Tahajia
Noun|Nomino
Verb|Kitenzi
Adjective|Kivumishi
Adverb|Kielezi
Pronoun|Kiwakilishi
Conjunction|Kiunganishi
Preposition|Kihusishi
Singular|Umoja
Plural|Wingi
Tense|Wakati
Poem|Shairi
Poetry|Ushairi
Proverb|Methali
Riddle|Kitendawili
Story|Hadithi
Stories|Hadithi
Novel|Riwaya
Play|Tamthilia
Author|Mwandishi
Writer|Mwandishi
Reader|Msomaji
Reading|Usomaji
Writing|Uandishi
Essay|Insha
Composition|Insha
Literature|Fasihi
Topic|Mada
Title|Kichwa cha habari
Page|Ukurasa
Pages|Kurasa
Chapter|Sura
Notebook|Daftari
Exercise book|Daftari la mazoezi
Ruler|Rula
Eraser|Kifutio
Chalk|Chaki
Blackboard|Ubao
Desk|Dawati
School bag|Mkoba wa shule
Uniform|Sare
Examination|Mtihani
Exam|Mtihani
Test|Jaribio
Revision|Marudio
Timetable|Ratiba
Assignment|Kazi ya kufanya
Research|Utafiti
Experiment|Jaribio
Laboratory|Maabara
Mathematics|Hisabati
Science|Sayansi
Biology|Biolojia
Chemistry|Kemia
Physics|Fizikia
Geography|Jiografia
History|Historia
Subject|Somo
Art|Sanaa
Drawing|Mchoro
Music|Muziki
Sport|Mchezo
Sports|Michezo
Headteacher|Mwalimu mkuu
Headmaster|Mwalimu mkuu
Headmistress|Mwalimu mkuu
Principal|Mkuu wa shule
Classmate|Mwanadarasa
Schoolmate|Mwanashule
College|Chuo
University|Chuo kikuu
Certificate|Cheti
Degree|Shahada
Scholarship|Ufadhili wa masomo
Discipline|Nidhamu
Attendance|Mahudhurio
Success|Mafanikio
Failure|Kushindwa
Skill|Ujuzi
Skills|Ujuzi
Talent|Kipaji
Training|Mafunzo
Practice|Mazoezi
Project|Mradi
Projects|Miradi
Learning|Kujifunza
Teaching|Ufundishaji
Discussion|Majadiliano
Debate|Mdahalo
Example|Mfano
Examples|Mifano
Explanation|Maelezo
Instructions|Maagizo
Conclusion|Hitimisho
Introduction|Utangulizi
Summary|Muhtasari
Note|Dokezo
Notes|Maelezo
Exercise|Zoezi
Exercises|Mazoezi
`),
  ...words('People', 'noun', `
Name|Jina
Names|Majina
Man|Mwanamume
Men|Wanaume
Woman|Mwanamke
Women|Wanawake
Boy|Mvulana
Boys|Wavulana
Girl|Msichana
Girls|Wasichana
Baby|Mtoto mchanga
Adult|Mtu mzima
Youth|Kijana
Young people|Vijana
Parents|Wazazi
Parent|Mzazi
Son|Mwana wa kiume
Daughter|Binti
Husband|Mume
Wife|Mke
Marriage|Ndoa
Wedding|Harusi
Uncle|Mjomba
Aunt|Shangazi
Cousin|Binamu
Grandchild|Mjukuu
Grandchildren|Wajukuu
Grandparents|Babu na bibi
Relative|Jamaa
Relatives|Jamaa
Neighbor|Jirani
Neighbour|Jirani
Neighbors|Majirani
Neighbours|Majirani
Guest|Mgeni
Guests|Wageni
Visitor|Mgeni
Visitors|Wageni
Stranger|Mgeni
Community|Jamii
Society|Jamii
Group|Kundi
Groups|Makundi
Team|Timu
Leader|Kiongozi
Leaders|Viongozi
Leadership|Uongozi
Citizen|Raia
Citizens|Raia
Farmer|Mkulima
Farmers|Wakulima
Worker|Mfanyakazi
Workers|Wafanyakazi
Engineer|Mhandisi
Driver|Dereva
Pilot|Rubani
Police officer|Askari polisi
Soldier|Askari
Lawyer|Wakili
Judge|Hakimu
Nurse|Muuguzi
Artist|Msanii
Singer|Mwimbaji
Journalist|Mwandishi wa habari
Accountant|Mhasibu
Carpenter|Seremala
Builder|Mjenzi
Tailor|Fundi cherehani
Fisherman|Mvuvi
Merchant|Mfanyabiashara
Entrepreneur|Mjasiriamali
Customer|Mteja
Customers|Wateja
Passenger|Abiria
Passengers|Abiria
President|Rais
Minister|Waziri
Priest|Padri
Pastor|Mchungaji
Christian|Mkristo
Muslim|Mwislamu
God|Mungu
Religion|Dini
Prayer|Sala
Faith|Imani
Church|Kanisa
Mosque|Msikiti
`),
  ...words('Body & health', 'noun', `
Body|Mwili
Head|Kichwa
Hair|Nywele
Face|Uso
Eye|Jicho
Eyes|Macho
Ear|Sikio
Ears|Masikio
Nose|Pua
Mouth|Mdomo
Tongue|Ulimi
Tooth|Jino
Teeth|Meno
Lip|Mdomo
Neck|Shingo
Shoulder|Bega
Shoulders|Mabega
Arm|Mkono
Arms|Mikono
Hand|Mkono
Hands|Mikono
Finger|Kidole
Fingers|Vidole
Thumb|Kidole gumba
Chest|Kifua
Stomach|Tumbo
Back|Mgongo
Leg|Mguu
Legs|Miguu
Foot|Mguu
Feet|Miguu
Knee|Goti
Knees|Magoti
Toe|Kidole cha mguu
Toes|Vidole vya miguu
Skin|Ngozi
Bone|Mfupa
Bones|Mifupa
Blood|Damu
Heart|Moyo
Brain|Ubongo
Lung|Pafu
Lungs|Mapafu
Liver|Ini
Kidney|Figo
Muscle|Misuli
Breath|Pumzi
Health|Afya
Disease|Ugonjwa
Illness|Ugonjwa
Sickness|Ugonjwa
Medicine|Dawa
Medicines|Dawa
Pharmacy|Duka la dawa
Clinic|Zahanati
Patient|Mgonjwa
Patients|Wagonjwa
Pain|Maumivu
Fever|Homa
Headache|Maumivu ya kichwa
Cough|Kikohozi
Wound|Jeraha
Wounds|Majeraha
Injury|Jeraha
Accident|Ajali
Emergency|Dharura
Ambulance|Gari la wagonjwa
Treatment|Matibabu
Surgery|Upasuaji
Vaccine|Chanjo
Vaccination|Chanjo
Infection|Maambukizi
Malaria|Malaria
Diabetes|Kisukari
Hygiene|Usafi
Soap|Sabuni
Toothbrush|Mswaki
Toothpaste|Dawa ya meno
Bandage|Bendeji
Wheelchair|Kiti cha magurudumu
Disability|Ulemavu
Pregnancy|Ujauzito
Birth|Kuzaliwa
Death|Kifo
Life|Maisha
Hunger|Njaa
Thirst|Kiu
Sleep|Usingizi
Rest|Mapumziko
Sweat|Jasho
Tear|Chozi
Tears|Machozi
`),
  ...words('Home', 'noun', `
Room|Chumba
Rooms|Vyumba
Bedroom|Chumba cha kulala
Kitchen|Jikoni
Bathroom|Bafu
Toilet|Choo
Living room|Sebule
Door|Mlango
Doors|Milango
Window|Dirisha
Windows|Madirisha
Wall|Ukuta
Walls|Kuta
Roof|Paa
Floor|Sakafu
Ceiling|Dari
Stairs|Ngazi
Gate|Lango
Fence|Uzio
Garden|Bustani
Yard|Ua
Key|Ufunguo
Keys|Funguo
Lock|Kufuli
Chair|Kiti
Chairs|Viti
Table|Meza
Bed|Kitanda
Beds|Vitanda
Mattress|Godoro
Pillow|Mto wa kulalia
Blanket|Blanketi
Sheet|Shuka
Curtain|Pazia
Carpet|Zulia
Furniture|Samani
Cupboard|Kabati
Shelf|Rafu
Mirror|Kioo
Lamp|Taa
Light|Mwanga
Electricity|Umeme
Socket|Soketi
Switch|Swichi
Refrigerator|Jokofu
Fridge|Jokofu
Stove|Jiko
Cooker|Jiko
Pot|Sufuria
Pan|Kikaango
Plate|Sahani
Bowl|Bakuli
Cup|Kikombe
Cups|Vikombe
Glass|Glasi
Bottle|Chupa
Bucket|Ndoo
Basin|Beseni
Spoon|Kijiko
Spoons|Vijiko
Fork|Uma
Knife|Kisu
Knives|Visu
Kettle|Birika
Basket|Kikapu
Broom|Ufagio
Cloth|Kitambaa
Towel|Taulo
Clothes|Nguo
Shirt|Shati
Trousers|Suruali
Pants|Suruali
Dress|Gauni
Skirt|Sketi
Coat|Koti
Jacket|Jaketi
Sweater|Sweta
Shoes|Viatu
Shoe|Kiatu
Socks|Soksi
Hat|Kofia
Belt|Mkanda
Ring|Pete
Watch|Saa ya mkononi
Bag|Mfuko
Bags|Mifuko
Umbrella|Mwavuli
Needle|Sindano
Thread|Uzi
Scissors|Mkasi
Rope|Kamba
Box|Sanduku
Boxes|Masanduku
`),
  ...words('Food', 'noun', `
Meal|Mlo
Meals|Milo
Cooking|Upishi
Cook|Mpishi
Restaurant|Mkahawa
Menu|Orodha ya vyakula
Beans|Maharagwe
Peas|Njegere
Lentils|Dengu
Maize|Mahindi
Corn|Mahindi
Wheat|Ngano
Flour|Unga
Cassava|Muhogo
Potato|Kiazi
Potatoes|Viazi
Sweet potato|Kiazi kitamu
Sweet potatoes|Viazi vitamu
Tomato|Nyanya
Tomatoes|Nyanya
Onion|Kitunguu
Onions|Vitunguu
Garlic|Kitunguu saumu
Ginger|Tangawizi
Carrot|Karoti
Cabbage|Kabichi
Spinach|Mchicha
Pepper|Pilipili
Chili|Pilipili kali
Cucumber|Tango
Pumpkin|Boga
Eggplant|Biringanya
Aubergine|Biringanya
Okra|Bamia
Mushroom|Uyoga
Avocado|Parachichi
Pineapple|Nanasi
Papaya|Papai
Pawpaw|Papai
Watermelon|Tikiti maji
Lemon|Limau
Lime|Ndimu
Coconut|Nazi
Grapes|Zabibu
Apple|Tofaa
Passion fruit|Pasheni
Groundnuts|Karanga
Peanuts|Karanga
Cashew nuts|Korosho
Honey|Asali
Oil|Mafuta
Cooking oil|Mafuta ya kupikia
Butter|Siagi
Cheese|Jibini
Yogurt|Mtindi
Yoghurt|Mtindi
Juice|Juisi
Soup|Supu
Porridge|Uji
Ugali|Ugali
Chapati|Chapati
Pilau|Pilau
Chicken meat|Nyama ya kuku
Beef|Nyama ya ng'ombe
Goat meat|Nyama ya mbuzi
Pork|Nyama ya nguruwe
Sausage|Soseji
Eggs|Mayai
Cake|Keki
Biscuit|Biskuti
Ice cream|Aiskrimu
Sweets|Pipi
Snack|Kitafunio
Snacks|Vitafunio
Taste|Ladha
Spice|Kiungo
Spices|Viungo
Cloves|Karafuu
Cinnamon|Mdalasini
Turmeric|Manjano
`),
  ...words('Animals', 'noun', `
Animal|Mnyama
Animals|Wanyama
Bird|Ndege
Birds|Ndege
Dog|Mbwa
Dogs|Mbwa
Cat|Paka
Cats|Paka
Cow|Ng'ombe
Cattle|Ng'ombe
Bull|Fahali
Calf|Ndama
Goat|Mbuzi
Goats|Mbuzi
Sheep|Kondoo
Pig|Nguruwe
Pigs|Nguruwe
Horse|Farasi
Donkey|Punda
Camel|Ngamia
Chicken|Kuku
Chickens|Kuku
Hen|Kuku jike
Rooster|Jogoo
Duck|Bata
Turkey|Bata mzinga
Pigeon|Njiwa
Dove|Njiwa
Eagle|Tai
Owl|Bundi
Parrot|Kasuku
Ostrich|Mbuni
Lion|Simba
Elephant|Tembo
Elephants|Tembo
Giraffe|Twiga
Zebra|Pundamilia
Buffalo|Nyati
Leopard|Chui
Cheetah|Duma
Hyena|Fisi
Rhinoceros|Kifaru
Hippopotamus|Kiboko
Hippo|Kiboko
Monkey|Tumbili
Baboon|Nyani
Gorilla|Sokwe
Chimpanzee|Sokwe mtu
Antelope|Swala
Gazelle|Swala
Rabbit|Sungura
Hare|Sungura
Rat|Panya
Mouse|Panya
Squirrel|Kindi
Snake|Nyoka
Crocodile|Mamba
Lizard|Mjusi
Chameleon|Kinyonga
Tortoise|Kobe
Turtle|Kasa
Frog|Chura
Toad|Chura
Shark|Papa
Whale|Nyangumi
Dolphin|Pomboo
Crab|Kaa
Octopus|Pweza
Insect|Mdudu
Insects|Wadudu
Mosquito|Mbu
Fly|Nzi
Flies|Nzi
Bee|Nyuki
Bees|Nyuki
Butterfly|Kipepeo
Ant|Sisimizi
Termite|Mchwa
Spider|Buibui
Scorpion|Nge
Cockroach|Mende
Grasshopper|Panzi
Snail|Konokono
Worm|Mnyoo
Tail|Mkia
Wing|Bawa
Wings|Mabawa
Feather|Unyoya
Feathers|Manyoya
Nest|Kiota
Eggshell|Ganda la yai
`),
  ...words('Nature', 'noun', `
Nature|Asili
Environment|Mazingira
Weather|Hali ya hewa
Climate|Tabianchi
Climate change|Mabadiliko ya tabianchi
Air|Hewa
Wind|Upepo
Storm|Dhoruba
Thunder|Ngurumo
Lightning|Radi
Cloud|Wingu
Clouds|Mawingu
Rainbow|Upinde wa mvua
Fog|Ukungu
Snow|Theluji
Ice|Barafu
Drought|Ukame
Flood|Mafuriko
Season|Majira
Summer|Majira ya joto
Winter|Majira ya baridi
Moon|Mwezi
Star|Nyota
Stars|Nyota
Planet|Sayari
Universe|Ulimwengu
Space|Anga
Sunrise|Macheo
Sunset|Machweo
Land|Ardhi
Soil|Udongo
Sand|Mchanga
Stone|Jiwe
Stones|Mawe
Rock|Mwamba
Rocks|Miamba
Valley|Bonde
Hill|Kilima
Hills|Vilima
Mountains|Milima
Forest|Msitu
Forests|Misitu
Trees|Miti
Leaf|Jani
Leaves|Majani
Branch|Tawi
Branches|Matawi
Root|Mzizi
Roots|Mizizi
Seed|Mbegu
Seeds|Mbegu
Plant|Mmea
Plants|Mimea
Grass|Nyasi
Flowers|Maua
Thorn|Mwiba
Thorns|Miiba
Ocean|Bahari
Sea|Bahari
Beach|Ufukwe
Coast|Pwani
Island|Kisiwa
Islands|Visiwa
Waterfall|Maporomoko ya maji
Stream|Kijito
Pond|Bwawa
Well|Kisima
Spring water|Maji ya chemchemi
Fire|Moto
Smoke|Moshi
Ash|Majivu
Coal|Makaa ya mawe
Charcoal|Mkaa
Energy|Nishati
Sunshine|Mwanga wa jua
Shade|Kivuli
Shadow|Kivuli
Darkness|Giza
Farm|Shamba
Farms|Mashamba
Agriculture|Kilimo
Harvest|Mavuno
Crop|Zao
Crops|Mazao
Fertilizer|Mbolea
Irrigation|Umwagiliaji
Pollution|Uchafuzi
Conservation|Uhifadhi
Recycling|Uchakataji upya
Wildlife|Wanyamapori
`),
  ...words('Travel & places', 'noun', `
Journey|Safari
Travel|Safari
Trip|Safari
Tourism|Utalii
Tourist|Mtalii
Airport|Uwanja wa ndege
Airplane|Ndege
Aeroplane|Ndege
Train|Treni
Railway|Reli
Station|Kituo
Bus stop|Kituo cha basi
Taxi|Teksi
Motorcycle|Pikipiki
Boat|Mashua
Ship|Meli
Port|Bandari
Harbour|Bandari
Harbor|Bandari
Bridge|Daraja
Street|Mtaa
Path|Njia
Traffic|Trafiki
Traffic jam|Msongamano wa magari
Fuel|Mafuta
Petrol|Petroli
Gasoline|Petroli
Diesel|Dizeli
Ticket|Tiketi
Passport|Pasipoti
Visa|Viza
Luggage|Mizigo
Suitcase|Sanduku la safari
Hotel|Hoteli
Reception|Mapokezi
Address|Anwani
Map|Ramani
Direction|Mwelekeo
Distance|Umbali
North|Kaskazini
South|Kusini
East|Mashariki
West|Magharibi
City|Jiji
Capital city|Mji mkuu
District|Wilaya
Region|Mkoa
Continent|Bara
Border|Mpaka
Office|Ofisi
Bank|Benki
Post office|Posta
Police station|Kituo cha polisi
Court|Mahakama
Museum|Makumbusho
Stadium|Uwanja wa michezo
Playground|Uwanja wa michezo
Park|Bustani
Swimming pool|Bwawa la kuogelea
Factory|Kiwanda
Building|Jengo
Buildings|Majengo
Country road|Barabara ya mashambani
Destination|Mahali pa kwenda
Africa|Afrika
East Africa|Afrika Mashariki
Uganda|Uganda
Kenya|Kenya
Tanzania|Tanzania
Rwanda|Rwanda
Burundi|Burundi
`),
  ...words('Technology', 'noun', `
Computer|Kompyuta
Computers|Kompyuta
Laptop|Kompyuta mpakato
Phone|Simu
Telephone|Simu
Mobile phone|Simu ya mkononi
Smartphone|Simu janja
Television|Televisheni
Radio|Redio
Camera|Kamera
Printer|Printa
Keyboard|Kibodi
Computer mouse|Kipanya
Screen|Skrini
Monitor|Monita
Battery|Betri
Charger|Chaja
Cable|Kebo
Internet|Intaneti
Website|Tovuti
Web page|Ukurasa wa wavuti
Email|Barua pepe
Message|Ujumbe
Messages|Ujumbe
Password|Nenosiri
Username|Jina la mtumiaji
Account|Akaunti
File|Faili
Files|Faili
Folder|Folda
Software|Programu
Application|Programu tumizi
App|Programu tumizi
Database|Hifadhidata
Data|Data
Information|Taarifa
Network|Mtandao
Connection|Muunganisho
Signal|Ishara
Technology|Teknolojia
Machine|Mashine
Device|Kifaa
Devices|Vifaa
Tool|Zana
Tools|Zana
Photo|Picha
Photograph|Picha
Picture|Picha
Video|Video
Audio|Sauti
Sound|Sauti
Volume|Kiwango cha sauti
Microphone|Maikrofoni
Speaker|Spika
Headphones|Vipokea sauti
Button|Kitufe
Link|Kiungo
Browser|Kivinjari
Search engine|Injini ya utafutaji
Storage|Hifadhi
Memory|Kumbukumbu
Update|Sasisho
Download|Upakuaji
Upload|Upakiaji
Artificial intelligence|Akili bandia
Privacy|Faragha
Security|Usalama
`),
  ...words('Science', 'noun', `
Cell|Seli
Cells|Seli
Organism|Kiumbe hai
Organisms|Viumbe hai
Bacteria|Bakteria
Virus|Virusi
Photosynthesis|Usanisinuru
Respiration|Upumuaji
Digestion|Mmeng'enyo
Nutrition|Lishe
Oxygen|Oksijeni
Hydrogen|Hidrojeni
Carbon|Kaboni
Nitrogen|Nitrojeni
Carbon dioxide|Dioksidi kaboni
Atom|Atomu
Molecule|Molekuli
Element|Elementi
Chemical|Kemikali
Acid|Asidi
Base|Besi
Metal|Metali
Iron|Chuma
Copper|Shaba
Gold|Dhahabu
Silver|Fedha
Plastic|Plastiki
Rubber|Mpira
Wood|Mbao
Temperature|Halijoto
Heat|Joto
Pressure|Shinikizo
Force|Nguvu
Power|Nguvu
Gravity|Mvutano wa graviti
Mass|Masi
Weight|Uzito
Speed|Kasi
Velocity|Velositi
Acceleration|Mchapuko
Friction|Msuguano
Motion|Mwendo
Magnet|Sumaku
Magnetism|Usumaku
Electric current|Mkondo wa umeme
Voltage|Volteji
Resistance|Ukinzani
Circuit|Saketi
Length|Urefu
Width|Upana
Height|Kimo
Depth|Kina
Area|Eneo
Diameter|Kipenyo
Radius|Nusu kipenyo
Angle|Pembe
Circle|Duara
Triangle|Pembetatu
Square|Mraba
Rectangle|Mstatili
Line|Mstari
Point|Nukta
Number|Nambari
Numbers|Nambari
Fraction|Sehemu
Percentage|Asilimia
Addition|Ujumlishaji
Subtraction|Utoaji
Multiplication|Uzidishaji
Division|Ugawanyaji
Equation|Mlinganyo
Measurement|Kipimo
Meter|Mita
Metre|Mita
Kilometer|Kilomita
Kilometre|Kilomita
Liter|Lita
Litre|Lita
Gram|Gramu
Kilogram|Kilogramu
`),
  ...words('Business & ideas', 'noun', `
Business|Biashara
Trade|Biashara
Commerce|Biashara
Economy|Uchumi
Economic growth|Ukuaji wa uchumi
Development|Maendeleo
Progress|Maendeleo
Employment|Ajira
Job|Kazi
Salary|Mshahara
Wage|Ujira
Income|Mapato
Profit|Faida
Loss|Hasara
Cost|Gharama
Expense|Gharama
Budget|Bajeti
Savings|Akiba
Debt|Deni
Loan|Mkopo
Interest|Riba
Tax|Kodi
Rent|Kodi ya nyumba
Receipt|Risiti
Payment|Malipo
Cash|Pesa taslimu
Coin|Sarafu
Currency|Sarafu
Investment|Uwekezaji
Company|Kampuni
Organization|Shirika
Organisation|Shirika
Meeting|Mkutano
Meetings|Mikutano
Agreement|Makubaliano
Contract|Mkataba
Plan|Mpango
Plans|Mipango
Goal|Lengo
Goals|Malengo
Purpose|Kusudi
Reason|Sababu
Cause|Sababu
Result|Matokeo
Results|Matokeo
Problem|Tatizo
Problems|Matatizo
Solution|Suluhisho
Decision|Uamuzi
Choice|Chaguo
Opportunity|Fursa
Chance|Nafasi
Risk|Hatari
Danger|Hatari
Safety|Usalama
Law|Sheria
Rule|Kanuni
Rules|Kanuni
Government|Serikali
Democracy|Demokrasia
Election|Uchaguzi
Vote|Kura
Politics|Siasa
Justice|Haki
Rights|Haki
Freedom|Uhuru
Independence|Uhuru
Responsibility|Wajibu
Duty|Wajibu
Equality|Usawa
Truth|Ukweli
Lie|Uongo
Honesty|Uaminifu
Kindness|Wema
Courage|Ujasiri
Patience|Uvumilivu
Happiness|Furaha
Joy|Furaha
Sadness|Huzuni
Fear|Hofu
Anger|Hasira
Surprise|Mshangao
Dream|Ndoto
Dreams|Ndoto
Idea|Wazo
Ideas|Mawazo
Thought|Wazo
Thoughts|Mawazo
Mind|Akili
Intelligence|Akili
Ability|Uwezo
Experience|Uzoefu
Effort|Juhudi
Help|Msaada
Support|Msaada
Advice|Ushauri
News|Habari
Culture|Utamaduni
Tradition|Mila
Custom|Desturi
Identity|Utambulisho
Value|Thamani
Quality|Ubora
Accuracy|Usahihi
Quantity|Kiasi
Unity|Umoja
Cooperation|Ushirikiano
Friendship|Urafiki
Conversation|Mazungumzo
Communication|Mawasiliano
Invitation|Mwaliko
Gift|Zawadi
Promise|Ahadi
Secret|Siri
Permission|Ruhusa
Respect|Heshima
`),
  ...words('Time & numbers', 'noun', `
Minute|Dakika
Minutes|Dakika
Hour|Saa
Hours|Saa
Second|Sekunde
Seconds|Sekunde
Moment|Muda mfupi
Midday|Adhuhuri
Noon|Adhuhuri
Midnight|Usiku wa manane
Calendar|Kalenda
Date|Tarehe
Weekend|Mwisho wa wiki
Months|Miezi
Years|Miaka
January|Januari
February|Februari
March|Machi
April|Aprili
May|Mei
June|Juni
July|Julai
August|Agosti
September|Septemba
October|Oktoba
November|Novemba
December|Desemba
Zero|Sifuri
Thirteen|Kumi na tatu
Fourteen|Kumi na nne
Fifteen|Kumi na tano
Sixteen|Kumi na sita
Seventeen|Kumi na saba
Eighteen|Kumi na nane
Nineteen|Kumi na tisa
Sixty|Sitini
Seventy|Sabini
Eighty|Themanini
Ninety|Tisini
Million|Milioni
Billion|Bilioni
Half|Nusu
Quarter|Robo
`),
  ...words('Actions', 'verb', `
Eat|Kula
Drink|Kunywa
Go|Kwenda
Come|Kuja
Run|Kukimbia
Walk|Kutembea
Sit|Kukaa
Stand|Kusimama
Sleep|Kulala
Wake|Kuamka
Wake up|Kuamka
See|Kuona
Look|Kutazama
Watch|Kutazama
Hear|Kusikia
Say|Kusema
Talk|Kuzungumza
Ask|Kuuliza
Answer|Kujibu
Think|Kufikiri
Know|Kujua
Remember|Kukumbuka
Forget|Kusahau
Believe|Kuamini
Explain|Kueleza
Teach|Kufundisha
Study|Kusoma
Practice|Kufanya mazoezi
Practise|Kufanya mazoezi
Translate|Kutafsiri
Count|Kuhesabu
Calculate|Kukokotoa
Draw|Kuchora
Paint|Kupaka rangi
Sing|Kuimba
Dance|Kucheza
Laugh|Kucheka
Smile|Kutabasamu
Cry|Kulia
Play|Kucheza
Work|Kufanya kazi
Build|Kujenga
Make|Kutengeneza
Repair|Kukarabati
Fix|Kurekebisha
Break|Kuvunja
Open|Kufungua
Close|Kufunga
Lock|Kufunga kwa kufuli
Clean|Kusafisha
Wash|Kuosha
Cook|Kupika
Cut|Kukata
Give|Kutoa
Take|Kuchukua
Bring|Kuleta
Send|Kutuma
Receive|Kupokea
Buy|Kununua
Sell|Kuuza
Pay|Kulipa
Save|Kuhifadhi
Help|Kusaidia
Wait|Kusubiri
Start|Kuanza
Begin|Kuanza
Finish|Kumaliza
Stop|Kusimama
Continue|Kuendelea
Try|Kujaribu
Use|Kutumia
Need|Kuhitaji
Want|Kutaka
Like|Kupenda
Love|Kupenda
Hate|Kuchukia
Live|Kuishi
Die|Kufa
Grow|Kukua
Plant|Kupanda
Choose|Kuchagua
Decide|Kuamua
Agree|Kukubali
Refuse|Kukataa
Accept|Kukubali
Follow|Kufuata
Lead|Kuongoza
Meet|Kukutana
Visit|Kutembelea
Travel|Kusafiri
Return|Kurudi
Leave|Kuondoka
Enter|Kuingia
Exit|Kutoka
Find|Kupata
Lose|Kupoteza
Win|Kushinda
Carry|Kubeba
Hold|Kushika
Push|Kusukuma
Pull|Kuvuta
Throw|Kutupa
Catch|Kukamata
Swim|Kuogelea
Drive|Kuendesha
Fly|Kuruka
Climb|Kupanda
Fall|Kuanguka
Jump|Kuruka
Turn|Kugeuka
Change|Kubadilisha
Share|Kushiriki
Join|Kujiunga
Collect|Kukusanya
Add|Kuongeza
Remove|Kuondoa
Compare|Kulinganisha
Check|Kukagua
Search|Kutafuta
Download|Kupakua
Upload|Kupakia
Copy|Kunakili
Delete|Kufuta
Print|Kuchapisha
Connect|Kuunganisha
Disconnect|Kutenganisha
Protect|Kulinda
Pray|Kusali
Forgive|Kusamehe
Promise|Kuahidi
Understand|Kuelewa
Listen|Kusikiliza
Speak|Kuzungumza
Read|Kusoma
Write|Kuandika
Learn|Kujifunza
`),
  ...words('Descriptions', 'adjective', `
Beautiful|Nzuri
Ugly|Mbaya
Clean|Safi
Dirty|Chafu
Easy|Rahisi
Difficult|Ngumu
Hard|Ngumu
Soft|Laini
Strong|Imara
Weak|Dhaifu
Heavy|Nzito
Light|Nyepesi
Expensive|Ghali
Cheap|Nafuu
Free|Bure
Important|Muhimu
Useful|Yenye manufaa
Necessary|Ya lazima
Possible|Inawezekana
Impossible|Haiwezekani
Correct|Sahihi
Wrong|Isiyo sahihi
True|Kweli
False|Si kweli
Safe|Salama
Dangerous|Hatari
Healthy|Mwenye afya
Sick|Mgonjwa
Happy|Mwenye furaha
Sad|Mwenye huzuni
Angry|Mwenye hasira
Tired|Aliyechoka
Hungry|Mwenye njaa
Thirsty|Mwenye kiu
Kind|Mkarimu
Honest|Mwaminifu
Brave|Jasiri
Clever|Mwerevu
Intelligent|Mwenye akili
Polite|Mwenye adabu
Lazy|Mvivu
Busy|Mwenye shughuli
Ready|Tayari
Late|Amechelewa
Early|Mapema
Young|Mchanga
Old|Mzee
Long|Ndefu
Short|Fupi
Tall|Mrefu
Wide|Pana
Narrow|Nyembamba
Thick|Nene
Thin|Nyembamba
Deep|Kina kirefu
Shallow|Kina kifupi
Full|Imejaa
Empty|Tupu
Dry|Kavu
Wet|Yenye unyevu
Warm|Ya joto
Cool|Baridi
Fresh|Mbichi
Sweet|Tamu
Sour|Chachu
Bitter|Chungu
Delicious|Tamu
Salty|Yenye chumvi
Purple|Zambarau
Pink|Waridi
Brown|Kahawia
Gray|Kijivu
Grey|Kijivu
Orange|Rangi ya chungwa
Different|Tofauti
Same|Sawa
Special|Maalumu
Ordinary|Ya kawaida
Modern|Ya kisasa
Ancient|Ya kale
Public|Ya umma
Private|Binafsi
Local|Ya eneo hilo
Foreign|Ya kigeni
`),
  ...words('Connecting words', 'adverb / function word', `
I|Mimi
You|Wewe
He|Yeye
She|Yeye
We|Sisi
They|Wao
Me|Mimi
Us|Sisi
Them|Wao
My|Yangu
Your|Yako
His|Yake
Her|Yake
Our|Yetu
Their|Yao
This|Hii
That|Hiyo
These|Hizi
Those|Hizo
And|Na
Or|Au
But|Lakini
Because|Kwa sababu
Therefore|Kwa hiyo
Although|Ingawa
If|Ikiwa
Then|Kisha
While|Wakati
With|Na
Without|Bila
For|Kwa ajili ya
From|Kutoka
To|Kwa
In|Ndani ya
Inside|Ndani
Outside|Nje
On|Juu ya
Under|Chini ya
Above|Juu ya
Below|Chini ya
Between|Kati ya
Behind|Nyuma ya
Before|Kabla
After|Baada
Near|Karibu
Far|Mbali
Up|Juu
Down|Chini
Always|Daima
Never|Kamwe
Sometimes|Wakati mwingine
Often|Mara nyingi
Usually|Kwa kawaida
Already|Tayari
Still|Bado
Soon|Hivi karibuni
Maybe|Labda
Perhaps|Labda
Only|Tu
Also|Pia
Very|Sana
Enough|Ya kutosha
More|Zaidi
Less|Kidogo zaidi
Much|Mengi
Many|Nyingi
Few|Chache
All|Yote
Every|Kila
Some|Baadhi
Any|Yoyote
Nothing|Hakuna kitu
Everything|Kila kitu
Someone|Mtu fulani
Everyone|Kila mtu
Nobody|Hakuna mtu
Somewhere|Mahali fulani
Everywhere|Kila mahali
Anywhere|Popote
Quickly|Haraka
Carefully|Kwa makini
Clearly|Kwa uwazi
Loudly|Kwa sauti kubwa
Quietly|Kimya kimya
Separately|Kando kando
Suddenly|Ghafla
Immediately|Mara moja
Finally|Hatimaye
Actually|Kwa kweli
Certainly|Hakika
Probably|Huenda
Especially|Hasa
`),
];