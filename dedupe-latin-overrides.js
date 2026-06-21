const fs = require("fs");

function isLatinPhoneticDuplicate(word, phonetic) {
  const w = String(word).toLowerCase().replace(/[^a-z0-9]/g, "");
  const p = String(phonetic).toLowerCase().replace(/[^a-z0-9]/g, "");
  return w.length > 0 && w === p;
}

const code = fs.readFileSync("app.js", "utf8");
const m = code.match(/const latinPronunciationOverrides = \{([\s\S]*?)\n\};/);
if (!m) throw new Error("latinPronunciationOverrides not found");

const body = m[1];
const entries = [];
const keyRe = /"((?:\\.|[^"\\])*)"\s*:\s*"((?:\\.|[^"\\])*)"|([a-zA-Z0-9_ -]+)\s*:\s*"((?:\\.|[^"\\])*)"/g;
let match;
while ((match = keyRe.exec(body)) !== null) {
  entries.push({ key: (match[1] || match[3]).trim(), value: match[2] || match[4] });
}

const merged = new Map();
const dupes = [];
for (const e of entries) {
  if (merged.has(e.key)) {
    dupes.push(e.key);
    const prev = merged.get(e.key);
    const prevBad = isLatinPhoneticDuplicate(e.key, prev);
    const nextBad = isLatinPhoneticDuplicate(e.key, e.value);
    if (prevBad && !nextBad) merged.set(e.key, e.value);
    else if (!prevBad && nextBad) merged.set(e.key, prev);
    else merged.set(e.key, e.value);
  } else {
    merged.set(e.key, e.value);
  }
}

const fixes = {
  airplane: "AIR-playn",
  sandwich: "SAN-wij",
  playground: "PLAY-grownd",
  wolk: "vohlk",
  vlinder: "FLIN-der",
  raket: "rah-KET",
  drum: "druhm",
  "long drum": "LONG druhm",
  harp: "hahrp",
  foot: "fut",
  leg: "legg",
  fog: "fawg",
  dumpling: "DUHM-pling",
  handbag: "HAN-bahg",
  ring: "ringg",
  laptop: "LAP-tahp",
  map: "mahp",
  tent: "tehnt",
  "sleeping bag": "SLEEP-ing bahg",
  hat: "haht",
  book: "buhk",
  bee: "beeh",
  fly: "flyh",
  ant: "anth",
  bug: "bugh",
  hen: "henh",
  eel: "eelh",
  ram: "ramh",
  yak: "yakh",
};

for (const [key, value] of Object.entries(fixes)) {
  merged.set(key, value);
}

const remaining = [...merged.entries()].filter(([k, v]) => isLatinPhoneticDuplicate(k, v));
if (remaining.length) {
  console.error("Still duplicate after fixes:", remaining.map(([k, v]) => `${k}=${v}`).join(", "));
  process.exit(1);
}

const lines = [...merged.entries()].map(([k, v]) => {
  const key = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(k) && !k.includes(" ") ? k : `"${k}"`;
  return `  ${key}: "${v}",`;
});

const newBlock = `const latinPronunciationOverrides = {\n${lines.join("\n")}\n};`;
const newCode = code.replace(/const latinPronunciationOverrides = \{[\s\S]*?\n\};/, newBlock);
fs.writeFileSync("app.js", newCode, "utf8");

console.log(`Entries: ${entries.length}, unique: ${merged.size}, duplicate keys merged: ${dupes.length}`);
console.log("All latin overrides pass duplicate check.");