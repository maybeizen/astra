import { defineConfig } from "commandkit";

export default defineConfig({
  src: "src",
  main: "index.js",
  outDir: "dist",
  watch: true,
  sourcemap: false,
  antiCrash: true,
  envExtra: true,
  minify: true,
  clearRestartLogs: false,
});
