import type { NextConfig } from 'next'
import nextra, { type NextraConfig } from 'nextra'

const nextConfig: NextConfig = {
  trailingSlash: true,
}

const nextraConfig: NextraConfig = {}

export default nextra(nextraConfig)(nextConfig)
