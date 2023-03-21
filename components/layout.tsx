import Header from "./header";
import StickyFooter from "./stickyfooter";
import { ReactNode } from "react";
import { Typography, Box, Stack, Container } from '@mui/material';

type Props = {
    children: React.ReactNode
  }

const Layout = ({ children }: Props) => {
  return (
    <>
    <Container 
        maxWidth="lg"
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          margin: "0 auto",
          padding: "2.5rem 1.25rem",
          maxWidth: "42rem",
          alignContent: "center",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Header />
        <main>{children}</main>
        <StickyFooter />
      </Container>
    </>
  );
};

export default Layout;