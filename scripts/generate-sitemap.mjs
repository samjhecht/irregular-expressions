import { writeFileSync } from 'fs';
import globby from 'globby';
import prettier from 'prettier';

async function generate() {
    // const prettierConfig = await prettier.resolveConfig('./.prettierrc.js');
    // const pages = await globby([
    //     'pages/*.js',
    //     'pages/*.tsx',
    //     'content/**/*.mdx',
    //     '!data/*.mdx',
    //     '!pages/_*.js',
    //     '!pages/_*.tsx',
    //     '!pages/api',
    //     '!pages/404.js',
    //     '!pages/404.tsx',
    // ]);

    // const sitemap = `
    // <?xml version="1.0" encoding="UTF-8"?>
    // <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    //     ${pages
    //         .map((page) => {
    //             const path = page
    //                 .replace('pages', '')
    //                 .replace('data', '')
    //                 .replace('.js', '')
    //                 .replace('.mdx', '');
    //             const route = path === '/index' ? '' : path;

    //             return `
    //           <url>
    //             <loc>${`${process.env.WEBSITE_URL}${route}`}</loc>
    //           </url>
    //         `;
    //         })
    //         .join('')}
    // </urlset>
    // `;

    // const formatted = prettier.format(sitemap, {
    //     ...prettierConfig,
    //     parser: 'html',
    // });

    // // eslint-disable-next-line no-sync
    // writeFileSync('public/sitemap.xml', formatted);

    const pages = await globby([
        'pages/*.tsx',
        'content/**/*.mdx',
        '!pages/_*.tsx',
      ])
      
      const urlTags = pages
        .map((file) =>
          file
            .replace('pages', '')
            .replace('content', '')
            .replace('.tsx', '')
            .replace('.mdx', '')
        )
        .map((path) => (path === '/index' ? '/' : path))
        .map(
          (path) => `
            <url>
                <loc>localhost:3000${path}</loc>
            </url>
          `
        )
        .join('')
      
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

generate();