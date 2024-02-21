import * as React from 'react'

interface HtmlEmbedProps extends React.ComponentProps<'div'> {
  html: string
}

function HtmlEmbed(props: HtmlEmbedProps): React.ReactElement {
  const { html, ...other } = props

  const ref = React.useRef<HTMLDivElement>(null)

  // We need to reload scripts in the html in order for them to run
  React.useEffect(() => {
    const createdScripts: HTMLScriptElement[] = []
    const node = ref.current

    if (node && html) {
      const scripts = node.getElementsByTagName('script')

      Array.from(scripts).forEach((script) => {
        if (script.type === 'application/json') {
          return
        }

        const scriptEl = document.createElement('script')

        if (script.src) {
          scriptEl.src = script.src
        } else {
          const textNode = document.createTextNode(script.innerHTML)
          scriptEl.appendChild(textNode)
        }

        script.remove()
        createdScripts.push(scriptEl)
        node.appendChild(scriptEl)
      })
    }

    return () => {
      createdScripts.forEach((script) => script.remove())
    }
  }, [html])

  // eslint-disable-next-line react/no-danger
  return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} {...other} />
}

export default HtmlEmbed
