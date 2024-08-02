import { clsx } from 'clsx'
import type { ReactNode } from 'react'
import { forwardPolymorph } from '../utils'
import classes from './button.module.css'

type ButtonProps = {
  children: ReactNode
}

export const Button = forwardPolymorph<'button', ButtonProps>((props, ref) => {
  const { as: Tag = 'button', children, className, ...rest } = props

  return (
    <Tag className={clsx(classes.root, className)} ref={ref} {...rest}>
      {children}
    </Tag>
  )
})
