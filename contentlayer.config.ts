import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import readingTime from 'reading-time'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeCodeTitles from 'rehype-code-titles'
import rehypePrism from 'rehype-prism-plus'
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis'

export const Blog = defineDocumentType(() => ({
    name: 'Blog',
    filePathPattern: '**/*.mdx',
    contentType: 'mdx',
    fields: {
        title: { type: 'string', required: true },
        date: { type: 'string', required: true },
        description: { type: 'string', required: false },
        thumbnailImage: { type: 'string', required: true }
    },
    computedFields: {
        readingTime: {
            type: 'json',
            resolve: (doc) => readingTime(doc.body.raw)
        },
        slug: {
            type: 'string',
            resolve: (doc) => doc._raw.sourceFileName.replace('.mdx', ''),
        },
        url: {
            type: 'string',
            resolve: (post) => `/blog/${post._raw.flattenedPath.replace(`${post._raw.sourceFileDir}/`, '')}`,
          },
    },
}))

// export const Poetry = defineDocumentType(() => ({
//     name: 'Poetry',
//     filePathPattern: '_poetry/*.mdx',
//     contentType: 'mdx',
//     fields: {
//         title: { type: 'string', required: true },
//         date: { type: 'string', required: true },
//         description: { type: 'string', required: false },
//         thumbnailImage: { type: 'string', required: false }
//     },
//     computedFields: {
//         readingTime: {
//             type: 'json',
//             resolve: (doc) => readingTime(doc.body.raw)
//         },
//         slug: {
//             type: 'string',
//             resolve: (doc) => doc._raw.sourceFileName.replace('.mdx', ''),
//         },
//     },
// }))

export default makeSource({
    contentDirPath: 'content',
    documentTypes: [Blog],
    mdx: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
            rehypeSlug,
            rehypeCodeTitles,
            rehypePrism,
            [
                rehypeAutolinkHeadings,
                {
                  properties: {
                    className: ['anchor'],
                  },
                },
              ],
            rehypeAccessibleEmojis,
        ],
    },
})