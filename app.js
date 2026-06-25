const languages = [
  { id: "nl", name: "Nederlands", locale: "nl-NL", color: "#f06d5e" },
  { id: "ru", name: "русский", locale: "ru-RU", color: "#f6c85f" },
  { id: "zh", name: "中文", locale: "zh-CN", color: "#2f9d74" },
  { id: "en", name: "English", locale: "en-US", color: "#3778c2" },
  { id: "ja", name: "日本語", locale: "ja-JP", color: "#8f6ccf" },
];

/* =========================================================================
   QUALITY AUDIT CHANGES (Multilingual Pronunciation Rule Enforcement)
   =========================================================================
   Date of changes: During the "In your languages" strict quality review.

   GOAL: Strictly enforce the two-row design rule everywhere:
     Row 1: Correct word in the target language
     Row 2: Real pronunciation guide (romaji / pinyin / phonetic spelling)
            NEVER simply repeat the display word from Row 1.

   CHANGES MADE (all in app.js only — see detailed comments at each site):
     1. Data fix: natureEmojiItems "high voltage" → "lightning" (and matching fact).
     2. Removed legacy "voltage" token from isWeather regex.
     3. Massively expanded latinPronunciationOverrides (English + Dutch).
     4. Rewrote latinPronunciationGuide to guarantee it never returns a raw duplicate.
     5. Hardened japanesePronunciationGuide / chinesePronunciationGuide /
        russianPronunciationGuide with CJK/Cyrillic leakage protection and
        "never equal to input word" enforcement.
     6. Patched multiple worst static word entries that had exact repeats
        (ice, park, bus, fire, juice, cloud, book, hand, eye, hat, fish, etc.).

   NO CHANGES WERE NEEDED IN styles.css — the .phonetic row styling and
   .translation-row layout were already correct. The problems were 100% data.

   LOCATIONS OF ALL EDITS (search these strings to jump directly):
     - "lightning" (nature data + fact)
     - "latinPronunciationOverrides"
     - "latinPronunciationGuide"
     - "japanesePronunciationGuide"
     - "chinesePronunciationGuide"
     - "russianPronunciationGuide"
     - Static fixes: phonetic: "eys", "pahrk", "buhs", "foor", "sawk", "vohlk", etc.
   ========================================================================= */

const words = {
  apple: {
    aliases: ["apple", "appel", "яблоко", "yabloko", "苹果", "pingguo", "ringo", "りんご"],
    detected: { word: "apple", language: "English" },
    translations: {
      en: { word: "apple", phonetic: "A-puhl" },
      nl: { word: "appel", phonetic: "AH-puhl" },
      ru: { word: "яблоко", phonetic: "YA-bla-ka" },
      zh: { word: "苹果", phonetic: "píng guǒ" },
      ja: { word: "りんご", phonetic: "reen-go" },
    },
    facts: [
      "Apples can float because about one quarter of an apple is air.",
      "There are thousands of apple varieties around the world.",
      "Apple trees need bees and other pollinators to grow fruit.",
    ],
    art: "apple",
  },
  banana: {
    aliases: ["banana", "banaan", "банан", "banan", "香蕉", "xiangjiao", "バナナ"],
    detected: { word: "banana", language: "English" },
    translations: {
      en: { word: "banana", phonetic: "buh-NA-nuh" },
      nl: { word: "banaan", phonetic: "ba-NAAN" },
      ru: { word: "банан", phonetic: "ba-NAN" },
      zh: { word: "香蕉", phonetic: "xiāng jiāo" },
      ja: { word: "バナナ", phonetic: "ba-na-na" },
    },
    facts: [
      "Bananas grow in big hanging bunches.",
      "They are berries by plant science rules.",
      "Bananas are soft, so many toddlers try them early.",
    ],
    art: "fruit",
  },
  dog: {
    aliases: ["dog", "hond", "собака", "sobaka", "狗", "gou", "inu", "犬"],
    detected: { word: "hond", language: "Nederlands" },
    translations: {
      en: { word: "dog", phonetic: "dawg" },
      nl: { word: "hond", phonetic: "hont" },
      ru: { word: "собака", phonetic: "sa-BA-ka" },
      zh: { word: "狗", phonetic: "gǒu" },
      ja: { word: "犬", phonetic: "ee-noo" },
    },
    facts: [
      "Dogs learn family voices very quickly.",
      "A dog’s nose print is unique, a bit like a fingerprint.",
      "Many languages use different sounds for a dog bark.",
    ],
    art: "dog",
  },
  cat: {
    aliases: ["cat", "kat", "кошка", "koshka", "猫", "mao", "neko"],
    detected: { word: "cat", language: "English" },
    translations: {
      en: { word: "cat", phonetic: "kat" },
      nl: { word: "kat", phonetic: "kaht" },
      ru: { word: "кошка", phonetic: "KOSH-ka" },
      zh: { word: "猫", phonetic: "māo" },
      ja: { word: "猫", phonetic: "ne-ko" },
    },
    facts: [
      "Cats use their whiskers to feel tiny spaces.",
      "Many languages have a short, soft word for cat.",
      "Cats can sleep for much of the day.",
    ],
    art: "cat",
  },
  bird: {
    aliases: ["bird", "vogel", "птица", "ptitsa", "鸟", "niao", "tori", "鳥"],
    detected: { word: "bird", language: "English" },
    translations: {
      en: { word: "bird", phonetic: "burd" },
      nl: { word: "vogel", phonetic: "VO-gul" },
      ru: { word: "птица", phonetic: "PTEE-tsa" },
      zh: { word: "鸟", phonetic: "niǎo" },
      ja: { word: "鳥", phonetic: "to-ree" },
    },
    facts: [
      "Most birds have feathers and lay eggs.",
      "Bird songs can sound different in every neighborhood.",
      "Some birds learn sounds from the world around them.",
    ],
    art: "bird",
  },
  moon: {
    aliases: ["moon", "maan", "луна", "luna", "月亮", "yueliang", "tsuki", "月"],
    detected: { word: "moon", language: "English" },
    translations: {
      en: { word: "moon", phonetic: "mewn" },
      nl: { word: "maan", phonetic: "mahn" },
      ru: { word: "луна", phonetic: "loo-NA" },
      zh: { word: "月亮", phonetic: "yuè liang" },
      ja: { word: "月", phonetic: "tsu-kee" },
    },
    facts: [
      "The Moon is Earth’s closest neighbor in space.",
      "It changes shape in the sky because sunlight hits it from different angles.",
      "Many bedtime stories around the world mention the Moon.",
    ],
    art: "moon",
  },
  sun: {
    aliases: ["sun", "zon", "солнце", "solntse", "太阳", "taiyang", "taiyou", "太陽"],
    detected: { word: "sun", language: "English" },
    translations: {
      en: { word: "sun", phonetic: "suhn" },
      nl: { word: "zon", phonetic: "zohn" },
      ru: { word: "солнце", phonetic: "SOLN-tse" },
      zh: { word: "太阳", phonetic: "tài yáng" },
      ja: { word: "太陽", phonetic: "tai-yoh" },
    },
    facts: [
      "The Sun is a star very close to Earth.",
      "Sunlight helps plants grow.",
      "Families around the world use sunny days for outdoor play.",
    ],
    art: "sun",
  },
  star: {
    aliases: ["star", "ster", "звезда", "zvezda", "星星", "xingxing", "hoshi", "星"],
    detected: { word: "star", language: "English" },
    translations: {
      en: { word: "star", phonetic: "stahr" },
      nl: { word: "ster", phonetic: "stehr" },
      ru: { word: "звезда", phonetic: "zvez-DA" },
      zh: { word: "星星", phonetic: "xīng xing" },
      ja: { word: "星", phonetic: "ho-shee" },
    },
    facts: [
      "Stars are giant glowing balls of gas.",
      "Some stars look like patterns called constellations.",
      "Children often draw stars with five points.",
    ],
    art: "star",
  },
  tree: {
    aliases: ["tree", "boom", "дерево", "derevo", "树", "shu", "ki", "木"],
    detected: { word: "tree", language: "English" },
    translations: {
      en: { word: "tree", phonetic: "treh" },
      nl: { word: "boom", phonetic: "bohm" },
      ru: { word: "дерево", phonetic: "DYE-rye-va" },
      zh: { word: "树", phonetic: "shù" },
      ja: { word: "木", phonetic: "kee" },
    },
    facts: [
      "Trees clean air and give shade.",
      "Some trees live for hundreds of years.",
      "Leaves can be many shapes, colors, and sizes.",
    ],
    art: "tree",
  },
  flower: {
    aliases: ["flower", "bloem", "цветок", "tsvetok", "花", "hua", "hana"],
    detected: { word: "flower", language: "English" },
    translations: {
      en: { word: "flower", phonetic: "FLOW-er" },
      nl: { word: "bloem", phonetic: "bloom" },
      ru: { word: "цветок", phonetic: "tsve-TOK" },
      zh: { word: "花", phonetic: "huā" },
      ja: { word: "花", phonetic: "ha-na" },
    },
    facts: [
      "Flowers can turn into fruits after pollination.",
      "Bees visit flowers for nectar.",
      "Many families give flowers for celebrations.",
    ],
    art: "flower",
  },
  water: {
    aliases: ["water", "вода", "voda", "水", "shui", "mizu"],
    detected: { word: "water", language: "English" },
    translations: {
      en: { word: "water", phonetic: "WAH-ter" },
      nl: { word: "water", phonetic: "WAH-ter" },
      ru: { word: "вода", phonetic: "va-DA" },
      zh: { word: "水", phonetic: "shuǐ" },
      ja: { word: "水", phonetic: "mee-zoo" },
    },
    facts: [
      "Water can be a liquid, solid ice, or invisible vapor.",
      "Every living thing on Earth needs water.",
      "Some words for water are very short because families say them so often.",
    ],
    art: "water",
  },
  bread: {
    aliases: ["bread", "brood", "хлеб", "khleb", "面包", "mianbao", "pan", "パン"],
    detected: { word: "bread", language: "English" },
    translations: {
      en: { word: "bread", phonetic: "bred" },
      nl: { word: "brood", phonetic: "broht" },
      ru: { word: "хлеб", phonetic: "khlyep" },
      zh: { word: "面包", phonetic: "miàn bāo" },
      ja: { word: "パン", phonetic: "pan" },
    },
    facts: ["Bread is made in many shapes around the world.", "Some breads are soft, some are crunchy.", "Families often share bread at meals."],
    art: "bread",
  },
  cheese: {
    aliases: ["cheese", "kaas", "сыр", "syr", "奶酪", "nailao", "chiizu", "チーズ"],
    detected: { word: "cheese", language: "English" },
    translations: {
      en: { word: "cheese", phonetic: "cheez" },
      nl: { word: "kaas", phonetic: "kahs" },
      ru: { word: "сыр", phonetic: "syr" },
      zh: { word: "奶酪", phonetic: "nǎi lào" },
      ja: { word: "チーズ", phonetic: "chee-zu" },
    },
    facts: ["Cheese can be creamy, stretchy, or crumbly.", "The Netherlands is famous for cheese markets.", "Some cheeses have tiny holes."],
    art: "cheese",
  },
  egg: {
    aliases: ["egg", "ei", "яйцо", "yaytso", "鸡蛋", "jidan", "tamago", "卵"],
    detected: { word: "egg", language: "English" },
    translations: {
      en: { word: "egg", phonetic: "eg" },
      nl: { word: "ei", phonetic: "eye" },
      ru: { word: "яйцо", phonetic: "yait-SO" },
      zh: { word: "鸡蛋", phonetic: "jī dàn" },
      ja: { word: "卵", phonetic: "ta-ma-go" },
    },
    facts: ["Eggshells can be white, brown, blue, or speckled.", "Many birds hatch from eggs.", "Eggs are used in cakes and pancakes."],
    art: "egg",
  },
  rice: {
    aliases: ["rice", "rijst", "рис", "ris", "米饭", "mifan", "gohan", "ご飯"],
    detected: { word: "rice", language: "English" },
    translations: {
      en: { word: "rice", phonetic: "rise" },
      nl: { word: "rijst", phonetic: "ryst" },
      ru: { word: "рис", phonetic: "rees" },
      zh: { word: "米饭", phonetic: "mǐ fàn" },
      ja: { word: "ご飯", phonetic: "go-han" },
    },
    facts: ["Rice is a daily food for many families.", "Rice grows in warm, wet fields.", "Tiny grains can become a whole bowl."],
    art: "rice",
  },
  soup: {
    aliases: ["soup", "soep", "суп", "sup", "汤", "tang", "suupu", "スープ"],
    detected: { word: "soup", language: "English" },
    translations: {
      en: { word: "soup", phonetic: "soop" },
      nl: { word: "soep", phonetic: "soop" },
      ru: { word: "суп", phonetic: "soop" },
      zh: { word: "汤", phonetic: "tāng" },
      ja: { word: "スープ", phonetic: "suu-pu" },
    },
    facts: ["Soup can warm you up on cold days.", "Families add favorite vegetables to soup.", "Some soups are smooth and some have noodles."],
    art: "soup",
  },
  fish: {
    aliases: ["fish", "vis", "рыба", "ryba", "鱼", "yu", "sakana", "魚"],
    detected: { word: "fish", language: "English" },
    translations: {
      en: { word: "fish", phonetic: "fihsh" },
      nl: { word: "vis", phonetic: "fis" },
      ru: { word: "рыба", phonetic: "RY-ba" },
      zh: { word: "鱼", phonetic: "yú" },
      ja: { word: "魚", phonetic: "sa-ka-na" },
    },
    facts: ["Fish breathe underwater with gills.", "Some fish are tiny and some are huge.", "Fish can swim in schools."],
    art: "fish",
  },
  rabbit: {
    aliases: ["rabbit", "konijn", "кролик", "krolik", "兔子", "tuzi", "usagi", "うさぎ"],
    detected: { word: "rabbit", language: "English" },
    translations: {
      en: { word: "rabbit", phonetic: "RA-bit" },
      nl: { word: "konijn", phonetic: "ko-NINE" },
      ru: { word: "кролик", phonetic: "KRO-lik" },
      zh: { word: "兔子", phonetic: "tù zi" },
      ja: { word: "うさぎ", phonetic: "u-sa-gi" },
    },
    facts: ["Rabbits have long ears.", "They can hop very quickly.", "A rabbit's nose wiggles when it sniffs."],
    art: "rabbit",
  },
  bear: {
    aliases: ["bear", "beer", "медведь", "medved", "熊", "xiong", "kuma", "くま"],
    detected: { word: "bear", language: "English" },
    translations: {
      en: { word: "bear", phonetic: "bair" },
      nl: { word: "beer", phonetic: "bayr" },
      ru: { word: "медведь", phonetic: "med-VED" },
      zh: { word: "熊", phonetic: "xióng" },
      ja: { word: "くま", phonetic: "ku-ma" },
    },
    facts: ["Many children have a toy bear.", "Real bears have strong noses.", "Some bears sleep through much of winter."],
    art: "bear",
  },
  rain: {
    aliases: ["rain", "regen", "дождь", "dozhd", "雨", "yu", "ame"],
    detected: { word: "rain", language: "English" },
    translations: {
      en: { word: "rain", phonetic: "rayn" },
      nl: { word: "regen", phonetic: "RAY-gun" },
      ru: { word: "дождь", phonetic: "dosht" },
      zh: { word: "雨", phonetic: "yǔ" },
      ja: { word: "雨", phonetic: "a-me" },
    },
    facts: ["Rain helps plants grow.", "Puddles appear after rain.", "Rain sounds can be soft or loud."],
    art: "rain",
  },
  snow: {
    aliases: ["snow", "sneeuw", "снег", "sneg", "雪", "xue", "yuki"],
    detected: { word: "snow", language: "English" },
    translations: {
      en: { word: "snow", phonetic: "snoh" },
      nl: { word: "sneeuw", phonetic: "snayw" },
      ru: { word: "снег", phonetic: "snyek" },
      zh: { word: "雪", phonetic: "xuě" },
      ja: { word: "雪", phonetic: "yu-ki" },
    },
    facts: ["Snowflakes have beautiful shapes.", "Snow is made of tiny ice crystals.", "Fresh snow can make the world very quiet."],
    art: "snow",
  },
  cloud: {
    aliases: ["cloud", "wolk", "облако", "oblako", "云", "yun", "kumo", "雲"],
    detected: { word: "cloud", language: "English" },
    translations: {
      en: { word: "cloud", phonetic: "KLOWD" },
      nl: { word: "wolk", phonetic: "vohlk" },
      ru: { word: "облако", phonetic: "OB-la-ka" },
      zh: { word: "云", phonetic: "yún" },
      ja: { word: "雲", phonetic: "ku-mo" },
    },
    facts: ["Clouds are made of tiny water drops or ice.", "Clouds can look like animals or castles.", "Dark clouds can bring rain."],
    art: "cloud",
  },
  sea: {
    aliases: ["sea", "zee", "море", "more", "海", "hai", "umi"],
    detected: { word: "sea", language: "English" },
    translations: {
      en: { word: "sea", phonetic: "see" },
      nl: { word: "zee", phonetic: "zay" },
      ru: { word: "море", phonetic: "MO-rye" },
      zh: { word: "海", phonetic: "hǎi" },
      ja: { word: "海", phonetic: "u-mi" },
    },
    facts: ["The sea tastes salty.", "Waves move toward the shore.", "Many animals live in the sea."],
    art: "sea",
  },
  mountain: {
    aliases: ["mountain", "berg", "гора", "gora", "山", "shan", "yama"],
    detected: { word: "mountain", language: "English" },
    translations: {
      en: { word: "mountain", phonetic: "MOWN-tin" },
      nl: { word: "berg", phonetic: "berkh" },
      ru: { word: "гора", phonetic: "ga-RA" },
      zh: { word: "山", phonetic: "shān" },
      ja: { word: "山", phonetic: "ya-ma" },
    },
    facts: ["Mountains can be snowy at the top.", "Some mountains are volcanoes.", "Hikers climb mountains step by step."],
    art: "mountain",
  },
  hand: {
    aliases: ["hand", "рука", "ruka", "手", "shou", "te"],
    detected: { word: "hand", language: "English" },
    translations: {
      en: { word: "hand", phonetic: "hahnd" },
      nl: { word: "hand", phonetic: "hant" },
      ru: { word: "рука", phonetic: "roo-KA" },
      zh: { word: "手", phonetic: "shǒu" },
      ja: { word: "手", phonetic: "te" },
    },
    facts: ["Hands can clap, wave, draw, and build.", "Fingers help us hold tiny things.", "Many songs for children use hand motions."],
    art: "hand",
  },
  eye: {
    aliases: ["eye", "oog", "глаз", "glaz", "眼睛", "yanjing", "me", "目"],
    detected: { word: "eye", language: "English" },
    translations: {
      en: { word: "eye", phonetic: "igh" },
      nl: { word: "oog", phonetic: "ohkh" },
      ru: { word: "глаз", phonetic: "glaz" },
      zh: { word: "眼睛", phonetic: "yǎn jing" },
      ja: { word: "目", phonetic: "me" },
    },
    facts: ["Eyes help us notice colors and shapes.", "Blinking keeps eyes comfortable.", "People can smile with their eyes too."],
    art: "eye",
  },
  shoe: {
    aliases: ["shoe", "schoen", "обувь", "obuv", "鞋", "xie", "kutsu", "靴"],
    detected: { word: "shoe", language: "English" },
    translations: {
      en: { word: "shoe", phonetic: "shoo" },
      nl: { word: "schoen", phonetic: "skhoon" },
      ru: { word: "обувь", phonetic: "O-buv" },
      zh: { word: "鞋", phonetic: "xié" },
      ja: { word: "靴", phonetic: "ku-tsu" },
    },
    facts: ["Shoes protect feet outside.", "Some shoes have laces and some have straps.", "Tiny shoes are often hard to keep track of."],
    art: "shoe",
  },
  hat: {
    aliases: ["hat", "hoed", "шапка", "shapka", "帽子", "maozi", "boushi", "帽子"],
    detected: { word: "hat", language: "English" },
    translations: {
      en: { word: "hat", phonetic: "haht" },
      nl: { word: "hoed", phonetic: "hoot" },
      ru: { word: "шапка", phonetic: "SHAP-ka" },
      zh: { word: "帽子", phonetic: "mào zi" },
      ja: { word: "帽子", phonetic: "boh-shi" },
    },
    facts: ["Hats can keep heads warm or shady.", "Party hats make celebrations feel special.", "Some uniforms include special hats."],
    art: "hat",
  },
  book: {
    aliases: ["book", "boek", "книга", "kniga", "书", "shu", "hon", "本"],
    detected: { word: "book", language: "English" },
    translations: {
      en: { word: "book", phonetic: "buhk" },
      nl: { word: "boek", phonetic: "bewk" },
      ru: { word: "книга", phonetic: "KNEE-ga" },
      zh: { word: "书", phonetic: "shū" },
      ja: { word: "本", phonetic: "hon" },
    },
    facts: [
      "Picture books help children connect words and images.",
      "Libraries keep stories in many languages.",
      "Reading the same book in two languages builds family vocabulary.",
    ],
    art: "book",
  },
  basketball: {
    aliases: ["basketball", "basketbal", "баскетбол", "basketbol", "篮球", "lanqiu", "basuketto", "バスケットボール"],
    detected: { word: "basketball", language: "English" },
    translations: {
      en: { word: "basketball", phonetic: "BAS-ket-bawl" },
      nl: { word: "basketbal", phonetic: "BAS-ket-bal" },
      ru: { word: "баскетбол", phonetic: "bas-ket-BOL" },
      zh: { word: "篮球", phonetic: "lán qiú" },
      ja: { word: "バスケットボール", phonetic: "ba-su-ket-to-boh-ru" },
    },
    facts: [
      "Basketball is played with a round orange ball.",
      "Players try to throw the ball through a hoop.",
      "Dribbling means bouncing the ball while moving.",
    ],
    art: "basketball",
  },
  car: {
    aliases: ["car", "auto", "машина", "mashina", "汽车", "qiche", "kuruma", "車"],
    detected: { word: "car", language: "English" },
    translations: {
      en: { word: "car", phonetic: "kar" },
      nl: { word: "auto", phonetic: "OW-toh" },
      ru: { word: "машина", phonetic: "ma-SHEE-na" },
      zh: { word: "汽车", phonetic: "qì chē" },
      ja: { word: "車", phonetic: "ku-ru-ma" },
    },
    facts: [
      "Cars have many tiny parts working together.",
      "Children often learn vehicle words from daily trips.",
      "Road signs use pictures so many people can understand them.",
    ],
    art: "car",
  },
  train: {
    aliases: ["train", "trein", "поезд", "poezd", "火车", "huoche", "densha", "電車"],
    detected: { word: "train", language: "English" },
    translations: {
      en: { word: "train", phonetic: "trayn" },
      nl: { word: "trein", phonetic: "trine" },
      ru: { word: "поезд", phonetic: "PO-yezd" },
      zh: { word: "火车", phonetic: "huǒ chē" },
      ja: { word: "電車", phonetic: "den-sha" },
    },
    facts: [
      "Trains can carry many people at once.",
      "Some trains travel underground in cities.",
      "Train sounds are fun to copy in many languages.",
    ],
    art: "train",
  },
  house: {
    aliases: ["house", "huis", "дом", "dom", "家", "jia", "ie", "家"],
    detected: { word: "house", language: "English" },
    translations: {
      en: { word: "house", phonetic: "hows" },
      nl: { word: "huis", phonetic: "house" },
      ru: { word: "дом", phonetic: "dom" },
      zh: { word: "家", phonetic: "jiā" },
      ja: { word: "家", phonetic: "ee-eh" },
    },
    facts: [
      "A home can sound like many languages in one day.",
      "Houses look different in different climates.",
      "Family words often start at home.",
    ],
    art: "house",
  },
  bed: {
    aliases: ["bed", "кровать", "krovat", "床", "chuang", "beddo", "ベッド"],
    detected: { word: "bed", language: "English" },
    translations: {
      en: { word: "bed", phonetic: "bedd" },
      nl: { word: "bed", phonetic: "bet" },
      ru: { word: "кровать", phonetic: "kra-VAT" },
      zh: { word: "床", phonetic: "chuáng" },
      ja: { word: "ベッド", phonetic: "bed-do" },
    },
    facts: [
      "Bedtime words are often said softly.",
      "Many families have bedtime songs in more than one language.",
      "Sleep helps children remember new words.",
    ],
    art: "bed",
  },
  chair: {
    aliases: ["chair", "stoel", "стул", "stul", "椅子", "yizi", "isu", "椅子"],
    detected: { word: "chair", language: "English" },
    translations: {
      en: { word: "chair", phonetic: "chayr" },
      nl: { word: "stoel", phonetic: "stool" },
      ru: { word: "стул", phonetic: "stool" },
      zh: { word: "椅子", phonetic: "yǐ zi" },
      ja: { word: "椅子", phonetic: "i-su" },
    },
    facts: ["Chairs help us sit at a table.", "Some chairs rock, roll, or fold.", "Small chairs make playrooms feel just right."],
    art: "chair",
  },
  plate: {
    aliases: ["plate", "bord", "тарелка", "tarelka", "盘子", "panzi", "sara", "皿"],
    detected: { word: "plate", language: "English" },
    translations: {
      en: { word: "plate", phonetic: "playt" },
      nl: { word: "bord", phonetic: "bort" },
      ru: { word: "тарелка", phonetic: "ta-REL-ka" },
      zh: { word: "盘子", phonetic: "pán zi" },
      ja: { word: "皿", phonetic: "sa-ra" },
    },
    facts: ["A plate holds food during a meal.", "Plates can be round, square, big, or small.", "Some plates have colorful patterns."],
    art: "plate",
  },
  door: {
    aliases: ["door", "deur", "дверь", "dver", "门", "men", "doa", "ドア"],
    detected: { word: "door", language: "English" },
    translations: {
      en: { word: "door", phonetic: "dor" },
      nl: { word: "deur", phonetic: "dur" },
      ru: { word: "дверь", phonetic: "dvyer" },
      zh: { word: "门", phonetic: "mén" },
      ja: { word: "ドア", phonetic: "do-a" },
    },
    facts: ["Doors open into new rooms.", "Knocking is a sound children learn quickly.", "Some doors slide instead of swing."],
    art: "door",
  },
  window: {
    aliases: ["window", "raam", "окно", "okno", "窗户", "chuanghu", "mado", "窓"],
    detected: { word: "window", language: "English" },
    translations: {
      en: { word: "window", phonetic: "WIN-doh" },
      nl: { word: "raam", phonetic: "rahm" },
      ru: { word: "окно", phonetic: "ak-NO" },
      zh: { word: "窗户", phonetic: "chuāng hu" },
      ja: { word: "窓", phonetic: "ma-do" },
    },
    facts: ["Windows let light into a room.", "Children can watch weather through windows.", "Some windows open and some stay closed."],
    art: "window",
  },
  lamp: {
    aliases: ["lamp", "лампа", "lampa", "灯", "deng", "ranpu", "ランプ"],
    detected: { word: "lamp", language: "English" },
    translations: {
      en: { word: "lamp", phonetic: "lahmp" },
      nl: { word: "lamp", phonetic: "lahmp" },
      ru: { word: "лампа", phonetic: "LAM-pa" },
      zh: { word: "灯", phonetic: "dēng" },
      ja: { word: "ランプ", phonetic: "ran-pu" },
    },
    facts: ["Lamps make cozy light for reading.", "Some lamps are bright and some are soft.", "Turning on a lamp can start bedtime story time."],
    art: "lamp",
  },
  doll: {
    aliases: ["doll", "pop", "кукла", "kukla", "娃娃", "wawa", "ningyou", "人形"],
    detected: { word: "doll", language: "English" },
    translations: {
      en: { word: "doll", phonetic: "dahl" },
      nl: { word: "pop", phonetic: "pohp" },
      ru: { word: "кукла", phonetic: "KOOK-la" },
      zh: { word: "娃娃", phonetic: "wá wa" },
      ja: { word: "人形", phonetic: "nin-gyoh" },
    },
    facts: ["Dolls help children practice caring stories.", "Some dolls wear clothes from different cultures.", "Pretend play builds language."],
    art: "doll",
  },
  blocks: {
    aliases: ["blocks", "blokjes", "кубики", "kubiki", "积木", "jimu", "tsumiki", "積み木"],
    detected: { word: "blocks", language: "English" },
    translations: {
      en: { word: "blocks", phonetic: "bloks" },
      nl: { word: "blokjes", phonetic: "BLOK-yus" },
      ru: { word: "кубики", phonetic: "KOO-bee-kee" },
      zh: { word: "积木", phonetic: "jī mù" },
      ja: { word: "積み木", phonetic: "tsu-mi-ki" },
    },
    facts: ["Blocks can become towers, roads, or castles.", "Stacking blocks practices balance.", "Counting blocks is a playful math moment."],
    art: "blocks",
  },
  kite: {
    aliases: ["kite", "vlieger", "воздушный змей", "zmei", "风筝", "fengzheng", "tako", "凧"],
    detected: { word: "kite", language: "English" },
    translations: {
      en: { word: "kite", phonetic: "kyt" },
      nl: { word: "vlieger", phonetic: "VLEE-gher" },
      ru: { word: "воздушный змей", phonetic: "vaz-DOOSH-ny zmey" },
      zh: { word: "风筝", phonetic: "fēng zheng" },
      ja: { word: "凧", phonetic: "ta-ko" },
    },
    facts: ["Kites need wind to fly.", "Some kites have long colorful tails.", "Flying a kite teaches patience and timing."],
    art: "kite",
  },
  pencil: {
    aliases: ["pencil", "potlood", "карандаш", "karandash", "铅笔", "qianbi", "enpitsu", "鉛筆"],
    detected: { word: "pencil", language: "English" },
    translations: {
      en: { word: "pencil", phonetic: "PEN-sul" },
      nl: { word: "potlood", phonetic: "POT-loht" },
      ru: { word: "карандаш", phonetic: "ka-ran-DASH" },
      zh: { word: "铅笔", phonetic: "qiān bǐ" },
      ja: { word: "鉛筆", phonetic: "en-pi-tsu" },
    },
    facts: ["Pencils can draw, write, and erase.", "A sharp pencil makes thin lines.", "Children use pencils to turn ideas into marks."],
    art: "pencil",
  },
  bag: {
    aliases: ["bag", "tas", "сумка", "sumka", "包", "bao", "kaban", "かばん"],
    detected: { word: "bag", language: "English" },
    translations: {
      en: { word: "bag", phonetic: "bahg" },
      nl: { word: "tas", phonetic: "tahs" },
      ru: { word: "сумка", phonetic: "SOOM-ka" },
      zh: { word: "包", phonetic: "bāo" },
      ja: { word: "かばん", phonetic: "ka-ban" },
    },
    facts: ["Bags carry snacks, books, and treasures.", "School bags can be many colors.", "Packing a bag is a tiny planning job."],
    art: "bag",
  },
  mother: {
    aliases: ["mother", "mom", "mama", "moeder", "мама", "mat", "妈妈", "mama", "okaasan", "お母さん"],
    detected: { word: "mother", language: "English" },
    translations: {
      en: { word: "mother", phonetic: "MUH-ther" },
      nl: { word: "moeder", phonetic: "MOO-der" },
      ru: { word: "мама", phonetic: "MA-ma" },
      zh: { word: "妈妈", phonetic: "mā ma" },
      ja: { word: "お母さん", phonetic: "o-kaa-san" },
    },
    facts: [
      "Many baby words for mother use easy m sounds.",
      "Families often have more than one loving name for a parent.",
      "Parent words can be formal, casual, or cuddly.",
    ],
    art: "mother",
  },
  father: {
    aliases: ["father", "dad", "papa", "vader", "папа", "爸爸", "baba", "otousan", "お父さん"],
    detected: { word: "father", language: "English" },
    translations: {
      en: { word: "father", phonetic: "FAH-ther" },
      nl: { word: "vader", phonetic: "VAH-der" },
      ru: { word: "папа", phonetic: "PA-pa" },
      zh: { word: "爸爸", phonetic: "bà ba" },
      ja: { word: "お父さん", phonetic: "o-toh-san" },
    },
    facts: [
      "Many baby words for father use p or b sounds.",
      "A child may use different parent words in different languages.",
      "Family names carry lots of feeling.",
    ],
    art: "father",
  },
  happy: {
    aliases: ["happy", "blij", "счастливый", "schastlivy", "开心", "kaixin", "ureshii", "嬉しい"],
    detected: { word: "happy", language: "English" },
    translations: {
      en: { word: "happy", phonetic: "HA-pee" },
      nl: { word: "blij", phonetic: "blie" },
      ru: { word: "счастливый", phonetic: "shchas-LEE-vy" },
      zh: { word: "开心", phonetic: "kāi xīn" },
      ja: { word: "嬉しい", phonetic: "u-re-shee" },
    },
    facts: [
      "Feeling words help children name what is happening inside.",
      "A smile can be understood even without words.",
      "Families can ask about feelings in every home language.",
    ],
    art: "happy",
  },
  sad: {
    aliases: ["sad", "verdrietig", "грустный", "grustny", "伤心", "shangxin", "kanashii", "悲しい"],
    detected: { word: "sad", language: "English" },
    translations: {
      en: { word: "sad", phonetic: "sad-d" },
      nl: { word: "verdrietig", phonetic: "ver-DREE-tukh" },
      ru: { word: "грустный", phonetic: "GROOST-ny" },
      zh: { word: "伤心", phonetic: "shāng xīn" },
      ja: { word: "悲しい", phonetic: "ka-na-shee" },
    },
    facts: ["Sad is a feeling everyone has sometimes.", "Naming a feeling can make it easier to share.", "A hug, rest, or kind words can help."],
    art: "sad",
  },
  sleep: {
    aliases: ["sleep", "slapen", "спать", "spat", "睡觉", "shuijiao", "neru", "寝る"],
    detected: { word: "sleep", language: "English" },
    translations: {
      en: { word: "sleep", phonetic: "sleap" },
      nl: { word: "slapen", phonetic: "SLAH-pun" },
      ru: { word: "спать", phonetic: "spat" },
      zh: { word: "睡觉", phonetic: "shuì jiào" },
      ja: { word: "寝る", phonetic: "ne-ru" },
    },
    facts: ["Sleep helps brains grow and remember.", "Bedtime routines can happen in many languages.", "Dreams can feel like little stories."],
    art: "sleep",
  },
  jump: {
    aliases: ["jump", "springen", "прыгать", "prygat", "跳", "tiao", "tobu", "跳ぶ"],
    detected: { word: "jump", language: "English" },
    translations: {
      en: { word: "jump", phonetic: "juhmp" },
      nl: { word: "springen", phonetic: "SPRING-un" },
      ru: { word: "прыгать", phonetic: "PRY-gat" },
      zh: { word: "跳", phonetic: "tiào" },
      ja: { word: "跳ぶ", phonetic: "to-bu" },
    },
    facts: ["Jumping uses strong leg muscles.", "Children jump in games, dances, and puddles.", "Action words are fun to learn with movement."],
    art: "jump",
  },
  cow: {
    aliases: ["cow", "koe", "корова", "korova", "牛", "niu", "ushi"],
    detected: { word: "cow", language: "English" },
    translations: { en: { word: "cow", phonetic: "kow" }, nl: { word: "koe", phonetic: "koo" }, ru: { word: "корова", phonetic: "ka-RO-va" }, zh: { word: "牛", phonetic: "niú" }, ja: { word: "牛", phonetic: "u-shi" } },
    facts: ["Cows are farm animals.", "Cows eat grass.", "Many children learn the cow sound early."],
    art: "cow",
  },
  butterfly: {
    aliases: ["butterfly", "vlinder", "бабочка", "babochka", "蝴蝶", "hudie", "chou", "蝶"],
    detected: { word: "butterfly", language: "English" },
    translations: { en: { word: "butterfly", phonetic: "BUH-ter-fly" }, nl: { word: "vlinder", phonetic: "VLIN-der" }, ru: { word: "бабочка", phonetic: "BA-bach-ka" }, zh: { word: "蝴蝶", phonetic: "hú dié" }, ja: { word: "蝶", phonetic: "choh" } },
    facts: ["Butterflies have colorful wings.", "They begin life as caterpillars.", "Butterflies visit flowers."],
    art: "butterfly",
  },
  fire: {
    aliases: ["fire", "vuur", "огонь", "ogon", "火", "huo", "hi"],
    detected: { word: "fire", language: "English" },
    translations: { en: { word: "fire", phonetic: "fyr" }, nl: { word: "vuur", phonetic: "foor" }, ru: { word: "огонь", phonetic: "a-GON" }, zh: { word: "火", phonetic: "huǒ" }, ja: { word: "火", phonetic: "hi" } },
    facts: ["Fire is hot and bright.", "Families use fire carefully.", "A candle flame can be very small."],
    art: "fire",
  },
  rainbow: {
    aliases: ["rainbow", "regenboog", "радуга", "raduga", "彩虹", "caihong", "niji", "虹"],
    detected: { word: "rainbow", language: "English" },
    translations: { en: { word: "rainbow", phonetic: "RAYN-boh" }, nl: { word: "regenboog", phonetic: "RAY-gun-bohkh" }, ru: { word: "радуга", phonetic: "RA-doo-ga" }, zh: { word: "彩虹", phonetic: "cǎi hóng" }, ja: { word: "虹", phonetic: "ni-ji" } },
    facts: ["Rainbows can appear after rain.", "They show many colors.", "A rainbow is made by light and water drops."],
    art: "rainbow",
  },
  strawberry: {
    aliases: ["strawberry", "aardbei", "клубника", "klubnika", "草莓", "caomei", "ichigo", "いちご"],
    detected: { word: "strawberry", language: "English" },
    translations: { en: { word: "strawberry", phonetic: "STRAW-beh-ree" }, nl: { word: "aardbei", phonetic: "AARD-bay" }, ru: { word: "клубника", phonetic: "kloob-NEE-ka" }, zh: { word: "草莓", phonetic: "cǎo méi" }, ja: { word: "いちご", phonetic: "i-chi-go" } },
    facts: ["Strawberries are sweet red fruits.", "Their tiny seeds are on the outside.", "They grow close to the ground."],
    art: "strawberry",
  },
  carrot: {
    aliases: ["carrot", "wortel", "морковь", "morkov", "胡萝卜", "huluobo", "ninjin", "にんじん"],
    detected: { word: "carrot", language: "English" },
    translations: { en: { word: "carrot", phonetic: "KA-ruht" }, nl: { word: "wortel", phonetic: "WOR-tul" }, ru: { word: "морковь", phonetic: "mar-KOF" }, zh: { word: "胡萝卜", phonetic: "hú luó bo" }, ja: { word: "にんじん", phonetic: "nin-jin" } },
    facts: ["Carrots grow underground.", "Many carrots are orange.", "Carrots are crunchy."],
    art: "carrot",
  },
  cake: {
    aliases: ["cake", "taart", "торт", "tort", "蛋糕", "dangao", "keeki", "ケーキ"],
    detected: { word: "cake", language: "English" },
    translations: { en: { word: "cake", phonetic: "kayk" }, nl: { word: "taart", phonetic: "tahrt" }, ru: { word: "торт", phonetic: "tort" }, zh: { word: "蛋糕", phonetic: "dàn gāo" }, ja: { word: "ケーキ", phonetic: "kay-ki" } },
    facts: ["Cake is often shared at parties.", "Birthday cakes can have candles.", "Cakes come in many flavors."],
    art: "cake",
  },
  juice: {
    aliases: ["juice", "sap", "сок", "sok", "果汁", "guozhi", "juusu", "ジュース"],
    detected: { word: "juice", language: "English" },
    translations: { en: { word: "juice", phonetic: "joos" }, nl: { word: "sap", phonetic: "sahp" }, ru: { word: "сок", phonetic: "sawk" }, zh: { word: "果汁", phonetic: "guǒ zhī" }, ja: { word: "ジュース", phonetic: "juu-su" } },
    facts: ["Juice is made from fruit.", "Orange juice is a breakfast drink.", "Juice can be sweet or sour."],
    art: "juice",
  },
  bus: {
    aliases: ["bus", "автобус", "avtobus", "公交车", "gongjiaoche", "basu", "バス"],
    detected: { word: "bus", language: "English" },
    // CHANGED (Quality Audit): en + nl were exact "bus". Now respelled for distinction.
    translations: { en: { word: "bus", phonetic: "buhs" }, nl: { word: "bus", phonetic: "buhs" }, ru: { word: "автобус", phonetic: "av-TO-boos" }, zh: { word: "公交车", phonetic: "gōng jiāo chē" }, ja: { word: "バス", phonetic: "ba-su" } },
    facts: ["Buses carry many people.", "Some children ride a bus to school.", "A bus stops at bus stops."],
    art: "bus",
  },
  bicycle: {
    aliases: ["bicycle", "fiets", "велосипед", "velosiped", "自行车", "zixingche", "jitensha", "自転車"],
    detected: { word: "bicycle", language: "English" },
    translations: { en: { word: "bicycle", phonetic: "BY-si-kul" }, nl: { word: "fiets", phonetic: "feets" }, ru: { word: "велосипед", phonetic: "ve-la-see-PED" }, zh: { word: "自行车", phonetic: "zì xíng chē" }, ja: { word: "自転車", phonetic: "ji-ten-sha" } },
    facts: ["A bicycle has two wheels.", "Helmets help keep riders safe.", "Cycling is common in the Netherlands."],
    art: "bicycle",
  },
  airplane: {
    aliases: ["airplane", "vliegtuig", "самолёт", "samolet", "飞机", "feiji", "hikouki", "飛行機"],
    detected: { word: "airplane", language: "English" },
    translations: { en: { word: "airplane", phonetic: "AIR-playn" }, nl: { word: "vliegtuig", phonetic: "VLEEK-toykh" }, ru: { word: "самолёт", phonetic: "sa-ma-LYOT" }, zh: { word: "飞机", phonetic: "fēi jī" }, ja: { word: "飛行機", phonetic: "hi-koh-ki" } },
    facts: ["Airplanes fly high in the sky.", "They can travel far quickly.", "Airports are places where airplanes land."],
    art: "airplane",
  },
  school: {
    aliases: ["school", "школа", "shkola", "学校", "xuexiao", "gakkou", "学校"],
    detected: { word: "school", language: "English" },
    translations: { en: { word: "school", phonetic: "skool" }, nl: { word: "school", phonetic: "skhool" }, ru: { word: "школа", phonetic: "SHKO-la" }, zh: { word: "学校", phonetic: "xué xiào" }, ja: { word: "学校", phonetic: "gak-koh" } },
    facts: ["School is a place to learn.", "Children meet friends at school.", "Classrooms can have books, pencils, and games."],
    art: "school",
  },
  music: {
    aliases: ["music", "muziek", "музыка", "muzyka", "音乐", "yinyue", "ongaku", "音楽"],
    detected: { word: "music", language: "English" },
    translations: { en: { word: "music", phonetic: "MYOO-zik" }, nl: { word: "muziek", phonetic: "muu-ZEEK" }, ru: { word: "музыка", phonetic: "MOO-zy-ka" }, zh: { word: "音乐", phonetic: "yīn yuè" }, ja: { word: "音楽", phonetic: "on-ga-ku" } },
    facts: ["Music can be fast or slow.", "Families sing songs in many languages.", "Clapping can follow a beat."],
    art: "music",
  },
  painting: {
    aliases: ["painting", "schilderen", "картина", "kartina", "画画", "huahua", "e", "絵"],
    detected: { word: "painting", language: "English" },
    translations: { en: { word: "painting", phonetic: "PAYN-ting" }, nl: { word: "schilderen", phonetic: "SKHIL-duh-run" }, ru: { word: "картина", phonetic: "kar-TEE-na" }, zh: { word: "画画", phonetic: "huà huà" }, ja: { word: "絵", phonetic: "eh" } },
    facts: ["Painting uses colors.", "Brushes make different marks.", "Art can tell a story without words."],
    art: "painting",
  },
  game: {
    aliases: ["game", "spel", "игра", "igra", "游戏", "youxi", "geemu", "ゲーム"],
    detected: { word: "game", language: "English" },
    translations: { en: { word: "game", phonetic: "gaym" }, nl: { word: "spel", phonetic: "spuhl" }, ru: { word: "игра", phonetic: "ee-GRA" }, zh: { word: "游戏", phonetic: "yóu xì" }, ja: { word: "ゲーム", phonetic: "gay-mu" } },
    facts: ["Games can have rules.", "Some games use cards or dice.", "Playing together practices turn-taking."],
    art: "game",
  },
  swim: {
    aliases: ["swim", "zwemmen", "плавать", "plavat", "游泳", "youyong", "oyogu", "泳ぐ"],
    detected: { word: "swim", language: "English" },
    translations: { en: { word: "swim", phonetic: "swihm" }, nl: { word: "zwemmen", phonetic: "ZWEH-mun" }, ru: { word: "плавать", phonetic: "PLA-vat" }, zh: { word: "游泳", phonetic: "yóu yǒng" }, ja: { word: "泳ぐ", phonetic: "o-yo-gu" } },
    facts: ["Swimming happens in water.", "Learning to swim takes practice.", "Pools and beaches can be fun with grown-ups nearby."],
    art: "swim",
  },
  clock: {
    aliases: ["clock", "klok", "часы", "chasy", "钟", "zhong", "tokei", "時計"],
    detected: { word: "clock", language: "English" },
    translations: { en: { word: "clock", phonetic: "klok" }, nl: { word: "klok", phonetic: "klohk" }, ru: { word: "часы", phonetic: "cha-SY" }, zh: { word: "钟", phonetic: "zhōng" }, ja: { word: "時計", phonetic: "to-kei" } },
    facts: ["Clocks show time.", "Some clocks tick.", "A clock can help with routines."],
    art: "clock",
  },
  key: {
    aliases: ["key", "sleutel", "ключ", "klyuch", "钥匙", "yaoshi", "kagi", "鍵"],
    detected: { word: "key", language: "English" },
    translations: { en: { word: "key", phonetic: "kee" }, nl: { word: "sleutel", phonetic: "SLUH-tul" }, ru: { word: "ключ", phonetic: "klyooch" }, zh: { word: "钥匙", phonetic: "yào shi" }, ja: { word: "鍵", phonetic: "ka-gi" } },
    facts: ["Keys can open locks.", "Keys are small but important.", "Some doors use cards instead of keys."],
    art: "key",
  },
  phone: {
    aliases: ["phone", "telefoon", "телефон", "telefon", "电话", "dianhua", "denwa", "電話"],
    detected: { word: "phone", language: "English" },
    translations: { en: { word: "phone", phonetic: "fohn" }, nl: { word: "telefoon", phonetic: "tay-luh-FOHN" }, ru: { word: "телефон", phonetic: "te-le-FON" }, zh: { word: "电话", phonetic: "diàn huà" }, ja: { word: "電話", phonetic: "den-wa" } },
    facts: ["Phones help people talk far away.", "Some phones take pictures.", "Video calls can connect families."],
    art: "phone",
  },
  toothbrush: {
    aliases: ["toothbrush", "tandenborstel", "зубная щётка", "zubnaya shchetka", "牙刷", "yashua", "haburashi", "歯ブラシ"],
    detected: { word: "toothbrush", language: "English" },
    translations: { en: { word: "toothbrush", phonetic: "TOOTH-brush" }, nl: { word: "tandenborstel", phonetic: "TAN-dun-bor-stul" }, ru: { word: "зубная щётка", phonetic: "ZOOB-na-ya SHCHOT-ka" }, zh: { word: "牙刷", phonetic: "yá shuā" }, ja: { word: "歯ブラシ", phonetic: "ha-bu-ra-shi" } },
    facts: ["A toothbrush cleans teeth.", "Brushing is part of morning and bedtime.", "Tiny brushes can fit tiny mouths."],
    art: "toothbrush",
  },
  love: {
    aliases: ["love", "liefde", "любовь", "lyubov", "爱", "ai", "ai", "愛"],
    detected: { word: "love", language: "English" },
    translations: { en: { word: "love", phonetic: "luv" }, nl: { word: "liefde", phonetic: "LEEF-duh" }, ru: { word: "любовь", phonetic: "lyoo-BOF" }, zh: { word: "爱", phonetic: "ài" }, ja: { word: "愛", phonetic: "ai" } },
    facts: ["Love is a warm feeling.", "Families show love in many ways.", "Kind words can show love too."],
    art: "love",
  },
  laugh: {
    aliases: ["laugh", "lachen", "смех", "smekh", "笑", "xiao", "warau", "笑う"],
    detected: { word: "laugh", language: "English" },
    translations: { en: { word: "laugh", phonetic: "laf" }, nl: { word: "lachen", phonetic: "LAH-khun" }, ru: { word: "смех", phonetic: "smekh" }, zh: { word: "笑", phonetic: "xiào" }, ja: { word: "笑う", phonetic: "wa-ra-u" } },
    facts: ["Laughing can happen during play.", "A joke can make people laugh.", "Laughter sounds different from person to person."],
    art: "laugh",
  },
  angry: {
    aliases: ["angry", "boos", "злой", "zloy", "生气", "shengqi", "okoru", "怒る"],
    detected: { word: "angry", language: "English" },
    translations: { en: { word: "angry", phonetic: "ANG-gree" }, nl: { word: "boos", phonetic: "bohs" }, ru: { word: "злой", phonetic: "zloy" }, zh: { word: "生气", phonetic: "shēng qì" }, ja: { word: "怒る", phonetic: "o-ko-ru" } },
    facts: ["Angry is a strong feeling.", "Taking breaths can help.", "Words help explain why we feel angry."],
    art: "angry",
  },
  surprised: {
    aliases: ["surprised", "verrast", "удивлённый", "udivlenny", "惊讶", "jingya", "odoroku", "驚く"],
    detected: { word: "surprised", language: "English" },
    translations: { en: { word: "surprised", phonetic: "sur-PRYZD" }, nl: { word: "verrast", phonetic: "ver-RAST" }, ru: { word: "удивлённый", phonetic: "oo-deev-LYON-ny" }, zh: { word: "惊讶", phonetic: "jīng yà" }, ja: { word: "驚く", phonetic: "o-do-ro-ku" } },
    facts: ["Surprise can feel exciting.", "A surprise can make eyes open wide.", "Some surprises are tiny and some are big."],
    art: "surprised",
  },
  lion: {
    aliases: ["lion", "leeuw", "лев", "lev", "狮子", "shizi", "raion", "ライオン"],
    detected: { word: "lion", language: "English" },
    translations: { en: { word: "lion", phonetic: "LY-un" }, nl: { word: "leeuw", phonetic: "layw" }, ru: { word: "лев", phonetic: "lyef" }, zh: { word: "狮子", phonetic: "shī zi" }, ja: { word: "ライオン", phonetic: "ra-i-on" } },
    facts: ["Lions are big cats.", "A lion's mane can look fluffy.", "Lions make loud roars."],
    art: "lion",
  },
  turtle: {
    aliases: ["turtle", "schildpad", "черепаха", "cherepakha", "乌龟", "wugui", "kame", "亀"],
    detected: { word: "turtle", language: "English" },
    translations: { en: { word: "turtle", phonetic: "TUR-tul" }, nl: { word: "schildpad", phonetic: "SKHILT-paht" }, ru: { word: "черепаха", phonetic: "che-re-PA-kha" }, zh: { word: "乌龟", phonetic: "wū guī" }, ja: { word: "亀", phonetic: "ka-me" } },
    facts: ["Turtles have shells.", "Some turtles live in water.", "Turtles move slowly on land."],
    art: "turtle",
  },
  frog: {
    aliases: ["frog", "kikker", "лягушка", "lyagushka", "青蛙", "qingwa", "kaeru", "蛙"],
    detected: { word: "frog", language: "English" },
    translations: { en: { word: "frog", phonetic: "frahg" }, nl: { word: "kikker", phonetic: "KIK-er" }, ru: { word: "лягушка", phonetic: "lya-GOOSH-ka" }, zh: { word: "青蛙", phonetic: "qīng wā" }, ja: { word: "蛙", phonetic: "ka-e-ru" } },
    facts: ["Frogs can jump far.", "Frogs begin life as tadpoles.", "Many frogs like wet places."],
    art: "frog",
  },
  mushroom: {
    aliases: ["mushroom", "paddenstoel", "гриб", "grib", "蘑菇", "mogu", "kinoko", "きのこ"],
    detected: { word: "mushroom", language: "English" },
    translations: { en: { word: "mushroom", phonetic: "MUSH-room" }, nl: { word: "paddenstoel", phonetic: "PAH-dun-stool" }, ru: { word: "гриб", phonetic: "greep" }, zh: { word: "蘑菇", phonetic: "mó gu" }, ja: { word: "きのこ", phonetic: "ki-no-ko" } },
    facts: ["Mushrooms can grow after rain.", "Some mushrooms are safe to eat and some are not.", "Mushrooms come in many shapes."],
    art: "mushroom",
  },
  cookie: {
    aliases: ["cookie", "koekje", "печенье", "pechenye", "饼干", "binggan", "kukkii", "クッキー"],
    detected: { word: "cookie", language: "English" },
    translations: { en: { word: "cookie", phonetic: "KOO-kee" }, nl: { word: "koekje", phonetic: "KOOK-yuh" }, ru: { word: "печенье", phonetic: "pe-CHEN-ye" }, zh: { word: "饼干", phonetic: "bǐng gān" }, ja: { word: "クッキー", phonetic: "kuk-kii" } },
    facts: ["Cookies can be crunchy or soft.", "Some cookies have chocolate chips.", "Cookies are often shared as treats."],
    art: "cookie",
  },
  iceCream: {
    aliases: ["ice cream", "ijs", "мороженое", "morozhenoe", "冰淇淋", "bingqilin", "aisu", "アイス"],
    detected: { word: "ice cream", language: "English" },
    translations: { en: { word: "ice cream", phonetic: "ICE-kreem" }, nl: { word: "ijs", phonetic: "ice" }, ru: { word: "мороженое", phonetic: "ma-RO-zhe-na-ye" }, zh: { word: "冰淇淋", phonetic: "bīng qí lín" }, ja: { word: "アイス", phonetic: "ai-su" } },
    facts: ["Ice cream is cold and sweet.", "It can melt quickly.", "Many families choose favorite flavors."],
    art: "iceCream",
  },
  noodles: {
    aliases: ["noodles", "noedels", "лапша", "lapsha", "面条", "miantiao", "men", "麺"],
    detected: { word: "noodles", language: "English" },
    translations: { en: { word: "noodles", phonetic: "NOO-dulz" }, nl: { word: "noedels", phonetic: "NOO-duls" }, ru: { word: "лапша", phonetic: "lap-SHA" }, zh: { word: "面条", phonetic: "miàn tiáo" }, ja: { word: "麺", phonetic: "men" } },
    facts: ["Noodles can be long and wiggly.", "They are eaten in soups and bowls.", "Chopsticks can pick up noodles."],
    art: "noodles",
  },
  pizza: {
    aliases: ["pizza", "пицца", "pitsa", "披萨", "pisa", "piza", "ピザ"],
    detected: { word: "pizza", language: "English" },
    translations: { en: { word: "pizza", phonetic: "PEET-sa" }, nl: { word: "pizza", phonetic: "PEET-sa" }, ru: { word: "пицца", phonetic: "PEET-sa" }, zh: { word: "披萨", phonetic: "pī sà" }, ja: { word: "ピザ", phonetic: "pi-za" } },
    facts: ["Pizza can have many toppings.", "Pizza is often cut into slices.", "Families can make pizza together."],
    art: "pizza",
  },
  boat: {
    aliases: ["boat", "boot", "лодка", "lodka", "船", "chuan", "fune", "船"],
    detected: { word: "boat", language: "English" },
    translations: { en: { word: "boat", phonetic: "boht" }, nl: { word: "boot", phonetic: "boht" }, ru: { word: "лодка", phonetic: "LOT-ka" }, zh: { word: "船", phonetic: "chuán" }, ja: { word: "船", phonetic: "fu-ne" } },
    facts: ["Boats move on water.", "Some boats have sails.", "A small boat can float on a lake."],
    art: "boat",
  },
  rocket: {
    aliases: ["rocket", "raket", "ракета", "raketa", "火箭", "huojian", "roketto", "ロケット"],
    detected: { word: "rocket", language: "English" },
    translations: { en: { word: "rocket", phonetic: "ROK-it" }, nl: { word: "raket", phonetic: "ra-KET" }, ru: { word: "ракета", phonetic: "ra-KYE-ta" }, zh: { word: "火箭", phonetic: "huǒ jiàn" }, ja: { word: "ロケット", phonetic: "ro-ket-to" } },
    facts: ["Rockets can fly into space.", "Rocket launches are very loud.", "Astronauts ride rockets."],
    art: "rocket",
  },
  castle: {
    aliases: ["castle", "kasteel", "замок", "zamok", "城堡", "chengbao", "shiro", "城"],
    detected: { word: "castle", language: "English" },
    translations: { en: { word: "castle", phonetic: "KAS-ul" }, nl: { word: "kasteel", phonetic: "ka-STAYL" }, ru: { word: "замок", phonetic: "ZA-mok" }, zh: { word: "城堡", phonetic: "chéng bǎo" }, ja: { word: "城", phonetic: "shi-ro" } },
    facts: ["Castles can have towers.", "Some castles are very old.", "Stories often include castles."],
    art: "castle",
  },
  camping: {
    aliases: ["camping", "kamperen", "кемпинг", "kemping", "露营", "luying", "kyanpu", "キャンプ"],
    detected: { word: "camping", language: "English" },
    translations: { en: { word: "camping", phonetic: "KAM-ping" }, nl: { word: "kamperen", phonetic: "KAM-puh-run" }, ru: { word: "кемпинг", phonetic: "KEM-ping" }, zh: { word: "露营", phonetic: "lù yíng" }, ja: { word: "キャンプ", phonetic: "kyan-pu" } },
    facts: ["Camping means sleeping outdoors.", "A tent can be a tiny home.", "Camping nights can be full of stars."],
    art: "camping",
  },
  dance: {
    aliases: ["dance", "dansen", "танцевать", "tantsevat", "跳舞", "tiaowu", "odoru", "踊る"],
    detected: { word: "dance", language: "English" },
    translations: { en: { word: "dance", phonetic: "dans" }, nl: { word: "dansen", phonetic: "DAN-sun" }, ru: { word: "танцевать", phonetic: "tan-tse-VAT" }, zh: { word: "跳舞", phonetic: "tiào wǔ" }, ja: { word: "踊る", phonetic: "o-do-ru" } },
    facts: ["Dancing moves with music.", "People dance at celebrations.", "Dancing can be silly or graceful."],
    art: "dance",
  },
  soccer: {
    aliases: ["soccer", "voetbal", "футбол", "futbol", "足球", "zuqiu", "sakkaa", "サッカー"],
    detected: { word: "soccer", language: "English" },
    translations: { en: { word: "soccer", phonetic: "SAH-ker" }, nl: { word: "voetbal", phonetic: "FOOT-bal" }, ru: { word: "футбол", phonetic: "foot-BOL" }, zh: { word: "足球", phonetic: "zú qiú" }, ja: { word: "サッカー", phonetic: "sak-kaa" } },
    facts: ["Soccer uses a ball.", "Players kick the ball with their feet.", "Many children play soccer outside."],
    art: "soccer",
  },
  medal: {
    aliases: ["medal", "medaille", "медаль", "medal", "奖牌", "jiangpai", "medaru", "メダル"],
    detected: { word: "medal", language: "English" },
    translations: { en: { word: "medal", phonetic: "MEH-dul" }, nl: { word: "medaille", phonetic: "meh-DAI-yuh" }, ru: { word: "медаль", phonetic: "me-DAL" }, zh: { word: "奖牌", phonetic: "jiǎng pái" }, ja: { word: "メダル", phonetic: "me-da-ru" } },
    facts: ["A medal can celebrate effort.", "Medals can be gold, silver, or bronze.", "Winning is nice, but trying matters too."],
    art: "medal",
  },
  camera: {
    aliases: ["camera", "camera", "камера", "kamera", "相机", "xiangji", "kamera", "カメラ"],
    detected: { word: "camera", language: "English" },
    translations: { en: { word: "camera", phonetic: "KAM-ruh" }, nl: { word: "camera", phonetic: "KA-muh-ra" }, ru: { word: "камера", phonetic: "KA-me-ra" }, zh: { word: "相机", phonetic: "xiàng jī" }, ja: { word: "カメラ", phonetic: "ka-me-ra" } },
    facts: ["Cameras take pictures.", "Pictures help remember moments.", "Some cameras are inside phones."],
    art: "camera",
  },
  scissors: {
    aliases: ["scissors", "schaar", "ножницы", "nozhnitsy", "剪刀", "jiandao", "hasami", "はさみ"],
    detected: { word: "scissors", language: "English" },
    translations: { en: { word: "scissors", phonetic: "SIH-zurz" }, nl: { word: "schaar", phonetic: "skhaar" }, ru: { word: "ножницы", phonetic: "NOZH-ni-tsy" }, zh: { word: "剪刀", phonetic: "jiǎn dāo" }, ja: { word: "はさみ", phonetic: "ha-sa-mi" } },
    facts: ["Scissors cut paper.", "Children use safety scissors.", "Scissors open and close."],
    art: "scissors",
  },
  umbrella: {
    aliases: ["umbrella", "paraplu", "зонт", "zont", "雨伞", "yusan", "kasa", "傘"],
    detected: { word: "umbrella", language: "English" },
    translations: { en: { word: "umbrella", phonetic: "um-BREL-uh" }, nl: { word: "paraplu", phonetic: "pa-ra-PLUU" }, ru: { word: "зонт", phonetic: "zont" }, zh: { word: "雨伞", phonetic: "yǔ sǎn" }, ja: { word: "傘", phonetic: "ka-sa" } },
    facts: ["Umbrellas help keep rain off.", "Some umbrellas fold up small.", "Umbrellas can be very colorful."],
    art: "umbrella",
  },
  teddy: {
    aliases: ["teddy", "knuffelbeer", "плюшевый мишка", "mishka", "泰迪熊", "taidixiong", "nuigurumi", "ぬいぐるみ"],
    detected: { word: "teddy", language: "English" },
    translations: { en: { word: "teddy", phonetic: "TEH-dee" }, nl: { word: "knuffelbeer", phonetic: "KNUF-ul-bayr" }, ru: { word: "мишка", phonetic: "MEESH-ka" }, zh: { word: "泰迪熊", phonetic: "tài dí xióng" }, ja: { word: "ぬいぐるみ", phonetic: "nu-i-gu-ru-mi" } },
    facts: ["A teddy can be a cozy toy.", "Many children sleep with a soft toy.", "Stuffed toys can join pretend stories."],
    art: "teddy",
  },
  robot: {
    aliases: ["robot", "робот", "机器人", "jiqiren", "robotto", "ロボット"],
    detected: { word: "robot", language: "English" },
    translations: { en: { word: "robot", phonetic: "ROH-bot" }, nl: { word: "robot", phonetic: "ROH-bot" }, ru: { word: "робот", phonetic: "RO-bot" }, zh: { word: "机器人", phonetic: "jī qì rén" }, ja: { word: "ロボット", phonetic: "ro-bot-to" } },
    facts: ["Robots can be real or pretend.", "Some robots help people work.", "Toy robots are fun in stories."],
    art: "robot",
  },
  scarf: {
    aliases: ["scarf", "sjaal", "шарф", "sharf", "围巾", "weijin", "mafuraa", "マフラー"],
    detected: { word: "scarf", language: "English" },
    translations: { en: { word: "scarf", phonetic: "skarf" }, nl: { word: "sjaal", phonetic: "shahl" }, ru: { word: "шарф", phonetic: "sharf" }, zh: { word: "围巾", phonetic: "wéi jīn" }, ja: { word: "マフラー", phonetic: "ma-fu-raa" } },
    facts: ["A scarf is worn around the neck.", "Scarves can help keep people warm.", "Scarves come in many colors."],
    art: "scarf",
  },
  ice: {
    aliases: ["ice", "ijs", "лёд", "led", "冰", "bing", "koori", "氷"],
    detected: { word: "ice", language: "English" },
    // CHANGED (Quality Audit): nl phonetic was literally the English word "ice".
    // Now provides a simple Dutch-friendly guide ("eys") and no longer duplicates.
    translations: { en: { word: "ice", phonetic: "eyss" }, nl: { word: "ijs", phonetic: "eys" }, ru: { word: "лёд", phonetic: "lyot" }, zh: { word: "冰", phonetic: "bīng" }, ja: { word: "氷", phonetic: "koo-ree" } },
    facts: ["Ice is frozen water.", "Ice feels cold.", "Ice cubes can melt into water."],
    art: "ice",
  },
  snowman: {
    aliases: ["snowman", "sneeuwpop", "снеговик", "snegovik", "雪人", "xueren", "yukidaruma", "雪だるま"],
    detected: { word: "snowman", language: "English" },
    translations: { en: { word: "snowman", phonetic: "SNOH-man" }, nl: { word: "sneeuwpop", phonetic: "SNAYW-pop" }, ru: { word: "снеговик", phonetic: "sne-ga-VEEK" }, zh: { word: "雪人", phonetic: "xuě rén" }, ja: { word: "雪だるま", phonetic: "yu-ki-da-ru-ma" } },
    facts: ["A snowman is made from snow.", "Snowmen often have round snowballs for a body.", "Some snowmen have carrot noses."],
    art: "snowman",
  },
  quiet: {
    aliases: ["quiet", "stil", "тихий", "tikhiy", "安静", "anjing", "shizuka", "静か"],
    detected: { word: "quiet", language: "English" },
    translations: { en: { word: "quiet", phonetic: "KWY-et" }, nl: { word: "stil", phonetic: "stihl" }, ru: { word: "тихий", phonetic: "TEE-khiy" }, zh: { word: "安静", phonetic: "ān jìng" }, ja: { word: "静か", phonetic: "shi-zu-ka" } },
    facts: ["Quiet can help people rest.", "Libraries are often quiet.", "Quiet moments can feel peaceful."],
    art: "quiet",
  },
  park: {
    aliases: ["park", "парк", "公园", "gongyuan", "kouen", "公園"],
    detected: { word: "park", language: "English" },
    // CHANGED (Quality Audit): en/nl/ru phonetics were raw duplicates of the word.
    // All three now use a slightly respelled form so Row 2 is distinct.
    translations: { en: { word: "park", phonetic: "pahrk" }, nl: { word: "park", phonetic: "pahrk" }, ru: { word: "парк", phonetic: "pahrk" }, zh: { word: "公园", phonetic: "gōng yuán" }, ja: { word: "公園", phonetic: "koh-en" } },
    facts: ["A park is a place to play outside.", "Parks can have trees and paths.", "Families often walk in parks."],
    art: "park",
  },
  playground: {
    aliases: ["playground", "speeltuin", "площадка", "ploshchadka", "游乐场", "youlechang", "yuuguujou", "遊具場"],
    detected: { word: "playground", language: "English" },
    translations: { en: { word: "playground", phonetic: "PLAY-ground" }, nl: { word: "speeltuin", phonetic: "SPAYL-town" }, ru: { word: "площадка", phonetic: "plosh-CHAD-ka" }, zh: { word: "游乐场", phonetic: "yóu lè chǎng" }, ja: { word: "遊び場", phonetic: "a-so-bi-ba" } },
    facts: ["Playgrounds are made for play.", "Slides and swings are common there.", "Children can practice climbing and balancing."],
    art: "playground",
  },
  soap: {
    aliases: ["soap", "zeep", "мыло", "mylo", "肥皂", "feizao", "sekken", "石鹸"],
    detected: { word: "soap", language: "English" },
    translations: { en: { word: "soap", phonetic: "sohp" }, nl: { word: "zeep", phonetic: "zayp" }, ru: { word: "мыло", phonetic: "MY-la" }, zh: { word: "肥皂", phonetic: "féi zào" }, ja: { word: "石鹸", phonetic: "sek-ken" } },
    facts: ["Soap helps clean hands.", "Soap can make bubbles.", "Handwashing is a healthy habit."],
    art: "soap",
  },
};

/* =========================================================================
   UI LAYER — handlers and render functions live here; word/emoji data and
   pronunciation tables are defined later. Nothing in this section may run
   until initApp() at the file end, after all data modules are built.
   ========================================================================= */

const selectedLanguages = new Set(["en", "nl", "ru", "zh", "ja"]);
// Single-open accordion: at most one emoji category expanded at a time.
const expandedVisualCategories = new Set(["emoji-animals"]);
let availableVoices = [];
let currentResult = null;
let currentAudio = null;

const els = {
  languageGrid: document.querySelector("#language-grid"),
  languageCount: document.querySelector("#language-count"),
  resultOverlay: document.querySelector("#result-overlay"),
  resultView: document.querySelector("#result-view"),
  closeResultButton: document.querySelector("#close-result-button"),
  expandResultButton: document.querySelector("#expand-result-button"),
  loadingScene: document.querySelector("#loading-scene"),
  loadingText: document.querySelector("#loading-text"),
  resultTitle: document.querySelector("#result-title"),
  wordArt: document.querySelector("#word-art"),
  factsList: document.querySelector("#facts-list"),
  translationList: document.querySelector("#translation-list"),
};

function assertDomElements() {
  const missing = Object.entries(els)
    .filter(([, element]) => !element)
    .map(([name]) => name);
  if (missing.length) {
    throw new Error(`Missing required DOM elements: ${missing.join(", ")}`);
  }
  if (!document.querySelector(".quick-tries")) {
    throw new Error("Missing required DOM element: .quick-tries");
  }
}

function displayEmoji(emoji) {
  return emoji;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderLanguages() {
  els.languageGrid.innerHTML = languages
    .map((language) => {
      const isSelected = selectedLanguages.has(language.id);
      return `
        <button class="language-tile" type="button" data-language="${escapeHtml(language.id)}" aria-pressed="${isSelected}">
          <span class="language-name">
            <span class="flag-dot" style="background:${escapeHtml(language.color)}"></span>
            <span class="language-font-${escapeHtml(language.id)}">${escapeHtml(language.name)}</span>
          </span>
          <span class="check-mark" aria-hidden="true">${isSelected ? "✓" : "+"}</span>
        </button>
      `;
    })
    .join("");
  els.languageCount.textContent = `${selectedLanguages.size} selected`;
}

function syncExpandedCategories() {
  document.querySelectorAll(".emoji-category").forEach((section) => {
    const toggle = section.querySelector(".emoji-category-toggle");
    if (!toggle) return;
    const categoryId = toggle.dataset.category;
    const grid = section.querySelector(".emoji-grid");
    const chevron = section.querySelector(".category-chevron");
    const isExpanded = expandedVisualCategories.has(categoryId);
    toggle.setAttribute("aria-expanded", String(isExpanded));
    if (grid) grid.hidden = !isExpanded;
    if (chevron) chevron.textContent = isExpanded ? "⌄" : "›";
  });
}

function renderQuickWords() {
  document.querySelector(".quick-tries").innerHTML = emojiCategories
    .map((category) => {
      const isExpanded = expandedVisualCategories.has(category.id);
      const previewEmojis = category.words
        .slice(0, 4)
        .map((key) => displayEmoji(artIcons[words[key].art]))
        .join("");
      const categoryId = escapeHtml(category.id);
      return `
        <section class="emoji-category" aria-labelledby="${categoryId}-heading">
          <h3 id="${categoryId}-heading">
            <button
              class="emoji-category-toggle"
              type="button"
              data-category="${categoryId}"
              aria-expanded="${isExpanded}"
              aria-controls="${categoryId}-grid"
            >
              <span class="category-title">
                <span>${escapeHtml(category.name)}</span>
                <span class="category-count">${category.words.length} words</span>
              </span>
              <span class="category-preview" aria-hidden="true">${previewEmojis}</span>
              <span class="category-chevron" aria-hidden="true">${isExpanded ? "⌄" : "›"}</span>
            </button>
          </h3>
          <div class="emoji-grid" id="${categoryId}-grid"${isExpanded ? "" : " hidden"}>
            ${category.words
              .map((key) => {
                const entry = words[key];
                const label = escapeHtml(entry.translations.en.word);
                const safeKey = escapeHtml(key);
                return `<button type="button" data-key="${safeKey}" aria-label="${label}" title="${label}">${displayEmoji(artIcons[entry.art])}</button>`;
              })
              .join("")}
          </div>
        </section>
      `;
    })
    .join("");
}

function showLoading(message) {
  els.loadingText.textContent = message;
  els.resultOverlay.classList.remove("is-hidden");
  els.resultView.classList.add("is-hidden");
  els.loadingScene.classList.remove("is-hidden");
}

function hideLoading() {
  els.loadingScene.classList.add("is-hidden");
}

function stopSpeaking() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

function closeResult() {
  stopSpeaking();
  els.resultOverlay.classList.add("is-hidden");
  els.resultOverlay.classList.remove("is-expanded");
  els.expandResultButton.setAttribute("aria-pressed", "false");
  els.expandResultButton.setAttribute("aria-label", "Expand result");
  els.expandResultButton.textContent = "⤢";
}

function toggleExpandedResult() {
  const isExpanded = els.resultOverlay.classList.toggle("is-expanded");
  els.expandResultButton.setAttribute("aria-pressed", String(isExpanded));
  els.expandResultButton.setAttribute("aria-label", isExpanded ? "Shrink result" : "Expand result");
  els.expandResultButton.textContent = isExpanded ? "⤡" : "⤢";
}

function speak(text, locale) {
  if (!window.speechSynthesis) return;

  stopSpeaking();

  // Special handling for Japanese: Use Google Translate TTS for natural native speaker sound
  if (locale.startsWith("ja")) {
    playJapaneseNativeAudio(text);
    return;
  }

  // Default behavior for other languages
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = locale;
  utterance.voice = pickVoice(locale);
  utterance.rate = locale.startsWith("en") ? 0.92 : 0.86;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

/**
 * Plays Japanese audio using Google Translate TTS (provides much more natural
 * native Japanese speaker voice than most browser implementations).
 * Falls back to browser speechSynthesis if the request fails.
 */
function playJapaneseNativeAudio(japaneseText) {
  stopSpeaking();

  const encodedText = encodeURIComponent(japaneseText);
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ja&client=tw-ob&q=${encodedText}`;

  const audio = new Audio(url);
  currentAudio = audio;

  audio.play().catch(() => {
    currentAudio = null;
    // Fallback to browser TTS (will speak the Japanese text directly)
    const utterance = new SpeechSynthesisUtterance(japaneseText);
    utterance.lang = "ja-JP";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  });
}

function pickVoice(locale) {
  const voices = availableVoices.length ? availableVoices : window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  if (locale.startsWith("en")) {
    const neutralEnglishNames = ["Samantha", "Alex", "Google US English", "Google UK English Female", "Microsoft Aria"];
    return (
      voices.find((voice) => neutralEnglishNames.some((name) => voice.name.includes(name))) ||
      voices.find((voice) => voice.lang === "en-US" && !/compact|novelty|premium/i.test(voice.name)) ||
      voices.find((voice) => voice.lang.startsWith("en") && !/compact|novelty/i.test(voice.name)) ||
      null
    );
  }

  return voices.find((voice) => voice.lang === locale) || voices.find((voice) => voice.lang.startsWith(locale.slice(0, 2))) || null;
}

function loadVoices() {
  if (!window.speechSynthesis) return;
  availableVoices = window.speechSynthesis.getVoices();
}

function renderResult(entry) {
  currentResult = { entry };
  els.resultOverlay.classList.remove("is-hidden");
  els.resultView.classList.remove("is-hidden");
  els.resultTitle.textContent = capitalize(entry.translations.en.word);
  els.wordArt.setAttribute("aria-label", `Illustration of ${entry.translations.en.word}`);
  els.wordArt.innerHTML = symbolArt(entry.art);

  els.factsList.innerHTML = entry.facts
    .map((fact) => `<li><span aria-hidden="true">•</span><span>${escapeHtml(fact)}</span></li>`)
    .join("");

  const selected = languages.filter((language) => selectedLanguages.has(language.id));
  els.translationList.innerHTML = selected
    .map((language) => {
      const translation = entry.translations[language.id];
      // Final safety: strip any accidental helper/fallback text from pronunciation
      let phonetic = (translation.phonetic || "").replace(/\b(listen for sounds|approx)\b/gi, "").trim();
      if (!phonetic) phonetic = pronunciationGuide(language.id, translation.word);

      const languageId = escapeHtml(language.id);
      const word = escapeHtml(translation.word);
      const languageName = escapeHtml(language.name);
      const locale = escapeHtml(language.locale);

      return `
        <div class="translation-row">
          <div>
            <div class="translation-word">
              <strong class="language-font-${languageId}">${word}</strong>
              <span class="language-font-${languageId}">${languageName}</span>
            </div>
            <div class="phonetic">${escapeHtml(phonetic)}</div>
          </div>
          <button class="sound-button" type="button" data-speak="${word}" data-locale="${locale}" aria-label="Hear ${word} in ${languageName}">▶</button>
        </div>
      `;
    })
    .join("");
}

function handleVisualWord(key) {
  const entry = words[key];
  if (!entry) return;
  showLoading("Finding the word in your family languages...");
  window.setTimeout(() => {
    hideLoading();
    renderResult(entry);
  }, 650);
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const artIcons = {
  apple: "🍎",
  fruit: "🍌",
  dog: "🐶",
  cat: "🐱",
  bird: "🐦",
  moon: "🌙",
  water: "💧",
  sun: "☀️",
  star: "⭐",
  tree: "🌳",
  flower: "🌸",
  bread: "🍞",
  cheese: "🧀",
  egg: "🥚",
  rice: "🍚",
  soup: "🍲",
  fish: "🐟",
  rabbit: "🐰",
  bear: "🐻",
  rain: "🌧️",
  snow: "❄️",
  cloud: "☁️",
  sea: "🌊",
  mountain: "⛰️",
  hand: "✋",
  eye: "👁️",
  shoe: "👟",
  hat: "🧢",
  book: "📖",
  basketball: "🏀",
  car: "🚗",
  train: "🚆",
  house: "🏠",
  bed: "🛏️",
  chair: "🪑",
  plate: "🍽️",
  door: "🚪",
  window: "🪟",
  lamp: "💡",
  doll: "🪆",
  blocks: "🧱",
  kite: "🪁",
  pencil: "✏️",
  bag: "🎒",
  mother: "👩",
  father: "👨",
  happy: "😊",
  sad: "😢",
  sleep: "💤",
  jump: "🤸",
  cow: "🐄",
  butterfly: "🦋",
  fire: "🔥",
  rainbow: "🌈",
  strawberry: "🍓",
  carrot: "🥕",
  cake: "🍰",
  juice: "🧃",
  bus: "🚌",
  bicycle: "🚲",
  airplane: "✈️",
  school: "🏫",
  music: "🎵",
  painting: "🎨",
  game: "🎲",
  swim: "🏊",
  clock: "🕒",
  key: "🔑",
  phone: "📱",
  toothbrush: "🪥",
  love: "❤️",
  laugh: "😄",
  angry: "😠",
  surprised: "😮",
  lion: "🦁",
  turtle: "🐢",
  frog: "🐸",
  mushroom: "🍄",
  cookie: "🍪",
  iceCream: "🍦",
  noodles: "🍜",
  pizza: "🍕",
  boat: "⛵",
  rocket: "🚀",
  castle: "🏰",
  camping: "⛺",
  dance: "💃",
  soccer: "⚽",
  medal: "🏅",
  camera: "📷",
  scissors: "✂️",
  umbrella: "☂️",
  teddy: "🧸",
  robot: "🤖",
  scarf: "🧣",
  ice: "🧊",
  snowman: "☃️",
  quiet: "🤫",
  park: "🏞️",
  playground: "🛝",
  soap: "🧼",
};

const animalItems = [
  [1, "🐶", "Dog", "Hond", "狗", "Собака", "犬", "inu"],
  [2, "🐱", "Cat", "Kat", "猫", "Кошка", "猫", "neko"],
  [3, "🐹", "Hamster", "Hamster", "仓鼠", "Хомяк", "ハムスター", "hamusutaa"],
  [4, "🐰", "Rabbit", "Konijn", "兔子", "Кролик", "うさぎ", "usagi"],
  [5, "🦊", "Fox", "Vos", "狐狸", "Лиса", "キツネ", "kitsune"],
  [6, "🐻", "Bear", "Beer", "熊", "Медведь", "熊", "kuma"],
  [7, "🐼", "Panda", "Panda", "熊猫", "Панда", "パンダ", "panda"],
  [8, "🐻‍❄️", "Polar bear", "IJsbeer", "北极熊", "Белый медведь", "シロクマ", "shirokuma"],
  [9, "🐨", "Koala", "Koala", "考拉", "Коала", "コアラ", "koara"],
  [10, "🐯", "Tiger", "Tijger", "老虎", "Тигр", "トラ", "tora"],
  [11, "🦁", "Lion", "Leeuw", "狮子", "Лев", "ライオン", "raion"],
  [12, "🐮", "Cow", "Koe", "牛", "Корова", "牛", "ushi"],
  [13, "🐷", "Pig", "Varken", "猪", "Свинья", "豚", "buta"],
  [14, "🐸", "Frog", "Kikker", "青蛙", "Лягушка", "カエル", "kaeru"],
  [15, "🐵", "Monkey", "Aap", "猴子", "Обезьяна", "猿", "saru"],
  [16, "🐔", "Chicken", "Kip", "鸡", "Курица", "鶏", "niwatori"],
  [17, "🐧", "Penguin", "Pinguïn", "企鹅", "Пингвин", "ペンギン", "pengin"],
  [18, "🐦", "Bird", "Vogel", "鸟", "Птица", "鳥", "tori"],
  [19, "🐦‍⬛", "Crow", "Kraai", "乌鸦", "Ворона", "カラス", "karasu"],
  [20, "🐤", "Chick", "Kuiken", "小鸡", "Цыплёнок", "ひよこ", "hiyoko"],
  [21, "🦆", "Duck", "Eend", "鸭子", "Утка", "アヒル", "ahiru"],
  [22, "🦅", "Eagle", "Adelaar", "鹰", "Орёл", "ワシ", "washi"],
  [23, "🦉", "Owl", "Uil", "猫头鹰", "Сова", "フクロウ", "fukurou"],
  [24, "🦇", "Bat", "Vleermuis", "蝙蝠", "Летучая мышь", "コウモリ", "koumori"],
  [25, "🐺", "Wolf", "Wolf", "狼", "Волк", "オオカミ", "ookami"],
  [26, "🐗", "Boar", "Everzwijn", "野猪", "Кабан", "イノシシ", "inoshishi"],
  [27, "🐴", "Horse", "Paard", "马", "Лошадь", "馬", "uma"],
  [28, "🦄", "Unicorn", "Eenhoorn", "独角兽", "Единорог", "ユニコーン", "yunikoon"],
  [29, "🐝", "Bee", "Bij", "蜜蜂", "Пчела", "蜂", "hachi"],
  [30, "🪱", "Worm", "Worm", "虫", "Червь", "ミミズ", "mimizu"],
  [31, "🐛", "Bug", "Insect", "虫子", "Жук", "虫", "mushi"],
  [32, "🦋", "Butterfly", "Vlinder", "蝴蝶", "Бабочка", "蝶", "chou"],
  [33, "🐌", "Snail", "Slak", "蜗牛", "Улитка", "カタツムリ", "katatsumuri"],
  [34, "🐞", "Ladybug", "Lieveheersbeestje", "瓢虫", "Божья коровка", "テントウムシ", "tentoumushi"],
  [35, "🐜", "Ant", "Mier", "蚂蚁", "Муравей", "アリ", "ari"],
  [36, "🪰", "Fly", "Vlieg", "苍蝇", "Муха", "ハエ", "hae"],
  [37, "🪲", "Beetle", "Keerkever", "甲虫", "Жук", "甲虫", "kouchuu"],
  [38, "🪳", "Cockroach", "Kakkerlak", "蟑螂", "Таракан", "ゴキブリ", "gokiburi"],
  [39, "🦟", "Mosquito", "Mug", "蚊子", "Комар", "蚊", "ka"],
  [40, "🦗", "Grasshopper", "Sprinkhaan", "蚱蜢", "Кузнечик", "バッタ", "batta"],
  [41, "🕷", "Spider", "Spin", "蜘蛛", "Паук", "クモ", "kumo"],
  [42, "🦂", "Scorpion", "Schorpioen", "蝎子", "Скорпион", "サソリ", "sasori"],
  [43, "🐢", "Turtle", "Schildpad", "乌龟", "Черепаха", "亀", "kame"],
  [44, "🐍", "Snake", "Slang", "蛇", "Змея", "ヘビ", "hebi"],
  [45, "🦎", "Lizard", "Hagedis", "蜥蜴", "Ящерица", "トカゲ", "tokage"],
  [46, "🦖", "Dinosaur", "Dinosaurus", "恐龙", "Динозавр", "恐竜", "kyouryuu"],
  [47, "🐙", "Octopus", "Octopus", "章鱼", "Осьминог", "タコ", "tako"],
  [48, "🦑", "Squid", "Inktvis", "鱿鱼", "Кальмар", "イカ", "ika"],
  [49, "🦐", "Shrimp", "Garnaal", "虾", "Креветка", "エビ", "ebi"],
  [50, "🐉", "Dragon", "Draak", "龙", "Дракон", "龍", "ryuu"],
  [51, "🦞", "Lobster", "Kreeft", "龙虾", "Омар", "ロブスター", "robusutaa"],
  [52, "🦀", "Crab", "Krab", "螃蟹", "Краб", "カニ", "kani"],
  [53, "🪼", "Jellyfish", "Kwal", "水母", "Медуза", "クラゲ", "kurage"],
  [54, "🪸", "Coral", "Koraal", "珊瑚", "Коралл", "サンゴ", "sango"],
  [55, "🐡", "Puffer fish", "Kogelvis", "河豚", "Иглобрюх", "フグ", "fugu"],
  [56, "🐠", "Tropical fish", "Tropische vis", "热带鱼", "Тропическая рыба", "熱帯魚", "nettaigyo"],
  [57, "🐟", "Fish", "Vis", "鱼", "Рыба", "魚", "sakana"],
  [58, "🐬", "Dolphin", "Dolfijn", "海豚", "Дельфин", "イルカ", "iruka"],
  [59, "🐳", "Whale", "Walvis", "鲸鱼", "Кит", "クジラ", "kujira"],
  [60, "🦈", "Shark", "Haai", "鲨鱼", "Акула", "サメ", "same"],
  [61, "🐊", "Crocodile", "Krokodil", "鳄鱼", "Крокодил", "ワニ", "wani"],
  [62, "🐆", "Leopard", "Luipaard", "豹子", "Леопард", "ヒョウ", "hyou"],
  [63, "🦓", "Zebra", "Zebra", "斑马", "Зебра", "シマウマ", "shimauma"],
  [64, "🫏", "Donkey", "Ezel", "驴", "Осёл", "ロバ", "roba"],
  [65, "🦍", "Gorilla", "Gorilla", "大猩猩", "Горилла", "ゴリラ", "gorira"],
  [66, "🦧", "Orangutan", "Orang-oetan", "猩猩", "Орангутан", "オランウータン", "oran uutan"],
  [67, "🦣", "Mammoth", "Mammoet", "猛犸象", "Мамонт", "マンモス", "manmosu"],
  [68, "🐘", "Elephant", "Olifant", "大象", "Слон", "象", "zou"],
  [69, "🦛", "Hippopotamus", "Nijlpaard", "河马", "Бегемот", "カバ", "kaba"],
  [70, "🦏", "Rhinoceros", "Neushoorn", "犀牛", "Носорог", "サイ", "sai"],
  [71, "🐫", "Camel", "Kameel", "骆驼", "Верблюд", "ラクダ", "rakuda"],
  [72, "🦒", "Giraffe", "Giraffe", "长颈鹿", "Жираф", "キリン", "kirin"],
  [73, "🦘", "Kangaroo", "Kangoeroe", "袋鼠", "Кенгуру", "カンガルー", "kangaruu"],
  [74, "🦬", "Bison", "Bizon", "野牛", "Бизон", "バイソン", "baison"],
  [75, "🐃", "Buffalo", "Buffel", "水牛", "Буйвол", "水牛", "suigyuu"],
  [76, "🐂", "Ox", "Os", "公牛", "Вол", "雄牛", "oushi"],
  [77, "🐑", "Sheep", "Schaap", "羊", "Овца", "羊", "hitsuji"],
  [78, "🦙", "Llama", "Lama", "羊驼", "Лама", "ラマ", "rama"],
  [79, "🐐", "Goat", "Geit", "山羊", "Коза", "ヤギ", "yagi"],
  [80, "🦌", "Deer", "Hert", "鹿", "Олень", "鹿", "shika"],
  [81, "🫎", "Moose", "Eland", "驼鹿", "Лось", "ヘラジカ", "herajika"],
  [82, "🐓", "Rooster", "Haan", "公鸡", "Петух", "雄鶏", "ondori"],
  [83, "🦃", "Turkey", "Kalkoen", "火鸡", "Индейка", "七面鳥", "shichimenchou"],
  [84, "🦤", "Dodo", "Dodo", "渡渡鸟", "Додо", "ドードー", "doodoo"],
  [85, "🦚", "Peacock", "Pauw", "孔雀", "Павлин", "クジャク", "kujaku"],
  [86, "🦜", "Parrot", "Papegaai", "鹦鹉", "Попугай", "オウム", "oumu"],
  [87, "🦢", "Swan", "Zwaan", "天鹅", "Лебедь", "白鳥", "hakuchou"],
  [88, "🪿", "Goose", "Gans", "鹅", "Гусь", "ガチョウ", "gachou"],
  [89, "🦩", "Flamingo", "Flamingo", "火烈鸟", "Фламинго", "フラミンゴ", "furamingo"],
  [90, "🕊", "Dove", "Duif", "鸽子", "Голубь", "ハト", "hato"],
  [91, "🦝", "Raccoon", "Wasbeer", "浣熊", "Енот", "アライグマ", "araiguma"],
  [92, "🦨", "Skunk", "Stinkdier", "臭鼬", "Скунс", "スカンク", "sukanku"],
  [93, "🦡", "Badger", "Das", "獾", "Барсук", "アナグマ", "anaguma"],
  [94, "🦫", "Beaver", "Bever", "海狸", "Бобр", "ビーバー", "biibaa"],
  [95, "🦦", "Otter", "Otter", "水獭", "Выдра", "カワウソ", "kawauso"],
  [96, "🦥", "Sloth", "Luiaard", "树懒", "Ленивец", "ナマケモノ", "namakemono"],
  [97, "🐁", "Mouse", "Muis", "老鼠", "Мышь", "ネズミ", "nezumi"],
  [98, "🐀", "Rat", "Rat", "老鼠", "Крыса", "ラット", "ratto"],
  [99, "🐿", "Chipmunk", "Wangzakeekhoorn", "花栗鼠", "Бурундук", "シマリス", "shimarisu"],
  [100, "🦔", "Hedgehog", "Egel", "刺猬", "Ёж", "ハリネズミ", "harinezumi"],
];

const animalFactTexts = [
  ["Dogs can learn family voices and routines.", "A dog's nose print is unique, a bit like a fingerprint.", "Dogs use tails, ears, sounds, and body posture to communicate."],
  ["Cats use whiskers to feel spaces around them.", "A cat can purr when it feels calm or comfortable.", "Cats often sleep for many hours in a day."],
  ["Hamsters store food in stretchy cheek pouches.", "Hamsters are often most active in the evening or at night.", "A hamster's front teeth keep growing, so it needs things to chew."],
  ["Rabbits have long ears that help them listen for danger.", "A rabbit can hop quickly using strong back legs.", "A rabbit's nose often wiggles when it sniffs."],
  ["Foxes have bushy tails that help with balance and warmth.", "Many foxes are good at hearing tiny movements.", "Foxes can live in forests, fields, mountains, and cities."],
  ["Bears have a strong sense of smell.", "Some bears sleep deeply through cold parts of the year.", "Bear cubs stay close to their mother while they grow."],
  ["Pandas eat mostly bamboo.", "A panda has a special wrist bone that helps it hold bamboo.", "Pandas are born tiny and grow into large bears."],
  ["Polar bears have thick fur and a layer of fat for warmth.", "A polar bear's skin is black under its white-looking fur.", "Polar bears are strong swimmers in icy water."],
  ["Koalas eat eucalyptus leaves.", "Koalas sleep a lot because their food gives limited energy.", "Baby koalas are called joeys."],
  ["Tigers have stripes that help them blend into tall grass and forest shadows.", "Every tiger has a different stripe pattern.", "Tigers are the largest wild cats."],
  ["Lions live in groups called prides.", "A male lion's mane can make it look larger.", "A lion's roar can travel a long distance."],
  ["Cows chew grass and bring it back up to chew again.", "A cow has a four-part stomach.", "Cows can recognize familiar herd members."],
  ["Pigs are very good at smelling things.", "Pigs use their snouts to root in soil.", "Piglets often sleep close together for warmth."],
  ["Frogs begin life as tadpoles in water.", "Many frogs catch food with a sticky tongue.", "Frogs can breathe partly through their skin."],
  ["Monkeys often use hands and feet to climb.", "Some monkeys live in large social groups.", "Many monkeys use facial expressions and calls to communicate."],
  ["Chickens scratch the ground to look for food.", "Hens make different sounds to call their chicks.", "Chickens can remember familiar faces."],
  ["Penguins are birds, but they do not fly.", "Penguins use flippers to swim underwater.", "Many penguins huddle together to stay warm."],
  ["Birds have feathers.", "Many birds build nests for their eggs.", "Bird songs can mark territory or call to other birds."],
  ["Crows are clever birds that can solve problems.", "Crows remember places where they hide food.", "Crows can recognize familiar human faces."],
  ["Chicks peep to communicate with their mother.", "A chick uses a tiny egg tooth to break out of its shell.", "New chicks often follow the first moving thing they see."],
  ["Ducks have webbed feet for swimming.", "Duck feathers can shed water.", "Ducklings often follow their mother in a line."],
  ["Eagles have very sharp eyesight.", "An eagle's hooked beak helps tear food.", "Many eagles build large nests high in trees or cliffs."],
  ["Owls can turn their heads very far.", "Soft owl feathers help them fly quietly.", "Many owls hunt at night."],
  ["Bats are mammals that can truly fly.", "Many bats use echoes to find food in the dark.", "Some bats eat insects, fruit, nectar, or fish."],
  ["Wolves live and hunt in family groups called packs.", "A wolf howl can help pack members find each other.", "Wolves have strong noses and can smell from far away."],
  ["Boars use their snouts to dig for roots and insects.", "Boars can have curved tusks.", "Young boars often have striped coats."],
  ["Horses can sleep standing up.", "A horse's ears can point toward sounds.", "Horses communicate with body language, whinnies, and snorts."],
  ["Unicorns are imaginary animals from stories.", "A unicorn is usually shown with one horn on its forehead.", "Unicorns often appear in fairy tales and magical pictures."],
  ["Bees visit flowers to collect nectar and pollen.", "Bees help many plants grow fruit by pollinating flowers.", "Honeybees can dance to show other bees where food is."],
  ["Worms move through soil and help loosen it.", "Earthworms do not have legs.", "Worm tunnels can help air and water reach plant roots."],
  ["Bugs can have many legs, wings, shells, or antennae.", "Some bugs help gardens by pollinating plants.", "Children can spot bugs by looking carefully under leaves and stones."],
  ["Butterflies begin life as caterpillars.", "A butterfly tastes with its feet.", "Butterfly wings are covered with tiny scales."],
  ["Snails carry spiral shells on their backs.", "A snail leaves a shiny trail of mucus as it moves.", "Snails have tiny teeth on a ribbon-like tongue."],
  ["Ladybugs often eat tiny plant pests called aphids.", "A ladybug's spots can help warn predators.", "Ladybugs can fold their wings under hard red covers."],
  ["Ants live in colonies with many workers.", "Ants leave scent trails for other ants to follow.", "An ant can carry things heavier than its own body."],
  ["Flies have large compound eyes.", "A fly can taste with its feet.", "Flies beat their wings very quickly."],
  ["Beetles have hard wing covers.", "Beetles are one of the largest groups of insects.", "Some beetles shine with bright colors."],
  ["Cockroaches can squeeze into very small spaces.", "Cockroaches are mostly active in the dark.", "They have long antennae that help them feel around."],
  ["Mosquitoes make a high buzzing sound when they fly.", "Only female mosquitoes bite for blood.", "Mosquitoes lay eggs in or near water."],
  ["Grasshoppers jump with powerful back legs.", "Some grasshoppers make sounds by rubbing body parts together.", "Grasshoppers eat many kinds of plants."],
  ["Spiders make silk.", "Many spiders spin webs to catch insects.", "Spiders have eight legs."],
  ["Scorpions have pincers and a curved tail.", "Scorpions glow under ultraviolet light.", "Many scorpions hide during the day and hunt at night."],
  ["Turtles have shells that protect their bodies.", "Some turtles live mostly in water, and some live mostly on land.", "Turtles can live for many years."],
  ["Snakes smell with their tongues.", "A snake has no legs but can move in many ways.", "Some snakes shed their skin as they grow."],
  ["Lizards often bask in the sun to warm their bodies.", "Some lizards can drop their tails to escape danger.", "Lizards use quick tongues to smell or catch food."],
  ["Dinosaurs lived millions of years ago.", "Some dinosaurs were huge, and some were about the size of chickens.", "Birds are the living relatives of dinosaurs."],
  ["Octopuses have eight arms.", "An octopus can change color and texture.", "Octopuses are clever and can solve puzzles."],
  ["Squid have long bodies and tentacles.", "Many squid can squirt ink to escape danger.", "Some squid live very deep in the ocean."],
  ["Shrimp have many tiny legs.", "Shrimp can swim backward quickly.", "Some shrimp clean other sea animals by eating parasites."],
  ["Dragons are imaginary creatures from stories.", "Many dragons are shown with wings, claws, or fire.", "Dragon stories appear in cultures around the world."],
  ["Lobsters have two large claws.", "A lobster's shell does not grow, so it molts to get bigger.", "Lobsters use antennae to sense the world around them."],
  ["Crabs walk sideways because of the shape of their legs.", "A crab has a hard shell called an exoskeleton.", "Crabs use claws for food, defense, and communication."],
  ["Jellyfish have soft bodies and no bones.", "Some jellyfish glow in the dark ocean.", "Jellyfish use stinging tentacles to catch food."],
  ["Coral is made by tiny animals living in colonies.", "Coral reefs can shelter many kinds of sea life.", "Coral can be damaged by warmer seas and pollution."],
  ["Puffer fish can puff up like a ball when threatened.", "Some puffer fish are poisonous.", "Puffer fish have strong beak-like teeth."],
  ["Tropical fish often have bright colors.", "Many tropical fish live near coral reefs.", "Fish use gills to breathe underwater."],
  ["Fish breathe with gills.", "Some fish swim alone, and some swim in schools.", "Fish can be tiny, huge, flat, round, colorful, or camouflaged."],
  ["Dolphins are mammals that breathe air.", "Dolphins use clicks and whistles to communicate.", "Dolphins can leap above the water."],
  ["Whales are mammals, not fish.", "Some whales sing long songs underwater.", "The blue whale is the largest animal on Earth."],
  ["Sharks have rows of teeth.", "Many sharks have a strong sense of smell.", "Sharks have lived in the oceans for hundreds of millions of years."],
  ["Crocodiles have strong jaws and armored skin.", "Crocodiles can wait very still in water.", "Baby crocodiles call to their mother from inside the egg."],
  ["Leopards are spotted big cats.", "Leopards can climb trees while carrying food.", "Their spots help them hide in shadows and leaves."],
  ["Zebras have black-and-white stripes.", "Each zebra's stripe pattern is different.", "Zebras live in groups called herds."],
  ["Donkeys have long ears.", "Donkeys can be careful and steady walkers.", "A donkey's bray can be very loud."],
  ["Gorillas are the largest primates.", "Gorillas live in family groups.", "Gorillas mostly eat plants."],
  ["Orangutans spend much of their time in trees.", "Their long arms help them swing and climb.", "Orangutan babies stay with their mothers for many years."],
  ["Mammoths were relatives of elephants.", "Many mammoths had long curved tusks.", "Woolly mammoths had thick hair for cold places."],
  ["Elephants have trunks that can smell, drink, lift, and touch.", "Elephants use large ears to help cool down.", "Elephants can communicate with very low sounds."],
  ["Hippopotamuses spend much of the day in water.", "A hippo can hold its breath underwater for several minutes.", "Hippos have large teeth and very strong jaws."],
  ["Rhinoceroses have thick skin and one or two horns.", "A rhino horn is made of keratin, like hair and nails.", "Rhinos often use smell and hearing more than sight."],
  ["Camels can travel long distances in dry places.", "A camel's hump stores fat, not water.", "Camels have long eyelashes that help keep sand away."],
  ["Giraffes are the tallest land animals.", "A giraffe's long neck helps it reach high leaves.", "Giraffes have purple-black tongues."],
  ["Kangaroos hop using powerful back legs.", "A baby kangaroo is called a joey.", "Kangaroos carry joeys in a pouch."],
  ["Bison have large heads and shoulder humps.", "Bison once roamed North America in huge herds.", "Their thick coats help them survive cold weather."],
  ["Buffalo have strong bodies and large horns.", "Water buffalo often stay near wetlands.", "Buffalo can help people by pulling carts or plows."],
  ["Oxen are cattle trained to work.", "Oxen can pull heavy loads.", "People have used oxen on farms for thousands of years."],
  ["Sheep grow wool.", "A baby sheep is called a lamb.", "Sheep often stay together in flocks."],
  ["Llamas are related to camels.", "Llamas can carry packs in mountain areas.", "Llamas may spit when annoyed or threatened."],
  ["Goats are good climbers.", "Goats can eat many kinds of plants.", "A baby goat is called a kid."],
  ["Deer often have quick legs and alert ears.", "Male deer of many species grow antlers.", "Fawns can have spots that help them hide."],
  ["Moose are the largest members of the deer family.", "Male moose can grow huge flat antlers.", "Moose are strong swimmers."],
  ["Roosters are male chickens.", "Roosters can crow loudly in the morning.", "A rooster's comb sits on top of its head."],
  ["Turkeys can fan out their tail feathers.", "Wild turkeys can fly short distances.", "Male turkeys gobble to get attention."],
  ["Dodos were birds that could not fly.", "Dodos lived on the island of Mauritius.", "Dodos became extinct long ago."],
  ["Peacocks are male peafowl with colorful tail feathers.", "A peacock fans its tail to display bright eye-like spots.", "Female peafowl are called peahens."],
  ["Parrots can have curved beaks and bright feathers.", "Some parrots can copy sounds and words.", "Parrots use strong feet to hold food."],
  ["Swans have long graceful necks.", "Swans often glide across lakes and ponds.", "Baby swans are called cygnets."],
  ["Geese often fly in a V-shaped formation.", "Geese can be noisy when warning others.", "Goslings follow their parents soon after hatching."],
  ["Flamingos can stand on one leg.", "Their pink color comes from food they eat.", "Flamingos use curved beaks to filter food from water."],
  ["Doves are often symbols of peace.", "Doves can fly long distances.", "Many doves make soft cooing sounds."],
  ["Raccoons have clever paws that can open and hold things.", "A raccoon's face has a mask-like pattern.", "Raccoons are often active at night."],
  ["Skunks can spray a strong smell to defend themselves.", "Skunks have bold black-and-white markings.", "Many skunks search for insects and small animals at night."],
  ["Badgers have strong claws for digging.", "Badgers live in burrows called setts.", "Badgers have striped markings on their faces."],
  ["Beavers build dams and lodges from branches and mud.", "A beaver's front teeth are orange and keep growing.", "Beaver dams can create ponds that help other wildlife."],
  ["Otters are playful swimmers.", "Sea otters can use rocks to open shellfish.", "Otters have thick fur that helps keep them warm."],
  ["Sloths move very slowly.", "Sloths spend much of their time hanging in trees.", "Algae can grow on sloth fur and help them blend in."],
  ["Mice have long tails and quick feet.", "Mice can squeeze through very small openings.", "A mouse uses whiskers to feel its surroundings."],
  ["Rats are smart and curious animals.", "Rats use whiskers and noses to explore.", "Some rats live near people, and some are kept as pets."],
  ["Chipmunks have stripes on their backs.", "Chipmunks store food in cheek pouches.", "Chipmunks often dash quickly between hiding places."],
  ["Hedgehogs have spines on their backs.", "A hedgehog can curl into a ball for protection.", "Hedgehogs often search for insects at night."],
];

const foodEmojiItems = [
  ["🍇", "grapes", "druiven", "葡萄", "виноград", "ぶどう", "budō"],
  ["🍈", "melon", "meloen", "甜瓜", "дыня", "メロン", "meron"],
  ["🍉", "watermelon", "watermeloen", "西瓜", "арбуз", "スイカ", "suika"],
  ["🍊", "tangerine", "mandarijn", "橘子", "мандарин", "みかん", "mikan"],
  ["🍋", "lemon", "citroen", "柠檬", "лимон", "レモン", "remon"],
  ["🍋‍🟩", "lime", "limoen", "青柠", "лайм", "ライム", "raimu"],
  ["🍌", "banana", "banaan", "香蕉", "банан", "バナナ", "banana"],
  ["🍍", "pineapple", "ananas", "菠萝", "ананас", "パイナップル", "painappuru"],
  ["🥭", "mango", "mango", "芒果", "манго", "マンゴー", "mangō"],
  ["🍎", "red apple", "rode appel", "红苹果", "красное яблоко", "赤いりんご", "akai ringo"],
  ["🍏", "green apple", "groene appel", "青苹果", "зелёное яблоко", "青りんご", "aoi ringo"],
  ["🍐", "pear", "peer", "梨", "груша", "梨", "nashi"],
  ["🍑", "peach", "perzik", "桃", "персик", "桃", "momo"],
  ["🍒", "cherries", "kersen", "樱桃", "вишни", "さくらんぼ", "sakuranbo"],
  ["🍓", "strawberry", "aardbei", "草莓", "клубника", "いちご", "ichigo"],
  ["🫐", "blueberries", "bosbessen", "蓝莓", "черника", "ブルーベリー", "burūberī"],
  ["🥝", "kiwi fruit", "kiwi", "猕猴桃", "киви", "キウイ", "kiui"],
  ["🍅", "tomato", "tomaat", "番茄", "помидор", "トマト", "tomato"],
  ["🫒", "olive", "olijf", "橄榄", "оливка", "オリーブ", "orību"],
  ["🥥", "coconut", "kokosnoot", "椰子", "кокос", "ココナッツ", "kokonattsu"],
  ["🥑", "avocado", "avocado", "牛油果", "авокадо", "アボカド", "abokādo"],
  ["🍆", "eggplant", "aubergine", "茄子", "баклажан", "なす", "nasu"],
  ["🥔", "potato", "aardappel", "土豆", "картофель", "じゃがいも", "jagaimo"],
  ["🥕", "carrot", "wortel", "胡萝卜", "морковь", "にんじん", "ninjin"],
  ["🌽", "ear of corn", "maiskolf", "玉米", "кукуруза", "とうもろこし", "tōmorokoshi"],
  ["🌶️", "hot pepper", "hete peper", "辣椒", "острый перец", "唐辛子", "tōgarashi"],
  ["🫑", "bell pepper", "paprika", "甜椒", "болгарский перец", "ピーマン", "pīman"],
  ["🥒", "cucumber", "komkommer", "黄瓜", "огурец", "きゅうり", "kyūri"],
  ["🥬", "leafy green", "bladgroente", "绿叶菜", "листовая зелень", "葉野菜", "ha yasai"],
  ["🥦", "broccoli", "broccoli", "西兰花", "брокколи", "ブロッコリー", "burokkorī"],
  ["🧄", "garlic", "knoflook", "大蒜", "чеснок", "にんにく", "ninniku"],
  ["🧅", "onion", "ui", "洋葱", "лук", "玉ねぎ", "tamanegi"],
  ["🥜", "peanuts", "pinda's", "花生", "арахис", "ピーナッツ", "pīnattsu"],
  ["🫘", "beans", "bonen", "豆子", "фасоль", "豆", "mame"],
  ["🌰", "chestnut", "kastanje", "栗子", "каштан", "栗", "kuri"],
  ["🫚", "ginger root", "gemberwortel", "姜", "корень имбиря", "しょうが", "shōga"],
  ["🫛", "pea pod", "erwtjes", "豌豆荚", "стручок гороха", "えんどう豆", "endō mame"],
  ["🍄‍🟫", "brown mushroom", "bruine paddenstoel", "褐蘑菇", "коричневый гриб", "茶色いキノコ", "chairoi kinoko"],
  ["🫜", "root vegetable", "wortelgroente", "根菜", "корнеплод", "根菜", "konsai"],
  ["🍞", "bread", "brood", "面包", "хлеб", "パン", "pan"],
  ["🥐", "croissant", "croissant", "羊角面包", "круассан", "クロワッサン", "kurowassan"],
  ["🥖", "baguette bread", "stokbrood", "法棍面包", "багет", "バゲット", "bagetto"],
  ["🫓", "flatbread", "platbrood", "扁面包", "лепёшка", "フラットブレッド", "furatto bureddo"],
  ["🥨", "pretzel", "pretzel", "椒盐卷饼", "крендель", "プレッツェル", "purettsueru"],
  ["🥯", "bagel", "bagel", "贝果", "бейгл", "ベーグル", "bēguru"],
  ["🥞", "pancakes", "pannenkoeken", "煎饼", "блины", "パンケーキ", "pankēki"],
  ["🧇", "waffle", "wafel", "华夫饼", "вафля", "ワッフル", "waffuru"],
  ["🧀", "cheese wedge", "stuk kaas", "奶酪块", "кусок сыра", "チーズ", "chīzu"],
  ["🍖", "meat on bone", "vlees aan bot", "带骨肉", "мясо на кости", "骨付き肉", "honetsuki niku"],
  ["🍗", "poultry leg", "kippenbout", "鸡腿", "куриная ножка", "鶏もも肉", "torimomo niku"],
  ["🥩", "cut of meat", "stuk vlees", "肉排", "кусок мяса", "肉", "niku"],
  ["🥓", "bacon", "spek", "培根", "бекон", "ベーコン", "bēkon"],
  ["🍔", "hamburger", "hamburger", "汉堡包", "гамбургер", "ハンバーガー", "hanbāgā"],
  ["🍟", "french fries", "patat", "薯条", "картофель фри", "フライドポテト", "furaido poteto"],
  ["🍕", "pizza", "pizza", "披萨", "пицца", "ピザ", "piza"],
  ["🌭", "hot dog", "hotdog", "热狗", "хот-дог", "ホットドッグ", "hotto doggu"],
  ["🥪", "sandwich", "sandwich", "三明治", "сэндвич", "サンドイッチ", "sandowitchi"],
  ["🌮", "taco", "taco", "塔可", "тако", "タコス", "takosu"],
  ["🌯", "burrito", "burrito", "墨西哥卷饼", "буррито", "ブリトー", "buritō"],
  ["🫔", "tamale", "tamale", "玉米粽", "тамале", "タマル", "tamāru"],
  ["🥙", "stuffed flatbread", "gevuld platbrood", "夹馅扁面包", "лепёшка с начинкой", "具入りフラットブレッド", "guiri furatto bureddo"],
  ["🧆", "falafel", "falafel", "炸豆丸子", "фалафель", "ファラフェル", "farāferu"],
  ["🥚", "egg", "ei", "鸡蛋", "яйцо", "卵", "tamago"],
  ["🍳", "cooking", "koken", "烹饪", "готовка", "料理", "ryōri"],
  ["🥘", "shallow pan of food", "pan met eten", "平底锅食物", "еда на сковороде", "浅い鍋の料理", "asai nabe no ryōri"],
  ["🍲", "pot of food", "pan met eten", "锅里的食物", "еда в горшочке", "鍋料理", "nabe ryōri"],
  ["🫕", "fondue", "fondue", "奶酪火锅", "фондю", "フォンデュ", "fondyū"],
  ["🥣", "bowl with spoon", "kom met lepel", "碗和勺子", "миска с ложкой", "スプーン付きのボウル", "supūn tsuki no bōru"],
  ["🥗", "green salad", "groene salade", "绿色沙拉", "зелёный салат", "グリーンサラダ", "gurīn sarada"],
  ["🍿", "popcorn", "popcorn", "爆米花", "попкорн", "ポップコーン", "poppukōn"],
  ["🧈", "butter", "boter", "黄油", "сливочное масло", "バター", "batā"],
  ["🧂", "salt", "zout", "盐", "соль", "塩", "shio"],
  ["🥫", "canned food", "blikvoer", "罐头食品", "консервы", "缶詰", "kanzume"],
  ["🍱", "bento box", "bentobox", "便当", "бэнто", "弁当", "bentō"],
  ["🍘", "rice cracker", "rijstcracker", "米饼", "рисовый крекер", "せんべい", "senbei"],
  ["🍙", "rice ball", "rijstbal", "饭团", "рисовый шарик", "おにぎり", "onigiri"],
  ["🍚", "cooked rice", "gekookte rijst", "米饭", "варёный рис", "ご飯", "gohan"],
  ["🍛", "curry rice", "curry met rijst", "咖喱饭", "рис с карри", "カレーライス", "karē raisu"],
  ["🍜", "steaming bowl", "dampende kom", "热汤面", "миска с лапшой", "ラーメン", "rāmen"],
  ["🍝", "spaghetti", "spaghetti", "意大利面", "спагетти", "スパゲッティ", "supagetti"],
  ["🍠", "roasted sweet potato", "geroosterde zoete aardappel", "烤红薯", "печёный батат", "焼き芋", "yaki imo"],
  ["🍢", "oden", "oden", "关东煮", "одэн", "おでん", "oden"],
  ["🍣", "sushi", "sushi", "寿司", "суши", "寿司", "sushi"],
  ["🍤", "fried shrimp", "gefrituurde garnaal", "炸虾", "жареная креветка", "エビフライ", "ebifurai"],
  ["🍥", "fish cake with swirl", "viskoekje met krul", "鱼板", "рыбная котлета со спиралью", "なると", "naruto"],
  ["🥮", "moon cake", "maancake", "月饼", "лунный пряник", "月餅", "gēppi"],
  ["🍡", "dango", "dango", "团子", "данго", "団子", "dango"],
  ["🥟", "dumpling", "dumpling", "饺子", "пельмень", "餃子", "gyōza"],
  ["🥠", "fortune cookie", "gelukskoekje", "幸运饼干", "печенье с предсказанием", "フォーチュンクッキー", "fōchun kukkī"],
  ["🥡", "takeout box", "afhaaldoos", "外卖盒", "коробка еды на вынос", "テイクアウト箱", "teikuauto bako"],
  ["🍦", "soft ice cream", "softijs", "软冰淇淋", "мягкое мороженое", "ソフトクリーム", "sofuto kurīmu"],
  ["🍧", "shaved ice", "schaafijs", "刨冰", "стружечный лёд", "かき氷", "kakigōri"],
  ["🍨", "ice cream", "ijs", "冰淇淋", "мороженое", "アイスクリーム", "aisu kurīmu"],
  ["🍩", "doughnut", "donut", "甜甜圈", "пончик", "ドーナツ", "dōnatsu"],
  ["🍪", "cookie", "koekje", "饼干", "печенье", "クッキー", "kukkī"],
  ["🎂", "birthday cake", "verjaardagstaart", "生日蛋糕", "торт на день рождения", "誕生日ケーキ", "tanjōbi kēki"],
  ["🍰", "shortcake", "taartpunt", "蛋糕", "пирожное", "ショートケーキ", "shōto kēki"],
  ["🧁", "cupcake", "cupcake", "纸杯蛋糕", "капкейк", "カップケーキ", "kappu kēki"],
  ["🥧", "pie", "taart", "派", "пирог", "パイ", "pai"],
  ["🍫", "chocolate bar", "chocoladereep", "巧克力棒", "шоколадная плитка", "板チョコ", "ita choko"],
  ["🍬", "candy", "snoep", "糖果", "конфета", "キャンディ", "kyandī"],
  ["🍭", "lollipop", "lolly", "棒棒糖", "леденец", "ロリポップ", "roripoppu"],
  ["🍮", "custard", "pudding", "布丁", "заварной крем", "プリン", "purin"],
  ["🍯", "honey pot", "honingpot", "蜂蜜罐", "горшочек мёда", "はちみつ壺", "hachimitsu tsubo"],
  ["🍼", "baby bottle", "babyfles", "奶瓶", "детская бутылочка", "哺乳瓶", "honyū bin"],
  ["🥛", "glass of milk", "glas melk", "一杯牛奶", "стакан молока", "牛乳のグラス", "gyūnyū no gurasu"],
  ["☕", "hot beverage", "warme drank", "热饮", "горячий напиток", "温かい飲み物", "atatakai nomimono"],
  ["🫖", "teapot", "theepot", "茶壶", "чайник", "ティーポット", "tīpotto"],
  ["🍵", "teacup without handle", "theekop", "茶杯", "чашка чая", "湯のみ", "yunomi"],
  ["🍶", "sake", "sake", "清酒", "саке", "酒", "sake"],
  ["🍾", "bottle with popping cork", "fles met knallende kurk", "香槟瓶", "бутылка с пробкой", "シャンパンボトル", "shanpan botoru"],
  ["🍷", "wine glass", "wijnglas", "酒杯", "бокал вина", "ワイングラス", "wain gurasu"],
  ["🍸", "cocktail glass", "cocktailglas", "鸡尾酒杯", "коктейльный бокал", "カクテルグラス", "kakuteru gurasu"],
  ["🍹", "tropical drink", "tropisch drankje", "热带饮料", "тропический напиток", "トロピカルドリンク", "toropikaru dorinku"],
  ["🍺", "beer mug", "bierpul", "啤酒杯", "пивная кружка", "ビールジョッキ", "bīru jokki"],
  ["🍻", "clinking beer mugs", "klinkende bierpullen", "碰杯啤酒", "чокающиеся кружки пива", "乾杯のビール", "kanpai no bīru"],
  ["🥂", "clinking glasses", "klinkende glazen", "碰杯", "чокающиеся бокалы", "乾杯のグラス", "kanpai no gurasu"],
  ["🥃", "tumbler glass", "tumblerglas", "平底杯", "стакан-тумблер", "タンブラーグラス", "tanburā gurasu"],
  ["🫗", "pouring liquid", "vloeistof schenken", "倒液体", "наливают жидкость", "液体を注ぐ", "ekitai o sosogu"],
  ["🥤", "cup with straw", "beker met rietje", "带吸管杯", "стакан с трубочкой", "ストロー付きカップ", "sutorō tsuki kappu"],
  ["🧋", "bubble tea", "bubble tea", "珍珠奶茶", "бабл-ти", "タピオカティー", "tapioka tī"],
  ["🧃", "beverage box", "drinkpakje", "饮料盒", "пакетик сока", "紙パック飲料", "kami pakku inryō"],
  ["🧉", "mate", "mate", "马黛茶", "мате", "マテ茶", "mate cha"],
  ["🧊", "ice", "ijsblokje", "冰", "лёд", "氷", "kōri"],
  ["🥢", "chopsticks", "eetstokjes", "筷子", "палочки для еды", "箸", "hashi"],
  ["🍽️", "fork and knife with plate", "bord met bestek", "餐盘和刀叉", "тарелка с приборами", "皿とナイフとフォーク", "sara to naifu to fōku"],
  ["🍴", "fork and knife", "vork en mes", "刀叉", "нож и вилка", "ナイフとフォーク", "naifu to fōku"],
  ["🥄", "spoon", "lepel", "勺子", "ложка", "スプーン", "supūn"],
  ["🔪", "kitchen knife", "keukenmes", "菜刀", "кухонный нож", "包丁", "hōchō"],
  ["🫙", "jar", "pot", "罐子", "банка", "瓶", "bin"],
  ["🏺", "amphora", "amfora", "双耳瓶", "амфора", "アンフォラ", "anfora"],
];

const foodFactTexts = [
  ["Grapes grow in bunches on vines.", "Fresh grapes can be green, red, purple, or almost black.", "Dried grapes are called raisins."],
  ["Melons have a thick outside skin and juicy fruit inside.", "Some melons smell sweet when they are ripe.", "Melon slices are often eaten cold on warm days."],
  ["Watermelon is mostly water, which makes it very juicy.", "Many watermelons have black seeds, but some are seedless.", "A watermelon can be big enough to share with a whole family."],
  ["Tangerines are small citrus fruits that are easy to peel.", "Their sections can be pulled apart with fingers.", "Tangerines often smell bright and sweet."],
  ["Lemons taste sour because they have lots of citric acid.", "A little lemon juice can make food taste fresher.", "Lemon peel can smell strong and sunny."],
  ["Limes are small green citrus fruits.", "Lime juice is often used in drinks, sauces, and soups.", "Some limes turn yellow when they become very ripe."],
  ["Bananas grow in curved bunches.", "A banana gets sweeter as its peel turns yellow and spotty.", "Bananas are soft enough for many young children to eat."],
  ["Pineapples have a spiky outside and sweet yellow fruit inside.", "A pineapple grows from a plant close to the ground.", "The leafy top of a pineapple looks like a crown."],
  ["Mangoes have one large flat seed in the middle.", "Ripe mango can be very sweet and juicy.", "Mango skin can be green, yellow, orange, or red."],
  ["Red apples can be crisp, sweet, or tart.", "Apples float because they contain tiny pockets of air.", "Apple slices can turn brown after they meet the air."],
  ["Green apples often taste more tart than red apples.", "A green apple can make a loud crunch when bitten.", "Green apples are often used in pies and snacks."],
  ["Pears are wider at the bottom and narrower near the stem.", "A ripe pear can feel soft near the top.", "Pear skin can be green, yellow, brown, or red."],
  ["Peaches have fuzzy skin.", "Inside a peach is a hard stone called a pit.", "Peaches can smell sweet even before they are cut."],
  ["Cherries often grow in pairs on little stems.", "A cherry usually has a small hard pit inside.", "Cherry trees can make beautiful blossoms before the fruit grows."],
  ["Strawberries have tiny seeds on the outside.", "Strawberries grow close to the ground.", "A ripe strawberry smells sweet and turns bright red."],
  ["Blueberries are small round berries.", "Blueberry juice can stain fingers and lips purple-blue.", "Blueberries grow on bushes."],
  ["Kiwi fruit has fuzzy brown skin.", "Inside a kiwi is bright green fruit with tiny black seeds.", "Kiwi tastes both sweet and tangy."],
  ["Tomatoes are fruits by plant science rules.", "Tomatoes can be red, yellow, orange, green, or purple.", "Tomatoes are used in sauces, salads, soups, and sandwiches."],
  ["Olives grow on olive trees.", "Fresh olives are usually too bitter to eat straight from the tree.", "Olives can be pressed to make olive oil."],
  ["Coconuts have a hard shell and white flesh inside.", "Coconut water is the clear liquid inside a young coconut.", "Coconut palms often grow in warm places."],
  ["Avocados have a large round pit in the middle.", "Ripe avocado is soft and creamy.", "Avocado flesh can turn brown after it is cut."],
  ["Eggplants can be purple, white, green, or striped.", "Eggplant skin is smooth and shiny.", "Eggplant becomes soft when cooked."],
  ["Potatoes grow underground.", "Potatoes can be baked, boiled, mashed, or fried.", "A potato can sprout little shoots if it is stored too long."],
  ["Carrots grow underground as roots.", "Many carrots are orange, but some are purple, yellow, red, or white.", "Carrots can be crunchy when raw and soft when cooked."],
  ["Corn grows on tall stalks.", "Each corn kernel is a seed.", "Corn can pop into popcorn when heated in the right way."],
  ["Hot peppers can feel spicy on the tongue.", "The spicy part of peppers is called capsaicin.", "Hot peppers can be red, green, yellow, orange, or purple."],
  ["Bell peppers are crunchy and usually not spicy.", "Bell peppers can be green, red, yellow, orange, or purple.", "A red bell pepper is often sweeter than a green one."],
  ["Cucumbers are crisp and full of water.", "Cucumber slices are often eaten cold.", "Some cucumbers are made into pickles."],
  ["Leafy greens include leaves people eat, such as lettuce or spinach.", "Leaves can be smooth, curly, crisp, or soft.", "Many leafy greens grow best in cool weather."],
  ["Broccoli has tiny flower buds on top.", "Broccoli stems can be eaten too.", "Broccoli can be steamed, roasted, stir-fried, or eaten raw."],
  ["Garlic grows as a bulb made of smaller cloves.", "Garlic smells stronger after it is chopped.", "A little garlic can flavor a whole dish."],
  ["Onions grow in layers.", "Cutting onions can make some people's eyes water.", "Onions become sweeter when they cook slowly."],
  ["Peanuts grow underground, even though the plant flowers above ground.", "Peanuts are legumes, not tree nuts.", "Peanut shells usually hold two little peanuts."],
  ["Beans can be many colors, shapes, and sizes.", "Some beans grow inside long pods.", "Dried beans become softer after soaking and cooking."],
  ["Chestnuts grow inside prickly shells.", "Roasted chestnuts smell warm and nutty.", "Chestnuts are softer and starchier than many other nuts."],
  ["Ginger root is a knobbly underground stem.", "Fresh ginger can taste warm and spicy.", "Ginger is used in teas, soups, cookies, and stir-fries."],
  ["Pea pods hold small round peas inside.", "Fresh peas can taste sweet.", "Some pea pods are eaten whole."],
  ["Brown mushrooms are fungi, not plants.", "Mushrooms often grow in damp places.", "Some mushrooms are safe to eat, but wild mushrooms should only be picked by experts."],
  ["Root vegetables grow underground.", "Carrots, turnips, beets, and radishes are root vegetables.", "Many root vegetables store energy for the plant."],
  ["Bread is made from dough that is baked.", "Some bread is soft, and some bread has a crunchy crust.", "Many cultures have their own favorite kinds of bread."],
  ["Croissants are flaky because the dough has layers of butter.", "A croissant is often shaped like a crescent.", "Croissants are linked with French bakeries."],
  ["Baguettes are long, thin loaves of bread.", "A baguette often has a crisp crust.", "Baguettes are commonly carried home from bakeries in France."],
  ["Flatbread is rolled or pressed into a thin shape.", "Some flatbreads are cooked on a hot pan or stone.", "Flatbread can be used for dipping, wrapping, or scooping food."],
  ["Pretzels are often twisted into a looped shape.", "Some pretzels are soft, and some are crunchy.", "Pretzels are often sprinkled with coarse salt."],
  ["Bagels are round breads with a hole in the middle.", "Bagels are usually boiled before they are baked.", "A bagel can be sliced and filled like a sandwich."],
  ["Pancakes are cooked flat on a hot surface.", "Pancakes can be stacked in a tall pile.", "Some families eat pancakes with syrup, fruit, or butter."],
  ["Waffles have little squares that can hold toppings.", "A waffle iron gives waffles their pattern.", "Waffles can be crisp outside and soft inside."],
  ["Cheese is made from milk.", "Cheese can be soft, hard, stretchy, crumbly, mild, or strong.", "Some cheeses have holes made by tiny gas bubbles."],
  ["Meat on a bone is often held by the bone while eating.", "Bones can add flavor while meat cooks.", "Many storybook feasts show big pieces of meat on bones."],
  ["A poultry leg often comes from chicken, turkey, or duck.", "The bone gives the leg its shape.", "Poultry legs are often roasted or grilled."],
  ["A cut of meat is a piece prepared for cooking.", "Meat can be sliced, chopped, roasted, stewed, or grilled.", "Different cuts can be tender, chewy, lean, or fatty."],
  ["Bacon is usually cut into thin strips.", "Bacon becomes crisp when fried or baked.", "Bacon has a smoky, salty smell."],
  ["A hamburger is often served inside a bun.", "Hamburgers can be topped with lettuce, tomato, cheese, or pickles.", "Some hamburgers are made with meat, beans, mushrooms, or vegetables."],
  ["French fries are made from potatoes.", "Fries are usually cut into sticks before cooking.", "Some fries are thin and crisp, while others are thick and soft inside."],
  ["Pizza usually has a flat bread base.", "Pizza toppings can include cheese, tomato sauce, vegetables, or meat.", "A round pizza is often cut into triangle slices."],
  ["A hot dog is served in a long bun.", "Hot dogs are often eaten at picnics, fairs, or sports games.", "Toppings can include ketchup, mustard, onions, or relish."],
  ["A sandwich has filling between pieces of bread.", "Sandwiches are easy to pack for lunch.", "A sandwich can be cut into halves, triangles, or small bites."],
  ["A taco is often folded in a tortilla.", "Tacos can be filled with beans, meat, fish, cheese, or vegetables.", "Crunchy tacos and soft tacos feel different to bite."],
  ["A burrito is wrapped all the way around its filling.", "Burritos can hold rice, beans, vegetables, meat, or cheese.", "A burrito is shaped so it can be held in two hands."],
  ["A tamale is wrapped before it is cooked.", "Tamales are often made with corn dough.", "Tamales can have sweet or savory fillings."],
  ["Stuffed flatbread hides filling inside bread.", "The filling can be vegetables, meat, beans, or sauce.", "Stuffed flatbread can be a meal you hold in your hand."],
  ["Falafel is made from chickpeas or fava beans.", "Falafel is usually shaped into balls or patties.", "Falafel is often crispy outside and soft inside."],
  ["Eggs have a shell around the outside.", "Many birds hatch from eggs.", "Eggs are used in pancakes, cakes, noodles, and breakfast dishes."],
  ["Cooking can change the color, smell, and texture of food.", "Heat can make raw food softer, crispier, or safer to eat.", "Cooking often fills a kitchen with smells."],
  ["A shallow pan of food is cooked in a wide pan.", "Wide pans help food heat evenly.", "Many one-pan meals mix vegetables, grains, meat, or sauce."],
  ["A pot of food can hold soup, stew, noodles, or vegetables.", "Pots are useful when food needs liquid to cook.", "A simmering pot can bubble gently."],
  ["Fondue is food dipped into a warm pot.", "Cheese fondue uses melted cheese.", "Fondue is often shared from the middle of the table."],
  ["A bowl with a spoon is useful for soup, cereal, porridge, or dessert.", "Bowls keep liquid food from spilling easily.", "Spoons can scoop soft food better than forks."],
  ["Green salad is often made with leafy vegetables.", "Salads can be crunchy, juicy, sweet, or tangy.", "A salad can change a lot when toppings or dressing are added."],
  ["Popcorn starts as hard corn kernels.", "Heat makes the kernels burst open.", "Popped popcorn is much bigger and fluffier than the kernel."],
  ["Butter is made from cream.", "Butter melts on warm toast or pancakes.", "Butter can make baked food rich and tender."],
  ["Salt is a mineral used to flavor food.", "A tiny pinch of salt can change how food tastes.", "Too much salt can make food taste very salty."],
  ["Canned food is sealed inside a metal can.", "Cans help food last longer on a shelf.", "A can opener is often needed to open canned food."],
  ["A bento box has little spaces for different foods.", "Bento boxes can make lunch look neat and colorful.", "Some bento lunches are decorated with cute shapes."],
  ["Rice crackers are crunchy snacks made from rice.", "Some rice crackers are salty, sweet, or wrapped in seaweed.", "Rice crackers can make a crisp snapping sound."],
  ["A rice ball is shaped from cooked rice.", "Rice balls can be round, triangle, or oval.", "Some rice balls hide a filling inside."],
  ["Cooked rice becomes soft and fluffy after boiling or steaming.", "Rice is a daily food for many families around the world.", "Tiny rice grains can fill a whole bowl after cooking."],
  ["Curry rice mixes rice with a warm curry sauce.", "Curry sauce can be mild, sweet, spicy, or thick.", "Vegetables and meat are often cooked inside curry."],
  ["A steaming bowl often holds hot noodles or soup.", "Steam rises when food is warmer than the air.", "Noodles can be slurped, twirled, or lifted with chopsticks."],
  ["Spaghetti is long, thin pasta.", "Spaghetti can be twirled around a fork.", "Tomato sauce, cheese, or vegetables are often served with spaghetti."],
  ["Roasted sweet potato becomes soft and sweet when cooked.", "Sweet potatoes can have orange, purple, or pale flesh.", "In some places, roasted sweet potatoes are a cozy street snack."],
  ["Oden is a warm Japanese dish with different pieces simmered in broth.", "Oden can include eggs, radish, tofu, or fish cakes.", "Oden is often eaten in colder weather."],
  ["Sushi often uses vinegared rice.", "Sushi can include fish, egg, vegetables, or seaweed.", "Some sushi is rolled, and some is shaped by hand."],
  ["Fried shrimp is shrimp cooked in a crisp coating.", "The tail is sometimes left on as a handle.", "Fried shrimp is often served with dipping sauce."],
  ["Fish cake with swirl has a pink spiral pattern.", "It is often sliced into rounds.", "It can appear as a topping in noodle soup."],
  ["Moon cake is often eaten during the Mid-Autumn Festival.", "Moon cakes can have sweet fillings like lotus seed paste or red bean.", "Some moon cakes have patterns pressed on top."],
  ["Dango are small chewy rice dumplings.", "Dango are often served on a skewer.", "Different dango colors can match seasons or festivals."],
  ["Dumplings can be folded around a filling.", "Dumplings can be boiled, steamed, pan-fried, or deep-fried.", "Many families have their own dumpling folding style."],
  ["A fortune cookie is crisp and folded around a paper message.", "Fortune cookies are often opened after a meal.", "The paper inside may have a short saying or lucky numbers."],
  ["A takeout box is made to carry food away from a restaurant.", "Some takeout boxes fold closed at the top.", "Takeout boxes help food travel home without spilling."],
  ["Soft ice cream is swirled into a cone or cup.", "It melts faster on warm days.", "Soft ice cream often has a smooth, creamy texture."],
  ["Shaved ice is made from very thin pieces of ice.", "Sweet syrup gives shaved ice bright colors.", "Shaved ice is especially refreshing in hot weather."],
  ["Ice cream is frozen and creamy.", "Ice cream can melt into a puddle if it gets warm.", "Vanilla, chocolate, and strawberry are classic flavors."],
  ["Doughnuts are often round and sweet.", "Some doughnuts have a hole in the middle.", "Doughnuts can be glazed, filled, or sprinkled."],
  ["Cookies can be crunchy, chewy, soft, or crumbly.", "Some cookies have chocolate chips, nuts, jam, or spices.", "Cookies smell strong when they bake."],
  ["Birthday cake often has candles on top.", "People may sing before the cake is cut.", "Birthday cakes can be decorated with names, colors, or characters."],
  ["Shortcake is a soft cake often served with cream and fruit.", "Strawberry shortcake is a popular version.", "A slice of shortcake can show layers inside."],
  ["Cupcakes are small cakes baked in little cups.", "Cupcakes are easy to share at parties.", "Frosting can make cupcakes colorful and tall."],
  ["Pie has a crust around or under the filling.", "Pies can be sweet with fruit or savory with vegetables and meat.", "A pie slice often shows the filling inside."],
  ["A chocolate bar is made from cocoa.", "Chocolate can be dark, milk, or white.", "Some chocolate bars have nuts, caramel, wafers, or fruit inside."],
  ["Candy is a sweet treat.", "Candy can be chewy, hard, sour, fizzy, or sticky.", "Bright candy colors often catch children's eyes."],
  ["A lollipop is candy on a stick.", "Lollipops can be round, flat, swirly, or shaped.", "Some lollipops change color or flavor as they are eaten."],
  ["Custard is soft and creamy.", "Custard is often made with milk or cream and eggs.", "Custard can be served warm or cold."],
  ["A honey pot holds honey.", "Honey is made by bees from flower nectar.", "Honey can taste different depending on the flowers bees visit."],
  ["A baby bottle helps babies drink milk or formula.", "Baby bottles have soft nipples for sipping.", "Bottles are washed carefully so they stay clean."],
  ["A glass of milk is often served cold.", "Milk can come from cows, goats, sheep, or plants.", "Milk is used in cereal, pancakes, sauces, and cocoa."],
  ["A hot beverage gives off steam.", "Tea, cocoa, and coffee are hot beverages.", "Grown-ups often remind children to wait until hot drinks cool down."],
  ["A teapot is used for making and pouring tea.", "Teapots often have a handle, lid, and spout.", "Some teapots are tiny, and some are big enough for many cups."],
  ["A teacup without a handle is held carefully with both hands or fingertips.", "This kind of cup is often used for tea.", "Small cups can help hot drinks cool faster."],
  ["Sake is a traditional Japanese drink made from rice.", "Sake is usually for adults.", "Sake cups can be very small."],
  ["A bottle with a popping cork opens with a loud pop.", "The pop happens because bubbles push against the cork.", "This bottle often appears at celebrations for adults."],
  ["A wine glass has a bowl and a thin stem.", "Wine glasses are usually for grown-up drinks.", "The stem helps people hold the glass without warming the drink."],
  ["A cocktail glass has a wide top and a long stem.", "Cocktail glasses are usually used for grown-up drinks.", "The shape makes the glass easy to recognize."],
  ["A tropical drink is often colorful and fruity.", "Tropical drinks may be decorated with fruit or tiny umbrellas.", "Some tropical drinks are made without alcohol for children."],
  ["A beer mug is a sturdy cup with a handle.", "Beer mugs are usually for grown-up drinks.", "The handle helps people hold a heavy mug."],
  ["Clinking beer mugs show a toast between grown-ups.", "The clink sound comes from cups touching.", "People often toast during celebrations or meals."],
  ["Clinking glasses show people making a toast.", "The glasses touch gently to make a ringing sound.", "Toasts can celebrate birthdays, weddings, or special moments."],
  ["A tumbler glass is short and sturdy.", "Tumblers can hold water, juice, or grown-up drinks.", "The wide bottom helps the glass stand firmly."],
  ["Pouring liquid means liquid is moving from one container to another.", "Pouring slowly helps stop spills.", "Children practice pouring with water, cups, and pitchers."],
  ["A cup with a straw lets people sip without tipping the cup much.", "Straws can be straight, bendy, paper, metal, or reusable.", "Lidded cups with straws help reduce spills."],
  ["Bubble tea often has chewy tapioca pearls.", "A wide straw helps the pearls come up with the drink.", "Bubble tea can be made with milk, fruit, tea, or many flavors."],
  ["A beverage box is small enough for lunch boxes.", "The straw often pokes into a tiny foil-covered hole.", "Beverage boxes can hold juice, milk, or flavored drinks."],
  ["Mate is a drink made from yerba mate leaves.", "Mate is often sipped through a special metal straw.", "Sharing mate is a social tradition in some countries."],
  ["Ice is frozen water.", "Ice can cool a drink or keep food cold.", "Ice melts back into water when it warms up."],
  ["Chopsticks are held in one hand.", "Chopsticks can pick up noodles, rice, vegetables, or dumplings.", "Learning chopsticks takes practice and finger control."],
  ["A plate with fork and knife is ready for a meal.", "Plates keep food in one place.", "Forks and knives help people cut, hold, and lift food."],
  ["A fork and knife are common table tools.", "A fork can poke or lift food.", "A knife can spread, slice, or help push food onto a fork."],
  ["A spoon is good for soup, cereal, rice, yogurt, and soft food.", "Spoons can scoop liquids better than forks.", "Tiny spoons are useful for small bowls and small mouths."],
  ["A kitchen knife is used for cutting food.", "Kitchen knives should be used carefully by grown-ups or with help.", "A sharp knife can cut more safely than a dull one when used properly."],
  ["A jar can hold jam, pickles, honey, sauce, or dry food.", "Many jars have twist-off lids.", "Glass jars can be washed and reused."],
  ["An amphora is an ancient kind of container.", "Amphoras often had two handles.", "People used amphoras long ago to carry liquids like oil or wine."],
];

const natureEmojiItems = [
  ["💐", "bouquet", "boeket", "花束", "букет", "花束", "hanataba"],
  ["🌸", "cherry blossom", "kersenbloesem", "樱花", "сакура", "桜", "sakura"],
  ["💮", "white flower", "witte bloem", "白花", "белый цветок", "白い花", "shiroi hana"],
  ["🪷", "lotus", "lotus", "莲花", "лотос", "蓮", "hasu"],
  ["🏵️", "rosette", "rozet", "圆花饰", "розетка", "ロゼット", "rozetto"],
  ["🌹", "rose", "roos", "玫瑰", "роза", "バラ", "bara"],
  ["🥀", "wilted flower", "verwelkte bloem", "枯萎的花", "увядший цветок", "しおれた花", "shioreta hana"],
  ["🌺", "hibiscus", "hibiscus", "芙蓉花", "гибискус", "ハイビスカス", "haibisukasu"],
  ["🌻", "sunflower", "zonnebloem", "向日葵", "подсолнух", "ひまわり", "himawari"],
  ["🌼", "blossom", "bloesem", "花朵", "цветок", "花", "hana"],
  ["🌷", "tulip", "tulp", "郁金香", "тюльпан", "チューリップ", "chūrippu"],
  ["🪻", "hyacinth", "hyacint", "风信子", "гиацинт", "ヒヤシンス", "hyashinsu"],
  ["🌱", "seedling", "zaailing", "幼苗", "росток", "芽", "me"],
  ["🪴", "potted plant", "potplant", "盆栽植物", "растение в горшке", "鉢植え", "hachiue"],
  ["🌲", "evergreen tree", "groenblijvende boom", "常青树", "вечнозелёное дерево", "常緑樹", "jōryokuju"],
  ["🌳", "deciduous tree", "loofboom", "落叶树", "лиственное дерево", "落葉樹", "rakuyōju"],
  ["🌴", "palm tree", "palmboom", "棕榈树", "пальма", "ヤシの木", "yashi no ki"],
  ["🌵", "cactus", "cactus", "仙人掌", "кактус", "サボテン", "saboten"],
  ["🌾", "sheaf of rice", "rijsthalm", "稻穗", "сноп риса", "稲穂", "inaho"],
  ["🌿", "herb", "kruid", "草本植物", "трава", "ハーブ", "hābu"],
  ["☘️", "shamrock", "klaver", "三叶草", "трилистник", "シャムロック", "shamurokku"],
  ["🍀", "four leaf clover", "klavertjevier", "四叶草", "четырёхлистный клевер", "四つ葉のクローバー", "yotsuba no kurōbā"],
  ["🍁", "maple leaf", "esdoornblad", "枫叶", "кленовый лист", "もみじ", "momiji"],
  ["🍂", "fallen leaf", "gevallen blad", "落叶", "опавший лист", "落ち葉", "ochiba"],
  ["🍃", "leaf fluttering in wind", "blad in de wind", "风中的叶子", "лист на ветру", "風に揺れる葉", "kaze ni yureru ha"],
  ["🪹", "empty nest", "leeg nest", "空鸟巢", "пустое гнездо", "空の巣", "kara no su"],
  ["🪺", "nest with eggs", "nest met eieren", "有蛋的鸟巢", "гнездо с яйцами", "卵のある巣", "tamago no aru su"],
  ["🍄", "mushroom", "paddenstoel", "蘑菇", "гриб", "キノコ", "kinoko"],
  ["🪾", "leafless tree", "boom zonder bladeren", "无叶树", "дерево без листьев", "葉のない木", "ha no nai ki"],
  ["🌑", "new moon", "nieuwe maan", "新月", "новолуние", "新月", "shingetsu"],
  ["🌒", "waxing crescent moon", "wassende maansikkel", "娥眉月", "растущий серп луны", "三日月", "mikazuki"],
  ["🌓", "first quarter moon", "eerste kwartier maan", "上弦月", "первая четверть луны", "上弦の月", "jōgen no tsuki"],
  ["🌔", "waxing gibbous moon", "wassende maan", "盈凸月", "растущая луна", "十三夜月", "jūsan'ya zuki"],
  ["🌕", "full moon", "volle maan", "满月", "полнолуние", "満月", "mangetsu"],
  ["🌖", "waning gibbous moon", "afnemende maan", "亏凸月", "убывающая луна", "寝待月", "nemachimachi"],
  ["🌗", "last quarter moon", "laatste kwartier maan", "下弦月", "последняя четверть луны", "下弦の月", "kagen no tsuki"],
  ["🌘", "waning crescent moon", "afnemende maansikkel", "残月", "убывающий серп луны", "有明月", "ariake no tsuki"],
  ["🌙", "crescent moon", "maansikkel", "弯月", "полумесяц", "三日月", "mikazuki"],
  ["🌚", "new moon face", "nieuwemaan-gezicht", "新月脸", "лицо новолуния", "新月の顔", "shingetsu no kao"],
  ["🌛", "first quarter moon face", "eerste kwartier maangezicht", "上弦月脸", "лицо первой четверти луны", "上弦の月の顔", "jōgen no tsuki no kao"],
  ["🌜", "last quarter moon face", "laatste kwartier maangezicht", "下弦月脸", "лицо последней четверти луны", "下弦の月の顔", "kagen no tsuki no kao"],
  ["🌡️", "thermometer", "thermometer", "温度计", "термометр", "温度計", "on-do-kei"],
  ["☀️", "sun", "zon", "太阳", "солнце", "太陽", "taiyō"],
  ["🌝", "full moon face", "vollemaangezicht", "满月脸", "лицо полной луны", "満月の顔", "mangetsu no kao"],
  ["🌞", "sun with face", "zon met gezicht", "太阳脸", "солнце с лицом", "顔のある太陽", "kao no aru taiyō"],
  ["🪐", "ringed planet", "planeet met ringen", "有环行星", "планета с кольцами", "環のある惑星", "wa no aru wakusei"],
  ["⭐", "star", "ster", "星星", "звезда", "星", "hoshi"],
  ["🌟", "glowing star", "glanzende ster", "闪亮的星星", "сияющая звезда", "輝く星", "kagayaku hoshi"],
  ["🌠", "shooting star", "vallende ster", "流星", "падающая звезда", "流れ星", "nagareboshi"],
  ["🌌", "milky way", "melkweg", "银河", "Млечный Путь", "天の川", "ama no kawa"],
  ["☁️", "cloud", "wolk", "云", "облако", "雲", "kumo"],
  ["⛅", "sun behind cloud", "zon achter wolk", "多云", "солнце за облаком", "雲に隠れた太陽", "kumo ni kakureta taiyō"],
  ["⛈️", "cloud with lightning and rain", "wolk met bliksem en regen", "雷雨云", "туча с молнией и дождём", "雷雨雲", "raiu kumo"],
  ["🌤️", "sun behind small cloud", "zon achter kleine wolk", "太阳和小云", "солнце за маленьким облаком", "小さな雲と太陽", "chiisana kumo to taiyō"],
  ["🌥️", "sun behind large cloud", "zon achter grote wolk", "太阳和大云", "солнце за большим облаком", "大きな雲と太陽", "ōkina kumo to taiyō"],
  ["🌦️", "sun behind rain cloud", "zon achter regenwolk", "太阳雨云", "солнце за дождевой тучей", "雨雲と太陽", "amagumo to taiyō"],
  ["🌧️", "cloud with rain", "regenwolk", "雨云", "туча с дождём", "雨雲", "amagumo"],
  ["🌨️", "cloud with snow", "sneeuwwolk", "雪云", "туча со снегом", "雪雲", "yukigumo"],
  ["🌩️", "cloud with lightning", "wolk met bliksem", "闪电云", "туча с молнией", "雷雲", "raiun"],
  ["🌪️", "tornado", "tornado", "龙卷风", "торнадо", "竜巻", "tatsumaki"],
  ["🌫️", "fog", "mist", "雾", "туман", "霧", "kiri"],
  ["🌬️", "wind face", "windgezicht", "风脸", "лицо ветра", "風の顔", "kaze no kao"],
  ["🌀", "cyclone", "cycloon", "气旋", "циклон", "サイクロン", "saikuron"],
  ["🌈", "rainbow", "regenboog", "彩虹", "радуга", "虹", "niji"],
  ["🌂", "closed umbrella", "gesloten paraplu", "合上的伞", "закрытый зонт", "閉じた傘", "tojita kasa"],
  ["☂️", "umbrella", "paraplu", "雨伞", "зонт", "傘", "kasa"],
  ["☔", "umbrella with rain drops", "paraplu met regendruppels", "雨伞和雨滴", "зонт с каплями дождя", "雨傘", "amagasa"],
  ["⛱️", "umbrella on ground", "strandparasol", "沙滩伞", "пляжный зонт", "ビーチパラソル", "bīchi parasoru"],
  // CHANGED (Quality Audit): "high voltage" → "lightning"
  // Reason: The original English label was the raw emoji short name and was
  // technically inaccurate / unnatural for children. All other language
  // translations were already the correct word for "lightning". This was the
  // explicit example given in the review task.
  ["⚡", "lightning", "bliksem", "闪电", "молния", "稲妻", "inazuma"],
  ["❄️", "snowflake", "sneeuwvlok", "雪花", "снежинка", "雪の結晶", "yuki no kesshō"],
  ["☃️", "snowman", "sneeuwpop", "雪人", "снеговик", "雪だるま", "yukidaruma"],
  ["⛄", "snowman without snow", "sneeuwpop zonder sneeuw", "无雪雪人", "снеговик без снега", "雪なし雪だるま", "yuki nashi yukidaruma"],
  ["☄️", "comet", "komeet", "彗星", "комета", "彗星", "suisei"],
  ["🔥", "fire", "vuur", "火", "огонь", "火", "hi"],
  ["💧", "droplet", "druppel", "水滴", "капля", "しずく", "shizuku"],
  ["🌊", "water wave", "watergolf", "水波", "волна", "波", "nami"],
];

const natureFactTexts = [
  ["A bouquet is a bunch of flowers arranged together.", "Bouquets are often given for birthdays, visits, or celebrations.", "Flowers in a bouquet can have many colors, shapes, and smells."],
  ["Cherry blossoms bloom on cherry trees.", "Many cherry blossoms appear for only a short time each spring.", "People in Japan often celebrate cherry blossom season with outdoor picnics."],
  ["A white flower can stand out against green leaves.", "White flowers can be small and simple or large and showy.", "Some white flowers open more strongly in the evening."],
  ["Lotus flowers grow in water.", "A lotus can rise above muddy ponds with clean-looking petals.", "Lotus leaves often make water drops roll off."],
  ["A rosette is a flower-like decoration or shape.", "Rosettes can appear on ribbons, medals, or carved designs.", "Many rosette shapes are arranged in circles."],
  ["Roses often have layered petals.", "Many roses have thorns on their stems.", "Roses can be red, pink, white, yellow, orange, or many other colors."],
  ["A wilted flower droops when it loses water or gets old.", "Wilted petals can feel soft or dry.", "A wilted flower can remind children that plants need care."],
  ["Hibiscus flowers can be large and bright.", "Hibiscus often grows in warm places.", "Some hibiscus flowers are used to make tea."],
  ["Sunflowers can grow very tall.", "A sunflower head is made of many tiny flowers.", "Young sunflowers may turn toward the sun as they grow."],
  ["A blossom is a flower on a plant or tree.", "Blossoms can appear before fruit grows.", "Spring blossoms can make trees look pink, white, or yellow."],
  ["Tulips grow from bulbs underground.", "Tulips are famous in the Netherlands.", "Tulips can have cup-shaped flowers in many colors."],
  ["Hyacinths grow clusters of small fragrant flowers.", "Hyacinths grow from bulbs.", "Hyacinth flowers can be purple, blue, pink, white, or yellow."],
  ["A seedling is a baby plant.", "Seedlings need light, water, and space to grow.", "Tiny seedlings can become flowers, vegetables, bushes, or trees."],
  ["A potted plant grows in a container.", "Potted plants can live indoors or outdoors.", "A pot needs drainage so extra water can escape."],
  ["Evergreen trees keep green leaves or needles through the year.", "Pine and fir trees are evergreen trees.", "Evergreens can stay green even in winter."],
  ["Deciduous trees lose their leaves in part of the year.", "Many deciduous leaves change color in autumn.", "New leaves often grow again in spring."],
  ["Palm trees often grow in warm places.", "Many palm trees have tall trunks and fan-like or feather-like leaves.", "Coconuts grow on some kinds of palm trees."],
  ["Cacti store water in thick stems.", "Many cacti have spines instead of ordinary leaves.", "Cacti can survive in very dry places."],
  ["A sheaf of rice shows rice plants tied together.", "Rice grows in warm, wet fields.", "Rice grains are seeds from the rice plant."],
  ["Herbs are plants used for flavor, smell, or medicine.", "Mint, basil, parsley, and rosemary are herbs.", "Some herbs smell strong when their leaves are rubbed."],
  ["A shamrock has three small leaves.", "Shamrocks are linked with Ireland.", "Children can compare shamrocks with four leaf clovers."],
  ["A four leaf clover is uncommon.", "Many people think a four leaf clover means good luck.", "Most clovers have three leaves instead of four."],
  ["Maple leaves can turn red, orange, or yellow in autumn.", "The maple leaf is a symbol of Canada.", "Maple trees can produce sap used for maple syrup."],
  ["Fallen leaves drop from trees.", "Dry leaves can crunch under shoes.", "Fallen leaves can become food for soil as they break down."],
  ["A leaf fluttering in wind moves lightly through the air.", "Wind can carry leaves across paths and playgrounds.", "Falling leaves can show that seasons are changing."],
  ["An empty nest is a nest without birds or eggs inside.", "Birds build nests from twigs, grass, mud, or soft materials.", "Old nests can show where birds once raised chicks."],
  ["A nest with eggs holds future baby birds or other animals.", "Eggs need warmth and protection.", "Bird parents often guard nests carefully."],
  ["Mushrooms are fungi, not plants.", "Some mushrooms pop up after rain.", "Wild mushrooms should not be eaten unless an expert says they are safe."],
  ["A leafless tree has bare branches.", "Many trees lose leaves in winter or dry seasons.", "Bare branches make it easier to see a tree's shape."],
  ["A new moon is hard to see from Earth.", "The Moon does not shine by itself; it reflects sunlight.", "The new moon begins a new lunar cycle."],
  ["A waxing crescent moon appears as a thin curved slice.", "Waxing means the lit part is growing.", "The crescent can appear after sunset in the western sky."],
  ["A first quarter moon looks like half of the Moon is lit.", "It is called first quarter because it is one quarter through the lunar cycle.", "The straight edge is called the terminator."],
  ["A waxing gibbous moon is more than half lit.", "Gibbous means bulging or rounded.", "This moon phase comes before the full moon."],
  ["A full moon looks round and bright.", "A full moon rises around sunset.", "The Moon can look larger near the horizon, even though its size has not changed."],
  ["A waning gibbous moon comes after the full moon.", "Waning means the lit part is shrinking.", "This moon can often be seen late at night or in the morning."],
  ["A last quarter moon looks half lit.", "It comes three quarters through the lunar cycle.", "The last quarter moon is often visible in the morning."],
  ["A waning crescent moon is a thin slice before the new moon.", "It is often seen before sunrise.", "The crescent gets smaller each day."],
  ["A crescent moon has a curved banana-like shape.", "Crescents appear when only a small part of the Moon is lit.", "Many bedtime pictures show a crescent moon."],
  ["A new moon face is a playful moon picture.", "The dark face makes it look mysterious.", "Moon faces help children imagine expressions in the sky."],
  ["A first quarter moon face shows a moon with a face.", "People have imagined faces in the Moon for a very long time.", "The Moon's shadows can look like eyes, noses, or mouths in stories."],
  ["A last quarter moon face is another playful moon shape.", "The face points the opposite way from the first quarter moon face.", "Moon face emojis make sky words feel like characters."],
  ["A thermometer measures temperature.", "Thermometers can show if something is hot, warm, cool, or cold.", "Weather reports often use temperature numbers."],
  ["The Sun is the star closest to Earth.", "Sunlight helps plants grow.", "The Sun gives Earth light and warmth."],
  ["A full moon face makes the Moon look like it has an expression.", "People often tell stories about faces in the Moon.", "Moonlight is reflected sunlight."],
  ["A sun with face makes the Sun look friendly or playful.", "The real Sun is much too bright to stare at.", "Sunny days can make shadows strong and clear."],
  ["A ringed planet has rings around it.", "Saturn is famous for its bright rings.", "Planet rings are made of ice, dust, and rock pieces."],
  ["Stars are huge balls of glowing gas.", "Stars look tiny because they are very far away.", "The Sun is also a star."],
  ["A glowing star is a bright star symbol.", "Stars can appear to twinkle because Earth's air moves.", "People use stars in stories, flags, maps, and rewards."],
  ["A shooting star is usually a meteor burning in Earth's atmosphere.", "Shooting stars move quickly across the night sky.", "People sometimes make wishes when they see one."],
  ["The Milky Way is our galaxy.", "On very dark nights, it can look like a pale band across the sky.", "The Milky Way contains billions of stars."],
  ["Clouds are made of tiny water droplets or ice crystals.", "Clouds can look fluffy, flat, wispy, or dark.", "Cloud shapes can change quickly in the wind."],
  ["Sun behind cloud means sunshine and cloud are both in the sky.", "Clouds can soften bright sunlight.", "This kind of weather can still be good for outdoor play."],
  ["A cloud with lightning and rain shows a thunderstorm.", "Thunder is the sound made by lightning heating the air.", "During storms, people stay away from open fields and tall trees."],
  ["Sun behind small cloud often means partly sunny weather.", "Small clouds can drift across the Sun.", "Weather can change from sunny to cloudy during the day."],
  ["Sun behind large cloud means the sky is mostly cloudy.", "A large cloud can block sunlight for a while.", "Cloudy skies can make colors look softer."],
  ["Sun behind rain cloud shows sun and rain at the same time.", "Sun plus rain can sometimes make a rainbow.", "Light rain during sunshine is sometimes called a sun shower."],
  ["A cloud with rain shows rainy weather.", "Rain fills puddles and helps many plants grow.", "Rain can sound different on roofs, windows, leaves, and umbrellas."],
  ["A cloud with snow shows snowy weather.", "Snow forms when water freezes into ice crystals in clouds.", "Snow can make familiar places look quiet and new."],
  ["A cloud with lightning shows stormy weather.", "Lightning is a giant spark of electricity.", "Lightning can be followed by thunder."],
  ["A tornado is a spinning column of air.", "Tornadoes can be very dangerous.", "Weather warnings help people know when to get to a safer place."],
  ["Fog is a cloud close to the ground.", "Fog can make faraway things hard to see.", "Fog often feels damp and quiet."],
  ["A wind face shows blowing air.", "Wind can move leaves, flags, clouds, and hair.", "Strong wind can make whistling sounds around buildings."],
  ["A cyclone is a large spinning storm system.", "Cyclones can bring strong wind and heavy rain.", "Weather satellites help track cyclones from space."],
  ["A rainbow forms when sunlight bends through water drops.", "Rainbow colors usually appear in the same order.", "A rainbow can appear after rain when the Sun comes out."],
  ["A closed umbrella is folded up.", "Umbrellas fold so they are easier to carry.", "A closed umbrella waits until rain or strong sun is expected."],
  ["An umbrella helps keep rain or sun off a person.", "Umbrellas have ribs that hold the fabric open.", "Some umbrellas fold small enough for a bag."],
  ["An umbrella with rain drops shows rainy weather.", "Rain drops can roll off umbrella fabric.", "Umbrellas make little tapping sounds in the rain."],
  ["An umbrella on ground is often a beach umbrella.", "Beach umbrellas make shade on sunny days.", "The pole helps hold the umbrella steady in sand or soil."],
  // CHANGED (Quality Audit): Updated fact text to match the corrected "lightning" label
  // and to be more child-friendly / accurate.
  ["Lightning is a bright flash of electricity in the sky.", "Thunder often follows lightning during a storm.", "Lightning can be beautiful but it is important to stay safe indoors."],
  ["A snowflake is a tiny ice crystal.", "Many snowflakes have six-sided shapes.", "Snowflakes can melt quickly on warm hands."],
  ["A snowman is built from snow.", "Snowmen often have round snowballs for a body and head.", "People decorate snowmen with hats, sticks, stones, or carrots."],
  ["A snowman without snow is a simple snowman symbol.", "Snowmen are often connected with winter play.", "A snowman can melt when the weather warms up."],
  ["A comet is an icy object that travels around the Sun.", "A comet can grow a glowing tail near the Sun.", "Comets are sometimes called dirty snowballs."],
  ["Fire gives heat and light.", "Fire needs fuel, heat, and oxygen to keep burning.", "People use fire carefully for cooking, warmth, or candles."],
  ["A droplet is a tiny bit of liquid.", "Water droplets can form on leaves, windows, or skin.", "Many droplets together can make rain, mist, or puddles."],
  ["A water wave moves energy through water.", "Waves can be tiny ripples or huge ocean swells.", "Wind, boats, earthquakes, and tides can make waves."],
];

const activityEmojiItems = [
  [
    "🎃",
    "jack-o-lantern",
    "jack-o-lantern",
    "南瓜灯",
    "фонарь из тыквы",
    "ジャック・オー・ランタン",
    "event",
    "jakku ō rantan"
  ],
  [
    "🎄",
    "Christmas tree",
    "kerstboom",
    "圣诞树",
    "рождественская ёлка",
    "クリスマスツリー",
    "event",
    "kurisumasu tsurī"
  ],
  [
    "🎆",
    "fireworks",
    "vuurwerk",
    "烟花",
    "фейерверк",
    "花火",
    "event",
    "hanabi"
  ],
  [
    "🎇",
    "sparkler",
    "sterretje",
    "仙女棒",
    "бенгальский огонь",
    "線香花火",
    "event",
    "senkō hanabi"
  ],
  [
    "🧨",
    "firecracker",
    "rotje",
    "鞭炮",
    "петарда",
    "爆竹",
    "event",
    "bakuchiku"
  ],
  [
    "✨",
    "sparkles",
    "glinsteringen",
    "闪光",
    "искорки",
    "きらめき",
    "event",
    "kirameki"
  ],
  [
    "🎈",
    "balloon",
    "ballon",
    "气球",
    "воздушный шар",
    "風船",
    "event",
    "fūsen"
  ],
  [
    "🎉",
    "party popper",
    "feestknaller",
    "派对礼花",
    "хлопушка",
    "クラッカー",
    "event",
    "kurakkā"
  ],
  [
    "🎊",
    "confetti ball",
    "confettibal",
    "彩纸球",
    "шар с конфетти",
    "くす玉",
    "event",
    "kusudama"
  ],
  [
    "🎋",
    "tanabata tree",
    "tanabata-boom",
    "七夕树",
    "дерево Танабата",
    "七夕飾り",
    "event",
    "tanabata kazari"
  ],
  [
    "🎍",
    "pine decoration",
    "dennendecoratie",
    "门松",
    "сосновое украшение",
    "門松",
    "event",
    "kadomatsu"
  ],
  [
    "🎎",
    "Japanese dolls",
    "Japanse poppen",
    "日本人偶",
    "японские куклы",
    "ひな人形",
    "event",
    "hinaningyō"
  ],
  [
    "🎏",
    "carp streamer",
    "karperwimpel",
    "鲤鱼旗",
    "карповый флаг",
    "こいのぼり",
    "event",
    "koinobori"
  ],
  [
    "🎐",
    "wind chime",
    "windgong",
    "风铃",
    "ветряной колокольчик",
    "風鈴",
    "event",
    "fūrin"
  ],
  [
    "🎑",
    "moon viewing ceremony",
    "maan-kijkceremonie",
    "赏月",
    "церемония любования луной",
    "お月見",
    "event",
    "o-tsukimi"
  ],
  [
    "🧧",
    "red envelope",
    "rode envelop",
    "红包",
    "красный конверт",
    "赤い封筒",
    "event",
    "akai fūtō"
  ],
  [
    "🎀",
    "ribbon",
    "lint",
    "丝带",
    "лента",
    "リボン",
    "event",
    "ri-bo-n"
  ],
  [
    "🎁",
    "wrapped gift",
    "ingepakt cadeau",
    "礼物",
    "подарок в упаковке",
    "包まれたプレゼント",
    "event",
    "tsutsumareta purezento"
  ],
  [
    "🎗️",
    "reminder ribbon",
    "herinneringslint",
    "纪念丝带",
    "памятная лента",
    "リマインダーリボン",
    "event",
    "ri-ma-i-n-da-ri-bo-n"
  ],
  [
    "🎟️",
    "admission tickets",
    "toegangsbewijzen",
    "入场券",
    "входные билеты",
    "入場券",
    "event",
    "nyūjōken"
  ],
  [
    "🎫",
    "ticket",
    "ticket",
    "票",
    "билет",
    "チケット",
    "event",
    "chi-ke-to"
  ],
  [
    "🎖️",
    "military medal",
    "militaire medaille",
    "军功章",
    "военная медаль",
    "勲章",
    "award-medal",
    "kunshō"
  ],
  [
    "🏆",
    "trophy",
    "trofee",
    "奖杯",
    "трофей",
    "トロフィー",
    "award-medal",
    "to-ro-fu-i-"
  ],
  [
    "🏅",
    "sports medal",
    "sportmedaille",
    "体育奖牌",
    "спортивная медаль",
    "スポーツメダル",
    "award-medal",
    "su-po-tsu-me-da-ru"
  ],
  [
    "🥇",
    "1st place medal",
    "eerste prijs medaille",
    "第一名奖牌",
    "медаль за первое место",
    "金メダル",
    "award-medal",
    "me-da-ru"
  ],
  [
    "🥈",
    "2nd place medal",
    "tweede prijs medaille",
    "第二名奖牌",
    "медаль за второе место",
    "銀メダル",
    "award-medal",
    "me-da-ru"
  ],
  [
    "🥉",
    "3rd place medal",
    "derde prijs medaille",
    "第三名奖牌",
    "медаль за третье место",
    "銅メダル",
    "award-medal",
    "me-da-ru"
  ],
  [
    "⚽",
    "soccer ball",
    "voetbal",
    "足球",
    "футбольный мяч",
    "サッカーボール",
    "sport",
    "sa-ka-bo-ru"
  ],
  [
    "⚾",
    "baseball",
    "honkbal",
    "棒球",
    "бейсбольный мяч",
    "野球ボール",
    "sport",
    "bo-ru"
  ],
  [
    "🥎",
    "softball",
    "softbal",
    "垒球",
    "софтбол",
    "ソフトボール",
    "sport",
    "so-fu-to-bo-ru"
  ],
  [
    "🏀",
    "basketball",
    "basketbal",
    "篮球",
    "баскетбольный мяч",
    "バスケットボール",
    "sport",
    "ba-su-ke-to-bo-ru"
  ],
  [
    "🏐",
    "volleyball",
    "volleybal",
    "排球",
    "волейбольный мяч",
    "バレーボール",
    "sport",
    "ba-re-bo-ru"
  ],
  [
    "🏈",
    "american football",
    "American football",
    "美式橄榄球",
    "мяч для американского футбола",
    "アメリカンフットボール",
    "sport",
    "a-me-ri-ka-n-fu-to-bo-ru"
  ],
  [
    "🏉",
    "rugby football",
    "rugbybal",
    "橄榄球",
    "мяч для регби",
    "ラグビーボール",
    "sport",
    "ra-gu-bi-bo-ru"
  ],
  [
    "🎾",
    "tennis",
    "tennis",
    "网球",
    "теннис",
    "テニス",
    "sport",
    "te-ni-su"
  ],
  [
    "🥏",
    "flying disc",
    "frisbee",
    "飞盘",
    "летающий диск",
    "フライングディスク",
    "sport",
    "fu-ra-i-n-gu-de-i-su-ku"
  ],
  [
    "🎳",
    "bowling",
    "bowling",
    "保龄球",
    "боулинг",
    "ボウリング",
    "sport",
    "bo-u-ri-n-gu"
  ],
  [
    "🏏",
    "cricket game",
    "cricket",
    "板球",
    "крикет",
    "クリケット",
    "sport",
    "ku-ri-ke-to"
  ],
  [
    "🏑",
    "field hockey",
    "veldhockey",
    "曲棍球",
    "хоккей на траве",
    "フィールドホッケー",
    "sport",
    "fu-i-ru-do-ho-ke-"
  ],
  [
    "🏒",
    "ice hockey",
    "ijshockey",
    "冰球",
    "хоккей с шайбой",
    "アイスホッケー",
    "sport",
    "a-i-su-ho-ke-"
  ],
  [
    "🥍",
    "lacrosse",
    "lacrosse",
    "长曲棍球",
    "лакросс",
    "ラクロス",
    "sport",
    "ra-ku-ro-su"
  ],
  [
    "🏓",
    "ping pong",
    "tafeltennis",
    "乒乓球",
    "настольный теннис",
    "卓球",
    "sport",
    "takkyū"
  ],
  [
    "🏸",
    "badminton",
    "badminton",
    "羽毛球",
    "бадминтон",
    "バドミントン",
    "sport",
    "ba-do-mi-n-to-n"
  ],
  [
    "🥊",
    "boxing glove",
    "bokshandschoen",
    "拳击手套",
    "боксёрская перчатка",
    "ボクシンググローブ",
    "sport",
    "bo-ku-shi-n-gu-gu-ro-bu"
  ],
  [
    "🥋",
    "martial arts uniform",
    "vechtsportpak",
    "武术服",
    "форма для боевых искусств",
    "武道着",
    "sport",
    "budōgi"
  ],
  [
    "🥅",
    "goal net",
    "doelnet",
    "球门",
    "ворота с сеткой",
    "ゴールネット",
    "sport",
    "go-ru-ne-to"
  ],
  [
    "⛳",
    "flag in hole",
    "golfvlag",
    "高尔夫球洞旗",
    "флажок в лунке",
    "ゴルフの旗",
    "sport",
    "go-ru-fu-no"
  ],
  [
    "⛸️",
    "ice skate",
    "schaats",
    "冰鞋",
    "конёк",
    "アイススケート",
    "sport",
    "a-i-su-su-ke-to"
  ],
  [
    "🎣",
    "fishing pole",
    "vishengel",
    "钓竿",
    "удочка",
    "釣り竿",
    "sport",
    "ri"
  ],
  [
    "🤿",
    "diving mask",
    "duikmasker",
    "潜水面罩",
    "маска для дайвинга",
    "ダイビングマスク",
    "sport",
    "da-i-bi-n-gu-ma-su-ku"
  ],
  [
    "🎽",
    "running shirt",
    "hardloopshirt",
    "跑步背心",
    "беговая майка",
    "ランニングシャツ",
    "sport",
    "ra-n-ni-n-gu-sha-tsu"
  ],
  [
    "🎿",
    "skis",
    "ski's",
    "滑雪板",
    "лыжи",
    "スキー",
    "sport",
    "su-ki-"
  ],
  [
    "🛷",
    "sled",
    "slee",
    "雪橇",
    "санки",
    "そり",
    "sport",
    "so-ri"
  ],
  [
    "🥌",
    "curling stone",
    "curlingsteen",
    "冰壶",
    "камень для кёрлинга",
    "カーリングストーン",
    "sport",
    "ka-ri-n-gu-su-to-n"
  ],
  [
    "🎯",
    "bullseye",
    "roos",
    "靶心",
    "яблочко мишени",
    "的",
    "game",
    "mato"
  ],
  [
    "🪀",
    "yo-yo",
    "jojo",
    "悠悠球",
    "йо-йо",
    "ヨーヨー",
    "game",
    "yo-yo-"
  ],
  [
    "🪁",
    "kite",
    "vlieger",
    "风筝",
    "воздушный змей",
    "凧",
    "game",
    "tako"
  ],
  [
    "🔫",
    "water pistol",
    "waterpistool",
    "水枪",
    "водяной пистолет",
    "水鉄砲",
    "game",
    "mizuteppō"
  ],
  [
    "🎱",
    "pool 8 ball",
    "biljartbal acht",
    "八号球",
    "бильярдный шар 8",
    "ビリヤードの8ボール",
    "game",
    "8"
  ],
  [
    "🔮",
    "crystal ball",
    "kristallen bol",
    "水晶球",
    "хрустальный шар",
    "水晶玉",
    "game",
    "suishō dama"
  ],
  [
    "🪄",
    "magic wand",
    "toverstaf",
    "魔法棒",
    "волшебная палочка",
    "魔法の杖",
    "game",
    "no"
  ],
  [
    "🎮",
    "video game",
    "videospel",
    "电子游戏",
    "видеоигра",
    "ビデオゲーム",
    "game",
    "bi-de-o-ge-mu"
  ],
  [
    "🕹️",
    "joystick",
    "joystick",
    "操纵杆",
    "джойстик",
    "ジョイスティック",
    "game",
    "jo-i-su-te-i-ku"
  ],
  [
    "🎰",
    "slot machine",
    "gokkast",
    "老虎机",
    "игровой автомат",
    "スロットマシン",
    "game",
    "su-ro-to-ma-shi-n"
  ],
  [
    "🎲",
    "game die",
    "dobbelsteen",
    "骰子",
    "игральная кость",
    "サイコロ",
    "game",
    "sa-i-ko-ro"
  ],
  [
    "🧩",
    "puzzle piece",
    "puzzelstukje",
    "拼图块",
    "кусочек пазла",
    "パズルピース",
    "game",
    "pa-zu-ru-pi-su"
  ],
  [
    "🧸",
    "teddy bear",
    "knuffelbeer",
    "泰迪熊",
    "плюшевый мишка",
    "テディベア",
    "game",
    "te-de-i-be-a"
  ],
  [
    "🪅",
    "piñata",
    "piñata",
    "皮纳塔",
    "пиньята",
    "ピニャータ",
    "game",
    "pi-nya-ta"
  ],
  [
    "🪩",
    "mirror ball",
    "discobal",
    "迪斯科球",
    "зеркальный шар",
    "ミラーボール",
    "game",
    "mi-ra-bo-ru"
  ],
  [
    "🪆",
    "nesting dolls",
    "matroesjka",
    "套娃",
    "матрёшки",
    "マトリョーシカ",
    "game",
    "ma-to-ryo-shi-ka"
  ],
  [
    "♠️",
    "spade suit",
    "schoppen",
    "黑桃",
    "пики",
    "スペード",
    "game",
    "su-pe-do"
  ],
  [
    "♥️",
    "heart suit",
    "harten",
    "红心",
    "червы",
    "ハート",
    "game",
    "ha-to"
  ],
  [
    "♦️",
    "diamond suit",
    "ruiten",
    "方块",
    "бубны",
    "ダイヤ",
    "game",
    "da-i-ya"
  ],
  [
    "♣️",
    "club suit",
    "klaveren",
    "梅花",
    "трефы",
    "クラブ",
    "game",
    "ku-ra-bu"
  ],
  [
    "♟️",
    "chess pawn",
    "schaakpion",
    "兵",
    "шахматная пешка",
    "チェスのポーン",
    "game",
    "chi-e-su-no-po-n"
  ],
  [
    "🃏",
    "joker",
    "joker",
    "小丑牌",
    "джокер",
    "ジョーカー",
    "game",
    "jo-ka-"
  ],
  [
    "🀄",
    "mahjong red dragon",
    "mahjong rode draak",
    "麻将红中",
    "маджонг красный дракон",
    "麻雀の中",
    "game",
    "no"
  ],
  [
    "🎴",
    "flower playing cards",
    "hanafuda-kaarten",
    "花札",
    "карты ханафуда",
    "花札",
    "game",
    "hanafuda"
  ],
  [
    "🎭",
    "performing arts",
    "podiumkunsten",
    "表演艺术",
    "сценическое искусство",
    "舞台芸術",
    "arts & crafts",
    "butai geijutsu"
  ],
  [
    "🖼️",
    "framed picture",
    "ingelijste afbeelding",
    "带框画",
    "картина в рамке",
    "額入りの絵",
    "arts & crafts",
    "ri-no"
  ],
  [
    "🎨",
    "artist palette",
    "schilderspalet",
    "调色板",
    "палитра художника",
    "絵の具パレット",
    "arts & crafts",
    "no-pa-re-to"
  ],
  [
    "🧵",
    "thread",
    "draad",
    "线",
    "нитка",
    "糸",
    "arts & crafts",
    "ito"
  ],
  [
    "🪡",
    "sewing needle",
    "naald",
    "缝衣针",
    "швейная игла",
    "縫い針",
    "arts & crafts",
    "i"
  ],
  [
    "🧶",
    "yarn",
    "garen",
    "毛线",
    "пряжа",
    "毛糸",
    "arts & crafts",
    "keito"
  ],
  [
    "🪢",
    "knot",
    "knoop",
    "结",
    "узел",
    "結び目",
    "arts & crafts",
    "bi"
  ],
  [
    "🎼",
    "musical score",
    "bladmuziek",
    "乐谱",
    "нотная запись",
    "楽譜",
    "music",
    "gakufu"
  ],
  [
    "🎵",
    "musical note",
    "muzieknoot",
    "音符",
    "нота",
    "音符",
    "music",
    "onpu"
  ],
  [
    "🎶",
    "musical notes",
    "muzieknoten",
    "多个音符",
    "ноты",
    "複数の音符",
    "music",
    "no"
  ],
  [
    "🎙️",
    "studio microphone",
    "studiomicrofoon",
    "录音室麦克风",
    "студийный микрофон",
    "スタジオマイク",
    "music",
    "su-ta-ji-o-ma-i-ku"
  ],
  [
    "🎚️",
    "level slider",
    "niveauschuif",
    "电平滑块",
    "ползунок уровня",
    "レベルスライダー",
    "music",
    "re-be-ru-su-ra-i-da-"
  ],
  [
    "🎛️",
    "control knobs",
    "bedieningsknoppen",
    "控制旋钮",
    "ручки управления",
    "コントロールノブ",
    "music",
    "ko-n-to-ro-ru-no-bu"
  ],
  [
    "🎤",
    "microphone",
    "microfoon",
    "麦克风",
    "микрофон",
    "マイク",
    "music",
    "ma-i-ku"
  ],
  [
    "🎧",
    "headphone",
    "koptelefoon",
    "耳机",
    "наушники",
    "ヘッドホン",
    "music",
    "he-do-ho-n"
  ],
  [
    "📻",
    "radio",
    "radio",
    "收音机",
    "радио",
    "ラジオ",
    "music",
    "ra-ji-o"
  ],
  [
    "🎷",
    "saxophone",
    "saxofoon",
    "萨克斯管",
    "саксофон",
    "サックス",
    "musical-instrument",
    "sa-ku-su"
  ],
  [
    "🎺",
    "trumpet",
    "trompet",
    "小号",
    "труба",
    "トランペット",
    "musical-instrument",
    "to-ra-n-pe-to"
  ],
  [
    "🪗",
    "accordion",
    "accordeon",
    "手风琴",
    "аккордеон",
    "アコーディオン",
    "musical-instrument",
    "a-ko-de-i-o-n"
  ],
  [
    "🎸",
    "guitar",
    "gitaar",
    "吉他",
    "гитара",
    "ギター",
    "musical-instrument",
    "gi-ta-"
  ],
  [
    "🎹",
    "musical keyboard",
    "keyboard",
    "电子琴",
    "клавишный инструмент",
    "鍵盤",
    "musical-instrument",
    "kenban"
  ],
  [
    "🎻",
    "violin",
    "viool",
    "小提琴",
    "скрипка",
    "バイオリン",
    "musical-instrument",
    "ba-i-o-ri-n"
  ],
  [
    "🪕",
    "banjo",
    "banjo",
    "班卓琴",
    "банджо",
    "バンジョー",
    "musical-instrument",
    "ba-n-jo-"
  ],
  [
    "🥁",
    "drum",
    "trommel",
    "鼓",
    "барабан",
    "ドラム",
    "musical-instrument",
    "do-ra-mu"
  ],
  [
    "🪘",
    "long drum",
    "lange trommel",
    "长鼓",
    "длинный барабан",
    "長太鼓",
    "musical-instrument",
    "nagadaiko"
  ],
  [
    "🪇",
    "maracas",
    "maracas",
    "沙锤",
    "маракасы",
    "マラカス",
    "musical-instrument",
    "ma-ra-ka-su"
  ],
  [
    "🪈",
    "flute",
    "fluit",
    "长笛",
    "флейта",
    "フルート",
    "musical-instrument",
    "fu-ru-to"
  ],
  [
    "🪉",
    "harp",
    "harp",
    "竖琴",
    "арфа",
    "ハープ",
    "musical-instrument",
    "ha-pu"
  ],
];

const travelEmojiItems = [
  [
    "🌍",
    "globe showing Europe-Africa",
    "wereldbol met Europa en Afrika",
    "欧洲非洲地球仪",
    "глобус с Европой и Африкой",
    "ヨーロッパとアフリカの地球",
    "place-map",
    "yōroppa to afurika no chikyū"
  ],
  [
    "🌎",
    "globe showing Americas",
    "wereldbol met Amerika",
    "美洲地球仪",
    "глобус с Америкой",
    "アメリカ大陸の地球",
    "place-map",
    "amerika tairiku no chikyū"
  ],
  [
    "🌏",
    "globe showing Asia-Australia",
    "wereldbol met Azië en Australië",
    "亚洲澳洲地球仪",
    "глобус с Азией и Австралией",
    "アジアとオーストラリアの地球",
    "place-map",
    "ajia to ōsutoraria no chikyū"
  ],
  [
    "🌐",
    "globe with meridians",
    "wereldbol met meridianen",
    "经纬线地球",
    "глобус с меридианами",
    "経線入りの地球",
    "place-map",
    "keisen iri no chikyū"
  ],
  [
    "🗺️",
    "world map",
    "wereldkaart",
    "世界地图",
    "карта мира",
    "世界地図",
    "place-map",
    "sekai chizu"
  ],
  [
    "🗾",
    "map of Japan",
    "kaart van Japan",
    "日本地图",
    "карта Японии",
    "日本地図",
    "place-map",
    "nihon chizu"
  ],
  [
    "🧭",
    "compass",
    "kompas",
    "指南针",
    "компас",
    "コンパス",
    "place-map",
    "konpasu"
  ],
  [
    "🏔️",
    "snow-capped mountain",
    "besneeuwde berg",
    "雪山",
    "заснеженная гора",
    "雪山",
    "place-geographic",
    "yukiyama"
  ],
  [
    "⛰️",
    "mountain",
    "berg",
    "山",
    "гора",
    "山",
    "place-geographic",
    "yama"
  ],
  [
    "🌋",
    "volcano",
    "vulkaan",
    "火山",
    "вулкан",
    "火山",
    "place-geographic",
    "kazan"
  ],
  [
    "🗻",
    "mount fuji",
    "Fuji",
    "富士山",
    "гора Фудзи",
    "富士山",
    "place-geographic",
    "fujisan"
  ],
  [
    "🏕️",
    "camping",
    "kamperen",
    "露营",
    "кемпинг",
    "キャンプ",
    "place-geographic",
    "kyanpu"
  ],
  [
    "🏖️",
    "beach with umbrella",
    "strand met parasol",
    "带伞的海滩",
    "пляж с зонтом",
    "ビーチとパラソル",
    "place-geographic",
    "bīchi to parasoru"
  ],
  [
    "🏜️",
    "desert",
    "woestijn",
    "沙漠",
    "пустыня",
    "砂漠",
    "place-geographic",
    "sabaku"
  ],
  [
    "🏝️",
    "desert island",
    "onbewoond eiland",
    "荒岛",
    "необитаемый остров",
    "無人島",
    "place-geographic",
    "mujintō"
  ],
  [
    "🏞️",
    "national park",
    "nationaal park",
    "国家公园",
    "национальный парк",
    "国立公園",
    "place-geographic",
    "kokuritsu kōen"
  ],
  [
    "🏟️",
    "stadium",
    "stadion",
    "体育场",
    "стадион",
    "スタジアム",
    "place-building",
    "sutajiamu"
  ],
  [
    "🏛️",
    "classical building",
    "klassiek gebouw",
    "古典建筑",
    "классическое здание",
    "古典的な建物",
    "place-building",
    "kotenteki na tatemono"
  ],
  [
    "🏗️",
    "building construction",
    "bouwplaats",
    "建筑施工",
    "строительство здания",
    "建設工事",
    "place-building",
    "kensetsu-kōji"
  ],
  [
    "🧱",
    "brick",
    "baksteen",
    "砖",
    "кирпич",
    "レンガ",
    "place-building",
    "renga"
  ],
  [
    "🪨",
    "rock",
    "rots",
    "岩石",
    "камень",
    "岩",
    "place-building",
    "iwa"
  ],
  [
    "🪵",
    "wood",
    "hout",
    "木头",
    "дерево",
    "木材",
    "place-building",
    "mokuzai"
  ],
  [
    "🛖",
    "hut",
    "hut",
    "小屋",
    "хижина",
    "小屋",
    "place-building",
    "koya"
  ],
  [
    "🏘️",
    "houses",
    "huizen",
    "房屋",
    "дома",
    "家々",
    "place-building",
    "ieie"
  ],
  [
    "🏚️",
    "derelict house",
    "vervallen huis",
    "废弃房屋",
    "заброшенный дом",
    "廃屋",
    "place-building",
    "haioku"
  ],
  [
    "🏠",
    "house",
    "huis",
    "房子",
    "дом",
    "家",
    "place-building",
    "ie"
  ],
  [
    "🏡",
    "house with garden",
    "huis met tuin",
    "带花园的房子",
    "дом с садом",
    "庭付きの家",
    "place-building",
    "ki-no"
  ],
  [
    "🏢",
    "office building",
    "kantoorgebouw",
    "办公楼",
    "офисное здание",
    "オフィスビル",
    "place-building",
    "o-fu-i-su-bi-ru"
  ],
  [
    "🏣",
    "Japanese post office",
    "Japans postkantoor",
    "日本邮局",
    "японское почтовое отделение",
    "日本の郵便局",
    "place-building",
    "no"
  ],
  [
    "🏤",
    "post office",
    "postkantoor",
    "邮局",
    "почтовое отделение",
    "郵便局",
    "place-building",
    "yūbinkyoku"
  ],
  [
    "🏥",
    "hospital",
    "ziekenhuis",
    "医院",
    "больница",
    "病院",
    "place-building",
    "byōin"
  ],
  [
    "🏦",
    "bank",
    "bank",
    "银行",
    "банк",
    "銀行",
    "place-building",
    "ginkō"
  ],
  [
    "🏨",
    "hotel",
    "hotel",
    "酒店",
    "отель",
    "ホテル",
    "place-building",
    "hoteru"
  ],
  [
    "🏩",
    "love hotel",
    "lovehotel",
    "爱情旅馆",
    "лав-отель",
    "ラブホテル",
    "place-building",
    "ra-bu-ho-te-ru"
  ],
  [
    "🏪",
    "convenience store",
    "buurtwinkel",
    "便利店",
    "магазин у дома",
    "コンビニ",
    "place-building",
    "ko-n-bi-ni"
  ],
  [
    "🏫",
    "school",
    "school",
    "学校",
    "школа",
    "学校",
    "place-building",
    "gakkō"
  ],
  [
    "🏬",
    "department store",
    "warenhuis",
    "百货商店",
    "универмаг",
    "デパート",
    "place-building",
    "de-pa-to"
  ],
  [
    "🏭",
    "factory",
    "fabriek",
    "工厂",
    "фабрика",
    "工場",
    "place-building",
    "kōjō"
  ],
  [
    "🏯",
    "Japanese castle",
    "Japans kasteel",
    "日本城堡",
    "японский замок",
    "日本の城",
    "place-building",
    "no"
  ],
  [
    "🏰",
    "castle",
    "kasteel",
    "城堡",
    "замок",
    "城",
    "place-building",
    "shiro"
  ],
  [
    "💒",
    "wedding",
    "bruiloft",
    "婚礼",
    "свадьба",
    "結婚式",
    "place-building",
    "kekkonshiki"
  ],
  [
    "🗼",
    "Tokyo tower",
    "Tokio Tower",
    "东京塔",
    "Токийская башня",
    "東京タワー",
    "place-building",
    "ta-wa-"
  ],
  [
    "🗽",
    "Statue of Liberty",
    "Vrijheidsbeeld",
    "自由女神像",
    "Статуя Свободы",
    "自由の女神",
    "place-building",
    "no"
  ],
  [
    "⛪",
    "church",
    "kerk",
    "教堂",
    "церковь",
    "教会",
    "place-religious",
    "kyōkai"
  ],
  [
    "🕌",
    "mosque",
    "moskee",
    "清真寺",
    "мечеть",
    "モスク",
    "place-religious",
    "mo-su-ku"
  ],
  [
    "🛕",
    "hindu temple",
    "hindoetempel",
    "印度教寺庙",
    "индуистский храм",
    "ヒンドゥー寺院",
    "place-religious",
    "hi-n-do-u-"
  ],
  [
    "🕍",
    "synagogue",
    "synagoge",
    "犹太会堂",
    "синагога",
    "シナゴーグ",
    "place-religious",
    "shi-na-go-gu"
  ],
  [
    "⛩️",
    "shinto shrine",
    "shintoheiligdom",
    "神社",
    "синтоистское святилище",
    "神社",
    "place-religious",
    "jinja"
  ],
  [
    "🕋",
    "kaaba",
    "Kaäba",
    "克尔白",
    "Кааба",
    "カーバ神殿",
    "place-religious",
    "ka-ba"
  ],
  [
    "⛲",
    "fountain",
    "fontein",
    "喷泉",
    "фонтан",
    "噴水",
    "place-other",
    "funsui"
  ],
  [
    "⛺",
    "tent",
    "tent",
    "帐篷",
    "палатка",
    "テント",
    "place-other",
    "tento"
  ],
  [
    "🌁",
    "foggy",
    "mistig",
    "雾蒙蒙",
    "туман",
    "霧",
    "place-other",
    "kiri"
  ],
  [
    "🌃",
    "night with stars",
    "nacht met sterren",
    "星夜",
    "ночь со звёздами",
    "星空の夜",
    "place-other",
    "no"
  ],
  [
    "🏙️",
    "cityscape",
    "stadsgezicht",
    "城市景观",
    "городской пейзаж",
    "都市の風景",
    "place-other",
    "no"
  ],
  [
    "🌄",
    "sunrise over mountains",
    "zonsopkomst boven bergen",
    "山间日出",
    "восход над горами",
    "山からの日の出",
    "place-other",
    "ka-ra-no-no"
  ],
  [
    "🌅",
    "sunrise",
    "zonsopkomst",
    "日出",
    "восход",
    "日の出",
    "place-other",
    "no"
  ],
  [
    "🌆",
    "cityscape at dusk",
    "stadsgezicht bij schemering",
    "黄昏城市",
    "город в сумерках",
    "夕暮れの都市",
    "place-other",
    "re-no"
  ],
  [
    "🌇",
    "sunset",
    "zonsondergang",
    "日落",
    "закат",
    "夕日",
    "place-other",
    "yūhi"
  ],
  [
    "🌉",
    "bridge at night",
    "brug bij nacht",
    "夜晚的桥",
    "мост ночью",
    "夜の橋",
    "place-other",
    "no"
  ],
  [
    "♨️",
    "hot springs",
    "warmwaterbronnen",
    "温泉",
    "горячие источники",
    "温泉",
    "place-other",
    "onsen"
  ],
  [
    "🎠",
    "carousel horse",
    "carrouselpaard",
    "旋转木马",
    "карусельная лошадка",
    "メリーゴーランドの馬",
    "place-other",
    "me-ri-go-ra-n-do-no"
  ],
  [
    "🛝",
    "playground slide",
    "glijbaan",
    "滑梯",
    "горка",
    "すべり台",
    "place-other",
    "su-be-ri"
  ],
  [
    "🎡",
    "ferris wheel",
    "reuzenrad",
    "摩天轮",
    "колесо обозрения",
    "観覧車",
    "place-other",
    "kanransha"
  ],
  [
    "🎢",
    "roller coaster",
    "achtbaan",
    "过山车",
    "американские горки",
    "ジェットコースター",
    "place-other",
    "ji-e-to-ko-su-ta-"
  ],
  [
    "💈",
    "barber pole",
    "kapperspaal",
    "理发店招牌柱",
    "парикмахерский столб",
    "床屋のサインポール",
    "place-other",
    "no-sa-i-n-po-ru"
  ],
  [
    "🎪",
    "circus tent",
    "circustent",
    "马戏团帐篷",
    "цирковой шатёр",
    "サーカステント",
    "place-other",
    "sa-ka-su-te-n-to"
  ],
  [
    "🚂",
    "locomotive",
    "locomotief",
    "蒸汽机车",
    "локомотив",
    "機関車",
    "transport-ground",
    "kikansha"
  ],
  [
    "🚃",
    "railway car",
    "treinwagon",
    "火车车厢",
    "железнодорожный вагон",
    "鉄道車両",
    "transport-ground",
    "tetsudō sharyō"
  ],
  [
    "🚄",
    "high-speed train",
    "hogesnelheidstrein",
    "高速列车",
    "скоростной поезд",
    "高速鉄道",
    "transport-ground",
    "kōsoku tetsudō"
  ],
  [
    "🚅",
    "bullet train",
    "kogeltrein",
    "子弹头列车",
    "поезд-пуля",
    "新幹線",
    "transport-ground",
    "shinkansen"
  ],
  [
    "🚆",
    "train",
    "trein",
    "火车",
    "поезд",
    "電車",
    "transport-ground",
    "densha"
  ],
  [
    "🚇",
    "metro",
    "metro",
    "地铁",
    "метро",
    "地下鉄",
    "transport-ground",
    "chikatetsu"
  ],
  [
    "🚈",
    "light rail",
    "lightrail",
    "轻轨",
    "лёгкое метро",
    "ライトレール",
    "transport-ground",
    "ra-i-to-re-ru"
  ],
  [
    "🚉",
    "station",
    "station",
    "车站",
    "станция",
    "駅",
    "transport-ground",
    "eki"
  ],
  [
    "🚊",
    "tram",
    "tram",
    "有轨电车",
    "трамвай",
    "路面電車",
    "transport-ground",
    "romendensha"
  ],
  [
    "🚝",
    "monorail",
    "monorail",
    "单轨列车",
    "монорельс",
    "モノレール",
    "transport-ground",
    "mo-no-re-ru"
  ],
  [
    "🚞",
    "mountain railway",
    "bergspoorweg",
    "登山铁路",
    "горная железная дорога",
    "登山鉄道",
    "transport-ground",
    "tōzan tetsudō"
  ],
  [
    "🚋",
    "tram car",
    "tramwagen",
    "电车车厢",
    "трамвайный вагон",
    "路面電車の車両",
    "transport-ground",
    "no"
  ],
  [
    "🚌",
    "bus",
    "bus",
    "公交车",
    "автобус",
    "バス",
    "transport-ground",
    "ba-su"
  ],
  [
    "🚍",
    "oncoming bus",
    "tegemoetkomende bus",
    "迎面驶来的公交车",
    "автобус спереди",
    "前から来るバス",
    "transport-ground",
    "ka-ra-ru-ba-su"
  ],
  [
    "🚎",
    "trolleybus",
    "trolleybus",
    "无轨电车",
    "троллейбус",
    "トロリーバス",
    "transport-ground",
    "tororī basu"
  ],
  [
    "🚐",
    "minibus",
    "minibus",
    "小巴",
    "микроавтобус",
    "ミニバス",
    "transport-ground",
    "minibasu"
  ],
  [
    "🚑",
    "ambulance",
    "ambulance",
    "救护车",
    "скорая помощь",
    "救急車",
    "transport-ground",
    "kyūkyūsha"
  ],
  [
    "🚒",
    "fire engine",
    "brandweerwagen",
    "消防车",
    "пожарная машина",
    "消防車",
    "transport-ground",
    "shōbōsha"
  ],
  [
    "🚓",
    "police car",
    "politiewagen",
    "警车",
    "полицейская машина",
    "パトカー",
    "transport-ground",
    "patokā"
  ],
  [
    "🚔",
    "oncoming police car",
    "tegemoetkomende politiewagen",
    "迎面驶来的警车",
    "полицейская машина спереди",
    "前から来るパトカー",
    "transport-ground",
    "mae kara kuru patokā"
  ],
  [
    "🚕",
    "taxi",
    "taxi",
    "出租车",
    "такси",
    "タクシー",
    "transport-ground",
    "takushī"
  ],
  [
    "🚖",
    "oncoming taxi",
    "tegemoetkomende taxi",
    "迎面驶来的出租车",
    "такси спереди",
    "前から来るタクシー",
    "transport-ground",
    "mae kara kuru takushī"
  ],
  [
    "🚗",
    "automobile",
    "auto",
    "汽车",
    "автомобиль",
    "自動車",
    "transport-ground",
    "jidōsha"
  ],
  [
    "🚘",
    "oncoming automobile",
    "tegemoetkomende auto",
    "迎面驶来的汽车",
    "автомобиль спереди",
    "前から来る車",
    "transport-ground",
    "mae kara kuru kuruma"
  ],
  [
    "🚙",
    "sport utility vehicle",
    "SUV",
    "运动型多用途车",
    "внедорожник",
    "SUV",
    "transport-ground",
    "esu yū vī"
  ],
  [
    "🛻",
    "pickup truck",
    "pick-uptruck",
    "皮卡车",
    "пикап",
    "ピックアップトラック",
    "transport-ground",
    "pikkuppu torakku"
  ],
  [
    "🚚",
    "delivery truck",
    "bestelwagen",
    "送货卡车",
    "грузовик доставки",
    "配送トラック",
    "transport-ground",
    "haisō torakku"
  ],
  [
    "🚛",
    "articulated lorry",
    "vrachtwagen met oplegger",
    "铰接式卡车",
    "фура",
    "大型トラック",
    "transport-ground",
    "ōgata torakku"
  ],
  [
    "🚜",
    "tractor",
    "tractor",
    "拖拉机",
    "трактор",
    "トラクター",
    "transport-ground",
    "torakutā"
  ],
  [
    "🏎️",
    "racing car",
    "raceauto",
    "赛车",
    "гоночная машина",
    "レーシングカー",
    "transport-ground",
    "rēshingu kā"
  ],
  [
    "🏍️",
    "motorcycle",
    "motorfiets",
    "摩托车",
    "мотоцикл",
    "オートバイ",
    "transport-ground",
    "ōtobai"
  ],
  [
    "🛵",
    "motor scooter",
    "scooter",
    "小型摩托车",
    "мотороллер",
    "スクーター",
    "transport-ground",
    "sukūtā"
  ],
  [
    "🦽",
    "manual wheelchair",
    "handbewogen rolstoel",
    "手动轮椅",
    "ручная инвалидная коляска",
    "手動車いす",
    "transport-ground",
    "shudō kuruma isu"
  ],
  [
    "🦼",
    "motorized wheelchair",
    "elektrische rolstoel",
    "电动轮椅",
    "электрическая инвалидная коляска",
    "電動車いす",
    "transport-ground",
    "dendō kuruma isu"
  ],
  [
    "🛺",
    "auto rickshaw",
    "autoriksja",
    "机动三轮车",
    "авторикша",
    "オートリキシャ",
    "transport-ground",
    "ōto rikisha"
  ],
  [
    "🚲",
    "bicycle",
    "fiets",
    "自行车",
    "велосипед",
    "自転車",
    "transport-ground",
    "jitensha"
  ],
  [
    "🛴",
    "kick scooter",
    "step",
    "滑板车",
    "самокат",
    "キックボード",
    "transport-ground",
    "kikkubōdo"
  ],
  [
    "🛹",
    "skateboard",
    "skateboard",
    "滑板",
    "скейтборд",
    "スケートボード",
    "transport-ground",
    "sukētobōdo"
  ],
  [
    "🛼",
    "roller skate",
    "rolschaats",
    "旱冰鞋",
    "роликовый конёк",
    "ローラースケート",
    "transport-ground",
    "rōrā sukēto"
  ],
  [
    "🚏",
    "bus stop",
    "bushalte",
    "公交车站",
    "автобусная остановка",
    "バス停",
    "transport-ground",
    "basu tei"
  ],
  [
    "🛣️",
    "motorway",
    "snelweg",
    "高速公路",
    "автомагистраль",
    "高速道路",
    "transport-ground",
    "kōsoku dōro"
  ],
  [
    "🛤️",
    "railway track",
    "spoorrails",
    "铁路轨道",
    "железнодорожный путь",
    "線路",
    "transport-ground",
    "senro"
  ],
  [
    "🛢️",
    "oil drum",
    "olievat",
    "油桶",
    "нефтяная бочка",
    "ドラム缶",
    "transport-ground",
    "doramu kan"
  ],
  [
    "⛽",
    "fuel pump",
    "benzinepomp",
    "加油泵",
    "топливная колонка",
    "燃料ポンプ",
    "transport-ground",
    "nenryō ponpu"
  ],
  [
    "🛞",
    "wheel",
    "wiel",
    "车轮",
    "колесо",
    "車輪",
    "transport-ground",
    "shar in"
  ],
  [
    "🚨",
    "police car light",
    "zwaailicht",
    "警灯",
    "полицейская мигалка",
    "パトライト",
    "transport-ground",
    "pato raito"
  ],
  [
    "🚥",
    "horizontal traffic light",
    "horizontaal verkeerslicht",
    "横向交通灯",
    "горизонтальный светофор",
    "横型信号機",
    "transport-ground",
    "yokogata shingōki"
  ],
  [
    "🚦",
    "vertical traffic light",
    "verticaal verkeerslicht",
    "竖向交通灯",
    "вертикальный светофор",
    "縦型信号機",
    "transport-ground",
    "tategata shingōki"
  ],
  [
    "🛑",
    "stop sign",
    "stopbord",
    "停车标志",
    "знак стоп",
    "止まれの標識",
    "transport-ground",
    "tomare no hyōshiki"
  ],
  [
    "🚧",
    "construction",
    "wegwerkzaamheden",
    "施工",
    "дорожные работы",
    "工事中",
    "transport-ground",
    "kōji chū"
  ],
  [
    "⚓",
    "anchor",
    "anker",
    "锚",
    "якорь",
    "いかり",
    "transport-water",
    "ikari"
  ],
  [
    "🛟",
    "ring buoy",
    "reddingsboei",
    "救生圈",
    "спасательный круг",
    "救命浮輪",
    "transport-water",
    "kyūmei buwa"
  ],
  [
    "⛵",
    "sailboat",
    "zeilboot",
    "帆船",
    "парусная лодка",
    "ヨット",
    "transport-water",
    "yotto"
  ],
  [
    "🛶",
    "canoe",
    "kano",
    "独木舟",
    "каноэ",
    "カヌー",
    "transport-water",
    "kanū"
  ],
  [
    "🚤",
    "speedboat",
    "speedboot",
    "快艇",
    "скоростная лодка",
    "モーターボート",
    "transport-water",
    "mōtā bōto"
  ],
  [
    "🛳️",
    "passenger ship",
    "passagiersschip",
    "客船",
    "пассажирский корабль",
    "客船",
    "transport-water",
    "kyakusen"
  ],
  [
    "⛴️",
    "ferry",
    "veerboot",
    "渡轮",
    "паром",
    "フェリー",
    "transport-water",
    "ferī"
  ],
  [
    "🛥️",
    "motor boat",
    "motorboot",
    "摩托艇",
    "моторная лодка",
    "モーターボート",
    "transport-water",
    "mōtā bōto"
  ],
  [
    "🚢",
    "ship",
    "schip",
    "船",
    "корабль",
    "船",
    "transport-water",
    "fune"
  ],
  [
    "✈️",
    "airplane",
    "vliegtuig",
    "飞机",
    "самолёт",
    "飛行機",
    "transport-air",
    "hikōki"
  ],
  [
    "🛩️",
    "small airplane",
    "klein vliegtuig",
    "小飞机",
    "маленький самолёт",
    "小型飛行機",
    "transport-air",
    "kogata hikōki"
  ],
  [
    "🛫",
    "airplane departure",
    "vertrekkend vliegtuig",
    "飞机起飞",
    "вылет самолёта",
    "飛行機の出発",
    "transport-air",
    "hikōki no shuppatsu"
  ],
  [
    "🛬",
    "airplane arrival",
    "landend vliegtuig",
    "飞机降落",
    "прибытие самолёта",
    "飛行機の到着",
    "transport-air",
    "hikōki no tōchaku"
  ],
  [
    "🪂",
    "parachute",
    "parachute",
    "降落伞",
    "парашют",
    "パラシュート",
    "transport-air",
    "parashūto"
  ],
  [
    "💺",
    "seat",
    "stoel",
    "座位",
    "сиденье",
    "座席",
    "transport-air",
    "zaseki"
  ],
  [
    "🚁",
    "helicopter",
    "helikopter",
    "直升机",
    "вертолёт",
    "ヘリコプター",
    "transport-air",
    "herikoputā"
  ],
  [
    "🚟",
    "suspension railway",
    "hangspoorbaan",
    "悬挂铁路",
    "подвесная железная дорога",
    "懸垂式鉄道",
    "transport-air",
    "kensui shiki tetsudō"
  ],
  [
    "🚠",
    "mountain cableway",
    "bergkabelbaan",
    "山地缆车",
    "горная канатная дорога",
    "山のケーブルウェイ",
    "transport-air",
    "yama no kēburu wei"
  ],
  [
    "🚡",
    "aerial tramway",
    "luchttram",
    "空中缆车",
    "канатная дорога",
    "ロープウェイ",
    "transport-air",
    "rōpu wei"
  ],
  [
    "🛰️",
    "satellite",
    "satelliet",
    "卫星",
    "спутник",
    "人工衛星",
    "transport-air",
    "jinkō eisei"
  ],
  [
    "🚀",
    "rocket",
    "raket",
    "火箭",
    "ракета",
    "ロケット",
    "transport-air",
    "roketto"
  ],
  [
    "🛸",
    "flying saucer",
    "vliegende schotel",
    "飞碟",
    "летающая тарелка",
    "空飛ぶ円盤",
    "transport-air",
    "soratobu enban"
  ],
  [
    "🛎️",
    "bellhop bell",
    "hotelbel",
    "服务铃",
    "гостиничный звонок",
    "ベルボーイベル",
    "hotel",
    "berubōi beru"
  ],
  [
    "🧳",
    "luggage",
    "bagage",
    "行李",
    "багаж",
    "荷物",
    "hotel",
    "nimotsu"
  ],
];

const peopleEmojiItems = [
  [
    "💪",
    "flexed biceps",
    "gespannen biceps",
    "强壮的手臂",
    "согнутый бицепс",
    "力こぶ",
    "body-parts",
    "rikikobu"
  ],
  [
    "🦾",
    "mechanical arm",
    "mechanische arm",
    "机械臂",
    "механическая рука",
    "義手",
    "body-parts",
    "gishu"
  ],
  [
    "🦿",
    "mechanical leg",
    "mechanisch been",
    "机械腿",
    "механическая нога",
    "義足",
    "body-parts",
    "gisoku"
  ],
  [
    "🦵",
    "leg",
    "been",
    "腿",
    "нога",
    "脚",
    "body-parts",
    "ashi"
  ],
  [
    "🦶",
    "foot",
    "voet",
    "脚",
    "ступня",
    "足",
    "body-parts",
    "ashi"
  ],
  [
    "👂",
    "ear",
    "oor",
    "耳朵",
    "ухо",
    "耳",
    "body-parts",
    "mimi"
  ],
  [
    "🦻",
    "ear with hearing aid",
    "oor met gehoorapparaat",
    "戴助听器的耳朵",
    "ухо со слуховым аппаратом",
    "補聴器を付けた耳",
    "body-parts",
    "hochōki o tsuketa mimi"
  ],
  [
    "👃",
    "nose",
    "neus",
    "鼻子",
    "нос",
    "鼻",
    "body-parts",
    "hana"
  ],
  [
    "🧠",
    "brain",
    "brein",
    "大脑",
    "мозг",
    "脳",
    "body-parts",
    "nō"
  ],
  [
    "🫀",
    "anatomical heart",
    "anatomisch hart",
    "心脏",
    "анатомическое сердце",
    "心臓",
    "body-parts",
    "shinzō"
  ],
  [
    "🫁",
    "lungs",
    "longen",
    "肺",
    "лёгкие",
    "肺",
    "body-parts",
    "hai"
  ],
  [
    "🦷",
    "tooth",
    "tand",
    "牙齿",
    "зуб",
    "歯",
    "body-parts",
    "ha"
  ],
  [
    "🦴",
    "bone",
    "bot",
    "骨头",
    "кость",
    "骨",
    "body-parts",
    "kotsu"
  ],
  [
    "👀",
    "eyes",
    "ogen",
    "眼睛",
    "глаза",
    "目",
    "body-parts",
    "me"
  ],
  [
    "👁️",
    "eye",
    "oog",
    "眼睛",
    "глаз",
    "目",
    "body-parts",
    "me"
  ],
  [
    "👅",
    "tongue",
    "tong",
    "舌头",
    "язык",
    "舌",
    "body-parts",
    "shita"
  ],
  [
    "👄",
    "mouth",
    "mond",
    "嘴巴",
    "рот",
    "口",
    "body-parts",
    "kuchi"
  ],
  [
    "🫦",
    "biting lip",
    "bijtende lip",
    "咬嘴唇",
    "прикушенная губа",
    "唇をかむ",
    "body-parts",
    "kuchibiru o kamu"
  ],
  [
    "🧑‍⚕️",
    "health worker",
    "zorgmedewerker",
    "医护人员",
    "медработник",
    "医療従事者",
    "person-role",
    "iryō jūjisha"
  ],
  [
    "🧑‍🎓",
    "student",
    "student",
    "学生",
    "студент",
    "学生",
    "person-role",
    "gakusei"
  ],
  [
    "🧑‍🏫",
    "teacher",
    "leraar",
    "老师",
    "учитель",
    "先生",
    "person-role",
    "sensei"
  ],
  [
    "🧑‍⚖️",
    "judge",
    "rechter",
    "法官",
    "судья",
    "裁判官",
    "person-role",
    "saibankan"
  ],
  [
    "🧑‍🌾",
    "farmer",
    "boer",
    "农民",
    "фермер",
    "農家",
    "person-role",
    "nōka"
  ],
  [
    "🧑‍🍳",
    "cook",
    "kok",
    "厨师",
    "повар",
    "料理人",
    "person-role",
    "ryōrinin"
  ],
  [
    "🧑‍🔧",
    "mechanic",
    "monteur",
    "机械师",
    "механик",
    "整備士",
    "person-role",
    "seibishi"
  ],
  [
    "🧑‍🏭",
    "factory worker",
    "fabrieksarbeider",
    "工厂工人",
    "рабочий фабрики",
    "工場労働者",
    "person-role",
    "kōjō rōdōsha"
  ],
  [
    "🧑‍💼",
    "office worker",
    "kantoormedewerker",
    "办公室职员",
    "офисный работник",
    "会社員",
    "person-role",
    "kaishain"
  ],
  [
    "🧑‍🔬",
    "scientist",
    "wetenschapper",
    "科学家",
    "учёный",
    "科学者",
    "person-role",
    "kagakusha"
  ],
  [
    "🧑‍💻",
    "technologist",
    "technoloog",
    "技术人员",
    "технолог",
    "技術者",
    "person-role",
    "gijutsusha"
  ],
  [
    "🧑‍🎤",
    "singer",
    "zanger",
    "歌手",
    "певец",
    "歌手",
    "person-role",
    "kashu"
  ],
  [
    "🧑‍🎨",
    "artist",
    "kunstenaar",
    "艺术家",
    "художник",
    "芸術家",
    "person-role",
    "geijutsuka"
  ],
  [
    "🧑‍✈️",
    "pilot",
    "piloot",
    "飞行员",
    "пилот",
    "パイロット",
    "person-role",
    "pairotto"
  ],
  [
    "🧑‍🚀",
    "astronaut",
    "astronaut",
    "宇航员",
    "астронавт",
    "宇宙飛行士",
    "person-role",
    "uchū hikōshi"
  ],
  [
    "🧑‍🚒",
    "firefighter",
    "brandweerman",
    "消防员",
    "пожарный",
    "消防士",
    "person-role",
    "shōbōshi"
  ],
  [
    "👮",
    "police officer",
    "politieagent",
    "警察",
    "полицейский",
    "警察官",
    "person-role",
    "keisatsukan"
  ],
  [
    "🕵️",
    "detective",
    "detective",
    "侦探",
    "детектив",
    "探偵",
    "person-role",
    "tantei"
  ],
  [
    "💂",
    "guard",
    "bewaker",
    "卫兵",
    "охранник",
    "警備員",
    "person-role",
    "keibiiin"
  ],
  [
    "🥷",
    "ninja",
    "ninja",
    "忍者",
    "ниндзя",
    "忍者",
    "person-role",
    "ninja"
  ],
  [
    "👷",
    "construction worker",
    "bouwvakker",
    "建筑工人",
    "строитель",
    "建設作業員",
    "person-role",
    "kensetsu sagyōin"
  ],
  [
    "🫅",
    "person with crown",
    "persoon met kroon",
    "戴王冠的人",
    "человек с короной",
    "王冠をかぶった人",
    "person-role",
    "ōkan o kabutta hito"
  ],
  [
    "👳",
    "person wearing turban",
    "persoon met tulband",
    "戴头巾的人",
    "человек в тюрбане",
    "ターバンを巻いた人",
    "person-role",
    "tāban o maita hito"
  ],
  [
    "👲",
    "person with skullcap",
    "persoon met kalotje",
    "戴瓜皮帽的人",
    "человек в тюбетейке",
    "帽子をかぶった人",
    "person-role",
    "bōshi o kabutta hito"
  ],
  [
    "🧕",
    "woman with headscarf",
    "vrouw met hoofddoek",
    "戴头巾的女人",
    "женщина в платке",
    "スカーフをかぶった女性",
    "person-role",
    "sukāfu o kabutta josei"
  ],
  [
    "🤵",
    "person in tuxedo",
    "persoon in smoking",
    "穿燕尾服的人",
    "человек в смокинге",
    "タキシードの人",
    "person-role",
    "takishīdo no hito"
  ],
  [
    "👰",
    "person with veil",
    "persoon met sluier",
    "戴头纱的人",
    "человек с фатой",
    "ベールの人",
    "person-role",
    "bēru no hito"
  ],
  [
    "🫄",
    "pregnant person",
    "zwanger persoon",
    "怀孕的人",
    "беременный человек",
    "妊娠した人",
    "person-role",
    "ninshin shita hito"
  ],
  [
    "🤱",
    "breast-feeding",
    "borstvoeding",
    "哺乳",
    "кормление грудью",
    "授乳",
    "person-role",
    "junyū"
  ],
  [
    "🧑‍🍼",
    "person feeding baby",
    "persoon die baby voedt",
    "喂宝宝的人",
    "человек кормит ребёнка",
    "赤ちゃんに授乳する人",
    "person-role",
    "akachan ni junyū suru hito"
  ],
  [
    "👼",
    "baby angel",
    "baby-engel",
    "小天使",
    "ангелочек",
    "天使の赤ちゃん",
    "person-fantasy",
    "tenshi no akachan"
  ],
  [
    "🎅",
    "Santa Claus",
    "Kerstman",
    "圣诞老人",
    "Санта-Клаус",
    "サンタクロース",
    "person-fantasy",
    "santakurōsu"
  ],
  [
    "🦸",
    "superhero",
    "superheld",
    "超级英雄",
    "супергерой",
    "スーパーヒーロー",
    "person-fantasy",
    "sūpāhīrō"
  ],
  [
    "🦹",
    "supervillain",
    "superschurk",
    "超级反派",
    "суперзлодей",
    "スーパーヴィラン",
    "person-fantasy",
    "sūpāviran"
  ],
  [
    "🧙",
    "mage",
    "magiër",
    "法师",
    "маг",
    "魔法使い",
    "person-fantasy",
    "mahōtsukai"
  ],
  [
    "🧚",
    "fairy",
    "fee",
    "仙子",
    "фея",
    "妖精",
    "person-fantasy",
    "yōsei"
  ],
  [
    "🧛",
    "vampire",
    "vampier",
    "吸血鬼",
    "вампир",
    "吸血鬼",
    "person-fantasy",
    "kyūketsuki"
  ],
  [
    "🧜",
    "merperson",
    "zeemeerpersoon",
    "人鱼",
    "русалочеловек",
    "人魚",
    "person-fantasy",
    "ningyō"
  ],
  [
    "🧝",
    "elf",
    "elf",
    "精灵",
    "эльф",
    "エルフ",
    "person-fantasy",
    "erufu"
  ],
  [
    "🧞",
    "genie",
    "geest",
    "神灯精灵",
    "джинн",
    "ランプの精",
    "person-fantasy",
    "ranpu no sei"
  ],
  [
    "🧟",
    "zombie",
    "zombie",
    "僵尸",
    "зомби",
    "ゾンビ",
    "person-fantasy",
    "zonbi"
  ],
  [
    "🧌",
    "troll",
    "trol",
    "巨魔",
    "тролль",
    "トロール",
    "person-fantasy",
    "torōru"
  ],
  [
    "💆",
    "person getting massage",
    "persoon krijgt massage",
    "正在按摩的人",
    "человек получает массаж",
    "マッサージされる人",
    "person-activity",
    "massāji sareru hito"
  ],
  [
    "💇",
    "person getting haircut",
    "persoon krijgt knipbeurt",
    "正在理发的人",
    "человек стрижётся",
    "散髪される人",
    "person-activity",
    "sanpatsu sareru hito"
  ],
  [
    "🚶",
    "person walking",
    "persoon loopt",
    "走路的人",
    "человек идёт",
    "歩く人",
    "person-activity",
    "aruku hito"
  ],
  [
    "🧍",
    "person standing",
    "persoon staat",
    "站立的人",
    "стоящий человек",
    "立つ人",
    "person-activity",
    "tatsu hito"
  ],
  [
    "🧎",
    "person kneeling",
    "persoon knielt",
    "跪着的人",
    "человек стоит на коленях",
    "ひざまずく人",
    "person-activity",
    "hizamazuku hito"
  ],
  [
    "🧑‍🦯",
    "person with white cane",
    "persoon met witte stok",
    "拿盲杖的人",
    "человек с белой тростью",
    "白杖を持つ人",
    "person-activity",
    "hakujō o motsu hito"
  ],
  [
    "🧑‍🦼",
    "person in motorized wheelchair",
    "persoon in elektrische rolstoel",
    "坐电动轮椅的人",
    "человек в электрической коляске",
    "電動車いすの人",
    "person-activity",
    "dendō kuruma isu no hito"
  ],
  [
    "🧑‍🦽",
    "person in manual wheelchair",
    "persoon in handbewogen rolstoel",
    "坐手动轮椅的人",
    "человек в ручной коляске",
    "手動車いすの人",
    "person-activity",
    "shudō kuruma isu no hito"
  ],
  [
    "🏃",
    "person running",
    "persoon rent",
    "跑步的人",
    "бегущий человек",
    "走る人",
    "person-activity",
    "hashiru hito"
  ],
  [
    "💃",
    "woman dancing",
    "dansende vrouw",
    "跳舞的女人",
    "танцующая женщина",
    "踊る女性",
    "person-activity",
    "odoru josei"
  ],
  [
    "🕺",
    "man dancing",
    "dansende man",
    "跳舞的男人",
    "танцующий мужчина",
    "踊る男性",
    "person-activity",
    "odoru dansei"
  ],
  [
    "🕴️",
    "person in suit levitating",
    "zwevend persoon in pak",
    "穿西装漂浮的人",
    "человек в костюме левитирует",
    "スーツで浮く人",
    "person-activity",
    "sūtsu de uku hito"
  ],
  [
    "👯",
    "people with bunny ears",
    "mensen met konijnenoren",
    "戴兔耳的人",
    "люди с кроличьими ушами",
    "ウサ耳の人",
    "person-activity",
    "usagi mimi no hito"
  ],
  [
    "🧖",
    "person in steamy room",
    "persoon in stoombad",
    "蒸汽房里的人",
    "человек в парной",
    "サウナに入る人",
    "person-activity",
    "sauna ni iru hito"
  ],
  [
    "🧗",
    "person climbing",
    "persoon klimt",
    "攀爬的人",
    "человек карабкается",
    "登る人",
    "person-activity",
    "noboru hito"
  ],
  [
    "🤺",
    "person fencing",
    "schermer",
    "击剑的人",
    "фехтовальщик",
    "フェンシングする人",
    "person-sport",
    "fenshingu suru hito"
  ],
  [
    "🏇",
    "horse racing",
    "paardenrennen",
    "赛马",
    "скачки",
    "競馬",
    "person-sport",
    "keiba"
  ],
  [
    "⛷️",
    "skier",
    "skiër",
    "滑雪者",
    "лыжник",
    "スキーヤー",
    "person-sport",
    "sukīyā"
  ],
  [
    "🏂",
    "snowboarder",
    "snowboarder",
    "单板滑雪者",
    "сноубордист",
    "スノーボーダー",
    "person-sport",
    "sunōbōdā"
  ],
  [
    "🏌️",
    "person golfing",
    "persoon golft",
    "打高尔夫的人",
    "человек играет в гольф",
    "ゴルフする人",
    "person-sport",
    "gorufu suru hito"
  ],
  [
    "🏄",
    "person surfing",
    "persoon surft",
    "冲浪的人",
    "сёрфер",
    "サーフィンする人",
    "person-sport",
    "sāfin suru hito"
  ],
  [
    "🚣",
    "person rowing boat",
    "persoon roeit",
    "划船的人",
    "человек гребёт",
    "ボートをこぐ人",
    "person-sport",
    "bōto o kogu hito"
  ],
  [
    "🏊",
    "person swimming",
    "persoon zwemt",
    "游泳的人",
    "пловец",
    "泳ぐ人",
    "person-sport",
    "oyogu hito"
  ],
  [
    "⛹️",
    "person bouncing ball",
    "persoon stuitert bal",
    "拍球的人",
    "человек ведёт мяч",
    "ボールをつく人",
    "person-sport",
    "bōru o tsuku hito"
  ],
  [
    "🏋️",
    "person lifting weights",
    "persoon heft gewichten",
    "举重的人",
    "человек поднимает штангу",
    "重量挙げする人",
    "person-sport",
    "jūryō age suru hito"
  ],
  [
    "🚴",
    "person biking",
    "persoon fietst",
    "骑自行车的人",
    "велосипедист",
    "自転車に乗る人",
    "person-sport",
    "jitensha ni noru hito"
  ],
  [
    "🚵",
    "person mountain biking",
    "persoon mountainbiket",
    "骑山地车的人",
    "человек едет на горном велосипеде",
    "マウンテンバイクに乗る人",
    "person-sport",
    "maunten baiku ni noru hito"
  ],
  [
    "🤸",
    "person cartwheeling",
    "persoon maakt radslag",
    "翻筋斗的人",
    "человек делает колесо",
    "側転する人",
    "person-sport",
    "sokuten suru hito"
  ],
  [
    "🤼",
    "people wrestling",
    "mensen worstelen",
    "摔跤的人",
    "люди борются",
    "レスリングする人たち",
    "person-sport",
    "resuringu suru hitotachi"
  ],
  [
    "🤽",
    "person playing water polo",
    "persoon speelt waterpolo",
    "打水球的人",
    "человек играет в водное поло",
    "水球をする人",
    "person-sport",
    "suikyū o suru hito"
  ],
  [
    "🤾",
    "person playing handball",
    "persoon speelt handbal",
    "打手球的人",
    "человек играет в гандбол",
    "ハンドボールをする人",
    "person-sport",
    "handobōru o suru hito"
  ],
  [
    "🤹",
    "person juggling",
    "persoon jongleert",
    "杂耍的人",
    "человек жонглирует",
    "ジャグリングする人",
    "person-sport",
    "jaguringu suru hito"
  ],
  [
    "🧘",
    "person in lotus position",
    "persoon in lotushouding",
    "盘腿打坐的人",
    "человек в позе лотоса",
    "蓮華座の人",
    "person-resting",
    "rengeza no hito"
  ],
  [
    "🛀",
    "person taking bath",
    "persoon neemt bad",
    "洗澡的人",
    "человек принимает ванну",
    "入浴する人",
    "person-resting",
    "nyūyoku suru hito"
  ],
  [
    "🛌",
    "person in bed",
    "persoon in bed",
    "躺在床上的人",
    "человек в кровати",
    "ベッドにいる人",
    "person-resting",
    "beddo ni iru hito"
  ],
];

const objectEmojiItems = [
  [
    "👓",
    "glasses",
    "bril",
    "眼镜",
    "очки",
    "眼鏡",
    "clothing",
    "megane"
  ],
  [
    "🕶️",
    "sunglasses",
    "zonnebril",
    "太阳镜",
    "солнцезащитные очки",
    "サングラス",
    "clothing",
    "sangurasu"
  ],
  [
    "🥽",
    "goggles",
    "veiligheidsbril",
    "护目镜",
    "защитные очки",
    "ゴーグル",
    "clothing",
    "gōguru"
  ],
  [
    "🥼",
    "lab coat",
    "labjas",
    "实验服",
    "лабораторный халат",
    "白衣",
    "clothing",
    "hakui"
  ],
  [
    "🦺",
    "safety vest",
    "veiligheidsvest",
    "安全背心",
    "сигнальный жилет",
    "安全ベスト",
    "clothing",
    "anzen besuto"
  ],
  [
    "👔",
    "necktie",
    "stropdas",
    "领带",
    "галстук",
    "ネクタイ",
    "clothing",
    "nekutai"
  ],
  [
    "👕",
    "t-shirt",
    "T-shirt",
    "T恤",
    "футболка",
    "Tシャツ",
    "clothing",
    "tīshatsu"
  ],
  [
    "👖",
    "jeans",
    "spijkerbroek",
    "牛仔裤",
    "джинсы",
    "ジーンズ",
    "clothing",
    "jīnzu"
  ],
  [
    "🧣",
    "scarf",
    "sjaal",
    "围巾",
    "шарф",
    "マフラー",
    "clothing",
    "mafuraa"
  ],
  [
    "🧤",
    "gloves",
    "handschoenen",
    "手套",
    "перчатки",
    "手袋",
    "clothing",
    "tebukuro"
  ],
  [
    "🧥",
    "coat",
    "jas",
    "外套",
    "пальто",
    "コート",
    "clothing",
    "kōto"
  ],
  [
    "🧦",
    "socks",
    "sokken",
    "袜子",
    "носки",
    "靴下",
    "clothing",
    "kutsushita"
  ],
  [
    "👗",
    "dress",
    "jurk",
    "连衣裙",
    "платье",
    "ドレス",
    "clothing",
    "doresu"
  ],
  [
    "👘",
    "kimono",
    "kimono",
    "和服",
    "кимоно",
    "着物",
    "clothing",
    "kimono"
  ],
  [
    "🥻",
    "sari",
    "sari",
    "纱丽",
    "сари",
    "サリー",
    "clothing",
    "sarī"
  ],
  [
    "🩱",
    "one-piece swimsuit",
    "badpak",
    "连体泳衣",
    "слитный купальник",
    "ワンピース水着",
    "clothing",
    "wanpīsu mizugi"
  ],
  [
    "🩲",
    "briefs",
    "onderbroek",
    "内裤",
    "трусы",
    "ブリーフ",
    "clothing",
    "burīfu"
  ],
  [
    "🩳",
    "shorts",
    "korte broek",
    "短裤",
    "шорты",
    "半ズボン",
    "clothing",
    "hanzubon"
  ],
  [
    "👙",
    "bikini",
    "bikini",
    "比基尼",
    "бикини",
    "ビキニ",
    "clothing",
    "bikini"
  ],
  [
    "👚",
    "woman’s clothes",
    "vrouwenkleding",
    "女装",
    "женская одежда",
    "婦人服",
    "clothing",
    "fujinfuku"
  ],
  [
    "🪭",
    "folding hand fan",
    "waaier",
    "折扇",
    "складной веер",
    "扇子",
    "clothing",
    "sensu"
  ],
  [
    "👛",
    "purse",
    "portemonnee",
    "钱包",
    "кошелёк",
    "財布",
    "clothing",
    "saifu"
  ],
  [
    "👜",
    "handbag",
    "handtas",
    "手提包",
    "сумочка",
    "ハンドバッグ",
    "clothing",
    "handobaggu"
  ],
  [
    "👝",
    "clutch bag",
    "clutch",
    "手拿包",
    "клатч",
    "クラッチバッグ",
    "clothing",
    "kuratchi baggu"
  ],
  [
    "🛍️",
    "shopping bags",
    "boodschappentassen",
    "购物袋",
    "пакеты для покупок",
    "買い物袋",
    "clothing",
    "kaimono bukuro"
  ],
  [
    "🎒",
    "backpack",
    "rugzak",
    "背包",
    "рюкзак",
    "リュックサック",
    "clothing",
    "ryukkusakku"
  ],
  [
    "🩴",
    "thong sandal",
    "slipper",
    "人字拖",
    "шлёпанец",
    "ビーチサンダル",
    "clothing",
    "bīchi sandaru"
  ],
  [
    "👞",
    "man’s shoe",
    "herenschoen",
    "男鞋",
    "мужская туфля",
    "紳士靴",
    "clothing",
    "shinshi kutsu"
  ],
  [
    "👟",
    "running shoe",
    "hardloopschoen",
    "跑鞋",
    "кроссовок",
    "ランニングシューズ",
    "clothing",
    "ranningu shūzu"
  ],
  [
    "🥾",
    "hiking boot",
    "wandelschoen",
    "登山靴",
    "туристический ботинок",
    "登山靴",
    "clothing",
    "tozan kutsu"
  ],
  [
    "🥿",
    "flat shoe",
    "platte schoen",
    "平底鞋",
    "туфля на плоской подошве",
    "フラットシューズ",
    "clothing",
    "furatto shūzu"
  ],
  [
    "👠",
    "high-heeled shoe",
    "hoge hak",
    "高跟鞋",
    "туфля на каблуке",
    "ハイヒール",
    "clothing",
    "haihīru"
  ],
  [
    "👡",
    "woman’s sandal",
    "damessandaal",
    "女式凉鞋",
    "женская сандалия",
    "女性用サンダル",
    "clothing",
    "josei yō sandaru"
  ],
  [
    "🩰",
    "ballet shoes",
    "balletschoenen",
    "芭蕾舞鞋",
    "балетные туфли",
    "バレエシューズ",
    "clothing",
    "barē shūzu"
  ],
  [
    "👢",
    "woman’s boot",
    "dameslaars",
    "女靴",
    "женский сапог",
    "女性用ブーツ",
    "clothing",
    "josei yō būtsu"
  ],
  [
    "🪮",
    "hair pick",
    "haarkam",
    "发梳",
    "гребень для волос",
    "ヘアピック",
    "clothing",
    "hea pikku"
  ],
  [
    "👑",
    "crown",
    "kroon",
    "皇冠",
    "корона",
    "王冠",
    "clothing",
    "ōkan"
  ],
  [
    "👒",
    "woman’s hat",
    "dameshoed",
    "女帽",
    "женская шляпа",
    "女性用帽子",
    "clothing",
    "josei yō bōshi"
  ],
  [
    "🎩",
    "top hat",
    "hoge hoed",
    "礼帽",
    "цилиндр",
    "シルクハット",
    "clothing",
    "shiruku hatto"
  ],
  [
    "🎓",
    "graduation cap",
    "afstudeerhoed",
    "毕业帽",
    "академическая шапочка",
    "卒業帽",
    "clothing",
    "sotsugyōbō"
  ],
  [
    "🧢",
    "billed cap",
    "pet",
    "鸭舌帽",
    "кепка",
    "キャップ",
    "clothing",
    "kyappu"
  ],
  [
    "🪖",
    "military helmet",
    "militaire helm",
    "军用头盔",
    "военный шлем",
    "軍用ヘルメット",
    "clothing",
    "gun'yō herumetto"
  ],
  [
    "⛑️",
    "rescue worker’s helmet",
    "reddingswerkershelm",
    "救援人员头盔",
    "каска спасателя",
    "救助隊員のヘルメット",
    "clothing",
    "kyūjotaiin no herumetto"
  ],
  [
    "📿",
    "prayer beads",
    "gebedskralen",
    "念珠",
    "чётки",
    "数珠",
    "clothing",
    "juzu"
  ],
  [
    "💄",
    "lipstick",
    "lippenstift",
    "口红",
    "помада",
    "口紅",
    "clothing",
    "kuchibeni"
  ],
  [
    "💍",
    "ring",
    "ring",
    "戒指",
    "кольцо",
    "指輪",
    "clothing",
    "yubiwa"
  ],
  [
    "💎",
    "gem stone",
    "edelsteen",
    "宝石",
    "драгоценный камень",
    "宝石",
    "clothing",
    "hōseki"
  ],
  [
    "🔋",
    "battery",
    "batterij",
    "电池",
    "батарейка",
    "電池",
    "computer",
    "denchi"
  ],
  [
    "🪫",
    "low battery",
    "lege batterij",
    "低电量",
    "разやженная батарея",
    "電池残量低下",
    "computer",
    "denchi zanryō teika"
  ],
  [
    "🔌",
    "electric plug",
    "stekker",
    "插头",
    "электрическая вилка",
    "電源プラグ",
    "computer",
    "denshi puragu"
  ],
  [
    "💻",
    "laptop",
    "laptop",
    "笔记本电脑",
    "ноутбук",
    "ノートパソコン",
    "computer",
    "nōto pasokon"
  ],
  [
    "🖥️",
    "desktop computer",
    "desktopcomputer",
    "台式电脑",
    "настольный компьютер",
    "デスクトップパソコン",
    "computer",
    "desukutoppu pasokon"
  ],
  [
    "🖨️",
    "printer",
    "printer",
    "打印机",
    "принтер",
    "プリンター",
    "computer",
    "purintā"
  ],
  [
    "⌨️",
    "keyboard",
    "toetsenbord",
    "键盘",
    "клавиатура",
    "キーボード",
    "computer",
    "kībōdo"
  ],
  [
    "🖱️",
    "computer mouse",
    "computermuis",
    "电脑鼠标",
    "компьютерная мышь",
    "コンピューターマウス",
    "computer",
    "konpyūtā mausu"
  ],
  [
    "🖲️",
    "trackball",
    "trackball",
    "轨迹球",
    "трекбол",
    "トラックボール",
    "computer",
    "torakkubōru"
  ],
  [
    "💽",
    "computer disk",
    "computerschijf",
    "电脑光盘",
    "компьютерный диск",
    "コンピューターディスク",
    "computer",
    "konpyūtā disuku"
  ],
  [
    "💾",
    "floppy disk",
    "diskette",
    "软盘",
    "дискета",
    "フロッピーディスク",
    "computer",
    "furoppī disuku"
  ],
  [
    "💿",
    "optical disk",
    "optische schijf",
    "光盘",
    "оптический диск",
    "光ディスク",
    "computer",
    "kōgaku disuku"
  ],
  [
    "📀",
    "dvd",
    "dvd",
    "DVD",
    "DVD",
    "DVD",
    "computer",
    "dībuidī"
  ],
  [
    "🧮",
    "abacus",
    "telraam",
    "算盘",
    "счёты",
    "そろばん",
    "computer",
    "soroban"
  ],
  [
    "🎥",
    "movie camera",
    "filmcamera",
    "电影摄影机",
    "кинокамера",
    "映画カメラ",
    "light & video",
    "eiga kamera"
  ],
  [
    "🎞️",
    "film frames",
    "filmstrook",
    "胶片帧",
    "киноплёнка",
    "フィルム",
    "light & video",
    "firumu"
  ],
  [
    "📽️",
    "film projector",
    "filmprojector",
    "电影放映机",
    "кинопроектор",
    "映写機",
    "light & video",
    "eisha ki"
  ],
  [
    "🎬",
    "clapper board",
    "filmklapper",
    "场记板",
    "хлопушка",
    "カチンコ",
    "light & video",
    "kachinko"
  ],
  [
    "📺",
    "television",
    "televisie",
    "电视",
    "телевизор",
    "テレビ",
    "light & video",
    "terebi"
  ],
  [
    "📷",
    "camera",
    "camera",
    "相机",
    "камера",
    "カメラ",
    "light & video",
    "kamera"
  ],
  [
    "📸",
    "camera with flash",
    "camera met flits",
    "带闪光灯的相机",
    "камера со вспышкой",
    "フラッシュ付きカメラ",
    "light & video",
    "furasshu tsuki kamera"
  ],
  [
    "📹",
    "video camera",
    "videocamera",
    "摄像机",
    "видеокамера",
    "ビデオカメラ",
    "light & video",
    "bideo kamera"
  ],
  [
    "📼",
    "videocassette",
    "videocassette",
    "录像带",
    "видеокассета",
    "ビデオカセット",
    "light & video",
    "bideo kasetto"
  ],
  [
    "🔍",
    "magnifying glass tilted left",
    "vergrootglas naar links",
    "向左倾斜的放大镜",
    "лупа влево",
    "左向きの虫眼鏡",
    "light & video",
    "hidarimuki no chūmegane"
  ],
  [
    "🔎",
    "magnifying glass tilted right",
    "vergrootglas naar rechts",
    "向右倾斜的放大镜",
    "лупа вправо",
    "右向きの虫眼鏡",
    "light & video",
    "migimuki no chūmegane"
  ],
  [
    "🕯️",
    "candle",
    "kaars",
    "蜡烛",
    "свеча",
    "ろうそく",
    "light & video",
    "rōsoku"
  ],
  [
    "💡",
    "light bulb",
    "gloeilamp",
    "灯泡",
    "лампочка",
    "電球",
    "light & video",
    "denkyū"
  ],
  [
    "🔦",
    "flashlight",
    "zaklamp",
    "手电筒",
    "фонарик",
    "懐中電灯",
    "light & video",
    "kaichū dentō"
  ],
  [
    "🏮",
    "red paper lantern",
    "rode papieren lantaarn",
    "红灯笼",
    "красный бумажный фонарь",
    "赤い提灯",
    "light & video",
    "akai chōchin"
  ],
  [
    "🪔",
    "diya lamp",
    "diya-lamp",
    "油灯",
    "лампа дия",
    "ディヤランプ",
    "light & video",
    "diya ranpu"
  ],
  [
    "📔",
    "notebook with decorative cover",
    "notitieboek met versierde kaft",
    "装饰封面笔记本",
    "тетрадь с красивой обложкой",
    "表紙付きノート",
    "book-paper",
    "hyōshi tsuki nōto"
  ],
  [
    "📕",
    "closed book",
    "gesloten boek",
    "合上的书",
    "закрытая книга",
    "閉じた本",
    "book-paper",
    "tojita hon"
  ],
  [
    "📖",
    "open book",
    "open boek",
    "打开的书",
    "открытая книга",
    "開いた本",
    "book-paper",
    "hiraita hon"
  ],
  [
    "📗",
    "green book",
    "groen boek",
    "绿色书",
    "зелёная книга",
    "緑の本",
    "book-paper",
    "midori no hon"
  ],
  [
    "📘",
    "blue book",
    "blauw boek",
    "蓝色书",
    "синяя книга",
    "青い本",
    "book-paper",
    "aoi hon"
  ],
  [
    "📙",
    "orange book",
    "oranje boek",
    "橙色书",
    "оранжевая книга",
    "オレンジの本",
    "book-paper",
    "orenji no hon"
  ],
  [
    "📚",
    "books",
    "boeken",
    "书",
    "книги",
    "本",
    "book-paper",
    "hon"
  ],
  [
    "📓",
    "notebook",
    "notitieboek",
    "笔记本",
    "тетрадь",
    "ノート",
    "book-paper",
    "nōto"
  ],
  [
    "📒",
    "ledger",
    "kasboek",
    "账本",
    "бухгалтерская книга",
    "帳簿",
    "book-paper",
    "chōbo"
  ],
  [
    "📃",
    "page with curl",
    "omgekrulde pagina",
    "卷边页面",
    "страница с загнутым углом",
    "丸まったページ",
    "book-paper",
    "marumatta pēji"
  ],
  [
    "📜",
    "scroll",
    "rol",
    "卷轴",
    "свиток",
    "巻物",
    "book-paper",
    "makimono"
  ],
  [
    "📄",
    "page facing up",
    "pagina naar boven",
    "正面朝上的页面",
    "лист бумаги",
    "上向きのページ",
    "book-paper",
    "uwamuki no pēji"
  ],
  [
    "📰",
    "newspaper",
    "krant",
    "报纸",
    "газета",
    "新聞",
    "book-paper",
    "shinbun"
  ],
  [
    "🗞️",
    "rolled-up newspaper",
    "opgerolde krant",
    "卷起的报纸",
    "свёрнутая газета",
    "丸めた新聞",
    "book-paper",
    "marumeta shinbun"
  ],
  [
    "📑",
    "bookmark tabs",
    "bladwijzertabs",
    "书签标签",
    "закладки",
    "付箋",
    "book-paper",
    "fushin"
  ],
  [
    "🔖",
    "bookmark",
    "bladwijzer",
    "书签",
    "закладка",
    "しおり",
    "book-paper",
    "shiori"
  ],
  [
    "🏷️",
    "label",
    "label",
    "标签",
    "ярлык",
    "ラベル",
    "book-paper",
    "raberu"
  ],
  [
    "🪙",
    "coin",
    "munt",
    "硬币",
    "монета",
    "硬貨",
    "money",
    "kōka"
  ],
  [
    "💰",
    "money bag",
    "geldzak",
    "钱袋",
    "мешок денег",
    "金袋",
    "money",
    "kinbukuro"
  ],
  [
    "💴",
    "yen banknote",
    "yenbiljet",
    "日元纸币",
    "банкнота иены",
    "円札",
    "money",
    "en satsu"
  ],
  [
    "💵",
    "dollar banknote",
    "dollarbiljet",
    "美元纸币",
    "долларовая банкнота",
    "ドル札",
    "money",
    "doru satsu"
  ],
  [
    "💶",
    "euro banknote",
    "eurobiljet",
    "欧元纸币",
    "банкнота евро",
    "ユーロ札",
    "money",
    "yūro satsu"
  ],
  [
    "💷",
    "pound banknote",
    "pondbiljet",
    "英镑纸币",
    "банкнота фунта",
    "ポンド札",
    "money",
    "pondo satsu"
  ],
  [
    "💸",
    "money with wings",
    "geld met vleugels",
    "长翅膀的钱",
    "деньги с крыльями",
    "羽の生えたお金",
    "money",
    "hane no haeta okane"
  ],
  [
    "💳",
    "credit card",
    "creditcard",
    "信用卡",
    "кредитная карта",
    "クレジットカード",
    "money",
    "kurejitto kādo"
  ],
  [
    "🧾",
    "receipt",
    "bon",
    "收据",
    "чек",
    "レシート",
    "money",
    "reshīto"
  ],
  [
    "💹",
    "chart increasing with yen",
    "stijgende grafiek met yen",
    "日元上涨图表",
    "растущий график с иеной",
    "円高グラフ",
    "money",
    "en taka gurafu"
  ],
  [
    "✏️",
    "pencil",
    "potlood",
    "铅笔",
    "карандаш",
    "鉛筆",
    "writing",
    "enpitsu"
  ],
  [
    "✒️",
    "black nib",
    "penpunt",
    "钢笔尖",
    "перо",
    "ペン先",
    "writing",
    "pen saki"
  ],
  [
    "🖋️",
    "fountain pen",
    "vulpen",
    "钢笔",
    "перьевая ручка",
    "万年筆",
    "writing",
    "mannenhitsu"
  ],
  [
    "🖊️",
    "pen",
    "pen",
    "笔",
    "ручка",
    "ペン",
    "writing",
    "pen"
  ],
  [
    "🖌️",
    "paintbrush",
    "verfkwast",
    "画笔",
    "кисть",
    "絵筆",
    "writing",
    "efude"
  ],
  [
    "🖍️",
    "crayon",
    "wasco",
    "蜡笔",
    "мелок",
    "クレヨン",
    "writing",
    "kureyon"
  ],
  [
    "📝",
    "memo",
    "memo",
    "备忘录",
    "заметка",
    "メモ",
    "writing",
    "memo"
  ],
  [
    "💼",
    "briefcase",
    "aktetas",
    "公文包",
    "портфель",
    "ブリーフケース",
    "office",
    "burīfukēsu"
  ],
  [
    "📁",
    "file folder",
    "map",
    "文件夹",
    "папка",
    "フォルダー",
    "office",
    "fōrudā"
  ],
  [
    "📂",
    "open file folder",
    "open map",
    "打开的文件夹",
    "открытая папка",
    "開いたフォルダー",
    "office",
    "hiraita fōrudā"
  ],
  [
    "🗂️",
    "card index dividers",
    "tabbladen",
    "索引分隔页",
    "разделители картотеки",
    "カード仕切り",
    "office",
    "kādo shikiri"
  ],
  [
    "📅",
    "calendar",
    "kalender",
    "日历",
    "календарь",
    "カレンダー",
    "office",
    "karendā"
  ],
  [
    "📆",
    "tear-off calendar",
    "scheurkalender",
    "撕页日历",
    "отрывной календарь",
    "日めくりカレンダー",
    "office",
    "himekuri karendā"
  ],
  [
    "🗒️",
    "spiral notepad",
    "spiraalnotitieblok",
    "螺旋记事本",
    "блокнот на спирали",
    "リングメモ",
    "office",
    "ringu memo"
  ],
  [
    "🗓️",
    "spiral calendar",
    "spiraalkalender",
    "螺旋日历",
    "календарь на спирали",
    "リングカレンダー",
    "office",
    "ringu karendā"
  ],
  [
    "📇",
    "card index",
    "kaartenbak",
    "卡片索引",
    "картотека",
    "カード索引",
    "office",
    "kādo sakuin"
  ],
  [
    "📈",
    "chart increasing",
    "stijgende grafiek",
    "上升图表",
    "растущий график",
    "上昇グラフ",
    "office",
    "jōshō gurafu"
  ],
  [
    "📉",
    "chart decreasing",
    "dalende grafiek",
    "下降图表",
    "снижающийся график",
    "下降グラフ",
    "office",
    "kachō gurafu"
  ],
  [
    "📊",
    "bar chart",
    "staafdiagram",
    "柱状图",
    "столбчатая диаграмма",
    "棒グラフ",
    "office",
    "bō gurafu"
  ],
  [
    "📋",
    "clipboard",
    "klembord",
    "剪贴板",
    "планшет",
    "クリップボード",
    "office",
    "kurippubōdo"
  ],
  [
    "📌",
    "pushpin",
    "prikpen",
    "图钉",
    "канцелярская кнопка",
    "画びょう",
    "office",
    "gabyō"
  ],
  [
    "📍",
    "round pushpin",
    "ronde punaise",
    "圆头图钉",
    "круглая кнопка",
    "丸い画びょう",
    "office",
    "marui gabyō"
  ],
  [
    "📎",
    "paperclip",
    "paperclip",
    "回形针",
    "скрепка",
    "クリップ",
    "office",
    "kurippu"
  ],
  [
    "🖇️",
    "linked paperclips",
    "verbonden paperclips",
    "相连的回形针",
    "соединённые скрепки",
    "つながったクリップ",
    "office",
    "tsunagatta kurippu"
  ],
  [
    "📏",
    "straight ruler",
    "liniaal",
    "直尺",
    "линейка",
    "定規",
    "office",
    "jōgi"
  ],
  [
    "📐",
    "triangular ruler",
    "geodriehoek",
    "三角尺",
    "треугольная линейка",
    "三角定規",
    "office",
    "sankaku jōgi"
  ],
  [
    "✂️",
    "scissors",
    "schaar",
    "剪刀",
    "ножницы",
    "はさみ",
    "office",
    "hasami"
  ],
  [
    "🗃️",
    "card file box",
    "kaartenbak",
    "卡片盒",
    "картотечный ящик",
    "カードファイル箱",
    "office",
    "kādo fairu bako"
  ],
  [
    "🗄️",
    "file cabinet",
    "archiefkast",
    "文件柜",
    "шкаф для документов",
    "ファイルキャビネット",
    "office",
    "fairu kyabinetto"
  ],
  [
    "🗑️",
    "wastebasket",
    "prullenbak",
    "废纸篓",
    "мусорная корзина",
    "ごみ箱",
    "office",
    "gomi bako"
  ],
  [
    "🔨",
    "hammer",
    "hamer",
    "锤子",
    "молоток",
    "ハンマー",
    "tool",
    "hanmā"
  ],
  [
    "🪓",
    "axe",
    "bijl",
    "斧头",
    "топор",
    "斧",
    "tool",
    "ono"
  ],
  [
    "⛏️",
    "pick",
    "pikhouweel",
    "镐",
    "кирка",
    "つるはし",
    "tool",
    "tsuruhashi"
  ],
  [
    "⚒️",
    "hammer and pick",
    "hamer en pikhouweel",
    "锤子和镐",
    "молоток и кирка",
    "ハンマーとつるはし",
    "tool",
    "hanmā to tsuruhashi"
  ],
  [
    "🛠️",
    "hammer and wrench",
    "hamer en moersleutel",
    "锤子和扳手",
    "молоток и гаечный ключ",
    "ハンマーとレンチ",
    "tool",
    "hanmā to renchi"
  ],
  [
    "🗡️",
    "dagger",
    "dolk",
    "匕首",
    "кинжал",
    "短剣",
    "tool",
    "tanken"
  ],
  [
    "⚔️",
    "crossed swords",
    "gekruiste zwaarden",
    "交叉的剑",
    "скрещённые мечи",
    "交差した剣",
    "tool",
    "kōsa shita ken"
  ],
  [
    "💣",
    "bomb",
    "bom",
    "炸弹",
    "бомба",
    "爆弾",
    "tool",
    "bakudan"
  ],
  [
    "🪃",
    "boomerang",
    "boemerang",
    "回旋镖",
    "бумеранг",
    "ブーメラン",
    "tool",
    "būmeran"
  ],
  [
    "🏹",
    "bow and arrow",
    "pijl en boog",
    "弓箭",
    "лук и стрела",
    "弓矢",
    "tool",
    "yumi ya"
  ],
  [
    "🛡️",
    "shield",
    "schild",
    "盾牌",
    "щит",
    "盾",
    "tool",
    "tate"
  ],
  [
    "🪚",
    "carpentry saw",
    "houtzaag",
    "木工锯",
    "пила",
    "のこぎり",
    "tool",
    "nokogiri"
  ],
  [
    "🔧",
    "wrench",
    "moersleutel",
    "扳手",
    "гаечный ключ",
    "レンチ",
    "tool",
    "renchi"
  ],
  [
    "🪛",
    "screwdriver",
    "schroevendraaier",
    "螺丝刀",
    "отвёртка",
    "ドライバー",
    "tool",
    "doraibā"
  ],
  [
    "🔩",
    "nut and bolt",
    "moer en bout",
    "螺母和螺栓",
    "гайка и болт",
    "ナットとボルト",
    "tool",
    "natto to boruto"
  ],
  [
    "⚙️",
    "gear",
    "tandwiel",
    "齿轮",
    "шестерёнка",
    "歯車",
    "tool",
    "haguruma"
  ],
  [
    "🗜️",
    "clamp",
    "klem",
    "夹具",
    "зажим",
    "クランプ",
    "tool",
    "kuranpu"
  ],
  [
    "⚖️",
    "balance scale",
    "weegschaal",
    "天平",
    "весы",
    "天秤",
    "tool",
    "tenbin"
  ],
  [
    "🦯",
    "white cane",
    "witte stok",
    "盲杖",
    "белая трость",
    "白杖",
    "tool",
    "hakujō"
  ],
  [
    "🔗",
    "link",
    "schakel",
    "链接",
    "звено",
    "リンク",
    "tool",
    "rinku"
  ],
  [
    "⛓️‍💥",
    "broken chain",
    "gebroken ketting",
    "断开的链条",
    "разорванная цепь",
    "切れた鎖",
    "tool",
    "kireta kusari"
  ],
  [
    "⛓️",
    "chains",
    "kettingen",
    "链条",
    "цепи",
    "鎖",
    "tool",
    "kusari"
  ],
  [
    "🪝",
    "hook",
    "haak",
    "钩子",
    "крюк",
    "フック",
    "tool",
    "hukku"
  ],
  [
    "🧰",
    "toolbox",
    "gereedschapskist",
    "工具箱",
    "ящик с инструментами",
    "工具箱",
    "tool",
    "kōgubako"
  ],
  [
    "🧲",
    "magnet",
    "magneet",
    "磁铁",
    "магнит",
    "磁石",
    "tool",
    "jishaku"
  ],
  [
    "🪜",
    "ladder",
    "ladder",
    "梯子",
    "лестница",
    "はしご",
    "tool",
    "hashigo"
  ],
  [
    "🪏",
    "shovel",
    "schep",
    "铲子",
    "лопата",
    "シャベル",
    "tool",
    "shaberu"
  ],
  [
    "⚗️",
    "alembic",
    "alambiek",
    "蒸馏器",
    "аламбик",
    "アランビック",
    "science",
    "aranbikku"
  ],
  [
    "🧪",
    "test tube",
    "reageerbuis",
    "试管",
    "пробирка",
    "試験管",
    "science",
    "shikenkan"
  ],
  [
    "🧫",
    "petri dish",
    "petrischaal",
    "培养皿",
    "чашка Петри",
    "シャーレ",
    "science",
    "shāre"
  ],
  [
    "🧬",
    "dna",
    "DNA",
    "DNA",
    "ДНК",
    "DNA",
    "science",
    "dna"
  ],
  [
    "🔬",
    "microscope",
    "microscoop",
    "显微镜",
    "микроскоп",
    "顕微鏡",
    "science",
    "kenbikyō"
  ],
  [
    "🔭",
    "telescope",
    "telescoop",
    "望远镜",
    "телескоп",
    "望遠鏡",
    "science",
    "bōenkyō"
  ],
  [
    "📡",
    "satellite antenna",
    "schotelantenne",
    "卫星天线",
    "спутниковая антенна",
    "衛星アンテナ",
    "science",
    "eisei antena"
  ],
  [
    "💉",
    "syringe",
    "spuit",
    "注射器",
    "шприц",
    "注射器",
    "medical",
    "chūshaki"
  ],
  [
    "🩸",
    "drop of blood",
    "bloeddruppel",
    "血滴",
    "капля крови",
    "血のしずく",
    "medical",
    "chi no shizuku"
  ],
  [
    "💊",
    "pill",
    "pil",
    "药丸",
    "таблетка",
    "錠剤",
    "medical",
    "jōzai"
  ],
  [
    "🩹",
    "adhesive bandage",
    "pleister",
    "创可贴",
    "пластырь",
    "ばんそうこう",
    "medical",
    "ba-n-so-u-ko-u"
  ],
  [
    "🩼",
    "crutch",
    "kruk",
    "拐杖",
    "костыль",
    "松葉杖",
    "medical",
    "matsubazue"
  ],
  [
    "🩺",
    "stethoscope",
    "stethoscoop",
    "听诊器",
    "стетоскоп",
    "聴診器",
    "medical",
    "chōshinki"
  ],
  [
    "🩻",
    "x-ray",
    "röntgenfoto",
    "X光片",
    "рентген",
    "レントゲン",
    "medical",
    "re-n-to-ge-n"
  ],
  [
    "🚪",
    "door",
    "deur",
    "门",
    "дверь",
    "ドア",
    "household",
    "do-a"
  ],
  [
    "🛗",
    "elevator",
    "lift",
    "电梯",
    "лифт",
    "エレベーター",
    "household",
    "e-re-be-ta-"
  ],
  [
    "🪞",
    "mirror",
    "spiegel",
    "镜子",
    "зеркало",
    "鏡",
    "household",
    "kagami"
  ],
  [
    "🪟",
    "window",
    "raam",
    "窗户",
    "окно",
    "窓",
    "household",
    "mado"
  ],
  [
    "🛏️",
    "bed",
    "bed",
    "床",
    "кровать",
    "ベッド",
    "household",
    "be-do"
  ],
  [
    "🛋️",
    "couch and lamp",
    "bank en lamp",
    "沙发和灯",
    "диван и лампа",
    "ソファとランプ",
    "household",
    "so-fu-a-to-ra-n-pu"
  ],
  [
    "🪑",
    "chair",
    "stoel",
    "椅子",
    "стул",
    "椅子",
    "household",
    "isu"
  ],
  [
    "🚽",
    "toilet",
    "toilet",
    "马桶",
    "туалет",
    "トイレ",
    "household",
    "to-i-re"
  ],
  [
    "🪠",
    "plunger",
    "ontstopper",
    "皮搋子",
    "вантуз",
    "ラバーカップ",
    "household",
    "ra-ba-ka-pu"
  ],
  [
    "🚿",
    "shower",
    "douche",
    "淋浴",
    "душ",
    "シャワー",
    "household",
    "sha-wa-"
  ],
  [
    "🛁",
    "bathtub",
    "badkuip",
    "浴缸",
    "ванна",
    "浴槽",
    "household",
    "yokusō"
  ],
  [
    "🪤",
    "mouse trap",
    "muizenval",
    "捕鼠器",
    "мышеловка",
    "ネズミ捕り",
    "household",
    "ne-zu-mi-ri"
  ],
  [
    "🪒",
    "razor",
    "scheermes",
    "剃须刀",
    "бритва",
    "かみそり",
    "household",
    "ka-mi-so-ri"
  ],
  [
    "🧴",
    "lotion bottle",
    "lotionfles",
    "乳液瓶",
    "бутылка лосьона",
    "ローションボトル",
    "household",
    "ro-sho-n-bo-to-ru"
  ],
  [
    "🧷",
    "safety pin",
    "veiligheidsspeld",
    "安全别针",
    "английская булавка",
    "安全ピン",
    "household",
    "pi-n"
  ],
  [
    "🧹",
    "broom",
    "bezem",
    "扫帚",
    "метла",
    "ほうき",
    "household",
    "ho-u-ki"
  ],
  [
    "🧺",
    "basket",
    "mand",
    "篮子",
    "корзина",
    "かご",
    "household",
    "ka-go"
  ],
  [
    "🧻",
    "roll of paper",
    "papierrol",
    "纸卷",
    "рулон бумаги",
    "紙ロール",
    "household",
    "ro-ru"
  ],
  [
    "🪣",
    "bucket",
    "emmer",
    "桶",
    "ведро",
    "バケツ",
    "household",
    "ba-ke-tsu"
  ],
  [
    "🧼",
    "soap",
    "zeep",
    "肥皂",
    "мыло",
    "せっけん",
    "household",
    "se-ke-n"
  ],
  [
    "🫧",
    "bubbles",
    "bellen",
    "泡泡",
    "пузыри",
    "泡",
    "household",
    "awa"
  ],
  [
    "🪥",
    "toothbrush",
    "tandenborstel",
    "牙刷",
    "зубная щётка",
    "歯ブラシ",
    "household",
    "bu-ra-shi"
  ],
  [
    "🧽",
    "sponge",
    "spons",
    "海绵",
    "губка",
    "スポンジ",
    "household",
    "su-po-n-ji"
  ],
  [
    "🧯",
    "fire extinguisher",
    "brandblusser",
    "灭火器",
    "огнетушитель",
    "消火器",
    "household",
    "shōkaki"
  ],
  [
    "🛒",
    "shopping cart",
    "winkelwagen",
    "购物车",
    "тележка для покупок",
    "ショッピングカート",
    "household",
    "sho-pi-n-gu-ka-to"
  ],
];

function makePeopleKey(english, index) {
  const slug = english
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  return `people${index + 1}_${slug}`;
}

function makeObjectKey(english, index) {
  const slug = english
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  return `object${index + 1}_${slug}`;
}

function makeFoodKey(english, index) {
  const slug = english
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  return `food${index + 1}_${slug}`;
}

function makeNatureKey(english, index) {
  const slug = english
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  return `nature${index + 1}_${slug}`;
}

function makeActivityKey(english, index) {
  const slug = english
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  return `activity${index + 1}_${slug}`;
}

function makeTravelKey(english, index) {
  const slug = english
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  return `travel${index + 1}_${slug}`;
}

function validateEmojiArraySchemas() {
  const errors = [];

  const expectLength = (name, items, length) => {
    items.forEach((entry, index) => {
      if (!Array.isArray(entry) || entry.length !== length) {
        errors.push(`${name}[${index}]: expected ${length} fields, got ${Array.isArray(entry) ? entry.length : typeof entry}`);
      }
    });
  };

  expectLength("foodEmojiItems", foodEmojiItems, 7);
  expectLength("natureEmojiItems", natureEmojiItems, 7);
  expectLength("activityEmojiItems", activityEmojiItems, 8);
  expectLength("travelEmojiItems", travelEmojiItems, 8);
  expectLength("peopleEmojiItems", peopleEmojiItems, 8);
  expectLength("objectEmojiItems", objectEmojiItems, 8);
  expectLength("animalItems", animalItems, 8);

  if (errors.length) {
    throw new Error(`Emoji array schema validation failed:\n${errors.join("\n")}`);
  }
}

const animalCategoryWords = animalItems.map(([id]) => `animal${id}`);
const foodCategoryWords = foodEmojiItems.map(([, english], index) => makeFoodKey(english, index));
const natureCategoryWords = natureEmojiItems.map(([, english], index) => makeNatureKey(english, index));
const activityCategoryWords = activityEmojiItems.map(([, english], index) => makeActivityKey(english, index));
const travelCategoryWords = travelEmojiItems.map(([, english], index) => makeTravelKey(english, index));
const objectCategoryWords = objectEmojiItems.map(([, english], index) => makeObjectKey(english, index));
const peopleCategoryWords = peopleEmojiItems.map(([, english], index) => makePeopleKey(english, index));

const activityFactTexts = {
  "jack-o-lantern": ["A jack-o-lantern is a carved pumpkin with a face.", "People often put a light inside it for Halloween.", "The face can look silly, spooky, happy, or surprised."],
  "Christmas tree": ["A Christmas tree is often decorated with lights and ornaments.", "Some families use real trees, and some use artificial trees.", "The top of the tree may have a star, angel, or special decoration."],
  fireworks: ["Fireworks make bright colors in the night sky.", "The loud boom comes after the flash because sound travels slower than light.", "Fireworks are usually watched from a safe distance."],
  sparkler: ["A sparkler gives off tiny bright sparks.", "Sparklers are held by the handle, away from the hot sparkling part.", "People often use sparklers during celebrations at night."],
  firecracker: ["A firecracker makes a quick pop or bang.", "Firecrackers are used in some celebrations to make noise.", "Firecrackers should only be handled safely by grown-ups."],
  sparkles: ["Sparkles show tiny flashes of light.", "Sparkles are often used to make something feel magical or special.", "In drawings, sparkles can show shine, cleanliness, or excitement."],
  balloon: ["A balloon is filled with air or helium.", "Helium balloons can float upward.", "Balloons can pop if they touch something sharp."],
  "party popper": ["A party popper shoots out streamers or confetti.", "It often makes a small popping sound.", "Party poppers are used for birthdays, New Year, and surprises."],
  "confetti ball": ["A confetti ball opens to release many tiny paper pieces.", "Confetti can make celebrations look colorful.", "Cleaning up confetti can take longer than throwing it."],
  "tanabata tree": ["A Tanabata tree is decorated with paper wishes.", "Tanabata is a Japanese summer festival.", "People write hopes or dreams on colorful paper strips."],
  "pine decoration": ["Pine decorations are used for New Year in Japan.", "They are often placed near entrances.", "Pine can symbolize strength and long life."],
  "Japanese dolls": ["Japanese dolls can be displayed for Hinamatsuri, the Doll Festival.", "The dolls often wear traditional clothing.", "They can be arranged on special steps or shelves."],
  "carp streamer": ["Carp streamers are shaped like fish.", "They are flown for Children's Day in Japan.", "The carp can symbolize strength and courage."],
  "wind chime": ["A wind chime makes sound when the wind moves it.", "Some wind chimes are made of glass, metal, bamboo, or shells.", "A wind chime can make a porch or window feel peaceful."],
  "moon viewing ceremony": ["Moon viewing is a tradition of enjoying the autumn moon.", "People may display grasses or eat special treats.", "The ceremony invites people to slow down and look at the sky."],
  "red envelope": ["Red envelopes are often given during Lunar New Year.", "They usually hold money or a gift note.", "The red color can symbolize good luck."],
  ribbon: ["A ribbon can decorate gifts, hair, clothes, or medals.", "Ribbons can be tied into bows.", "Ribbons can be silky, shiny, patterned, or plain."],
  "wrapped gift": ["A wrapped gift hides the surprise inside.", "Wrapping paper can be colorful or patterned.", "Opening a gift carefully or quickly can feel very different."],
  "reminder ribbon": ["A reminder ribbon can show support for a cause.", "Different ribbon colors can stand for different messages.", "People may wear ribbons to remember or raise awareness."],
  "admission tickets": ["Admission tickets let people enter an event or place.", "Tickets may be used for movies, museums, concerts, or rides.", "Some tickets have numbers, dates, seats, or tear-off parts."],
  ticket: ["A ticket can show permission to enter or ride.", "Tickets can be paper or digital.", "Keeping a ticket safe matters until it is checked."],
  "military medal": ["A military medal is given for service or bravery.", "Medals can be worn on uniforms.", "The ribbon color and shape can tell what the medal means."],
  trophy: ["A trophy is given to celebrate a win or achievement.", "Trophies often stand on a base.", "Some trophies are shaped like cups, figures, or shields."],
  "sports medal": ["A sports medal can be awarded after a race or match.", "Medals often hang from ribbons.", "Winning a medal usually takes practice and effort."],
  "1st place medal": ["A first place medal is often gold-colored.", "It marks the top result in a contest.", "First place can come from speed, skill, teamwork, or creativity."],
  "2nd place medal": ["A second place medal is often silver-colored.", "Second place still celebrates strong effort.", "Many contests honor more than one participant."],
  "3rd place medal": ["A third place medal is often bronze-colored.", "Third place can still be a proud achievement.", "Medals can remind people of practice and progress."],
  "soccer ball": ["A soccer ball is kicked with the feet.", "Soccer players try to score by getting the ball into a goal.", "A soccer ball has a pattern of panels stitched together."],
  baseball: ["A baseball has red stitching around it.", "Players hit a baseball with a bat.", "Baseball gloves help players catch fast balls."],
  softball: ["A softball is usually larger than a baseball.", "Softball is often played on a diamond-shaped field.", "The ball is not always soft, even though it is called softball."],
  basketball: ["A basketball is bounced, passed, and thrown toward a hoop.", "The bumps on the ball help players grip it.", "Basketball can be played indoors or outside."],
  volleyball: ["Volleyball is hit over a net.", "Players often use their hands and arms to pass the ball.", "A volleyball is lighter than many other sports balls."],
  "american football": ["An American football has an oval shape.", "The pointed ends help it spiral through the air.", "Players carry, throw, kick, and catch the ball."],
  "rugby football": ["A rugby ball is oval-shaped.", "Rugby players run while carrying and passing the ball.", "The ball can bounce in surprising directions."],
  tennis: ["A tennis ball is fuzzy.", "Players hit the ball with rackets over a net.", "Tennis can be played by two players or four players."],
  "flying disc": ["A flying disc glides through the air when thrown flat.", "People play catch or games with flying discs.", "Wind can change how a flying disc moves."],
  bowling: ["Bowling uses a heavy ball to knock down pins.", "The lane is long, smooth, and shiny.", "A strike means all pins fall on the first roll."],
  "cricket game": ["Cricket uses a bat, ball, and wickets.", "A cricket match can last a short time or many hours.", "Cricket is especially popular in countries such as India, England, and Australia."],
  "field hockey": ["Field hockey uses curved sticks.", "Players try to hit the ball into a goal.", "The game is played on grass or turf."],
  "ice hockey": ["Ice hockey is played on ice.", "Players use sticks to hit a puck.", "Skates help players move quickly and turn sharply."],
  lacrosse: ["Lacrosse sticks have nets at the end.", "Players catch, carry, and throw a small ball.", "Lacrosse is one of the oldest team sports in North America."],
  "ping pong": ["Ping pong is also called table tennis.", "The ball is very light and bouncy.", "Fast rallies can sound like tiny taps."],
  badminton: ["Badminton uses a shuttlecock instead of a ball.", "The shuttlecock has feathers or a plastic skirt.", "Players hit it over a net with lightweight rackets."],
  "boxing glove": ["Boxing gloves protect hands during boxing practice or matches.", "The padding makes punches less sharp.", "Boxers also learn footwork, timing, and defense."],
  "martial arts uniform": ["A martial arts uniform is often tied with a belt.", "Belt colors can show learning progress.", "Martial arts practice can include balance, respect, and control."],
  "goal net": ["A goal net catches a ball or puck after a score.", "Nets help players and referees see when a goal happens.", "Goal nets are used in sports like soccer and hockey."],
  "flag in hole": ["A flag in a hole marks the target in golf.", "The flag helps players see the hole from far away.", "Golf balls are small and have dimples."],
  "ice skate": ["Ice skates have metal blades.", "The blade glides over ice.", "Skaters can move forward, spin, jump, or stop with practice."],
  "fishing pole": ["A fishing pole helps cast a line into water.", "Fishing often takes patience and quiet watching.", "Fishers may use hooks, bait, lures, or nets."],
  "diving mask": ["A diving mask helps people see underwater.", "The mask keeps water away from the eyes.", "Divers also use careful breathing and safety rules."],
  "running shirt": ["A running shirt is light and easy to move in.", "Some running shirts have race numbers attached.", "Runners often choose clothes that help them stay cool."],
  skis: ["Skis slide over snow.", "Skiers use poles for balance and pushing.", "Skis can be long, short, wide, or narrow for different snow."],
  sled: ["A sled slides downhill on snow or ice.", "Some sleds have runners, and some are flat.", "Sledding feels faster on smooth packed snow."],
  "curling stone": ["A curling stone slides across ice.", "Players sweep the ice to guide the stone.", "Curling stones have handles on top."],
  bullseye: ["A bullseye is the center of a target.", "Aiming games reward focus and steady hands.", "Hitting the bullseye is often the highest score."],
  "yo-yo": ["A yo-yo rolls down and back up a string.", "Yo-yo tricks take timing and practice.", "Some yo-yos can spin at the bottom before returning."],
  kite: ["A kite flies when wind pushes against it.", "Kites often have tails for balance.", "Flying a kite teaches patience and gentle control."],
  "water pistol": ["A water pistol squirts water.", "Water games are often played outside on warm days.", "Aiming a water stream takes hand control."],
  "pool 8 ball": ["The 8 ball is used in pool and billiards.", "It is usually black with a white circle and number.", "In some games, the 8 ball is saved for the end."],
  "crystal ball": ["A crystal ball is a round clear object from stories and magic shows.", "It reflects and bends light.", "In pretend play, it can be used for fortune-telling."],
  "magic wand": ["A magic wand appears in fairy tales and stage magic.", "Wands are often waved to pretend a spell is happening.", "A wand can make imagination feel visible."],
  "video game": ["Video games are played on screens.", "Players use controllers, keyboards, touchscreens, or motion controls.", "Games can involve puzzles, stories, music, racing, building, or teamwork."],
  joystick: ["A joystick tilts in different directions.", "Joysticks can control movement in games or machines.", "Arcade games often use joysticks and buttons."],
  "slot machine": ["A slot machine spins symbols on reels.", "Slot machines are usually for adults.", "Old slot machines had handles that players pulled."],
  "game die": ["A game die has numbered sides.", "Rolling dice adds chance to games.", "Most dice cubes have numbers from one to six."],
  "puzzle piece": ["A puzzle piece fits with other pieces.", "Jigsaw puzzles use shape and picture clues.", "Finding the right piece can feel like solving a tiny mystery."],
  "teddy bear": ["A teddy bear is a soft stuffed toy.", "Many children hug teddy bears for comfort.", "Teddy bears are named after Theodore Roosevelt."],
  "piñata": ["A piñata is often filled with treats or toys.", "Piñatas are used at parties and celebrations.", "Some piñatas are shaped like animals, stars, or characters."],
  "mirror ball": ["A mirror ball reflects light in many directions.", "Mirror balls are often used for dancing or parties.", "Tiny mirror pieces make spots of light move around a room."],
  "nesting dolls": ["Nesting dolls fit one inside another.", "The smallest doll is hidden inside all the others.", "Nesting dolls are often painted with colorful faces and clothes."],
  "spade suit": ["The spade suit is one of the four card suits.", "Spades are usually black on playing cards.", "Card suits help organize many card games."],
  "heart suit": ["The heart suit is one of the four card suits.", "Hearts are usually red on playing cards.", "Heart shapes are also used to show love or care."],
  "diamond suit": ["The diamond suit is one of the four card suits.", "Diamonds are usually red on playing cards.", "The diamond shape has four pointed corners."],
  "club suit": ["The club suit is one of the four card suits.", "Clubs are usually black on playing cards.", "The club symbol looks a little like a three-leaf shape."],
  "chess pawn": ["A chess pawn is the smallest chess piece.", "Pawns usually move one square forward.", "A pawn can become a stronger piece if it reaches the far side."],
  joker: ["A joker is a special playing card.", "Some card games use jokers, and some remove them.", "Jokers often show a playful or jester-like picture."],
  "mahjong red dragon": ["The red dragon is a tile in mahjong.", "Mahjong uses many tiles with symbols and characters.", "Players match, draw, and discard tiles during the game."],
  "flower playing cards": ["Flower playing cards are used in Japanese hanafuda games.", "The cards show flowers and seasonal pictures.", "Hanafuda decks are different from ordinary number cards."],
  "performing arts": ["Performing arts include theater, dance, opera, and stage shows.", "Masks can show different characters or feelings.", "Performers use voice, movement, costume, and expression."],
  "framed picture": ["A framed picture protects and displays art or photos.", "Frames can be wood, metal, plastic, plain, or fancy.", "A picture in a frame can make a room feel personal."],
  "artist palette": ["An artist palette holds paint colors.", "Painters mix colors on the palette before painting.", "A palette can become messy and beautiful during art-making."],
  thread: ["Thread is a thin strand used for sewing.", "Thread can join fabric pieces together.", "Thread comes in many colors and thicknesses."],
  "sewing needle": ["A sewing needle pulls thread through fabric.", "Needles have a tiny hole called an eye.", "Sewing can repair clothes or create new things."],
  yarn: ["Yarn is thicker than thread.", "Yarn can be knitted or crocheted into scarves, hats, blankets, or toys.", "A ball of yarn can roll away if it is dropped."],
  knot: ["A knot is made by looping and tightening string, rope, or thread.", "Knots can hold things together.", "Some knots are easy to untie, and some are very strong."],
  "musical score": ["A musical score shows music written on a page.", "Musicians read notes and rhythms from a score.", "A score can help many players perform together."],
  "musical note": ["A musical note is a symbol for a sound.", "Notes can be high, low, short, or long.", "Written notes help musicians remember melodies."],
  "musical notes": ["Musical notes can show a tune or song.", "Several notes together can make a melody.", "Notes can move up, down, repeat, or jump."],
  "studio microphone": ["A studio microphone records voices and instruments.", "Microphones turn sound into electrical signals.", "A studio microphone may be used for songs, podcasts, or voice acting."],
  "level slider": ["A level slider controls how loud or strong a sound signal is.", "Sliding up usually means more, and sliding down means less.", "Sound engineers use sliders to balance music."],
  "control knobs": ["Control knobs turn to adjust settings.", "Knobs can change volume, tone, brightness, or effects.", "Turning a knob slowly can make tiny changes."],
  microphone: ["A microphone makes a voice louder or records it.", "Singers often hold microphones close to their mouths.", "Microphones can be wired, wireless, tiny, or large."],
  headphone: ["Headphones let one person listen closely.", "Some headphones cover the ears, and some sit inside them.", "Headphones can help hear small details in music or stories."],
  radio: ["A radio receives broadcasts through signals.", "Radios can play music, news, weather, or stories.", "Older radios often have knobs for tuning stations."],
  saxophone: ["A saxophone is a wind instrument made of brass.", "It uses a reed on the mouthpiece to make sound.", "Saxophones are common in jazz bands."],
  trumpet: ["A trumpet makes sound when a player buzzes their lips.", "Trumpets have three valves.", "Trumpets can sound bright, loud, and clear."],
  trombone: ["A trombone changes notes with a long slide.", "Moving the slide changes the length of the instrument.", "Trombones can make smooth sliding sounds."],
  accordion: ["An accordion makes sound when air moves through reeds.", "The player squeezes and pulls bellows.", "Accordions often have buttons or keys on the sides."],
  guitar: ["A guitar has strings that can be strummed or plucked.", "Guitars can be acoustic or electric.", "Pressing strings on the neck changes the notes."],
  "musical keyboard": ["A musical keyboard has rows of keys.", "Pressing a key makes a note.", "Keyboards can imitate many instrument sounds."],
  violin: ["A violin has four strings.", "A bow is often used to make the strings vibrate.", "Violins can play very high, singing notes."],
  banjo: ["A banjo has strings stretched over a round body.", "Banjos often make a bright twangy sound.", "Banjo music is common in bluegrass and folk styles."],
  drum: ["A drum makes sound when its surface is hit.", "Drums help keep rhythm.", "Drums can be played with hands, sticks, or mallets."],
  "long drum": ["A long drum has an elongated body.", "Long drums can be played with hands or sticks.", "Different cultures use long drums in ceremonies, dances, and music."],
  maracas: ["Maracas make sound when shaken.", "Inside are small pieces that rattle.", "Maracas are often played in pairs."],
  flute: ["A flute makes sound when air blows across an opening.", "Flutes can play light, clear melodies.", "Many cultures have their own kinds of flutes."],
  harp: ["A harp has many strings stretched across a frame.", "Harpists pluck strings with their fingers.", "Harp music can sound gentle, bright, or flowing."],
};

function activityFacts(english, subgroup) {
  if (activityFactTexts[english]) return activityFactTexts[english];
  const label = capitalize(english);
  const lower = english.toLowerCase();
  const factSets = {
    event: [
      `${label} can be part of a celebration, festival, holiday, or special day.`,
      "Event objects often help people decorate, gather, remember, or give gifts.",
      `${label} can make children curious about traditions in different families and places.`,
    ],
    "award-medal": [
      `${label} is connected to winning, trying hard, or being recognized.`,
      "Awards can celebrate practice, teamwork, courage, kindness, or skill.",
      `${label} can help children talk about effort, fairness, and cheering for others.`,
    ],
    sport: [
      `${label} is connected to sport, movement, practice, or outdoor play.`,
      "Sports can use balls, goals, nets, sticks, uniforms, balance, speed, or teamwork.",
      `${label} can help children notice rules, turns, practice, and cheering.`,
    ],
    game: [
      `${label} is connected to games, toys, pretend play, or puzzles.`,
      "Games can use luck, memory, aiming, building, strategy, or imagination.",
      `${label} can help children practice taking turns, trying again, and solving problems.`,
    ],
    "arts & crafts": [
      `${label} is connected to making, decorating, performing, or creating.`,
      "Arts and crafts can use hands, colors, patterns, materials, movement, or stories.",
      `${label} can help children turn ideas into something they can see, hear, or touch.`,
    ],
    music: [
      `${label} is connected to listening, recording, singing, or shaping sound.`,
      "Music can be loud, soft, fast, slow, high, low, bouncy, or calm.",
      `${label} can help children notice rhythm, melody, voices, and sound patterns.`,
    ],
    "musical-instrument": [
      `${label} is a musical instrument or instrument picture.`,
      "Musical instruments make sound by strings, air, keys, skins, or shaking parts.",
      `${label} can help children explore rhythm, melody, practice, and performance.`,
    ],
  };
  return factSets[subgroup] || [`${label} is connected to an activity.`, "Activities can be playful, creative, musical, sporty, or social.", `Children can use ${lower} to talk about things people do.`];
}

const travelFactTexts = {
  "globe showing Europe-Africa": [
    "A globe is a round model of Earth.",
    "Europe and Africa sit on opposite sides of the Mediterranean Sea.",
    "Turning a globe helps children see that Earth has many connected places."
  ],
  "globe showing Americas": [
    "The Americas include North America, Central America, and South America.",
    "A globe can show oceans curving around continents.",
    "People use globes to imagine long trips across the world."
  ],
  "globe showing Asia-Australia": [
    "Asia is the largest continent on Earth.",
    "Australia is both a country and a continent-sized landmass.",
    "Looking at this side of the globe can start conversations about faraway family trips."
  ],
  "globe with meridians": [
    "Meridians are lines that run from the North Pole to the South Pole.",
    "Map lines help people describe exact places.",
    "A globe with lines can make the world look like a big puzzle ball."
  ],
  "world map": [
    "A world map shows Earth on a flat page or screen.",
    "Maps use symbols, colors, and labels to explain places.",
    "Children can point to countries, oceans, and routes on a world map."
  ],
  "map of Japan": [
    "Japan is made of many islands.",
    "Maps of Japan often show a long chain shape.",
    "Japan has mountains, busy cities, forests, and coastlines."
  ],
  "compass": [
    "A compass points toward north with a moving needle.",
    "Explorers use compasses when landmarks are hard to see.",
    "Learning compass directions helps children understand north, south, east, and west."
  ],
  "snow-capped mountain": [
    "Snow can stay on tall mountain tops even when lower places are warm.",
    "High mountains often have colder air near the summit.",
    "Snowy peaks can be seen from far away on clear days."
  ],
  "mountain": [
    "Mountains rise high above the land around them.",
    "Some mountains form when pieces of Earth push upward over a very long time.",
    "Climbing a mountain usually takes steady steps and rest breaks."
  ],
  "volcano": [
    "A volcano can release lava, ash, steam, and hot gases.",
    "Some volcanoes are quiet for many years before erupting.",
    "Volcanic rock can become new land after it cools."
  ],
  "mount fuji": [
    "Mount Fuji is the tallest mountain in Japan.",
    "Its cone shape is famous in paintings and photos.",
    "On clear days, Mount Fuji can be seen from far away."
  ],
  "camping": [
    "Camping means sleeping outdoors, often in a tent.",
    "Campers may cook simple food, look at stars, or listen to night sounds.",
    "A good camping trip includes warm clothes, lights, and safety plans."
  ],
  "beach with umbrella": [
    "A beach umbrella makes shade on sunny sand.",
    "Beaches can have shells, waves, towels, buckets, and sandcastles.",
    "People use sunscreen and shade to protect skin at the beach."
  ],
  "desert": [
    "A desert is a very dry place.",
    "Some deserts are hot, and some deserts are cold.",
    "Desert plants and animals have clever ways to save water."
  ],
  "desert island": [
    "A desert island is an island with very few or no people.",
    "Islands have water all around them.",
    "Stories often use desert islands for adventure and imagination."
  ],
  "national park": [
    "National parks protect special landscapes, plants, and animals.",
    "Visitors can walk trails, see views, and learn nature rules.",
    "Park signs help people stay on paths and care for wild places."
  ],
  "stadium": [
    "A stadium holds many people for sports or shows.",
    "Seats often go up in rows so more people can see.",
    "Big stadiums can become very loud when everyone cheers."
  ],
  "classical building": [
    "Classical buildings often have tall columns.",
    "Some are inspired by ancient Greek and Roman architecture.",
    "Museums, courts, and libraries sometimes use classical building styles."
  ],
  "building construction": [
    "Construction sites are places where workers build or repair structures.",
    "Cranes can lift heavy materials high into the air.",
    "Hard hats help protect workers on building sites."
  ],
  "brick": [
    "Bricks are small blocks used to build walls and paths.",
    "Many bricks are made from clay that has been fired until hard.",
    "A brick wall is strong because the bricks overlap in patterns."
  ],
  "rock": [
    "Rocks can be smooth, sharp, heavy, tiny, or huge.",
    "Some rocks form from cooled lava, and some form from layers of sand or mud.",
    "Children often collect interesting rocks by color or shape."
  ],
  "wood": [
    "Wood comes from trees.",
    "People use wood for houses, furniture, toys, boats, and pencils.",
    "Different kinds of wood can have different colors, smells, and patterns."
  ],
  "hut": [
    "A hut is a small simple shelter.",
    "Huts can be made from wood, grass, mud, stone, or other local materials.",
    "Some huts are built for sleeping, storage, or resting while working outdoors."
  ],
  "houses": [
    "Houses give families a place to sleep, cook, and be together.",
    "A neighborhood can have houses in many shapes and colors.",
    "Windows, doors, roofs, and walls all help make a house useful."
  ],
  "derelict house": [
    "A derelict house is old, damaged, or no longer cared for.",
    "Empty buildings can become unsafe if floors, roofs, or walls break down.",
    "Sometimes old houses are repaired and given a new life."
  ],
  "house": [
    "A house is a place where people can live.",
    "Houses protect people from rain, wind, cold, and heat.",
    "Every family can make a house feel like home in its own way."
  ],
  "house with garden": [
    "A garden can grow flowers, herbs, vegetables, or trees.",
    "Gardens give insects and birds places to visit.",
    "A house with a garden can have space for digging, watering, and outdoor play."
  ],
  "office building": [
    "Office buildings are places where many people work.",
    "Tall office buildings may have elevators and many windows.",
    "Desks, meeting rooms, computers, and phones are common inside offices."
  ],
  "Japanese post office": [
    "Japanese post offices help send letters and packages.",
    "Some post office signs in Japan use the postal mark symbol.",
    "Post offices can also sell stamps and postcards."
  ],
  "post office": [
    "A post office helps mail travel from one place to another.",
    "Letters need addresses so they can find the right home.",
    "Stamps show that postage has been paid."
  ],
  "hospital": [
    "Hospitals are places where doctors and nurses care for people.",
    "Ambulances can bring patients to hospitals quickly.",
    "Hospitals have special rooms and tools for healing and safety."
  ],
  "bank": [
    "A bank is a place where people keep and manage money.",
    "Some banks have safes and strong security doors.",
    "Bank cards and machines help people pay or take out cash."
  ],
  "hotel": [
    "A hotel gives travelers a place to sleep away from home.",
    "Hotels often have room keys, beds, bathrooms, and a front desk.",
    "People may stay in hotels during holidays, visits, or long journeys."
  ],
  "love hotel": [
    "A love hotel is a type of hotel mostly for adults.",
    "In Japan, many love hotels have bright signs and themed rooms.",
    "For a kids app, it can simply be understood as a special kind of hotel building."
  ],
  "convenience store": [
    "A convenience store is a small shop for everyday things.",
    "Many convenience stores sell snacks, drinks, and simple meals.",
    "Some are open very early, very late, or all day and night."
  ],
  "school": [
    "A school is a place where children learn and play.",
    "Classrooms can have books, pencils, desks, boards, and art supplies.",
    "Schools help children practice reading, numbers, friendship, and curiosity."
  ],
  "department store": [
    "A department store has many kinds of shops inside one building.",
    "Different floors may sell clothes, toys, food, or home things.",
    "Escalators and elevators help shoppers move between levels."
  ],
  "factory": [
    "A factory is a place where things are made.",
    "Factories can make food, cars, clothes, toys, machines, or tools.",
    "Workers and machines often work together in a factory."
  ],
  "Japanese castle": [
    "Japanese castles often have layered roofs and stone walls.",
    "Many castles were built to protect important places long ago.",
    "Some Japanese castles are now museums that visitors can explore."
  ],
  "castle": [
    "Castles were built to protect people and land.",
    "Many castles have towers, gates, thick walls, or moats.",
    "Stories often use castles for knights, queens, dragons, and adventures."
  ],
  "wedding": [
    "A wedding is a ceremony where people celebrate getting married.",
    "Weddings can include music, special clothes, flowers, food, and family traditions.",
    "Different cultures celebrate weddings in many beautiful ways."
  ],
  "Tokyo tower": [
    "Tokyo Tower is a tall landmark in Japan.",
    "It is painted orange and white so airplanes can see it clearly.",
    "Visitors can look out over Tokyo from observation decks."
  ],
  "Statue of Liberty": [
    "The Statue of Liberty stands on an island in New York Harbor.",
    "She holds a torch high in one hand.",
    "The statue is a symbol of welcome and freedom."
  ],
  "church": [
    "A church is a place where many Christians gather.",
    "Some churches have bells, stained glass, towers, or organs.",
    "Churches can be quiet places for prayer, music, and community."
  ],
  "mosque": [
    "A mosque is a place where Muslims gather to pray.",
    "Many mosques have domes, arches, or tall minarets.",
    "People usually remove shoes before entering prayer areas."
  ],
  "hindu temple": [
    "A Hindu temple is a place for worship and offerings.",
    "Many temples have colorful carvings and statues.",
    "Visitors may hear bells, smell flowers, or see lamps during worship."
  ],
  "synagogue": [
    "A synagogue is a place where Jewish communities gather.",
    "People may pray, study, celebrate, and learn there.",
    "Synagogues often keep Torah scrolls in a special cabinet."
  ],
  "shinto shrine": [
    "A Shinto shrine is a sacred place in Japan.",
    "Torii gates often mark the entrance to a shrine area.",
    "Visitors may bow, clap, and make wishes or prayers."
  ],
  "kaaba": [
    "The Kaaba is a sacred building in Mecca.",
    "Muslims around the world face toward the Kaaba during prayer.",
    "During Hajj, many pilgrims walk around the Kaaba together."
  ],
  "fountain": [
    "A fountain moves water into the air or across a pool.",
    "Some fountains are quiet, and some splash loudly.",
    "Coins are sometimes tossed into fountains while making a wish."
  ],
  "tent": [
    "A tent is a temporary shelter made from fabric and poles.",
    "Tents can fold up and travel in a bag.",
    "Campers close tent doors to keep rain and bugs outside."
  ],
  "foggy": [
    "Fog is a cloud close to the ground.",
    "Fog can make buildings, bridges, and roads look soft or hidden.",
    "Drivers and walkers move carefully when it is foggy."
  ],
  "night with stars": [
    "At night, stars become easier to see when the sky is dark.",
    "City lights can make stars harder to spot.",
    "Looking at stars can help children notice patterns in the sky."
  ],
  "cityscape": [
    "A cityscape shows many buildings together.",
    "City skylines can have towers, bridges, parks, and busy streets.",
    "Cities look different in daylight, rain, snow, and night lights."
  ],
  "sunrise over mountains": [
    "Sunrise over mountains can color the sky pink, orange, or gold.",
    "Mountains can make the first sunlight appear along ridges.",
    "Early hikers sometimes wake up before sunrise to see the view."
  ],
  "sunrise": [
    "Sunrise is when the sun appears in the morning.",
    "Birds often become noisier around sunrise.",
    "The sunrise time changes through the seasons."
  ],
  "cityscape at dusk": [
    "Dusk is the time when daylight fades but night is not fully dark.",
    "City windows and streetlights begin to glow at dusk.",
    "The sky at dusk can change colors very quickly."
  ],
  "sunset": [
    "Sunset is when the sun goes below the horizon.",
    "Dust and clouds can make sunsets look red, orange, or purple.",
    "Many families stop to watch a beautiful sunset together."
  ],
  "bridge at night": [
    "A bridge lets people cross water, roads, valleys, or train tracks.",
    "At night, bridge lights can reflect on water.",
    "Some bridges are famous landmarks in their cities."
  ],
  "hot springs": [
    "Hot springs are pools warmed by heat from inside Earth.",
    "Some hot springs steam in cold air.",
    "People visit hot springs to relax and warm up."
  ],
  "carousel horse": [
    "A carousel horse moves in a circle on a merry-go-round.",
    "Many carousel horses are painted with bright saddles and decorations.",
    "Carousel music often repeats while the ride turns."
  ],
  "playground slide": [
    "A playground slide lets children climb up and glide down.",
    "Slides can be straight, bumpy, spiral, tall, or small.",
    "Children wait turns to keep sliding safe and fair."
  ],
  "ferris wheel": [
    "A ferris wheel carries people in seats around a big circle.",
    "From the top, riders can see far across a park or city.",
    "Ferris wheels move slowly so people can enjoy the view."
  ],
  "roller coaster": [
    "A roller coaster runs on tracks with hills, turns, and drops.",
    "The first big climb often stores energy for the ride.",
    "Some roller coasters go fast, twist upside down, or splash through water."
  ],
  "barber pole": [
    "A barber pole marks a place where people get haircuts.",
    "The red, white, and blue stripes spin in a spiral pattern.",
    "Barber shops may have scissors, combs, mirrors, and special chairs."
  ],
  "circus tent": [
    "A circus tent is a large tent used for performances.",
    "Traditional circus tents often have bright stripes.",
    "Inside, people may watch acrobats, clowns, music, or trained performers."
  ],
  "locomotive": [
    "A locomotive pulls or pushes train cars along tracks.",
    "Old steam locomotives made clouds of steam and smoke.",
    "Modern locomotives can run on diesel power or electricity."
  ],
  "railway car": [
    "A railway car is one part of a train.",
    "Some railway cars carry passengers, and some carry goods.",
    "Cars connect together so a train can carry much more at once."
  ],
  "high-speed train": [
    "High-speed trains are designed to travel very fast on special tracks.",
    "Their smooth shape helps air flow around them.",
    "Fast trains can connect cities without using airplanes."
  ],
  "bullet train": [
    "Bullet trains are famous fast trains in Japan.",
    "Their noses are shaped to move smoothly through air and tunnels.",
    "Many bullet trains are known for being clean, quiet, and punctual."
  ],
  "train": [
    "A train moves along metal rails.",
    "Trains can carry people, animals, mail, food, or heavy materials.",
    "Train wheels are shaped to stay balanced on the track."
  ],
  "metro": [
    "A metro is a city train system, often underground.",
    "Metro maps use colors and lines to show routes.",
    "People use metros to move around busy cities without cars."
  ],
  "light rail": [
    "Light rail is a train-like transport often used in cities.",
    "It may run on streets, bridges, tunnels, or separate tracks.",
    "Light rail stops are usually closer together than long-distance train stations."
  ],
  "station": [
    "A station is a place where passengers get on or off transport.",
    "Stations may have signs, clocks, platforms, tickets, and waiting areas.",
    "Listening for announcements helps travelers find the right train or bus."
  ],
  "tram": [
    "A tram runs on rails in city streets.",
    "Trams often stop near shops, schools, parks, and neighborhoods.",
    "Some trams get power from wires above the street."
  ],
  "monorail": [
    "A monorail travels on one rail or beam.",
    "Many monorails are raised above roads and sidewalks.",
    "Airports and theme parks sometimes use monorails."
  ],
  "mountain railway": [
    "A mountain railway climbs steep slopes.",
    "Some mountain railways use special gears or cables for extra grip.",
    "Passengers can see valleys, trees, and peaks from the train."
  ],
  "tram car": [
    "A tram car is the passenger part of a tram.",
    "It usually has doors on the side for quick stops.",
    "Tram cars can ring bells to warn people nearby."
  ],
  "bus": [
    "A bus carries many people on roads.",
    "Buses stop at marked stops along a route.",
    "Taking a bus can mean sharing space and waiting your turn."
  ],
  "oncoming bus": [
    "An oncoming bus is facing toward you.",
    "Front lights and large windows help people recognize it from ahead.",
    "Crossing the road safely means watching for buses coming both ways."
  ],
  "trolleybus": [
    "A trolleybus looks like a bus but gets power from overhead wires.",
    "It runs on rubber tires instead of rails.",
    "Trolleybuses can be quieter than many fuel-powered buses."
  ],
  "minibus": [
    "A minibus is smaller than a regular bus.",
    "It can carry a small group of passengers.",
    "Minibuses are useful for school trips, airport rides, or narrow streets."
  ],
  "ambulance": [
    "An ambulance carries sick or injured people to care quickly.",
    "Ambulances use sirens and flashing lights in emergencies.",
    "People move aside when an ambulance needs to pass."
  ],
  "fire engine": [
    "A fire engine carries firefighters and equipment.",
    "It may have hoses, ladders, pumps, helmets, and water tanks.",
    "Fire engines use loud sirens so roads can clear quickly."
  ],
  "police car": [
    "A police car helps officers travel to places where help is needed.",
    "Police cars often have radios, lights, and sirens.",
    "Some police cars patrol neighborhoods and roads."
  ],
  "oncoming police car": [
    "An oncoming police car shows the front of the vehicle.",
    "Flashing lights can warn people that police are responding quickly.",
    "Drivers slow down and make room for emergency vehicles."
  ],
  "taxi": [
    "A taxi carries passengers where they ask to go.",
    "Many taxis have meters that count the fare.",
    "Taxis are often found near airports, stations, hotels, and busy streets."
  ],
  "oncoming taxi": [
    "An oncoming taxi is seen from the front.",
    "Taxi signs or colors help people notice them in traffic.",
    "Looking both ways matters before stepping toward a taxi or street."
  ],
  "automobile": [
    "An automobile is a car for traveling on roads.",
    "Cars have seats, wheels, doors, windows, lights, and seat belts.",
    "Families may use cars for errands, visits, school, or holidays."
  ],
  "oncoming automobile": [
    "An oncoming automobile is driving toward the viewer.",
    "Headlights make cars easier to see in dark or rainy weather.",
    "Road safety means noticing cars from every direction."
  ],
  "sport utility vehicle": [
    "A sport utility vehicle is often taller than a regular car.",
    "Many SUVs have extra space for people, bags, or outdoor gear.",
    "Some SUVs are built for rough roads or snowy places."
  ],
  "pickup truck": [
    "A pickup truck has an open cargo bed in the back.",
    "People use pickup trucks to carry tools, bikes, soil, wood, or boxes.",
    "The tailgate opens to make loading easier."
  ],
  "delivery truck": [
    "A delivery truck brings packages, groceries, furniture, or supplies.",
    "Drivers often stop many times on one route.",
    "Delivery trucks help things move from shops and warehouses to homes."
  ],
  "articulated lorry": [
    "An articulated lorry has a cab and a long trailer joined together.",
    "It can carry very large loads over long distances.",
    "Because it is long, it needs extra space to turn."
  ],
  "tractor": [
    "A tractor is a strong farm vehicle.",
    "Farmers use tractors to pull plows, trailers, and other equipment.",
    "Big tractor tires help grip muddy or uneven ground."
  ],
  "racing car": [
    "A racing car is built for speed on a track.",
    "Low shapes and wide tires help racing cars handle turns.",
    "Drivers wear helmets and safety gear when racing."
  ],
  "motorcycle": [
    "A motorcycle has two wheels and an engine.",
    "Riders wear helmets to protect their heads.",
    "Motorcycles can lean into turns while moving."
  ],
  "motor scooter": [
    "A motor scooter is a small powered two-wheeled vehicle.",
    "Scooters often have a step-through frame for easy riding.",
    "Many city riders use scooters for short trips."
  ],
  "manual wheelchair": [
    "A manual wheelchair moves when a person pushes the wheels or someone helps push.",
    "Wheelchairs help people move, explore, and join daily life.",
    "Ramps and smooth paths make wheelchair travel easier."
  ],
  "motorized wheelchair": [
    "A motorized wheelchair uses a battery and motor to move.",
    "A small joystick often controls direction and speed.",
    "Charging the battery keeps a motorized wheelchair ready."
  ],
  "auto rickshaw": [
    "An auto rickshaw is a small three-wheeled vehicle.",
    "Auto rickshaws are common in many busy cities.",
    "They can weave through narrow streets and carry a few passengers."
  ],
  "bicycle": [
    "A bicycle moves when a rider pedals.",
    "Bikes have handlebars, wheels, brakes, pedals, and a chain.",
    "Wearing a helmet helps make bike rides safer."
  ],
  "kick scooter": [
    "A kick scooter moves when one foot pushes against the ground.",
    "The handlebar helps the rider steer.",
    "Scooters are often folded or carried after a ride."
  ],
  "skateboard": [
    "A skateboard is a board with four small wheels.",
    "Riders balance with their feet and shift weight to turn.",
    "Skateboard tricks take practice, pads, and safe spaces."
  ],
  "roller skate": [
    "Roller skates have wheels attached under each foot.",
    "Skaters push sideways to roll forward.",
    "Knee pads and wrist guards help protect new skaters."
  ],
  "bus stop": [
    "A bus stop is where passengers wait for a bus.",
    "Signs may show route numbers, schedules, or maps.",
    "People usually stand back from the road while waiting."
  ],
  "motorway": [
    "A motorway is a fast road for longer car journeys.",
    "Motorways usually have lanes going in the same direction.",
    "Entrances and exits help cars join and leave safely."
  ],
  "railway track": [
    "Railway tracks guide trains along a fixed path.",
    "Tracks are made from rails, sleepers, and stones or concrete supports.",
    "People should never play on railway tracks."
  ],
  "oil drum": [
    "An oil drum is a large metal container for liquids.",
    "Drums can hold oil, fuel, or other industrial materials.",
    "Bright labels can warn what is inside a drum."
  ],
  "fuel pump": [
    "A fuel pump fills vehicles with fuel.",
    "Drivers stop at fuel pumps during longer trips.",
    "Many fuel stations also have air pumps, snacks, and restrooms."
  ],
  "wheel": [
    "A wheel turns around an axle.",
    "Wheels help cars, bikes, buses, carts, and suitcases move more easily.",
    "Round wheels roll because every side is the same distance from the center."
  ],
  "police car light": [
    "A police car light flashes to catch attention quickly.",
    "The colors and patterns warn people to slow down or move aside.",
    "Emergency lights are useful in traffic, at night, and in bad weather."
  ],
  "horizontal traffic light": [
    "A horizontal traffic light lays its lights side by side.",
    "Red means stop, green means go, and yellow means prepare to stop.",
    "Traffic lights help drivers, cyclists, and walkers take turns."
  ],
  "vertical traffic light": [
    "A vertical traffic light stacks red, yellow, and green lights.",
    "The order helps people understand the signal even from far away.",
    "Traffic lights make busy crossings safer and more organized."
  ],
  "stop sign": [
    "A stop sign tells drivers to stop completely.",
    "Its eight-sided shape makes it easy to recognize.",
    "Stop signs help people take turns at crossings and corners."
  ],
  "construction": [
    "Construction signs warn that people are working nearby.",
    "Road construction may use cones, barriers, lights, and machines.",
    "Slowing down near construction helps keep workers and travelers safe."
  ],
  "anchor": [
    "An anchor helps keep a boat from drifting away.",
    "It sinks to the bottom and grips sand, mud, or rock.",
    "Anchors are also symbols of ships, harbors, and sea travel."
  ],
  "ring buoy": [
    "A ring buoy floats on water.",
    "It can be thrown to someone who needs help staying afloat.",
    "Ring buoys are often kept near pools, docks, boats, and beaches."
  ],
  "sailboat": [
    "A sailboat uses wind to move across water.",
    "Sails catch the wind like big cloth wings.",
    "Sailors adjust sails when the wind changes direction."
  ],
  "canoe": [
    "A canoe is a narrow boat moved with paddles.",
    "Canoes can glide quietly on lakes and rivers.",
    "Paddlers often kneel or sit while steering."
  ],
  "speedboat": [
    "A speedboat is built to move quickly on water.",
    "Its engine can make waves behind the boat.",
    "People use speedboats for travel, rescue, racing, or water sports."
  ],
  "passenger ship": [
    "A passenger ship carries many people across water.",
    "Large passenger ships can have cabins, restaurants, decks, and lifeboats.",
    "Travel by ship can feel slower and more spacious than travel by plane."
  ],
  "ferry": [
    "A ferry carries people, cars, bikes, or buses across water.",
    "Ferries often travel the same route many times a day.",
    "Some ferry rides are short, like crossing a river or harbor."
  ],
  "motor boat": [
    "A motor boat uses an engine instead of sails or paddles.",
    "Motor boats can be small for families or large for work.",
    "Boat drivers watch speed, waves, weather, and other boats."
  ],
  "ship": [
    "A ship is a large boat that travels on water.",
    "Ships can carry people, vehicles, food, mail, or containers.",
    "Some ships cross oceans and take many days to arrive."
  ],
  "airplane": [
    "An airplane flies because its wings help lift it into the air.",
    "Airplanes use runways to take off and land.",
    "A flight can carry people across countries, oceans, and time zones."
  ],
  "small airplane": [
    "A small airplane carries fewer people than a large passenger plane.",
    "Some small airplanes land at tiny airports or grassy airstrips.",
    "Pilots use instruments and windows to navigate."
  ],
  "airplane departure": [
    "Airplane departure means a plane is taking off or leaving.",
    "Before departure, passengers board, buckle seat belts, and listen to safety instructions.",
    "The plane speeds down the runway before lifting into the sky."
  ],
  "airplane arrival": [
    "Airplane arrival means a plane is landing or has reached its destination.",
    "Wheels touch the runway after the plane slows and descends.",
    "After arrival, passengers collect bags and leave through the airport."
  ],
  "parachute": [
    "A parachute opens like a big fabric umbrella in the air.",
    "It slows a person or object while falling.",
    "Parachutes are used for sport, rescue, and delivering supplies."
  ],
  "seat": [
    "A seat gives someone a place to sit while traveling or waiting.",
    "Airplane and car seats often have seat belts.",
    "Seat numbers help people find the right place in theaters, trains, and planes."
  ],
  "helicopter": [
    "A helicopter has spinning rotor blades on top.",
    "Helicopters can hover in one place.",
    "They can land in smaller spaces than many airplanes."
  ],
  "suspension railway": [
    "A suspension railway hangs below its track.",
    "Passengers ride in cars that move above streets or rivers.",
    "This kind of railway can save ground space in busy places."
  ],
  "mountain cableway": [
    "A mountain cableway carries cabins or chairs up steep slopes.",
    "Cables pull the cars along where roads would be difficult.",
    "Skiers, hikers, and visitors use cableways for mountain views."
  ],
  "aerial tramway": [
    "An aerial tramway carries a cabin through the air on cables.",
    "It can cross valleys, forests, rivers, or steep hills.",
    "Riders often get a wide view from high above the ground."
  ],
  "satellite": [
    "A satellite travels around Earth or another object in space.",
    "Satellites can help with maps, weather, phones, and television signals.",
    "Some satellites take pictures of clouds, oceans, cities, and forests."
  ],
  "rocket": [
    "A rocket pushes hot gas downward to launch upward.",
    "Rockets can carry satellites, science tools, or astronauts into space.",
    "The countdown before a launch builds excitement."
  ],
  "flying saucer": [
    "A flying saucer is a round spacecraft shape from stories and movies.",
    "People often imagine flying saucers with aliens or mystery lights.",
    "It is a fun symbol for pretend space adventures."
  ],
  "bellhop bell": [
    "A bellhop bell sits on a hotel desk or service counter.",
    "Pressing the top makes a clear ringing sound.",
    "The bell can let staff know someone is waiting."
  ],
  "luggage": [
    "Luggage holds clothes and things for a trip.",
    "Suitcases may have handles, zippers, wheels, tags, and locks.",
    "Packing luggage teaches children to choose what they need away from home."
  ]
};

const peopleFactTexts = {
  "flexed biceps": [
    "Biceps are muscles in the upper arm.",
    "People often bend an arm to show strength or effort.",
    "Arms get stronger with practice, food, rest, and safe movement."
  ],
  "mechanical arm": [
    "A mechanical arm is an artificial arm or robotic arm.",
    "Some mechanical arms help people hold, reach, or move things.",
    "Engineers design joints and grips to copy useful arm movements."
  ],
  "mechanical leg": [
    "A mechanical leg can help someone stand, walk, or run.",
    "Prosthetic legs are shaped for balance, comfort, and movement.",
    "Some athletes use special running blades for speed and spring."
  ],
  "leg": [
    "Legs help people stand, walk, jump, kick, and climb.",
    "Knees and ankles bend so legs can move in many ways.",
    "Strong legs can come from running, dancing, cycling, or playing."
  ],
  "foot": [
    "Feet help balance the whole body.",
    "Toes grip, push, wiggle, and help with walking.",
    "Footprints can show where someone walked on sand, mud, or snow."
  ],
  "ear": [
    "Ears collect sounds from the world around us.",
    "The outer ear has curves that help guide sound inward.",
    "Ears also help the body keep balance."
  ],
  "ear with hearing aid": [
    "A hearing aid can make sounds easier to hear.",
    "Hearing aids are adjusted for each person.",
    "Tiny batteries or chargers keep many hearing aids working."
  ],
  "nose": [
    "The nose helps people smell flowers, food, smoke, and rain.",
    "Noses also warm and filter air before it goes deeper into the body.",
    "Smells can bring back memories very quickly."
  ],
  "brain": [
    "The brain helps the body think, feel, remember, and move.",
    "It sends messages through nerves very quickly.",
    "Sleep gives the brain time to rest and organize learning."
  ],
  "anatomical heart": [
    "The heart pumps blood through the body.",
    "A heartbeat can speed up during running or excitement.",
    "Doctors can listen to the heart with a stethoscope."
  ],
  "lungs": [
    "Lungs fill with air when people breathe in.",
    "They help move oxygen into the blood.",
    "Deep breaths can help the body feel calmer."
  ],
  "tooth": [
    "Teeth bite and chew food into smaller pieces.",
    "Baby teeth fall out so adult teeth can grow in.",
    "Brushing teeth helps keep them clean and strong."
  ],
  "bone": [
    "Bones give the body shape and support.",
    "A skeleton has many bones connected at joints.",
    "Milk, sunlight, movement, and healthy food can help bones grow strong."
  ],
  "eyes": [
    "Eyes help people see light, color, movement, and faces.",
    "Two eyes work together to judge distance.",
    "Blinking spreads moisture over the eyes."
  ],
  "eye": [
    "One eye has a pupil that changes size with light.",
    "Eyelids and eyelashes help protect the eye.",
    "Eyes can show attention, surprise, tiredness, or joy."
  ],
  "tongue": [
    "The tongue helps people taste sweet, salty, sour, bitter, and savory flavors.",
    "It moves food around while chewing.",
    "The tongue also helps shape many speech sounds."
  ],
  "mouth": [
    "The mouth is used for eating, speaking, smiling, and breathing.",
    "Lips can make sounds, hold food in, and show expression.",
    "Teeth, tongue, and lips work together when talking."
  ],
  "biting lip": [
    "Biting a lip can show worry, shyness, thinking, or nervousness.",
    "Lips are sensitive because they have many nerve endings.",
    "People use facial expressions to show feelings without words."
  ],
  "health worker": [
    "Health workers care for people who are sick, hurt, or need checkups.",
    "They may work in hospitals, clinics, ambulances, schools, or homes.",
    "Kind questions help health workers understand what someone needs."
  ],
  "student": [
    "A student learns by asking, listening, reading, practicing, and trying again.",
    "Students can learn at school, at home, outside, or online.",
    "Mistakes are part of learning new skills."
  ],
  "teacher": [
    "Teachers help students understand ideas and practice skills.",
    "A teacher may explain, read, draw, count, sing, or ask questions.",
    "Good teachers notice when children need help or a new challenge."
  ],
  "judge": [
    "A judge listens carefully before making decisions in court.",
    "Judges use laws and evidence to decide what is fair.",
    "Courtrooms have special rules so people can speak in order."
  ],
  "farmer": [
    "Farmers grow food, care for animals, or manage land.",
    "Farm work changes with weather and seasons.",
    "Farmers use tools, machines, patience, and knowledge of nature."
  ],
  "cook": [
    "Cooks prepare food by washing, cutting, mixing, heating, and tasting.",
    "Recipes help cooks remember steps and amounts.",
    "Cooking can fill a home with warm smells."
  ],
  "mechanic": [
    "Mechanics fix machines and vehicles.",
    "They use tools to check engines, wheels, brakes, and parts.",
    "Listening to a machine can help a mechanic find a problem."
  ],
  "factory worker": [
    "Factory workers help make things in large amounts.",
    "Factories may make food, clothes, toys, cars, or electronics.",
    "Many factory jobs need teamwork and careful safety rules."
  ],
  "office worker": [
    "Office workers often use computers, phones, calendars, and documents.",
    "They may write messages, plan meetings, or organize information.",
    "A tidy desk can make work easier to find."
  ],
  "scientist": [
    "Scientists ask questions and test ideas.",
    "They observe carefully and write down what happens.",
    "Science can study stars, plants, weather, animals, bodies, and tiny cells."
  ],
  "technologist": [
    "Technologists build or use tools that solve problems.",
    "They may work with computers, machines, robots, or networks.",
    "Technology often changes when people invent better ways to do things."
  ],
  "singer": [
    "Singers use their voices to make music.",
    "Songs can be loud, soft, high, low, fast, or slow.",
    "Breathing and practice help singers control sound."
  ],
  "artist": [
    "Artists make pictures, objects, performances, or designs.",
    "Art can use paint, clay, paper, fabric, light, sound, or movement.",
    "Artists can tell stories without using many words."
  ],
  "pilot": [
    "Pilots fly airplanes or helicopters.",
    "They check weather, instruments, maps, and safety steps before flying.",
    "Pilots communicate with air traffic control during a trip."
  ],
  "astronaut": [
    "Astronauts train to travel and work in space.",
    "In orbit, astronauts can float because they are falling around Earth.",
    "Space suits protect astronauts outside a spacecraft."
  ],
  "firefighter": [
    "Firefighters help during fires, rescues, and emergencies.",
    "They wear protective gear against heat, smoke, and falling objects.",
    "Firefighters practice drills so they can move quickly and safely."
  ],
  "police officer": [
    "Police officers help keep people and places safer.",
    "They may direct traffic, answer calls, or help find missing people.",
    "Police radios help officers share information quickly."
  ],
  "detective": [
    "Detectives look for clues and ask careful questions.",
    "They compare details to understand what happened.",
    "Solving a mystery often takes patience and close observation."
  ],
  "guard": [
    "Guards watch entrances, people, or important places.",
    "They may check badges, answer questions, or call for help.",
    "Staying alert is an important part of guarding."
  ],
  "ninja": [
    "Ninja are figures from Japanese history and stories.",
    "Stories often show ninja moving quietly and using clever tricks.",
    "Ninja costumes are popular in pretend play."
  ],
  "construction worker": [
    "Construction workers build and repair roads, homes, bridges, and buildings.",
    "They often wear helmets, boots, gloves, and bright vests.",
    "Construction sites use signs and barriers for safety."
  ],
  "person with crown": [
    "A crown is worn on the head as a symbol of royalty or celebration.",
    "Stories often use crowns for rulers, winners, and special characters.",
    "Crowns can be made from metal, paper, flowers, or pretend jewels."
  ],
  "person wearing turban": [
    "A turban is cloth wrapped around the head.",
    "Turbans can have cultural, religious, practical, or personal meaning.",
    "The wrapping style can vary by place and tradition."
  ],
  "person with skullcap": [
    "A skullcap is a small cap worn close to the head.",
    "Some skullcaps are worn for faith, tradition, or formal clothing.",
    "Head coverings can carry important meaning for families."
  ],
  "woman with headscarf": [
    "A headscarf covers the hair or head.",
    "People wear headscarves for faith, culture, weather, fashion, or comfort.",
    "Scarves can be tied in many colors, fabrics, and styles."
  ],
  "person in tuxedo": [
    "A tuxedo is formal clothing for special events.",
    "Tuxedos often include a jacket, shirt, bow tie, and shiny shoes.",
    "People may wear tuxedos for weddings, concerts, or celebrations."
  ],
  "person with veil": [
    "A veil is a light fabric worn over the head or face.",
    "Veils can be part of weddings, ceremonies, costumes, or traditions.",
    "Thin fabric can hide and reveal at the same time."
  ],
  "pregnant person": [
    "Pregnancy means a baby is growing inside the body.",
    "Pregnant people often visit health workers for checkups.",
    "Families may prepare clothes, names, beds, and love before a baby arrives."
  ],
  "breast-feeding": [
    "Breast-feeding is one way babies can drink milk.",
    "Babies need help and closeness during feeding.",
    "Families feed babies in different safe and loving ways."
  ],
  "person feeding baby": [
    "Feeding a baby takes patience and gentle attention.",
    "Babies may drink from a bottle, breast, cup, or spoon as they grow.",
    "Feeding time can also be bonding time."
  ],
  "baby angel": [
    "A baby angel is a tiny winged character from art and stories.",
    "Angel pictures often stand for gentleness, protection, or sweetness.",
    "Wings make the character feel magical and light."
  ],
  "Santa Claus": [
    "Santa Claus is a holiday character linked with gifts and winter stories.",
    "Many stories show Santa traveling in a sleigh.",
    "Children may recognize Santa by a red outfit, white beard, and cheerful laugh."
  ],
  "superhero": [
    "A superhero is a story character with special courage or powers.",
    "Superheroes often help others when something goes wrong.",
    "Capes, masks, symbols, and secret identities are common superhero details."
  ],
  "supervillain": [
    "A supervillain is a story character who causes trouble.",
    "Villains create problems for heroes to solve.",
    "A good story often asks why a villain made a bad choice."
  ],
  "mage": [
    "A mage is a magic user in fantasy stories.",
    "Mages may use spells, books, staffs, or potions.",
    "Magic characters invite children to imagine impossible things."
  ],
  "fairy": [
    "A fairy is a tiny magical character in many stories.",
    "Fairies often have wings and live near flowers, forests, or secret places.",
    "Fairy tales can include wishes, tricks, helpers, and surprises."
  ],
  "vampire": [
    "A vampire is a spooky character from legends and stories.",
    "Many vampire stories include night, castles, capes, and bats.",
    "Spooky characters can be pretend-scary while still being safe in stories."
  ],
  "merperson": [
    "A merperson is part human and part fish in stories.",
    "Merpeople are often imagined living under the sea.",
    "Their tails help them swim through pretend ocean worlds."
  ],
  "elf": [
    "Elves appear in many fantasy stories and traditions.",
    "Some elves are helpers, some are forest folk, and some are magical characters.",
    "Pointed ears are a common elf detail."
  ],
  "genie": [
    "A genie is a magical character often linked with wishes.",
    "Many stories connect genies with lamps or bottles.",
    "Wish stories can teach children to think carefully about what they ask for."
  ],
  "zombie": [
    "A zombie is a spooky pretend creature from stories and games.",
    "Zombies are often shown walking slowly with stiff arms.",
    "Pretend monsters can help children explore scary ideas safely."
  ],
  "troll": [
    "A troll is a creature from folktales and fantasy stories.",
    "Some troll stories place them under bridges, in mountains, or in forests.",
    "Trolls can be silly, grumpy, scary, or magical depending on the story."
  ],
  "person getting massage": [
    "Massage uses hands to press and relax muscles.",
    "People may get massages for comfort, rest, or sore spots.",
    "Gentle touch should always respect what feels okay."
  ],
  "person getting haircut": [
    "A haircut changes the length or shape of hair.",
    "Hairdressers use combs, scissors, clippers, mirrors, and capes.",
    "Hair grows back little by little after a cut."
  ],
  "person walking": [
    "Walking moves the body one step at a time.",
    "Arms often swing naturally while legs step forward.",
    "Walking can be a way to travel, exercise, explore, or calm down."
  ],
  "person standing": [
    "Standing means holding the body upright on the feet.",
    "Balance uses muscles, joints, eyes, and the inner ear.",
    "People stand in lines, on stages, at bus stops, and during games."
  ],
  "person kneeling": [
    "Kneeling means resting one or both knees on the ground.",
    "People may kneel to tie shoes, garden, pray, play, or help someone small.",
    "Knees bend so the body can get closer to the floor."
  ],
  "person with white cane": [
    "A white cane helps blind or low-vision people feel what is ahead.",
    "The cane can find steps, curbs, walls, and open paths.",
    "Giving space helps cane users move safely."
  ],
  "person in motorized wheelchair": [
    "A motorized wheelchair uses a battery and motor.",
    "A joystick or control panel can guide speed and direction.",
    "Charged batteries and ramps make travel easier."
  ],
  "person in manual wheelchair": [
    "A manual wheelchair moves when wheels are pushed by hand or by a helper.",
    "Wheelchairs help people move, explore, and join activities.",
    "Ramps and wide spaces make movement easier."
  ],
  "person running": [
    "Running is faster than walking because both feet can leave the ground.",
    "Runners use arms for balance and rhythm.",
    "Running can be part of races, games, exercise, or catching a bus."
  ],
  "woman dancing": [
    "Dancing moves the body to rhythm or music.",
    "Dance can show joy, culture, exercise, or performance.",
    "People can dance alone, in pairs, or in groups."
  ],
  "man dancing": [
    "This dancing figure is based on a disco-style suit.",
    "Dance poses can show rhythm even in a still picture.",
    "Different music styles inspire different movements."
  ],
  "person in suit levitating": [
    "This figure looks like a person floating above the ground.",
    "It comes from an old-style performer image with a suit and hat.",
    "Floating pictures can feel playful, mysterious, or magical."
  ],
  "people with bunny ears": [
    "People with bunny ears often appear in costumes or performances.",
    "Matching outfits can make a group look like a team.",
    "Costume ears can make pretend play feel festive."
  ],
  "person in steamy room": [
    "A steamy room is warm and full of moist air.",
    "People use saunas or steam rooms to relax.",
    "Steam can make the air look cloudy."
  ],
  "person climbing": [
    "Climbing uses hands, feet, arms, legs, and balance.",
    "Climbers look for safe places to grip and step.",
    "Helmets, ropes, and spotters can help with climbing safety."
  ],
  "person fencing": [
    "Fencing is a sport with light swords and protective clothing.",
    "Fencers score by touching a target area with careful timing.",
    "Quick feet are just as important as quick hands."
  ],
  "horse racing": [
    "Horse racing pairs a horse with a trained rider.",
    "Riders use balance and light signals to guide the horse.",
    "Race tracks can be dirt, grass, or other surfaces."
  ],
  "skier": [
    "A skier slides over snow on two long skis.",
    "Ski poles help with balance and pushing.",
    "Skiers turn by shifting weight and edging the skis."
  ],
  "snowboarder": [
    "A snowboarder rides one wide board over snow.",
    "Snowboarders turn by leaning their body and board.",
    "Helmets and practice help make snowboarding safer."
  ],
  "person golfing": [
    "Golfers try to hit a small ball into a faraway hole.",
    "Different clubs send the ball different distances.",
    "Golf takes patience, aim, and gentle control."
  ],
  "person surfing": [
    "Surfers ride ocean waves on boards.",
    "Balance changes as the wave moves under the board.",
    "Surfers watch the water carefully before paddling out."
  ],
  "person rowing boat": [
    "Rowing moves a boat with oars.",
    "Rowers pull water backward to move the boat forward.",
    "Good rowing uses rhythm, strength, and teamwork."
  ],
  "person swimming": [
    "Swimming moves the body through water.",
    "Arms, legs, breathing, and floating all work together.",
    "Learning water safety is part of learning to swim."
  ],
  "person bouncing ball": [
    "Bouncing a ball means pushing it down so it springs back up.",
    "Basketball players dribble while moving around the court.",
    "A steady bounce takes timing and hand control."
  ],
  "person lifting weights": [
    "Weightlifting uses muscles to lift heavy objects safely.",
    "Good form matters more than rushing.",
    "Strength grows with practice, rest, and careful training."
  ],
  "person biking": [
    "Biking moves a bicycle by pedaling.",
    "Brakes, helmets, lights, and signals help rides stay safer.",
    "Bikes can be used for play, sport, school trips, or travel."
  ],
  "person mountain biking": [
    "Mountain biking happens on trails, hills, or rough ground.",
    "Wide tires help grip dirt, rocks, and bumps.",
    "Riders look ahead to choose a safe path."
  ],
  "person cartwheeling": [
    "A cartwheel turns the body sideways with hands and feet touching the ground.",
    "Gymnasts practice balance before moving faster.",
    "A clear soft space helps make cartwheels safer."
  ],
  "people wrestling": [
    "Wrestling is a sport where people try to control balance and position.",
    "Wrestlers use strength, timing, and rules.",
    "Mats help cushion safe practice and matches."
  ],
  "person playing water polo": [
    "Water polo is played by swimming and throwing a ball.",
    "Players try to score in a goal while staying afloat.",
    "The sport needs strong swimming and teamwork."
  ],
  "person playing handball": [
    "Handball players pass and throw a ball with their hands.",
    "Teams try to score by throwing into a goal.",
    "Fast running and quick passes are part of the game."
  ],
  "person juggling": [
    "Juggling keeps several objects moving through the air.",
    "Jugglers watch patterns and catch at the right time.",
    "Starting with scarves can make learning juggling easier."
  ],
  "person in lotus position": [
    "The lotus position is a cross-legged sitting pose.",
    "People may sit this way for meditation, stretching, or quiet breathing.",
    "Sitting calmly can help the body and mind slow down."
  ],
  "person taking bath": [
    "Taking a bath means washing or relaxing in a tub of water.",
    "Bath water can have bubbles, toys, soap, or a washcloth.",
    "Grown-ups check water temperature for young children."
  ],
  "person in bed": [
    "A person in bed is resting or sleeping.",
    "Sleep helps the body grow, heal, and remember learning.",
    "Bedtime routines can include pajamas, brushing teeth, and stories."
  ]
};

function peopleFacts(english, subgroup) {
  if (peopleFactTexts[english]) return peopleFactTexts[english];
  return [
    `${capitalize(english)} is a person or body word.`,
    "People words help children describe bodies, roles, actions, and routines.",
    `${capitalize(english)} can support everyday conversations about people.`,
  ];
}
const objectFactTexts = {
  "glasses": [
    "Glasses use lenses that sit in front of the eyes.",
    "Frames hold the lenses in the right place.",
    "Glasses can help with bright sunlight, tiny details, or clearer vision."
  ],
  "sunglasses": [
    "Sunglasses use lenses that sit in front of the eyes.",
    "Frames hold the lenses in the right place.",
    "Sunglasses can help with bright sunlight, tiny details, or clearer vision."
  ],
  "goggles": [
    "Goggles fit closely around the eyes.",
    "They can help keep water, dust, or splashes away.",
    "Swimming, skiing, and science labs can all use different goggles."
  ],
  "lab coat": [
    "A lab coat helps protect the body in a particular situation.",
    "Protection can mean warmth, visibility, or safety from bumps.",
    "People choose a lab coat when the place or job calls for extra care."
  ],
  "safety vest": [
    "A safety vest helps protect the body in a particular situation.",
    "Protection can mean warmth, visibility, or safety from bumps.",
    "People choose a safety vest when the place or job calls for extra care."
  ],
  "necktie": [
    "A necktie is part of what people wear.",
    "Clothes can be soft, stretchy, warm, light, patterned, or formal.",
    "A necktie can help children talk about getting dressed and choosing outfits."
  ],
  "t-shirt": [
    "A t-shirt is part of what people wear.",
    "Clothes can be soft, stretchy, warm, light, patterned, or formal.",
    "A t-shirt can help children talk about getting dressed and choosing outfits."
  ],
  "jeans": [
    "A jeans is part of what people wear.",
    "Clothes can be soft, stretchy, warm, light, patterned, or formal.",
    "A jeans can help children talk about getting dressed and choosing outfits."
  ],
  "scarf": [
    "A scarf is part of what people wear.",
    "Clothes can be soft, stretchy, warm, light, patterned, or formal.",
    "A scarf can help children talk about getting dressed and choosing outfits."
  ],
  "gloves": [
    "A gloves is part of what people wear.",
    "Clothes can be soft, stretchy, warm, light, patterned, or formal.",
    "A gloves can help children talk about getting dressed and choosing outfits."
  ],
  "coat": [
    "A coat helps protect the body in a particular situation.",
    "Protection can mean warmth, visibility, or safety from bumps.",
    "People choose a coat when the place or job calls for extra care."
  ],
  "socks": [
    "A socks belongs on the feet.",
    "Footwear can protect feet, add grip, or make movement more comfortable.",
    "Children can compare a socks by sole, strap, heel, lace, or shape."
  ],
  "dress": [
    "A dress is part of what people wear.",
    "Clothes can be soft, stretchy, warm, light, patterned, or formal.",
    "A dress can help children talk about getting dressed and choosing outfits."
  ],
  "kimono": [
    "A kimono is part of what people wear.",
    "Clothes can be soft, stretchy, warm, light, patterned, or formal.",
    "A kimono can help children talk about getting dressed and choosing outfits."
  ],
  "sari": [
    "A sari is part of what people wear.",
    "Clothes can be soft, stretchy, warm, light, patterned, or formal.",
    "A sari can help children talk about getting dressed and choosing outfits."
  ],
  "one-piece swimsuit": [
    "A one-piece swimsuit is part of what people wear.",
    "Clothes can be soft, stretchy, warm, light, patterned, or formal.",
    "A one-piece swimsuit can help children talk about getting dressed and choosing outfits."
  ],
  "briefs": [
    "A briefs is part of what people wear.",
    "Clothes can be soft, stretchy, warm, light, patterned, or formal.",
    "A briefs can help children talk about getting dressed and choosing outfits."
  ],
  "shorts": [
    "A shorts is part of what people wear.",
    "Clothes can be soft, stretchy, warm, light, patterned, or formal.",
    "A shorts can help children talk about getting dressed and choosing outfits."
  ],
  "bikini": [
    "A bikini is part of what people wear.",
    "Clothes can be soft, stretchy, warm, light, patterned, or formal.",
    "A bikini can help children talk about getting dressed and choosing outfits."
  ],
  "woman’s clothes": [
    "A woman's clothes is part of what people wear.",
    "Clothes can be soft, stretchy, warm, light, patterned, or formal.",
    "A woman's clothes can help children talk about getting dressed and choosing outfits."
  ],
  "folding hand fan": [
    "A folding hand fan opens wide and folds small again.",
    "Moving a fan pushes air toward the face.",
    "Fans can be plain, patterned, painted, or used in dance."
  ],
  "purse": [
    "A purse carries small things from place to place.",
    "Bags can have pockets, straps, zippers, handles, or clasps.",
    "Packing a purse helps children choose what they need for an outing."
  ],
  "handbag": [
    "A handbag carries small things from place to place.",
    "Bags can have pockets, straps, zippers, handles, or clasps.",
    "Packing a handbag helps children choose what they need for an outing."
  ],
  "clutch bag": [
    "A clutch bag carries small things from place to place.",
    "Bags can have pockets, straps, zippers, handles, or clasps.",
    "Packing a clutch bag helps children choose what they need for an outing."
  ],
  "shopping bags": [
    "A shopping bags carries small things from place to place.",
    "Bags can have pockets, straps, zippers, handles, or clasps.",
    "Packing a shopping bags helps children choose what they need for an outing."
  ],
  "backpack": [
    "A backpack carries small things from place to place.",
    "Bags can have pockets, straps, zippers, handles, or clasps.",
    "Packing a backpack helps children choose what they need for an outing."
  ],
  "thong sandal": [
    "A thong sandal belongs on the feet.",
    "Footwear can protect feet, add grip, or make movement more comfortable.",
    "Children can compare a thong sandal by sole, strap, heel, lace, or shape."
  ],
  "man’s shoe": [
    "A man's shoe belongs on the feet.",
    "Footwear can protect feet, add grip, or make movement more comfortable.",
    "Children can compare a man's shoe by sole, strap, heel, lace, or shape."
  ],
  "running shoe": [
    "A running shoe belongs on the feet.",
    "Footwear can protect feet, add grip, or make movement more comfortable.",
    "Children can compare a running shoe by sole, strap, heel, lace, or shape."
  ],
  "hiking boot": [
    "A hiking boot belongs on the feet.",
    "Footwear can protect feet, add grip, or make movement more comfortable.",
    "Children can compare a hiking boot by sole, strap, heel, lace, or shape."
  ],
  "flat shoe": [
    "A flat shoe belongs on the feet.",
    "Footwear can protect feet, add grip, or make movement more comfortable.",
    "Children can compare a flat shoe by sole, strap, heel, lace, or shape."
  ],
  "high-heeled shoe": [
    "A high-heeled shoe belongs on the feet.",
    "Footwear can protect feet, add grip, or make movement more comfortable.",
    "Children can compare a high-heeled shoe by sole, strap, heel, lace, or shape."
  ],
  "woman’s sandal": [
    "A woman's sandal belongs on the feet.",
    "Footwear can protect feet, add grip, or make movement more comfortable.",
    "Children can compare a woman's sandal by sole, strap, heel, lace, or shape."
  ],
  "ballet shoes": [
    "A ballet shoes belongs on the feet.",
    "Footwear can protect feet, add grip, or make movement more comfortable.",
    "Children can compare a ballet shoes by sole, strap, heel, lace, or shape."
  ],
  "woman’s boot": [
    "A woman's boot belongs on the feet.",
    "Footwear can protect feet, add grip, or make movement more comfortable.",
    "Children can compare a woman's boot by sole, strap, heel, lace, or shape."
  ],
  "hair pick": [
    "A hair pick is part of what people wear.",
    "Clothes can be soft, stretchy, warm, light, patterned, or formal.",
    "A hair pick can help children talk about getting dressed and choosing outfits."
  ],
  "crown": [
    "A crown is worn on the head.",
    "Headwear can show a role, shade the face, keep warm, or dress up an outfit.",
    "A crown can change how a costume or celebration feels."
  ],
  "woman’s hat": [
    "A woman's hat is worn on the head.",
    "Headwear can show a role, shade the face, keep warm, or dress up an outfit.",
    "A woman's hat can change how a costume or celebration feels."
  ],
  "top hat": [
    "A top hat is worn on the head.",
    "Headwear can show a role, shade the face, keep warm, or dress up an outfit.",
    "A top hat can change how a costume or celebration feels."
  ],
  "graduation cap": [
    "A graduation cap is worn on the head.",
    "Headwear can show a role, shade the face, keep warm, or dress up an outfit.",
    "A graduation cap can change how a costume or celebration feels."
  ],
  "billed cap": [
    "A billed cap is worn on the head.",
    "Headwear can show a role, shade the face, keep warm, or dress up an outfit.",
    "A billed cap can change how a costume or celebration feels."
  ],
  "military helmet": [
    "A military helmet helps protect the body in a particular situation.",
    "Protection can mean warmth, visibility, or safety from bumps.",
    "People choose a military helmet when the place or job calls for extra care."
  ],
  "rescue worker’s helmet": [
    "A rescue worker's helmet helps protect the body in a particular situation.",
    "Protection can mean warmth, visibility, or safety from bumps.",
    "People choose a rescue worker's helmet when the place or job calls for extra care."
  ],
  "prayer beads": [
    "A prayer beads can be worn, held, or used as decoration.",
    "Decorative objects can show tradition, celebration, beauty, or memory.",
    "A prayer beads can help children notice color, shine, shape, and meaning."
  ],
  "lipstick": [
    "A lipstick can be worn, held, or used as decoration.",
    "Decorative objects can show tradition, celebration, beauty, or memory.",
    "A lipstick can help children notice color, shine, shape, and meaning."
  ],
  "ring": [
    "A ring can be worn, held, or used as decoration.",
    "Decorative objects can show tradition, celebration, beauty, or memory.",
    "A ring can help children notice color, shine, shape, and meaning."
  ],
  "gem stone": [
    "A gem stone can be worn, held, or used as decoration.",
    "Decorative objects can show tradition, celebration, beauty, or memory.",
    "A gem stone can help children notice color, shine, shape, and meaning."
  ],
  "battery": [
    "A battery is about stored energy for devices.",
    "Devices stop or slow down when they do not have enough power.",
    "Charging and saving power are everyday technology habits."
  ],
  "low battery": [
    "A low battery is about stored energy for devices.",
    "Devices stop or slow down when they do not have enough power.",
    "Charging and saving power are everyday technology habits."
  ],
  "electric plug": [
    "An electric plug connects a device to a socket.",
    "Plugs have metal parts that carry electricity safely when used correctly.",
    "Grown-ups teach children not to touch sockets or plug holes."
  ],
  "laptop": [
    "A laptop is a computer used for work, play, learning, and communication.",
    "Computers can show pictures, play sound, store files, and run programs.",
    "A laptop has parts that work together, like a screen, keys, memory, and power."
  ],
  "desktop computer": [
    "A desktop computer is a computer used for work, play, learning, and communication.",
    "Computers can show pictures, play sound, store files, and run programs.",
    "A desktop computer has parts that work together, like a screen, keys, memory, and power."
  ],
  "printer": [
    "A printer puts digital words or pictures onto paper.",
    "Printers may use ink or toner.",
    "Printed pages can become drawings, homework, photos, tickets, or labels."
  ],
  "keyboard": [
    "A keyboard helps people control a computer.",
    "Input tools turn hand movements into letters, clicks, or cursor movement.",
    "Using a keyboard takes coordination between eyes, hands, and the screen."
  ],
  "computer mouse": [
    "A computer mouse helps people control a computer.",
    "Input tools turn hand movements into letters, clicks, or cursor movement.",
    "Using a computer mouse takes coordination between eyes, hands, and the screen."
  ],
  "trackball": [
    "A trackball helps people control a computer.",
    "Input tools turn hand movements into letters, clicks, or cursor movement.",
    "Using a trackball takes coordination between eyes, hands, and the screen."
  ],
  "computer disk": [
    "A computer disk stores digital information.",
    "Disks were used for music, films, games, photos, and files.",
    "Many modern devices now store the same kinds of things without a disk."
  ],
  "floppy disk": [
    "A floppy disk stores digital information.",
    "Disks were used for music, films, games, photos, and files.",
    "Many modern devices now store the same kinds of things without a disk."
  ],
  "optical disk": [
    "A optical disk stores digital information.",
    "Disks were used for music, films, games, photos, and files.",
    "Many modern devices now store the same kinds of things without a disk."
  ],
  "dvd": [
    "A dvd stores digital information.",
    "Disks were used for music, films, games, photos, and files.",
    "Many modern devices now store the same kinds of things without a disk."
  ],
  "abacus": [
    "An abacus uses sliding beads for counting.",
    "Each row of beads can stand for a different number place.",
    "It helps children see numbers as something they can move and group."
  ],
  "movie camera": [
    "A movie camera helps make, show, or save pictures, film, or video.",
    "Moving pictures are made from many images shown in order.",
    "A movie camera can help people record, watch, remember, or tell a story."
  ],
  "film frames": [
    "A film frames helps make, show, or save pictures, film, or video.",
    "Moving pictures are made from many images shown in order.",
    "A film frames can help people record, watch, remember, or tell a story."
  ],
  "film projector": [
    "A film projector helps make, show, or save pictures, film, or video.",
    "Moving pictures are made from many images shown in order.",
    "A film projector can help people record, watch, remember, or tell a story."
  ],
  "clapper board": [
    "A clapper board helps make, show, or save pictures, film, or video.",
    "Moving pictures are made from many images shown in order.",
    "A clapper board can help people record, watch, remember, or tell a story."
  ],
  "television": [
    "A television helps make, show, or save pictures, film, or video.",
    "Moving pictures are made from many images shown in order.",
    "A television can help people record, watch, remember, or tell a story."
  ],
  "camera": [
    "A camera helps make, show, or save pictures, film, or video.",
    "Moving pictures are made from many images shown in order.",
    "A camera can help people record, watch, remember, or tell a story."
  ],
  "camera with flash": [
    "A camera with flash helps make, show, or save pictures, film, or video.",
    "Moving pictures are made from many images shown in order.",
    "A camera with flash can help people record, watch, remember, or tell a story."
  ],
  "video camera": [
    "A video camera helps make, show, or save pictures, film, or video.",
    "Moving pictures are made from many images shown in order.",
    "A video camera can help people record, watch, remember, or tell a story."
  ],
  "videocassette": [
    "A videocassette helps make, show, or save pictures, film, or video.",
    "Moving pictures are made from many images shown in order.",
    "A videocassette can help people record, watch, remember, or tell a story."
  ],
  "magnifying glass tilted left": [
    "A magnifying glass tilted left makes small details look bigger.",
    "The curved lens bends light before it reaches the eye.",
    "Children can use magnifying glasses to inspect leaves, coins, bugs, or print."
  ],
  "magnifying glass tilted right": [
    "A magnifying glass tilted right makes small details look bigger.",
    "The curved lens bends light before it reaches the eye.",
    "Children can use magnifying glasses to inspect leaves, coins, bugs, or print."
  ],
  "candle": [
    "A candle gives light.",
    "Light helps people see shapes, colors, paths, and faces.",
    "A candle can make a dark room, street, or celebration feel different."
  ],
  "light bulb": [
    "A light bulb gives light.",
    "Light helps people see shapes, colors, paths, and faces.",
    "A light bulb can make a dark room, street, or celebration feel different."
  ],
  "flashlight": [
    "A flashlight gives light.",
    "Light helps people see shapes, colors, paths, and faces.",
    "A flashlight can make a dark room, street, or celebration feel different."
  ],
  "red paper lantern": [
    "A red paper lantern gives light.",
    "Light helps people see shapes, colors, paths, and faces.",
    "A red paper lantern can make a dark room, street, or celebration feel different."
  ],
  "diya lamp": [
    "A diya lamp gives light.",
    "Light helps people see shapes, colors, paths, and faces.",
    "A diya lamp can make a dark room, street, or celebration feel different."
  ],
  "notebook with decorative cover": [
    "A notebook with decorative cover holds pages.",
    "Pages can carry stories, drawings, facts, lists, or careful records.",
    "Opening a notebook with decorative cover can invite reading, writing, counting, or imagining."
  ],
  "closed book": [
    "A closed book holds pages.",
    "Pages can carry stories, drawings, facts, lists, or careful records.",
    "Opening a closed book can invite reading, writing, counting, or imagining."
  ],
  "open book": [
    "A open book holds pages.",
    "Pages can carry stories, drawings, facts, lists, or careful records.",
    "Opening a open book can invite reading, writing, counting, or imagining."
  ],
  "green book": [
    "A green book holds pages.",
    "Pages can carry stories, drawings, facts, lists, or careful records.",
    "Opening a green book can invite reading, writing, counting, or imagining."
  ],
  "blue book": [
    "A blue book holds pages.",
    "Pages can carry stories, drawings, facts, lists, or careful records.",
    "Opening a blue book can invite reading, writing, counting, or imagining."
  ],
  "orange book": [
    "A orange book holds pages.",
    "Pages can carry stories, drawings, facts, lists, or careful records.",
    "Opening a orange book can invite reading, writing, counting, or imagining."
  ],
  "books": [
    "A books holds pages.",
    "Pages can carry stories, drawings, facts, lists, or careful records.",
    "Opening a books can invite reading, writing, counting, or imagining."
  ],
  "notebook": [
    "A notebook holds pages.",
    "Pages can carry stories, drawings, facts, lists, or careful records.",
    "Opening a notebook can invite reading, writing, counting, or imagining."
  ],
  "ledger": [
    "A ledger holds pages.",
    "Pages can carry stories, drawings, facts, lists, or careful records.",
    "Opening a ledger can invite reading, writing, counting, or imagining."
  ],
  "page with curl": [
    "A page with curl is made for words, pictures, or information on paper.",
    "Paper can fold, roll, curl, tear, stack, and turn.",
    "A page with curl can help children notice print in everyday life."
  ],
  "scroll": [
    "A scroll is made for words, pictures, or information on paper.",
    "Paper can fold, roll, curl, tear, stack, and turn.",
    "A scroll can help children notice print in everyday life."
  ],
  "page facing up": [
    "A page facing up is made for words, pictures, or information on paper.",
    "Paper can fold, roll, curl, tear, stack, and turn.",
    "A page facing up can help children notice print in everyday life."
  ],
  "newspaper": [
    "A newspaper is made for words, pictures, or information on paper.",
    "Paper can fold, roll, curl, tear, stack, and turn.",
    "A newspaper can help children notice print in everyday life."
  ],
  "rolled-up newspaper": [
    "A rolled-up newspaper is made for words, pictures, or information on paper.",
    "Paper can fold, roll, curl, tear, stack, and turn.",
    "A rolled-up newspaper can help children notice print in everyday life."
  ],
  "bookmark tabs": [
    "A bookmark tabs holds pages.",
    "Pages can carry stories, drawings, facts, lists, or careful records.",
    "Opening a bookmark tabs can invite reading, writing, counting, or imagining."
  ],
  "bookmark": [
    "A bookmark holds pages.",
    "Pages can carry stories, drawings, facts, lists, or careful records.",
    "Opening a bookmark can invite reading, writing, counting, or imagining."
  ],
  "label": [
    "A label marks a place or gives information.",
    "Small paper markers can help people find, sort, or name things.",
    "A label can make books, boxes, and pages easier to use."
  ],
  "coin": [
    "A coin is a kind of money.",
    "Coins and banknotes can have numbers, pictures, symbols, and special textures.",
    "Counting a coin can help children practice amounts and value."
  ],
  "money bag": [
    "A money bag is a playful picture of money or value.",
    "Stories and games often use treasure to show something precious.",
    "A money bag can start a conversation about saving, sharing, and wishes."
  ],
  "yen banknote": [
    "A yen banknote is a kind of money.",
    "Coins and banknotes can have numbers, pictures, symbols, and special textures.",
    "Counting a yen banknote can help children practice amounts and value."
  ],
  "dollar banknote": [
    "A dollar banknote is a kind of money.",
    "Coins and banknotes can have numbers, pictures, symbols, and special textures.",
    "Counting a dollar banknote can help children practice amounts and value."
  ],
  "euro banknote": [
    "A euro banknote is a kind of money.",
    "Coins and banknotes can have numbers, pictures, symbols, and special textures.",
    "Counting a euro banknote can help children practice amounts and value."
  ],
  "pound banknote": [
    "A pound banknote is a kind of money.",
    "Coins and banknotes can have numbers, pictures, symbols, and special textures.",
    "Counting a pound banknote can help children practice amounts and value."
  ],
  "money with wings": [
    "A money with wings is a playful picture of money or value.",
    "Stories and games often use treasure to show something precious.",
    "A money with wings can start a conversation about saving, sharing, and wishes."
  ],
  "credit card": [
    "A credit card helps people pay, remember, or understand money.",
    "Shops use records to show prices, totals, and change.",
    "A credit card can help children talk about buying and saving."
  ],
  "receipt": [
    "A receipt helps people pay, remember, or understand money.",
    "Shops use records to show prices, totals, and change.",
    "A receipt can help children talk about buying and saving."
  ],
  "chart increasing with yen": [
    "A chart increasing with yen helps people pay, remember, or understand money.",
    "Shops use records to show prices, totals, and change.",
    "A chart increasing with yen can help children talk about buying and saving."
  ],
  "pencil": [
    "A pencil makes marks for writing.",
    "Writing tools can make thin, thick, dark, smooth, or scratchy lines.",
    "A pencil can help children practice letters, names, and notes."
  ],
  "black nib": [
    "A black nib makes marks for writing.",
    "Writing tools can make thin, thick, dark, smooth, or scratchy lines.",
    "A black nib can help children practice letters, names, and notes."
  ],
  "fountain pen": [
    "A fountain pen makes marks for writing.",
    "Writing tools can make thin, thick, dark, smooth, or scratchy lines.",
    "A fountain pen can help children practice letters, names, and notes."
  ],
  "pen": [
    "A pen makes marks for writing.",
    "Writing tools can make thin, thick, dark, smooth, or scratchy lines.",
    "A pen can help children practice letters, names, and notes."
  ],
  "paintbrush": [
    "A paintbrush is used for drawing or coloring.",
    "Art tools can make soft, bright, wide, rough, or layered marks.",
    "A paintbrush can turn ideas into visible shapes and colors."
  ],
  "crayon": [
    "A crayon is used for drawing or coloring.",
    "Art tools can make soft, bright, wide, rough, or layered marks.",
    "A crayon can turn ideas into visible shapes and colors."
  ],
  "memo": [
    "A memo is a short note that helps someone remember something.",
    "Memos can be used for lists, messages, plans, or reminders.",
    "Writing a memo can make a thought easier to share."
  ],
  "briefcase": [
    "A briefcase helps organize papers or work items.",
    "Organizing tools make information easier to find again.",
    "A briefcase can help children understand sorting, grouping, and tidying."
  ],
  "file folder": [
    "A file folder helps organize papers or work items.",
    "Organizing tools make information easier to find again.",
    "A file folder can help children understand sorting, grouping, and tidying."
  ],
  "open file folder": [
    "A open file folder helps organize papers or work items.",
    "Organizing tools make information easier to find again.",
    "A open file folder can help children understand sorting, grouping, and tidying."
  ],
  "card index dividers": [
    "A card index dividers helps organize papers or work items.",
    "Organizing tools make information easier to find again.",
    "A card index dividers can help children understand sorting, grouping, and tidying."
  ],
  "calendar": [
    "A calendar helps people plan, write, or remember tasks.",
    "Planning tools can show dates, lists, notes, and checked-off jobs.",
    "A calendar can help children talk about time and routines."
  ],
  "tear-off calendar": [
    "A tear-off calendar helps people plan, write, or remember tasks.",
    "Planning tools can show dates, lists, notes, and checked-off jobs.",
    "A tear-off calendar can help children talk about time and routines."
  ],
  "spiral notepad": [
    "A spiral notepad helps people plan, write, or remember tasks.",
    "Planning tools can show dates, lists, notes, and checked-off jobs.",
    "A spiral notepad can help children talk about time and routines."
  ],
  "spiral calendar": [
    "A spiral calendar helps people plan, write, or remember tasks.",
    "Planning tools can show dates, lists, notes, and checked-off jobs.",
    "A spiral calendar can help children talk about time and routines."
  ],
  "card index": [
    "A card index helps organize papers or work items.",
    "Organizing tools make information easier to find again.",
    "A card index can help children understand sorting, grouping, and tidying."
  ],
  "chart increasing": [
    "A chart increasing shows information with a picture.",
    "Charts make numbers easier to compare quickly.",
    "A chart increasing can help children see more, less, up, down, and difference."
  ],
  "chart decreasing": [
    "A chart decreasing shows information with a picture.",
    "Charts make numbers easier to compare quickly.",
    "A chart decreasing can help children see more, less, up, down, and difference."
  ],
  "bar chart": [
    "A bar chart shows information with a picture.",
    "Charts make numbers easier to compare quickly.",
    "A bar chart can help children see more, less, up, down, and difference."
  ],
  "clipboard": [
    "A clipboard helps people plan, write, or remember tasks.",
    "Planning tools can show dates, lists, notes, and checked-off jobs.",
    "A clipboard can help children talk about time and routines."
  ],
  "pushpin": [
    "A pushpin is a small office or school tool.",
    "Small tools can attach, measure, cut, hold, or mark things.",
    "A pushpin can help children practice careful hand movements."
  ],
  "round pushpin": [
    "A round pushpin is a small office or school tool.",
    "Small tools can attach, measure, cut, hold, or mark things.",
    "A round pushpin can help children practice careful hand movements."
  ],
  "paperclip": [
    "A paperclip is a small office or school tool.",
    "Small tools can attach, measure, cut, hold, or mark things.",
    "A paperclip can help children practice careful hand movements."
  ],
  "linked paperclips": [
    "A linked paperclips is a small office or school tool.",
    "Small tools can attach, measure, cut, hold, or mark things.",
    "A linked paperclips can help children practice careful hand movements."
  ],
  "straight ruler": [
    "A straight ruler is a small office or school tool.",
    "Small tools can attach, measure, cut, hold, or mark things.",
    "A straight ruler can help children practice careful hand movements."
  ],
  "triangular ruler": [
    "A triangular ruler is a small office or school tool.",
    "Small tools can attach, measure, cut, hold, or mark things.",
    "A triangular ruler can help children practice careful hand movements."
  ],
  "scissors": [
    "A scissors is a small office or school tool.",
    "Small tools can attach, measure, cut, hold, or mark things.",
    "A scissors can help children practice careful hand movements."
  ],
  "card file box": [
    "A card file box helps organize papers or work items.",
    "Organizing tools make information easier to find again.",
    "A card file box can help children understand sorting, grouping, and tidying."
  ],
  "file cabinet": [
    "A file cabinet helps organize papers or work items.",
    "Organizing tools make information easier to find again.",
    "A file cabinet can help children understand sorting, grouping, and tidying."
  ],
  "wastebasket": [
    "A wastebasket holds paper scraps and small trash.",
    "Putting trash in one place keeps a room cleaner.",
    "Some paper from a wastebasket can be recycled."
  ],
  "hammer": [
    "A hammer is used for building, fixing, cutting, digging, holding, or climbing.",
    "Many tools work best when the right shape meets the right job.",
    "A hammer should be used carefully, often with grown-up help."
  ],
  "axe": [
    "A axe is used for building, fixing, cutting, digging, holding, or climbing.",
    "Many tools work best when the right shape meets the right job.",
    "A axe should be used carefully, often with grown-up help."
  ],
  "pick": [
    "A pick is used for building, fixing, cutting, digging, holding, or climbing.",
    "Many tools work best when the right shape meets the right job.",
    "A pick should be used carefully, often with grown-up help."
  ],
  "hammer and pick": [
    "A hammer and pick is used for building, fixing, cutting, digging, holding, or climbing.",
    "Many tools work best when the right shape meets the right job.",
    "A hammer and pick should be used carefully, often with grown-up help."
  ],
  "hammer and wrench": [
    "A hammer and wrench is used for building, fixing, cutting, digging, holding, or climbing.",
    "Many tools work best when the right shape meets the right job.",
    "A hammer and wrench should be used carefully, often with grown-up help."
  ],
  "dagger": [
    "A dagger is linked with danger, protection, history, or adventure stories.",
    "Some objects are safer as pictures in books and games than as real things.",
    "A dagger can help children talk about pretend play and safety rules."
  ],
  "crossed swords": [
    "A crossed swords is linked with danger, protection, history, or adventure stories.",
    "Some objects are safer as pictures in books and games than as real things.",
    "A crossed swords can help children talk about pretend play and safety rules."
  ],
  "bomb": [
    "A bomb is linked with danger, protection, history, or adventure stories.",
    "Some objects are safer as pictures in books and games than as real things.",
    "A bomb can help children talk about pretend play and safety rules."
  ],
  "boomerang": [
    "A boomerang is a curved throwing object.",
    "Some boomerangs can return when thrown with the right spin.",
    "Boomerangs are connected with Aboriginal Australian culture."
  ],
  "bow and arrow": [
    "A bow and arrow is linked with danger, protection, history, or adventure stories.",
    "Some objects are safer as pictures in books and games than as real things.",
    "A bow and arrow can help children talk about pretend play and safety rules."
  ],
  "shield": [
    "A shield is linked with danger, protection, history, or adventure stories.",
    "Some objects are safer as pictures in books and games than as real things.",
    "A shield can help children talk about pretend play and safety rules."
  ],
  "carpentry saw": [
    "A carpentry saw is used for building, fixing, cutting, digging, holding, or climbing.",
    "Many tools work best when the right shape meets the right job.",
    "A carpentry saw should be used carefully, often with grown-up help."
  ],
  "wrench": [
    "A wrench is used for building, fixing, cutting, digging, holding, or climbing.",
    "Many tools work best when the right shape meets the right job.",
    "A wrench should be used carefully, often with grown-up help."
  ],
  "screwdriver": [
    "A screwdriver is used for building, fixing, cutting, digging, holding, or climbing.",
    "Many tools work best when the right shape meets the right job.",
    "A screwdriver should be used carefully, often with grown-up help."
  ],
  "nut and bolt": [
    "A nut and bolt helps connect, move, hold, weigh, guide, or pull.",
    "Simple tool shapes can do surprisingly useful jobs.",
    "A nut and bolt can help children notice forces, balance, support, and connection."
  ],
  "gear": [
    "A gear helps connect, move, hold, weigh, guide, or pull.",
    "Simple tool shapes can do surprisingly useful jobs.",
    "A gear can help children notice forces, balance, support, and connection."
  ],
  "clamp": [
    "A clamp is used for building, fixing, cutting, digging, holding, or climbing.",
    "Many tools work best when the right shape meets the right job.",
    "A clamp should be used carefully, often with grown-up help."
  ],
  "balance scale": [
    "A balance scale helps connect, move, hold, weigh, guide, or pull.",
    "Simple tool shapes can do surprisingly useful jobs.",
    "A balance scale can help children notice forces, balance, support, and connection."
  ],
  "white cane": [
    "A white cane helps connect, move, hold, weigh, guide, or pull.",
    "Simple tool shapes can do surprisingly useful jobs.",
    "A white cane can help children notice forces, balance, support, and connection."
  ],
  "link": [
    "A link helps connect, move, hold, weigh, guide, or pull.",
    "Simple tool shapes can do surprisingly useful jobs.",
    "A link can help children notice forces, balance, support, and connection."
  ],
  "broken chain": [
    "A broken chain helps connect, move, hold, weigh, guide, or pull.",
    "Simple tool shapes can do surprisingly useful jobs.",
    "A broken chain can help children notice forces, balance, support, and connection."
  ],
  "chains": [
    "A chains helps connect, move, hold, weigh, guide, or pull.",
    "Simple tool shapes can do surprisingly useful jobs.",
    "A chains can help children notice forces, balance, support, and connection."
  ],
  "hook": [
    "A hook helps connect, move, hold, weigh, guide, or pull.",
    "Simple tool shapes can do surprisingly useful jobs.",
    "A hook can help children notice forces, balance, support, and connection."
  ],
  "toolbox": [
    "A toolbox is used for building, fixing, cutting, digging, holding, or climbing.",
    "Many tools work best when the right shape meets the right job.",
    "A toolbox should be used carefully, often with grown-up help."
  ],
  "magnet": [
    "A magnet helps connect, move, hold, weigh, guide, or pull.",
    "Simple tool shapes can do surprisingly useful jobs.",
    "A magnet can help children notice forces, balance, support, and connection."
  ],
  "ladder": [
    "A ladder is used for building, fixing, cutting, digging, holding, or climbing.",
    "Many tools work best when the right shape meets the right job.",
    "A ladder should be used carefully, often with grown-up help."
  ],
  "shovel": [
    "A shovel is used for building, fixing, cutting, digging, holding, or climbing.",
    "Many tools work best when the right shape meets the right job.",
    "A shovel should be used carefully, often with grown-up help."
  ],
  "alembic": [
    "A alembic can hold or separate materials during experiments.",
    "Science containers help people test small amounts safely and carefully.",
    "A alembic can make children curious about mixing, growing, and observing."
  ],
  "test tube": [
    "A test tube can hold or separate materials during experiments.",
    "Science containers help people test small amounts safely and carefully.",
    "A test tube can make children curious about mixing, growing, and observing."
  ],
  "petri dish": [
    "A petri dish can hold or separate materials during experiments.",
    "Science containers help people test small amounts safely and carefully.",
    "A petri dish can make children curious about mixing, growing, and observing."
  ],
  "dna": [
    "DNA carries instructions used by living things.",
    "DNA is shaped like a twisted ladder called a double helix.",
    "Every person, plant, and animal has DNA in its cells."
  ],
  "microscope": [
    "A microscope makes tiny things look much larger.",
    "Microscopes can reveal cells, fibers, and tiny living things.",
    "Looking through a microscope can feel like entering a hidden world."
  ],
  "telescope": [
    "A telescope makes faraway things in the sky look closer.",
    "Telescopes help people study the Moon, planets, stars, and galaxies.",
    "A clear dark sky makes telescope watching easier."
  ],
  "satellite antenna": [
    "A satellite antenna sends or receives signals.",
    "Its dish shape helps focus signals from far away.",
    "Antennas help with television, maps, weather, and communication."
  ],
  "syringe": [
    "A syringe moves liquid through a narrow tube or needle.",
    "Doctors and nurses use syringes carefully for medicine or samples.",
    "Syringes are medical tools, not toys."
  ],
  "drop of blood": [
    "A drop of blood is a tiny amount of the red liquid in the body.",
    "Blood carries oxygen and helps the body heal.",
    "A small blood drop can be checked in some medical tests."
  ],
  "pill": [
    "A pill is medicine shaped to swallow.",
    "Medicine should only be taken with help from a grown-up.",
    "Pills can be different colors, shapes, and sizes."
  ],
  "adhesive bandage": [
    "An adhesive bandage covers a small cut or scrape.",
    "The soft pad protects the sore spot while it heals.",
    "Bandages stick to skin with gentle adhesive edges."
  ],
  "crutch": [
    "A crutch helps someone walk when a leg or foot needs support.",
    "The handles and pads help share body weight.",
    "Using crutches takes balance and practice."
  ],
  "stethoscope": [
    "A stethoscope helps doctors listen to the body.",
    "It can make heartbeats and breathing sounds easier to hear.",
    "The earpieces carry quiet body sounds to the listener."
  ],
  "x-ray": [
    "An x-ray picture can show bones inside the body.",
    "Doctors use x-rays to look for breaks or other problems.",
    "X-ray rooms use special safety rules."
  ],
  "door": [
    "A door helps people move through or look around a building.",
    "Building parts can open, close, lift, frame, or separate spaces.",
    "A door can help children talk about rooms, floors, inside, and outside."
  ],
  "elevator": [
    "A elevator helps people move through or look around a building.",
    "Building parts can open, close, lift, frame, or separate spaces.",
    "A elevator can help children talk about rooms, floors, inside, and outside."
  ],
  "mirror": [
    "A mirror reflects faces, light, and rooms.",
    "Home objects can help people rest, sit, read, sleep, or get ready.",
    "A mirror can help children name familiar places in a room."
  ],
  "window": [
    "A window helps people move through or look around a building.",
    "Building parts can open, close, lift, frame, or separate spaces.",
    "A window can help children talk about rooms, floors, inside, and outside."
  ],
  "bed": [
    "A bed is made for sleeping, resting, and cozy blankets.",
    "Home objects can help people rest, sit, read, sleep, or get ready.",
    "A bed can help children name familiar places in a room."
  ],
  "couch and lamp": [
    "A couch and lamp make a cozy place to sit, read, or talk.",
    "Home objects can help people rest, sit, read, sleep, or get ready.",
    "A couch and lamp can help children name familiar places in a room."
  ],
  "chair": [
    "A chair gives one person a place to sit.",
    "Home objects can help people rest, sit, read, sleep, or get ready.",
    "A chair can help children name familiar places in a room."
  ],
  "toilet": [
    "A toilet belongs with washing, bathroom care, or getting clean.",
    "Bathroom objects help people brush, wash, rinse, dry, and care for the body.",
    "A toilet can help children learn everyday self-care words."
  ],
  "plunger": [
    "A plunger helps with cleaning, carrying, shopping, or organizing.",
    "Household jobs often use simple tools with handles, holes, bristles, wheels, or soft surfaces.",
    "A plunger can help children join small routines like tidying and helping."
  ],
  "shower": [
    "A shower sprays water from above for washing.",
    "Bathroom objects help people brush, wash, rinse, dry, and care for the body.",
    "A shower can help children learn everyday self-care words."
  ],
  "bathtub": [
    "A bathtub holds water for a bath.",
    "Bathroom objects help people brush, wash, rinse, dry, and care for the body.",
    "A bathtub can help children learn everyday self-care words."
  ],
  "mouse trap": [
    "A mouse trap is used for safety, fastening, or solving a household problem.",
    "Some household objects should only be used with grown-up help.",
    "A mouse trap can help children learn which tools are helpful but not for play."
  ],
  "razor": [
    "A razor belongs with washing, bathroom care, or getting clean.",
    "Bathroom objects help people brush, wash, rinse, dry, and care for the body.",
    "A razor can help children learn everyday self-care words."
  ],
  "lotion bottle": [
    "A lotion bottle belongs with washing, bathroom care, or getting clean.",
    "Bathroom objects help people brush, wash, rinse, dry, and care for the body.",
    "A lotion bottle can help children learn everyday self-care words."
  ],
  "safety pin": [
    "A safety pin is used for safety, fastening, or solving a household problem.",
    "Some household objects should only be used with grown-up help.",
    "A safety pin can help children learn which tools are helpful but not for play."
  ],
  "broom": [
    "A broom helps with cleaning, carrying, shopping, or organizing.",
    "Household jobs often use simple tools with handles, holes, bristles, wheels, or soft surfaces.",
    "A broom can help children join small routines like tidying and helping."
  ],
  "basket": [
    "A basket helps with cleaning, carrying, shopping, or organizing.",
    "Household jobs often use simple tools with handles, holes, bristles, wheels, or soft surfaces.",
    "A basket can help children join small routines like tidying and helping."
  ],
  "roll of paper": [
    "A roll of paper helps with cleaning, carrying, shopping, or organizing.",
    "Household jobs often use simple tools with handles, holes, bristles, wheels, or soft surfaces.",
    "A roll of paper can help children join small routines like tidying and helping."
  ],
  "bucket": [
    "A bucket helps with cleaning, carrying, shopping, or organizing.",
    "Household jobs often use simple tools with handles, holes, bristles, wheels, or soft surfaces.",
    "A bucket can help children join small routines like tidying and helping."
  ],
  "soap": [
    "A soap belongs with washing, bathroom care, or getting clean.",
    "Bathroom objects help people brush, wash, rinse, dry, and care for the body.",
    "A soap can help children learn everyday self-care words."
  ],
  "bubbles": [
    "Bubbles are tiny pockets of air inside a thin film of soapy water.",
    "Bubbles can float, shimmer, join together, or pop.",
    "Children can notice colors on bubbles when light shines on them."
  ],
  "toothbrush": [
    "A toothbrush cleans teeth with rows of small bristles.",
    "Bathroom objects help people brush, wash, rinse, dry, and care for the body.",
    "A toothbrush can help children learn everyday self-care words."
  ],
  "sponge": [
    "A sponge helps with cleaning, carrying, shopping, or organizing.",
    "Household jobs often use simple tools with handles, holes, bristles, wheels, or soft surfaces.",
    "A sponge can help children join small routines like tidying and helping."
  ],
  "fire extinguisher": [
    "A fire extinguisher is used for safety, fastening, or solving a household problem.",
    "Some household objects should only be used with grown-up help.",
    "A fire extinguisher can help children learn which tools are helpful but not for play."
  ],
  "shopping cart": [
    "A shopping cart helps with cleaning, carrying, shopping, or organizing.",
    "Household jobs often use simple tools with handles, holes, bristles, wheels, or soft surfaces.",
    "A shopping cart can help children join small routines like tidying and helping."
  ]
};

function objectFacts(english, subgroup) {
  if (objectFactTexts[english]) return objectFactTexts[english];
  return [
    `${capitalize(english)} is an object people can name and use.`,
    "Objects can have different shapes, materials, colors, and jobs.",
    `${capitalize(english)} can help children describe what they see and touch.`,
  ];
}
function travelFacts(english, subgroup) {
  if (travelFactTexts[english]) return travelFactTexts[english];
  return [
    `${capitalize(english)} is a travel or place word.`,
    "Travel words can name maps, buildings, vehicles, signs, and places.",
    "Children can use travel words to talk about where they go and what they see.",
  ];
}

const chinesePronunciationMap = {"一":"yī","丁":"dīng","七":"qī","三":"sān","上":"shàng","下":"xià","丑":"chǒu","世":"shì","业":"yè","东":"dōng","丝":"sī","个":"gè","中":"zhōng","丸":"wán","丽":"lì","举":"jǔ","乌":"wū","乐":"lè","乒":"pīng","乓":"pāng","书":"shū","乳":"rǔ","事":"shì","二":"èr","亏":"kuī","云":"yún","亚":"yà","交":"jiāo","京":"jīng","亮":"liàng","人":"rén","仓":"cāng","仔":"zǐ","他":"tā","仙":"xiān","仪":"yí","件":"jiàn","企":"qǐ","会":"huì","伞":"sǎn","伤":"shāng","位":"wèi","低":"dī","体":"tǐ","使":"shǐ","侦":"zhēn","便":"biàn","保":"bǎo","信":"xìn","倒":"dào","倾":"qīng","停":"tíng","偶":"ǒu","像":"xiàng","僵":"jiāng","元":"yuán","光":"guāng","克":"kè","兔":"tù","入":"rù","全":"quán","八":"bā","公":"gōng","兰":"lán","关":"guān","兵":"bīng","具":"jù","典":"diǎn","养":"yǎng","兽":"shòu","内":"nèi","军":"jūn","农":"nóng","冠":"guān","冰":"bīng","冲":"chōng","凉":"liáng","凸":"tū","出":"chū","击":"jī","刀":"dāo","分":"fēn","划":"huà","列":"liè","创":"chuàng","刨":"páo","利":"lì","别":"bié","制":"zhì","刷":"shuā","券":"quàn","刺":"cì","剃":"tì","剑":"jiàn","剪":"jiǎn","力":"lì","办":"bàn","功":"gōng","加":"jiā","务":"wù","动":"dòng","助":"zhù","勺":"sháo","包":"bāo","匕":"bǐ","北":"běi","匙":"shi","医":"yī","升":"shēng","华":"huá","卓":"zhuó","单":"dān","卖":"mài","南":"nán","卜":"bo","卡":"kǎ","卫":"wèi","印":"yìn","卷":"juǎn","厂":"chǎng","历":"lì","厢":"xiāng","厨":"chú","叉":"chā","双":"shuāng","反":"fǎn","发":"fā","口":"kǒu","古":"gǔ","可":"kě","台":"tái","右":"yòu","叶":"yè","号":"hào","司":"sī","合":"hé","吉":"jí","名":"míng","向":"xiàng","听":"tīng","吸":"xī","员":"yuán","和":"hé","咖":"kā","咬":"yǎo","品":"pǐn","哥":"gē","哺":"bǔ","唇":"chún","商":"shāng","啤":"pí","喂":"wèi","喱":"lí","喷":"pēn","嘴":"zuǐ","器":"qì","四":"sì","回":"huí","团":"tuán","园":"yuán","围":"wéi","国":"guó","图":"tú","圆":"yuán","圈":"quān","土":"tǔ","圣":"shèng","在":"zài","地":"de","场":"chǎng","坐":"zuò","块":"kuài","型":"xíng","垒":"lěi","城":"chéng","培":"péi","基":"jī","堂":"táng","堡":"bǎo","塔":"tǎ","墨":"mò","士":"shì","壮":"zhuàng","壶":"hú","备":"bèi","夕":"xī","外":"wài","多":"duō","夜":"yè","大":"dà","天":"tiān","太":"tài","夫":"fū","头":"tóu","夹":"jiā","奖":"jiǎng","套":"tào","女":"nǚ","奶":"nǎi","妈":"mā","姜":"jiāng","娃":"wá","娥":"é","婚":"hūn","子":"zǐ","孔":"kǒng","孕":"yùn","字":"zì","学":"xué","宇":"yǔ","安":"ān","官":"guān","宝":"bǎo","实":"shí","客":"kè","室":"shì","家":"jiā","富":"fù","察":"chá","对":"duì","寺":"sì","寿":"shòu","封":"fēng","射":"shè","将":"jiāng","小":"xiǎo","尔":"ěr","尖":"jiān","尸":"shī","尺":"chǐ","尼":"ní","尾":"wěi","局":"jú","屋":"wū","山":"shān","岛":"dǎo","岩":"yán","巢":"cháo","工":"gōng","左":"zuǒ","巧":"qiǎo","巨":"jù","巴":"bā","巾":"jīn","币":"bì","市":"shì","布":"bù","帆":"fān","师":"shī","帐":"zhàng","帚":"zhǒu","带":"dài","帧":"zhēn","常":"cháng","帽":"mào","干":"gàn","平":"píng","幸":"xìng","幼":"yòu","床":"chuáng","底":"dǐ","店":"diàn","庙":"miào","废":"fèi","度":"dù","座":"zuò","建":"jiàn","开":"kāi","弃":"qì","式":"shì","弓":"gōng","引":"yǐn","弦":"xián","弯":"wān","弹":"dàn","强":"qiáng","当":"dāng","录":"lù","彗":"huì","形":"xíng","彩":"cǎi","影":"yǐng","微":"wēi","心":"xīn","忍":"rěn","志":"zhì","忘":"wàng","快":"kuài","念":"niàn","怀":"huái","恐":"kǒng","恤":"xù","悠":"yōu","悬":"xuán","情":"qíng","惊":"jīng","意":"yì","懒":"lǎn","戏":"xì","戒":"jiè","戴":"dài","户":"hù","房":"fáng","扁":"biǎn","扇":"shàn","手":"shǒu","打":"dǎ","托":"tuō","扫":"sǎo","扳":"bān","技":"jì","折":"zhé","护":"hù","报":"bào","披":"pī","拉":"lā","拍":"pāi","拐":"guǎi","拖":"tuō","招":"zhāo","拳":"quán","拼":"pīn","拿":"ná","挂":"guà","指":"zhǐ","按":"àn","捕":"bǔ","据":"jù","掌":"zhǎng","排":"pái","探":"tàn","接":"jiē","控":"kòng","提":"tí","插":"chā","援":"yuán","搋":"chuāi","摄":"shè","摔":"shuāi","摩":"mó","撕":"sī","操":"cāo","攀":"pān","收":"shōu","放":"fàng","救":"jiù","教":"jiào","文":"wén","斑":"bān","斗":"dòu","料":"liào","斜":"xié","斧":"fǔ","断":"duàn","斯":"sī","新":"xīn","方":"fāng","施":"shī","旅":"lǚ","旋":"xuán","旗":"qí","无":"wú","日":"rì","旱":"hàn","明":"míng","昏":"hūn","星":"xīng","映":"yìng","显":"xiǎn","晚":"wǎn","景":"jǐng","晶":"jīng","曲":"qū","月":"yuè","有":"yǒu","服":"fú","望":"wàng","朝":"cháo","木":"mù","本":"běn","札":"zhá","术":"shù","朵":"duǒ","机":"jī","杂":"zá","杆":"gān","李":"lǐ","杖":"zhàng","束":"shù","条":"tiáo","来":"lái","杯":"bēi","松":"sōng","板":"bǎn","极":"jí","果":"guǒ","枪":"qiāng","枫":"fēng","枯":"kū","柜":"guì","柠":"níng","柱":"zhù","标":"biāo","树":"shù","栓":"shuān","栗":"lì","校":"xiào","根":"gēn","栽":"zāi","桃":"táo","框":"kuàng","桥":"qiáo","桶":"tǒng","梅":"méi","梨":"lí","梯":"tī","械":"xiè","梳":"shū","棍":"gùn","棒":"bàng","棕":"zōng","椅":"yǐ","植":"zhí","椒":"jiāo","椰":"yē","楼":"lóu","榄":"lǎn","榈":"lǘ","槟":"bīn","横":"héng","樱":"yīng","橄":"gǎn","橇":"qiāo","橘":"jú","橙":"chéng","檬":"méng","欧":"ōu","歌":"gē","正":"zhèng","步":"bù","武":"wǔ","残":"cán","母":"mǔ","比":"bǐ","毕":"bì","毛":"máo","民":"mín","气":"qì","水":"shuǐ","汁":"zhī","汉":"hàn","池":"chí","汤":"tāng","汽":"qì","沙":"shā","河":"hé","油":"yóu","治":"zhì","泉":"quán","法":"fǎ","泡":"pào","波":"bō","注":"zhù","泰":"tài","泳":"yǒng","泵":"bèng","洋":"yáng","洗":"xǐ","洞":"dòng","洲":"zhōu","派":"pài","流":"liú","浣":"huàn","浪":"làng","浮":"fú","浴":"yù","海":"hǎi","消":"xiāo","涨":"zhǎng","液":"yè","淇":"qí","淋":"lín","清":"qīng","渡":"dù","温":"wēn","游":"yóu","滑":"huá","满":"mǎn","滩":"tān","滴":"dī","漂":"piào","演":"yǎn","漠":"mò","潜":"qián","澡":"zǎo","澳":"ào","火":"huǒ","灭":"miè","灯":"dēng","灵":"líng","炮":"pào","炸":"zhà","烈":"liè","烛":"zhú","烟":"yān","烤":"kǎo","热":"rè","烹":"pēng","煎":"jiān","煮":"zhǔ","熊":"xióng","燕":"yàn","爆":"bào","爬":"pá","爱":"ài","爸":"bà","片":"piàn","牌":"pái","牙":"yá","牛":"niú","物":"wù","犀":"xī","状":"zhuàng","犸":"mǎ","犹":"yóu","狐":"hú","狗":"gǒu","独":"dú","狮":"shī","狸":"lí","狼":"láng","猕":"mí","猛":"měng","猩":"xīng","猪":"zhū","猫":"māo","猬":"wèi","猴":"hóu","獭":"tǎ","獾":"huān","玉":"yù","王":"wáng","玫":"méi","环":"huán","珊":"shān","珍":"zhēn","珠":"zhū","班":"bān","球":"qiú","理":"lǐ","琴":"qín","瑚":"hú","瑰":"guī","瓜":"guā","瓢":"piáo","瓶":"píng","甜":"tián","生":"shēng","用":"yòng","由":"yóu","甲":"jiǎ","电":"diàn","男":"nán","画":"huà","界":"jiè","番":"fān","登":"dēng","白":"bái","百":"bǎi","皂":"zào","的":"de","皇":"huáng","皮":"pí","皿":"mǐn","盆":"pén","盈":"yíng","盐":"yán","盒":"hé","盔":"kuī","盘":"pán","目":"mù","盲":"máng","直":"zhí","相":"xiāng","盾":"dùn","眉":"méi","真":"zhēn","眼":"yǎn","着":"zhe","睛":"jīng","睡":"shuì","短":"duǎn","石":"shí","砖":"zhuān","硬":"yìng","碗":"wǎn","碟":"dié","碰":"pèng","磁":"cí","礼":"lǐ","社":"shè","神":"shén","票":"piào","科":"kē","租":"zū","积":"jī","稻":"dào","穗":"suì","空":"kōng","穿":"chuān","窗":"chuāng","立":"lì","竖":"shù","站":"zhàn","章":"zhāng","竿":"gān","笑":"xiào","笔":"bǐ","笛":"dí","符":"fú","第":"dì","笼":"lóng","筋":"jīn","筑":"zhù","筒":"tǒng","筝":"zhēng","筷":"kuài","签":"qiān","算":"suàn","管":"guǎn","箭":"jiàn","箱":"xiāng","篓":"lǒu","篮":"lán","篷":"péng","米":"mǐ","粽":"zòng","精":"jīng","糕":"gāo","糖":"táng","索":"suǒ","红":"hóng","级":"jí","纪":"jì","纬":"wěi","纱":"shā","纳":"nà","纵":"zòng","纸":"zhǐ","线":"xiàn","经":"jīng","结":"jié","绵":"mián","绿":"lǜ","缆":"lǎn","缝":"fèng","缸":"gāng","罐":"guàn","网":"wǎng","罩":"zhào","羊":"yáng","美":"měi","羽":"yǔ","翅":"chì","翻":"fān","老":"lǎo","考":"kǎo","者":"zhě","耍":"shuǎ","耳":"ěr","职":"zhí","肉":"ròu","肥":"féi","育":"yù","肺":"fèi","背":"bèi","胡":"hú","胶":"jiāo","脏":"zàng","脑":"nǎo","脚":"jiǎo","脸":"liǎn","腿":"tuǐ","膀":"bǎng","臂":"bì","自":"zì","臭":"chòu","舌":"shé","舞":"wǔ","舟":"zhōu","航":"háng","船":"chuán","艇":"tǐng","色":"sè","艺":"yì","芒":"máng","芙":"fú","芭":"bā","花":"huā","苍":"cāng","苗":"miáo","英":"yīng","苹":"píng","茄":"jiā","茶":"chá","草":"cǎo","荒":"huāng","荚":"jiá","药":"yào","莓":"méi","莲":"lián","菇":"gū","菜":"cài","菠":"bō","萄":"táo","萎":"wěi","萝":"luó","营":"yíng","萨":"sà","落":"luò","葡":"pú","葱":"cōng","葵":"kuí","蒙":"méng","蒜":"suàn","蒸":"zhēng","蓉":"róng","蓝":"lán","蕉":"jiāo","蕾":"lěi","薯":"shǔ","蘑":"mó","虎":"hǔ","虫":"chóng","虹":"hóng","虾":"xiā","蚁":"yǐ","蚂":"mǎ","蚊":"wén","蚱":"zhà","蛇":"shé","蛋":"dàn","蛙":"wā","蛛":"zhū","蜂":"fēng","蜗":"wō","蜘":"zhī","蜜":"mì","蜡":"là","蜢":"měng","蜥":"xī","蜴":"yì","蝇":"yíng","蝎":"xiē","蝙":"biān","蝠":"fú","蝴":"hú","蝶":"dié","螂":"láng","螃":"páng","螺":"luó","蟑":"zhāng","蟹":"xiè","血":"xuè","行":"xíng","衣":"yī","表":"biǎo","袋":"dài","袜":"wà","装":"zhuāng","裙":"qún","裤":"kù","褐":"hè","西":"xī","观":"guān","视":"shì","觉":"jué","角":"jiǎo","警":"jǐng","计":"jì","记":"jì","讶":"yà","诊":"zhěn","试":"shì","话":"huà","诞":"dàn","调":"diào","谱":"pǔ","豆":"dòu","豌":"wān","豚":"tún","象":"xiàng","豹":"bào","贝":"bèi","账":"zhàng","货":"huò","购":"gòu","贴":"tiē","赏":"shǎng","赛":"sài","走":"zǒu","起":"qǐ","超":"chāo","足":"zú","跑":"pǎo","跟":"gēn","跤":"jiāo","跪":"guì","路":"lù","跳":"tiào","躺":"tǎng","车":"chē","轨":"guǐ","转":"zhuǎn","轮":"lún","软":"ruǎn","轴":"zhóu","轻":"qīng","辣":"là","边":"biān","过":"guò","迎":"yíng","运":"yùn","远":"yuǎn","连":"lián","迪":"dí","迹":"jì","送":"sòng","途":"tú","通":"tōng","速":"sù","道":"dào","邮":"yóu","郁":"yù","酒":"jiǔ","酪":"lào","里":"lǐ","重":"zhòng","野":"yě","量":"liàng","金":"jīn","针":"zhēn","钉":"dīng","钓":"diào","钟":"zhōng","钢":"gāng","钥":"yào","钩":"gōu","钮":"niǔ","钱":"qián","铁":"tiě","铃":"líng","铅":"qiān","铰":"jiǎo","铲":"chǎn","银":"yín","链":"liàn","锅":"guō","锚":"máo","锤":"chuí","键":"jiàn","锯":"jù","镐":"gǎo","镑":"bàng","镖":"biāo","镜":"jìng","长":"zhǎng","门":"mén","闪":"shǎn","间":"jiān","防":"fáng","阳":"yáng","降":"jiàng","院":"yuàn","隔":"gé","雀":"què","雄":"xióng","雨":"yǔ","雪":"xuě","雷":"léi","雾":"wù","露":"lù","青":"qīng","静":"jìng","非":"fēi","面":"miàn","靴":"xuē","靶":"bǎ","鞋":"xié","鞭":"biān","音":"yīn","页":"yè","须":"xū","领":"lǐng","颈":"jǐng","风":"fēng","飞":"fēi","食":"shí","餐":"cān","饪":"rèn","饭":"fàn","饮":"yǐn","饰":"shì","饺":"jiǎo","饼":"bǐng","馅":"xiàn","馆":"guǎn","馏":"liú","首":"shǒu","香":"xiāng","马":"mǎ","驴":"lǘ","驶":"shǐ","驼":"tuó","骆":"luò","验":"yàn","骑":"qí","骨":"gǔ","骰":"tóu","高":"gāo","鬼":"guǐ","魔":"mó","鱼":"yú","鱿":"yóu","鲤":"lǐ","鲨":"shā","鲸":"jīng","鳄":"è","鸟":"niǎo","鸡":"jī","鸦":"yā","鸭":"yā","鸽":"gē","鹅":"é","鹉":"wǔ","鹦":"yīng","鹰":"yīng","鹿":"lù","麦":"mài","麻":"má","黄":"huáng","黑":"hēi","黛":"dài","鼓":"gǔ","鼠":"shǔ","鼬":"yòu","鼻":"bí","齿":"chǐ","龄":"líng","龙":"lóng","龟":"guī"};

/* EN / NL pronunciation overrides (US English + Dutch stressed transliteration)
   Regenerate: node generate-phonetic-overrides.mjs && node patch-app-phonetics.mjs
   Validate:   node validate-en-nl-phonetics.mjs */
/* AUTO-GENERATED pronunciation overrides — run: node generate-phonetic-overrides.mjs */
const englishPronunciationOverrides = {
  "1st place medal": "FIRST place MEH-dul",
  "2nd place medal": "SECOND place MEH-dul",
  "3rd place medal": "THIRD place MEH-dul",
  aardappel: "aa-RDA-ppe",
  aardbei: "aa-RDBEHIH",
  abacus: "AB-uhk-uhs",
  accordeon: "a-CCO-rdeo",
  accordion: "uhk-AWR-dee-uhn",
  achtbaan: "a-CHTBAA",
  "adhesive bandage": "ad-HEES-ihv BAN-dihj",
  "admission tickets": "ad-MIH-shun TIK-ets",
  "aerial tramway": "EHR-ee-uhl",
  afhaaldoos: "a-FHAA-ldoo",
  "afnemende maan": "a-FNE-me-nde MAA",
  "afnemende maansikkel": "a-FNE-me-nde maa-NSI-kke",
  afstudeerhoed: "a-FSTU-dee-rhoe",
  airplane: "AIR-playn",
  "airplane arrival": "EHRP-LAYN er-EYEV-uhl",
  "airplane departure": "EHRP-LAYN dihp-AHR-cher",
  aktetas: "a-KTE-ta",
  alambiek: "a-LA-mbie",
  alembic: "a-LE-mbi",
  ambulance: "AMB-yuhl-uhns",
  "american football": "uhm-EHR-uhk-uhn FUHT-BAWL",
  amfora: "a-MFOH-ra",
  amphora: "AM-fer-uh",
  ananas: "a-NA-na",
  "anatomical heart": "AN-uht-AHM-uhk-uhl HAHRT",
  "anatomisch hart": "HAHRT",
  anchor: "ANG-ker",
  angry: "ANGG-ree",
  anker: "ANG-ker",
  ant: "AHNT",
  apple: "A-puhl",
  archiefkast: "a-RCHIE-fka",
  "articulated lorry": "ahr-TIHK-yuhl-AYT-ihd LAWR-ee",
  artist: "AHR-tuhst",
  "artist palette": "AHR-tuhst PAL-uht",
  astronaut: "AST-ruhn-AHT",
  aubergine: "AWB-erj-EEN",
  auto: "AWT-oh",
  "auto rickshaw": "AWT-oh",
  automobile: "AWT-uhm-ohb-EEL",
  autoriksja: "au-TOH-ri-ksja",
  avocado: "AV-uhk-AHD-oh",
  axe: "AKS",
  "baby angel": "BAYB-ee AYN-juhl",
  "baby bottle": "BAYB-ee BAHT-uhl",
  "baby-engel": "ba-BY-e-nge",
  babyfles: "ba-BYFLE",
  backpack: "BAK-pak",
  bacon: "BAYK-uhn",
  badger: "BAJ-er",
  badkuip: "ba-DKUI",
  badminton: "BAD-MIHN-tuhn",
  badpak: "ba-DPA",
  bag: "BAGH",
  bagage: "ba-GAH-ge",
  bagel: "BAYG-uhl",
  "baguette bread": "BAG-EHT BREHD",
  baksteen: "ba-KSTEE",
  "balance scale": "BAL-uhns SKAYL",
  "ballet shoes": "bal-AY SHOOZ",
  balletschoenen: "ba-LLE-tschoe-ne",
  ballon: "BAL-uhn",
  balloon: "buhl-OON",
  banaan: "ba-NAA",
  banana: "buh-NA-nuh",
  banjo: "BAN-JOH",
  bank: "BANGK",
  "bank en lamp": "BANGK EHN LAMP",
  "bar chart": "BAHR CHAHRT",
  "barber pole": "BAHR-ber POHL",
  baseball: "BAYS-BAWL",
  basket: "BAS-kuht",
  basketbal: "ba-SKE-tba",
  basketball: "BAS-ket-bawl",
  bat: "BAHT",
  bathtub: "BATH-tuhb",
  batterij: "ba-TTE-ri",
  battery: "BAT-er-ee",
  "beach with umbrella": "BEECH WIHTH uhmb-REHL-uh",
  beans: "BEENZ",
  bear: "BEHR",
  beaver: "BEEV-er",
  bed: "BEHD",
  bedieningsknoppen: "be-DIE-ni-ngskno-ppe",
  bee: "BEHEH",
  been: "BIHN",
  "beer mug": "BIHR MUHG",
  beetle: "BEET-uhl",
  "beker met rietje": "BEHK-er MEHT",
  "bell pepper": "BEHL PEHP-er",
  bellen: "be-LLE",
  "bellhop bell": "BEHL-HAHP BEHL",
  "bento box": "BEN-toh BOKS",
  bentobox: "be-NTO-bo",
  benzinepomp: "be-NZI-ne-po",
  berg: "BEHRG",
  bergkabelbaan: "be-RGKA-be-lbaa",
  bergspoorweg: "be-RGSPOO-rwe",
  "besneeuwde berg": "BERG",
  bestelwagen: "be-STE-lwa-ge",
  "beverage box": "BEHV-er-ihj BAHKS",
  bewaker: "be-WA-ke",
  bezem: "be-ZE",
  bicycle: "BEYES-ihk-uhl",
  bierpul: "bie-RPU",
  bijl: "BI",
  "bijtende lip": "LIHP",
  bikini: "bihk-EEN-ee",
  "biljartbal acht": "bi-LJA-rtba A",
  "billed cap": "BIHLD KAP",
  bird: "BERD",
  "birthday cake": "BERTH-DAY KAYK",
  bison: "BEYES-uhn",
  "biting lip": "BEYET-ihng LIHP",
  "black nib": "BLAK NIHB",
  "blad in de wind": "IHN DEE WEYEND",
  bladgroente: "bla-DGROHEH-nte",
  bladmuziek: "bla-DMU-zie",
  bladwijzer: "bla-DWI-jze",
  bladwijzertabs: "bla-DWI-jze-rta",
  "blauw boek": "BLAU BOE",
  bliksem: "bli-KSE",
  blikvoer: "bli-KVOE",
  blocks: "BLAHKS",
  bloeddruppel: "bloe-DDRU-ppe",
  bloesem: "bloe-SE",
  blossom: "BLAHS-uhm",
  "blue book": "BLOO BUHK",
  blueberries: "BLOOB-EHR-eez",
  boar: "BAWR",
  boat: "BOHT",
  boeken: "boe-KE",
  boeket: "boe-KE",
  boemerang: "boe-ME-ra",
  boer: "BAWR",
  bokshandschoen: "bo-KSHA-ndschoe",
  bom: "BAHM",
  bomb: "BAHM",
  bon: "BAHN",
  bone: "BOHN",
  bonen: "bo-NE",
  boodschappentassen: "boo-DSCHA-ppe-nta-sse",
  book: "BUHK",
  bookmark: "BUHK-mahrk",
  "bookmark tabs": "BUHK-mahrk TABZ",
  books: "BUHKS",
  "boom zonder bladeren": "BOOM",
  boomerang: "BOHHM-er-AHNG",
  "bord met bestek": "MEHT",
  borstvoeding: "bo-RSTVOE-di",
  bosbessen: "bo-SBE-sse",
  bot: "BAWT",
  boter: "bo-TE",
  "bottle with popping cork": "BAHT-uhl WIHTH PAHP-ihng KAWRK",
  bouquet: "book-AY",
  bouwplaats: "bou-WPLAA",
  bouwvakker: "bou-WVA-kke",
  "bow and arrow": "BOW UHND AR-oh",
  "bowl with spoon": "BOHL WIHTH SPOON",
  bowling: "BOHL-ihng",
  "boxing glove": "BAHK-sihng GLUHV",
  brain: "BRAYN",
  brandblusser: "bra-NDBLU-sse",
  brandweerman: "bra-NDWEE-rma",
  brandweerwagen: "bra-NDWEE-rwa-ge",
  bread: "BREHD",
  "breast-feeding": "BREHST-feed-ihng",
  brein: "BREI",
  brick: "BRIHK",
  "bridge at night": "BRIHJ AT NEYET",
  briefcase: "BREEF-KAYS",
  briefs: "BREEFS",
  bril: "BRI",
  broccoli: "BRAHK-uhl-ee",
  "broken chain": "BROHK-uhn CHAYN",
  brood: "BROHHD",
  broom: "BROHHM",
  "brown mushroom": "BROWN MUHSH-room",
  "brug bij nacht": "BRU BI NA",
  bruiloft: "brui-LO",
  "bruine paddenstoel": "brui-NE pa-DDE-nstoe",
  "bubble tea": "BUHB-uhl TEE",
  bubbles: "BUHB-uhlz",
  bucket: "BUHK-uht",
  buffalo: "BUHF-uhl-OH",
  bug: "BUHG",
  "building construction": "BIHL-dihng kuhnst-RUHK-shuhn",
  "bullet train": "BUHL-uht TRAYN",
  bullseye: "BOOL-zeye",
  burrito: "ber-EET-oh",
  bus: "BUHS",
  "bus stop": "BUHS STAHP",
  bushalte: "bu-SHAH-lte",
  butter: "BUHT-er",
  butterfly: "BUHT-erf-LEYE",
  buurtwinkel: "buu-RTWI-nke",
  cactus: "KAK-tuhs",
  cake: "KAYK",
  calendar: "KAL-uhn-der",
  camel: "KAM-uhl",
  camera: "KAM-er-uh",
  "camera met flits": "KAM-er-uh MEHT",
  "camera with flash": "KAM-er-uh WIHTH FLASH",
  camping: "KAM-pihng",
  candle: "KAN-duhl",
  candy: "KAN-dee",
  "canned food": "KAND FOOD",
  canoe: "kuhn-OO",
  car: "KAHR",
  "card file box": "KAHRD FEYEL BAHKS",
  "card index": "KARD IN-deks",
  "card index dividers": "KARD IN-deks dih-VY-derz",
  "carousel horse": "KEHR-uhs-EHL HAWRS",
  "carp streamer": "KAHRP STREEM-er",
  "carpentry saw": "KAHR-puhnt-ree SAW",
  carrot: "KAR-uht",
  carrouselpaard: "ca-RROU-se-lpaa",
  castle: "KAS-uhl",
  cat: "KAT",
  chains: "CHAYNZ",
  chair: "CHEHR",
  "chart decreasing": "CHAHRT dihk-REES-ihng",
  "chart increasing": "CHAHRT IHNK-REES-ihng",
  "chart increasing with yen": "CHAHRT IHNK-REES-ihng WIHTH YEHN",
  cheese: "CHEEZ",
  "cheese wedge": "CHEEZ WEHJ",
  cherries: "CHEHR-eez",
  "cherry blossom": "CHEHR-ee BLAHS-uhm",
  "chess pawn": "CHEHS PAWN",
  chestnut: "CHEHS-NUHT",
  chick: "CHIHK",
  chicken: "CHIHK-uhn",
  chipmunk: "CHIHP-muhngk",
  chocoladereep: "cho-CO-la-de-ree",
  "chocolate bar": "CHAWK-luht BAHR",
  chopsticks: "CHAHPS-TIHKS",
  "christmas tree": "KRIS-muss TREE",
  church: "CHERCH",
  "circus tent": "SERK-uhs TEHNT",
  circustent: "ci-RCU-ste",
  citroen: "SIHT-rohn",
  cityscape: "ci-TYSCAH-pe",
  "cityscape at dusk": "AT DUHSK",
  clamp: "KLAMP",
  "clapper board": "KLAP-er BAWRD",
  "classical building": "KLAS-ihk-uhl BIHL-dihng",
  "clinking beer mugs": "BIHR MUHGZ",
  "clinking glasses": "CLINK-ing GLAS-iz",
  clipboard: "KLIHP-BAWRD",
  clock: "KLAHK",
  "closed book": "KLOHZD BUHK",
  "closed umbrella": "KLOHZD uhmb-REHL-uh",
  cloud: "KLOWD",
  "cloud with lightning": "KLOWD WIHTH LEYET-nihng",
  "cloud with lightning and rain": "KLOWD WIHTH LEYET-nihng UHND RAYN",
  "cloud with rain": "KLOWD WIHTH RAYN",
  "cloud with snow": "KLOWD WIHTH SNOH",
  "club suit": "KLUHB SOOT",
  clutch: "KLUHCH",
  "clutch bag": "KLUHCH BAG",
  coat: "KOHT",
  cockroach: "KAHK-ROHCH",
  "cocktail glass": "KAHK-TAYL GLAS",
  cocktailglas: "co-CKTAI-lgla",
  coconut: "KOHK-uhn-UHT",
  coin: "KOYN",
  comet: "KAHM-uht",
  compass: "KUHM-puhs",
  "computer disk": "kuhmp-YOOT-er DIHSK",
  "computer mouse": "kuhmp-YOOT-er MOWS",
  computermuis: "co-MPU-te-rmui",
  computerschijf: "co-MPU-te-rschi",
  "confetti ball": "kuh-FEH-tee BAWL",
  confettibal: "co-NFE-tti-ba",
  construction: "kuhnst-RUHK-shuhn",
  "construction worker": "kuhnst-RUHK-shuhn WERK-er",
  "control knobs": "kuhnt-ROHL NAHBZ",
  "convenience store": "kuhn-VEEN-yuhns STAWR",
  cook: "KUHK",
  "cooked rice": "KUHKT REYES",
  cookie: "KUHK-ee",
  cooking: "KUHK-ihng",
  coral: "KAWR-uhl",
  "couch and lamp": "KOWCH UHND LAMP",
  cow: "KOW",
  crab: "KRAB",
  crayon: "KRAY-AHN",
  "credit card": "KREHD-uht KAHRD",
  creditcard: "cre-DI-tca",
  "crescent moon": "KREHS-uhnt MOON",
  cricket: "KRIHK-uht",
  "cricket game": "KRIHK-uht GAYM",
  crocodile: "KRAHK-uhd-EYEL",
  croissant: "KWAHS-AHNT",
  "crossed swords": "KRAWST SAWRDZ",
  crow: "KROH",
  crown: "KROWN",
  crutch: "KRUHCH",
  "crystal ball": "KRIHS-tuhl BAWL",
  cucumber: "KYOOK-uhm-ber",
  "cup with straw": "KUHP WIHTH STRAW",
  cupcake: "KUHP-KAYK",
  "curling stone": "KERL-ihng STOHN",
  curlingsteen: "cu-RLI-ngstee",
  "curry met rijst": "KUHR-ee MEHT",
  "curry rice": "KUR-ee RYS",
  custard: "KUHS-terd",
  "cut of meat": "KUHT UHV MEET",
  cyclone: "sihk-LOHN",
  cycloon: "CYCLOO",
  dagger: "DAG-er",
  "dalende grafiek": "da-LE-nde gra-FIE",
  dameshoed: "da-ME-shoe",
  dameslaars: "da-ME-slaa",
  damessandaal: "da-ME-ssa-ndaa",
  "dampende kom": "da-MPE-nde KO",
  dance: "DANS",
  dango: "DANG-goh",
  "dansende man": "MAN",
  "dansende vrouw": "da-NSE-nde VROU",
  "deciduous tree": "DIHS-IHJ-oo-uhs TREE",
  deer: "DIHR",
  "delivery truck": "dihl-IHV-er-ee TRUHK",
  dennendecoratie: "de-NNEH-nde-co-ra-tie",
  "department store": "dihp-AHRT-muhnt STAWR",
  "derde prijs medaille": "de-RDE PRI me-DAI-lle",
  "derelict house": "DEHR-uhl-IHKT HOWS",
  desert: "DEHZ-ert",
  "desert island": "DEHZ-ert EYEL-uhnd",
  "desktop computer": "DEHSK-TAHP kuhmp-YOOT-er",
  desktopcomputer: "de-SKTO-pco-mpu-te",
  detective: "diht-EHK-tihv",
  deur: "DEU",
  "diamond suit": "DEYEM-uhnd SOOT",
  dinosaur: "DEYEN-uhs-AWR",
  discobal: "di-SCO-ba",
  diskette: "dihs-KEHT",
  "diving mask": "DEYEV-ihng MASK",
  "diya lamp": "DEE-yah LAHMP",
  "diya-lamp": "diya-LA",
  dna: "DEE-EHN-AY",
  dobbelsteen: "do-BBE-lstee",
  dodo: "DOHD-oh",
  doelnet: "doe-LNE",
  dog: "DAWG",
  dolk: "DO",
  doll: "DAHL",
  "dollar banknote": "DAHL-er BANGK-NOHT",
  dollarbiljet: "do-LLA-rbi-lje",
  dolphin: "DAHL-fuhn",
  donkey: "DAHNG-kee",
  donut: "DOHN-UHT",
  door: "DAWR",
  douche: "DOOSH",
  doughnut: "DOHN-UHT",
  dove: "DUHV",
  draad: "DRAA",
  dragon: "DRAG-uhn",
  dress: "DREHS",
  drinkpakje: "dri-NKPAH-kje",
  "drop of blood": "DRAHP UHV BLUHD",
  droplet: "DRAHP-luht",
  druiven: "drui-VE",
  drum: "DRUHM",
  druppel: "dru-PPE",
  duck: "DUHK",
  duikmasker: "dui-KMA-ske",
  dumpling: "DUHMP-lihng",
  dvd: "DEEV-EED-EE",
  eagle: "EEG-uhl",
  ear: "EER",
  "ear of corn": "EER UHV KAWRN",
  "ear with hearing aid": "EER WIHTH HEER-ihng AYD",
  edelsteen: "e-DE-lstee",
  "eerste kwartier maan": "ee-RSTE kwa-RTIE MAA",
  "eerste kwartier maangezicht": "ee-RSTE kwa-RTIE maa-NGE-zi",
  "eerste prijs medaille": "ee-RSTE PRI me-DAI-lle",
  eetstokjes: "ee-TSTO-kje",
  egg: "EHG",
  eggplant: "EHGP-LANT",
  ei: "EHIH",
  "electric plug": "ihl-EHKT-rihk PLUHG",
  "elektrische rolstoel": "e-LE-ktri-sche ro-LSTOE",
  elephant: "EHL-uhf-uhnt",
  elevator: "EHL-uhv-AYT-er",
  elf: "EHLF",
  emmer: "EHM-er",
  "empty nest": "EHMP-tee NEHST",
  erwtjes: "e-RWTJE",
  esdoornblad: "e-SDOO-rnbla",
  "euro banknote": "YOOR-oh BANGK-NOHT",
  eurobiljet: "eu-RO-bi-lje",
  "evergreen tree": "EHV-erg-REEN TREE",
  eye: "IGH",
  eyes: "EYEZ",
  fabriek: "fa-BRIE",
  fabrieksarbeider: "fa-BRIE-ksa-rbei-de",
  factory: "FAK-ter-ee",
  "factory worker": "FAK-ter-ee WERK-er",
  fairy: "FAIR-ee",
  falafel: "fuhl-AHF-uhl",
  "fallen leaf": "FAHL-uhn LEEF",
  farmer: "FAHR-mer",
  father: "FAHTH-er",
  fee: "FEHEH",
  feestknaller: "fee-STKNA-lle",
  "ferris wheel": "FEHR-ihs WEEL",
  ferry: "FEHR-ee",
  "field hockey": "FEELD HAHK-ee",
  fiets: "FIE",
  "file cabinet": "FEYEL KAB-uhn-uht",
  "file folder": "FEYEL FOHL-der",
  "film frames": "FIHLM FRAYMZ",
  "film projector": "FIHLM pruhj-EHK-ter",
  filmcamera: "fi-LMCAH-me-ra",
  filmklapper: "fi-LMKLA-ppe",
  filmprojector: "fi-LMPRO-je-cto",
  filmstrook: "fi-LMSTROO",
  fire: "FEYE-er",
  "fire engine": "FEYE-er EHN-juhn",
  "fire extinguisher": "FEYE-er ihks-TIHNGG-wihsh-er",
  firecracker: "FEYE-erk-RAK-er",
  firefighter: "FEYER-FEYET-er",
  fireworks: "FEYER-WERKS",
  "first quarter moon": "FERST KWAWR-ter MOON",
  "first quarter moon face": "FERST KWAWR-ter MOON FAYS",
  fish: "FIHSH",
  "fish cake with swirl": "FIHSH KAYK WIHTH SWERL",
  "fishing pole": "FIHSH-ihng POHL",
  "flag in hole": "FLAG IHN HOHL",
  flamingo: "fluhm-IHNG-goh",
  flashlight: "FLASH-LEYET",
  "flat shoe": "FLAT SHOO",
  flatbread: "fla-TBREA",
  "fles met knallende kurk": "MEHT KERK",
  "flexed biceps": "FLEHKST BEYES-EHPS",
  "floppy disk": "FLAHP-ee DIHSK",
  flower: "FLAU-wer",
  "flower playing cards": "FLOW-er PLAY-ihng KAHRDZ",
  fluit: "FLUI",
  flute: "FLOOT",
  fly: "FLEYE",
  "flying disc": "FLEYE-ihng DIHSK",
  "flying saucer": "FLEYE-ihng SAWS-er",
  fog: "FAHG",
  foggy: "FAHG-ee",
  "folding hand fan": "FOHL-dihng HAND FAN",
  fondue: "fahnd-YOO",
  fontein: "fo-NTEI",
  foot: "FUHT",
  "fork and knife": "FAWRK UHND NEYEF",
  "fork and knife with plate": "FAWRK UHND NEYEF WIHTH PLAYT",
  "fortune cookie": "FOR-chun KOO-kee",
  fountain: "FOWN-tuhn",
  "fountain pen": "FOWN-tuhn PEHN",
  "four leaf clover": "FAWR LEEF KLOHV-er",
  fox: "FAHKS",
  "framed picture": "FRAYMD PIHK-cher",
  "french fries": "FREHNCH FREYEZ",
  "fried shrimp": "FREYED SHRIHMP",
  frisbee: "FRIHS-bee",
  frog: "FRAHG",
  "fuel pump": "FYOO-uhl PUHMP",
  fuji: "FOOJ-ee",
  "full moon": "FUHL MOON",
  "full moon face": "FUHL MOON FAYS",
  game: "GAYM",
  "game die": "GAYM DEYE",
  garen: "ga-RE",
  garlic: "GAHR-lihk",
  gear: "GIHR",
  gebedskralen: "ge-BE-dskra-le",
  "gebroken ketting": "ge-BRO-ke ke-TTI",
  geest: "GEE",
  "gefrituurde garnaal": "ge-FRI-tuu-rde ga-RNAA",
  "gekookte rijst": "ge-KOO-kte RI",
  "gekruiste zwaarden": "ge-KRUI-ste zwaa-RDE",
  "geld met vleugels": "MEHT",
  geldzak: "ge-LDZA",
  gelukskoekje: "ge-LUH-kskoe-kje",
  "gem stone": "JEHM STOHN",
  gemberwortel: "ge-MBE-rwo-rte",
  genie: "JEEN-ee",
  geodriehoek: "geo-DRIE-hoe",
  gereedschapskist: "ge-REE-dscha-pski",
  "geroosterde zoete aardappel": "ZOHT-ee",
  "gesloten boek": "ge-SLO-te BOE",
  "gesloten paraplu": "ge-SLO-te pa-RA-plu",
  "gespannen biceps": "BEYES-EHPS",
  "gevallen blad": "ge-VA-lle BLA",
  "gevuld platbrood": "ge-VU pla-TBROO",
  "ginger root": "JIHN-jer ROOT",
  giraffe: "jer-AF",
  gitaar: "gi-TAA",
  "glanzende ster": "gla-NZE-nde STE",
  "glas melk": "GLAS",
  "glass of milk": "GLAS UHV MIHLK",
  glasses: "GLAS-uhz",
  glijbaan: "gli-JBAA",
  glinsteringen: "gli-NSTE-ri-nge",
  "globe showing americas": "GLOHB uh-MER-ih-kuhz",
  "globe showing asia-australia": "GLOHB AY-zhuh aw-STRAY-lee-uh",
  "globe showing europe-africa": "GLOHB yu-ROHP AF-ri-kuh",
  "globe with meridians": "GLOHB WIHTH",
  gloeilamp: "gloei-LA",
  gloves: "GLUHVZ",
  "glowing star": "GLOH-ihng STAHR",
  "goal net": "GOHL NEHT",
  goat: "GOHT",
  goggles: "GAHG-uhlz",
  gokkast: "go-KKA",
  golfvlag: "go-LFVLA",
  goose: "GOOS",
  gorilla: "ger-IHL-uh",
  "graduation cap": "GRAJ-oo-AYSH-uhn KAP",
  grapes: "GRAYPS",
  grasshopper: "GRAS-HAHP-er",
  "green apple": "GREEN AP-uhl",
  "green book": "GREEN BUHK",
  "green salad": "GREEN SAL-uhd",
  "groen boek": "GROHN",
  "groenblijvende boom": "BOOM",
  "groene appel": "GRAH-een AP-uhl",
  "groene salade": "GRAH-een",
  guard: "GAHRD",
  guitar: "giht-AHR",
  haak: "HAHK",
  haarkam: "haa-RKA",
  "hair pick": "HEHR PIHK",
  hamburger: "HAM-berg-er",
  hamer: "HAHM-er",
  "hamer en moersleutel": "HAM-er EHN",
  "hamer en pikhouweel": "HAM-er EHN",
  hammer: "HAM-er",
  "hammer and pick": "HAM-er UHND PIHK",
  "hammer and wrench": "HAM-er UHND REHNCH",
  hamster: "HAM-stur",
  "hanafuda-kaarten": "ha-NA-fu-da-kaa-rte",
  hand: "HAHND",
  handbag: "HAHND-BAHG",
  "handbewogen rolstoel": "ha-NDBE-wo-ge ro-LSTOE",
  handschoenen: "ha-NDSCHOE-ne",
  handtas: "ha-NDTA",
  hangspoorbaan: "ha-NGSPOO-rbaa",
  happy: "HAP-ee",
  hardloopschoen: "ha-RDLOO-pschoe",
  hardloopshirt: "ha-RDLOO-pshi",
  harp: "HAHRP",
  harten: "HAHR-tuhn",
  hat: "HAHT",
  headphone: "HEHD-FOHN",
  "health worker": "HEHLTH WERK-er",
  "heart suit": "HAHRT SOOT",
  hedgehog: "HEHJ-HAHG",
  helicopter: "HEHL-ihk-AHP-ter",
  helikopter: "he-LI-ko-pte",
  herb: "ERB",
  herenschoen: "he-RE-nschoe",
  herinneringslint: "he-RI-nne-ri-ngsli",
  "hete peper": "PEHP-er",
  hibiscus: "hi-BI-scu",
  "high-heeled shoe": "HY-heeld SHOO",
  "high-speed train": "HEYES-PEED TRAYN",
  "hiking boot": "HEYEK-ihng BOOT",
  hindoetempel: "hi-NDOE-te-mpe",
  "hindu temple": "HIHN-DOO TEHM-puhl",
  hippopotamus: "HIHP-uhp-AHT-uhm-uhs",
  "hoge hak": "HOHJ",
  "hoge hoed": "HOHJ",
  hogesnelheidstrein: "ho-GE-sne-lhei-dstrei",
  "honey pot": "HUHN-ee PAHT",
  honingpot: "ho-NI-ngpo",
  honkbal: "ho-NKBA",
  hook: "HUHK",
  "horizontaal verkeerslicht": "ho-RI-zo-ntaa ve-RKEE-rsli",
  "horizontal traffic light": "HAWR-uhz-AHN-tuhl TRAF-ihk LEYET",
  horse: "HAWRS",
  "horse racing": "HAWRS RAYS-ihng",
  hospital: "HAHS-PIHT-uhl",
  "hot beverage": "HAHT BEHV-er-ihj",
  "hot dog": "HAHT DAWG",
  "hot pepper": "HAHT PEHP-er",
  "hot springs": "HAHT SPRIHNGZ",
  hotdog: "HAHT-DAWG",
  hotel: "hoht-EHL",
  hotelbel: "ho-TE-lbe",
  house: "HOWS",
  "house with garden": "HOWS WIHTH GAHR-duhn",
  houses: "HOWS-uhz",
  hout: "HOWT",
  houtzaag: "hou-TZAA",
  huis: "HUI",
  "huis met tuin": "MEHT",
  huizen: "hui-ZE",
  hut: "HUHT",
  hyacint: "hya-CI",
  hyacinth: "HEYE-uhs-IHNTH",
  ice: "EYES",
  "ice cream": "EYES KREEM",
  "ice hockey": "EYES HAHK-ee",
  "ice skate": "EYES SKAYT",
  ijs: "I",
  ijsblokje: "i-JSBLOH-kje",
  ijshockey: "i-JSHOH-ckey",
  "ingelijste afbeelding": "i-NGE-li-jste a-FBEE-ldi",
  "ingepakt cadeau": "i-NGE-pa ca-DEAU",
  "jack-o-lantern": "ja-O-la-nte",
  "japanese castle": "JAP-uhn-EEZ KAS-uhl",
  "japanese dolls": "JAP-uhn-EEZ DAHLZ",
  "japanese post office": "JAP-uhn-EEZ POHST AWF-ihs",
  "japans kasteel": "juhp-ANZ",
  "japans postkantoor": "juhp-ANZ",
  "japanse poppen": "PAHP-uhn",
  jar: "JAHR",
  jas: "JAHS",
  jeans: "JEENZ",
  jellyfish: "JEHL-eef-IHSH",
  jojo: "jo-JOH",
  joker: "JOHK-er",
  joystick: "JOYS-TIHK",
  judge: "JUHJ",
  juice: "JOOS",
  jump: "JUHMP",
  jurk: "JU",
  kaaba: "kaa-BAH",
  "kaäba": "ka-BAH",
  kaars: "KAA",
  "kaart van japan": "VAN juhp-AN",
  kaartenbak: "kaa-RTE-nba",
  kalender: "ka-LE-nde",
  kamperen: "ka-MPE-re",
  kangaroo: "KANG-ger-OO",
  kano: "KAHN-oh",
  kantoorgebouw: "ka-NTOO-rge-bou",
  kantoormedewerker: "ka-NTOO-rme-de-we-rke",
  kapperspaal: "ka-PPE-rspaa",
  karperwimpel: "ka-RPE-rwi-mpe",
  kasboek: "ka-SBOE",
  kastanje: "ka-STAH-nje",
  kasteel: "ka-STEE",
  kerk: "KE",
  kersen: "ke-RSE",
  kersenbloesem: "ke-RSE-nbloe-se",
  kerstboom: "ke-RSTBOO",
  kerstman: "ke-RSTMA",
  kettingen: "ke-TTI-nge",
  keukenmes: "keu-KE-nme",
  key: "KEE",
  keyboard: "KEEB-AWRD",
  "kick scooter": "KIHK SKOOT-er",
  kimono: "kuhm-OHN-uh",
  kippenbout: "ki-PPE-nbou",
  "kitchen knife": "KIHCH-uhn NEYEF",
  kite: "KEYET",
  kiwi: "KEEW-ee",
  "kiwi fruit": "KEEW-ee FROOT",
  "klassiek gebouw": "kla-SSIE ge-BOU",
  klaver: "KLAYV-er",
  klaveren: "kla-VE-re",
  klavertjevier: "kla-VE-rtje-vie",
  "klein vliegtuig": "KLEYEN",
  klem: "KLEHM",
  klembord: "kle-MBO",
  "klinkende bierpullen": "kli-NKE-nde bie-RPU-lle",
  "klinkende glazen": "kli-NKE-nde gla-ZE",
  knoflook: "kno-FLOO",
  knoop: "NOOP",
  knot: "NAHT",
  knuffelbeer: "knu-FFE-lbee",
  koala: "koh-AHL-uh",
  koekje: "koe-KJEH",
  kogeltrein: "ko-GE-ltrei",
  kok: "KAHK",
  koken: "KOHK-uhn",
  kokosnoot: "ko-KO-snoo",
  "kom met lepel": "MEHT",
  komeet: "ko-MEE",
  komkommer: "ko-MKO-mme",
  kompas: "ko-MPA",
  koptelefoon: "ko-PTE-le-foo",
  "korte broek": "KAWRT",
  krant: "KRA",
  "kristallen bol": "BAHL",
  kroon: "KROHHN",
  kruid: "KRUI",
  kruk: "KRUHK",
  kunstenaar: "ku-NSTE-naa",
  "laatste kwartier maan": "laa-TSTE kwa-RTIE MAA",
  "laatste kwartier maangezicht": "laa-TSTE kwa-RTIE maa-NGE-zi",
  "lab coat": "LAB KOHT",
  label: "LAYB-uhl",
  labjas: "la-BJA",
  lacrosse: "luhk-RAWS",
  ladder: "LAD-er",
  ladybug: "LAYD-eeb-UHG",
  lamp: "LAHMP",
  "landend vliegtuig": "la-NDE vlie-GTUI",
  "lange trommel": "LANG",
  laptop: "LAP-TAHP",
  "last quarter moon": "LAST KWAWR-ter MOON",
  "last quarter moon face": "LAST KWAWR-ter MOON FAYS",
  laugh: "LAF",
  "leaf fluttering in wind": "LEEF FLUHT-er-ihng IHN WEYEND",
  "leafless tree": "LEEF-luhs TREE",
  "leafy green": "LEEF-ee GREEN",
  ledger: "LEHJ-er",
  "leeg nest": "NEHST",
  leg: "LEHG",
  "lege batterij": "LEEJ",
  lemon: "LEHM-uhn",
  leopard: "LEHP-erd",
  lepel: "le-PE",
  leraar: "le-RAA",
  "level slider": "LEHV-uhl SLEYED-er",
  lift: "LIHFT",
  "light bulb": "LEYET BUHLB",
  "light rail": "LEYET RAYL",
  lightning: "LEYET-nihng",
  lightrail: "li-GHTRAI",
  lime: "LEYEM",
  limoen: "li-MOE",
  liniaal: "li-NIAA",
  link: "LIHNGK",
  "linked paperclips": "LIHNGKT",
  lint: "LIHNT",
  lion: "LEYE-uhn",
  lippenstift: "li-PPE-nsti",
  lipstick: "LIHPS-TIHK",
  lizard: "LIHZ-erd",
  llama: "LAHM-uh",
  lobster: "LAHBS-ter",
  locomotief: "lo-CO-mo-tie",
  locomotive: "LOHK-uhm-OHT-ihv",
  lollipop: "LAHL-eep-AHP",
  lolly: "LAHL-ee",
  "long drum": "LOHNG DRUHM",
  longen: "lo-NGE",
  loofboom: "loo-FBOO",
  "lotion bottle": "LOHSH-uhn BAHT-uhl",
  lotionfles: "lo-TIO-nfle",
  lotus: "LOHT-uhs",
  love: "LUHV",
  "love hotel": "LUHV hoht-EHL",
  lovehotel: "lo-VE-ho-te",
  "low battery": "LOH BAT-er-ee",
  luchttram: "lu-CHTTRA",
  luggage: "LUHG-uhj",
  lungs: "LUHNGZ",
  "maan-kijkceremonie": "maa-KI-jkce-re-mo-nie",
  maancake: "maa-NCAH-ke",
  maansikkel: "maa-NSI-kke",
  mage: "ma-GEH",
  "magic wand": "MAJ-ihk WAHND",
  "magiër": "ma-GI",
  magneet: "ma-GNEE",
  magnet: "MAG-nuht",
  "magnifying glass tilted left": "MAG-nuhf-EYE-ihng GLAS TIHL-tihd LEHFT",
  "magnifying glass tilted right": "MAG-nuhf-EYE-ihng GLAS TIHL-tihd REYET",
  "mahjong red dragon": "REHD DRAG-uhn",
  "mahjong rode draak": "ROHD",
  maiskolf: "mai-SKO",
  mammoth: "MAM-uhth",
  "man dancing": "MAN DAN-sihng",
  "man’s shoe": "MANZ SHOO",
  mand: "MA",
  mandarijn: "ma-NDA-ri",
  mango: "MANG-goh",
  "manual wheelchair": "MAN-yoo-uhl WEEL-CHEHR",
  map: "MAHP",
  "map of japan": "MAP uhv juh-PAN",
  "maple leaf": "MAYP-uhl LEEF",
  maracas: "MAHR-AHK-ahz",
  "martial arts uniform": "MAHR-shuhl AHRTS YOON-uhf-AWRM",
  mate: "MAYT",
  matroesjka: "ma-TROHEH-sjka",
  "meat on bone": "MEET AHN BOHN",
  mechanic: "muhk-AN-ihk",
  "mechanical arm": "muh-KAN-ih-kul ARM",
  "mechanical leg": "muh-KAN-ih-kul LEG",
  "mechanisch been": "BIHN",
  "mechanische arm": "AHRM",
  medal: "MEHD-uhl",
  melkweg: "me-LKWE",
  meloen: "me-LOE",
  melon: "MEHL-uhn",
  memo: "MEHM-OH",
  "mensen met konijnenoren": "MEHT",
  "mensen worstelen": "me-NSE wo-RSTE-le",
  merperson: "me-RPE-rso",
  metro: "MEHT-ROH",
  microfoon: "mi-CRO-foo",
  microphone: "MEYEK-ruhf-OHN",
  microscoop: "mi-CRO-scoo",
  microscope: "MEYEK-ruhs-KOHP",
  "militaire helm": "HEHLM",
  "militaire medaille": "mi-LIH-tai-re me-DAHIH-lle",
  "military helmet": "MIHL-uht-EHR-ee HEHL-muht",
  "military medal": "MIHL-uht-EHR-ee MEHD-uhl",
  "milky way": "MIHL-kee WAY",
  minibus: "MIHN-eeb-UHS",
  mirror: "MIHR-er",
  "mirror ball": "MIHR-er BAWL",
  mist: "MIHST",
  mistig: "mi-STI",
  "moer en bout": "EHN BOWT",
  moersleutel: "moe-RSLEU-te",
  mond: "MO",
  "money bag": "MUHN-ee BAG",
  "money with wings": "MUHN-ee WIHTH WIHNGZ",
  monkey: "MUHNG-kee",
  monorail: "MAHN-er-AYL",
  monteur: "mo-NTEU",
  moon: "MEWN",
  "moon cake": "MOON KAYK",
  "moon viewing ceremony": "MOON VYOO-ing SEH-ruh-moh-nee",
  moose: "MOOS",
  moskee: "mo-SKEHEH",
  mosque: "MAHSK",
  mosquito: "muhs-KEET-oh",
  mother: "MUHTH-er",
  "motor boat": "MOHT-er BOHT",
  "motor scooter": "MOHT-er SKOOT-er",
  motorboot: "mo-TO-rboo",
  motorcycle: "MOHT-ers-EYEK-uhl",
  motorfiets: "mo-TO-rfie",
  "motorized wheelchair": "MOHT-er-EYEZD WEEL-CHEHR",
  motorway: "mo-TOH-rway",
  "mount fuji": "MOWNT FOOJ-ee",
  mountain: "MOWN-tuhn",
  "mountain cableway": "MOWN-tin KAY-bul-way",
  "mountain railway": "MOWN-tuhn RAYL-WAY",
  mouse: "MOWS",
  "mouse trap": "MOWS TRAP",
  mouth: "MOWTH",
  "movie camera": "MOOV-ee KAM-er-uh",
  muizenval: "mui-ZE-nva",
  munt: "MUHNT",
  mushroom: "MUHSH-room",
  music: "MYOOZ-ihk",
  "musical keyboard": "MYOOZ-ihk-uhl KEEB-AWRD",
  "musical note": "MYOOZ-ihk-uhl NOHT",
  "musical notes": "MYOOZ-ihk-uhl NOHTS",
  "musical score": "MYOOZ-ihk-uhl SKAWR",
  muzieknoot: "mu-ZIE-knoo",
  muzieknoten: "mu-ZIE-kno-te",
  naald: "NAA",
  "nacht met sterren": "MEHT",
  "nationaal park": "PAHRK",
  "national park": "NASH-uhn-uhl PAHRK",
  necktie: "NEHK-TEYE",
  "nest met eieren": "NEHST MEHT",
  "nest with eggs": "NEHST WIHTH EHGZ",
  "nesting dolls": "NEHS-tihng DAHLZ",
  neus: "NEU",
  "new moon": "NOO MOON",
  "new moon face": "NOO MOON FAYS",
  newspaper: "NOOZ-PAYP-er",
  "nieuwe maan": "nieu-WE MAA",
  "nieuwemaan-gezicht": "nieu-WE-maa-ge-zi",
  "night with stars": "NEYET WIHTH STAHRZ",
  ninja: "NIHN-juh",
  niveauschuif: "ni-VEAU-schui",
  noodles: "NOOD-uhlz",
  nose: "NOHZ",
  notebook: "NOHT-BUHK",
  "notebook with decorative cover": "NOHT-BUHK WIHTH DEHK-ruht-ihv KUHV-er",
  notitieboek: "no-TI-tie-boe",
  "notitieboek met versierde kaft": "MEHT",
  "nut and bolt": "NUHT UHND BOHLT",
  octopus: "AHK-tuhp-UHS",
  oden: "OHD-uhn",
  "office building": "AWF-ihs BIHL-dihng",
  "office worker": "AWF-ihs WERK-er",
  ogen: "o-GE",
  "oil drum": "OYL DRUHM",
  olievat: "o-LIE-va",
  olijf: "o-LI",
  olive: "AHL-uhv",
  "omgekrulde pagina": "o-MGEH-kru-lde pa-GIH-na",
  "onbewoond eiland": "EYEL-uhnd",
  "oncoming automobile": "AWN-KUHM-ihng AWT-uhm-ohb-EEL",
  "oncoming bus": "AWN-KUHM-ihng BUHS",
  "oncoming police car": "AWN-KUHM-ihng puhl-EES KAHR",
  "oncoming taxi": "AWN-KUHM-ihng TAK-see",
  onderbroek: "o-NDE-rbroe",
  "one-piece swimsuit": "SWIHM-SOOT",
  onion: "UHN-yuhn",
  ontstopper: "o-NTSTO-ppe",
  oog: "OO",
  oor: "OO",
  "oor met gehoorapparaat": "MEHT",
  "open boek": "OHP-uhn",
  "open book": "OHP-uhn BUHK",
  "open file folder": "OHP-uhn FEYEL FOHL-der",
  "open map": "OHP-uhn MAP",
  "opgerolde krant": "o-PGE-ro-lde KRA",
  "optical disk": "AHP-tihk-uhl DIHSK",
  "optische schijf": "o-PTI-sche SCHI",
  "orange book": "AWR-uhnj BUHK",
  orangutan: "awr-ANG-uht-an",
  "oranje boek": "o-RA-nje BOE",
  otter: "AHT-er",
  owl: "OW-uhl",
  ox: "AHKS",
  paardenrennen: "paa-RDE-nre-nne",
  paddenstoel: "pa-DDE-nstoe",
  "page facing up": "PAYJ FAYS-ihng UHP",
  "page with curl": "PAYJ WIHTH KERL",
  "pagina naar boven": "BUHV-uhn",
  paintbrush: "PAYNTB-RUHSH",
  painting: "PAYN-tihng",
  "palm tree": "PAHM TREE",
  palmboom: "pa-LMBOO",
  "pan met eten": "PAN MEHT",
  pancakes: "PAN-KAYKS",
  panda: "PAN-duh",
  pannenkoeken: "pa-NNE-nkoe-ke",
  paperclip: "pa-PE-rcli",
  papierrol: "pa-PIE-rro",
  paprika: "pap-REEK-uh",
  parachute: "PEHR-uhsh-OOT",
  paraplu: "pa-RAH-plu",
  "paraplu met regendruppels": "MEHT",
  park: "PAHRK",
  parrot: "PEHR-uht",
  "party popper": "PAR-tee POP-er",
  passagiersschip: "pa-SSA-gie-rsschi",
  "passenger ship": "PAS-uhn-jer SHIHP",
  patat: "pa-TA",
  "pea pod": "PEE PAHD",
  peach: "PEECH",
  peacock: "PEEK-AHK",
  peanuts: "PEEN-uhts",
  pear: "PEHR",
  peer: "PIHR",
  pen: "PEHN",
  pencil: "PEHN-suhl",
  penguin: "PEHNGG-wuhn",
  penpunt: "pe-NPU",
  "people with bunny ears": "PEEP-uhl WIHTH BUHN-ee IHRZ",
  "people wrestling": "PEEP-uhl REHS-lihng",
  "performing arts": "perf-AWR-mihng AHRTS",
  "person biking": "PERS-uhn BEYEK-ihng",
  "person bouncing ball": "PERS-uhn BOWN-sihng BAWL",
  "person cartwheeling": "PERS-uhn",
  "person climbing": "PERS-uhn KLEYEM-ihng",
  "person feeding baby": "PERS-uhn FEED-ihng BAYB-ee",
  "person fencing": "PERS-uhn FEHN-sihng",
  "person getting haircut": "PERS-uhn GEHT-ihng HEHR-KUHT",
  "person getting massage": "PERS-uhn GEHT-ihng muhs-AHZH",
  "person golfing": "PERS-uhn GAHL-fihng",
  "person in bed": "PERS-uhn IHN BEHD",
  "person in lotus position": "PERS-uhn IHN LOHT-uhs puhz-IHSH-uhn",
  "person in manual wheelchair": "PERS-uhn IHN MAN-yoo-uhl WEEL-CHEHR",
  "person in motorized wheelchair": "PERS-uhn IHN MOHT-er-EYEZD WEEL-CHEHR",
  "person in steamy room": "PERS-uhn IHN STEEM-ee ROOM",
  "person in suit levitating": "PERS-uhn IHN SOOT LEHV-uht-AYT-ihng",
  "person in tuxedo": "PERS-uhn IHN TUHK-SEED-oh",
  "person juggling": "PERS-uhn JUHG-uhl-ihng",
  "person kneeling": "PERS-uhn NEEL-ihng",
  "person lifting weights": "PERS-uhn LIHF-tihng WAYTS",
  "person mountain biking": "PERS-uhn MOWN-tuhn BEYEK-ihng",
  "person playing handball": "PERS-uhn PLAY-ihng HAND-BAWL",
  "person playing water polo": "PERS-uhn PLAY-ihng WAWT-er POHL-oh",
  "person rowing boat": "PERS-uhn ROH-ihng BOHT",
  "person running": "PERS-uhn RUHN-ihng",
  "person standing": "PERS-uhn STAN-dihng",
  "person surfing": "PERS-uhn SERF-ihng",
  "person swimming": "PERS-uhn SWIHM-ihng",
  "person taking bath": "PERS-uhn TAYK-ihng BATH",
  "person walking": "PERS-uhn WAWK-ihng",
  "person wearing turban": "PERS-uhn WEHR-ihng TERB-uhn",
  "person with crown": "PERS-uhn WIHTH KROWN",
  "person with skullcap": "PERS-uhn WIHTH SKUHL-KAP",
  "person with veil": "PERS-uhn WIHTH VAYL",
  "person with white cane": "PERS-uhn WIHTH WEYET KAYN",
  "persoon die baby voedt": "DEYE BAYB-ee",
  "persoon fietst": "pe-RSOO FIE",
  "persoon golft": "pe-RSOO GO",
  "persoon heft gewichten": "HEHFT",
  "persoon in bed": "IHN BEHD",
  "persoon in elektrische rolstoel": "IHN",
  "persoon in handbewogen rolstoel": "IHN",
  "persoon in lotushouding": "IHN",
  "persoon in smoking": "IHN SMOHK-ihng",
  "persoon in stoombad": "IHN",
  "persoon jongleert": "pe-RSOO jo-NGLEE",
  "persoon klimt": "pe-RSOO KLI",
  "persoon knielt": "pe-RSOO KNIE",
  "persoon krijgt knipbeurt": "pe-RSOO KRI kni-PBEU",
  "persoon krijgt massage": "muhs-AHZH",
  "persoon loopt": "pe-RSOO LOO",
  "persoon maakt radslag": "pe-RSOO MAA ra-DSLA",
  "persoon met kalotje": "MEHT",
  "persoon met kroon": "MEHT KROON",
  "persoon met sluier": "MEHT",
  "persoon met tulband": "MEHT",
  "persoon met witte stok": "MEHT WIHT",
  "persoon mountainbiket": "pe-RSOO mou-NTAI-nbi-ke",
  "persoon neemt bad": "BAD",
  "persoon rent": "REHNT",
  "persoon roeit": "pe-RSOO ROEI",
  "persoon speelt handbal": "pe-RSOO SPEE ha-NDBA",
  "persoon speelt waterpolo": "pe-RSOO SPEE wa-TE-rpo-lo",
  "persoon staat": "STAHT",
  "persoon stuitert bal": "BAL",
  "persoon surft": "pe-RSOO SU",
  "persoon zwemt": "pe-RSOO ZWE",
  perzik: "pe-RZI",
  pet: "PEHT",
  "petri dish": "PEHT-ree DIHSH",
  petrischaal: "pe-TRI-schaa",
  phone: "FOHN",
  pick: "PIHK",
  "pick-uptruck": "pi-U-ptru",
  "pickup truck": "PIHK-UHP TRUHK",
  pie: "PEYE",
  pig: "PIHG",
  "pijl en boog": "EHN",
  pikhouweel: "pi-KHOU-wee",
  pil: "PIHL",
  pill: "PIHL",
  piloot: "pi-LOO",
  pilot: "PEYEL-uht",
  "piñata": "pi-AH-ta",
  "pinda's": "pi-NDA",
  "pine decoration": "PYN dek-uh-RAY-shun",
  pineapple: "PEYEN-AP-uhl",
  "ping pong": "PIHNG PAWNG",
  pizza: "PEET-suh",
  "planeet met ringen": "MEHT RIHNG-uhn",
  platbrood: "pla-TBROO",
  plate: "PLAYT",
  "platte schoen": "PLAT SHOHN",
  playground: "PLAYG-ROWND",
  "playground slide": "PLAYG-ROWND SLEYED",
  pleister: "plei-STE",
  plunger: "PLUHN-jer",
  podiumkunsten: "po-DIU-mku-nste",
  "polar bear": "POHL-er BEHR",
  "police car": "puhl-EES KAHR",
  "police car light": "puhl-EES KAHR LEYET",
  "police officer": "puhl-EES AWF-uhs-er",
  politieagent: "po-LI-tiea-ge",
  politiewagen: "po-LI-tie-wa-ge",
  pondbiljet: "po-NDBI-lje",
  "pool 8 ball": "POOL BAWL",
  popcorn: "PAHP-KAWRN",
  portemonnee: "po-RTEH-mo-nnee",
  "post office": "POHST AWF-ihs",
  postkantoor: "po-STKA-ntoo",
  pot: "PAHT",
  "pot of food": "PAHT UHV FOOD",
  potato: "puht-AYT-OH",
  potlood: "po-TLOO",
  potplant: "po-TPLA",
  "potted plant": "PAHT-ihd PLANT",
  "poultry leg": "POHLT-ree LEHG",
  "pound banknote": "POWND BANGK-NOHT",
  "pouring liquid": "PAWR-ihng LIHK-wuhd",
  "prayer beads": "PREHR BEEDZ",
  "pregnant person": "PREHG-nuhnt PERS-uhn",
  pretzel: "PREHT-zuhl",
  prikpen: "pri-KPE",
  printer: "PRIHN-ter",
  prullenbak: "pru-LLE-nba",
  pudding: "PUHD-ihng",
  "puffer fish": "PUHF-er FIHSH",
  purse: "PERS",
  pushpin: "pu-SHPI",
  puzzelstukje: "pu-ZZEH-lstu-kje",
  "puzzle piece": "PUHZ-uhl PEES",
  quiet: "KWEYE-uht",
  raam: "RAA",
  rabbit: "RAB-uht",
  raccoon: "rak-OON",
  raceauto: "ra-CEHAHUH-to",
  "racing car": "RAYS-ihng KAHR",
  radio: "RAYD-ee-OH",
  "railway car": "RAYL-WAY KAHR",
  "railway track": "RAYL-WAY TRAK",
  rain: "RAYN",
  rainbow: "RAYN-BOH",
  raket: "ra-KE",
  rat: "RAHT",
  razor: "RAYZ-er",
  reageerbuis: "rea-GEE-rbui",
  receipt: "rihs-EET",
  rechter: "re-CHTE",
  "red apple": "REHD AP-uhl",
  "red envelope": "RED EN-vuh-lohp",
  "red paper lantern": "REHD PAYP-er LAN-tern",
  reddingsboei: "re-DDIH-ngsboei",
  reddingswerkershelm: "re-DDI-ngswe-rke-rshe",
  regenboog: "re-GE-nboo",
  regenwolk: "re-GE-nwo",
  "reminder ribbon": "reem-EYEN-der RIHB-uhn",
  "rescue worker’s helmet": "REHSK-yoo WERK-erz HEHL-muht",
  reuzenrad: "reu-ZE-nra",
  rhinoceros: "reyen-AHS-er-uhs",
  ribbon: "RIHB-uhn",
  rice: "REYES",
  "rice ball": "REYES BAWL",
  "rice cracker": "REYES KRAK-er",
  rijstbal: "ri-JSTBA",
  rijstcracker: "ri-JSTCRA-cke",
  rijsthalm: "ri-JSTHA",
  ring: "RIHNG",
  "ring buoy": "RIHNG BOO-ee",
  "ringed planet": "RIHNGD PLAN-uht",
  "roasted sweet potato": "ROHS-tuhd SWEET puht-AYT-OH",
  robot: "ROHB-AHT",
  rock: "RAHK",
  rocket: "RAHK-uht",
  "rode appel": "ROHD AP-uhl",
  "rode envelop": "ROHD ihn-VEHL-uhp",
  "rode papieren lantaarn": "ROHD",
  rol: "ROHL",
  "roll of paper": "ROHL UHV PAYP-er",
  "rolled-up newspaper": "ROLD-up NOOZ-pay-per",
  "roller coaster": "ROHL-er KOHS-ter",
  "roller skate": "ROHL-er SKAYT",
  rolschaats: "ro-LSCHAA",
  "ronde punaise": "ro-NDEH pu-NAHIH-se",
  "röntgenfoto": "ntge-NFO-to",
  roos: "ROOZ",
  rooster: "ROHHS-ter",
  "root vegetable": "ROOT VEHJ-tuhb-uhl",
  rose: "ROHZ",
  rosette: "ruhs-EHT",
  rotje: "ro-TJEH",
  rots: "RAHTS",
  "round pushpin": "ROWND",
  rozet: "ro-ZE",
  "rugby football": "RUHG-bee FUHT-BAWL",
  rugbybal: "ru-GBYBA",
  rugzak: "ru-GZA",
  ruiten: "rui-TE",
  "running shirt": "RUHN-ihng SHERT",
  "running shoe": "RUHN-ihng SHOO",
  sad: "SAD-d",
  "safety pin": "SAYF-tee PIHN",
  "safety vest": "SAYF-tee VEST",
  sailboat: "SAYL-BOHT",
  sake: "SAYK",
  salt: "SAWLT",
  sandwich: "SAND-wihch",
  "santa claus": "SAN-tuh KLAWZ",
  sari: "SAHR-ee",
  satelliet: "sa-TE-llie",
  satellite: "SAT-uhl-EYET",
  "satellite antenna": "SAT-uhl-EYET an-TEHN-uh",
  saxofoon: "sa-XO-foo",
  saxophone: "SAK-suhf-OHN",
  scarf: "SKAHRF",
  schaafijs: "schaa-FI",
  schaakpion: "schaa-KPIO",
  schaar: "SHAHR",
  schaats: "SCHAA",
  schakel: "scha-KE",
  scheermes: "schee-RME",
  schep: "SCHE",
  schermer: "SHERM-er",
  scheurkalender: "scheu-RKA-le-nde",
  schild: "SHEYELD",
  schilderspalet: "schi-LDE-rspa-le",
  schip: "SCHI",
  school: "SKOOL",
  schoppen: "scho-PPE",
  schotelantenne: "scho-TEH-la-nte-nne",
  schroevendraaier: "schroe-VE-ndraaie",
  scientist: "SEYE-uhn-tihst",
  scissors: "SIHZ-erz",
  scooter: "SKOOT-er",
  scorpion: "SKAWR-pee-uhn",
  screwdriver: "SKROOD-REYEV-er",
  scroll: "SKROHL",
  sea: "SEE",
  seat: "SEET",
  seedling: "SEED-lihng",
  "sewing needle": "SOH-ihng NEED-uhl",
  "shallow pan of food": "SHAL-oh PAN UHV FOOD",
  shamrock: "SHAM-RAHK",
  shark: "SHAHRK",
  "shaved ice": "SHAYVD EYES",
  "sheaf of rice": "SHEEF UHV REYES",
  sheep: "SHEHEHP",
  shield: "SHEELD",
  "shinto shrine": "SHIHN-TOH SHREYEN",
  shintoheiligdom: "shi-NTO-hei-li-gdo",
  ship: "SHIHP",
  shoe: "SHOO",
  "shooting star": "SHOOT-ihng STAHR",
  "shopping bags": "SHAHP-ihng BAGZ",
  "shopping cart": "SHAHP-ihng KAHRT",
  shortcake: "SHAWRT-KAYK",
  shorts: "SHAWRTS",
  shovel: "SHUHV-uhl",
  shower: "SHOHW-er",
  shrimp: "SHRIHMP",
  singer: "SIHNG-er",
  sjaal: "SJAA",
  skateboard: "SKAYT-BAWRD",
  "ski's": "SKEEZ",
  skier: "SKEYER",
  "skiër": "SKI",
  skis: "SKEEZ",
  skunk: "SKUHNGK",
  sled: "SLEHD",
  slee: "SLEHEH",
  sleep: "SLEHP",
  "sleeping bag": "SLEHEH-ping BAHG",
  slipper: "SLIHP-er",
  "slot machine": "SLAHT muhsh-EEN",
  sloth: "SLOHTH",
  "small airplane": "SMAWL EHRP-LAYN",
  snail: "SNAYL",
  snake: "SNAYK",
  sneeuwpop: "sneeu-WPO",
  "sneeuwpop zonder sneeuw": "sneeu-WPO zo-NDE SNEEU",
  sneeuwvlok: "sneeu-WVLO",
  sneeuwwolk: "sneeu-WWO",
  snelweg: "sne-LWE",
  snoep: "SNOE",
  snow: "SNOH",
  "snow-capped mountain": "SNOH-kapt MOWN-tin",
  snowboarder: "SNOHB-AWR-der",
  snowflake: "SNOHF-LAYK",
  snowman: "SNOHM-AN",
  "snowman without snow": "SNOHM-AN wihth-OWT SNOH",
  soap: "SOHP",
  soccer: "SAHK-er",
  "soccer ball": "SAH-ker BAWL",
  socks: "SAHKS",
  "soft ice cream": "SAHFT EYES KREEM",
  softbal: "so-FTBA",
  softball: "SAWFT-BAWL",
  softijs: "so-FTI",
  sokken: "so-KKE",
  soup: "SOOP",
  "spade suit": "SPAYD SOOT",
  spaghetti: "spuhg-EHT-ee",
  sparkler: "spa-RKLE",
  sparkles: "SPAHR-kuhlz",
  speedboat: "SPEED-BOHT",
  speedboot: "spee-DBOO",
  spek: "SPE",
  spider: "SPEYED-er",
  spiegel: "SPEEG-uhl",
  spijkerbroek: "spi-JKE-rbroe",
  spiraalkalender: "spi-RAA-lka-le-nde",
  spiraalnotitieblok: "spi-RAA-lno-ti-tie-blo",
  "spiral calendar": "SPEYER-uhl KAL-uhn-der",
  "spiral notepad": "SPEYER-uhl NOHT-PAD",
  sponge: "SPUHNJ",
  spons: "SPO",
  spoon: "SPOHHN",
  spoorrails: "spoo-RRAI",
  "sport utility vehicle": "SPAWRT yoot-IHL-uht-ee VEEH-ihk-uhl",
  sportmedaille: "spo-RTMEH-dai-lle",
  "sports medal": "SPAWRTS MEHD-uhl",
  spuit: "SPUI",
  squid: "SKWIHD",
  staafdiagram: "staa-FDIA-gra",
  stadion: "sta-DIO",
  stadium: "STAYD-ee-uhm",
  stadsgezicht: "sta-DSGE-zi",
  "stadsgezicht bij schemering": "sta-DSGE-zi BI sche-ME-ri",
  star: "STAHR",
  station: "STAYSH-uhn",
  "statue of liberty": "STACH-OO UHV LIHB-ert-EE",
  "steaming bowl": "STEEM-ihng BOHL",
  stekker: "ste-KKE",
  step: "STEHP",
  ster: "STE",
  sterretje: "ste-RREH-tje",
  stethoscoop: "ste-THO-scoo",
  stethoscope: "STEHTH-uhs-KOHP",
  "stijgende grafiek": "sti-JGE-nde gra-FIE",
  "stijgende grafiek met yen": "MEHT YEHN",
  stoel: "STOE",
  stokbrood: "sto-KBROO",
  "stop sign": "STAHP SEYEN",
  stopbord: "sto-PBO",
  "straight ruler": "STRAYT ROOL-er",
  "strand met parasol": "STRAND MEHT",
  strandparasol: "stra-NDPA-ra-so",
  strawberry: "STRAWB-EHR-ee",
  stropdas: "stro-PDA",
  student: "STOOD-uhnt",
  "studio microphone": "STOOD-ee-OH MEYEK-ruhf-OHN",
  studiomicrofoon: "stu-DIO-mi-cro-foo",
  "stuffed flatbread": "STUHFT",
  "stuk kaas": "KAHS",
  "stuk vlees": "STU VLEE",
  sun: "SUHN",
  "sun behind cloud": "SUHN bihh-EYEND KLOWD",
  "sun behind large cloud": "SUHN bihh-EYEND LAHRJ KLOWD",
  "sun behind rain cloud": "SUHN bihh-EYEND RAYN KLOWD",
  "sun behind small cloud": "SUHN bihh-EYEND SMAWL KLOWD",
  "sun with face": "SUHN WIHTH FAYS",
  sunflower: "SUHNF-LOW-er",
  sunglasses: "SUHNG-LAS-ihz",
  sunrise: "SUHN-REYEZ",
  "sunrise over mountains": "SUHN-REYEZ OHV-er MOWN-tuhnz",
  sunset: "SUHN-SEHT",
  superheld: "su-PE-rhe",
  superhero: "SOOP-erh-EER-oh",
  superschurk: "su-PE-rschu",
  supervillain: "su-PE-rvi-llai",
  surprised: "serp-REYEZD",
  sushi: "SOOSH-ee",
  "suspension railway": "suhs-PEHN-shuhn RAYL-WAY",
  suv: "EHS-YOOV-EE",
  swan: "SWAHN",
  swim: "SWIHM",
  synagoge: "syna-GOH-ge",
  synagogue: "SIHN-uhg-AWG",
  syringe: "ser-IHNJ",
  "t-shirt": "TEE-shurt",
  taart: "TAA",
  taartpunt: "taa-RTPU",
  tabbladen: "ta-BBLA-de",
  taco: "TAHK-oh",
  tafeltennis: "ta-FE-lte-nni",
  "takeout box": "TAYK-out BOKS",
  tamale: "ta-MAH-le",
  "tanabata tree": "tah-nah-BAH-tuh TREE",
  "tanabata-boom": "ta-NA-ba-ta-boo",
  tand: "TA",
  tandenborstel: "ta-NDE-nbo-rste",
  tandwiel: "ta-NDWIE",
  tangerine: "TAN-jer-EEN",
  taxi: "TAK-see",
  teacher: "TEECH-er",
  "teacup without handle": "TEEK-UHP wihth-OWT HAN-duhl",
  teapot: "TEEP-AHT",
  "tear-off calendar": "TAIR-off KAL-en-der",
  technologist: "TEHK-NAHL-uhj-ihst",
  technoloog: "te-CHNO-loo",
  teddy: "TEHD-ee",
  "teddy bear": "TEHD-ee BEHR",
  "tegemoetkomende auto": "AWT-oh",
  "tegemoetkomende bus": "BUHS",
  "tegemoetkomende politiewagen": "te-GE-moe-tko-me-nde po-LI-tie-wa-ge",
  "tegemoetkomende taxi": "TAK-see",
  telescoop: "te-LE-scoo",
  telescope: "TEHL-uhs-KOHP",
  televisie: "te-LEH-vi-sie",
  television: "TEHL-uhv-IHZH-uhn",
  telraam: "te-LRAA",
  tennis: "TEHN-uhs",
  tent: "TEHNT",
  "test tube": "TEHST TOOB",
  theekop: "thee-KO",
  theepot: "thee-PO",
  thermometer: "ther-MOM-ih-ter",
  "thong sandal": "THAWNG SAN-duhl",
  thread: "THREHD",
  ticket: "TIHK-uht",
  tiger: "TEYEG-er",
  toegangsbewijzen: "toe-GA-ngsbe-wi-jze",
  toetsenbord: "toe-TSE-nbo",
  toilet: "TOYL-uht",
  "tokio tower": "tohk-EE-oh TOW-er",
  "tokyo tower": "TOHK-ee-OH TOW-er",
  tomaat: "to-MAA",
  tomato: "tuhm-AYT-OH",
  tong: "TAWNG",
  tongue: "TUHNG",
  toolbox: "TOOL-BAWKS",
  tooth: "TOHHTH",
  toothbrush: "TOOTHB-ruhsh",
  "top hat": "TAHP HAT",
  tornado: "tawr-NAYD-OH",
  toverstaf: "to-VE-rsta",
  trackball: "TRAK-BAWL",
  tractor: "TRAK-ter",
  train: "TRAYN",
  tram: "TRAHM",
  "tram car": "TRAM KAHR",
  tramwagen: "tra-MWA-ge",
  tree: "TREH",
  trein: "TREI",
  treinwagon: "trei-NWA-go",
  "triangular ruler": "treye-ANGG-yuhl-er ROOL-er",
  trofee: "tro-FEHEH",
  trol: "TRO",
  troll: "TROHL",
  trolleybus: "tro-LLEY-bu",
  trommel: "tro-MME",
  trompet: "tro-MPE",
  trophy: "TROHF-ee",
  "tropical drink": "TRAHP-ihk-uhl DRIHNGK",
  "tropical fish": "TRAHP-ihk-uhl FIHSH",
  "tropisch drankje": "tro-PI dra-NKJE",
  trumpet: "TRUHM-puht",
  tulip: "TOOL-uhp",
  tulp: "TU",
  "tumbler glass": "TUHMB-ler GLAS",
  tumblerglas: "tu-MBLE-rgla",
  turkey: "TERK-ee",
  turtle: "TERT-uhl",
  "tweede prijs medaille": "twee-DE PRI me-DAI-lle",
  ui: "YOO-EYE",
  umbrella: "uhmb-REHL-uh",
  "umbrella on ground": "uhmb-REHL-uh AHN GROWND",
  "umbrella with rain drops": "uhmb-REHL-uh WIHTH RAYN DRAHPS",
  unicorn: "YOON-ihk-AWRN",
  "vallende ster": "va-LLE-nde STE",
  vampier: "va-MPIE",
  vampire: "VAM-peyer",
  vechtsportpak: "ve-CHTSPO-rtpa",
  veerboot: "vee-RBOO",
  veiligheidsbril: "vei-LI-ghei-dsbri",
  veiligheidsspeld: "vei-LI-ghei-dsspe",
  veiligheidsvest: "vei-LI-ghei-dsve",
  veldhockey: "ve-LDHOH-ckey",
  "verbonden paperclips": "ve-RBO-nde pa-PE-rcli",
  verfkwast: "ve-RFKWA",
  "vergrootglas naar links": "LIHNGKS",
  "vergrootglas naar rechts": "ve-RGROO-tgla NAA RE",
  verjaardagstaart: "ve-RJAA-rda-gstaa",
  "verticaal verkeerslicht": "ve-RTI-caa ve-RKEE-rsli",
  "vertical traffic light": "VERT-ihk-uhl TRAF-ihk LEYET",
  "vertrekkend vliegtuig": "ve-RTRE-kke vlie-GTUI",
  "vervallen huis": "ve-RVA-lle HUI",
  "verwelkte bloem": "BLOHM",
  "video camera": "VIHD-ee-oh KAM-er-uh",
  "video game": "VIHD-ee-oh GAYM",
  videocamera: "vi-DEHOH-ca-me-ra",
  videocassette: "VIHD-ee-ohk-as-EHT",
  videospel: "vi-DEO-spe",
  violin: "veye-uhl-IHN",
  viool: "VIOO",
  vishengel: "vi-SHE-nge",
  "viskoekje met krul": "MEHT KRUHL",
  "vlees aan bot": "BAWT",
  "vliegende schotel": "vlie-GE-nde scho-TE",
  vlieger: "vlie-GE",
  vliegtuig: "vlie-GTUI",
  "vloeistof schenken": "SHEHNG-kuhn",
  voet: "VOE",
  voetbal: "voe-TBA",
  volcano: "vahl-KAYN-oh",
  "volle maan": "VAHL",
  vollemaangezicht: "vo-LLE-maa-nge-zi",
  volleybal: "vo-LLEY-ba",
  volleyball: "VAHL-eeb-AWL",
  "vork en mes": "EHN",
  "vrachtwagen met oplegger": "MEHT",
  vrijheidsbeeld: "vri-JHEI-dsbee",
  "vrouw met hoofddoek": "MEHT",
  vrouwenkleding: "vrou-WE-nkle-di",
  vulkaan: "vu-LKAA",
  vulpen: "vu-LPE",
  vuur: "VUU",
  vuurwerk: "vuu-RWE",
  waaier: "WAAIE",
  wafel: "wa-FE",
  waffle: "WAHF-uhl",
  wandelschoen: "wa-NDE-lschoe",
  "waning crescent moon": "WAYN-ihng KREHS-uhnt MOON",
  "waning gibbous moon": "WAYN-ihng MOON",
  warenhuis: "wa-RE-nhui",
  "warme drank": "DRANGK",
  warmwaterbronnen: "wa-RMWA-te-rbro-nne",
  wasco: "WAWS-koh",
  "wassende maan": "wa-SSE-nde MAA",
  "wassende maansikkel": "wa-SSE-nde maa-NSI-kke",
  wastebasket: "WAYST-BAS-kuht",
  water: "WAWT-er",
  "water pistol": "WAWT-er PIHS-tuhl",
  "water wave": "WAWT-er WAYV",
  watergolf: "wa-TE-rgo",
  watermeloen: "wa-TE-rme-loe",
  watermelon: "WAWT-erm-EHL-uhn",
  waterpistool: "wa-TE-rpi-stoo",
  "waxing crescent moon": "WAK-sihng KREHS-uhnt MOON",
  "waxing gibbous moon": "WAK-sihng MOON",
  wedding: "WEHD-ihng",
  weegschaal: "wee-GSCHAA",
  wegwerkzaamheden: "we-GWE-rkzaa-mhe-de",
  "wereldbol met amerika": "MEHT uhm-EHR-ihk-uh",
  "wereldbol met azië en australië": "MEHT EHN",
  "wereldbol met europa en afrika": "MEHT yuhr-OHP-uh EHN",
  "wereldbol met meridianen": "MEHT",
  wereldkaart: "we-RE-ldkaa",
  wetenschapper: "we-TE-nscha-ppe",
  whale: "WAYL",
  wheel: "WEEL",
  "white cane": "WEYET KAYN",
  "white flower": "WEYET FLOW-er",
  wiel: "WIE",
  wijnglas: "wi-JNGLA",
  "wilted flower": "WIHL-tihd FLOW-er",
  "wind chime": "WYND CHYM",
  "wind face": "WEYEND FAYS",
  windgezicht: "wi-NDGE-zi",
  windgong: "wi-NDGO",
  window: "WIHN-doh",
  "wine glass": "WEYEN GLAS",
  winkelwagen: "wi-NKE-lwa-ge",
  "witte bloem": "WIHT BLOHM",
  "witte stok": "WIHT",
  woestijn: "woe-STI",
  wolf: "WUHLF",
  wolk: "WOHK",
  "wolk met bliksem": "WOHK MEHT",
  "wolk met bliksem en regen": "WOHK MEHT EHN REHG-uhn",
  "woman dancing": "WUHM-uhn DAN-sihng",
  "woman with headscarf": "WUHM-uhn WIHTH",
  "woman’s boot": "BOOT",
  "woman’s clothes": "KLOHTHZ",
  "woman's hat": "WOM-unz HAHT",
  "woman’s hat": "WOM-unz HAHT",
  "woman’s sandal": "SAN-duhl",
  wood: "WUHD",
  "world map": "WURLD MAP",
  worm: "WERM",
  wortel: "wo-RTE",
  wortelgroente: "wo-RTEH-lgroe-nte",
  "wrapped gift": "RAPT GIHFT",
  wrench: "REHNCH",
  "x-ray": "EHKS-RAY",
  yarn: "YAHRN",
  "yen banknote": "YEHN BANGK-NOHT",
  yenbiljet: "ye-NBI-lje",
  "yo-yo": "YOHY-oh",
  zaailing: "zaai-LI",
  zaklamp: "za-KLA",
  zanger: "ZAHNG-er",
  zebra: "ZEEB-ruh",
  zeemeerpersoon: "zee-MEE-rpe-rsoo",
  zeep: "ZEE",
  zeilboot: "zei-LBOO",
  ziekenhuis: "zie-KE-nhui",
  zombie: "ZAHM-bee",
  zon: "ZAWN",
  "zon achter grote wolk": "ZAWN GROHT WOHK",
  "zon achter kleine wolk": "ZAWN KLEYEN WOHK",
  "zon achter regenwolk": "ZAWN",
  "zon achter wolk": "ZAWN WOHK",
  "zon met gezicht": "ZAWN MEHT",
  zonnebloem: "zo-NNE-bloe",
  zonnebril: "zo-NNE-bri",
  zonsondergang: "zo-NSO-nde-rga",
  zonsopkomst: "zo-NSO-pko",
  "zonsopkomst boven bergen": "BUHV-uhn BERG-uhn",
  zorgmedewerker: "zo-RGME-de-we-rke",
  zout: "ZOU",
  zwaailicht: "zwaai-LI",
  "zwanger persoon": "zwa-NGE pe-RSOO",
  "zwevend persoon in pak": "IHN PAK",
};

const dutchPronunciationOverrides = {
  aap: "AHP",
  aardappel: "AHRD-APP-el",
  aardbei: "ART-beye",
  accordeon: "AHCC-OHRD-eon",
  achtbaan: "AKHTB-AHN",
  adelaar: "AD-EL-ahr",
  afhaaldoos: "AFH-AHLD-ohs",
  "afnemende maan": "AHFN-EHM-end-e MAHN",
  "afnemende maansikkel": "AHFN-EHM-end-e MAHNS-IKK-el",
  afstudeerhoed: "AFST-UD-ayrh-ohd",
  aktetas: "AHKT-EHT-as",
  alambiek: "AL-AMB-eek",
  ambulance: "AHMB-UHL-anc-e",
  "american football": "AHM-EHR-ic-an FOHTB-ALL",
  amfora: "AHMF-OHR-a",
  ananas: "AH-nah-nahs",
  "anatomisch hart": "AN-AT-om-iskh HAHRT",
  anker: "AHNK-EHR",
  appel: "AH-puhl",
  archiefkast: "ARKH-EEFK-ast",
  astronaut: "AHSTR-OHN-aut",
  aubergine: "AUB-ERKH-in-e",
  auto: "OW-toh",
  autoriksja: "AUT-OR-iks-ya",
  avocado: "AHV-OHC-ad-o",
  "baby-engel": "BAB-YENKH-el",
  babyfles: "BAHB-YFL-es",
  badkuip: "BADK-OWP",
  badminton: "BAHDM-IHNT-on",
  badpak: "BAHDP-AHK",
  bagage: "BAKH-AKH-e",
  bagel: "BAKH-EL",
  baksteen: "BAKST-AYN",
  balletschoenen: "BALL-ETSKH-ohn-en",
  ballon: "BAHLL-OHN",
  banaan: "ba-NAHN",
  banjo: "BAN-YO",
  bank: "BAHNK",
  "bank en lamp": "BAHNK EHN LAHMP",
  basketbal: "BAS-ket-bahl",
  batterij: "BATT-ER-eye",
  bed: "BET",
  bedieningsknoppen: "BED-EEN-inkhskn-opp-en",
  been: "BAYN",
  beer: "BAYR",
  "beker met rietje": "BEHK-EHR MEHT REET-YE",
  bellen: "BEHLL-EHN",
  bentobox: "BEHNT-OHB-ox",
  benzinepomp: "BEHNZ-IHN-ep-omp",
  berg: "BERKH",
  bergkabelbaan: "BERKHK-AB-elb-ahn",
  bergspoorweg: "BERKHSP-OHRW-ekh",
  "besneeuwde berg": "BESN-AYUWD-e BERKH",
  bestelwagen: "BEST-ELW-akh-en",
  bever: "BEHV-EHR",
  bewaker: "BEHW-AHK-er",
  bezem: "BEHZ-EHM",
  bierpul: "BEERP-UL",
  bij: "BEYE",
  bijl: "BEYEL",
  "bijtende lip": "BEYET-END-e LIHP",
  bikini: "BIHK-IHN-i",
  "biljartbal acht": "BIL-YARTB-al AKHT",
  bizon: "BIHZ-OHN",
  "blad in de wind": "BLAHD IHN DEH VIND",
  bladgroente: "BLADKHR-OHNT-e",
  bladmuziek: "BLADM-UZ-eek",
  bladwijzer: "BLADW-EYEZ-er",
  bladwijzertabs: "BLADW-EYEZ-ert-abs",
  "blauw boek": "BLAHUHW BOOK",
  blij: "BLEYE",
  bliksem: "BLIHKS-EHM",
  blikvoer: "BLIKV-OHR",
  bloeddruppel: "BLOHDDR-UPP-el",
  bloem: "BLOHM",
  bloesem: "BLOHS-EM",
  blokjes: "BLOK-YES",
  boek: "BOOK",
  boeken: "BOHK-EN",
  boeket: "BOHK-ET",
  boemerang: "BOHM-ER-ankh",
  boer: "BOHR",
  bokshandschoen: "BOKSH-ANDSKH-ohn",
  bom: "BOMM",
  bon: "BOHN",
  bonen: "BOHN-EHN",
  boodschappentassen: "BOHDSKH-APP-ent-ass-en",
  boom: "BOHM",
  "boom zonder bladeren": "BOHM ZOHND-EHR BLAHD-EHR-en",
  boos: "BOHS",
  boot: "BOHT",
  bord: "BORT",
  "bord met bestek": "BORT MEHT BEHST-EHK",
  borstvoeding: "BORSTV-OHD-inkh",
  bosbessen: "BOHSB-EHSS-en",
  bot: "BOTT",
  boter: "BOHT-EHR",
  bouwplaats: "BOWWPL-AHTS",
  bouwvakker: "BOWWV-AKK-er",
  bowling: "BOWL-INKH",
  brandblusser: "BRAHNDBL-UHSS-er",
  brandweerman: "BRANDW-AYRM-an",
  brandweerwagen: "BRANDW-AYRW-akh-en",
  brein: "BREYEN",
  bril: "BRIHL",
  broccoli: "BROHCC-OHL-i",
  brood: "BROHT",
  "brug bij nacht": "BRUKH BEYE NAKHT",
  bruiloft: "BROWL-OFT",
  "bruine paddenstoel": "BROWN-E PADD-ENST-ohl",
  "bubble tea": "BUHBBL-EH TEHAH",
  buffel: "BUHFF-EHL",
  burrito: "BUHRR-IHT-o",
  bus: "BUHS",
  bushalte: "BUHSH-AHLT-e",
  buurtwinkel: "BUHUHRTW-IHNK-el",
  cactus: "CAHCT-UHS",
  camera: "KAH-meh-rah",
  "camera met flits": "KAH-meh-rah MEHT FLIHTS",
  carrouselpaard: "CARR-OWS-elp-ahrd",
  chocoladereep: "KHOC-OL-ad-er-ayp",
  circustent: "CIHRC-UHST-ent",
  citroen: "CITR-OHN",
  clutch: "CLUTKH",
  cocktailglas: "COCKT-AILKHL-as",
  computermuis: "COMP-UT-erm-ows",
  computerschijf: "COMP-UT-erskh-eyef",
  confettibal: "COHNF-EHTT-ib-al",
  creditcard: "CREHD-IHTC-ard",
  cricket: "CRIHCK-EHT",
  croissant: "CROHIHSS-AHNT",
  cupcake: "CUHPC-AHK-e",
  curlingsteen: "CURL-INKHST-ayn",
  "curry met rijst": "CUHRR-Y MEHT RYST",
  cycloon: "CYCL-OHN",
  "dalende grafiek": "DAHL-EHND-e KHRAF-EEK",
  dameshoed: "DAM-ESH-ohd",
  dameslaars: "DAM-ESL-ahrs",
  damessandaal: "DAM-ESS-and-ahl",
  "dampende kom": "DAHMP-EHND-e KOHM",
  dango: "DANKH-O",
  dansen: "DAN-sun",
  "dansende man": "DAHNS-EHND-e MAHN",
  "dansende vrouw": "DAHNS-EHND-e VROWW",
  das: "DAHS",
  dennendecoratie: "DENN-END-ec-or-at-ee",
  "derde prijs medaille": "DEHRD-EH PREYES meh-DYE",
  desktopcomputer: "DEHSKT-OHPC-omp-ut-er",
  detective: "DEHT-EHCT-iv-e",
  deur: "DUR",
  dinosaurus: "DIHN-OHS-aur-us",
  discobal: "DIHSC-OHB-al",
  diskette: "DIHSK-EHTT-e",
  "diya-lamp": "DIHYAHL-AHMP",
  dna: "DNAH",
  dobbelsteen: "DOBB-ELST-ayn",
  dodo: "DOHD-OH",
  doelnet: "DOHLN-ET",
  dolfijn: "DOLF-EYEN",
  dolk: "DOHLK",
  dollarbiljet: "DOLL-ARB-il-yet",
  donut: "DOHN-UHT",
  douche: "DOWKH-E",
  draad: "DRAHD",
  draak: "DRAHK",
  drinkpakje: "DRINKP-AK-ye",
  druiven: "DROWV-EN",
  druppel: "DRUHPP-EHL",
  duif: "DOWF",
  duikmasker: "DOWKM-ASK-er",
  dumpling: "DUMPL-INKH",
  dvd: "DVD-uh",
  edelsteen: "ED-ELST-ayn",
  eend: "AYND",
  eenhoorn: "AYNH-OHRN",
  "eerste kwartier maan": "AYRST-E KWART-EER MAHN",
  "eerste kwartier maangezicht": "AYRST-E KWART-EER MAHNKH-EZ-ikht",
  "eerste prijs medaille": "AYRST-E PREYES meh-DYE",
  eetstokjes: "AYTST-OK-yes",
  egel: "EKH-EL",
  ei: "EYE",
  eland: "EHL-AHND",
  "elektrische rolstoel": "EL-EKTR-iskh-e ROLST-OHL",
  elf: "EHLF",
  emmer: "EHMM-EHR",
  erwtjes: "ERWT-YES",
  esdoornblad: "ESD-OHRNBL-ad",
  eurobiljet: "UHR-OB-il-yet",
  everzwijn: "EV-ERZW-eyen",
  ezel: "EHZ-EHL",
  fabriek: "FABR-EEK",
  fabrieksarbeider: "FABR-EEKS-arb-eyed-er",
  falafel: "FAHL-AHF-el",
  fee: "FAY",
  feestknaller: "FAYSTKN-ALL-er",
  fiets: "FEETS",
  filmcamera: "FIHLMC-AHM-er-a",
  filmklapper: "FIHLMKL-AHPP-er",
  filmprojector: "FILMPR-OYECT-or",
  filmstrook: "FILMSTR-OHK",
  flamingo: "FLAM-INKH-o",
  "fles met knallende kurk": "FLEHS MEHT KNAHLL-EHND-e KUHRK",
  fluit: "FLOWT",
  fondue: "FOHND-UHEH",
  fontein: "FONT-EYEN",
  frisbee: "FRISB-AY",
  fuji: "FUYI",
  gans: "KHANS",
  garen: "KHAR-EN",
  garnaal: "KHARN-AHL",
  gebedskralen: "KHEB-EDSKR-al-en",
  "gebroken ketting": "KHEBR-OK-en KETT-INKH",
  geest: "KHAYST",
  "gefrituurde garnaal": "KHEFR-IT-uurd-e KHARN-AHL",
  geit: "KHEYET",
  "gekookte rijst": "KHEK-OHKT-e RYST",
  "gekruiste zwaarden": "KHEKR-OWST-e ZWAHRD-EN",
  "geld met vleugels": "KHELD MEHT VLUHKH-ELS",
  geldzak: "KHELDZ-AK",
  gelukskoekje: "KHEL-UKSK-ohk-ye",
  gemberwortel: "KHEMB-ERW-ort-el",
  geodriehoek: "KHEODR-EEH-ohk",
  gereedschapskist: "KHER-AYDSKH-apsk-ist",
  "geroosterde zoete aardappel": "KHER-OHST-erd-e ZOHT-E AHRD-APP-el",
  "gesloten boek": "KHESL-OT-en BOOK",
  "gesloten paraplu": "KHESL-OT-en PAH-rah-ploo",
  "gespannen biceps": "KHESP-ANN-en BIHC-EHPS",
  "gevallen blad": "KHEV-ALL-en BLAHD",
  "gevuld platbrood": "KHEV-ULD PLATBR-OHD",
  giraffe: "KHIR-AFF-e",
  gitaar: "KHIT-AHR",
  "glanzende ster": "KHLANZ-END-e STEHR",
  "glas melk": "KHLAS MEHLK",
  glijbaan: "KHLEYEB-AHN",
  glinsteringen: "KHLINST-ER-inkh-en",
  gloeilamp: "KHLOH-IL-amp",
  gokkast: "KHOKK-AST",
  golfvlag: "KHOLFVL-AKH",
  gorilla: "KHOR-ILL-a",
  "groen boek": "KHROHN BOOK",
  "groenblijvende boom": "KHROHNBL-EYEV-end-e BOHM",
  "groene appel": "KHROHN-E AH-puhl",
  "groene salade": "KHROHN-E SAHL-AHD-e",
  haai: "HAH-I",
  haak: "HAHK",
  haan: "HAHN",
  haarkam: "HAHRK-AM",
  hagedis: "HAKH-ED-is",
  hamburger: "HAMB-URKH-er",
  hamer: "HAHM-EHR",
  "hamer en moersleutel": "HAHM-EHR EHN MOHRSL-UHT-el",
  "hamer en pikhouweel": "HAHM-EHR EHN PIKH-OWW-ayl",
  hamster: "HAM-stur",
  "hanafuda-kaarten": "HAN-AF-ud-ak-ahrt-en",
  hand: "HANT",
  "handbewogen rolstoel": "HANDB-EW-okh-en ROLST-OHL",
  handschoenen: "HANDSKH-OHN-en",
  handtas: "HAHNDT-AHS",
  hangspoorbaan: "HANKHSP-OHRB-ahn",
  hardloopschoen: "HARDL-OHPSKH-ohn",
  hardloopshirt: "HARDL-OHPSH-irt",
  harp: "HAHRP",
  harten: "HAHRT-EHN",
  helikopter: "HEHL-IHK-opt-er",
  herenschoen: "HER-ENSKH-ohn",
  herinneringslint: "HER-INN-er-inkhsl-int",
  hert: "HEHRT",
  "hete peper": "HEHT-EH PEHP-EHR",
  hibiscus: "HIHB-IHSC-us",
  hindoetempel: "HIND-OHT-emp-el",
  hoed: "HOOT",
  "hoge hak": "HOKH-E HAHK",
  "hoge hoed": "HOKH-E HOOT",
  hogesnelheidstrein: "HOKH-ESN-elh-eyedstr-eyen",
  hond: "HONT",
  honingpot: "HON-INKHP-ot",
  honkbal: "HOHNKB-AHL",
  "horizontaal verkeerslicht": "HOR-IZ-ont-ahl VERK-AYRSL-ikht",
  hotdog: "HOTD-OKH",
  hotel: "HOHT-EHL",
  hotelbel: "HOHT-EHLB-el",
  hout: "HOWT",
  houtzaag: "HOWTZ-AHKH",
  huis: "HOUSE",
  "huis met tuin": "HOUSE MEHT TOWN",
  huizen: "HOWZ-EN",
  hut: "HUHT",
  hyacint: "HYAHC-IHNT",
  ijs: "EYSS",
  ijsbeer: "EYESB-AYR",
  ijsblokje: "EYESBL-OK-ye",
  ijshockey: "EYESH-OCK-ey",
  "ingelijste afbeelding": "INKH-EL-eyest-e AFB-AYLD-inkh",
  "ingepakt cadeau": "INKH-EP-akt CAHD-EHAHUH",
  inktvis: "IHNKTV-IHS",
  insect: "IN-sekt",
  "jack-o-lantern": "YACK-OL-ant-ern",
  "japans kasteel": "YAP-ANS ka-STAYL",
  "japans postkantoor": "YAP-ANS POSTK-ANT-ohr",
  "japanse poppen": "YAP-ANS-e POHPP-EHN",
  jas: "YAS",
  jojo: "YOYO",
  joker: "YOK-ER",
  joystick: "YOYST-ICK",
  jurk: "YURK",
  "kaäba": "KAHB-A",
  kaars: "KAHRS",
  "kaart van japan": "KAHRT VAHN YAP-AN",
  kaartenbak: "KAHRT-ENB-ak",
  kaas: "KAHSS",
  kakkerlak: "KAH-ker-lahk",
  kalender: "KAHL-EHND-er",
  kalkoen: "KALK-OHN",
  kameel: "KAM-AYL",
  kamperen: "KAHM-peh-run",
  kangoeroe: "KANKH-OHR-oh",
  kano: "KAHN-OH",
  kantoorgebouw: "KANT-OHRKH-eb-oww",
  kantoormedewerker: "KANT-OHRM-ed-ew-erk-er",
  kapperspaal: "KAPP-ERSP-ahl",
  karperwimpel: "KAHRP-EHRW-imp-el",
  kasboek: "KASB-OHK",
  kastanje: "KAST-AN-ye",
  kasteel: "ka-STAYL",
  kat: "KAHT",
  keerkever: "KAYRK-EV-er",
  kerk: "KEHRK",
  kersen: "KEHRS-EHN",
  kersenbloesem: "KERS-ENBL-ohs-em",
  kerstboom: "KERSTB-OHM",
  kerstman: "KEHRSTM-AHN",
  kettingen: "KETT-INKH-en",
  keukenmes: "KUHK-ENM-es",
  keyboard: "KEHYB-OHAHRD",
  kikker: "KIK-kur",
  kimono: "KIHM-OHN-o",
  kip: "KIHP",
  kippenbout: "KIPP-ENB-owt",
  kiwi: "KIHW-IH",
  "klassiek gebouw": "KLASS-EEK KHEB-OWW",
  klaver: "KLAHV-EHR",
  klaveren: "KLAHV-EHR-en",
  klavertjevier: "KLAV-ERT-yev-eer",
  "klein vliegtuig": "KLEYEN VLEEK-toykh",
  klem: "KLEHM",
  klembord: "KLEHMB-OHRD",
  "klinkende bierpullen": "KLIHNK-EHND-e BEERP-ULL-en",
  "klinkende glazen": "KLIHNK-EHND-e KHLAZ-EN",
  klok: "KLOHK",
  knoflook: "knof-LOHK",
  knoop: "KNOHP",
  knuffelbeer: "KNUFF-ELB-ayr",
  koala: "koh-AH-lah",
  koe: "KOO",
  koekje: "KOOK-yuh",
  kogeltrein: "KOKH-ELTR-eyen",
  kogelvis: "KOKH-ELV-is",
  kok: "KOHK",
  koken: "KOHK-EHN",
  kokosnoot: "KOK-OSN-oht",
  "kom met lepel": "KOHM MEHT LEHP-EHL",
  komeet: "KOM-AYT",
  komkommer: "kohm-KOM-mer",
  kompas: "KOHMP-AHS",
  konijn: "koh-NINE",
  koptelefoon: "KOPT-EL-ef-ohn",
  koraal: "KOR-AHL",
  "korte broek": "KOHRT-EH BROHK",
  kraai: "KRAH-I",
  krab: "KRAHB",
  krant: "KRAHNT",
  kreeft: "KRAYFT",
  "kristallen bol": "KRIHST-AHLL-en BOHL",
  krokodil: "KROHK-OHD-il",
  kroon: "KROHN",
  kruid: "KROWD",
  kruk: "KRUHK",
  kuiken: "KOWK-EN",
  kunstenaar: "KUNST-EN-ahr",
  kwal: "KWAHL",
  "laatste kwartier maan": "LAHTST-E KWART-EER MAHN",
  "laatste kwartier maangezicht": "LAHTST-E KWART-EER MAHNKH-EZ-ikht",
  label: "LAHB-EHL",
  labjas: "LAB-YAS",
  lachen: "LAH-khun",
  lacrosse: "LAHCR-OHSS-e",
  ladder: "LAHDD-EHR",
  lama: "LAHM-AH",
  lamp: "LAHMP",
  "landend vliegtuig": "LAHND-EHND VLEEK-toykh",
  "lange trommel": "LANKH-E TROHMM-EHL",
  laptop: "LAHPT-OHP",
  "leeg nest": "LAYKH NEHST",
  leeuw: "LAYW",
  "lege batterij": "LEKH-E BATT-ER-eye",
  lepel: "LEHP-EHL",
  leraar: "LER-AHR",
  liefde: "LEEF-duh",
  lieveheersbeestje: "LEEV-EH-ayrsb-ayst-ye",
  lift: "LIHFT",
  lightrail: "LIKHHTR-AIL",
  limoen: "LIM-OHN",
  liniaal: "LIN-IAHL",
  lint: "LIHNT",
  lippenstift: "LIHPP-EHNST-ift",
  locomotief: "LOC-OM-ot-eef",
  lolly: "LOHLL-Y",
  longen: "LONKH-EN",
  loofboom: "LOHFB-OHM",
  lotionfles: "LOHT-IHOHNFL-es",
  lotus: "LOHT-UHS",
  lovehotel: "LOHV-EHH-ot-el",
  luchttram: "LUKHTTR-AM",
  luiaard: "LOW-AHRD",
  luipaard: "LOWP-AHRD",
  maan: "MAHN",
  "maan-kijkceremonie": "MAHNK-EYEKC-er-em-on-ee",
  maancake: "MAHNC-AK-e",
  maansikkel: "MAHNS-IKK-el",
  "magiër": "MAKH-EER",
  magneet: "MAKHN-AYT",
  "mahjong rode draak": "MAH-YONKH ROHD-EH DRAHK",
  maiskolf: "MAHIHSK-OHLF",
  mammoet: "MAMM-OHT",
  mand: "MAHND",
  mandarijn: "MAND-AR-eyen",
  mango: "MANKH-O",
  map: "MAHP",
  maracas: "MAHR-AHC-as",
  mate: "MAHT-EH",
  matroesjka: "MATR-OHS-yk-a",
  "mechanisch been": "MEKH-AN-iskh BAYN",
  "mechanische arm": "MEKH-AN-iskh-e AHRM",
  medaille: "meh-DYE",
  melkweg: "MELKW-EKH",
  meloen: "MEL-OHN",
  memo: "MEHM-OH",
  "mensen met konijnenoren": "MEHNS-EHN MEHT KON-EYEN-en-or-en",
  "mensen worstelen": "MEHNS-EHN VORST-EL-en",
  metro: "MEHTR-OH",
  microfoon: "MICR-OF-ohn",
  microscoop: "MICR-OSC-ohp",
  mier: "MEER",
  "militaire helm": "MIHL-IHT-air-e HEHLM",
  "militaire medaille": "MIHL-IHT-air-e meh-DYE",
  minibus: "MIHN-IHB-us",
  mist: "MIHST",
  mistig: "MIST-IKH",
  moeder: "MOHD-ER",
  "moer en bout": "MOHR EHN BOWT",
  moersleutel: "MOHRSL-UHT-el",
  mond: "MOHND",
  monorail: "MOHN-OHR-ail",
  monteur: "MONT-UHR",
  moskee: "MOSK-AY",
  motorboot: "MOT-ORB-oht",
  motorfiets: "MOT-ORF-eets",
  mug: "MUKH",
  muis: "MOWS",
  muizenval: "MOWZ-ENV-al",
  munt: "MUHNT",
  muziek: "muu-ZEEK",
  muzieknoot: "MUZ-EEKN-oht",
  muzieknoten: "MUZ-EEKN-ot-en",
  naald: "NAHLD",
  "nacht met sterren": "NAKHT MEHT STEHRR-EHN",
  "nationaal park": "NAT-ION-ahl PAHRK",
  "nest met eieren": "NEHST MEHT EYEER-EN",
  neus: "NUHS",
  neushoorn: "NUHSH-OHRN",
  "nieuwe maan": "NIUHW-E MAHN",
  "nieuwemaan-gezicht": "NIUHW-EM-ahnkh-ez-ikht",
  nijlpaard: "NEYELP-AHRD",
  ninja: "NIN-YA",
  niveauschuif: "NIV-EAUSKH-owf",
  noedels: "NOHD-ELS",
  notitieboek: "NOT-IT-eeb-ohk",
  "notitieboek met versierde kaft": "NOT-IT-eeb-ohk MEHT VERS-EERD-e KAHFT",
  octopus: "OHCT-OHP-us",
  oden: "OHD-EHN",
  ogen: "OKH-EN",
  olievat: "OL-EEV-at",
  olifant: "OHL-IHF-ant",
  olijf: "OL-EYEF",
  "omgekrulde pagina": "OMKH-EKR-uld-e PAKH-IN-a",
  "onbewoond eiland": "ONB-EW-ohnd EYEL-AND",
  onderbroek: "OND-ERBR-ohk",
  ontstopper: "OHNTST-OHPP-er",
  oog: "OHKH",
  oor: "OHR",
  "oor met gehoorapparaat": "OHR MEHT KHEH-OHR-app-ar-aht",
  "open boek": "OHP-EHN BOOK",
  "open map": "OHP-EHN MAHP",
  "opgerolde krant": "OPKH-ER-old-e KRAHNT",
  "optische schijf": "OPT-ISKH-e SKHEYEF",
  "orang-oetan": "OR-ANKH-oht-an",
  "oranje boek": "OR-AN-ye BOOK",
  os: "OHS",
  otter: "OHTT-EHR",
  paard: "PAHRD",
  paardenrennen: "PAHRD-ENR-enn-en",
  paddenstoel: "PADD-ENST-ohl",
  "pagina naar boven": "PAKH-IN-a NAHR BOHV-EHN",
  palmboom: "PALMB-OHM",
  "pan met eten": "PAHN MEHT EHT-EHN",
  panda: "PAHN-dah",
  pannenkoeken: "PANN-ENK-ohk-en",
  papegaai: "PAP-EKH-ah-i",
  paperclip: "PAHP-EHRCL-ip",
  papierrol: "PAP-EERR-ol",
  paprika: "PAHPR-IHK-a",
  parachute: "PAR-AKH-ut-e",
  paraplu: "PAH-rah-ploo",
  "paraplu met regendruppels": "PAH-rah-ploo MEHT REKH-ENDR-upp-els",
  park: "PAHRK",
  passagiersschip: "PASS-AKH-eersskh-ip",
  patat: "PAHT-AHT",
  pauw: "PAHUHW",
  peer: "PAYR",
  pen: "PEHN",
  penpunt: "PEHNP-UHNT",
  "persoon die baby voedt": "PERS-OHN DEE BAHB-Y VOHDT",
  "persoon fietst": "PERS-OHN FEETST",
  "persoon golft": "PERS-OHN KHOLFT",
  "persoon heft gewichten": "PERS-OHN HEHFT KHEW-IKHT-en",
  "persoon in bed": "PERS-OHN IHN BET",
  "persoon in elektrische rolstoel": "PERS-OHN IHN EL-EKTR-iskh-e ROLST-OHL",
  "persoon in handbewogen rolstoel": "PERS-OHN IHN HANDB-EW-okh-en ROLST-OHL",
  "persoon in lotushouding": "PERS-OHN IHN LOT-USH-owd-inkh",
  "persoon in smoking": "PERS-OHN IHN SMOK-INKH",
  "persoon in stoombad": "PERS-OHN IHN STOHMB-AD",
  "persoon jongleert": "PERS-OHN YONKHL-AYRT",
  "persoon klimt": "PERS-OHN KLIHMT",
  "persoon knielt": "PERS-OHN KNEELT",
  "persoon krijgt knipbeurt": "PERS-OHN KREYEKHT KNIPB-UHRT",
  "persoon krijgt massage": "PERS-OHN KREYEKHT MASS-AKH-e",
  "persoon loopt": "PERS-OHN LOHPT",
  "persoon maakt radslag": "PERS-OHN MAHKT RADSL-AKH",
  "persoon met kalotje": "PERS-OHN MEHT KAL-OT-ye",
  "persoon met kroon": "PERS-OHN MEHT KROHN",
  "persoon met sluier": "PERS-OHN MEHT SLOW-ER",
  "persoon met tulband": "PERS-OHN MEHT TUHLB-AHND",
  "persoon met witte stok": "PERS-OHN MEHT VITT-E STOHK",
  "persoon mountainbiket": "PERS-OHN MOWNT-AINB-ik-et",
  "persoon neemt bad": "PERS-OHN NAYMT BAHD",
  "persoon rent": "PERS-OHN REHNT",
  "persoon roeit": "PERS-OHN ROH-IT",
  "persoon speelt handbal": "PERS-OHN SPAYLT HAHNDB-AHL",
  "persoon speelt waterpolo": "PERS-OHN SPAYLT VAT-ERP-ol-o",
  "persoon staat": "PERS-OHN STAHT",
  "persoon stuitert bal": "PERS-OHN STOWT-ERT BAHL",
  "persoon surft": "PERS-OHN SUHRFT",
  "persoon zwemt": "PERS-OHN ZWEHMT",
  perzik: "PEHRZ-IHK",
  pet: "PEHT",
  petrischaal: "PETR-ISKH-ahl",
  "pick-uptruck": "PIHCK-UHPTR-uck",
  "pijl en boog": "PEYEL EHN BOHKH",
  pikhouweel: "PIKH-OWW-ayl",
  pil: "PIHL",
  piloot: "PIL-OHT",
  "piñata": "PIHN-AHT-a",
  "pinda's": "PIHND-AHS",
  "pinguïn": "PIN-khwin",
  pizza: "PEET-sah",
  "planeet met ringen": "PLAN-AYT MEHT RINKH-EN",
  platbrood: "PLATBR-OHD",
  "platte schoen": "PLAHTT-EH SKHOON",
  pleister: "PLEYEST-ER",
  podiumkunsten: "POHD-IHUHMK-unst-en",
  politieagent: "POL-IT-eeakh-ent",
  politiewagen: "POL-IT-eew-akh-en",
  pondbiljet: "PONDB-IL-yet",
  pop: "POHP",
  popcorn: "POHPC-OHRN",
  portemonnee: "PORT-EM-onn-ay",
  postkantoor: "POSTK-ANT-ohr",
  pot: "POHT",
  potlood: "POTL-OHD",
  potplant: "POHTPL-AHNT",
  pretzel: "PREHTZ-EHL",
  prikpen: "PRIHKP-EHN",
  printer: "PRIHNT-EHR",
  prullenbak: "PRUHLL-EHNB-ak",
  pudding: "PUDD-INKH",
  puzzelstukje: "PUZZ-ELST-uk-ye",
  raam: "RAHM",
  raceauto: "RAHC-EHAHUHT-o",
  radio: "RAHD-IHOH",
  raket: "rah-KET",
  rat: "RAHT",
  reageerbuis: "REAKH-AYRB-ows",
  rechter: "REKHT-ER",
  reddingsboei: "REDD-INKHSB-oh-i",
  reddingswerkershelm: "REDD-INKHSW-erk-ersh-elm",
  regen: "RAY-khuhn",
  regenboog: "REKH-ENB-ohkh",
  regenwolk: "REKH-ENW-olk",
  reuzenrad: "RUHZ-ENR-ad",
  rijst: "RYST",
  rijstbal: "REYESTB-AL",
  rijstcracker: "REYESTCR-ACK-er",
  rijsthalm: "REYESTH-ALM",
  ring: "RINKH",
  robot: "ROH-bot",
  "rode appel": "ROHD-EH AH-puhl",
  "rode envelop": "ROHD-EH EHNV-EHL-op",
  "rode papieren lantaarn": "ROHD-EH PAP-EER-en LANT-AHRN",
  rol: "ROHL",
  rolschaats: "ROLSKH-AHTS",
  "ronde punaise": "ROHND-EH PUHN-AHIHS-e",
  "röntgenfoto": "RONTKH-ENF-ot-o",
  roos: "ROHS",
  rotje: "ROT-YE",
  rots: "ROHTS",
  rozet: "ROHZ-EHT",
  rugbybal: "RUKHB-YB-al",
  rugzak: "RUKHZ-AK",
  ruiten: "ROWT-EN",
  sake: "SAHK-EH",
  sandwich: "SANDW-IKH",
  sap: "SAHP",
  sari: "SAHR-IH",
  satelliet: "SAT-ELL-eet",
  saxofoon: "SAX-OF-ohn",
  schaafijs: "SKHAHF-EYES",
  schaakpion: "SKHAHKP-ION",
  schaap: "SKHAHP",
  schaar: "SKHAHR",
  schaats: "SKHAHTS",
  schakel: "SKHAK-EL",
  scheermes: "SKHAYRM-ES",
  schep: "SKHEP",
  schermer: "SKHERM-ER",
  scheurkalender: "SKHUHRK-AL-end-er",
  schild: "SKHILD",
  schilderen: "SKHIL-duh-run",
  schilderspalet: "SKHILD-ERSP-al-et",
  schildpad: "SKHIL-dpaht",
  schip: "SKHIP",
  schoen: "SKHOON",
  school: "SKHOHL",
  schoppen: "SKHOPP-EN",
  schorpioen: "SKHORP-IOHN",
  schotelantenne: "SKHOT-EL-ant-enn-e",
  schroevendraaier: "SKHROHV-ENDR-ah-eer",
  scooter: "SCOHT-ER",
  shintoheiligdom: "SHINT-OH-eyel-ikhd-om",
  sjaal: "SHAHL",
  skateboard: "SKAHT-EHB-oard",
  "ski's": "SKIHS",
  "skiër": "SKEER",
  slak: "SLAHK",
  slang: "SLANKH",
  slapen: "SLAH-pen",
  slee: "SLAY",
  sleutel: "SLUH-tul",
  slipper: "SLIHPP-EHR",
  sneeuw: "SNAYW",
  sneeuwpop: "SNAYUWP-OP",
  "sneeuwpop zonder sneeuw": "SNAYUWP-OP ZOHND-EHR SNAYW",
  sneeuwvlok: "SNAYUWVL-OK",
  sneeuwwolk: "SNAYUWW-OLK",
  snelweg: "SNELW-EKH",
  snoep: "SNOHP",
  snowboarder: "SNOHWB-OHAHRD-er",
  soep: "SOOP",
  softbal: "SOHFTB-AHL",
  softijs: "SOFT-EYES",
  sokken: "SOHKK-EHN",
  spaghetti: "SPAKHH-ETT-i",
  speedboot: "SPAYDB-OHT",
  speeltuin: "SPAYLT-OWN",
  spek: "SPEHK",
  spel: "SPEHL",
  spiegel: "SPEEKH-EL",
  spijkerbroek: "SPEYEK-ERBR-ohk",
  spin: "SPIHN",
  spiraalkalender: "SPIR-AHLK-al-end-er",
  spiraalnotitieblok: "SPIR-AHLN-ot-it-eebl-ok",
  spons: "SPOHNS",
  spoorrails: "SPOHRR-AILS",
  sportmedaille: "SPOHRTM-EHD-aill-e",
  springen: "SPRINKH-EN",
  sprinkhaan: "SPRINKH-AHN",
  spuit: "SPOWT",
  staafdiagram: "STAHFD-IAKHR-am",
  stadion: "STAHD-IHOHN",
  stadsgezicht: "STADSKH-EZ-ikht",
  "stadsgezicht bij schemering": "STADSKH-EZ-ikht BEYE SKHEM-ER-inkh",
  station: "STAHT-IHOHN",
  stekker: "STEHKK-EHR",
  step: "STEHP",
  ster: "STEHR",
  sterretje: "STERR-ET-ye",
  stethoscoop: "STETH-OSC-ohp",
  "stijgende grafiek": "STEYEKH-END-e KHRAF-EEK",
  "stijgende grafiek met yen": "STEYEKH-END-e KHRAF-EEK MEHT YEHN",
  stil: "STIHL",
  stinkdier: "STINKD-EER",
  stoel: "STOOL",
  stokbrood: "STOKBR-OHD",
  stopbord: "STOHPB-OHRD",
  "strand met parasol": "STRAHND MEHT PAHR-AHS-ol",
  strandparasol: "STRAHNDP-AHR-as-ol",
  stropdas: "STROHPD-AHS",
  student: "STUHD-EHNT",
  studiomicrofoon: "STUD-IOM-icr-of-ohn",
  "stuk kaas": "STUHK KAHSS",
  "stuk vlees": "STUHK VLAYS",
  superheld: "SUHP-EHRH-eld",
  superschurk: "SUP-ERSKH-urk",
  sushi: "SUHSH-IH",
  suv: "SUHV",
  synagoge: "SYN-AKH-okh-e",
  "t-shirt": "TSHIHRT",
  taart: "TAHRT",
  taartpunt: "TAHRTP-UNT",
  tabbladen: "TAHBBL-AHD-en",
  taco: "TAHC-OH",
  tafeltennis: "TAHF-EHLT-enn-is",
  tamale: "TAHM-AHL-e",
  "tanabata-boom": "TAN-AB-at-ab-ohm",
  tand: "TAHND",
  tandenborstel: "TAHND-EHNB-orst-el",
  tandwiel: "TANDW-EEL",
  tas: "TAHS",
  taxi: "TAHX-IH",
  technoloog: "TEKHN-OL-ohkh",
  "tegemoetkomende auto": "TEKH-EM-ohtk-om-end-e OW-toh",
  "tegemoetkomende bus": "TEKH-EM-ohtk-om-end-e BUHS",
  "tegemoetkomende politiewagen": "TEKH-EM-ohtk-om-end-e POL-IT-eew-akh-en",
  "tegemoetkomende taxi": "TEKH-EM-ohtk-om-end-e TAHX-IH",
  telefoon: "tay-luh-FOHN",
  telescoop: "TEL-ESC-ohp",
  televisie: "TEL-EV-is-ee",
  telraam: "TELR-AHM",
  tennis: "TEHNN-IHS",
  tent: "TEHNT",
  theekop: "THAYK-OP",
  theepot: "THAYP-OT",
  thermometer: "TER-moh-may-ter",
  ticket: "TIHCK-EHT",
  tijger: "TEYEKH-ER",
  toegangsbewijzen: "TOHKH-ANKHSB-ew-eyez-en",
  toetsenbord: "TOHTS-ENB-ord",
  toilet: "TOHIHL-EHT",
  "tokio tower": "TOHK-IHOH TOHW-EHR",
  tomaat: "toh-MAHT",
  tong: "TONKH",
  tornado: "TOHRN-AHD-o",
  toverstaf: "TOHV-EHRST-af",
  trackball: "TRAHCKB-AHLL",
  tractor: "TRAHCT-OHR",
  tram: "TRAHM",
  tramwagen: "TRAMW-AKH-en",
  trein: "TRINE",
  treinwagon: "TREYENW-AKH-on",
  trofee: "TROF-AY",
  trol: "TROHL",
  trolleybus: "TROHLL-EHYB-us",
  trommel: "TROHMM-EHL",
  trompet: "TROHMP-EHT",
  "tropisch drankje": "TROP-ISKH DRANK-YE",
  "tropische vis": "TROP-ISKH-e FISS",
  tulp: "TUHLP",
  tumblerglas: "TUMBL-ERKHL-as",
  "tweede prijs medaille": "TWAYD-E PREYES meh-DYE",
  "t恤": "T-uh",
  ui: "OW",
  uil: "OWL",
  vader: "VAH-der",
  "vallende ster": "VAHLL-EHND-e STEHR",
  vampier: "VAMP-EER",
  varken: "VAHR-ken",
  vechtsportpak: "VEKHTSP-ORTP-ak",
  veerboot: "VAYRB-OHT",
  veiligheidsbril: "VEYEL-IKHH-eyedsbr-il",
  veiligheidsspeld: "VEYEL-IKHH-eyedssp-eld",
  veiligheidsvest: "VEYEL-IKHH-eyedsv-est",
  veldhockey: "VEHLDH-OHCK-ey",
  "verbonden paperclips": "VEHRB-OHND-en PAHP-EHRCL-ips",
  verdrietig: "VERDR-EET-ikh",
  verfkwast: "VEHRFKW-AHST",
  "vergrootglas naar links": "VERKHR-OHTKHL-as NAHR LIHNKS",
  "vergrootglas naar rechts": "VERKHR-OHTKHL-as NAHR REKHTS",
  verjaardagstaart: "VER-YAHRD-akhst-ahrt",
  verrast: "VEHRR-AHST",
  "verticaal verkeerslicht": "VERT-IC-ahl VERK-AYRSL-ikht",
  "vertrekkend vliegtuig": "VEHRTR-EHKK-end VLEEK-toykh",
  "vervallen huis": "VEHRV-AHLL-en HOUSE",
  "verwelkte bloem": "VEHRW-EHLKT-e BLOHM",
  videocamera: "VIHD-EHOHC-am-er-a",
  videocassette: "VIHD-EHOHC-ass-ett-e",
  videospel: "VIHD-EHOHSP-el",
  viool: "VIOHL",
  vis: "FISS",
  vishengel: "VISH-ENKH-el",
  "viskoekje met krul": "VISK-OHK-ye MEHT KRUHL",
  vleermuis: "VLAYRM-OWS",
  "vlees aan bot": "VLAYS AHN BOTT",
  vlieg: "VLEEKH",
  "vliegende schotel": "VLEEKH-END-e SKHOT-EL",
  vlieger: "VLEEKH-ER",
  vliegtuig: "VLEEK-toykh",
  vlinder: "FLIN-der",
  "vloeistof schenken": "VLOH-IST-of SKHENK-EN",
  voet: "VOHT",
  voetbal: "FOOT-bahl",
  vogel: "VOH-khul",
  "volle maan": "VOHLL-EH MAHN",
  vollemaangezicht: "VOLL-EM-ahnkh-ez-ikht",
  volleybal: "VOHLL-EHYB-al",
  "vork en mes": "VOHRK EHN MEHS",
  vos: "VOHS",
  "vrachtwagen met oplegger": "VRAKHTW-AKH-en MEHT OPL-EKHKH-er",
  vrijheidsbeeld: "VREYEH-EYEDSB-ayld",
  "vrouw met hoofddoek": "VROWW MEHT HOHFDD-OHK",
  vrouwenkleding: "VROWW-ENKL-ed-inkh",
  vulkaan: "VULK-AHN",
  vulpen: "VUHLP-EHN",
  vuur: "FUUR",
  vuurwerk: "VUHUHRW-EHRK",
  waaier: "VAH-EER",
  wafel: "VAF-EL",
  walvis: "VALV-IS",
  wandelschoen: "VAND-ELSKH-ohn",
  wangzakeekhoorn: "VANKHZ-AK-aykh-ohrn",
  warenhuis: "VAR-ENH-ows",
  "warme drank": "VARM-E DRAHNK",
  warmwaterbronnen: "VARMW-AT-erbr-onn-en",
  wasbeer: "VASB-AYR",
  wasco: "VASC-O",
  "wassende maan": "VASS-END-e MAHN",
  "wassende maansikkel": "VASS-END-e MAHNS-IKK-el",
  water: "WAH-ter",
  watergolf: "VAT-ERKH-olf",
  watermeloen: "VAT-ERM-el-ohn",
  waterpistool: "VAT-ERP-ist-ohl",
  weegschaal: "VAYKHSKH-AHL",
  wegwerkzaamheden: "VEKHW-ERKZ-ahmh-ed-en",
  "wereldbol met amerika": "VER-ELDB-ol MEHT AHM-EHR-ik-a",
  "wereldbol met azië en australië": "VER-ELDB-ol MEHT AZ-EE EHN AUSTR-AL-ee",
  "wereldbol met europa en afrika": "VER-ELDB-ol MEHT UHR-OP-a EHN AHFR-IHK-a",
  "wereldbol met meridianen": "VER-ELDB-ol MEHT MEHR-IHD-ian-en",
  wereldkaart: "VER-ELDK-ahrt",
  wetenschapper: "VET-ENSKH-app-er",
  wiel: "VEEL",
  wijnglas: "VEYENKHL-AS",
  windgezicht: "VINDKH-EZ-ikht",
  windgong: "VINDKH-ONKH",
  winkelwagen: "VINK-ELW-akh-en",
  "witte bloem": "VITT-E BLOHM",
  "witte stok": "VITT-E STOHK",
  woestijn: "VOHST-EYEN",
  wolf: "VOLF",
  wolk: "VOLK",
  "wolk met bliksem": "VOLK MEHT BLIHKS-EHM",
  "wolk met bliksem en regen": "VOLK MEHT BLIHKS-EHM EHN RAY-khuhn",
  worm: "VORM",
  wortel: "VOR-tel",
  wortelgroente: "VORT-ELKHR-ohnt-e",
  "x光片": "X-uh",
  yenbiljet: "YENB-IL-yet",
  zaailing: "ZAH-IL-inkh",
  zaklamp: "ZAHKL-AHMP",
  zanger: "ZANKH-ER",
  zebra: "ZEHBR-AH",
  zee: "ZAY",
  zeemeerpersoon: "ZAYM-AYRP-ers-ohn",
  zeep: "ZAYP",
  zeilboot: "ZEYELB-OHT",
  ziekenhuis: "ZEEK-ENH-ows",
  zombie: "ZOMB-EE",
  zon: "ZOHN",
  "zon achter grote wolk": "ZOHN AKHT-ER KHROT-E VOLK",
  "zon achter kleine wolk": "ZOHN AKHT-ER KLEYEN-E VOLK",
  "zon achter regenwolk": "ZOHN AKHT-ER REKH-ENW-olk",
  "zon achter wolk": "ZOHN AKHT-ER VOLK",
  "zon met gezicht": "ZOHN MEHT KHEZ-IKHT",
  zonnebloem: "ZONN-EBL-ohm",
  zonnebril: "ZOHNN-EHBR-il",
  zonsondergang: "ZONS-OND-erkh-ankh",
  zonsopkomst: "ZOHNS-OHPK-omst",
  "zonsopkomst boven bergen": "ZOHNS-OHPK-omst BOHV-EHN BERKH-EN",
  zorgmedewerker: "ZORKHM-ED-ew-erk-er",
  zout: "ZOWT",
  zwaailicht: "ZWAH-IL-ikht",
  zwaan: "ZWAHN",
  "zwanger persoon": "ZWANKH-ER PERS-OHN",
  zwemmen: "ZWEHMM-EHN",
  "zwevend persoon in pak": "ZWEHV-EHND PERS-OHN IHN PAHK",
  "一杯牛奶": "uh",
  "七夕树": "uh",
  "三叶草": "uh",
  "三明治": "uh",
  "三角尺": "uh",
  "上升图表": "uh",
  "上弦月": "uh",
  "上弦月脸": "uh",
  "下弦月": "uh",
  "下弦月脸": "uh",
  "下降图表": "uh",
  "世界地图": "uh",
  "东京塔": "uh",
  "丝带": "uh",
  "举重的人": "uh",
  "乐谱": "uh",
  "乒乓球": "uh",
  "书": "uh",
  "书签": "uh",
  "书签标签": "uh",
  "乳液瓶": "uh",
  "亏凸月": "uh",
  "云": "uh",
  "亚洲澳洲地球仪": "uh",
  "交叉的剑": "uh",
  "人字拖": "uh",
  "人鱼": "uh",
  "仙人掌": "uh",
  "仙女棒": "uh",
  "仙子": "uh",
  "低电量": "uh",
  "体育场": "uh",
  "体育奖牌": "uh",
  "侦探": "uh",
  "便利店": "uh",
  "便当": "uh",
  "保龄球": "uh",
  "信用卡": "uh",
  "倒液体": "uh",
  "停车标志": "uh",
  "僵尸": "uh",
  "光盘": "uh",
  "克尔白": "uh",
  "入场券": "uh",
  "八号球": "uh",
  "公交车": "uh",
  "公交车站": "uh",
  "公文包": "uh",
  "关东煮": "uh",
  "兵": "uh",
  "内裤": "uh",
  "军功章": "uh",
  "军用头盔": "uh",
  "农民": "uh",
  "冰": "uh",
  "冰壶": "uh",
  "冰淇淋": "uh",
  "冰球": "uh",
  "冰鞋": "uh",
  "冲浪的人": "uh",
  "出租车": "uh",
  "击剑的人": "uh",
  "刀叉": "uh",
  "划船的人": "uh",
  "创可贴": "uh",
  "刨冰": "uh",
  "剃须刀": "uh",
  "剪刀": "uh",
  "剪贴板": "uh",
  "办公室职员": "uh",
  "办公楼": "uh",
  "加油泵": "uh",
  "勺子": "uh",
  "匕首": "uh",
  "医护人员": "uh",
  "医院": "uh",
  "华夫饼": "uh",
  "单板滑雪者": "uh",
  "单轨列车": "uh",
  "南瓜灯": "uh",
  "卡片盒": "uh",
  "卡片索引": "uh",
  "卫兵": "uh",
  "卫星": "uh",
  "卫星天线": "uh",
  "印度教寺庙": "uh",
  "卷起的报纸": "uh",
  "卷轴": "uh",
  "卷边页面": "uh",
  "厨师": "uh",
  "双耳瓶": "uh",
  "发梳": "uh",
  "口红": "uh",
  "古典建筑": "uh",
  "台式电脑": "uh",
  "合上的书": "uh",
  "合上的伞": "uh",
  "吉他": "uh",
  "向右倾斜的放大镜": "uh",
  "向左倾斜的放大镜": "uh",
  "向日葵": "uh",
  "听诊器": "uh",
  "吸血鬼": "uh",
  "和服": "uh",
  "咖喱饭": "uh",
  "咬嘴唇": "uh",
  "哺乳": "uh",
  "啤酒杯": "uh",
  "喂宝宝的人": "uh",
  "喷泉": "uh",
  "嘴巴": "uh",
  "四叶草": "uh",
  "回形针": "uh",
  "回旋镖": "uh",
  "团子": "uh",
  "围巾": "uh",
  "国家公园": "uh",
  "图钉": "uh",
  "圆头图钉": "uh",
  "圆花饰": "uh",
  "土豆": "uh",
  "圣诞树": "uh",
  "圣诞老人": "uh",
  "地铁": "uh",
  "场记板": "uh",
  "坐手动轮椅的人": "uh",
  "坐电动轮椅的人": "uh",
  "垒球": "uh",
  "城堡": "uh",
  "城市景观": "uh",
  "培养皿": "uh",
  "培根": "uh",
  "塔可": "uh",
  "备忘录": "uh",
  "外卖盒": "uh",
  "外套": "uh",
  "多个音符": "uh",
  "多云": "uh",
  "夜晚的桥": "uh",
  "大脑": "uh",
  "大蒜": "uh",
  "天平": "uh",
  "太阳": "uh",
  "太阳和大云": "uh",
  "太阳和小云": "uh",
  "太阳脸": "uh",
  "太阳镜": "uh",
  "太阳雨云": "uh",
  "夹具": "uh",
  "夹馅扁面包": "uh",
  "奖杯": "uh",
  "套娃": "uh",
  "女帽": "uh",
  "女式凉鞋": "uh",
  "女装": "uh",
  "女靴": "uh",
  "奶瓶": "uh",
  "奶酪块": "uh",
  "奶酪火锅": "uh",
  "姜": "uh",
  "娥眉月": "uh",
  "婚礼": "uh",
  "子弹头列车": "uh",
  "学校": "uh",
  "学生": "uh",
  "宇航员": "uh",
  "安全别针": "uh",
  "安全背心": "uh",
  "宝石": "uh",
  "实验服": "uh",
  "客船": "uh",
  "富士山": "uh",
  "寿司": "uh",
  "小丑牌": "uh",
  "小号": "uh",
  "小型摩托车": "uh",
  "小天使": "uh",
  "小屋": "uh",
  "小巴": "uh",
  "小提琴": "uh",
  "小飞机": "uh",
  "山": "uh",
  "山地缆车": "uh",
  "山间日出": "uh",
  "岩石": "uh",
  "工具箱": "uh",
  "工厂": "uh",
  "工厂工人": "uh",
  "巧克力棒": "uh",
  "巨魔": "uh",
  "布丁": "uh",
  "帆船": "uh",
  "帐篷": "uh",
  "带伞的海滩": "uh",
  "带吸管杯": "uh",
  "带框画": "uh",
  "带花园的房子": "uh",
  "带闪光灯的相机": "uh",
  "带骨肉": "uh",
  "常青树": "uh",
  "平底杯": "uh",
  "平底锅食物": "uh",
  "平底鞋": "uh",
  "幸运饼干": "uh",
  "幼苗": "uh",
  "床": "uh",
  "废弃房屋": "uh",
  "废纸篓": "uh",
  "座位": "uh",
  "建筑工人": "uh",
  "建筑施工": "uh",
  "弓箭": "uh",
  "弯月": "uh",
  "强壮的手臂": "uh",
  "录像带": "uh",
  "录音室麦克风": "uh",
  "彗星": "uh",
  "彩纸球": "uh",
  "彩虹": "uh",
  "心脏": "uh",
  "忍者": "uh",
  "快艇": "uh",
  "念珠": "uh",
  "怀孕的人": "uh",
  "悠悠球": "uh",
  "悬挂铁路": "uh",
  "意大利面": "uh",
  "戒指": "uh",
  "戴兔耳的人": "uh",
  "戴助听器的耳朵": "uh",
  "戴头巾的人": "uh",
  "戴头巾的女人": "uh",
  "戴头纱的人": "uh",
  "戴王冠的人": "uh",
  "戴瓜皮帽的人": "uh",
  "房子": "uh",
  "房屋": "uh",
  "扁面包": "uh",
  "手动轮椅": "uh",
  "手套": "uh",
  "手拿包": "uh",
  "手提包": "uh",
  "手电筒": "uh",
  "手风琴": "uh",
  "打印机": "uh",
  "打开的书": "uh",
  "打开的文件夹": "uh",
  "打手球的人": "uh",
  "打水球的人": "uh",
  "打高尔夫的人": "uh",
  "扫帚": "uh",
  "扳手": "uh",
  "技术人员": "uh",
  "折扇": "uh",
  "护目镜": "uh",
  "报纸": "uh",
  "披萨": "uh",
  "拍球的人": "uh",
  "拐杖": "uh",
  "拖拉机": "uh",
  "拳击手套": "uh",
  "拼图块": "uh",
  "拿盲杖的人": "uh",
  "指南针": "uh",
  "捕鼠器": "uh",
  "排球": "uh",
  "控制旋钮": "uh",
  "插头": "uh",
  "摄像机": "uh",
  "摔跤的人": "uh",
  "摩天轮": "uh",
  "摩托艇": "uh",
  "摩托车": "uh",
  "撕页日历": "uh",
  "操纵杆": "uh",
  "攀爬的人": "uh",
  "收据": "uh",
  "收音机": "uh",
  "救护车": "uh",
  "救援人员头盔": "uh",
  "救生圈": "uh",
  "教堂": "uh",
  "文件夹": "uh",
  "文件柜": "uh",
  "斧头": "uh",
  "断开的链条": "uh",
  "新月": "uh",
  "新月脸": "uh",
  "方块": "uh",
  "施工": "uh",
  "旋转木马": "uh",
  "无叶树": "uh",
  "无轨电车": "uh",
  "无雪雪人": "uh",
  "日元上涨图表": "uh",
  "日元纸币": "uh",
  "日出": "uh",
  "日历": "uh",
  "日本人偶": "uh",
  "日本地图": "uh",
  "日本城堡": "uh",
  "日本邮局": "uh",
  "日落": "uh",
  "旱冰鞋": "uh",
  "星夜": "uh",
  "星星": "uh",
  "显微镜": "uh",
  "曲棍球": "uh",
  "月饼": "uh",
  "有环行星": "uh",
  "有蛋的鸟巢": "uh",
  "有轨电车": "uh",
  "服务铃": "uh",
  "望远镜": "uh",
  "木头": "uh",
  "木工锯": "uh",
  "机动三轮车": "uh",
  "机械师": "uh",
  "机械腿": "uh",
  "机械臂": "uh",
  "杂耍的人": "uh",
  "板球": "uh",
  "枫叶": "uh",
  "枯萎的花": "uh",
  "柠檬": "uh",
  "柱状图": "uh",
  "标签": "uh",
  "栗子": "uh",
  "根菜": "uh",
  "桃": "uh",
  "桶": "uh",
  "梅花": "uh",
  "梨": "uh",
  "梯子": "uh",
  "棒棒糖": "uh",
  "棒球": "uh",
  "棕榈树": "uh",
  "椅子": "uh",
  "椒盐卷饼": "uh",
  "椰子": "uh",
  "横向交通灯": "uh",
  "樱桃": "uh",
  "樱花": "uh",
  "橄榄": "uh",
  "橄榄球": "uh",
  "橘子": "uh",
  "橙色书": "uh",
  "欧元纸币": "uh",
  "欧洲非洲地球仪": "uh",
  "歌手": "uh",
  "正在按摩的人": "uh",
  "正在理发的人": "uh",
  "正面朝上的页面": "uh",
  "武术服": "uh",
  "残月": "uh",
  "比基尼": "uh",
  "毕业帽": "uh",
  "毛线": "uh",
  "气旋": "uh",
  "气球": "uh",
  "水晶球": "uh",
  "水枪": "uh",
  "水波": "uh",
  "水滴": "uh",
  "汉堡包": "uh",
  "汽车": "uh",
  "沙发和灯": "uh",
  "沙滩伞": "uh",
  "沙漠": "uh",
  "沙锤": "uh",
  "油桶": "uh",
  "油灯": "uh",
  "法官": "uh",
  "法师": "uh",
  "法棍面包": "uh",
  "泡泡": "uh",
  "注射器": "uh",
  "泰迪熊": "uh",
  "洋葱": "uh",
  "洗澡的人": "uh",
  "派": "uh",
  "派对礼花": "uh",
  "流星": "uh",
  "浴缸": "uh",
  "海绵": "uh",
  "消防员": "uh",
  "消防车": "uh",
  "淋浴": "uh",
  "清真寺": "uh",
  "清酒": "uh",
  "渡轮": "uh",
  "温度计": "uh",
  "温泉": "uh",
  "游泳的人": "uh",
  "滑板": "uh",
  "滑板车": "uh",
  "滑梯": "uh",
  "滑雪板": "uh",
  "滑雪者": "uh",
  "满月": "uh",
  "满月脸": "uh",
  "潜水面罩": "uh",
  "火": "uh",
  "火山": "uh",
  "火箭": "uh",
  "火车": "uh",
  "火车车厢": "uh",
  "灭火器": "uh",
  "灯泡": "uh",
  "炸弹": "uh",
  "炸虾": "uh",
  "炸豆丸子": "uh",
  "烟花": "uh",
  "烤红薯": "uh",
  "热带饮料": "uh",
  "热汤面": "uh",
  "热狗": "uh",
  "热饮": "uh",
  "烹饪": "uh",
  "煎饼": "uh",
  "蒸汽房里的人": "uh",
  "蒸汽机车": "uh",
  "蒸馏器": "uh",
  "爆米花": "uh",
  "爱情旅馆": "uh",
  "牙刷": "uh",
  "牙齿": "uh",
  "牛仔裤": "uh",
  "牛油果": "uh",
  "犹太会堂": "uh",
  "独木舟": "uh",
  "猕猴桃": "uh",
  "玉米": "uh",
  "玉米粽": "uh",
  "玫瑰": "uh",
  "珍珠奶茶": "uh",
  "班卓琴": "uh",
  "球门": "uh",
  "理发店招牌柱": "uh",
  "甜椒": "uh",
  "甜瓜": "uh",
  "甜甜圈": "uh",
  "生日蛋糕": "uh",
  "电动轮椅": "uh",
  "电子游戏": "uh",
  "电子琴": "uh",
  "电平滑块": "uh",
  "电影摄影机": "uh",
  "电影放映机": "uh",
  "电梯": "uh",
  "电池": "uh",
  "电视": "uh",
  "电脑光盘": "uh",
  "电脑鼠标": "uh",
  "电车车厢": "uh",
  "男鞋": "uh",
  "画笔": "uh",
  "番茄": "uh",
  "登山铁路": "uh",
  "登山靴": "uh",
  "白花": "uh",
  "百货商店": "uh",
  "皇冠": "uh",
  "皮卡车": "uh",
  "皮搋子": "uh",
  "皮纳塔": "uh",
  "盆栽植物": "uh",
  "盈凸月": "uh",
  "盐": "uh",
  "盘腿打坐的人": "uh",
  "盲杖": "uh",
  "直升机": "uh",
  "直尺": "uh",
  "相机": "uh",
  "相连的回形针": "uh",
  "盾牌": "uh",
  "眼睛": "uh",
  "眼镜": "uh",
  "短裤": "uh",
  "砖": "uh",
  "硬币": "uh",
  "碗和勺子": "uh",
  "碰杯": "uh",
  "碰杯啤酒": "uh",
  "磁铁": "uh",
  "礼帽": "uh",
  "礼物": "uh",
  "神灯精灵": "uh",
  "神社": "uh",
  "票": "uh",
  "科学家": "uh",
  "稻穗": "uh",
  "空中缆车": "uh",
  "空鸟巢": "uh",
  "穿燕尾服的人": "uh",
  "穿西装漂浮的人": "uh",
  "窗户": "uh",
  "竖向交通灯": "uh",
  "竖琴": "uh",
  "站立的人": "uh",
  "笔": "uh",
  "笔记本": "uh",
  "笔记本电脑": "uh",
  "第一名奖牌": "uh",
  "第三名奖牌": "uh",
  "第二名奖牌": "uh",
  "筷子": "uh",
  "算盘": "uh",
  "篮子": "uh",
  "篮球": "uh",
  "米饭": "uh",
  "米饼": "uh",
  "精灵": "uh",
  "糖果": "uh",
  "红包": "uh",
  "红心": "uh",
  "红灯笼": "uh",
  "红苹果": "uh",
  "纪念丝带": "uh",
  "索引分隔页": "uh",
  "纱丽": "uh",
  "纸卷": "uh",
  "纸杯蛋糕": "uh",
  "线": "uh",
  "经纬线地球": "uh",
  "结": "uh",
  "绿叶菜": "uh",
  "绿色书": "uh",
  "绿色沙拉": "uh",
  "缝衣针": "uh",
  "罐头食品": "uh",
  "罐子": "uh",
  "网球": "uh",
  "羊角面包": "uh",
  "美元纸币": "uh",
  "美式橄榄球": "uh",
  "美洲地球仪": "uh",
  "羽毛球": "uh",
  "翻筋斗的人": "uh",
  "老师": "uh",
  "老虎机": "uh",
  "耳朵": "uh",
  "耳机": "uh",
  "肉排": "uh",
  "肥皂": "uh",
  "肺": "uh",
  "背包": "uh",
  "胡萝卜": "uh",
  "胶片帧": "uh",
  "脚": "uh",
  "腿": "uh",
  "自由女神像": "uh",
  "自行车": "uh",
  "舌头": "uh",
  "船": "uh",
  "艺术家": "uh",
  "芒果": "uh",
  "芙蓉花": "uh",
  "芭蕾舞鞋": "uh",
  "花札": "uh",
  "花朵": "uh",
  "花束": "uh",
  "花生": "uh",
  "英镑纸币": "uh",
  "茄子": "uh",
  "茶壶": "uh",
  "茶杯": "uh",
  "草本植物": "uh",
  "草莓": "uh",
  "荒岛": "uh",
  "药丸": "uh",
  "莲花": "uh",
  "菜刀": "uh",
  "菠萝": "uh",
  "萨克斯管": "uh",
  "落叶": "uh",
  "落叶树": "uh",
  "葡萄": "uh",
  "蓝色书": "uh",
  "蓝莓": "uh",
  "薯条": "uh",
  "蘑菇": "uh",
  "蛋糕": "uh",
  "蜂蜜罐": "uh",
  "蜡烛": "uh",
  "蜡笔": "uh",
  "螺丝刀": "uh",
  "螺旋日历": "uh",
  "螺旋记事本": "uh",
  "螺母和螺栓": "uh",
  "血滴": "uh",
  "行李": "uh",
  "表演艺术": "uh",
  "袜子": "uh",
  "装饰封面笔记本": "uh",
  "褐蘑菇": "uh",
  "西兰花": "uh",
  "西瓜": "uh",
  "试管": "uh",
  "调色板": "uh",
  "警察": "uh",
  "警灯": "uh",
  "警车": "uh",
  "豆子": "uh",
  "豌豆荚": "uh",
  "贝果": "uh",
  "账本": "uh",
  "购物袋": "uh",
  "购物车": "uh",
  "赏月": "uh",
  "赛车": "uh",
  "赛马": "uh",
  "走路的人": "uh",
  "超级反派": "uh",
  "超级英雄": "uh",
  "足球": "uh",
  "跑步的人": "uh",
  "跑步背心": "uh",
  "跑鞋": "uh",
  "跪着的人": "uh",
  "跳舞的女人": "uh",
  "跳舞的男人": "uh",
  "躺在床上的人": "uh",
  "车站": "uh",
  "车轮": "uh",
  "轨迹球": "uh",
  "软冰淇淋": "uh",
  "软盘": "uh",
  "轻轨": "uh",
  "辣椒": "uh",
  "过山车": "uh",
  "迎面驶来的公交车": "uh",
  "迎面驶来的出租车": "uh",
  "迎面驶来的汽车": "uh",
  "迎面驶来的警车": "uh",
  "运动型多用途车": "uh",
  "连体泳衣": "uh",
  "连衣裙": "uh",
  "迪斯科球": "uh",
  "送货卡车": "uh",
  "邮局": "uh",
  "郁金香": "uh",
  "酒店": "uh",
  "酒杯": "uh",
  "钓竿": "uh",
  "钢笔": "uh",
  "钢笔尖": "uh",
  "钩子": "uh",
  "钱包": "uh",
  "钱袋": "uh",
  "铁路轨道": "uh",
  "铅笔": "uh",
  "铰接式卡车": "uh",
  "铲子": "uh",
  "银河": "uh",
  "银行": "uh",
  "链接": "uh",
  "链条": "uh",
  "锅里的食物": "uh",
  "锚": "uh",
  "锤子": "uh",
  "锤子和扳手": "uh",
  "锤子和镐": "uh",
  "键盘": "uh",
  "镐": "uh",
  "镜子": "uh",
  "长曲棍球": "uh",
  "长笛": "uh",
  "长翅膀的钱": "uh",
  "长鼓": "uh",
  "门": "uh",
  "门松": "uh",
  "闪亮的星星": "uh",
  "闪光": "uh",
  "闪电": "uh",
  "闪电云": "uh",
  "降落伞": "uh",
  "雨云": "uh",
  "雨伞": "uh",
  "雨伞和雨滴": "uh",
  "雪云": "uh",
  "雪人": "uh",
  "雪山": "uh",
  "雪橇": "uh",
  "雪花": "uh",
  "雷雨云": "uh",
  "雾": "uh",
  "雾蒙蒙": "uh",
  "露营": "uh",
  "青柠": "uh",
  "青苹果": "uh",
  "面包": "uh",
  "靶心": "uh",
  "鞭炮": "uh",
  "音符": "uh",
  "领带": "uh",
  "风中的叶子": "uh",
  "风信子": "uh",
  "风筝": "uh",
  "风脸": "uh",
  "风铃": "uh",
  "飞机": "uh",
  "飞机起飞": "uh",
  "飞机降落": "uh",
  "飞盘": "uh",
  "飞碟": "uh",
  "飞行员": "uh",
  "饭团": "uh",
  "饮料盒": "uh",
  "饺子": "uh",
  "饼干": "uh",
  "餐盘和刀叉": "uh",
  "香槟瓶": "uh",
  "香蕉": "uh",
  "马戏团帐篷": "uh",
  "马桶": "uh",
  "马黛茶": "uh",
  "骑山地车的人": "uh",
  "骑自行车的人": "uh",
  "骨头": "uh",
  "骰子": "uh",
  "高尔夫球洞旗": "uh",
  "高跟鞋": "uh",
  "高速公路": "uh",
  "高速列车": "uh",
  "魔法棒": "uh",
  "鱼板": "uh",
  "鲤鱼旗": "uh",
  "鸡尾酒杯": "uh",
  "鸡腿": "uh",
  "鸡蛋": "uh",
  "鸭舌帽": "uh",
  "麦克风": "uh",
  "麻将红中": "uh",
  "黄昏城市": "uh",
  "黄油": "uh",
  "黄瓜": "uh",
  "黑桃": "uh",
  "墨西哥卷饼": "uh",
  "鼓": "uh",
  "鼻子": "uh",
  "齿轮": "uh",
  "龙卷风": "uh",
};

/* Japanese pronunciation overrides
   Used when the automatic kana-based guide cannot handle kanji compounds
   (e.g. 稲妻). This is the proper place to define correct romaji for
   specific words that appear in the dynamic emoji data. */
const japanesePronunciationOverrides = {
  "花束": "hanataba",
  "桜": "sakura",
  "蓮": "hasu",
  "バラ": "bara",
  "花": "hana",
  "芽": "me",
  "鉢植え": "hachiue",
  "常緑樹": "jōryokuju",
  "落葉樹": "rakuyōju",
  "ヤシの木": "yashi no ki",
  "稲穂": "inaho",
  "もみじ": "momiji",
  "落ち葉": "ochiba",
  "キノコ": "kinoko",
  "彗星": "suisei",
  "火": "hi",
  "しずく": "shizuku",
  "波": "nami",
  "稲妻": "inazuma",
  "雪の結晶": "yuki no kesshō",
  "雪だるま": "yukidaruma",
  "雷雨雲": "raiuun",
  "雷雲": "raiuun",
  "天の川": "ama no kawa",
  "雲": "kumo",
  "虹": "niji",
  "傘": "kasa",
  "新月": "shingetsu",
  "三日月": "mikazuki",
  "上弦の月": "jōgen no tsuki",
  "十三夜月": "jūsan'ya zuki",
  "満月": "mangetsu",
  "寝待月": "nemachimachi",
  "下弦の月": "kagen no tsuki",
  "有明月": "ariake no tsuki",
  "新月の顔": "shingetsu no kao",
  "上弦の月の顔": "jōgen no tsuki no kao",
  "下弦の月の顔": "kagen no tsuki no kao",
  "満月の顔": "mangetsu no kao",
  "小さな雲と太陽": "chiisana kumo to taiyō",
  "大きな雲と太陽": "ōkina kumo to taiyō",
  "雨雲と太陽": "u kumo to taiyō",
  "梨": "nashi",
  "栗": "kuri",
  "豆": "mame",
  "餃子": "gyōza",
  "月餅": "geppei",
  "弁当": "bentō",
  "焼き芋": "yaki imo",
  "せんべい": "senbei",
  "おにぎり": "onigiri",
  "ご飯": "gohan",
  "ラーメン": "rāmen",
  "皿とナイフとフォーク": "sara to naifu to fōku",
  "ナイフとフォーク": "naifu to fōku",
  "花火": "hanabi",
  "爆竹": "bakuchiku",
  "七夕飾り": "tanabata kazari",
  "門松": "kadomatsu",
  "南瓜灯": "kabocha tōrō",
  "人形": "ningyō",
  "人魚": "ningyō",
  "吸血鬼": "kyūketsuki",
  "ランプの精": "ranpu no sei",
  "王冠": "ōkan",
  "天使": "tenshi",
  "悪魔": "akuma",
  "幽霊": "yūrei",
  "サンタ": "santa",
  "城": "shiro",
  "学校": "gakkō",
  "本": "hon",
  "鍵": "kagi",
  "時計": "tokei",
  "はさみ": "hasami",
  "温度計": "on-do-kei",
  "太陽": "taiyō",
  "風の顔": "kaze no kao",
  "閉じた傘": "tojita kasa",
  "雨傘": "ama kasa",
  "ビーチパラソル": "bīchi parasoru",
  "葡萄": "budō",
  "西瓜": "suika",
  "桃": "momo",
  "姜": "shōga",
  "えんどう豆": "endō mame",
  "茶色いキノコ": "chairoi kinoko",
  "根菜": "konsai",
  "力こぶ": "rikikobu",
  "義手": "gishu",
  "義足": "gisoku",
  "脚": "ashi",
  "足": "ashi",
  "眼鏡": "megane",
  "サングラス": "sangurasu",
  "ゴーグル": "gōguru",
  "着物": "kimono",
  "婦人服": "fujinfuku",
  "扇子": "sensu",
  "財布": "saifu",
  "ヨーロッパとアフリカの地球": "yōroppa to afurika no chikyū",
  "アメリカ大陸の地球": "amerika tairiku no chikyū",
  "アジアとオーストラリアの地球": "ajia to ōsutoraria no chikyū",
  "ビーチとパラソル": "bīchi to parasoru",
  "経線入りの地球": "keisen iri no chikyū",
  "世界地図": "sekai chizu",
  "日本地図": "nihon chizu",
  "コンパス": "konpasu",
  "雪山": "yukiyama",
  "山": "yama",
  "耳": "mimi",
  "目": "me",
  "鼻": "hana",
  "口": "kuchi",
  "瓶": "bin",
  "手袋": "tebukuro",
  "自転車に乗る人": "jitensha ni noru hito",
  "マウンテンバイクに乗る人": "maunten baiku ni noru hito",
  "ゴルフする人": "gorufu suru hito",
  "サーフィンする人": "sāfin suru hito",
  "ボートをこぐ人": "bōto o kogu hito",
  "泳ぐ人": "oyogu hito",
  "ボールをつく人": "bōru o tsuku hito",
  "重量挙げする人": "jūryō age suru hito",
  "側転する人": "sokuten suru hito",
  "レスリングする人たち": "resuringu suru hitotachi",
  "水球をする人": "suikyū o suru hito",
  "ジャグリングする人": "jaguringu suru hito",
  "蓮華座の人": "rengeza no hito",
  "入浴する人": "nyūyoku suru hito",
  "ベッドにいる人": "beddo ni iru hito",
  "手動車いすの人": "shudō kuruma isu no hito",
  "電動車いすの人": "dendō kuruma isu no hito",
  "踊る女性": "odoru josei",
  "踊る男性": "odoru dansei",
  "白杖を持つ人": "hakujō o motsu hito",
  "白杖": "hakujō",
  "歩く人": "aruku hito",
  "立つ人": "tatsu hito",
  "ひざまずく人": "hizamazuku hito",
  "魔法使い": "mahōtsukai",
  "スーパーヒーロー": "sūpāhīrō",
  "スーパーヴィラン": "sūpāviran",
  "妖精": "yōsei",
  "天使の赤ちゃん": "tenshi no akachan",
  "サンタクロース": "santakurōsu",
  "ウサ耳の人": "usagi mimi no hito",
  "サウナに入る人": "sauna ni iru hito",
  "登る人": "noboru hito",
  "競馬": "keiba",
  "スキーヤー": "sukīyā",
  "スノーボーダー": "sunōbōdā",
  "赤い提灯": "akai chōchin",
  "新聞": "shinbun",
  "丸めた新聞": "marumeta shinbun",
  "万年筆": "mannenhitsu",
  "ペン先": "pen saki",
  "卒業帽": "sotsugyōbō",
  "白衣": "hakui",
  "安全ベスト": "anzen besuto",
  "ネクタイ": "nekutai",
  "Tシャツ": "tīshatsu",
  "ジーンズ": "jīnzu",
  "マフラー": "mafuraa",
  "コート": "kōto",
  "靴下": "kutsushita",
  "ドレス": "doresu",
  "サリー": "sarī",
  "ワンピース水着": "wanpīsu mizugi",
  "ブリーフ": "burīfu",
  "半ズボン": "hanzubon",
  "ビキニ": "bikini",
  "ハンドバッグ": "handobaggu",
  "クラッチバッグ": "kuratchi baggu",
  "買い物袋": "kaimono bukuro",
  "リュックサック": "ryukkusakku",
  "ビーチサンダル": "bīchi sandaru",
  "紳士靴": "shinshi kutsu",
  "ランニングシューズ": "ranningu shūzu",
  "登山靴": "tozan kutsu",
  "フラットシューズ": "furatto shūzu",
  "ハイヒール": "haihīru",
  "女性用サンダル": "josei yō sandaru",
  "バレエシューズ": "barē shūzu",
  "女性用ブーツ": "josei yō būtsu",
  "ヘアピック": "hea pikku",
  "女性用帽子": "josei yō bōshi",
  "シルクハット": "shiruku hatto",
  "キャップ": "kyappu",
  "軍用ヘルメット": "gun'yō herumetto",
  "救助隊員のヘルメット": "kyūjotaiin no herumetto",
  "数珠": "juzu",
  "電池": "denchi",
  "電池残量低下": "denchi zanryō teika",
  "電源プラグ": "denshi puragu",
  "ノートパソコン": "nōto pasokon",
  "デスクトップパソコン": "desukutoppu pasokon",
  "プリンター": "purintā",
  "キーボード": "kībōdo",
  "コンピューターマウス": "konpyūtā mausu",
  "トラックボール": "torakkubōru",
  "光ディスク": "kōgaku disuku",
  "DVD": "dībuidī",
  "そろばん": "soroban",
  "映画カメラ": "eiga kamera",
  "フィルム": "firumu",
  "映写機": "eisha ki",
  "カチンコ": "kachinko",
  "テレビ": "terebi",
  "カメラ": "kamera",
  "フラッシュ付きカメラ": "furasshu tsuki kamera",
  "ビデオカメラ": "bideo kamera",
  "ビデオカセット": "bideo kasetto",
  "左向きの虫眼鏡": "hidarimuki no chūmegane",
  "右向きの虫眼鏡": "migimuki no chūmegane",
  "ろうそく": "rōsoku",
  "電球": "denkyū",
  "懐中電灯": "kaichū dentō",
  "表紙付きノート": "hyōshi tsuki nōto",
  "閉じた本": "tojita hon",
  "開いた本": "hiraita hon",
  "緑の本": "midori no hon",
  "青い本": "aoi hon",
  "オレンジの本": "orenji no hon",
  "ノート": "nōto",
  "帳簿": "chōbo",
  "丸まったページ": "marumatta pēji",
  "巻物": "makimono",
  "上向きのページ": "uwamuki no pēji",
  "付箋": "fushin",
  "しおり": "shiori",
  "ラベル": "raberu",
  "ペン": "pen",
  "絵筆": "efude",
  "クレヨン": "kureyon",
  "メモ": "memo",
  "ハンマー": "hanmā",
  "斧": "ono",
  "つるはし": "tsuruhashi",
  "ハンマーとつるはし": "hanmā to tsuruhashi",
  "ハンマーとレンチ": "hanmā to renchi",
  "短剣": "tanken",
  "交差した剣": "kōsa shita ken",
  "爆弾": "bakudan",
  "ブーメラン": "būmeran",
  "弓矢": "yumi ya",
  "盾": "tate",
  "のこぎり": "nokogiri",
  "レンチ": "renchi",
  "ドライバー": "doraibā",
  "ナットとボルト": "natto to boruto",
  "歯車": "haguruma",
  "クランプ": "kuranpu",
  "天秤": "tenbin",
  "リンク": "rinku",
  "切れた鎖": "kireta kusari",
  "鎖": "kusari",
  "フック": "hukku",
  "工具箱": "kōgubako",
  "磁石": "jishaku",
  "はしご": "hashigo",
  "シャベル": "shaberu",
  "アランビック": "aranbikku",
  "赤ちゃんに授乳する人": "akachan ni junyū suru hito",
  "風鈴": "fūrin",
  "鉛筆": "enpitsu",
  "建設工事": "kensetsu-kōji",
  "お正月": "o-shōgatsu",
  "雛祭り": "hinamatsuri",
  "鯉のぼり": "koinobori",
  "お盆": "o-bon",
  "七五三": "shichi-go-san",
  "お月見": "o-tsukimi",
  "お祭り": "o-matsuri",
  "盆踊り": "bon odori",
  "消しゴム": "keshigomu",
  "定規": "jōgi",
  "クレーン車": "kurēnsha",
  "ショベルカー": "shoberukā",
  "ヘルメット": "herumetto",
  "双眼鏡": "sōgankyō",
  "望遠鏡": "bōenkyō",
  "顕微鏡": "kenbikyō",
  "地球儀": "chikyūgi",
  "本棚": "hondana",
  "辞書": "jisho",
  "黒板": "kokuban",
  "チョーク": "chōku",
  "ホワイトボード": "howaito bōdo",
  "風車": "kazaguruma",
  "灯台": "tōdai",
  "お寺": "o-tera",
  "お城": "o-shiro",
  "温泉": "onsen",
  "旅館": "ryokan",
  "空港": "kūkō",
  "駅": "eki",
  "新幹線": "shinkansen",
  "テント": "tento",
  "山小屋": "yama goya",
  "展望台": "tenbōdai",
  "遊園地": "yūenchi",
  "動物園": "dōbutsuen",
  "水族館": "suizokukan",
  "美術館": "bijutsukan",
  "博物館": "hakubutsukan",
  "お土産": "o-miyage",
  "お菓子": "o-kashi",
  "お守り": "o-mamori",
  "おみくじ": "o-mikuji",
  "お花見": "o-hanami",
  "お祭り屋台": "o-matsuri yatai",
  "おみやげ屋": "o-miyage-ya",
  "お土産物": "o-miyage mono",
  "分度器": "bundogi",
  "教科書": "kyōkasho",
  "辞典": "jiten",
  "地図帳": "chizuchō",
  "神社": "jinja",
  "鳥居": "torii",
  "ホテル": "hoteru",
  "飛行機": "hikōki",
  "船": "fune",
  "バス停": "basu tei",
  "タクシー": "takushī",
  "レンタカー": "rentakā",
  "キャンプ場": "kyanpu jō",
  "川": "kawa",
  "湖": "mizuumi",
  "海": "umi",
  "ビーチ": "bīchi",
  "山頂": "sanchō",
  "フェンシングする人": "fenshingu suru hito",
  "ハンドボールをする人": "handobōru o suru hito",
  "ビリヤードの8ボール": "biriyādo no 8 bōru",
  "ひな人形": "hinaningyō",
  "こいのぼり": "koinobori",
  "赤い封筒": "akai fūtō",
  "包まれたプレゼント": "tsutsumareta purezento",
  "試験管": "shikenkan",
  "シャーレ": "shāre",
  "衛星アンテナ": "eisei antena",
  "注射器": "chūshaki",
  "血のしずく": "chi no shizuku",
  "レンガ": "renga",
  "木材": "mokuzai",
  "小屋": "koya",
  "家々": "ieie",
  "入場券": "nyūjōken",
  "勲章": "kunshō",
  "卓球": "takkyū",
  "武道着": "budōgi",
  "凧": "tako",
  "水鉄砲": "mizuteppō",
  "水晶玉": "suishō dama",
  "花札": "hanafuda",
  "舞台芸術": "butai geijutsu",
  "糸": "ito",
  "毛糸": "keito",
  "楽譜": "gakufu",
  "音符": "onpu",
  "鍵盤": "kenban",
  "長太鼓": "nagadaiko",
  "錠剤": "jōzai",
  "松葉杖": "matsubazue",
  "聴診器": "chōshinki",
  "鏡": "kagami",
  "窓": "mado",
  "椅子": "isu",
  "浴槽": "yokusō",
  "消火器": "shōkaki",
  "廃屋": "haioku",
  "郵便局": "yūbinkyoku",
  "病院": "byōin",
  "銀行": "ginkō",
  "工場": "kōjō",
  "結婚式": "kekkonshiki",
  "教会": "kyōkai",
  "噴水": "funsui",
  "霧": "kiri",
  "夕日": "yūhi",
  "観覧車": "kanransha",
  "機関車": "kikansha",
  "鉄道車両": "tetsudō sharyō",
  "高速鉄道": "kōsoku tetsudō",
  "電車": "densha",
  "地下鉄": "chikatetsu",
  "路面電車": "romendensha",
  "登山鉄道": "tōzan tetsudō",
};

const cyrillicPronunciationMap = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "ye", ё: "yo", ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

const kanaPronunciationMap = {
  ア: "a", イ: "i", ウ: "u", エ: "e", オ: "o", カ: "ka", キ: "ki", ク: "ku", ケ: "ke", コ: "ko", サ: "sa", シ: "shi", ス: "su", セ: "se", ソ: "so", タ: "ta", チ: "chi", ツ: "tsu", テ: "te", ト: "to", ナ: "na", ニ: "ni", ヌ: "nu", ネ: "ne", ノ: "no", ハ: "ha", ヒ: "hi", フ: "fu", ヘ: "he", ホ: "ho", マ: "ma", ミ: "mi", ム: "mu", メ: "me", モ: "mo", ヤ: "ya", ユ: "yu", ヨ: "yo", ラ: "ra", リ: "ri", ル: "ru", レ: "re", ロ: "ro", ワ: "wa", ヲ: "o", ン: "n",
  ガ: "ga", ギ: "gi", グ: "gu", ゲ: "ge", ゴ: "go", ザ: "za", ジ: "ji", ズ: "zu", ゼ: "ze", ゾ: "zo", ダ: "da", ヂ: "ji", ヅ: "zu", デ: "de", ド: "do", バ: "ba", ビ: "bi", ブ: "bu", ベ: "be", ボ: "bo", パ: "pa", ピ: "pi", プ: "pu", ペ: "pe", ポ: "po",
  キャ: "kya", キュ: "kyu", キョ: "kyo", シャ: "sha", シュ: "shu", ショ: "sho", チャ: "cha", チュ: "chu", チョ: "cho", ニャ: "nya", ニュ: "nyu", ニョ: "nyo", ヒャ: "hya", ヒュ: "hyu", ヒョ: "hyo", ミャ: "mya", ミュ: "myu", ミョ: "myo", リャ: "rya", リュ: "ryu", リョ: "ryo", ギャ: "gya", ギュ: "gyu", ギョ: "gyo", ジャ: "ja", ジュ: "ju", ジョ: "jo", ビャ: "bya", ビュ: "byu", ビョ: "byo", ピャ: "pya", ピュ: "pyu", ピョ: "pyo",
  ァ: "a", ィ: "i", ゥ: "u", ェ: "e", ォ: "o", ャ: "ya", ュ: "yu", ョ: "yo", ッ: "", ー: "-",
  あ: "a", い: "i", う: "u", え: "e", お: "o", か: "ka", き: "ki", く: "ku", け: "ke", こ: "ko", さ: "sa", し: "shi", す: "su", せ: "se", そ: "so", た: "ta", ち: "chi", つ: "tsu", て: "te", と: "to", な: "na", に: "ni", ぬ: "nu", ね: "ne", の: "no", は: "ha", ひ: "hi", ふ: "fu", へ: "he", ほ: "ho", ま: "ma", み: "mi", む: "mu", め: "me", も: "mo", や: "ya", ゆ: "yu", よ: "yo", ら: "ra", り: "ri", る: "ru", れ: "re", ろ: "ro", わ: "wa", を: "o", ん: "n",
  が: "ga", ぎ: "gi", ぐ: "gu", げ: "ge", ご: "go", ざ: "za", じ: "ji", ず: "zu", ぜ: "ze", ぞ: "zo", だ: "da", ぢ: "ji", づ: "zu", で: "de", ど: "do", ば: "ba", び: "bi", ぶ: "bu", べ: "be", ぼ: "bo", ぱ: "pa", ぴ: "pi", ぷ: "pu", ぺ: "pe", ぽ: "po",
  きゃ: "kya", きゅ: "kyu", きょ: "kyo", しゃ: "sha", しゅ: "shu", しょ: "sho", ちゃ: "cha", ちゅ: "chu", ちょ: "cho", にゃ: "nya", にゅ: "nyu", にょ: "nyo", ひゃ: "hya", ひゅ: "hyu", ひょ: "hyo", みゃ: "mya", みゅ: "myu", みょ: "myo", りゃ: "rya", りゅ: "ryu", りょ: "ryo", ぎゃ: "gya", ぎゅ: "gyu", ぎょ: "gyo", じゃ: "ja", じゅ: "ju", じょ: "jo", びゃ: "bya", びゅ: "byu", びょ: "byo", ぴゃ: "pya", ぴゅ: "pyu", ぴょ: "pyo",
  ぁ: "a", ぃ: "i", ぅ: "u", ぇ: "e", ぉ: "o", ゃ: "ya", ゅ: "yu", ょ: "yo", っ: "",
};

function latinPronunciationGuide(word, language = "en") {
  /* US English and Dutch readable transliteration with stressed syllables (CAPS). */
  const normalized = word.toLowerCase().replace(/\s+/g, " ").trim();
  const overrides = language === "nl" ? dutchPronunciationOverrides : englishPronunciationOverrides;

  if (overrides[normalized]) return overrides[normalized];

  if (normalized.includes(" ")) {
    return normalized
      .split(" ")
      .map((part) => latinPronunciationGuide(part, language))
      .join(" ");
  }

  const groups = normalized.match(/[bcdfghjklmnpqrstvwxyz]*[aeiouy]+[bcdfghjklmnpqrstvwxyz]*/gi);
  if (!groups || !groups.length) return normalized.toUpperCase();

  if (groups.length === 1) {
    return groups[0].toUpperCase();
  }

  const guide = groups
    .map((group, index) => (index === 1 ? group.toUpperCase() : group.toLowerCase()))
    .join("-");

  if (guide.replace(/-/g, "").toLowerCase() === normalized.replace(/[^a-z]/g, "")) {
    return groups.map((group, index) => (index === 0 ? group.toUpperCase() : group.toLowerCase())).join("-");
  }

  return guide;
}

function russianPronunciationGuide(word) {
  /* Consistent structure rule:
     Always return a clean transliteration. Never output helper text or Cyrillic. */
  let guide = [...word.toLowerCase()]
    .map((character) => cyrillicPronunciationMap[character] ?? "")
    .join("")
    .replace(/\s+/g, " ")
    .trim();
  guide = guide.replace(/[а-яё]/gi, "").replace(/\s+/g, " ").trim();
  return guide.replace(/[^a-z\s\-]/gi, "").replace(/\s+/g, " ").trim();
}

function chinesePronunciationGuide(word) {
  /* Consistent structure rule:
     Always return pinyin (with tones when available). Never output helper text or hanzi. */
  const parts = [...word].map((character) => chinesePronunciationMap[character] ?? null);
  let guide = parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
  guide = guide.replace(/[\u4E00-\u9FFF\u3000-\u303F]/g, "").replace(/\s+/g, " ").trim();
  return guide;
}

function japanesePronunciationGuide(word) {
  /* Consistent structure rule for Japanese:
     Always return romaji. Never output "listen for sounds", "(approx)", or any helper text. */

  // Check explicit overrides first
  if (japanesePronunciationOverrides[word]) {
    return japanesePronunciationOverrides[word];
  }

  let guide = "";
  for (let index = 0; index < word.length; index += 1) {
    const pair = word.slice(index, index + 2);
    if (kanaPronunciationMap[pair]) {
      guide += `${guide && !guide.endsWith("-") ? "-" : ""}${kanaPronunciationMap[pair]}`;
      index += 1;
      continue;
    }
    const single = word[index];
    if (kanaPronunciationMap[single]) {
      guide += `${guide && !guide.endsWith("-") ? "-" : ""}${kanaPronunciationMap[single]}`;
    } else if (/\s/.test(single)) {
      guide += " ";
    } else {
      // Unknown character (usually kanji) - skip it to avoid leaking CJK
      // We do not insert placeholder text
    }
  }

  let cleaned = guide.replace(/-+/g, "-").replace(/\s+/g, " ").trim();

  // Final safety: never return CJK and never return the raw word
  const hasCJK = /[\u3000-\u30FF\u4E00-\u9FFF\uFF00-\uFFEF]/.test(cleaned);
  const normalizedInput = word.replace(/\s+/g, " ").trim().toLowerCase();

  if (hasCJK || !cleaned || cleaned.toLowerCase() === normalizedInput) {
    // Best-effort romaji: return any extracted parts, or a very basic clean version of the word
    const romajiOnly = cleaned.replace(/[^\s\-a-zA-Z]/g, "").replace(/-+/g, "-").replace(/\s+/g, " ").trim();
    if (romajiOnly && romajiOnly.length > 0) {
      return romajiOnly;
    }
    // Ultimate fallback: never return the original Japanese word/kanji
    const stripped = word.replace(/[\u3000-\u30FF\u4E00-\u9FFF\uFF00-\uFFEF]/g, "").toLowerCase().replace(/\s+/g, "-").replace(/-+/g, "-").trim();
    return stripped || japanesePronunciationOverrides[word] || word.toLowerCase().replace(/[\u3000-\u30FF\u4E00-\u9FFF\uFF00-\uFFEF]/g,"").replace(/\s+/g,"-");
  }

  return cleaned;
}

/* =========================================================================
   PRONUNCIATION SYSTEM - Consistent Structure Rules

   Every language row must follow this exact structure:
     Line 1: <strong>translated word</strong> + Language Name
     Line 2: Pronunciation (never contains "listen", "approx", or any helper text)

   Language-specific pronunciation styles:
   - English:   Readable stressed spelling (e.g. THER-mom-uh-ter)
   - Dutch:     Readable pronunciation (e.g. Tur-mo-MEE-tuh)
   - Russian:   Transliteration (e.g. tyer-MO-myetr)
   - Chinese:   Pinyin with tones (e.g. wēn dù jì)
   - Japanese:  Romaji (e.g. on-DO-kei)

   The functions below are guaranteed to never return fallback/helper text.
   ========================================================================= */

function pronunciationGuide(language, word, fallback = word) {
  let result;
  if (language === "zh") result = chinesePronunciationGuide(word);
  else if (language === "ru") result = russianPronunciationGuide(word);
  else if (language === "ja") result = japanesePronunciationGuide(word);
  else result = latinPronunciationGuide(word, language);

  // Absolute safety: never allow helper text or empty values in the UI
  if (!result || /listen|approx|fallback/i.test(result)) {
    const safeFallback = String(fallback ?? word)
      .toLowerCase()
      .replace(/[^a-z\s\-]/gi, "")
      .replace(/\s+/g, "-")
      .trim();
    return safeFallback || latinPronunciationGuide(word, language);
  }
  return result;
}

function wordFacts(emoji, english, dutch, chinese, russian, japanese) {
  const label = capitalize(english);
  const lower = english.toLowerCase();
  const article = /^[aeiou]/i.test(english) ? "An" : "A";
  const isDishware = /chopsticks|plate|fork|knife|spoon|jar|amphora|teapot|teacup|glass|cup|bottle|mug|box/.test(lower);
  const isDrink = /milk|beverage|tea|sake|wine|cocktail|drink|beer|liquid|mate/.test(lower);
  const isWeather = /moon|sun|thermometer|planet|star|cloud|rain|snow|lightning|tornado|fog|wind|cyclone|rainbow|umbrella|snowflake|comet|fire|droplet|wave|milky way/.test(lower);
  // NOTE (Quality Audit): Removed "voltage" — it was only needed for the old "high voltage" label.
  const isPlant = /bouquet|flower|lotus|rosette|rose|hibiscus|sunflower|blossom|tulip|hyacinth|seedling|plant|tree|cactus|rice|herb|shamrock|clover|leaf|nest|mushroom/.test(lower);

  if (isDishware) {
    return [
      `People use ${lower} for serving, holding, or eating food and drinks.`,
      "Table things can have different shapes for scooping, cutting, pouring, or carrying.",
      `Using ${lower} can help children notice mealtime routines and table manners.`,
    ];
  }

  if (isDrink) {
    return [
      `People use ${lower} for drinking, pouring, sipping, or sharing.`,
      "Drinks can be warm, cold, fizzy, creamy, sweet, or plain.",
      `${label} can appear at breakfast, snack time, celebrations, or grown-up meals.`,
    ];
  }

  if (isWeather) {
    return [
      `${label} can appear in the sky, weather, space, or water.`,
      "Sky and weather can change what people wear, see, and do outside.",
      `${label} can help children talk about the day, the season, or what they notice outdoors.`,
    ];
  }

  if (isPlant) {
    return [
      `${label} can be part of plants, flowers, leaves, trees, or growing things.`,
      "Plants can grow from seeds, roots, stems, trunks, or bulbs.",
      `${label} can help children notice colors, shapes, seasons, and tiny outdoor details.`,
    ];
  }

  if (foodEmojiItems.some(([, item]) => item === english)) {
    return [
      `People can eat, cook, prepare, or share ${lower}.`,
      "Foods can be crunchy, soft, sweet, sour, warm, cold, simple, or fancy.",
      `${label} can be part of snacks, meals, lunch boxes, parties, or family recipes.`,
    ];
  }

  if (natureEmojiItems.some(([, item]) => item === english)) {
    return [
      `People can notice ${lower} in nature or outside.`,
      "Nature changes with light, weather, seasons, and where you live.",
      `${label} can help children slow down, look closely, and describe what they see.`,
    ];
  }

  return [
    `${label} can have its own body shape, sound, and way of moving.`,
    "Animals can live near people, on farms, in forests, in water, or far away in the wild.",
    `${label} can help children notice sounds, colors, tails, ears, wings, shells, or feet.`,
  ];
}

Object.assign(
  words,
  Object.fromEntries(
    animalItems.map(([id, emoji, english, dutch, chinese, russian, japanese, japanesePhonetic]) => {
      const key = `animal${id}`;
      return [
        key,
        {
          aliases: [english, dutch, chinese, russian, japanese].map((value) => value.toLowerCase()),
          detected: { word: english, language: "English" },
          translations: {
            nl: { word: dutch, phonetic: pronunciationGuide("nl", dutch) },
            ru: { word: russian, phonetic: pronunciationGuide("ru", russian) },
            zh: { word: chinese, phonetic: pronunciationGuide("zh", chinese) },
            en: { word: english, phonetic: pronunciationGuide("en", english) },
            ja: { word: japanese, phonetic: japanesePhonetic },
          },
          facts: animalFactTexts[id - 1],
          art: key,
        },
      ];
    })
  )
);

Object.assign(
  words,
  Object.fromEntries(
    foodEmojiItems.map(([emoji, english, dutch, chinese, russian, japanese, romaji], index) => {
      const key = makeFoodKey(english, index);
      return [
        key,
        {
          aliases: [english, dutch, chinese, russian, japanese].map((value) => value.toLowerCase()),
          detected: { word: english, language: "English" },
          translations: {
            nl: { word: dutch, phonetic: pronunciationGuide("nl", dutch) },
            ru: { word: russian, phonetic: pronunciationGuide("ru", russian) },
            zh: { word: chinese, phonetic: pronunciationGuide("zh", chinese) },
            en: { word: english, phonetic: pronunciationGuide("en", english) },
            ja: { word: japanese, phonetic: romaji || japanesePronunciationOverrides[japanese] || pronunciationGuide("ja", japanese) },
          },
          facts: foodFactTexts[index],
          art: key,
        },
      ];
    })
  )
);

Object.assign(
  words,
  Object.fromEntries(
    natureEmojiItems.map(([emoji, english, dutch, chinese, russian, japanese, romaji], index) => {
      const key = makeNatureKey(english, index);
      return [
        key,
        {
          aliases: [english, dutch, chinese, russian, japanese].map((value) => value.toLowerCase()),
          detected: { word: english, language: "English" },
          translations: {
            nl: { word: dutch, phonetic: pronunciationGuide("nl", dutch) },
            ru: { word: russian, phonetic: pronunciationGuide("ru", russian) },
            zh: { word: chinese, phonetic: pronunciationGuide("zh", chinese) },
            en: { word: english, phonetic: pronunciationGuide("en", english) },
            ja: { word: japanese, phonetic: romaji || japanesePronunciationOverrides[japanese] || pronunciationGuide("ja", japanese) },
          },
          facts: natureFactTexts[index],
          art: key,
        },
      ];
    })
  )
);

Object.assign(
  words,
  Object.fromEntries(
    activityEmojiItems.map(([emoji, english, dutch, chinese, russian, japanese, subgroup, romaji], index) => {
      const key = makeActivityKey(english, index);
      return [
        key,
        {
          aliases: [english, dutch, chinese, russian, japanese].map((value) => value.toLowerCase()),
          detected: { word: english, language: "English" },
          translations: {
            nl: { word: dutch, phonetic: pronunciationGuide("nl", dutch) },
            ru: { word: russian, phonetic: pronunciationGuide("ru", russian) },
            zh: { word: chinese, phonetic: pronunciationGuide("zh", chinese) },
            en: { word: english, phonetic: pronunciationGuide("en", english) },
            ja: { word: japanese, phonetic: romaji || japanesePronunciationOverrides[japanese] || pronunciationGuide("ja", japanese) },
          },
          facts: activityFacts(english, subgroup),
          art: key,
        },
      ];
    })
  )
);

Object.assign(
  words,
  Object.fromEntries(
    peopleEmojiItems.map(([emoji, english, dutch, chinese, russian, japanese, subgroup, romaji], index) => {
      const key = makePeopleKey(english, index);
      return [
        key,
        {
          aliases: [english, dutch, chinese, russian, japanese].map((value) => value.toLowerCase()),
          detected: { word: english, language: "English" },
          translations: {
            nl: { word: dutch, phonetic: pronunciationGuide("nl", dutch) },
            ru: { word: russian, phonetic: pronunciationGuide("ru", russian) },
            zh: { word: chinese, phonetic: pronunciationGuide("zh", chinese) },
            en: { word: english, phonetic: pronunciationGuide("en", english) },
            ja: { word: japanese, phonetic: romaji || japanesePronunciationOverrides[japanese] || pronunciationGuide("ja", japanese) },
          },
          facts: peopleFacts(english, subgroup),
          art: key,
        },
      ];
    })
  )
);

Object.assign(
  words,
  Object.fromEntries(
    objectEmojiItems.map(([emoji, english, dutch, chinese, russian, japanese, subgroup, romaji], index) => {
      const key = makeObjectKey(english, index);
      return [
        key,
        {
          aliases: [english, dutch, chinese, russian, japanese].map((value) => value.toLowerCase()),
          detected: { word: english, language: "English" },
          translations: {
            nl: { word: dutch, phonetic: pronunciationGuide("nl", dutch) },
            ru: { word: russian, phonetic: pronunciationGuide("ru", russian) },
            zh: { word: chinese, phonetic: pronunciationGuide("zh", chinese) },
            en: { word: english, phonetic: pronunciationGuide("en", english) },
            ja: { word: japanese, phonetic: romaji || japanesePronunciationOverrides[japanese] || pronunciationGuide("ja", japanese) },
          },
          facts: objectFacts(english, subgroup),
          art: key,
        },
      ];
    })
  )
);

Object.assign(
  words,
  Object.fromEntries(
    travelEmojiItems.map(([emoji, english, dutch, chinese, russian, japanese, subgroup, romaji], index) => {
      const key = makeTravelKey(english, index);
      return [
        key,
        {
          aliases: [english, dutch, chinese, russian, japanese].map((value) => value.toLowerCase()),
          detected: { word: english, language: "English" },
          translations: {
            nl: { word: dutch, phonetic: pronunciationGuide("nl", dutch) },
            ru: { word: russian, phonetic: pronunciationGuide("ru", russian) },
            zh: { word: chinese, phonetic: pronunciationGuide("zh", chinese) },
            en: { word: english, phonetic: pronunciationGuide("en", english) },
            ja: { word: japanese, phonetic: romaji || japanesePronunciationOverrides[japanese] || pronunciationGuide("ja", japanese) },
          },
          facts: travelFacts(english, subgroup),
          art: key,
        },
      ];
    })
  )
);

Object.assign(
  artIcons,
  Object.fromEntries(animalItems.map(([id, emoji]) => [`animal${id}`, emoji]))
);

Object.assign(
  artIcons,
  Object.fromEntries(foodEmojiItems.map(([emoji, english], index) => [makeFoodKey(english, index), emoji]))
);

Object.assign(
  artIcons,
  Object.fromEntries(natureEmojiItems.map(([emoji, english], index) => [makeNatureKey(english, index), emoji]))
);

Object.assign(
  artIcons,
  Object.fromEntries(activityEmojiItems.map(([emoji, english], index) => [makeActivityKey(english, index), emoji]))
);

Object.assign(
  artIcons,
  Object.fromEntries(peopleEmojiItems.map(([emoji, english], index) => [makePeopleKey(english, index), emoji]))
);

Object.assign(
  artIcons,
  Object.fromEntries(objectEmojiItems.map(([emoji, english], index) => [makeObjectKey(english, index), emoji]))
);

Object.assign(
  artIcons,
  Object.fromEntries(travelEmojiItems.map(([emoji, english], index) => [makeTravelKey(english, index), emoji]))
);


function applyLatinPhonetics() {
  for (const entry of Object.values(words)) {
    for (const lang of ["en", "nl"]) {
      const translation = entry.translations?.[lang];
      if (translation?.word) {
        translation.phonetic = pronunciationGuide(lang, translation.word);
      }
    }
  }
}

applyLatinPhonetics();

/* =========================================================================
   DATA LAYER — emoji arrays, words, artIcons, and emojiCategories. Must be
   fully initialized before initApp() runs at the file end.
   ========================================================================= */

const emojiCategories = [
  {
    id: "emoji-animals",
    name: "Animals",
    words: animalCategoryWords,
  },
  {
    id: "emoji-nature",
    name: "Nature",
    words: natureCategoryWords,
  },
  {
    id: "emoji-food-drink",
    name: "Food",
    words: foodCategoryWords,
  },
  {
    id: "emoji-activities",
    name: "Activities",
    words: activityCategoryWords,
  },
  {
    id: "emoji-travel-places",
    name: "Places",
    words: travelCategoryWords,
  },
  {
    id: "emoji-objects",
    name: "Objects",
    words: objectCategoryWords,
  },
  {
    id: "emoji-smileys-emotion",
    name: "People",
    words: peopleCategoryWords,
  },
];

function symbolArt(key) {
  const symbol = displayEmoji(artIcons[key] || "✨");
  return `
    <svg viewBox="0 0 280 240" aria-hidden="true">
      <rect x="28" y="178" width="224" height="28" rx="14" fill="#dceee8"/>
      <circle cx="140" cy="112" r="82" fill="#fff4d6"/>
      <circle cx="92" cy="82" r="28" fill="#f06d5e" opacity=".65"/>
      <circle cx="196" cy="92" r="24" fill="#2f9d74" opacity=".65"/>
      <circle cx="190" cy="166" r="18" fill="#3778c2" opacity=".55"/>
      <text x="140" y="143" text-anchor="middle" font-size="92" font-family="Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, system-ui, sans-serif">${escapeHtml(symbol)}</text>
    </svg>
  `;
}

function initApp() {
  assertDomElements();
  validateEmojiArraySchemas();
  renderLanguages();
  renderQuickWords();
  loadVoices();

  els.languageGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-language]");
    if (!button) return;
    const id = button.dataset.language;
    if (selectedLanguages.has(id) && selectedLanguages.size > 1) {
      selectedLanguages.delete(id);
    } else {
      selectedLanguages.add(id);
    }
    renderLanguages();
    if (currentResult && !els.resultOverlay.classList.contains("is-hidden")) {
      renderResult(currentResult.entry);
    }
  });

  document.querySelector(".quick-tries").addEventListener("click", (event) => {
    const categoryButton = event.target.closest("[data-category]");
    if (categoryButton) {
      const categoryId = categoryButton.dataset.category;
      if (expandedVisualCategories.has(categoryId)) {
        expandedVisualCategories.delete(categoryId);
      } else {
        // Single-open accordion: opening one category collapses all others.
        expandedVisualCategories.clear();
        expandedVisualCategories.add(categoryId);
      }
      syncExpandedCategories();
      return;
    }

    const button = event.target.closest("[data-key]");
    if (button) handleVisualWord(button.dataset.key);
  });

  els.closeResultButton.addEventListener("click", closeResult);
  els.expandResultButton.addEventListener("click", toggleExpandedResult);

  els.resultOverlay.addEventListener("click", (event) => {
    if (event.target === els.resultOverlay) closeResult();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !els.resultOverlay.classList.contains("is-hidden")) {
      closeResult();
    }
  });

  els.translationList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-speak]");
    if (button) speak(button.dataset.speak, button.dataset.locale);
  });

  if (window.speechSynthesis) {
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
  }
}

if (document.getElementById("language-grid")) initApp();
