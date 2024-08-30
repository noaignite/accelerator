/**
 * The `palette` is the registry containing all colors used by the design
 * system. Each color value in the registry should reference a CSS variable.
 * This allows for each respective app to define each individual CSS variable
 * allowing for a themable and dynamic color system.
 */
export const palette = {
  // The colors used to represent primary interface elements for a user.
  brand1: {
    DEFAULT: 'var(--palette-brand1-primary)',
    secondary: 'var(--palette-brand1-secondary)',
    contrast: 'var(--palette-brand1-contrast)',
  },
  // The colors used to indicate the successful completion of an action that user triggered.
  success: {
    DEFAULT: 'var(--palette-success-primary)',
    secondary: 'var(--palette-success-secondary)',
    contrast: 'var(--palette-success-contrast)',
  },
  // The colors used to represent potentially dangerous actions or important messages.
  warning: {
    DEFAULT: 'var(--palette-warning-primary)',
    secondary: 'var(--palette-warning-secondary)',
    contrast: 'var(--palette-warning-contrast)',
  },
  // The colors used to represent interface elements that the user should be made aware of.
  error: {
    DEFAULT: 'var(--palette-error-primary)',
    secondary: 'var(--palette-error-secondary)',
    contrast: 'var(--palette-error-contrast)',
  },
  // The colors used to present information to the user that is neutral and not necessarily important.
  info: {
    DEFAULT: 'var(--palette-info-primary)',
    secondary: 'var(--palette-info-secondary)',
    contrast: 'var(--palette-info-contrast)',
  },
  // The colors used to style texts.
  text: {
    DEFAULT: 'var(--palette-text-primary)',
    secondary: 'var(--palette-text-secondary)',
    disabled: 'var(--palette-text-disabled)',
    contrast: 'var(--palette-text-contrast)',
  },
  // The colors used to style backgrounds.
  background: {
    DEFAULT: 'var(--palette-background-primary)',
    secondary: 'var(--palette-background-secondary)',
  },
  // The color used to divide different elements.
  divider: {
    DEFAULT: 'var(--palette-divider-primary)',
  },
  // The colors used to style the action elements.
  action: {
    disabled: 'var(--palette-action-disabled)',
    disabledBg: 'var(--palette-action-disabledBg)',
  },
}
