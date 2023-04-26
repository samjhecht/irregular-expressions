import { useState, useEffect } from 'react';
import { LinkBox, LinkOverlay, Text, Spacer, Box, Flex, Button, Link } from '@chakra-ui/react';
import Layout from '../components/layout'
import Image from 'next/image';
import Head from 'next/head'
import { compareDesc, format, parseISO } from "date-fns";
import { allPoetryPosts } from "contentlayer/generated";
import { useMediaQuery } from '@chakra-ui/react';

const PAGE_SIZE = 10;

type PoetryPostFrontMatter = {
    title: string
    date: string
    description?: string | null
    thumbnailImage?: string | null
    slug: string
}

type Props = {
    posts: PoetryPostFrontMatter[];
};

export async function getStaticProps(): Promise<{ props: Props }> {
    const posts: PoetryPostFrontMatter[] = allPoetryPosts.map((post) => {
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

export default function Poetry({ posts }: Props) {
    const [visiblePosts, setVisiblePosts] = useState<PoetryPostFrontMatter[]>([]);
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
                <Text>No poems yet.</Text>
            </Layout>
        );
    }

    return (
        <>
            <Layout>
                <Head>
                    <title>{`Irregular Expressions Poetry`}</title>
                </Head>
                <Flex direction="column">
                    {visiblePosts.map((poem) => {
                        const title = poem.title || poem.slug
                        const poemDescription = poem.description || null

                        return (
                            <Flex
                                key={`/poetry${poem.slug}`}
                                direction="row"
                                alignItems="space-between"
                                marginBottom="2rem"
                            >
                                <LinkBox
                                    width={{ base: "100%", sm: "100%", md: "70%" }}
                                    height="100%"
                                    paddingRight={{ base: "0", md: "1rem" }}
                                >
                                    <LinkOverlay
                                        href={'/poetry/' + poem.slug}
                                        textDecoration="none"
                                        _hover={{ textDecoration: "none" }}
                                    >
                                        <Text
                                            fontSize="2xl"
                                            textDecoration="none"
                                            fontFamily="Vulf Sans Bold"
                                        >
                                            {title}
                                        </Text>
                                    </LinkOverlay>
                                    <Text fontSize="sm" pt="0.5rem" pb="1rem">
                                        {format(parseISO(poem.date), "LLLL d, yyyy")}
                                    </Text>
                                        <Text>{poemDescription}</Text>
                                </LinkBox>
                                <Spacer />
                                {poem.thumbnailImage && isLargerThanMD && (
                                    <Box
                                        width="30%"
                                        height="100%"
                                        marginLeft={{ base: "0", md: "0.5rem" }}
                                        display={{ base: "none", xs: "none", sm: "none", md: "flex", lg: "flex", xl: "flex" }}
                                    >

                                        <Box width="150px" height="150px" position="relative">
                                        <Link href={`/poetry/${poem.slug}`} aria-label={title}>
                                            <Image
                                                src={poem.thumbnailImage}
                                                alt={poem.title}
                                                layout="fill"
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