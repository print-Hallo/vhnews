import { visit } from "unist-util-visit"

/**
 * Converts `[word]{=definition}` patterns into
 * <span class="tooltip" data-tip="definition">word</span>
 */
export default function rehypeTooltips() {
  return (tree) => {
    visit(tree, "text", (node, index, parent) => {
      const regex = /\[([^\]]+)\]\{=([^}]+)\}/g
      let match
      const newNodes = []
      let lastIndex = 0

      while ((match = regex.exec(node.value)) !== null) {
        const [full, term, definition] = match

        // Add text before match (if any)
        if (match.index > lastIndex) {
          newNodes.push({
            type: "text",
            value: node.value.slice(lastIndex, match.index),
          })
        }

        // Add tooltip span
        newNodes.push({
          type: "element",
          tagName: "span",
          properties: { className: ["tooltip"], "data-tip": definition.trim() },
          children: [{ type: "text", value: term.trim() }],
        })

        lastIndex = match.index + full.length
      }

      // Add trailing text (if any)
      if (lastIndex < node.value.length) {
        newNodes.push({ type: "text", value: node.value.slice(lastIndex) })
      }

      // Replace node if we found at least one tooltip
      if (newNodes.length) {
        parent.children.splice(index, 1, ...newNodes)
        return [visit.SKIP, index + newNodes.length]
      }
    })
  }
}
