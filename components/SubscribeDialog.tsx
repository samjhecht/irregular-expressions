import * as React from 'react';
import { useState } from 'react';
import { Button, Box, TextField, Typography } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';


const SubscribeDialog: React.FC = () => {
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
        setMessage('Success! 🎉 You are now subscribed to the newsletter.');
        setTimeout(() => {
            setOpen(false);
        }, 1200);
    };

    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(evt.target.value);
    };

    return (
        <>
            <Button variant="outlined" size="small" onClick={handleClickOpen}>
                Like this post? Click here to subscribe to future Irregular Expressions!
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Subscribe</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To subscribe to receive new irregular expressions, please enter your email address here.
                    </DialogContentText>
                    <TextField
                        required
                        fullWidth
                        margin="dense"
                        id="email"
                        label="Email Address"
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Subscribe</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default SubscribeDialog;
