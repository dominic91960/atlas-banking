import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import InputGroup from "../global/ui/InputGroup";
import PrimaryButton from "../global/ui/PrimaryButton";
import {
  transferStepSchema,
  type TTransferStep,
} from "../../lib/validations/transaction";

type TransferDetailsFormProps = {
  onComplete: (data: TTransferStep) => Promise<void>;
};

const TransferDetailsForm: React.FC<TransferDetailsFormProps> = ({
  onComplete,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TTransferStep>({
    resolver: zodResolver(transferStepSchema),
    defaultValues: {
      receiverAccountNumber: "",
      amount: "",
      reference: "",
    },
  });

  return (
    <form
      className="flex min-h-0 grow flex-col justify-between gap-8"
      onSubmit={handleSubmit(onComplete)}
    >
      <p className="text-[18px] font-medium text-neutral-100">
        Transfer Credits
      </p>

      <div className="space-y-4 overflow-auto pe-2">
        <InputGroup
          type="text"
          id="receiverAccountNumber"
          label="Receiver account number"
          placeholder="e.g. 100200300400"
          {...register("receiverAccountNumber")}
          errorMessage={errors.receiverAccountNumber?.message}
        />

        <InputGroup
          type="text"
          id="amount"
          label="Amount"
          placeholder="e.g. 5000.00"
          inputMode="decimal"
          {...register("amount")}
          errorMessage={errors.amount?.message}
        />

        <InputGroup
          type="text"
          id="reference"
          label="Reference (optional)"
          placeholder="e.g. Rent payment"
          {...register("reference")}
          errorMessage={errors.reference?.message}
        />
      </div>

      <PrimaryButton type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : "Continue"}
      </PrimaryButton>
    </form>
  );
};

export default TransferDetailsForm;
