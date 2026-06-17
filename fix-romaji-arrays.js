const fs = require('fs');
const vm = require('vm');

let code = fs.readFileSync('app.js', 'utf8');

function loadPronunciationGuide(source) {
  const overridesMatch = source.match(
    /const japanesePronunciationOverrides = \{([\s\S]*?)\n\};/
  );
  const kanaMatch = source.match(/const kanaPronunciationMap = \{([\s\S]*?)\};/);
  if (!overridesMatch || !kanaMatch) throw new Error('Could not load pronunciation data');

  const sandbox = {
    japanesePronunciationOverrides: {},
    kanaPronunciationMap: {},
  };
  vm.runInNewContext(
    `japanesePronunciationOverrides = {${overridesMatch[1]}\n};\n` +
      `kanaPronunciationMap = {${kanaMatch[1]}};`,
    sandbox
  );

  return function japanesePronunciationGuide(word) {
    if (sandbox.japanesePronunciationOverrides[word]) {
      return sandbox.japanesePronunciationOverrides[word];
    }
    let guide = '';
    for (let index = 0; index < word.length; index += 1) {
      const pair = word.slice(index, index + 2);
      if (sandbox.kanaPronunciationMap[pair]) {
        guide += `${guide && !guide.endsWith('-') ? '-' : ''}${sandbox.kanaPronunciationMap[pair]}`;
        index += 1;
        continue;
      }
      const single = word[index];
      if (sandbox.kanaPronunciationMap[single]) {
        guide += `${guide && !guide.endsWith('-') ? '-' : ''}${sandbox.kanaPronunciationMap[single]}`;
      } else if (/\s/.test(single)) {
        guide += ' ';
      }
    }
    let cleaned = guide.replace(/-+/g, '-').replace(/\s+/g, ' ').trim();
    const hasCJK = /[\u3000-\u30FF\u4E00-\u9FFF\uFF00-\uFFEF]/.test(cleaned);
    const normalizedInput = word.replace(/\s+/g, ' ').trim().toLowerCase();
    if (hasCJK || !cleaned || cleaned.toLowerCase() === normalizedInput) {
      const romajiOnly = cleaned
        .replace(/[^\s\-a-zA-Zōūāēīôûêâîûäöüß]/g, '')
        .replace(/-+/g, '-')
        .replace(/\s+/g, ' ')
        .trim();
      if (romajiOnly) return romajiOnly;
      const stripped = word
        .replace(/[\u3000-\u30FF\u4E00-\u9FFF\uFF00-\uFFEF]/g, '')
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      return stripped || sandbox.japanesePronunciationOverrides[word] || '';
    }
    return cleaned;
  };
}

const getRomaji = loadPronunciationGuide(code);

const extraOverrides = {
  'フェンシングする人': 'fenshingu suru hito',
  'ハンドボールをする人': 'handobōru o suru hito',
  'ビリヤードの8ボール': 'biriyādo no 8 bōru',
  'ひな人形': 'hinaningyō',
  'こいのぼり': 'koinobori',
  '赤い封筒': 'akai fūtō',
  '包まれたプレゼント': 'tsutsumareta purezento',
  '試験管': 'shikenkan',
  'シャーレ': 'shāre',
  '衛星アンテナ': 'eisei antena',
  '注射器': 'chūshaki',
  '血のしずく': 'chi no shizuku',
  'レンガ': 'renga',
  '岩': 'iwa',
  '木材': 'mokuzai',
  '小屋': 'koya',
  '家々': 'ieie',
  '入場券': 'nyūjōken',
  '勲章': 'kunshō',
  '卓球': 'takkyū',
  '武道着': 'budōgi',
  '的': 'mato',
  '凧': 'tako',
  '水鉄砲': 'mizuteppō',
  '水晶玉': 'suishō dama',
  '花札': 'hanafuda',
  '舞台芸術': 'butai geijutsu',
  '糸': 'ito',
  '毛糸': 'keito',
  '楽譜': 'gakufu',
  '音符': 'onpu',
  '鍵盤': 'kenban',
  '長太鼓': 'nagadaiko',
  '錠剤': 'jōzai',
  '松葉杖': 'matsubazue',
  '聴診器': 'chōshinki',
  '鏡': 'kagami',
  '窓': 'mado',
  '椅子': 'isu',
  '浴槽': 'yokusō',
  '泡': 'awa',
  '消火器': 'shōkaki',
  '廃屋': 'haioku',
  '家': 'ie',
  '郵便局': 'yūbinkyoku',
  '病院': 'byōin',
  '銀行': 'ginkō',
  '工場': 'kōjō',
  '結婚式': 'kekkonshiki',
  '教会': 'kyōkai',
  '噴水': 'funsui',
  '霧': 'kiri',
  '夕日': 'yūhi',
  '観覧車': 'kanransha',
  '機関車': 'kikansha',
  '鉄道車両': 'tetsudō sharyō',
  '高速鉄道': 'kōsoku tetsudō',
  '電車': 'densha',
  '地下鉄': 'chikatetsu',
  '路面電車': 'romendensha',
  '登山鉄道': 'tōzan tetsudō',
};

const subgroupHints = new Set([
  'event', 'object', 'place', 'writing', 'science', 'medical', 'sport',
  'award-medal', 'game', 'household', 'music', 'musical-instrument',
  'place-building', 'place-other', 'place-religious', 'transport-ground',
  'arts & crafts', 'person-sport', 'person-activity', 'person-resting',
  'person-fantasy', 'person-role', 'clothing', 'tool', 'office', 'money',
  'computer', 'light-video', 'book-paper', 'place-map', 'food-drink',
  'person-gesture', 'person-profession',
]);

function looksLikeSubgroup(value) {
  const v = (value || '').replace(/\s*\]?"?$/g, '').trim().toLowerCase();
  if (!v) return false;
  if (subgroupHints.has(v)) return true;
  if (/^(place|person|transport|award)-/.test(v)) return true;
  return false;
}

function extractQuotedStrings(entryLines) {
  const items = [];
  for (const line of entryLines) {
    const re = /"((?:\\.|[^"\\])*)"/g;
    let match;
    while ((match = re.exec(line)) !== null) {
      items.push(match[1].replace(/\\"/g, '"'));
    }
  }
  return items;
}

function rebuildEntry(items) {
  return [
    '  [',
    ...items.map((it, idx) => {
      const escaped = it.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      const comma = idx < items.length - 1 ? ',' : '';
      return `    "${escaped}"${comma}`;
    }),
    '  ],',
  ];
}

function normalizeCorruptedItems(items) {
  if (items.length === 0) return items;

  if (items[0].includes('[ ')) {
    const emoji = items[0].replace(/^\[?\s*"?|"?$/g, '').trim();
    items[0] = emoji;
  }

  const last = items[items.length - 1];
  if (last.includes(']')) {
    items[items.length - 1] = last.replace(/\s*\]?"?$/g, '').trim();
  }

  if (items.length === 8) {
    const subgroup = items[6];
    const romaji = items[7];
    if (looksLikeSubgroup(subgroup) && !looksLikeSubgroup(romaji)) {
      return items;
    }
    if (looksLikeSubgroup(items[7]) && !looksLikeSubgroup(items[6])) {
      return [...items.slice(0, 6), items[7], items[6]];
    }
  }

  return items;
}

function processEntryLines(entryLines) {
  let items = extractQuotedStrings(entryLines);
  if (items.length < 7) return entryLines;

  const corrupted = items[0].includes('[ ') || items.some((it) => it.includes(']'));
  if (corrupted) {
    items = normalizeCorruptedItems(items);
  }

  if (items.length === 7 && looksLikeSubgroup(items[6])) {
    const ja = items[5];
    const romaji = extraOverrides[ja] || getRomaji(ja);
    if (romaji) return rebuildEntry([...items, romaji]);
  }

  if (items.length === 8) {
    return rebuildEntry(items);
  }

  return entryLines;
}

function fixArrayInSource(arrayName) {
  const lines = code.split(/\r?\n/);
  const startRe = new RegExp(
    `^const (${arrayName}) = \\[$`
  );
  let inArray = false;
  let entryLines = [];
  const out = [];
  let fixed = 0;
  let stillMissing = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!inArray && trimmed === `const ${arrayName} = [`) {
      inArray = true;
      out.push(line);
      continue;
    }

    if (!inArray) {
      out.push(line);
      continue;
    }

    if (trimmed === '];') {
      if (entryLines.length) {
        const rebuilt = processEntryLines(entryLines);
        if (rebuilt !== entryLines) {
          out.push(...rebuilt);
          fixed++;
        } else {
          const items = extractQuotedStrings(entryLines);
          if (items.length === 7 && looksLikeSubgroup(items[6]) && !(extraOverrides[items[5]] || getRomaji(items[5]))) {
            stillMissing++;
          }
          out.push(...entryLines);
        }
        entryLines = [];
      }
      out.push(line);
      inArray = false;
      continue;
    }

    if (trimmed === '[' || trimmed.startsWith('[')) {
      if (entryLines.length) {
        const rebuilt = processEntryLines(entryLines);
        if (rebuilt !== entryLines) {
          out.push(...rebuilt);
          fixed++;
        } else {
          const items = extractQuotedStrings(entryLines);
          if (items.length === 7 && looksLikeSubgroup(items[6]) && !(extraOverrides[items[5]] || getRomaji(items[5]))) {
            stillMissing++;
          }
          out.push(...entryLines);
        }
      }
      entryLines = [line];
      continue;
    }

    if (entryLines.length) entryLines.push(line);
    else out.push(line);
  }

  code = out.join('\n');
  console.log(`${arrayName}: fixed ${fixed}, still missing ${stillMissing}`);
  return { fixed, stillMissing };
}

// Fix corrupted blocks with a direct pattern first
code = code.replace(
  /\[\s*\r?\n\s*"\[ "([^"]+)",\s*\r?\n\s*"([^"]*)",\s*\r?\n\s*"([^"]*)",\s*\r?\n\s*"([^"]*)",\s*\r?\n\s*"([^"]*)",\s*\r?\n\s*"([^"]*)",\s*\r?\n\s*"([^"]*)",\s*\r?\n\s*"([^"]+)"\s*\]"\s*\r?\n\s*\],/g,
  (_, emoji, en, nl, zh, ru, ja, romaji, subgroup) =>
    rebuildEntry([emoji, en, nl, zh, ru, ja, subgroup, romaji]).join('\n')
);

const arrays = [
  'activityEmojiItems',
  'objectEmojiItems',
  'travelEmojiItems',
  'peopleEmojiItems',
];
let totalFixed = 0;
let totalMissing = 0;
for (const name of arrays) {
  const result = fixArrayInSource(name);
  totalFixed += result.fixed;
  totalMissing += result.stillMissing;
}

for (const [ja, romaji] of Object.entries(extraOverrides)) {
  if (!code.includes(`"${ja}":`)) {
    code = code.replace(
      /(\n  \/\/ Add more as discovered\.\n\};)/,
      `\n  "${ja}": "${romaji}",$1`
    );
  }
}

fs.writeFileSync('app.js', code, 'utf8');
console.log(`\nDone. Total fixed: ${totalFixed}, still missing: ${totalMissing}`);