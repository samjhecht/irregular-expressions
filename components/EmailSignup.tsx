// import * as React from 'react';
// import { useState } from 'react';
// import addToMailchimp from 'gatsby-plugin-mailchimp';
// import {
//   Button,
//   Box,
//   Checkbox,
//   FormControlLabel,
//   Grid,
//   TextField,
//   Typography
// } from '@mui/material/';
// import Link from './link';

// const EmailSignup = (): JSX.Element => {
//   const [GDPRConfirmation, setGDPRConfirmation] = useState<boolean>(false);
//   const [email, setEmail] = useState<string>('');
//   const [message, setMessage] = useState<string>('');
//   const [hasError, setError] = useState<boolean>(false);

//   const handleSubmit = (evt: React.FormEvent<HTMLFormElement>): void => {
//     evt.preventDefault();
//     if (!GDPRConfirmation) {
//       if (email) {
//         setError(true);
//         setMessage('Please tick the checkbox below to proceed.');
//         return;
//       } else {
//         setError(true);
//         setMessage('Type in your email address');
//         return;
//       }
//     }
//     addToMailchimp(email, {})
//       .then(({ msg, result }) => {
//         if (result !== 'success') {
//           throw msg;
//         } else {
//           setError(false);
//           setMessage(msg);
//         }
//       })
//       .catch((err) => {
//         setError(true);
//         setMessage(err);
//       });
//   };

//   const handleChange = (evt: React.ChangeEvent<HTMLInputElement>): void => {
//     setEmail(evt.target.value);
//   };

//   const handleOptIn = (evt: React.ChangeEvent<HTMLInputElement>): void => {
//     setGDPRConfirmation(evt.target.checked);
//   };

//   return (
//     <>
//       <Box
//         sx={{
//           marginTop: 1,
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center'
//         }}
//       >
//         <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <TextField
//                 required
//                 fullWidth
//                 id="email"
//                 label="Email Address"
//                 name="email"
//                 onChange={handleChange}
//                 autoComplete="email"
//                 // _focus={{
//                 //   borderColor: 'blue.500',
//                 //   boxShadow: '0 0 0 0.25rem #92CBDC'
//                 // }}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <FormControlLabel
//                 name="gdpr-confirmation"
//                 control={
//                   <Checkbox
//                     value="allowExtraEmails"
//                     onChange={handleOptIn}
//                     required
//                     color="primary"
//                   />
//                 }
//                 label="Check this box to appease the GDPR gods by confirming that you are happy to receive emails from Irregular-Expressions.com."
//               />
//             </Grid>
//           </Grid>
//           <Button
//             type="submit"
//             fullWidth
//             variant="contained"
//             sx={{ mt: 3, mb: 2 }}
//           >
//             Sign Up
//           </Button>
//           {/* {message && (
//             <Box
//               width="100%"
//               p="0.75rem"
//               mt="0.75rem"
//               display={message ? 'block' : 'none'}
//               backgroundColor={hasError ? '#ffd4d9' : '#d2ffe4'}
//               color={hasError ? '#7b000c' : '#007b31'}
//               borderRadius="md"
//               lineHeight="dense"
//               dangerouslySetInnerHTML={{ __html: message }}
//             />
//           )} */}
//         </Box>
//       </Box>
//     </>
//   );
// };

// export default EmailSignup;
