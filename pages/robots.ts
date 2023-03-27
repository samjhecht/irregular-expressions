export default function robots() {
    return {
      rules: [
        {
          userAgent: '*',
        },
      ],
      sitemap: 'https://irregular-expressions.com/sitemap.xml',
      host: 'https://irregular-expressions.com',
    };
  }