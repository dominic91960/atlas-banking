import { useState } from "react";

import { cn } from "../../../lib/utils";
import Eye from "../icons/Eye";
import EyeSlash from "../icons/EyeSlash";

type PasswordInputGroupProps = Omit<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  "type"
> & {
  label: string;
  errorMessage?: string;
};

const PasswordInputGroup: React.FC<PasswordInputGroupProps> = ({
  label,
  errorMessage,
  ...props
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative flex flex-col gap-2 pb-7">
      <label htmlFor={props.id} className="block w-fit">
        {label}
      </label>

      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          className={cn(
            "transition-default w-full bg-neutral-800 px-4 py-2 focus:bg-neutral-700 focus:outline-none",
            props.className,
          )}
          {...props}
        />
        <button
          type="button"
          title={visible ? "Hide Password" : "Show Password"}
          className="transition-default absolute top-0 right-[0.6em] bottom-0 my-auto size-[1.5em] opacity-50 hover:opacity-100"
          onClick={() => setVisible((prev) => !prev)}
        >
          {visible ? (
            <EyeSlash className="size-full" />
          ) : (
            <Eye className="size-full" />
          )}
        </button>
      </div>

      {errorMessage && (
        <p className="absolute bottom-0 left-0 text-neutral-600">
          <span className="text-red-500">*</span> {errorMessage}
        </p>
      )}
    </div>
  );
};

export default PasswordInputGroup;
