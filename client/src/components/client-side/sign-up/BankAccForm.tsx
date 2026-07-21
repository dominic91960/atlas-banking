import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import InputGroup from "../../global/ui/InputGroup";
import PrimaryButton from "../../global/ui/PrimaryButton";
import { nicStepSchema, type TNicStep } from "../../../lib/validations/sign-up";

type BankAccFormProps = {
  onComplete: (data: TNicStep) => void;
};

const BankAccForm: React.FC<BankAccFormProps> = ({ onComplete }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TNicStep>({
    resolver: zodResolver(nicStepSchema),
  });

  return (
    <form
      className="flex grow flex-col justify-between"
      onSubmit={handleSubmit(onComplete)}
    >
      {/* Text Wrapper */}
      <div className="space-y-4">
        <h4 className="font-title text-[20px] text-neutral-100 uppercase">
          Get started with atlas today
        </h4>
        <p className="min-[1920px]:text-[20px]">
          Let’s register to Atlas’s online banking service. Please note that you
          must already have an Atlas Banking account to proceed.
        </p>
      </div>

      {/* Input Wrapper */}
      <div className="space-y-9">
        {/* NIC */}
        <InputGroup
          type="text"
          id="nic"
          label="Enter your NIC Number"
          {...register("nic")}
          errorMessage={errors.nic?.message}
        />

        {/* Bank Acc Number */}
        <InputGroup
          type="text"
          id="bank-acc-no"
          label="Enter your Bank Account Number"
          {...register("accountNumber")}
          errorMessage={errors.accountNumber?.message}
        />
      </div>

      {/* CTA Wrapper */}
      <div className="space-y-4">
        <PrimaryButton type="submit" text="Proceed" disabled={isSubmitting} />
        <div className="flex items-center justify-between">
          <p>Have an account already?</p>
          <p>Sign In</p>
        </div>
      </div>
    </form>
  );
};

export default BankAccForm;
