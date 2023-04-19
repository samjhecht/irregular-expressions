import * as React from 'react';
import { useState } from 'react';
import { Button, Box, TextField, Typography } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';


const SubscribeBox: React.FC = () => {
    const [open, setOpen] = React.useState(false);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [hasError, setError] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async (evt: React.FormEvent) => {
        evt.preventDefault();

        if (!email) {
            setError(true);
            setMessage('Email address is required.');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError(true);
            setMessage('Please enter a valid email address');
            return;
        }

        // Send a request to my API with the user's email address.
        const res = await fetch('/api/subscribe', {
            body: JSON.stringify({
                email: email,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        });

        const { error } = await res.json();

        if (error) {
            // If there was an error, update the message in state.
            setError(true);
            setMessage(error);

            return;
        }

        // 5. Clear the input value and show a success message.
        setEmail('');
        setError(false)
        setMessage('Success! 🎉 You are now subscribed!');
        setTimeout(() => {
            setOpen(false);
        }, 1200);
    };

    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(evt.target.value);
    };

    return (
        <>
            <Box
                sx={{
                    marginTop: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Subscribe
                    </Typography>
                    <TextField
                        required
                        fullWidth
                        margin="dense"
                        id="email"
                        label="Your email..."
                        name="email"
                        onChange={handleChange}
                        autoComplete="email"
                        value={email}
                        sx={{
                            '&:focus': {
                                borderColor: 'blue.500',
                                boxShadow: '0 0 0 0.25rem #92CBDC',
                            },
                        }}
                    />
                    {message && (
                        <Typography color={hasError ? "error" : "success"} variant="subtitle2" gutterBottom>
                            {message}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </Button>
                </Box>
            </Box>
        </>
    );
};

export default SubscribeBox;
