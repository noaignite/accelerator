/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom', // Ensure jsdom is set as the environment
    setupFiles: ['./vitest.setup.ts'],
  },
})
