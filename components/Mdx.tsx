
import Image from 'next/image';
import { useMDXComponent } from 'next-contentlayer/hooks';
import { Box, Typography } from '@mui/material';
import MdxImage from 'components/MdxImage/MdxImage';
import MdxCodeBlock from 'components/MdxCodeBlock';


function RoundedImage({props}: any) {
  return <Image alt={props.alt} sx={{borderRadius: "0.5rem"}} {...props} />;
}

const components = {
    Box,
    Typography,
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