import * as React from 'react';
import { Box } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

export default function CssWave(): JSX.Element {

    const moveForever = keyframes`
    0% {
        transform: translate3d(-90px,0,0);
    }
    100% { 
        transform: translate3d(85px,0,0);
    }
    `;

    const ParallaxUse = styled('use')`
        animation: ${moveForever} 25s cubic-bezier(.55,.5,.45,.5) infinite;
    `;

    const ParallaxUse1 = styled(ParallaxUse)`
        animation-delay: -2s;
        animation-duration: 7s;
    `;

    const ParallaxUse2 = styled(ParallaxUse)`
        animation-delay: -3s;
        animation-duration: 10s;
    `;

    const ParallaxUse3 = styled(ParallaxUse)`
        animation-delay: -4s;
        animation-duration: 13s;
    `;

    const ParallaxUse4 = styled(ParallaxUse)`
        animation-delay: -5s;
        animation-duration: 20s;
    `;

    const Wave = styled('svg')`
        position:relative;
        width: 100%;
        height:15vh;
        margin-bottom:-7px; /*Fix for safari gap*/
        min-height:100px;
        max-height:150px;
    `;

    return (
        <>
            <Box>
                <Wave
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 24 150 28"
                    preserveAspectRatio="none"
                    shapeRendering="auto"
                >
                    <defs>
                        <path id="gentle-wave" d={"M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"} />
                    </defs>
                    <g>
                        <ParallaxUse1 xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(39, 178, 245, 0.8)" />
                        <ParallaxUse2 xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(0, 129, 209, 0.8)" />
                        <ParallaxUse3 xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(0, 72, 209, 0.8)" />
                        <ParallaxUse4 xlinkHref="#gentle-wave" x="48" y="7" fill="rgba(0, 24, 209, 0.8)" />
                    </g>
                </Wave>
            </Box>
        </>
    );
};