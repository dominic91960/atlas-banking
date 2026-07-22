import InputGroup from "../global/ui/InputGroup";
import PrimaryButton from "../global/ui/PrimaryButton";

const CreditTransferForm = () => {
  return (
    <form className="bg-secondary flex min-h-0 grow flex-col justify-between gap-8 space-y-8 p-8">
      <p className="text-[18px] font-medium text-neutral-100">
        Transfer Credits
      </p>

      <div className="space-y-4 overflow-auto pe-2">
        <InputGroup type="string" id="username" label="Enter username" />
        <InputGroup type="string" id="username" label="Enter username" />
        <InputGroup type="string" id="username" label="Enter username" />
      </div>

      <PrimaryButton>Done</PrimaryButton>
    </form>
  );
};

export default CreditTransferForm;
