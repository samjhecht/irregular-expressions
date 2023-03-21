import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from '../../components/link'
import Layout from '../../components/layout'
import { Container, Box, Stack, Typography, Divider } from '@mui/material';
import { getPostBySlug, getAllPosts } from '../../lib/api'
import Head from 'next/head'
// import markdownToHtml from '../../lib/markdownToHtml'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import Image from 'next/image';

type FrontMatter = {
    title: string;
    date: string;
    excerpt: string;
    description: string;
    thumbnailImage: {
        src: string;
        alt: string;
    };
    images: {
        src: string;
        alt: string;
    }[];
};

type Items = {
    [key: string]: string
  }

type PostProps = {
    frontMatter: FrontMatter;
    slug: string;
    mdxSource: MDXRemoteSerializeResult;
    previousPost: Items;
    nextPost: Items;
};


type Params = {
    params: {
        slug: string
    }
}


const components = { Link, Image, Box, Typography }

export default function HiddenPageTemplate({ frontMatter, slug, mdxSource, previousPost, nextPost }: PostProps) {

    const router = useRouter()
    const postTitle = `${frontMatter.title}` || 'Another Regular Expression'
    if (!router.isFallback && !slug) {
        return <ErrorPage statusCode={404} />
    }
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
                                {frontMatter.date}
                            </Typography>
                        </Box>
                        <MDXRemote {...mdxSource} components={components} />
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
                            <Link href={`/poetry${previousPost.slug}`} rel="prev">
                                ← {previousPost.title}
                            </Link>
                        )}
                    </Box>
                    <Box>
                        {nextPost && (
                            <Link href={`/poetry${nextPost.slug}`} rel="next">
                                {nextPost.title} →
                            </Link>
                        )}
                    </Box>
                </Stack>
            </Container>
        </Layout>
    )
}

const getStaticPaths = async () => {
    const posts = getAllPosts('content/_hidden-pages', ['slug'])
    const slugs = posts.map(post => post.slug)

    const paths = slugs.map(s => ({
        params: {
            slug: s
        }
    }))

    return {
        paths,
        fallback: false
    }
}

const getStaticProps = async ({ params }: Params) => {
    const allPosts = await getAllPosts('content/_hidden-pages', ['slug', 'title'])
    const postIndex = allPosts.findIndex(post => post.slug === params.slug)
    const previousPost = allPosts[postIndex - 1] || null
    const nextPost = allPosts[postIndex + 1] || null

    const postFilePath = path.join('content/_hidden-pages', `${params.slug}.mdx`);
    const fileContents = fs.readFileSync(postFilePath, 'utf-8');
    const { data: frontMatter, content } = matter(fileContents)

    const mdxSource = await serialize(content)

    return {
        props: {
            frontMatter,
            slug: params.slug,
            mdxSource,
            previousPost,
            nextPost
        }
    }
}

export { getStaticProps, getStaticPaths }