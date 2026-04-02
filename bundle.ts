// lightningcss --bundle -d dist ./src/index.css
import { transform } from "lightningcss";
import {
  copyFile,
  glob,
  mkdir,
  readFile,
  writeFile,
  constants,
  rm,
} from "node:fs/promises";
import { basename } from "node:path";

const { code } = transform({
  filename: "src/index.css",
  code: await readFile("src/index.css"),
});

const bundleFonts = async () => {
  for await (const entry of glob("dist/*.woff2")) {
    await rm(entry);
  }
  for await (const entry of glob("src/**/*.woff2")) {
    const dest = `dist/${basename(entry)}`;
    console.log(`${entry} -> ${dest}`);
    await copyFile(entry, dest, constants.COPYFILE_EXCL);
  }
};

await mkdir("dist", { recursive: true });

await Promise.all([writeFile("dist/index.css", code), bundleFonts()]);
