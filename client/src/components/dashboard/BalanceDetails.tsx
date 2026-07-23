import { formatBalance } from "../../lib/utils";
import Logo from "../global/icons/Logo";

interface BalanceDetailsProps {
  balance: string | null;
  isLoading: boolean;
  error: string | null;
}

const BalanceDetails = ({ balance, isLoading, error }: BalanceDetailsProps) => {
  const numericBalance = balance !== null ? parseFloat(balance) : null;

  const fullBalance =
    numericBalance !== null
      ? numericBalance.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "";

  return (
    <div className="bg-secondary relative flex min-w-112.5 flex-col justify-between p-8 text-neutral-100">
      <p className="text-[18px] font-medium">Total Account Balance</p>

      {isLoading && (
        <div className="bg-secondary absolute inset-0 z-50 flex items-center justify-center">
          <Logo className="w-40 animate-pulse" />
        </div>
      )}

      {!isLoading && error && (
        <div className="bg-secondary absolute inset-0 z-50 flex flex-col items-center justify-center gap-4">
          <p>Failed to account balance. Please try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="transition-default text-primary w-fit text-[1.2em] uppercase underline hover:text-neutral-100"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !error && numericBalance === null && (
        <div className="flex items-end gap-4">
          <p className="font-title text-[20px] leading-14">LKR</p>
          <p className="font-title text-[48px]" title="LKR 0.00">
            LKR 0.00
          </p>
        </div>
      )}

      {!isLoading && !error && numericBalance !== null && (
        <div className="flex items-end gap-4">
          <p className="font-title text-[20px] leading-14">LKR</p>
          <p className="font-title text-[48px]" title={`LKR ${fullBalance}`}>
            {formatBalance(numericBalance)}
          </p>
        </div>
      )}

      <button className="transition-default hover:text-primary group flex w-fit items-center gap-2">
        More Details
        <svg
          viewBox="0 0 9 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-3"
        >
          <path
            d="M0 1.30763L1.33853 0L8.62916 7.1266C8.74668 7.24079 8.83995 7.37658 8.90359 7.52616C8.96724 7.67574 9 7.83614 9 7.99815C9 8.16016 8.96724 8.32056 8.90359 8.47014C8.83995 8.61971 8.74668 8.75551 8.62916 8.8697L1.33853 16L0.00126076 14.6924L6.84403 8L0 1.30763Z"
            className="group-hover:fill-primary transition-default fill-neutral-100"
          />
        </svg>
      </button>
    </div>
  );
};

export default BalanceDetails;
