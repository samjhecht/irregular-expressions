import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import readingTime from 'reading-time'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeCodeTitles from 'rehype-code-titles'
import rehypePrism from 'rehype-prism-plus'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeHighlight from 'rehype-highlight'

export const EssayPost = defineDocumentType(() => ({
    name: 'EssayPost',
    filePathPattern: '_essays/*.mdx',
    contentType: 'mdx',
    fields: {
        title: { type: 'string', required: true },
        date: { type: 'string', required: true },
        description: { type: 'string', required: false },
        thumbnailImage: { type: 'string', required: true },
        status: { type: 'string', required: false }
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
            resolve: (post) => `/essays/${post._raw.flattenedPath.replace(`${post._raw.sourceFileDir}/`, '')}`,
        },
    },
}))

export const PoetryPost = defineDocumentType(() => ({
    name: 'PoetryPost',
    filePathPattern: '_poetry/*.mdx',
    contentType: 'mdx',
    fields: {
        title: { type: 'string', required: true },
        date: { type: 'string', required: true },
        description: { type: 'string', required: false },
        thumbnailImage: { type: 'string', required: false },
        status: { type: 'string', required: false }
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
            resolve: (post) => `/poetry/${post._raw.flattenedPath.replace(`${post._raw.sourceFileDir}/`, '')}`,
        },
    },
}))

export const HiddenPage = defineDocumentType(() => ({
    name: 'HiddenPage',
    filePathPattern: '_hidden-pages/*.mdx',
    contentType: 'mdx',
    fields: {
        title: { type: 'string', required: true },
        date: { type: 'string', required: true },
        description: { type: 'string', required: false },
        thumbnailImage: { type: 'string', required: false },
        status: { type: 'string', required: false }
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
            resolve: (post) => `/poetry/${post._raw.flattenedPath.replace(`${post._raw.sourceFileDir}/`, '')}`,
        },
    },
}))

const prettyCodeOptions = {
    theme: 'one-dark-pro',

    onVisitLine(node: { children: string | unknown[] }) {
        if (node.children.length === 0) {
            node.children = [{ type: 'text', value: ' ' }];
        }
    },

    onVisitHighlightedLine(node: { properties: { className: string[] } }) {
        node.properties.className.push('line--highlighted');
    },

    onVisitHighlightedWord(node: { properties: { className: string[] } }) {
        node.properties.className = ['highlighted--word'];
    },
};

export default makeSource({
    contentDirPath: 'content',
    documentTypes: [PoetryPost, EssayPost, HiddenPage],
    mdx: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
            rehypeSlug,
            rehypePrism,
            rehypeCodeTitles,
            rehypeHighlight,
            [rehypePrettyCode, prettyCodeOptions],
            [
                rehypeAutolinkHeadings,
                {
                    properties: {
                        className: ['anchor'],
                    },
                },
                { behaviour: 'wrap' },
            ],
        ],
    },
})