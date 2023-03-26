import { List, ListItem, Stack, Typography, Box } from '@mui/material';
import Layout from '../components/layout'
import Head from 'next/head'
import Link from '../components/link';
import ThumbnailImage from '../components/blog-thumbnail-image';
import { compareDesc, format, parseISO } from "date-fns";
import { allBlogPosts, BlogPost } from "contentlayer/generated";

export async function getStaticProps() {
    const posts: BlogPost[] = allBlogPosts.sort((a, b) => {
        return compareDesc(new Date(a.date), new Date(b.date))
    })
    return { props: { posts } }
}

export default function BlogHome({ posts }: { posts: BlogPost[] }) {

    if (posts.length === 0) {
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
                    {posts.map((post) => {
                        const title = post.title || post.slug
                        const blogDescription = post.description || null

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
                                            sx={{textDecoration: 'none'}}>
                                            <Typography
                                                variant="h5"
                                                sx={{ textDecoration: "none", fontWeight: 'bold' }}
                                            >
                                                {title}
                                            </Typography>
                                        </Link>
                                        <Typography sx={{ paddingBottom: "1rem", paddingTop: "0.5rem" }}>
                                            {format(parseISO(post.date), "LLLL d, yyyy")}
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
                                        src={post.thumbnailImage}
                                        title={post.title}
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
