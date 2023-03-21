import * as React from 'react';
import { Typography, Box, Container } from '@mui/material';
import Layout from "../components/layout";
import { useEffect } from 'react';
import styles from '../src/custom-styles/poetryfall.module.css';


export default function PoetryWaterfall() {

    useEffect(() => {
        const textContainer = document.getElementById(
            "text-container"
        ) as HTMLDivElement;
        const textAnimation = textContainer.animate(
            [
                { transform: "translateY(0)" },
                { transform: "translateY(100%)" },
            ],
            {
                duration: 20000,
                fill: "forwards",
            }
        );

        textAnimation.onfinish = () => {
            textContainer.remove();
        };
    }, []);

    return (
        <Layout>
            <div className={styles.container}>
                <div id="text-container" className={styles.poetry}>
                    <p>
                        At my window
                        <br />
                        Watching the sun go
                        <br />
                        Hoping the stars know
                        <br />
                        It's time to shine...
                        <br />
                        <br />
                    </p>
                    <Typography
                        gutterBottom
                        sx={{
                            textAlign: 'center',
                            fontStyle: 'italic',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - Townes Van Zandt
                    </Typography>
                </div>
            </div>
        </Layout>
    );
};
