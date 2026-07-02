import { notifyKlaviyoLoaded } from './klaviyo'

export type KlaviyoScriptProps = {
  publicApiKey: string
} & Omit<React.ComponentProps<'script'>, 'id' | 'src' | 'defer'>

export function KlaviyoScript({ publicApiKey, onError, onLoad, ...other }: KlaviyoScriptProps) {
  return (
    <script
      id="noaignite-klaviyo-script"
      src={`https://static.klaviyo.com/onsite/js/${publicApiKey}/klaviyo.js`}
      onLoad={(event) => {
        notifyKlaviyoLoaded()
        onLoad?.(event)
      }}
      onError={(event) => {
        onError?.(event)
      }}
      defer
      {...other}
    />
  )
}
