import { visit } from "unist-util-visit";

export const rehypeHandleMdExtension = () => {
    const pattern = /^(\.\/.+)\.md(.*)/;

    const canBeProcessed = (node) => (
        node.tagName === "a" &&
        node.properties.href &&
        pattern.test(node.properties.href)
    )

    const processNode = (node) => {
        const href = node.properties.href;
        const results = href.match(pattern)
        node.properties.href = `${results[1]}${results[2]}`;
    }

    return (tree) => {
        visit(tree, "element", (node) => {
            canBeProcessed(node) && processNode(node)
        })
    }
}