import { List, ListItem, Stack, Typography, Box } from '@mui/material';
import Layout from '../components/layout'
import Head from 'next/head'
import Link from '../components/link';
import { getAllPosts } from '../lib/api'
import ThumbnailImage from '../components/blog-thumbnail-image';
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'


type FrontMatter = {
    title: string;
    date: string;
    excerpt: string;
    description: string;
    thumbnailImage: {
        src: string;
        alt: string;
    };
    images: {
        src: string;
        alt: string;
    }[];
};

type PostType = {
    frontMatter: FrontMatter;
    slug: string;
};


type Props = {
    allBlogPosts: PostType[]
}

export default function Blog({ allBlogPosts }: Props) {

    if (allBlogPosts.length === 0) {
        return (
            <Layout>
                <Typography variant="body1">There are no blog posts yet.</Typography>
            </Layout>
        )
    }

    return (
        <>
            <Layout>
                <Head>
                    <title>{`Irregular Expressions Blog`}</title>
                </Head>
                <List>
                    {allBlogPosts.map((post) => {
                        const title = post.frontMatter.title || post.slug
                        const blogDescription = post.frontMatter.description || post.frontMatter.excerpt

                        return (
                            <ListItem
                                key={`/blog${post.slug}`}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'stretch'
                                }}
                            >
                                <Box
                                    sx={{
                                        width: {
                                            xs: '100%',
                                            sm: '100%',
                                            md: '70%',
                                            lg: '70%',
                                            xl: '70%',
                                        },
                                        height: '100%',
                                    }}
                                >
                                    <Stack>
                                        <Link
                                            href={'/blog/' + post.slug}
                                            sx={{
                                                color: 'primary.black',
                                                textDecoration: 'none',
                                            }}>
                                            <Typography
                                                variant="h5"
                                                sx={{ textDecoration: "none", fontWeight: 'bold' }}
                                            >
                                                {title}
                                            </Typography>
                                        </Link>
                                        <Typography
                                            color="text.black"
                                            variant="body2"
                                            sx={{ paddingBottom: "1rem", paddingTop: "0.5rem" }}
                                        >
                                            {post.frontMatter.date}
                                        </Typography>
                                        <Link
                                            href={'/blog/' + post.slug}
                                            sx={{
                                                variant: 'body2',
                                                fontWeight: 'normal',
                                                textDecoration: 'none',
                                            }}
                                        >
                                            <Typography itemProp="description">
                                                {blogDescription}
                                            </Typography>
                                        </Link>
                                    </Stack>
                                </Box>
                                <Box
                                    width="30%"
                                    height="100%"
                                    sx={{
                                        width: '30%',
                                        display: {
                                            xs: 'none',
                                            sm: 'none',
                                            md: 'flex',
                                            lg: 'flex',
                                            xl: 'flex',
                                        },
                                        marginLeft: '0.5rem',
                                    }}
                                >
                                    <ThumbnailImage
                                        src={post.frontMatter.thumbnailImage.src}
                                        title={post.frontMatter.title}
                                        slug={post.slug}
                                    />
                                </Box>
                            </ListItem>
                        )
                    })}
                </List>
            </Layout>
        </>
    )
}

export const getStaticProps = async () => {

    const allPosts = await getAllPosts('content/_blog-posts', ['slug', 'title','date'])
        .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))

    const allBlogPosts = allPosts.map(filename => {
        const markdownWithMeta = fs.readFileSync(path.join('content/_blog-posts', `${filename.slug}.mdx`), 'utf-8')
        const { data: frontMatter } = matter(markdownWithMeta)

        console.log(frontMatter)
        return {
            frontMatter,
            slug: filename.slug
        }
    })

    return {
        props: {
            allBlogPosts
        }
    }
}
