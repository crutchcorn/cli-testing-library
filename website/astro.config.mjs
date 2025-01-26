// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    starlight({
      title: "CLI Testing Library",
      logo: {
        src: "./public/koala.png",
        alt: "A koala emoji",
      },
      favicon: "./public/koala.png",
      social: {
        github: "https://github.com/crutchcorn/cli-testing-library",
      },
      components: {
        Head: "./src/components/head.astro",
      },
      customCss: ["./src/styles/global.css"],
      sidebar: [
        {
          label: "Guides",
          items: [
            { label: "Introduction", slug: "guides/introduction" },
            { label: "API", slug: "guides/api" },
            { label: "Configuration Options", slug: "guides/configure" },
            { label: "Debug", slug: "guides/debug" },
            { label: "Differences Between CLI Testing Library & Testing Library", slug: "guides/differences" },
            { label: "Firing Events", slug: "guides/fire-event" },
            { label: "Matchers", slug: "guides/matchers" },
            { label: "About Queries", slug: "guides/queries" },
            { label: "User Event", slug: "guides/user-event" }
          ],
        },
      ],
    }),
  ],
});
