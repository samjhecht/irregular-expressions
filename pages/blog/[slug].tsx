import { useRouter } from 'next/router'
// import { GetStaticProps, GetStaticPaths } from 'next';
import ErrorPage from 'next/error'
import { Container, Box, Typography } from '@mui/material';
import Header from '../../components/header'
import Layout from '../../components/layout'
import { getPostBySlug, getAllPosts } from '../../lib/api'
import Head from 'next/head'
// import markdownToHtml from '../../lib/markdownToHtml'
import type PostType from '../../lib/interfaces/post'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from '../../components/link'
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

type PostProps = {
    frontMatter: FrontMatter;
    slug: string;
    mdxSource: MDXRemoteSerializeResult;
};


type Params = {
    params: {
      slug: string
    }
  }


const components = { Link, Image, Box }

export default function BlogPostPage({ frontMatter, slug, mdxSource }: PostProps) {

    const router = useRouter()
    const postTitle = `${frontMatter.title}` || 'Regular Expressions Blog Post'
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
                        <Typography
                            sx={{
                                fontSize: "2rem",
                                fontWeight: "bold",
                                paddingBottom: "1rem",
                            }}>
                            {postTitle}
                        </Typography>
                        <MDXRemote {...mdxSource} components={components} />
                    </>
                )}
            </Container>
        </Layout>
    )
}




// const getStaticPaths = async () => {
//     const postsDirectory = path.join(process.cwd(), 'content/_blog-posts');
//     const filenames = fs.readdirSync(postsDirectory);

//     const slugs = filenames.map((filename) => {
//         const filePath = path.join(postsDirectory, filename);
//         const fileContents = fs.readFileSync(filePath, 'utf8');
//         const { data } = matter(fileContents);

//         return data.slug;
//     });

//     const paths = slugs.map((slug) => ({ params: { slug } }));

//     return {
//         paths,
//         fallback: false,
//     };
// };


// const getStaticProps = async ({params}: Params) => {
//     const postsDirectory = path.join(process.cwd(), 'content/_blog-posts');
//     const filePath = path.join(postsDirectory, `${params.slug}.mdx`);
//     const fileContents = fs.readFileSync(filePath, 'utf8');
//     const { content, data } = matter(fileContents);

//     // Find all image files in the same directory as the post
//     const postDirectory = path.dirname(filePath);
//     const imageFiles = fs
//         .readdirSync(postDirectory)
//         .filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file));

//     const images = imageFiles.map((imageFile) => ({
//         src: `/content/_blog-posts/${params.slug}/${imageFile}`,
//         alt: '',
//     }));

//     const mdxSource = await serialize(content);

//     return {
//         props: {
//             frontMatter: {
//                 ...data,
//                 images,
//             },
//             slug: params.slug,
//             mdxSource,
//         },
//     };
// };

// export { getStaticPaths, getStaticProps}


const getStaticPaths = async () => {
    const files = fs.readdirSync(path.join('content/_blog-posts'))

    const paths = files.map(filename => ({
        params: {
            slug: filename.replace('.mdx', '')
        }
    }))

    return {
        paths,
        fallback: false
    }
}

const getStaticProps = async ({ params }: Params) => {
    const postFilePath = path.join('content/_blog-posts', `${params.slug}.mdx`);
    const fileContents = fs.readFileSync(postFilePath, 'utf-8');
    const { data: frontMatter, content } = matter(fileContents)

    const mdxSource = await serialize(content)

    return {
        props: {
            frontMatter,
            slug: params.slug,
            mdxSource
        }
    }
}

export { getStaticProps, getStaticPaths }

