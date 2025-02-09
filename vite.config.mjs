import { defineConfig } from "vite";
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";
import handlebars from "vite-plugin-handlebars";
import terser from "@rollup/plugin-terser";

//optional for emails
//import viteMjml from "./lib/mjml";

const pageData = {
  "/index.html": {
    title: "Main Page",
  },
};

export default defineConfig({
  //assetsInclude: ["**/*.mjml"],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name]_[hash].js",
        assetFileNames: "assets/[name]_[hash][extname]",
      },
      plugins: [
        terser({
          compress: { passes: 2 },
          mangle: {
            keep_fnames: false,
          },
          output: { comments: false },
        }),
      ],
    },
  },
  plugins: [
    tailwindcss(),
    handlebars({
      partialDirectory: resolve(__dirname, "src/partials"),
      context(pagePath) {
        return pageData[pagePath];
      },
      helpers: {
        isDefined: (value) => value !== undefined,
      },
    }),
    //optional for emails
    //viteMjml(),
  ],
});
