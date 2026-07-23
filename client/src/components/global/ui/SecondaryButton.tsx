import React from "react";
import { cn } from "../../../lib/utils";

type SecondaryButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={cn(
        "border-primary transition-default w-full border px-4 py-2 font-medium uppercase hover:opacity-80 disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default SecondaryButton;
