import React from 'react';
import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Layout from '../../components/layout'
import { Box, HStack, Container, Text} from '@chakra-ui/react';
import Head from 'next/head'
import { format, parseISO } from "date-fns";
import { allHiddenPages, HiddenPage } from "contentlayer/generated";
import ViewCounter from '../view-counter'
import Mdx from 'components/Mdx/Mdx';

export async function getStaticPaths() {
    return {
        paths: allHiddenPages.map((post) => ({ params: { slug: post.slug } })),
        fallback: false,
    }
}

export async function getStaticProps({ params }: { params: { slug: string } }) {

    const post = allHiddenPages.find(
        (post) => post.slug === params.slug
    );

    return {
        props: {
            post
        },
    };
}


export default function HiddenPageTemplate({ post }: { post: HiddenPage }) {

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
            </Container>
        </Layout>
    )
}