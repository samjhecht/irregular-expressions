import { Box, Typography, Container } from "@mui/material";

const StickyFooter: React.FC = () => {
  return (
    <>
      <Box
        sx={{
          py: 3,
          px: 2,
          mt: "auto",
        }}
      >
        <Container maxWidth="sm">
          <Typography
            color="text.primary"
            sx={{ fontSize: "0.92rem", whiteSpace: "nowrap" }}
          >
            {` `}
            Copyright © {new Date().getFullYear()}, Julius Hecht.
          </Typography>
        </Container>
      </Box>
    </>
  );
};

export default StickyFooter;
