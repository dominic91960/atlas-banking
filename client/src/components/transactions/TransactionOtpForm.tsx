import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import InputGroup from "../global/ui/InputGroup";
import PrimaryButton from "../global/ui/PrimaryButton";
import SecondaryButton from "../global/ui/SecondaryButton";
import {
  transactionOtpSchema,
  type TTransactionOtp,
} from "../../lib/validations/transaction";

type TransactionOtpFormProps = {
  maskedAccount: string;
  amount: string;
  expiresIn: number;
  onVerify: (data: TTransactionOtp) => Promise<void>;
  onBack: () => void;
};

const TransactionOtpForm: React.FC<TransactionOtpFormProps> = ({
  maskedAccount,
  amount,
  expiresIn,
  onVerify,
  onBack,
}) => {
  const [countdown, setCountdown] = useState(expiresIn);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TTransactionOtp>({
    resolver: zodResolver(transactionOtpSchema),
    defaultValues: { otp: "" },
  });

  return (
    <form
      className="flex min-h-0 grow flex-col justify-between gap-8"
      onSubmit={handleSubmit(onVerify)}
    >
      <div className="space-y-4">
        <p className="text-[18px] font-medium text-neutral-100">
          Verify Transaction
        </p>
        <p>
          You are transferring{" "}
          <span className="font-medium text-neutral-100">LKR {amount}</span> to
          account{" "}
          <span className="font-medium text-neutral-100">{maskedAccount}</span>.
          A 6-digit verification code has been sent to your registered email
          address.
        </p>
      </div>

      <div className="relative space-y-4 overflow-auto pe-2">
        <InputGroup
          type="text"
          id="transactionOtp"
          label="Enter the 6-digit code"
          placeholder="e.g. 123456"
          {...register("otp")}
          errorMessage={errors.otp?.message}
        />
        <div className="absolute top-0 right-0">
          {countdown > 0 ? (
            <span>Expires in {formatTime(countdown)}</span>
          ) : (
            <span className="text-red-500">Code expired</span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <PrimaryButton type="submit" disabled={isSubmitting || countdown === 0}>
          {isSubmitting ? "Verifying..." : "Confirm Transfer"}
        </PrimaryButton>
        <SecondaryButton type="button" onClick={onBack}>
          Cancel
        </SecondaryButton>
      </div>
    </form>
  );
};

export default TransactionOtpForm;
