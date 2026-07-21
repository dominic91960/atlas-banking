import { cn } from "../../../lib/utils";

type InputAreaProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  label: string;
  errorMessage?: string;
};

const InputGroup: React.FC<InputAreaProps> = ({
  label,
  errorMessage,
  ...props
}) => {
  return (
    <div className="relative flex flex-col gap-2 pb-7">
      <label htmlFor={props.id} className="block w-fit">
        {label}
      </label>
      <input
        className={cn(
          "transition-default w-full bg-neutral-800 px-4 py-2 focus:bg-neutral-700 focus:outline-none",
          props.className,
        )}
        {...props}
      />
      {errorMessage && (
        <p className="absolute bottom-0 left-0 text-neutral-600">
          <span className="text-red-500">*</span> {errorMessage}
        </p>
      )}
    </div>
  );
};

export default InputGroup;
