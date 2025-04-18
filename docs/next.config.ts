import type { NextConfig } from 'next'
import nextra, { type NextraConfig } from 'nextra'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/README',
        permanent: true,
      },
    ]
  },
}

const nextraConfig: NextraConfig = {}

export default nextra(nextraConfig)(nextConfig)
