const fs = require("fs");
const vm = require("vm");

function isLatinPhoneticDuplicate(word, phonetic) {
  const w = String(word).toLowerCase().replace(/[^a-z0-9]/g, "");
  const p = String(phonetic).toLowerCase().replace(/[^a-z0-9]/g, "");
  return w.length > 0 && w === p;
}

const code = fs.readFileSync("app.js", "utf8");
const m = code.match(/const latinPronunciationOverrides = (\{[\s\S]*?\n\});/);
if (!m) {
  console.error("latinPronunciationOverrides not found");
  process.exit(1);
}
const overrides = vm.runInNewContext(`(${m[1]})`);

const exact = [];
for (const [key, val] of Object.entries(overrides)) {
  if (isLatinPhoneticDuplicate(key, val)) exact.push({ key, val });
}

console.log("EXACT_DUPES", exact.length);
exact.forEach((e) => console.log(`  ${e.key} -> ${e.val}`));

function latinPhoneticAntiDuplicate(word) {
  const normalized = word.toLowerCase().replace(/\s+/g, " ").trim();
  return normalized
    .split(" ")
    .map((part) => (part.length <= 4 ? `${part}h` : part.replace(/([aeiouy])([^aeiouy]*)$/i, "$1h$2")))
    .join(" ");
}

function latinPronunciationGuide(word) {
  const normalized = word.toLowerCase().replace(/\s+/g, " ").trim();
  if (overrides[normalized]) {
    const override = overrides[normalized];
    if (!isLatinPhoneticDuplicate(word, override)) return override;
  }

  let guide = normalized
    .replace(/([aeiouy]+)([bcdfghjklmnpqrstvwxyz]+)/gi, "$1-$2")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (!guide || guide === normalized || isLatinPhoneticDuplicate(word, guide)) {
    guide = normalized.replace(/^([bcdfghjklmnpqrstvwxyz]*[aeiouy]+)(.*)$/i, (_, first, rest) => first.toUpperCase() + rest);
  }

  if (isLatinPhoneticDuplicate(word, guide)) {
    guide = latinPhoneticAntiDuplicate(word);
  }

  return guide || latinPhoneticAntiDuplicate(word);
}

const fallbackCaseOnly = ["Bee", "Fly", "Ant", "Bug", "Hen", "Eel", "Ram", "Yak"];
const badFallback = [];
for (const w of fallbackCaseOnly) {
  const g = latinPronunciationGuide(w);
  if (isLatinPhoneticDuplicate(w, g)) badFallback.push({ w, g });
}

console.log("BAD_FALLBACK", badFallback.length);
badFallback.forEach((e) => console.log(`  ${e.w} -> ${e.g}`));

const maintainerWords = ["fog", "drum", "tent", "ring", "foot", "leg", "wolk", "harp", "map", "hat", "book"];
const badMaintainer = [];
for (const w of maintainerWords) {
  const g = latinPronunciationGuide(w);
  if (isLatinPhoneticDuplicate(w, g)) badMaintainer.push({ w, g });
}

console.log("BAD_MAINTAINER_WORDS", badMaintainer.length);
badMaintainer.forEach((e) => console.log(`  ${e.w} -> ${e.g}`));

const failed = exact.length + badFallback.length + badMaintainer.length;
if (failed) {
  console.error(`\nAudit failed: ${failed} issue(s).`);
  process.exit(1);
}
console.log("\nAll Latin duplicate checks passed.");