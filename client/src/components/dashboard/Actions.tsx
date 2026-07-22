import { Link } from "react-router";

import Bill from "../global/icons/Bill";
import Money from "../global/icons/Money";
import TopUp from "../global/icons/TopUp";
import Transfer from "../global/icons/Transfer";

const Actions = () => {
  return (
    <div className="grid grow grid-cols-2 grid-rows-2 gap-px">
      <Link
        to="/transactions"
        className="bg-secondary transition-default flex flex-col items-center gap-5 p-6 hover:bg-neutral-800"
      >
        <Transfer className="w-[32px]" />
        <p>Credit Transfer</p>
      </Link>

      <button className="bg-secondary transition-default flex flex-col items-center gap-5 p-6 hover:bg-neutral-800">
        <Bill className="h-[32px]" />
        <p>Bill Payment</p>
      </button>

      <button className="bg-secondary transition-default flex flex-col items-center gap-5 p-6 hover:bg-neutral-800">
        <TopUp className="w-[32px]" />
        <p>Top-Up</p>
      </button>

      <button className="bg-secondary transition-default flex flex-col items-center gap-5 p-6 hover:bg-neutral-800">
        <Money className="w-[32px]" />
        <p>Send Money</p>
      </button>
    </div>
  );
};

export default Actions;
