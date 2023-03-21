import Image from 'next/image';
import * as React from "react"
import { List, ListItem, ListItemText, Stack, Typography, Box } from '@mui/material';
import Layout from '../components/layout'
import { getAllPosts } from '../lib/api'
import Head from 'next/head'
import Link from '../components/link';
import ThumbnailImage from '../components/blog-thumbnail-image';
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'


type PoemType = {
    frontMatter: {
        title: string
        date: string
        excerpt: string
        description: string
        thumbnailImage: {
            src: string
            alt: string
        }
    }
    slug: string
}


type Props = {
    allPoems: PoemType[]
}

export default function Poetry({ allPoems }: Props) {

    if (allPoems.length === 0) {
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
                    <title>{`Irregular Poetic Expressions`}</title>
                </Head>
                <List>
                    {allPoems.map((poem) => {
                        const title = poem.frontMatter.title || poem.slug
                        const poemDescription = poem.frontMatter.description || poem.frontMatter.excerpt

                        return (
                            <ListItem
                                key={`/blog${poem.slug}`}
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
                                            href={'/blog/' + poem.slug}
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
                                            {poem.frontMatter.date}
                                        </Typography>
                                        <Link
                                            href={'/blog/' + poem.slug}
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
                                    <ThumbnailImage
                                        src={poem.frontMatter.thumbnailImage.src}
                                        title={poem.frontMatter.title}
                                        slug={poem.slug}
                                    />
                                </Box>
                            </ListItem>
                        )
                    })}
                </List>
            </Layout>
        </>
    )
}

export const getStaticProps = async () => {
    const files = fs.readdirSync(path.join('content/_poetry'))

    const allPoems = files.map(filename => {
        const markdownWithMeta = fs.readFileSync(path.join('content/_poetry', filename), 'utf-8')
        const { data: frontMatter } = matter(markdownWithMeta)

        return {
            frontMatter,
            slug: filename.split('.')[0]
        }
    })

    return {
        props: {
            allPoems
        }
    }
}