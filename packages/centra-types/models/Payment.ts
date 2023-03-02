export default interface Payment {
  action?: 'success' | 'form' | 'redirect' | 'javascript'
  code?: string
  formFields?: Record<string, string>
  formHtml?: string
  formType?: string
  formUrl?: string
  url?: string
}
