# Photography gallery

The gallery shows all images in the `photography/images/` folder. **You don’t edit the JSON by hand.**

## Adding photos

1. Put your image files in `photography/images/` (e.g. `photo1.jpg`, `sunset.png`).
2. Regenerate the manifest:
   - **Locally:** From the repo root run:
     ```bash
     node scripts/update-photography-manifest.js
     ```
   - **On GitHub:** If you push changes that touch `photography/images/`, a GitHub Action runs this script and commits the updated `images.json`.

Supported extensions: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.avif`, `.svg`. Files are sorted by name (numeric-aware) in the gallery.
