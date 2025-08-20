type PostType = {
  frontMatter: {
    title: string
    date: string
    excerpt: string
    description: string
    thumbnailImage: {
      src: string
      alt: string
    }
    images: {
      src: string
      alt: string
    }[]
  }
  slug: string
}

export default PostType
