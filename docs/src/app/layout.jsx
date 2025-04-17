import Image from 'next/image'
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import 'nextra-theme-docs/style.css'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'

export const metadata = {
  metadataBase: new URL('https://noaignite.dev'),
  title: {
    template: '%s - Accelerator Docs',
  },
  description: 'The NoA Ignite Accelerator official docs',
  applicationName: 'Accelerator Docs',
  generator: 'Next.js',
  appleWebApp: {
    title: 'Accelerator Docs',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default async function RootLayout({ children }) {
  const navbar = (
    <Navbar
      logo={
        <div style={{ display: 'flex', gap: 8 }}>
          <Image alt="NoA Ignite" height={16} src="/icon.svg" width={16} />
          <span>Accelerator Docs</span>
        </div>
      }
      projectLink="https://github.com/noaignite/accelerator"
    />
  )
  const pageMap = await getPageMap()

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head faviconGlyph="✦" />
      <body>
        <Layout
          navbar={navbar}
          footer={<Footer>MIT {new Date().getFullYear()} © Accelerator Docs.</Footer>}
          editLink={null}
          docsRepositoryBase="https://github.com/noaignite/accelerator"
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          pageMap={pageMap}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
