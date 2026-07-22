import { useState } from "react";
import { AxiosError } from "axios";

import { useToastStore } from "../../store/toastStore";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import TransferDetailsForm from "./TransferDetailsForm";
import TransactionOtpForm from "./TransactionOtpForm";
import TransactionSuccess from "./TransactionSuccess";
import type {
  TTransferStep,
  TTransactionOtp,
} from "../../lib/validations/transaction";

type TransferMeta = {
  transferRequestId: string;
  maskedAccount: string;
  amount: string;
  expiresIn: number;
};

type CompletedTransaction = {
  id: string;
  maskedAccount: string;
  amount: string;
  balance: string;
  completedAt: string;
};

const CreditTransferForm = () => {
  const { addToast } = useToastStore();
  const axiosPrivate = useAxiosPrivate();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [transferMeta, setTransferMeta] = useState<TransferMeta | null>(null);
  const [completedTx, setCompletedTx] = useState<CompletedTransaction | null>(
    null,
  );

  const handleTransferStart = async (data: TTransferStep) => {
    try {
      const res = await axiosPrivate.post("/transactions/start", {
        receiverAccountNumber: data.receiverAccountNumber,
        amount: data.amount,
        ...(data.reference ? { reference: data.reference } : {}),
      });

      setTransferMeta({
        transferRequestId: res.data.transferRequestId,
        maskedAccount: res.data.transaction.receiverAccountNumber,
        amount: res.data.transaction.amount,
        expiresIn: res.data.expiresInSeconds,
      });

      setStep(2);
    } catch (err) {
      let errMsg = "Something went wrong. Please try again.";
      if (err instanceof AxiosError) {
        errMsg = err.response?.data?.message ?? err.message ?? errMsg;
      } else if (err instanceof Error) {
        errMsg = err.message;
      }
      addToast({ message: errMsg, type: "error" });
    }
  };

  const handleOtpVerify = async (data: TTransactionOtp) => {
    if (!transferMeta) return;

    try {
      const res = await axiosPrivate.post("/transactions/verify-otp", {
        transferRequestId: transferMeta.transferRequestId,
        otp: data.otp,
      });

      setCompletedTx({
        id: res.data.transaction.id,
        maskedAccount: res.data.transaction.receiverAccountNumber,
        amount: res.data.transaction.amount,
        balance: res.data.transaction.balance,
        completedAt: res.data.transaction.completedAt,
      });

      setStep(3);

      addToast({
        message: "Transaction completed successfully",
        type: "success",
      });
    } catch (err) {
      let errMsg = "Something went wrong. Please try again.";
      if (err instanceof AxiosError) {
        errMsg = err.response?.data?.message ?? err.message ?? errMsg;
      } else if (err instanceof Error) {
        errMsg = err.message;
      }
      addToast({ message: errMsg, type: "error" });
    }
  };

  const handleNewTransfer = () => {
    setStep(1);
    setTransferMeta(null);
    setCompletedTx(null);
  };

  return (
    <div className="bg-secondary flex min-h-0 max-w-115 grow flex-col p-8">
      {step === 1 && <TransferDetailsForm onComplete={handleTransferStart} />}

      {step === 2 && transferMeta && (
        <TransactionOtpForm
          maskedAccount={transferMeta.maskedAccount}
          amount={transferMeta.amount}
          expiresIn={transferMeta.expiresIn}
          onVerify={handleOtpVerify}
          onBack={handleNewTransfer}
        />
      )}

      {step === 3 && completedTx && (
        <TransactionSuccess
          transactionId={completedTx.id}
          maskedAccount={completedTx.maskedAccount}
          amount={completedTx.amount}
          balance={completedTx.balance}
          completedAt={completedTx.completedAt}
          onNewTransfer={handleNewTransfer}
        />
      )}
    </div>
  );
};

export default CreditTransferForm;
