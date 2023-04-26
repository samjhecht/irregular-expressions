
import { chakra } from '@chakra-ui/react';
import React from 'react';
import { useMDXComponent } from 'next-contentlayer/hooks';
import { Box, Text } from '@chakra-ui/react';
import Link from 'next/link';
import MdxImage from './MdxImage/MdxImage';
import MdxCodeBlock from './MdxCodeBlock';

const ChakraLink = React.forwardRef<HTMLAnchorElement, React.ComponentPropsWithoutRef<'a'>>(function ChakraLink(props, ref) {
    return (
        <chakra.a
            ref={ref}
            // 
            fontWeight="semibold"
            textDecor="underline"
            textUnderlineOffset="6px"
            textDecorationColor="brown.700"
            _hover={{ bg: 'gray.700' }}
            {...props}
        />
    );
});

const CustomLink = (props) => {
    const { href } = props;
    const isInternalLink = href && (href.startsWith('/') || href.startsWith('#'));
    if (isInternalLink) {
        return <ChakraLink as={Link} href={href} {...props} />;
    }
    return <ChakraLink target="_blank" rel="noopener noreferrer" {...props} />;
};

type MdxComponentProps = React.ComponentPropsWithRef<React.ElementType>;

const MDXComponents: Record<string, React.FC<React.ComponentPropsWithRef<MdxComponentProps>>> = {
    Box,
    Text,
    MdxImage,
    MdxCodeBlock,
    a: CustomLink,
    ul(props) {
        return <chakra.ul paddingStart="6" marginY="3" {...props} />;
    },
    ol(props) {
        return <chakra.ol paddingStart="4" marginY="5" {...props} />;
    },
    li(props) {
        return <chakra.li marginY="1"  {...props} />;
    },
    h2(props) {
        return (
            <chakra.h2
                lineHeight="1.5em"
                fontSize="2xl"
                fontFamily="heading"
                fontWeight="bold"
                marginTop="4"
                marginBottom="4"
                {...props}
            />
        );
    },
    h3(props) {
        return (
            <chakra.h3
                lineHeight="1.5em"
                fontSize="xl"
                fontFamily="heading"
                fontWeight="bold"
                marginTop="4"
                marginBottom="4"
                {...props}
            />
        );
    },
    blockquote(props) {
        return (
            <chakra.blockquote
                paddingX="6"
                {...props}
            />
        );
    },
    hr(props) {
        return <chakra.hr borderColor="whiteAlpha.100" marginY="3em" {...props} />;
    },
    p: (props) => <chakra.p marginY="5" {...props} />,
    code(props) {
        if (typeof props.children === 'string') {
          return (
            <chakra.code color="black" rounded="md" px={1} fontFamily="Vulf Sans Italic">
              {props.children}
            </chakra.code>
          );
        }
        return <code {...props} />;
      },
    strong(props) {
        return <chakra.strong fontWeight="semibold"  {...props} />;
    },
    table(props) {
        return (
            <chakra.table
                marginY="10"
                width="full"
                sx={{
                    borderCollapse: 'collapse',
                    thead: {
                        borderBottomWidth: '1px',
                        borderBottomColor: 'gray.700',
                        th: {
                            textAlign: 'start',
                            padding: '2',
                            verticalAlign: 'bottom',
                            color: 'gray.200',
                        },
                    },
                    tbody: {
                        tr: {
                            borderBottomWidth: '1px',
                            borderBottomColor: 'gray.800',
                        },
                        td: {
                            padding: '2',
                        },
                    },
                }}
                {...props}
            />
        );
    },
};

interface MdxProps {
    code: string;
}

export default function Mdx({ code }: MdxProps) {
    const Component = useMDXComponent(code);

    return (
        <article>
            <Component components={{ ...MDXComponents }} />
        </article>
    );
}