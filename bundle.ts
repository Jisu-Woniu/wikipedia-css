// lightningcss --bundle -d dist ./src/index.css
import { bundleAsync } from "lightningcss";
import { copyFile, mkdir, writeFile, constants, rm } from "node:fs/promises";
import { basename, dirname, relative, resolve } from "node:path";

const { code, dependencies } = await bundleAsync({
  filename: "src/index.css",
  analyzeDependencies: { preserveImports: true },
  minify: true,
});

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });

const bundleFonts = (dependencies || [])
  .filter((dependency) => dependency.type === "url")
  .map((dependency) => {
    const src = relative(
      ".",
      resolve(dirname(dependency.loc.filePath), dependency.url),
    );
    const dest = `dist/${dependency.placeholder}`;
    console.log(`${src} -> ${dest}`);
    return copyFile(src, dest, constants.COPYFILE_EXCL);
  });

await Promise.all([writeFile("dist/index.css", code), ...bundleFonts]);
