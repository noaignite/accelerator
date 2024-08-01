import { useEffect } from 'react'
import { useCentraSelection } from '../Context'
import HtmlEmbed from '../internal/HtmlEmbed'

export default function ShipwalletEmbed() {
  const { selection } = useCentraSelection()

  useEffect(() => {
    if ('CentraCheckout' in window) {
      // we need to re init the shipwallet if the centra checkout script was loaded before the ingrid embed
      window.CentraCheckout.reInitiate('shipwallet')
    }
  }, [])

  if (!selection?.pluginFields?.shipwallet?.snippet) {
    return null
  }

  return (
    <HtmlEmbed html={selection.pluginFields.shipwallet.snippet} id="centra-shipwallet-snippet" />
  )
}
