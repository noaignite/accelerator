import Image from 'next/image'
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import 'nextra-theme-docs/style.css'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import type { ReactNode } from 'react'
import packageJson from '../../package.json'

const SITE_NAME = 'Accelerator Docs'
const REPO_URL = packageJson.repository.url.replace(/\.git$/, '')

export const metadata = {
  metadataBase: new URL(packageJson.homepage),
  title: {
    template: `%s - ${SITE_NAME}`,
  },
  description: packageJson.description,
  applicationName: SITE_NAME,
  generator: 'Next.js',
  appleWebApp: {
    title: SITE_NAME,
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const navbar = (
    <Navbar
      logo={
        <div style={{ display: 'flex', gap: 12 }}>
          <Image alt={packageJson.author} height={16} src="/icon.svg" width={16} />
          <span>{SITE_NAME}</span>
          <span style={{ opacity: 0.7, fontSize: 14, alignSelf: 'end' }}>
            {`v${packageJson.version}`}
          </span>
        </div>
      }
      projectLink={REPO_URL}
    />
  )
  const pageMap = await getPageMap()

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head faviconGlyph="✦" />
      <body>
        <Layout
          navbar={navbar}
          footer={<Footer>{`MIT ${new Date().getFullYear()} © ${SITE_NAME}.`}</Footer>}
          editLink={null}
          docsRepositoryBase={REPO_URL}
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          pageMap={pageMap}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
