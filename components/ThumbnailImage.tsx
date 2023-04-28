import { Link, Box } from '@chakra-ui/react';
import Image from 'next/image';
import styled from 'styled-components';

type Props = {
  title: string
  src: string
  slug?: string
}

const ImageWrapper = styled.span`
object-fit: cover;
width: 100%;
height: 100%;
margin-right: 0.5rem;
`;

const ThumbnailImage = ({ title, src, slug }: Props) => {
  const image = (
    <ImageWrapper>
      <Image
        src={src}
        alt={`Cover Image for ${title}`}
        width={229}
        height={229}
        style= {{ objectFit: 'cover'}}
      />
    </ImageWrapper>
  )
  return (
    <Box>
      {slug ? (
        <Link href={`/essays/${slug}`}>
          {image}
        </Link>
      ) : (
        image
      )}
    </Box>
  )
};

export default ThumbnailImage