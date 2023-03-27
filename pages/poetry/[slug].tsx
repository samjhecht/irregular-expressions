import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Link from '../../components/link'
import Layout from '../../components/layout'
import { Container, Box, Stack, Typography, Divider } from '@mui/material';
import Head from 'next/head'
import Image from 'next/image';
import { compareDesc, format, parseISO } from "date-fns";
import { allPoetryPosts, PoetryPost } from "contentlayer/generated";
import { useMDXComponent } from 'next-contentlayer/hooks'


type PoetryPostProps = {
    post: PoetryPost,
    previousPost: PoetryPost,
    nextPost: PoetryPost
}

export async function getStaticPaths() {
    return {
        paths: allPoetryPosts.map((post) => ({ params: { slug: post.slug } })),
        fallback: false,
    }
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
    const post = allPoetryPosts.find(
        (post) => post.slug === params.slug
    );

    const postIndex = allPoetryPosts.sort((a, b) => {
        return compareDesc(new Date(a.date), new Date(b.date))
    }).findIndex(post => post.slug === params.slug)

    const previousPost = allPoetryPosts[postIndex + 1] || null
    let nextPost = null;
    if (postIndex !== 0) {
        // Only assign nextPost if postIndex is not zero
        nextPost = allPoetryPosts[postIndex - 1] || null;
    }

    return {
        props: {
            post,
            previousPost,
            nextPost
        },
    };
}


const components = { Link, Image, Box, Typography }


export default function PoemTemplate({ post, previousPost, nextPost }: PoetryPostProps) {


    // Define a type guard to check if `post` is defined
    function isPostDefined(post: PoetryPost | undefined): post is PoetryPost {
        return post !== undefined;
    }

    const router = useRouter()
    if (!router.isFallback && !isPostDefined(post)) {
        return <ErrorPage statusCode={404} />
    }

    // const MdxContent = useMDXComponent(post.body.code)
    let MdxContent = null;
    if (isPostDefined(post)) {
        MdxContent = useMDXComponent(post.body.code)
    }
    const postTitle = `${post.title}` || 'Regular Poetic Expression'
    return (
        <Layout>
            <Container>
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
                            <Link href={`/poetry/${previousPost.slug}`} rel="prev">
                                ← {previousPost.title}
                            </Link>
                        )}
                    </Box>
                    <Box>
                        {nextPost && (
                            <Link href={`/poetry/${nextPost.slug}`} rel="next">
                                {nextPost.title} →
                            </Link>
                        )}
                    </Box>
                </Stack>
            </Container>
        </Layout>
    )
}

