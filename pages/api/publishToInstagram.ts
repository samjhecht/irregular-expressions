// pages/api/publishToInstagram.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import FormData from 'form-data';

const instaAccessToken = process.env.INSTAGRAM_ACCESS_TOKEN!;

// Function to post an image to Instagram
async function postImageToInstagram(accessToken: string, imageUrl: string, description: string) {
    try {
        // Step 1: Get the Facebook Container ID
        const containerRes = await axios.get(`https://graph.facebook.com/v13.0/me?fields=instagram_business_account&access_token=${accessToken}`);
        const containerId = containerRes.data.instagram_business_account.id;
    
        // Step 2: Upload the image to Facebook
        const formData = new FormData();
        formData.append('url', imageUrl);
        formData.append('caption', description);
    
        const uploadRes = await axios.post(`https://graph.facebook.com/v13.0/${containerId}/media`, formData, {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${(formData as any)._boundary}`,
              },
            params: {
                access_token: accessToken,
            },
        });
    
        const mediaId = uploadRes.data.id;
    
        // Step 3: Publish the image on Instagram
        const publishRes = await axios.post(`https://graph.facebook.com/v13.0/${containerId}/media_publish`, {
          media_id: mediaId,
        }, {
          params: {
            access_token: accessToken,
          },
        });
    
        console.log('Instagram post created:', publishRes.data);
      } catch (error) {
        console.error('Error creating Instagram post:', error);
      }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { imageUrl, description } = req.body;

  // Check if the request method is POST
  if (req.method === 'POST') {
    try {
      await postImageToInstagram(instaAccessToken, imageUrl, description);
      res.status(200).json({ message: 'Instagram post created successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error creating Instagram post', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}



// Frontend Code
// const response = await fetch('/api/publishToInstagram', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       imageUrl: 'your_cover_image_url',
//       description: 'your_description',
//     }),
//   });
  
//   if (response.ok) {
//     console.log('Instagram post created successfully');
//   } else {
//     console.error('Error creating Instagram post');
//   }



// scripts/publishToInstagram.js
// const fs = require('fs');
// const path = require('path');
// const matter = require('gray-matter'); // You might need to install this package: npm install gray-matter
// const axios = require('axios');
// const FormData = require('form-data');

// // Function to post an image to Instagram
// async function postImageToInstagram(accessToken, imageUrl, description) {
//   // ...
// }

// // Function to get the latest post's cover image URL and description
// function getLatestPostInfo() {
//   const postsDirectory = path.join(process.cwd(), 'posts');
//   const fileNames = fs.readdirSync(postsDirectory);
//   const latestPostFile = fileNames[fileNames.length - 1];
//   const fullPath = path.join(postsDirectory, latestPostFile);
//   const fileContents = fs.readFileSync(fullPath, 'utf8');
//   const { data } = matter(fileContents);

//   return {
//     imageUrl: data.coverImage,
//     description: data.description,
//   };
// }

// (async () => {
//   const { imageUrl, description } = getLatestPostInfo();
//   const accessToken = process.env.ACCESS_TOKEN; // Replace with your actual access token or use another method to load it securely

//   if (imageUrl && description) {
//     await postImageToInstagram(accessToken, imageUrl, description);
//     console.log('Instagram post created successfully');
//   } else {
//     console.error('Error: Unable to extract cover image URL or description from the latest post');
//   }
// })();
