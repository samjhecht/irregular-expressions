import { useRouter } from "next/router";
import Link from "./link"
import { Typography, Stack } from "@mui/material";

const Header: React.FC = () => {
    const router = useRouter();
    const pathname = router.pathname;
    const pathnameArray = pathname.split("/");
    const page = pathnameArray[1];

    return (
        <>
            <Stack
                direction="column"
                spacing={2}
                sx={{
                    mb: 8,
                    display: "flex",
                    alignContent: "center",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: "bold",
                        fontStyle: "normal",
                        whiteSpace: "nowrap",
                    }}
                >
                    <Link
                        href="/"
                        style={{
                            color: "black",
                            textDecoration: "none",
                        }}
                    >
                        Irregular Expressions
                    </Link>
                </Typography>
                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                >
                    <Typography
                        fontWeight={page === "poetry" ? "bold" : "normal"}
                        fontStyle={page === "poetry" ? "italic" : "normal"}
                        sx={{
                            fontSize: "1.5rem",
                        }}
                    >
                        <Link
                            href="/poetry"
                            style={{
                                color: "black",
                                textDecoration: "none",
                            }}
                        >
                            Poetry
                        </Link>
                    </Typography>
                    <Typography
                        fontWeight={page === "blog" ? "bold" : "normal"}
                        fontStyle={page === "blog" ? "italic" : "normal"}
                        sx={{
                            fontSize: "1.5rem",
                        }}
                    >
                        <Link
                            href="/blog"
                            style={{
                                color: "black",
                                textDecoration: "none",
                            }}
                        >
                            Blog
                        </Link>
                    </Typography>
                    <Typography
                        fontWeight={page === "about" ? "bold" : "normal"}
                        fontStyle={page === "about" ? "italic" : "normal"}
                        sx={{
                            fontSize: "1.5rem",
                        }}
                    >
                        <Link
                            href="/about"
                            style={{
                                color: "black",
                                textDecoration: "none",
                            }}
                        >
                            About
                        </Link>
                    </Typography>
                </Stack>
            </Stack>
        </>
    );
};

export default Header;