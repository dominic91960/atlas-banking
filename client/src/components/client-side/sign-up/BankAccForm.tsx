import InputGroup from "../../global/ui/InputGroup";
import PrimaryButton from "../../global/ui/PrimaryButton";

const BankAccForm = () => {
  return (
    <form className="flex grow flex-col justify-between">
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
        {/* Bank Acc Number */}
        <InputGroup
          type="string"
          id="bank-acc-no"
          name="bank-acc-no"
          label="Enter your Bank Account Number"
          placeholder="XXXX XXXX XXXX XXXX"
          errorMessage="Invalid account number format"
        />
      </div>

      {/* CTA Wrapper */}
      <div className="space-y-4">
        <PrimaryButton text="Proceed" />
        <div className="flex items-center justify-between">
          <p>Have an account already?</p>
          <p>Sign In</p>
        </div>
      </div>
    </form>
  );
};

export default BankAccForm;
