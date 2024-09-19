/* eslint-env node */
import { Head, Layout } from 'nextra-theme-docs'

export const { viewport } = Head

export const metadata = {
  metadataBase: new URL('https://nextra.site'),
  title: {
    template: '%s - Nextra',
  },
  description: 'Nextra: the Next.js site builder',
  applicationName: 'Nextra',
  generator: 'Next.js',
  appleWebApp: {
    title: 'Nextra',
  },
  other: {
    'msapplication-TileImage': '/ms-icon-144x144.png',
    'msapplication-TileColor': '#fff',
  },
  twitter: {
    site: 'https://nextra.site',
  },
}

export default async function RootLayout({ children }) {
  const { pageMap } = await import('../.next/static/chunks/nextra-page-map-.mjs')

  return (
    <html lang="en" dir="ltr">
      <Head faviconGlyph="✦" />
      <body>
        <Layout
          editLink={{ content: 'Edit this page on GitHub' }}
          docsRepositoryBase="https://github.com/shuding/nextra/blob/core/examples/docs"
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          pageMap={pageMap}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
