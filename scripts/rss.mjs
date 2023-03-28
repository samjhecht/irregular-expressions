// import { writeFileSync } from 'fs';
// import RSS from 'rss';
// import { allBlogPosts, allPoetryPosts } from 'contentlayer/generated';

// const feed = new RSS({
//   title: "My Blogs",
//   feed_url: `${process.env.WEBSITE_URL}/rss.xml`,
//   site_url: `${process.env.WEBSITE_URL}`,
// })

// allBlogPosts.map((blog) => ({
//   title: blog.title,
//   description: blog.description,
//   url: `${process.env.WEBSITE_URL}/blog/${blog.slug}`,
//   date: blog.date,
// })).forEach((item) => {
//   feed.item(item)
// })

// allPoetryPosts.map((poem) => ({
//     title: poem.title,
//     description: poem.description,
//     url: `${process.env.WEBSITE_URL}/poetry/${poem.slug}`,
//     date: poem.date,
//   })).forEach((item) => {
//     feed.item(item)
//   })

// writeFileSync('./public/rss.xml', feed.xml({ indent: true }))