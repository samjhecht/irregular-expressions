
// import RSS from 'rss';
// require('tsconfig-paths/register');
import { allBlogPosts, allPoetryPosts } from './.contentlayer/generated';
import { compareDesc, parseISO } from "date-fns";
import { Feed } from "feed";
import { writeFileSync } from "fs";

const allPosts = [...allBlogPosts, ...allPoetryPosts];

const feed = new Feed({
    title: "Irregular Expressions",
    description: "This website is a necessary extravagance.",
    id: "https://irregular-expressions.com",
    link: "https://irregular-expressions.com",
    language: "en",
    favicon: "https://irregular-expressions.com/favicon.ico",
    copyright: "All rights reserved 2023, Julius Hecht",
    author: {
        name: "Julius Hecht",
        link: "https://irregular-expressions.com",
    },
});

allPosts
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
    .forEach((post) => {
        const url = `https://irregular-expressions.com/${post.url}`;
        feed.addItem({
            id: url,
            link: url,
            title: post.title,
            description: post.summary,
            date: parseISO(post.date),
            image: post.thumbnailImage,
            author: [{
                name: "Julius Hecht",
                link: "https://irregular-expressions.com",
            }],
        });
    });


console.log(feed.rss2({ indent: true }));


writeFileSync("./public/rss.xml", feed.rss2(), { encoding: "utf-8" });
