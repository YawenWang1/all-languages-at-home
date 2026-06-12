# Alle Talen Thuis Prototype

## Share With GitHub Pages

GitHub Pages can host the app as a static website. The shared web version supports:

- picking an emoji
- opening the result popup
- playing pronunciation with the browser's built-in voices

To publish:

1. Create a new GitHub repository.
2. Upload these files from this folder:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `.nojekyll`
3. In GitHub, open `Settings` > `Pages`.
4. Under `Build and deployment`, choose `Deploy from a branch`.
5. Choose the `main` branch and `/root`, then save.

GitHub will give you a public URL after the first deployment finishes.

## Generate Unicode Emoji Catalog

The visual picker can be generated from Unicode emoji data.

```bash
python3 tools_generate_unicode_catalog.py
```

The script saves the raw Unicode file at:

```text
unicode/emoji-test.txt
```

and writes the app-ready catalog to:

```text
emoji_catalog.js
```
