import Image from 'next/image'
import type { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: (
    <div style={{ display: 'flex', gap: 8 }}>
      <Image alt="NoA Ignite" height={16} src="/icon.svg" width={16} />
      <span>Accelerator Docs</span>
    </div>
  ),
  project: {
    link: 'https://github.com/noaignite/accelerator',
  },
  docsRepositoryBase: 'https://github.com/noaignite/accelerator',
  editLink: {
    component: null,
  },
  head: () => (
    <>
      <title>Accelerator Docs</title>
      <meta content="Accelerator Docs" property="og:title" />
      <meta content="The Accelerator official docs" property="og:description" />
      <meta content="width=device-width, initial-scale=1.0" name="viewport" />
    </>
  ),
  footer: {
    content: 'Accelerator Docs',
  },
}

export default config
