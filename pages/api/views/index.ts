import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../lib/renderDb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
      return
    }

    const db = await connectToDatabase()
    const { rows } = await db.query('SELECT slug, views FROM page_views')

    // console.log('Data index:', rows);

    return res.status(200).json(rows)
  } catch (e) {
    console.error(e as Error)
    return res.status(500).json({ message: (e as Error).message })
  }
}
