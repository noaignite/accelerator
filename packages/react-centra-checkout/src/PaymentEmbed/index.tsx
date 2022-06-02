import * as React from 'react'
import { useCentraSelection, useCentraHandlers } from '../Context'
import HtmlEmbed from '../internal/HtmlEmbed'

export interface PaymentEmbedProps {
  values: Record<string, unknown>
  onPaymentSuccess?(paymentResult: Centra.CheckoutApi.PaymentResponse): void
  onPaymentError?(error: Record<string, string>): void
}

/** This component handles rendering of payment widgets such as Klarna Checkout and Adyen drop-in, if you submit payments yourself directly,
you should simply call the submitPayment method of the context instead */
const PaymentEmbed = React.memo((props: PaymentEmbedProps): React.ReactElement | null => {
  const { values, onPaymentError, onPaymentSuccess } = props

  const [paymentResult, setPaymentResult] =
    React.useState<Centra.CheckoutApi.PaymentResponse | null>(null)

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
  const handlePaymentCallback = React.useCallback(
    (event) => {
      const {
        addressIncluded,
        billingAddress: detailsAddress,
        shippingAddress: detailsShippingAddress,
        paymentMethod: detailsPaymentMethod,
        paymentMethodSpecificFields,
      } = event.detail

      const payload = {
        address: values.address,
        shippingAddress: values.shippingAddress,
        paymentMethod: detailsPaymentMethod,
        paymentMethodSpecificFields,
      } as Record<string, unknown>

      if (addressIncluded) {
        // if address is included in event, send that address instead
        payload.address = detailsAddress
        payload.shippingAddress = detailsShippingAddress
      }

      submitPayment?.(payload)
        .then((result) => {
          if (result?.errors) {
            onPaymentError?.(result.errors)
            // set paymentResult to null so that a new POST /payment request is made to refresh the widget
            setPaymentResult(null)
          } else {
            onPaymentSuccess?.(result)
          }
        })
        .catch((err) => {
          console.error('@noaignite/react-centra-checkout: Could not submit payment')
          console.error(err)
        })
    },
    [submitPayment, onPaymentSuccess, onPaymentError, values],
  )

  // Reset payment result when method changes
  React.useEffect(() => {
    setPaymentResult(null)
  }, [paymentMethod])

  // Retrieve formHtml
  React.useEffect(() => {
    const shouldRequestPayment =
      paymentMethod?.supportsInitiateOnly || paymentMethod?.providesCustomerAddressAfterPayment // if either of these are true, this is a paymentMethod which provides an embed

    if (!paymentMethod || paymentResult || !selection || !values || !shouldRequestPayment) {
      return
    }

    submitPayment?.(values)
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
  }, [paymentResult, selection, paymentMethod, submitPayment, values])

  React.useEffect(() => {
    // Fires when customer submits payment
    document.addEventListener('centra_checkout_payment_callback', handlePaymentCallback)

    return () => {
      document.removeEventListener('centra_checkout_payment_callback', handlePaymentCallback)
    }
  }, [handlePaymentCallback])

  const formHtml = paymentResult?.formHtml

  return formHtml ? <HtmlEmbed id="centra-payment-form" html={formHtml} /> : null
}, areEqual)

// recursive equality check function to make sure passing an object literal as a `values` prop doesn't re-render PaymentEmbed on every render of the parent component
function areEqual(prevProps: PaymentEmbedProps, nextProps: PaymentEmbedProps): boolean {
  return compareValues(prevProps, nextProps)
}

// we do want to use `any` here, this function can take any value
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function compareValues(oldValue: any, newValue: any): boolean {
  const equal = (
    Object.entries(newValue) as Array<
      [keyof PaymentEmbedProps, PaymentEmbedProps[keyof PaymentEmbedProps]]
    >
  ).every(([propKey, propValue]) => {
    if (propValue && Object.getPrototypeOf(propValue) === Object.prototype) {
      // prop is an object literal
      return compareValues(oldValue[propKey], propValue)
    }

    return propValue === oldValue[propKey]
  })

  return equal
}

export default PaymentEmbed
