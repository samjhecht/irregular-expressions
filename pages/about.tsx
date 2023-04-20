import Link from '../components/link';
import { Typography, Box, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import Layout from '../components/layout';
import SubscribeBox from '../components/SubscribeBox';

export default function About() {

  return (
    <Layout>
      <Typography
        sx={{
          fontSize: "1.6rem",
          fontWeight: "bold",
          paddingBottom: "1rem",
        }}
      >
        About
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={7}>
          <Stack direction="column" spacing={4}>
            <Typography variant="body1">
              Welcome to Irregular-Expressions.com!&nbsp;&nbsp; I&apos;m <strong>Julius Hecht</strong>.&nbsp;&nbsp;
              My website is a necessary extravagance.&nbsp;&nbsp;I made it so I can publish my poetry and other stuff I feel like creating.&nbsp;&nbsp;
              Now, please excuse me while I express myself.
              {` `}
            </Typography>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={6}
            >
              <Link href="https://github.com/samjhecht">
                <Box
                  component="img"
                  sx={{
                    width: "40px",
                    height: "40px",
                  }}
                  src="/static/images/github_icon_128.png"
                  alt="Github logo"
                  loading="eager"
                />
              </Link>
              <Link href="https://instagram.com/juliushecht">
                <Box
                  component="img"
                  sx={{
                    width: 40,
                    height: 40,
                  }}
                  src="/static/images/instagram_logo_128.png"
                  alt="Instagram logo"
                  loading="eager"
                />
              </Link>
              <Link href="https://linkedin.com/in/sam-hecht-4ab65713/">
                <Box
                  component="img"
                  sx={{
                    width: 40,
                    height: 40,
                  }}
                  src="/static/images/linkedin_logo_128.png"
                  alt="LinkedIn logo"
                  loading="eager"
                />
              </Link>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={5} md={5} sx={{ display: "flex", alignContent: "center", justifyContent: "center", alignItems: "center" }}>
          <Box
            component="img"
            src="/static/images/with_david_800_915.jpg"
            sx={{
              minWidth: "200px",
              maxWidth: "100%",
              maxHeight: "400px",
              borderRadius: "100%"
            }}
            alt="Julius Hecht"
            loading="eager"
          />
        </Grid>
      </Grid>
    </Layout >
  )
}