import React from 'react';
import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Layout from '../../components/layout'
import { Box, GridItem, HStack, Container, Link, VStack, Text, Divider, Grid } from '@chakra-ui/react';
import Head from 'next/head'
import { compareDesc, format, parseISO } from "date-fns";
import { allEssayPosts, EssayPost } from "contentlayer/generated";
import SubscribeBox from 'components/SubscribeBox';
import ViewCounter from '../view-counter'
import Mdx from 'components/Mdx/Mdx';

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


export default function EssayTemplate({ post, previousPost, nextPost }: EssayPostProps) {

    const router = useRouter()
    if (!router.isFallback && !post.slug) {
        return <ErrorPage statusCode={404} />
    }

    const postTitle = `${post?.title}` || 'Regular Expressions Essay'
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
                                <Text fontSize="xl" fontWeight="bold">More Essays</Text>
                                <Box>
                                    {nextPost && (
                                        <Link href={`/essays/${nextPost.slug}`} rel="next">
                                            <Text fontStyle="italic">Next: {nextPost.title}</Text>
                                        </Link>
                                    )}
                                </Box>
                                <Box>
                                    {previousPost && (
                                        <Link href={`/essays/${previousPost.slug}`} rel="prev">
                                            <Text fontStyle="italic">Previous: {previousPost.title}</Text>
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