import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
// import { notFound } from 'next/navigation';
import Link from '../../components/link'
import Layout from '../../components/layout'
import { Container, Box, Stack, Typography, Divider } from '@mui/material';
// import { getPostBySlug, getAllPosts } from '../../lib/api'
import Head from 'next/head'
import Image from 'next/image';
import BlogImage from '../../components/BlogImage'
import { compareDesc, format, parseISO } from "date-fns";
import { allBlogPosts, BlogPost } from "contentlayer/generated";
import { useMDXComponent } from 'next-contentlayer/hooks'

type BlogPostProps = {
    post: BlogPost,
    previousPost: BlogPost,
    nextPost: BlogPost
}

export async function getStaticPaths() {
    return {
        paths: allBlogPosts.map((post) => ({ params: { slug: post.slug } })),
        fallback: false,
    }
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
    
    const post = allBlogPosts.find(
        (post) => post.slug === params.slug
    );

    const postIndex = allBlogPosts.sort((a, b) => {
        return compareDesc(new Date(a.date), new Date(b.date))
      }).findIndex(post => post.slug === params.slug)
    
    const previousPost = allBlogPosts[postIndex + 1] || null
    let nextPost = null;
    if (postIndex !== 0) {
        // Only assign nextPost if postIndex is not zero
        nextPost = allBlogPosts[postIndex - 1] || null;
      }

    return {
        props: {
            post,
            previousPost,
            nextPost
        },
    };
}

const components = { Link, Image, Box, Typography, BlogImage }

export default function BlogTemplate({ post, previousPost, nextPost }: BlogPostProps) {
    
    const MdxContent = useMDXComponent(post?.body.code)

    const router = useRouter()
    if (!router.isFallback && !post.slug) {
        return <ErrorPage statusCode={404} />
    }

    const postTitle = `${post?.title}` || 'Regular Expressions Blog Post'
    return (
        <Layout>
            <Container maxWidth="md">
                {router.isFallback ? (
                    <Typography>Loading…</Typography>
                ) : (
                    <>
                        <Head>
                            <title>{postTitle}</title>
                        </Head>
                        <Box itemScope itemType="http://schema.org/Article">
                            <Typography itemProp="headline" sx={{
                                fontSize: "2rem",
                                fontWeight: "bold",
                                paddingBottom: "1rem",
                            }}>
                                {postTitle}
                            </Typography>
                            <Typography variant="subtitle1" sx={{
                                paddingBottom: "1rem",
                                paddingTop: "0.5rem"
                            }}>
                                {format(parseISO(post.date), "LLLL d, yyyy")}
                            </Typography>
                        </Box>
                        <MdxContent components={components} />
                    </>
                )}
                <Box mt={4}>
                    <br /><br /><br />
                    <Divider light />
                    <br />
                </Box>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                    sx={{
                        padding: 0,
                    }}>
                    <Box>
                        {previousPost && (
                            <Link href={`/blog/${previousPost.slug}`} rel="prev">
                                ← {previousPost.title}
                            </Link>
                        )}
                    </Box>
                    <Box>
                        {nextPost && (
                            <Link href={`/blog/${nextPost.slug}`} rel="next">
                                {nextPost.title} →
                            </Link>
                        )}
                    </Box>
                </Stack>
            </Container>
        </Layout>
    )
}