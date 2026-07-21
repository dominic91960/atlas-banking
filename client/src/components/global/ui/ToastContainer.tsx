import { cn } from "../../../lib/utils";
import { useToastStore } from "../../../store/useToastStore";
import Close from "../icons/Close";

const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();
  if (toasts.length === 0) return null;

  return (
    <div className="fixed right-10 bottom-10 flex flex-col gap-[0.5em]">
      {toasts.map((toast) => {
        let borderColor: string;
        let fill: string;

        switch (toast.type) {
          case "error":
            borderColor = "border-error";
            fill = "var(--color-error)";
            break;

          case "success":
            borderColor = "border-success";
            fill = "var(--color-success)";
            break;

          default:
            borderColor = "border-neutral-300";
            fill = "var(--color-neutral-300)";
            break;
        }

        return (
          <div
            key={toast.id}
            className={cn(
              "bg-secondary flex items-center gap-[1em] border p-4",
              borderColor,
            )}
          >
            <span>{toast.message}</span>
            <button
              className="transition-default hover:opacity-80"
              onClick={() => removeToast(toast.id)}
            >
              <Close className="size-[1em]" fill={fill} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
