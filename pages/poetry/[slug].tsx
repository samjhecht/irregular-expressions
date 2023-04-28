
import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Layout from '../../components/layout'
import Head from 'next/head'
import { compareDesc, format, parseISO } from "date-fns";
import { allPoetryPosts, PoetryPost } from "contentlayer/generated";
import SubscribeBox from '../../components/SubscribeBox'
import ViewCounter from '../view-counter';
import { Box, GridItem, HStack, Container, Link, VStack, Text, Divider, Grid } from '@chakra-ui/react';
import Mdx from 'components/Mdx/Mdx';

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


export default function PoemTemplate({ post, previousPost, nextPost }: PoetryPostProps) {

    const router = useRouter()
    if (!router.isFallback && !post.slug) {
        return <ErrorPage statusCode={404} />
    }

    const postTitle = `${post.title}` || 'Regular Poetic Expression'
    return (
        <Layout>
            <Container>
                {router.isFallback ? (
                    <Text>Loading…</Text>
                ) : (
                    <>
                        <Head>
                            <title>{postTitle}</title>
                        </Head>
                        <Box itemScope itemType="http://schema.org/Article">
                            <Text itemProp="headline" sx={{
                                fontSize: "2rem",
                                fontFamily: "Vulf Sans Bold",
                                paddingBottom: "1rem",
                            }}>
                                {postTitle}
                            </Text>
                            <HStack
                                justifyContent="space-between"
                                alignItems="center"
                                spacing={2}
                            >
                                <Text variant="subtitle1" sx={{
                                    paddingBottom: "1rem",
                                    paddingTop: "0.5rem"
                                }}>
                                    {format(parseISO(post.date), "LLLL d, yyyy")}
                                </Text>
                                <ViewCounter slug={post.slug} trackView={true} />
                            </HStack>
                        </Box>
                        <Mdx code={post?.body.code} />
                    </>
                )}
                <Box mt={4}>
                    <br /><br /><br />
                    <Divider />
                    <br />
                </Box>
                <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }} gap={4}>
                    <GridItem>
                        <Box
                            mt={1}
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                        >
                            <VStack alignItems="left" alignContent="start" spacing={1} mt={2}>
                                <Text fontSize="xl" fontWeight="bold">More Poems</Text>
                                <Box>
                                    {nextPost && (
                                        <Link href={`/poetry/${nextPost.slug}`} rel="next">
                                            Next: {nextPost.title}
                                        </Link>
                                    )}
                                </Box>
                                <Box>
                                    {previousPost && (
                                        <Link href={`/poetry/${previousPost.slug}`} rel="prev">
                                            Previous: {previousPost.title}
                                        </Link>
                                    )}
                                </Box>
                            </VStack>
                        </Box>
                    </GridItem>
                    <GridItem>
                        <SubscribeBox />
                    </GridItem>
                </Grid>
            </Container>
        </Layout>
    )
}
