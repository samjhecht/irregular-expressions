import { Box, Link, AspectRatio } from '@chakra-ui/react';
import Image from 'next/image';

type Props = {
  title: string;
  src: string;
  slug?: string;
};

const PoetryThumbnailImage = ({ title, src, slug }: Props) => {
  const image = (
    <AspectRatio ratio={1}>
      <Box pos="relative" width="100%" height="100%">
        <Image
          src={src}
          alt={`Cover Image for ${title}`}
          layout="fill"
          objectFit="cover"
        />
      </Box>
    </AspectRatio>
  );
  return (
    <Box>
      {slug ? (
        <Link href={`/poetry/${slug}`} aria-label={title}>
          {image}
        </Link>
      ) : (
        image
      )}
    </Box>
  );
};

export default PoetryThumbnailImage;



// import { Link, Box } from '@chakra-ui/react';
// import Image from 'next/image';
// import styled from 'styled-components';

// type Props = {
//   title: string
//   src: string
//   slug?: string
// }

// const ImageWrapper = styled.span`
// object-fit: cover;
// width: 100%;
// height: 100%;
// margin-right: 0.5rem;
// `;

// const PoetryThumbnailImage = ({ title, src, slug }: Props) => {
//   const image = (
//     <ImageWrapper>
//       <Image
//         src={src}
//         alt={`Cover Image for ${title}`}
//         width={150}
//         height={150}
//         style= {{ objectFit: 'cover'}}
//       />
//     </ImageWrapper>
//   )
//   return (
//     <Box>
//       {slug ? (
//         <Link href={`/poetry/${slug}`} aria-label={title}>
//           {image}
//         </Link>
//       ) : (
//         image
//       )}
//     </Box>
//   )
// };

// export default PoetryThumbnailImage