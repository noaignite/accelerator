import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import classes from './button.module.css';

interface ButtonProps {
  children: ReactNode;
  className?: string;
  appName: string;
}

export function Button(props: ButtonProps) {
  const { children, className, appName } = props;

  return (
    <button
      className={clsx(classes.root, className)}
      onClick={() => {
        // eslint-disable-next-line no-alert -- Test code
        alert(`Hello from your ${appName} app!`);
      }}
      type="button"
    >
      {children}
    </button>
  );
}
