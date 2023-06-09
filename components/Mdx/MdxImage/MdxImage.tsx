
import styled from 'styled-components';
import { Box } from '@chakra-ui/react';

type MdxImageProps = {
  width: number;
  src: string;
  alt: string;
  figcaption?: string;
  position?: 'left' | 'right' | 'center';
};

const StyledImageFigcaption = styled('figcaption')`
z-index: 10;
margin-top: 0.5rem;
font-size: 0.75rem;
font-style: italic;
color: #6b7280;
align-items: center;
align-content: center;
justify-content: center;
`;

const ImageWrapper = styled(Box)`
  max-width: 100%;
  display: block;
`;

const Image = styled.img`
  max-width: 100%;
  height: auto;
`;

function MdxImage({
  width,
  src,
  alt,
  figcaption,
  position
}: MdxImageProps): JSX.Element {
  const alignment = position ? position : 'center';

  if (figcaption) {
    return (
      <ImageWrapper>
        <Box
          as="figure"
          display="flex"
          textAlign={alignment}
          flexDirection="column"
          alignContent={alignment}
          justifyContent={alignment}
          alignItems={alignment}
        >
          <Image src={src} alt={alt} width={width} />
          <StyledImageFigcaption>{figcaption}</StyledImageFigcaption>
        </Box>
      </ImageWrapper>
    );
  }

  return (
    <ImageWrapper>
      <Box
        as="figure"
        display="flex"
        textAlign={alignment}
        flexDirection="column"
        alignContent={alignment}
        justifyContent={alignment}
        alignItems={alignment}
      >
        <Image src={src} alt={alt} width={width} />
      </Box>
    </ImageWrapper>
  );
}

export default MdxImage;

