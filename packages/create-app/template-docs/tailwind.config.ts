import sharedConfig from '@repo/tailwind-config/preset'
import type { Config } from 'tailwindcss'

const config: Pick<Config, 'presets'> = {
  presets: [sharedConfig],
}

export default config
