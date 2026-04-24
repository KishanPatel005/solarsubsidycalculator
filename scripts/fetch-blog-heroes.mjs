import fs from "node:fs/promises";
import path from "node:path";
import https from "node:https";
import sharp from "sharp";

const TARGET_W = 1200;
const TARGET_H = 630;
const QUALITY = 80;

const root = process.cwd();
const outBase = path.join(root, "public", "blogs");

/** @type {Array<{ slug: string, url: string }>} */
const HEROES = [
  {
    slug: "pm-surya-ghar-yojana-2025",
    url: "https://images.pexels.com/photos/1254997/pexels-photo-1254997.jpeg?cs=srgb&dl=pexels-alimadad-1254997.jpg&fm=jpg",
  },
  {
    slug: "solar-subsidy-gujarat-2025",
    url: "https://images.pexels.com/photos/8853525/pexels-photo-8853525.jpeg?cs=srgb&dl=pexels-cristian-rojas-8853525.jpg&fm=jpg",
  },
  {
    slug: "solar-subsidy-deadline-2026",
    url: "https://images.pexels.com/photos/1599819/pexels-photo-1599819.jpeg?cs=srgb&dl=pexels-tomfisk-1599819.jpg&fm=jpg",
  },
  {
    slug: "solar-subsidy-apply-online",
    url: "https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg?cs=srgb&dl=pexels-pixabay-433308.jpg&fm=jpg",
  },
  {
    slug: "solar-subsidy-documents-required",
    url: "https://images.pexels.com/photos/9875445/pexels-photo-9875445.jpeg?cs=srgb&dl=pexels-kindel-media-9875445.jpg&fm=jpg",
  },
  {
    slug: "solar-subsidy-haryana-2025",
    url: "https://images.pexels.com/photos/9799720/pexels-photo-9799720.jpeg?cs=srgb&dl=pexels-kindel-media-9799720.jpg&fm=jpg",
  },
  {
    slug: "solar-subsidy-maharashtra-2025",
    url: "https://images.pexels.com/photos/9875425/pexels-photo-9875425.jpeg?cs=srgb&dl=pexels-kindel-media-9875425.jpg&fm=jpg",
  },
  {
    slug: "solar-loan-vs-subsidy",
    url: "https://images.pexels.com/photos/8566472/pexels-photo-8566472.jpeg?cs=srgb&dl=pexels-anna-shvets-8566472.jpg&fm=jpg",
  },
  {
    slug: "solar-subsidy-status-check",
    url: "https://images.pexels.com/photos/914977/pexels-photo-914977.jpeg?cs=srgb&dl=pexels-pixabay-914977.jpg&fm=jpg",
  },
  {
    slug: "solar-savings-calculator-guide",
    url: "https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?cs=srgb&dl=pexels-pixabay-356036.jpg&fm=jpg",
  },
];

function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (!res.statusCode || res.statusCode >= 400) {
          reject(new Error(`Download failed: ${url} (${res.statusCode})`));
          res.resume();
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      })
      .on("error", reject);
  });
}

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function writeHero(slug, url) {
  const outDir = path.join(outBase, slug);
  const outPath = path.join(outDir, "hero.webp");
  await ensureDir(outDir);

  const input = await downloadBuffer(url);

  const webp = await sharp(input)
    .resize(TARGET_W, TARGET_H, { fit: "cover", position: "attention" })
    .webp({ quality: QUALITY })
    .toBuffer();

  await fs.writeFile(outPath, webp);
  return outPath;
}

async function main() {
  const results = [];
  for (const h of HEROES) {
    // eslint-disable-next-line no-console
    console.log(`Fetching ${h.slug}...`);
    const out = await writeHero(h.slug, h.url);
    results.push(out);
  }
  // eslint-disable-next-line no-console
  console.log(`Done. Wrote ${results.length} hero.webp files.`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

