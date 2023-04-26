
import Layout from '../components/layout'
import Head from 'next/head'
import { compareDesc, format, parseISO } from "date-fns";
import { allHiddenPages, HiddenPage } from "contentlayer/generated";
import { LinkBox, LinkOverlay, Spacer, Text, Box, Flex, Button, Link, VStack } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useMediaQuery } from '@chakra-ui/react';

const PAGE_SIZE = 10;

type Post = {
    title: string
    date: string
    description?: string | null
    thumbnailImage?: string | null
    slug: string
}

type Props = {
    posts: Post[];
};

export async function getStaticProps(): Promise<{ props: Props }> {
    const posts: Post[] = allHiddenPages.map((post) => {
        return {
            title: post.title,
            date: post.date,
            description: post.description || null,
            thumbnailImage: post.thumbnailImage || null,
            slug: post.slug,
        };
    }).sort((a, b) => {
        return compareDesc(new Date(a.date), new Date(b.date));
    });

    return { props: { posts } };
}



export default function EssaysHome({ posts }: { posts: HiddenPage[] }) {
    const [visiblePosts, setVisiblePosts] = useState<Post[]>([]);
    const [numVisible, setNumVisible] = useState(PAGE_SIZE);

    const [isLargerThanMD] = useMediaQuery('(min-width: 48em)');

    useEffect(() => {
        setVisiblePosts(posts.slice(0, numVisible));
    }, [numVisible, posts]);

    const handleShowMore = () => {
        const numPosts = posts.length;
        const remainingPosts = numPosts - numVisible;
        const numToAdd = Math.min(PAGE_SIZE, remainingPosts);
        setNumVisible(numVisible + numToAdd);
    };

    const showMoreButton = posts.length > visiblePosts.length && (
        <Box display="flex" justifyContent="center" mt="2rem">
            <Button variant="outline" onClick={handleShowMore}>
                Show More Poems
            </Button>
        </Box>
    );

    if (visiblePosts.length === 0) {
        return (
            <Layout>
                <Text variant="body1">There are no hidden pages yet.</Text>
            </Layout>
        )
    }

    return (
        <>
            <Layout>
                <Head>
                    <title>{`Irregular Expressions Hidden Pages`}</title>
                </Head>
                <Flex direction="column">
                    {visiblePosts.map((post) => {
                        const title = post.title || post.slug
                        const essayDescription = post.description || null

                        return (
                            <Flex
                                key={`/essays${post.slug}`}
                                direction="row"
                                marginBottom="2rem"
                            >
                                <LinkBox>
                                    <VStack
                                        height="100%"
                                        align="flex-start"
                                        spacing={1}
                                        paddingRight={{ base: "0", md: "1rem" }}
                                    >
                                        <LinkOverlay
                                            href={'/essays/' + post.slug}
                                            textDecoration="none"
                                            _hover={{ textDecoration: "none" }}
                                        >
                                            <Text
                                                fontSize="xl"
                                                textDecoration="none"
                                                fontFamily="Vulf Sans Bold"
                                            >
                                                {title}
                                            </Text>
                                        </LinkOverlay>
                                        <Text fontSize="sm" pt="0.5rem" pb="1rem">
                                            {format(parseISO(post.date), "LLLL d, yyyy")}
                                        </Text>
                                        <Text>{essayDescription}</Text>
                                    </VStack>
                                </LinkBox>
                                <Spacer />
                                {post.thumbnailImage && isLargerThanMD && (
                                    <Box
                                        width="30%"
                                        height="100%"
                                        marginLeft={{ base: "0", md: "0.5rem" }}
                                    >
                                        <Box width="229px" height="229px" position="relative">
                                            <Link href={`/essays/${post.slug}`} aria-label={title}>
                                                <Image
                                                    src={post.thumbnailImage}
                                                    alt={post.title}
                                                    fill
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            </Link>
                                        </Box>

                                    </Box>
                                )}
                            </Flex>
                        )
                    })}
                </Flex>
                {showMoreButton}
            </Layout>
        </>
    )
}
