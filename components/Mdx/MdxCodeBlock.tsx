
import styled from 'styled-components';
import { Box, Text } from '@chakra-ui/react'
import Highlight from 'react-highlight';

const CodeBlockWrapper = styled(Box)`
  margin-top: 1rem;
`;

const CodeBlockTitle = styled(Text)`
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  font-family: monospace;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid #333333;
  border-radius: 0.75rem 0.75rem 0 0;
  color: #b2b2b2;
  background-color: #1c1c1c;
  margin-bottom: 0;
`;

const CodeBlockContainer = styled(Box)`
  overflow-x: auto;
  border: 1px solid #e4e4e4;
  border-radius: 4px;
  max-width: 100%;

  & pre {
    display: grid;
    min-width: 100%;
    word-break: break-word;
    border-radius: 0;
    border: 0;
    background-color: transparent;
    padding: 0;
    font-size: 1rem;
    color: #000000;
    counter-reset: line;
    box-decoration-break: clone;

    @media (max-width: 600px) {
      font-size: 0.875rem;
    }
  }

  & pre .line {
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
  }

  & pre[data-line-numbers] > .line::before {
    counter-increment: line;
    content: counter(line);
    display: inline-block;
    width: 1rem;
    margin-right: 1rem;
    text-align: right;
    color: gray;
  }

  & pre .line--highlighted {
    background-color: #4c4c4c;
    opacity: 0.1;
  }

  & pre .line-highlighted span {
    position: relative;
  }

  & pre .word--highlighted {
    border-radius: 0.375rem;
    background-color: #4c4c4c;
    opacity: 0.1;
    padding: 0.25rem;
  }
`;

// const CodeBlockTitle = styled(Typography)`
//   background-color: #f8f8f8;
//   padding: 0.5rem;
//   font-size: 0.875rem;
//   font-weight: 600;
//   border-top-left-radius: 4px;
//   border-top-right-radius: 4px;
//   margin-bottom: 0;
// `;

// const CodeBlockContainer = styled(Box)`
//   overflow-x: auto;
//   border: 1px solid #e4e4e4;
//   border-radius: 4px;
// `;

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

export default MdxCodeBlock;
