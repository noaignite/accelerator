import { ReactNode } from "react";
import clsx from "clsx";
import classes from "./button.module.css";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  appName: string;
}

export const Button = (props: ButtonProps) => {
  const { children, className, appName } = props;

  return (
    <button
      className={clsx(classes.root, className)}
      onClick={() => alert(`Hello from your ${appName} app!`)}
    >
      {children}
    </button>
  );
};
