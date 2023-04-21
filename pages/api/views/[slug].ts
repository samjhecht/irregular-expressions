import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/renderDb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const slug = req.query?.slug as string;
    if (!slug) {
      return res.status(400).json({ message: 'Slug is required.' });
    }

    const db = await connectToDatabase();
    const { rows } = await db.query('SELECT views FROM page_views WHERE slug = $1', [slug]);

    console.log('Data [slug]:', rows); // Log the rows in the API route

    const views = !rows.length ? 0 : Number(rows[0].views);

    if (req.method === 'POST') {
      if (rows.length === 0) {
        await db.query('INSERT INTO page_views (slug, views) VALUES ($1, 1)', [slug]);
      } else {
        await db.query('UPDATE page_views SET views = $1 WHERE slug = $2', [views + 1, slug]);
      }

      return res.status(200).json({
        total: views + 1,
      });
    }

    if (req.method === 'GET') {
      return res.status(200).json({ total: views });
    }
  } catch (e) {
    console.error(e as Error);
    return res.status(500).json({ message: (e as Error).message });
  }
}