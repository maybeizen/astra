import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  minify: false,
  outDir: "dist",
  target: "node18",
  treeshake: true,
  bundle: true,
  skipNodeModulesBundle: true,
  external: ["express"],
});
