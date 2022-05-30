import * as Centra from '@noaignite/centra-types'
import * as React from 'react'
import { useCentraSelection, useCentraHandlers } from '../Context'
import PaymentEmbedHtml from './partials/PaymentEmbedHtml'

export interface PaymentEmbedProps {
  termsAndConditions: boolean
  onPaymentSuccess?(paymentResult: Centra.PaymentResponse): void
  onPaymentError?(error: Record<string, string>): void
}

/** This component handles rendering of payment widgets such as Klarna Checkout and Adyen drop-in, if you submit payments yourself directly,
you should simply call the submitPayment method of the context instead */
function PaymentEmbed(props: PaymentEmbedProps): React.ReactElement | null {
  const { termsAndConditions, onPaymentError, onPaymentSuccess } = props

  const [paymentResult, setPaymentResult] = React.useState<Centra.PaymentResponse | null>(null)

  // Get selection
  const { selection, paymentMethods } = useCentraSelection()
  const { submitPayment } = useCentraHandlers()

  // Get payment method
  const paymentMethodId = selection?.paymentMethod
  const paymentMethod = React.useMemo(
    () => paymentMethods?.find((p) => p.paymentMethod === paymentMethodId),
    [paymentMethods, paymentMethodId],
  )

  // Submit payment
  const handlePaymentSubmit = React.useCallback(
    (event) => {
      const details = event.detail

      const payload: Record<string, unknown> = {
        address: details.addressIncluded ? details.address : selection?.address,
        shippingAddress: details.addressIncluded
          ? details.shippingAddress
          : selection?.shippingAddress,
        termsAndConditions,
      }

      if (details?.paymentMethodSpecificFields) {
        payload.paymentMethodSpecificFields = details.paymentMethodSpecificFields
      }

      submitPayment?.(payload)
        .then((result) => {
          if (result?.errors) {
            onPaymentError?.(result.errors)
          } else {
            onPaymentSuccess?.(result)
          }
        })
        .catch((err) => {
          console.error('@noaignite/react-centra-checkout: Could not submit payment')
          console.error(err)
        })
    },
    [selection, termsAndConditions, submitPayment, onPaymentSuccess, onPaymentError],
  )

  // Reset payment result when method changes
  React.useEffect(() => {
    setPaymentResult(null)
  }, [paymentMethod])

  // Retrieve formHtml
  React.useEffect(() => {
    if (!paymentMethod || paymentResult || !selection) {
      return
    }

    const paymentInitiateOnly =
      paymentMethod?.supportsInitiateOnly || paymentMethod.providesCustomerAddressAfterPayment

    const payload = {
      address: selection.address,
      shippingAddress: selection.shippingAddress,
      paymentMethod: paymentMethod.paymentMethod,
      paymentInitiateOnly,
      // Validated in 'handlePaymentSubmit' when method is 'initate only'
      termsAndConditions: paymentInitiateOnly ? true : termsAndConditions,
    }

    submitPayment?.(payload)
      .then((result) => {
        if (result?.errors) {
          console.error(result.errors)
          throw new Error('@noaignite/react-centra-checkout: Error while fetching widget')
        } else if (result.action === 'form' && !result.formHtml) {
          throw new Error('@noaignite/react-centra-checkout: No form to render')
        }

        setPaymentResult(result)
      })
      .catch((err) => {
        console.error(err)
        setPaymentResult(null)
      })
  }, [paymentResult, selection, paymentMethod, termsAndConditions, submitPayment])

  // Fires when customer submits payment
  React.useEffect(() => {
    document.addEventListener('centra_checkout_payment_callback', handlePaymentSubmit)

    return () => {
      document.removeEventListener('centra_checkout_payment_callback', handlePaymentSubmit)
    }
  }, [handlePaymentSubmit])

  const formHtml = paymentResult?.formHtml

  return formHtml ? <PaymentEmbedHtml html={formHtml} /> : null
}

export default PaymentEmbed
