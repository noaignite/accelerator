import * as React from 'react'

interface PaymentFormEmbedProps extends React.ComponentProps<'div'> {
  html: string
}

function PaymentFormEmbed(props: PaymentFormEmbedProps): React.ReactElement {
  const { html, ...other } = props

  const ref = React.useRef<HTMLDivElement>(null)

  // We need to reload scripts in the html in order for them to run
  React.useEffect(() => {
    if (ref.current) {
      const node = ref.current
      const scripts = node.getElementsByTagName('script')
      Array.from(scripts).forEach((script) => {
        const scriptEl = document.createElement('script')
        if (script.src) {
          scriptEl.src = script.src
        } else if (script.type !== 'application/json') {
          const textNode = document.createTextNode(script.innerHTML)
          scriptEl.appendChild(textNode)
        }
        node.appendChild(scriptEl)
      })
    }
  }, [ref])

  // eslint-disable-next-line react/no-danger
  return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} {...other} />
}

export default PaymentFormEmbed
