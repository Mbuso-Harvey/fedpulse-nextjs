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

let widgetSource = contents.join("");

// The supplied widget declares profiles inside the automatic-recommendation
// branch but also includes it in approval feedback. Promote it to render scope
// so approval mode works for both automatic recommendations and raw specs.
const customSpecDeclaration =
  "    const customSpec = this.getAttribute('spec');";
const scopedProfilesDeclaration =
  "    let profiles = null;\n    const customSpec = this.getAttribute('spec');";
const localProfilesDeclaration =
  "      const profiles = analyzeData(this._data);";
const sharedProfilesAssignment =
  "      profiles = analyzeData(this._data);";

if (!widgetSource.includes(customSpecDeclaration)) {
  throw new Error("Embeddable analytics custom-spec boundary was not found.");
}
if (!widgetSource.includes(localProfilesDeclaration)) {
  throw new Error("Embeddable analytics profiling boundary was not found.");
}

widgetSource = widgetSource
  .replace(customSpecDeclaration, scopedProfilesDeclaration)
  .replace(localProfilesDeclaration, sharedProfilesAssignment);

await mkdir(outputDirectory, { recursive: true });
await writeFile(outputPath, widgetSource, "utf8");

console.log(
  `Prepared embeddable analytics widget from ${parts.length} source part(s).`,
);
