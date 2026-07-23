/**
 * Format a balance value for display.
 * Numbers under 100,000 are shown in full with commas.
 * Larger values are abbreviated: K, M, B, T.
 */
const formatBalance = (value: number): string => {
  if (value < 100_000) {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  const tiers = [
    { threshold: 1_000_000_000_000, suffix: "T" },
    { threshold: 1_000_000_000, suffix: "B" },
    { threshold: 1_000_000, suffix: "M" },
    { threshold: 100_000, suffix: "K" },
  ];

  for (const { threshold, suffix } of tiers) {
    if (value >= threshold) {
      const scaled = value / (suffix === "K" ? 1_000 : threshold);
      return scaled.toFixed(2) + suffix;
    }
  }

  return value.toFixed(2);
};

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
    <div className="bg-secondary flex flex-col justify-between p-8 text-neutral-100">
      <p className="text-[18px] font-medium">Total Account Balance</p>

      <div className="flex items-end gap-4">
        <p className="font-title text-[20px] leading-[56px]">LKR</p>
        {isLoading ? (
          <div className="mb-2 h-10 w-48 animate-pulse rounded bg-neutral-700" />
        ) : error ? (
          <p className="text-[18px] text-red-400">{error}</p>
        ) : numericBalance !== null ? (
          <p className="font-title text-[48px]" title={`LKR ${fullBalance}`}>
            {formatBalance(numericBalance)}
          </p>
        ) : (
          <p className="font-title text-[48px]">—</p>
        )}
      </div>

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
