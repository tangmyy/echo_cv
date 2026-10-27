import { createRequire } from "node:module";
import { readdir, mkdir, stat, rename, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
// Reuse the image processor shipped with the project's Next.js installation.
const nextRequire = createRequire(require.resolve("next/package.json"));
const sharp = nextRequire("sharp");
const imagePattern = /\.(jpe?g|png|webp|avif)$/i;
const force = process.argv.includes("--force");

async function syncImages() {
    let converted = 0;
    let skipped = 0;
    for (const group of ["bg", "photos"]) {
        const sourceDir = path.join(root, "public", group);
        const targetDir = path.join(root, "public", "optimized", group);
        const entries = await readdir(sourceDir, { withFileTypes: true });
        const images = entries.filter(entry => entry.isFile() && imagePattern.test(entry.name));
        const names = new Set();
        // Detect ambiguous names before writing any files in this group.
        for (const image of images) {
            const name = image.name.replace(imagePattern, ".webp").toLowerCase();
            if (names.has(name)) throw new Error(`${group}: multiple source images map to ${name}; rename one first.`);
            names.add(name);
        }
        await mkdir(targetDir, { recursive: true });
        for (const image of images) {
            const source = path.join(sourceDir, image.name);
            const target = path.join(targetDir, image.name.replace(imagePattern, ".webp"));
            const sourceInfo = await stat(source);
            const targetInfo = await stat(target).catch(error => {
                if (error.code !== "ENOENT") throw error;
                return null;
            });
            if (!force && targetInfo?.size > 0 && targetInfo.mtimeMs >= sourceInfo.mtimeMs) {
                skipped++;
                continue;
            }
            const temporary = `${target}.${process.pid}.tmp`;
            try {
                await sharp(source).rotate()
                    .resize({ width: 2560, height: 2560, fit: "inside", withoutEnlargement: true })
                    .webp({ quality: 85 }).toFile(temporary);
                await rename(temporary, target);
            } finally {
                await rm(temporary, { force: true });
            }
            converted++;
            console.log(`Generated: public/optimized/${group}/${path.basename(target)}`);
        }
    }
    console.log(`Images synced: ${converted} generated, ${skipped} unchanged.`);
}

syncImages().catch(error => {
    console.error("Image sync failed:", error.message);
    process.exitCode = 1;
});
