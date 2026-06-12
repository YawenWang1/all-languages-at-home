# PR Update Comment Draft

Copy and paste the text below as a new comment on your PR:
https://github.com/ningxxu/all-languages-at-home/pull/1

---

Hi @ningxxu,

I've just updated this PR with the latest changes from `upstream/main` (including your recent commit `a928d14` "Removing unnecessary functions").

### Quick update
- Merged the upstream cleanup into `feature/pronun-romaji-migration`.
- The merge was clean (no conflicts).
- All the romaji data migration, explicit pronunciation fields, overrides, and two-row enforcement logic are preserved on top of the latest upstream code.
- The PR branch is now based on the absolute latest `upstream/main`.

### PR Summary (core contribution)

This PR brings a comprehensive pronunciation quality audit and data structure improvement:

- Converted **all 7 emoji categories** (Animals, Food, Nature, Activities, People, Objects, Travel/Places) to use **explicit romaji fields** (8th element after the Japanese text, modeled exactly on the existing `animalItems`).
- Japanese cards now strictly follow the required two-row format everywhere:
  - Row 1: Correct Japanese word
  - Row 2: Accurate romaji only (never raw kanji, never the Japanese text repeated, never helper text like "listen for sounds")
- Added strong `japanesePronunciationOverrides` + sanitization in `renderResult()` so bad output cannot leak.
- Fixed dozens of specific display issues reported during review (merperson / 人魚, mage showing "i", bone showing "hone", person feeding baby, people with bunny ears, red paper lantern, graduation cap, fountain pen, etc.).
- Applied the same strict rules consistently for English (stressed), Dutch (readable), Russian (transliteration), and Chinese (pinyin with tones).

The work is documented in:
- `PRONUNCIATION_FIXES.md` — detailed before/after table of corrections
- `FINAL_AUDIT_OVERVIEW.md` — full category-by-category report
- `CHANGES.md` — timestamped change log

The prototype/hiding logic and recent upstream cleanups are respected (the voice input code was removed as part of the latest merge).

Branch: `feature/pronun-romaji-migration`

Happy to make any adjustments or split this if preferred. Thanks for the original project!

---

## Alternative: Full Updated PR Description

If you want to replace the entire PR body (edit the PR description), use this version instead:

---

## Summary

This PR ports a full pronunciation quality audit and data structure improvement from my fork, now synced with the latest upstream changes (including the recent "Removing unnecessary functions" cleanup).

### Key Improvements

- Converted **all 7 emoji categories** (Animals, Food, Nature, Activities, People, Objects, Travel/Places) to use explicit romaji fields (modeled on the existing `animalItems` pattern — 7th or 8th element).
- Japanese translation cards now strictly follow the two-row rule everywhere:
  - Row 1: Correct Japanese word
  - Row 2: Accurate romaji (never raw kanji, never the Japanese text repeated, never fallback/helper text)
- Added comprehensive `japanesePronunciationOverrides` + sanitization layer in `renderResult()` so bad romaji/kanji cannot leak into the UI.
- Fixed many specific display issues (merperson, mage, bone, person feeding baby, people with bunny ears, red paper lantern, graduation cap, fountain pen/black nib, person in steamy room, etc.).
- Applied the same strict pronunciation rules to English, Dutch, Chinese, and Russian.

### Recent Update (2026-06-12)

- Merged the latest `upstream/main` (commit `a928d14` "Removing unnecessary functions").
- The merge was clean. Prototype/voice-related code was removed as intended by upstream.
- All romaji data, pronunciation logic, and documentation remain fully intact.
- The PR is now based on the absolute latest upstream code.

### Documentation Added

- `PRONUNCIATION_FIXES.md` — detailed before/after correction tables
- `FINAL_AUDIT_OVERVIEW.md` — full category-by-category audit report
- `CHANGES.md` — timestamped change log
- `VS_CODE_SETUP.md`

Branch: `feature/pronun-romaji-migration`

---

Let me know if you'd like any tweaks to the wording, a shorter version, or if you want me to create a separate file for the main PR description. You can copy the text above directly into a comment or the PR description on GitHub.