import { ImageProps } from 'next/image';
import { Box } from '@mui/material';
import Image from 'next/image';
import Link from '../components/link';
import styled from 'styled-components';

const StyledImageFigcaption = styled.figcaption`
z-index: 10;
margin-top: 0.5rem;
font-size: 0.75rem;
font-style: italic;
color: #6b7280;
align-items: center;
align-content: center;
justify-content: center;
`;

// const BlogImage = ({ title, src, caption, w }: Props) => {
const BlogImage = (props: ImageProps) => {

    return (
        <Box 
            component="figure" 
            sx={{
                display: "flex",
                flexDirection: "column",
                alignContent: "center",
                justifyContent: "center",
                alignItems: "center",
                }}
                >
            <Image
                src={props.src}
                alt={`Cover Image for ${props.title}`}
                width={props.width}
                height={props.height}
                style={{ objectFit: 'cover'}}
            />
            <StyledImageFigcaption>{props.alt}</StyledImageFigcaption>
        </Box>
    )
};

export default BlogImage
