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
  footer: {
    text: 'Accelerator Docs',
  },
  useNextSeoProps: () => ({
    titleTemplate: '%s – Accelerator docs',
  }),
}

export default config
