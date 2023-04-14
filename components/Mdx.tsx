
import Image from 'next/image';
import { useMDXComponent } from 'next-contentlayer/hooks';
import styled from 'styled-components';
import { Box, Typography } from '@mui/material';
import Highlight from 'react-highlight';

type MdxImageProps = {
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

const StyledImage = styled.img`
  max-width: 100%;
  height: auto;
`;

function MdxImage({
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
            component="figure" 
            display="flex"
            textAlign={alignment}
            flexDirection="column"
            alignContent={alignment}
            justifyContent={alignment}
            alignItems={alignment}
            >
            <StyledImage src={src} alt={alt} />
            <StyledImageFigcaption>{figcaption}</StyledImageFigcaption>
        </Box>
        </ImageWrapper>
    );
  }

  return (
    <ImageWrapper>
        <Box 
            component="figure" 
            display="flex"
            textAlign={alignment}
            flexDirection="column"
            alignContent={alignment}
            justifyContent={alignment}
            alignItems={alignment}
        >
            <StyledImage src={src} alt={alt} />
        </Box>
    </ImageWrapper>
  );
}

const CodeBlockWrapper = styled(Box)`
  margin-top: 1rem;
`;

const CodeBlockTitle = styled(Typography)`
  background-color: #f8f8f8;
  padding: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  margin-bottom: 0;
`;

const CodeBlockContainer = styled(Box)`
  overflow-x: auto;
  border: 1px solid #e4e4e4;
  border-radius: 4px;
`;

type MdxCodeBlockProps = {
  children: string;
  language?: string;
  title?: string;
};

const MdxCodeBlock = ({ children, language = 'text', title }: MdxCodeBlockProps) => (
  <CodeBlockWrapper>
    {title && <CodeBlockTitle>{title}</CodeBlockTitle>}
    <CodeBlockContainer>
      <Highlight className={`language-${language}`}>{children}</Highlight>
    </CodeBlockContainer>
  </CodeBlockWrapper>
);


function RoundedImage({props}: any) {
  return <Image alt={props.alt} className="rounded-lg" {...props} />;
}

const components = {
    RoundedImage: RoundedImage,
    MdxImage,
    MdxCodeBlock
  };
  
  interface MdxProps {
    code: string;
    tweets: Record<string, any>;
  }
  
  export function Mdx({ code }: MdxProps) {
    const Component = useMDXComponent(code);
  
    return (
      <article>
        <Component components={{ ...components }} />
      </article>
    );
  }