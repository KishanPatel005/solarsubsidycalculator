import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const root = process.cwd();
const src = path.join(root, "public", "favicon-source.png");
const outDir = path.join(root, "public");

async function ensureReadable(p) {
  await fs.access(p);
}

async function writePng(size, fileName) {
  const out = path.join(outDir, fileName);
  await sharp(src).resize(size, size, { fit: "cover" }).png().toFile(out);
  return out;
}

async function main() {
  await ensureReadable(src);

  const p16 = await writePng(16, "favicon-16x16.png");
  const p32 = await writePng(32, "favicon-32x32.png");
  await writePng(180, "apple-touch-icon.png");

  const icoBuf = await pngToIco([p16, p32]);
  await fs.writeFile(path.join(outDir, "favicon.ico"), icoBuf);

  // eslint-disable-next-line no-console
  console.log("Favicons generated in /public");
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

