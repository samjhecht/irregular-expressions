import { List, ListItem, Stack, Typography, Box } from '@mui/material';
import Layout from '../components/layout'
import Head from 'next/head'
import Link from '../components/link';
import { compareDesc, format, parseISO } from "date-fns";
import { allPoetryPosts, PoetryPost } from "contentlayer/generated";
import PoetryThumbnailImage from '../components/PoetryThumbnail';

export async function getStaticProps() {
    const posts: PoetryPost[] = allPoetryPosts.sort((a, b) => {
        return compareDesc(new Date(a.date), new Date(b.date))
    })
    return { props: { posts } }
}

export default function Poetry({ posts }: { posts: PoetryPost[] }) {

    if (posts.length === 0) {
        return (
            <Layout>
                <Typography variant="body1">There are no poems yet.</Typography>
            </Layout>
        )
    }

    return (
        <>
            <Layout>
                <Head>
                    <title>{`Irregular Expressions Poetry`}</title>
                </Head>
                <List>
                    {posts.map((poem) => {
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
            </Layout>
        </>
    )
}
