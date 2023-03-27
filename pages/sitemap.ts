import { allBlogPosts, allPoetryPosts } from 'contentlayer/generated';

export default async function sitemap() {
  const blogs = allBlogPosts.map((post) => ({
    url: `https://irregular-expressions.com/blog/${post.slug}`,
    lastModified: post.date,
  }));

  const poems = allPoetryPosts.map((post) => ({
    url: `https://irregular-expressions.com/poetry/${post.slug}`,
    lastModified: post.date,
    }));

  const routes = ['', '/about', '/blog', '/poetry'].map(
    (route) => ({
      url: `https://irregular-expressions.com${route}`,
      lastModified: new Date().toISOString().split('T')[0],
    })
  );

  return [...routes, ...blogs, ...poems];
}