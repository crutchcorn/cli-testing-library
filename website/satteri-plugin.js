import { defineHastPlugin } from "satteri";

const markdownExtensionPattern = /^(\..+)\.md(.*)/;

export const satteriHandleMdExtension = defineHastPlugin({
  name: "handle-md-extension",
  element: {
    filter: ["a"],
    visit(node, ctx) {
      const href = node.properties.href;

      if (typeof href !== "string") return;

      const match = href.match(markdownExtensionPattern);

      if (match) {
        ctx.setProperty(node, "href", `${match[1]}${match[2]}`);
      }
    },
  },
});
