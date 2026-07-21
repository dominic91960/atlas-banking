import React from "react";
import { cn } from "../../../lib/utils";

type SecondaryButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & { text: string };

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  text,
  ...props
}) => {
  return (
    <button
      className={cn(
        "border-primary w-full border py-2 font-medium uppercase disabled:pointer-events-none disabled:opacity-50 transition-default hover:opacity-80",
        props.className,
      )}
      {...props}
    >
      {text}
    </button>
  );
};

export default SecondaryButton;
