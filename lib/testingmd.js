import { markdownToHtml } from "./markdown.js"  // your existing pipeline

const md = `
1. hello
- sooo
- **Bold item**
- Item with [link](https://example.com)
`

async function run() {
  const html = await markdownToHtml(md)
  console.log(html)
}

run()
