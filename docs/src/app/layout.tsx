import type { Metadata, Viewport } from 'next'
import Image from 'next/image'
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import 'nextra-theme-docs/style.css'
import { getPageMap } from 'nextra/page-map'
import type { ReactNode } from 'react'
import packageJson from '../../package.json'

const SITE_NAME = 'NoA Accelerator'
const REPO_URL = packageJson.repository.url.replace(/\.git$/, '')

export const metadata: Metadata = {
  description: packageJson.description,
  generator: 'Next.js',
  icons: {
    icon: '/accelerator-logo.png',
  },
  metadataBase: new URL(packageJson.homepage),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
}

export const viewport: Viewport = {
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
          <Image
            alt={packageJson.author}
            height={24}
            src="/accelerator-logo.png"
            width={24}
            style={{ width: 24, height: 24 }}
          />
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
