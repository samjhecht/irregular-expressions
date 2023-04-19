import { ImageProps } from 'next/image';
import styled from 'styled-components';
import { Box } from '@mui/material';
import Image from 'next/image';

type MdxImageProps = {
    width: number;
    height: number;
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

// const Image = styled.img`
//   max-width: 100%;
// `;

function BlogImage({
    width,
    height,
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
                    <Image src={src} alt={alt} height={height} width={width}/>
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
                <Image src={src} alt={alt} height={height} width={width}/>
            </Box>
        </ImageWrapper>
    );
}

export default BlogImage;




// import { ImageProps } from 'next/image';
// import { Box } from '@mui/material';
// import styled from 'styled-components';

// const StyledImageFigcaption = styled.figcaption`
// z-index: 10;
// margin-top: 0.5rem;
// font-size: 0.75rem;
// font-style: italic;
// color: #6b7280;
// align-items: center;
// align-content: center;
// justify-content: center;
// `;

// // const BlogImage = ({ title, src, caption, w }: Props) => {
// const BlogImage = (props: ImageProps) => {

//     return (
//         <Box 
//             component="figure" 
//             display="flex"
//             sx={{
//                 flexDirection: "column",
//                 alignContent: "center",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 }}
//                 >
//             <img
//                 src={props.src}
//                 alt={`Cover Image for ${props.title}`}
//                 width={props.width}
//                 height={props.height}
//                 style={{ objectFit: 'cover'}}
//             />
//             <StyledImageFigcaption>{props.alt}</StyledImageFigcaption>
//         </Box>
//     )
// };

// export default BlogImage
