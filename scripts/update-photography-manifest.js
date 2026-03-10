#!/usr/bin/env node
/**
 * Scans photography/images/ and writes photography/images.json with the list
 * of image filenames. Run from repo root: node scripts/update-photography-manifest.js
 */

const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '..', 'photography', 'images');
const OUTPUT_FILE = path.join(__dirname, '..', 'photography', 'images.json');
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg']);

function main() {
  let filenames = [];
  try {
    if (!fs.existsSync(IMAGES_DIR)) {
      fs.mkdirSync(IMAGES_DIR, { recursive: true });
    }
    const entries = fs.readdirSync(IMAGES_DIR, { withFileTypes: true });
    for (const e of entries) {
      if (!e.isFile()) continue;
      const ext = path.extname(e.name).toLowerCase();
      if (IMAGE_EXT.has(ext)) {
        filenames.push(e.name);
      }
    }
  } catch (err) {
    console.error('Error reading images directory:', err.message);
    process.exit(1);
  }

  filenames.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const json = JSON.stringify(filenames, null, 2) + '\n';
  try {
    fs.writeFileSync(OUTPUT_FILE, json, 'utf8');
    console.log('Updated', OUTPUT_FILE, 'with', filenames.length, 'image(s).');
  } catch (err) {
    console.error('Error writing images.json:', err.message);
    process.exit(1);
  }
}

main();
