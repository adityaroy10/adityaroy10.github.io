# Portfolio

Personal portfolio site - clean, modular, dark theme with smooth animations. Built for **GitHub Pages**.

## Sections

- **Hero** - intro, tagline, and quick links (LinkedIn, GitHub, email)
- **Education** - timeline with expandable coursework
- **Experience** - internships with expandable details
- **Projects** - grid of project cards; click to expand, link to repos/papers
- **Beyond academics** - Photography and Volunteering (each links to its own page)
- **Contact** - Get in touch heading, icons (LinkedIn, GitHub, email, Copy email), Resume PDF

## Subpages

- **Photography** (`photography/index.html`) - gallery loaded from `photography/images.json`; click a photo to expand, click outside to close. Add images to `photography/images/` and run `node scripts/update-photography-manifest.js` (or rely on the GitHub Action to update the manifest on push).
- **Volunteering** (`volunteering/index.html`) - Project Ropa and community involvement, with images.

## Run locally

From the project root:

```bash
# Python
python -m http.server 8000

# Node (npx)
npx serve .
```

Then open `http://localhost:8000`. Use a local server so subpages and `photography/images.json` load correctly.

## Create the repo and host on GitHub Pages

1. **Create a new repo on GitHub**
   - Go to [github.com/new](https://github.com/new).
   - Name it `portfolio` (or `username.github.io` for a root URL like `https://username.github.io`).
   - Leave it empty (no README, .gitignore, or license).

2. **Push this folder to the repo**
   From your portfolio folder (where `index.html` lives):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: portfolio site"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` with your GitHub username (and `portfolio` with your repo name if different).

3. **Turn on GitHub Pages**
   - In the repo: **Settings → Pages**.
   - Under **Build and deployment**, **Source**: choose **Deploy from a branch**.
   - **Branch**: `main`, **Folder**: `/ (root)`.
   - Save. After a minute or two, the site will be at:
     - `https://YOUR_USERNAME.github.io/portfolio/` (if the repo is named `portfolio`), or
     - `https://YOUR_USERNAME.github.io/` (if the repo is `YOUR_USERNAME.github.io`).

4. **Optional: workflow permissions**
   The photography manifest workflow needs write access to push updated `images.json`. If the first run fails with a permission error: **Settings → Actions → General → Workflow permissions** → set **Read and write permissions**, then save.

The `.nojekyll` file is included so GitHub Pages serves the site as static files (no Jekyll).

## Customize

- **Theme / accent:** `css/variables.css` - change `--accent` and `--accent-dim`.
- **Content:** `index.html` - hero, education, experience, projects, contact links (LinkedIn, GitHub, resume).
- **Profile photo:** Add your photo as `assets/profile.jpg` (circular, LinkedIn-style, shown in the hero). If the file is missing, the hero still works but the image area will be broken.
- **Easter egg:** Konami code (↑↑↓↓←→←→BA) on the main page.

## Structure

```
├── index.html
├── css/
│   ├── variables.css
│   ├── base.css
│   ├── layout.css
│   ├── sections.css
│   ├── animations.css
│   ├── components.css
│   ├── expandable.css
│   └── subpages.css
├── js/
│   └── main.js
├── assets/                 # project thumbnails
├── photography/
│   ├── index.html
│   ├── images.json         # list of image filenames (auto-updated by script or Action)
│   ├── images/             # put photos here
│   ├── js/
│   │   └── gallery.js
│   └── README.md
├── volunteering/
│   ├── index.html
│   └── images/
├── scripts/
│   └── update-photography-manifest.js
├── .github/
│   └── workflows/
│       └── update-photography-manifest.yml
├── .nojekyll
├── .gitignore
├── ResumeOLNew.pdf
└── README.md
```
