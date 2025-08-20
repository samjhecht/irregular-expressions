// import fs from 'fs'
// import { join } from 'path'
// import matter from 'gray-matter'

// export function getPostSlugs(dir_name: string) {
//   const postDirectory = join(process.cwd(), dir_name)
//   return fs.readdirSync(postDirectory)
// }

// export function getPostBySlug(dir_name: string, slug: string, fields: string[] = []) {
//   const postDirectory = join(process.cwd(), dir_name)
//   const realSlug = slug.replace(/\.mdx$/, '')
//   const fullPath = join(postDirectory, `${realSlug}.mdx`)
//   const fileContents = fs.readFileSync(fullPath, 'utf8')
//   const { data, content } = matter(fileContents)

//   type Items = {
//     [key: string]: string
//   }

//   const items: Items = {}

//   // Ensure only the minimal needed data is exposed
//   fields.forEach((field) => {
//     if (field === 'slug') {
//       items[field] = realSlug
//     }
//     if (field === 'content') {
//       items[field] = content
//     }

//     if (typeof data[field] !== 'undefined') {
//       items[field] = data[field]
//     }
//   })

//   return items
// }

// export function getAllPosts(dir_name: string, fields: string[] = []) {
//   const slugs = getPostSlugs(dir_name)
//   const posts = slugs
//     .map((slug) => getPostBySlug(dir_name, slug, fields))
//     // sort posts by date in descending order
//     .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
//   return posts
// }
