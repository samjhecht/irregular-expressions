import { writeFileSync } from 'fs'
import globby from 'globby'
import prettier from 'prettier'

async function generate() {
  const pages = await globby([
    'pages/*.tsx',
    'content/**/*.mdx',
    '!content/_hidden-pages/*.mdx',
    '!pages/_*.tsx',
  ])

  const urlTags = pages
    .map((file) =>
      file
        .replace('pages', '')
        .replace('content', '')
        .replace('_essays', 'essays')
        .replace('_poetry', 'poetry')
        .replace('.tsx', '')
        .replace('.mdx', '')
    )
    .map((path) => (path === '/index' ? '/' : path))
    .map(
      (path) => `
            <url>
                <loc>${process.env.WEBSITE_URL}${path}</loc>
            </url>
          `
    )
    .join('')

  console.log(urlTags)

  const sitemap = `
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${urlTags}
        </urlset>
      `

  const prettierConfig = await prettier.resolveConfig('./prettierrc')
  const formatted = prettier.format(sitemap, {
    ...prettierConfig,
    parser: 'html',
  })

  writeFileSync('public/sitemap.xml', formatted)
}

generate()
