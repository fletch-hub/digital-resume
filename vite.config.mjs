import { defineConfig } from "vite";
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";
import handlebars from "vite-plugin-handlebars";
import terser from "@rollup/plugin-terser";

const pageData = {
  "/index.html": {
    title: "Eric Fletcher | Digital Maker",
  },
};

export default defineConfig({
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
    handlebars({
      partialDirectory: resolve(__dirname, "src/partials"),
      context(pagePath) {
        return pageData[pagePath];
      },
      helpers: {
        isDefined: (value) => value !== undefined,
      },
    }),
    tailwindcss(),
  ],
});
