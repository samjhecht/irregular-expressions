import { useState, useEffect } from 'react';
import { List, ListItem, Button, Stack, Typography, Box } from '@mui/material';
import Layout from '../components/layout'
import Head from 'next/head'
import Link from '../components/link';
import { compareDesc, format, parseISO } from "date-fns";
import { allPoetryPosts, PoetryPost } from "contentlayer/generated";
import PoetryThumbnailImage from '../components/PoetryThumbnail';

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
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: '2rem' }}>
            <Button variant="outlined" onClick={handleShowMore}>
                Show More Poems
            </Button>
        </Box>
    );

    if (visiblePosts.length === 0) {
        return (
            <Layout>
                <Typography variant="body1">There are no poems yet.</Typography>
            </Layout>
        );
    }

    return (
        <>
            <Layout>
                <Head>
                    <title>{`Irregular Expressions Poetry`}</title>
                </Head>
                <List>
                    {visiblePosts.map((poem) => {
                        const title = poem.title || poem.slug
                        const poemDescription = poem.description || null

                        return (
                            <ListItem
                                key={`/poetry${poem.slug}`}
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
                                            href={'/poetry/' + poem.slug}
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
                                            {format(parseISO(poem.date), "LLLL d, yyyy")}
                                        </Typography>
                                        <Link
                                            href={'/poetry/' + poem.slug}
                                            sx={{
                                                variant: 'body2',
                                                fontWeight: 'normal',
                                                textDecoration: 'none',
                                            }}
                                        >
                                            <Typography itemProp="description">
                                                {poemDescription}
                                            </Typography>
                                        </Link>
                                    </Stack>
                                </Box>
                                {poem.thumbnailImage && (
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
                                        <PoetryThumbnailImage
                                            src={poem.thumbnailImage}
                                            title={poem.title}
                                            slug={poem.slug}
                                        />
                                    </Box>
                                )}
                            </ListItem>
                        )
                    })}
                </List>
                {showMoreButton}
            </Layout>
        </>
    )
}
