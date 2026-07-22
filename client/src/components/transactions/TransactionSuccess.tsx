import PrimaryButton from "../global/ui/PrimaryButton";

type TransactionSuccessProps = {
  transactionId: string;
  maskedAccount: string;
  amount: string;
  balance: string;
  completedAt: string;
  onNewTransfer: () => void;
};

const TransactionSuccess: React.FC<TransactionSuccessProps> = ({
  transactionId,
  maskedAccount,
  amount,
  balance,
  completedAt,
  onNewTransfer,
}) => {
  const formattedDate = new Date(completedAt).toLocaleString("en-LK", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="flex min-h-0 grow flex-col justify-between gap-8">
      <div className="space-y-4">
        <p className="text-[18px] font-medium text-neutral-100">
          Transfer Complete
        </p>
        <p>Your credit transfer has been processed successfully.</p>
      </div>

      <div className="space-y-6 overflow-auto pe-2">
        <div className="border-neutral-700 space-y-4 border p-6">
          <DetailRow label="Transaction ID" value={transactionId} />
          <DetailRow label="Receiver" value={maskedAccount} />
          <DetailRow label="Amount" value={`LKR ${amount}`} />
          <DetailRow label="New Balance" value={`LKR ${balance}`} />
          <DetailRow label="Completed" value={formattedDate} />
        </div>
      </div>

      <PrimaryButton type="button" onClick={onNewTransfer}>
        New Transfer
      </PrimaryButton>
    </div>
  );
};

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="flex items-center justify-between gap-4">
    <span className="shrink-0 text-neutral-400">{label}</span>
    <span className="truncate text-right font-medium text-neutral-100">
      {value}
    </span>
  </div>
);

export default TransactionSuccess;
