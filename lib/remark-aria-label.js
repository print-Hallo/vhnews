// remark-aria-label.js

import { visit } from 'unist-util-visit';

// Define the custom syntax regex: [!aria]{VISIBLE TEXT}(READABLE TEXT)
// Capture Group 1: Visible Text
// Capture Group 2: Readable (ARIA) Text
const ARIA_LABEL_REGEX = /\[!aria\]\{([^{}]+)\}\(([^{}]+)\)/g;

function remarkAriaLabel() {
  return (tree) => {
    
    // --- FIRST PASS: Tokenize the text into temporary nodes ---
    visit(tree, 'text', (node, index, parent) => {
      let matches = Array.from(node.value.matchAll(ARIA_LABEL_REGEX));

      if (matches.length === 0) {
        return;
      }

      const newNodes = [];
      let lastIndex = 0;

      for (const match of matches) {
        const fullMatch = match[0];
        const visibleText = match[1];
        const readableText = match[2];
        const startIndex = match.index;
        
        // 1. Preserve text before the match
        if (startIndex > lastIndex) {
          newNodes.push({ type: 'text', value: node.value.substring(lastIndex, startIndex) });
        }

        // 2. Create the temporary node
        const tempAriaNode = {
          type: 'ariaCorrection', // Custom temporary node type
          visibleText: visibleText,
          readableText: readableText,
        };
        newNodes.push(tempAriaNode);

        lastIndex = startIndex + fullMatch.length;
      }

      // 3. Preserve text after the last match
      if (lastIndex < node.value.length) {
        newNodes.push({ type: 'text', value: node.value.substring(lastIndex) });
      }

      if (newNodes.length > 0) {
        parent.children.splice(index, 1, ...newNodes);
        return [visit.SKIP, index]; 
      }
    });

    // --- SECOND PASS: Transform the temporary node based on its parent ---
    visit(tree, 'ariaCorrection', (node, index, parent) => {
      const visibleText = node.visibleText;
      const readableText = node.readableText;

      // SCENARIO 1: Nested inside a Link (parent.type === 'link')
      if (parent && parent.type === 'link') {
          
        // 1. Set aria-label on the parent link (<a>)
        if (!parent.data) parent.data = {};
        if (!parent.data.hProperties) parent.data.hProperties = {};
        
        // Use hProperties for attributes that need to survive rehype
        parent.data.hProperties['ariaLabel'] = readableText; 

        // 2. Replace the 'ariaCorrection' node with just the visible text.
        // Screen readers will use the parent's aria-label.
        const newChild = { type: 'text', value: visibleText };
        parent.children.splice(index, 1, newChild);
        
        // Exit the visit function, having successfully corrected the link
        return [visit.SKIP, index]; 

      } else {
        // SCENARIO 2: Standalone text (NOT inside a link)
        // We use the aria-hidden / .sr-only structure.
        
        // Define the two children spans using the data.hProperties convention
        const visibleSpan = {
            type: 'spanAriaHidden',
            data: {
                hName: 'span',
                hProperties: { 'aria-hidden': 'true' },
            },
            children: [{ type: 'text', value: visibleText }],
        };
        
        const srOnlySpan = {
            type: 'spanSROnly',
            data: {
                hName: 'span',
                hProperties: { className: ['sr-only'] },
            },
            children: [{ type: 'text', value: readableText }],
        };
        
        // Create the wrapper span (optional but good practice)
        const wrapperNode = {
            type: 'spanAriaWrapper',
            data: {
                hName: 'span',
                hProperties: { className: ['aria-correction'] },
            },
            children: [srOnlySpan, visibleSpan],
        };
        
        // Replace the temporary node with the final wrapper structure
        parent.children.splice(index, 1, wrapperNode);
        return [visit.SKIP, index];
      }
    });
  };
}

export default remarkAriaLabel;