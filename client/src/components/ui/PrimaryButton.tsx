import React from "react";
import { cn } from "../../lib/utils";

type PrimaryButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & { text: string };

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ text, ...props }) => {
  return (
    <button
      className={cn(
        "bg-primary text-secondary w-full py-2 font-medium uppercase",
        props.className,
      )}
      {...props}
    >
      {text}
    </button>
  );
};

export default PrimaryButton;
