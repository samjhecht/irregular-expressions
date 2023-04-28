import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Link from '../../components/link'
import Layout from '../../components/layout'
import { Container, Grid, Box, Stack, Typography, Divider } from '@mui/material';
import Head from 'next/head'
import Image from 'next/image';
import { compareDesc, format, parseISO } from "date-fns";
import { allEssayPosts, EssayPost } from "contentlayer/generated";
import { useMDXComponent } from 'next-contentlayer/hooks'
import MdxImage from 'components/MdxImage/MdxImage';
import MdxCodeBlock from 'components/Mdx/MdxCodeBlock';
import BlogImage from 'components/BlogImage';
import SubscribeBox from 'components/SubscribeBox';
import ViewCounter from '../view-counter'

type EssayPostProps = {
    post: EssayPost,
    previousPost: EssayPost,
    nextPost: EssayPost
}

export async function getStaticPaths() {
    return {
        paths: allEssayPosts.map((post) => ({ params: { slug: post.slug } })),
        fallback: false,
    }
}

export async function getStaticProps({ params }: { params: { slug: string } }) {

    const post = allEssayPosts.find(
        (post) => post.slug === params.slug
    );

    const postIndex = allEssayPosts.sort((a, b) => {
        return compareDesc(new Date(a.date), new Date(b.date))
    }).findIndex(post => post.slug === params.slug)

    const previousPost = allEssayPosts[postIndex + 1] || null
    let nextPost = null;
    if (postIndex !== 0) {
        // Only assign nextPost if postIndex is not zero
        nextPost = allEssayPosts[postIndex - 1] || null;
    }

    return {
        props: {
            post,
            previousPost,
            nextPost
        },
    };
}

const components = { Link, Image, Box, BlogImage, Typography, MdxImage, MdxCodeBlock }

export default function EssayTemplate({ post, previousPost, nextPost }: EssayPostProps) {

    const MdxContent = useMDXComponent(post?.body.code)

    const router = useRouter()
    if (!router.isFallback && !post.slug) {
        return <ErrorPage statusCode={404} />
    }

    const postTitle = `${post?.title}` || 'Regular Expressions Essay'
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
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                spacing={2}
                            >
                                <Typography variant="subtitle1" sx={{
                                    paddingBottom: "1rem",
                                    paddingTop: "0.5rem"
                                }}>
                                    {format(parseISO(post.date), "LLLL d, yyyy")}
                                </Typography>
                                <ViewCounter slug={post.slug} trackView={true} />
                            </Stack>
                        </Box>
                        <MdxContent components={components} />
                    </>
                )}
                <Box mt={4}>
                    <br /><br /><br />
                    <Divider light />
                    <br />
                </Box>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Box
                            sx={{
                                marginTop: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Stack
                                direction="column"
                                alignItems="left"
                                alignContent="start"
                                spacing={1}
                                mt={2}
                            >
                                <Typography variant="h6" sx={{ fontWeight: "bold" }}>More Essays</Typography>
                                <Box>
                                    {previousPost && (
                                        <Link href={`/essays/${previousPost.slug}`} rel="prev">
                                            Previous: {previousPost.title}
                                        </Link>
                                    )}
                                </Box>
                                <Box>
                                    {nextPost && (
                                        <Link href={`/essays/${nextPost.slug}`} rel="next">
                                            Next: {nextPost.title}
                                        </Link>
                                    )}
                                </Box>
                            </Stack>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <SubscribeBox />
                    </Grid>
                </Grid>
            </Container>
        </Layout>
    )
}