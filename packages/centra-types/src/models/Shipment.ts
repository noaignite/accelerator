export interface Shipment {
  shipmentId?: string
  shippedDate?: string
  carrier?: string
  service?: string
  trackingId?: string
  trackingUrl?: string
  returnSlipTracking?: string
  additionalMessage?: string
}
