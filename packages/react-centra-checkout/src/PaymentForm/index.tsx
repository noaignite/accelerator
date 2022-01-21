import * as Centra from '@noaignite/centra-types'
import * as React from 'react'
import { useCentra } from '../Context'
import PaymentFormEmbed from './partials/PaymentFormEmbed'

interface PaymentFormProps {
  paymentReturnPage: string
  paymentFailedPage: string
  onSuccess?(paymentResult: Centra.PaymentResponse): void
  onError?(error: Record<string, string>): void
}

/** This component handles rendering of payment widgets such as Klarna Checkout and Adyen drop-in, if you submit payments yourself directly,
you should simply call the submitPayment method of the context instead */
function PaymentForm(props: PaymentFormProps): React.ReactElement | null {
  const { paymentReturnPage, paymentFailedPage, onError, onSuccess } = props

  const [paymentResult, setPaymentResult] = React.useState<Centra.PaymentResponse | null>(null)
  const [formHtml, setFormHtml] = React.useState<string | null>(null)

  // get selection
  const { selection, paymentMethods, submitPayment } = useCentra()
  // get payment method
  const paymentMethodId = selection?.paymentMethod
  const paymentMethod = paymentMethods?.find((p) => p.paymentMethod === paymentMethodId)

  // POST to /payment if payment method is initiate only (method that doesn't need address) or if the payment method provides it's own address
  React.useEffect(() => {
    if (
      selection &&
      paymentMethod &&
      (paymentMethod.providesCustomerAddressAfterPayment || paymentMethod.supportsInitiateOnly)
    ) {
      const { address, shippingAddress } = selection

      submitPayment?.({
        address,
        paymentInitiateOnly: paymentMethod.supportsInitiateOnly,
        paymentMethod: paymentMethodId,
        shippingAddress,
      })
        .then((result) => {
          setPaymentResult(result)
        })
        .catch(console.error)
    }
  }, [
    paymentFailedPage,
    paymentMethod,
    paymentMethodId,
    paymentReturnPage,
    selection,
    submitPayment,
  ])

  React.useEffect(() => {
    // payment method changed, reset payment result
    setPaymentResult(null)
  }, [paymentMethodId])

  // respond to paymentResult
  React.useEffect(() => {
    if (paymentResult) {
      if (!paymentResult.errors) {
        onSuccess?.(paymentResult)

        // result is a html form (or widget)
        if (paymentResult.action === 'form' && paymentResult.formHtml) {
          setFormHtml(paymentResult.formHtml)
        } else {
          console.error('@noaignite/react-centra-checkout: No form html to render')
        }
      } else {
        onError?.(paymentResult.errors)
      }
    } else {
      setFormHtml(null)
    }
  }, [paymentResult, onSuccess, onError])

  return formHtml ? <PaymentFormEmbed html={formHtml} /> : null
}

export default PaymentForm
