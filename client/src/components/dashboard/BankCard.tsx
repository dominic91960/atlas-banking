import Logo from "../global/icons/Logo";
import MasterCard from "../global/icons/MasterCard";
import SimCard from "../global/icons/SimCard";
import Waves from "../global/icons/Waves";

const BankCard = () => {
  return (
    <div className="bg-secondary flex flex-col justify-between p-4 text-neutral-100">
      <div className="flex items-center justify-between">
        <Logo className="w-[120px]" />
        <Waves className="w-[24px]" />
      </div>

      <div className="space-y-2">
        <SimCard className="w-[32px]" />
        <p className="text-[30px] leading-[1em]">2837 8273 8273 0123</p>
      </div>

      <div className="flex items-center justify-between">
        <p>09/32</p>
        <MasterCard className="w-[56px]" />
      </div>
    </div>
  );
};

export default BankCard;
