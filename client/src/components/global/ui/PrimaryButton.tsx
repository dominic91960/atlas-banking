import React from "react";
import { cn } from "../../../lib/utils";

type PrimaryButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  ...props
}) => {
  return (
    <button
      className={cn(
        "bg-primary text-secondary transition-default flex w-full items-center justify-center px-4 py-2 font-medium uppercase hover:opacity-80 disabled:pointer-events-none disabled:opacity-50",
        props.className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
