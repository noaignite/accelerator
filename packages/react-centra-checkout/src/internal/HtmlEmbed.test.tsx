import { render, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HtmlEmbed } from './HtmlEmbed'

describe('HtmlEmbed', () => {
  it('renders provided html and forwards div props', () => {
    const screen = render(
      <HtmlEmbed
        className="embed-container"
        data-testid="html-embed"
        html="<span data-testid='inner-content'>Injected content</span>"
        id="embed-id"
      />,
    )

    const embed = screen.getByTestId('html-embed')

    expect(embed.id).toBe('embed-id')
    expect(embed.className).toContain('embed-container')
    expect(embed.querySelector('[data-testid="inner-content"]')?.textContent).toBe(
      'Injected content',
    )
  })

  it('recreates non-json scripts', async () => {
    const screen = render(
      <HtmlEmbed
        data-testid="html-embed"
        html="<script data-original='inline-script'>window.__centraInline = true;</script>"
      />,
    )

    const embed = screen.getByTestId('html-embed')

    await waitFor(() => {
      const scripts = embed.querySelectorAll('script')

      expect(scripts).toHaveLength(1)
      expect(scripts[0]?.getAttribute('data-original')).toBeNull()
      expect(scripts[0]?.textContent).toContain('window.__centraInline = true;')
    })
  })

  it('does not recreate application/json scripts', async () => {
    const screen = render(
      <HtmlEmbed
        data-testid="html-embed"
        html={[
          '<script type=\'application/json\' data-original=\'json-script\'>{"foo":"bar"}</script>',
          "<script data-original='inline-script'>window.__centraInline = true;</script>",
        ].join('')}
      />,
    )

    const embed = screen.getByTestId('html-embed')

    await waitFor(() => {
      expect(
        embed.querySelector('script[type="application/json"][data-original="json-script"]'),
      ).toBeTruthy()
      expect(embed.querySelector('script[data-original="inline-script"]')).toBeNull()

      const executableScript = embed.querySelector('script:not([type="application/json"])')

      expect(executableScript).toBeTruthy()
      expect(executableScript?.textContent).toContain('window.__centraInline = true;')
    })
  })

  it('recreates scripts when html changes', async () => {
    const screen = render(
      <HtmlEmbed data-testid="html-embed" html="<script>window.__centraOld = true;</script>" />,
    )

    const embed = screen.getByTestId('html-embed')

    await waitFor(() => {
      expect(embed.querySelectorAll('script')).toHaveLength(1)
      expect(embed.querySelector('script')?.textContent).toContain('window.__centraOld = true;')
    })

    screen.rerender(
      <HtmlEmbed data-testid="html-embed" html="<script>window.__centraNew = true;</script>" />,
    )

    await waitFor(() => {
      expect(embed.querySelectorAll('script')).toHaveLength(1)
      expect(embed.querySelector('script')?.textContent).toContain('window.__centraNew = true;')
      expect(embed.querySelector('script')?.textContent).not.toContain('window.__centraOld = true;')
    })
  })
})
