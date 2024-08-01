import { useEffect, useRef } from 'react'

interface HtmlEmbedProps extends React.ComponentProps<'div'> {
  html: string
}

function HtmlEmbed(props: HtmlEmbedProps): React.ReactElement {
  const { html, ...other } = props

  const ref = useRef<HTMLDivElement>(null)

  // We need to reload scripts in the html in order for them to run
  useEffect(() => {
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
      createdScripts.forEach((script) => {
        script.remove()
      })
    }
  }, [html])

  return <div dangerouslySetInnerHTML={{ __html: html }} ref={ref} {...other} />
}

export default HtmlEmbed
