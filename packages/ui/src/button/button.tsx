import { ReactNode } from "react";
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  base: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderStyle: 'none',
    boxSizing: 'border-box',
    color: '#000000',
    cursor: 'pointer',
    display: 'inline-block',
    fontSize: 16,
    height: 40,
    lineHeight: '20px',
    listStyle: 'none',
    margin: 0,
    outline: 'none',
    padding: '10px 16px',
    position: 'relative',
    textAlign: 'center',
    textDecoration: 'none',
    transition: 'color 100ms',
    verticalAlign: 'baseline',
  }
})

interface ButtonProps {
  children: ReactNode;
  className?: string;
  appName: string;
}

export const Button = (props: ButtonProps) => {
  const { children, appName } = props;

  return (
    <button
      {...stylex.props(styles.base)}
      onClick={() => alert(`Hello from your ${appName} app!`)}
    >
      {children}
    </button>
  );
};
