import fetch from 'isomorphic-unfetch'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }

  try {
    const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID
    const API_KEY = process.env.MAILCHIMP_API_KEY
    const DATACENTER = process.env.MAILCHIMP_API_SERVER

    if (!AUDIENCE_ID || !API_KEY || !DATACENTER) {
      return res.status(500).json({ error: 'Server configuration error' })
    }
    const data = {
      email_address: email,
      status: 'subscribed',
    }

    const response = await fetch(
      `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`,
      {
        body: JSON.stringify(data),
        headers: {
          Authorization: `apikey ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
      }
    )

    if (response.status >= 400) {
      return res.status(400).json({
        error: `There was an error subscribing.
        Hit me up julius@irregular-expressions.com and I'll add you the old fashioned way.`,
      })
    }

    return res.status(201).json({ error: '' })
  } catch (error: unknown) {
    return res
      .status(500)
      .json({
        error: error instanceof Error ? error.message : error?.toString(),
      })
  }
}

export default handler
