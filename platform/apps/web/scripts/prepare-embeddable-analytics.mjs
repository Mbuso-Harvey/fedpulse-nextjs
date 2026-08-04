import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const sourceDirectory = fileURLToPath(
  new URL("../vendor/embeddable-analytics/", import.meta.url),
);
const outputDirectory = fileURLToPath(
  new URL("../public/vendor/embeddable-analytics/", import.meta.url),
);
const outputPath = `${outputDirectory}/widget.js`;

const parts = (await readdir(sourceDirectory))
  .filter((name) => /^widget\.part-\d+\.js$/.test(name))
  .sort();

if (parts.length === 0) {
  throw new Error("No embeddable analytics widget source parts were found.");
}

const contents = await Promise.all(
  parts.map((name) => readFile(`${sourceDirectory}/${name}`, "utf8")),
);

await mkdir(outputDirectory, { recursive: true });
await writeFile(outputPath, contents.join(""), "utf8");

console.log(`Prepared embeddable analytics widget from ${parts.length} source part(s).`);
