
import { useEffect } from 'react';
import useSWR from 'swr';
import { Box, Typography } from '@mui/material';

type PostView = {
    slug: string;
    views: string;
};

async function fetcher<T = unknown>(
    input: RequestInfo,
    init?: RequestInit,
  ): Promise<T> {
    const res = await fetch(input, init)
    const data = await res.json()
  
    if (!res.ok) {
      throw new Error(data.message || 'Something went wrong')
    }
  
    return data
}

export default function ViewCounter({
    slug,
    trackView,
}: {
    slug: string;
    trackView: boolean;
}) {
    const { data } = useSWR<PostView[]>('/api/views', fetcher);
    const viewsForSlug = data && data.find((view: PostView) => view.slug === slug);
    const views = new Number(viewsForSlug?.views || 0);

    // console.log('Data:', data);

    useEffect(() => {
        const registerView = () =>
            fetch(`/api/views/${slug}`, {
                method: 'POST',
            });

        if (trackView) {
            registerView();
        }
    }, [slug, trackView]);

    return (
        <Box display="flex" alignItems="center" sx={{
            paddingBottom: "1rem",
            paddingTop: "0.5rem"
        }}>
            <svg
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                className="mr-1"
                style={{marginTop: "0.18rem"}}
            >
                <g fill="#000">
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M16 7.6C16 9.2 11.0928 13.2 8 13.2C4.90721 13.2 0 8.8 0 7.6C0 6 4.90721 2 8 2C11.0928 2 16 6 16 7.6ZM11.2 7.6C11.2 9.36731 9.76731 10.8 8 10.8C6.23269 10.8 4.8 9.36731 4.8 7.6C4.8 5.83269 6.23269 4.4 8 4.4C9.76731 4.4 11.2 5.83269 11.2 7.6ZM8 9.2C8.88366 9.2 9.6 8.48366 9.6 7.6C9.6 6.71634 8.88366 6 8 6C7.11634 6 6.4 6.71634 6.4 7.6C6.4 8.48366 7.11634 9.2 8 9.2Z"
                        fill="#000"
                    ></path>
                </g>
            </svg>
            <Typography variant="subtitle1" sx={{
                fontStyle: 'italic',
                marginLeft: "0.4rem",
            }}>
                {data ? `${views.toLocaleString()} views` : ''}
            </Typography>
        </Box>
    );
}
