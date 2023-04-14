import styled from 'styled-components';
import { Box, Typography } from '@mui/material';
import Highlight from 'react-highlight';

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

export default MdxCodeBlock;
