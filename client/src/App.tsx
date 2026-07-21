import { useState } from "react";
import { AxiosError } from "axios";

import api from "./lib/axios-instance";
import BankAccForm from "./components/client-side/sign-up/BankAccForm";
import Globe from "./components/global/icons/Globe";
import Logo from "./components/global/icons/Logo";
import OTPForm from "./components/client-side/sign-up/OTPForm";
import PixelAnimation from "./components/client-side/PixelAnimation";
import SignUpForm from "./components/client-side/sign-up/SignUpForm";

const App = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const handleNICComplete = async (nic: string, bankAccNo: string) => {
    try {
      const res = await api.post("/auth/register/start", {
        accountNumber: bankAccNo,
        nic,
      });

      console.log(res);
      if (res.status === 200) setStep(2);
    } catch (err) {
      let errorMessage = "Something went wrong. Please try again.";

      if (err instanceof AxiosError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      console.log(errorMessage);
      // toast.error(errorMessage);
    }
  };

  const handleOtpVerify = (otp: string) => {
    console.log("otp:", otp);
    setStep(3);
  };

  const handlePasswordComplete = (
    username: string,
    password: string,
    confirmPassword: string,
  ) => {
    console.log("username:", username);
    console.log("password:", password);
    console.log("confirmPassword:", confirmPassword);
  };

  return (
    <main className="flex h-dvh p-8">
      {/* Container */}
      <div className="flex grow gap-px bg-neutral-700 p-px">
        {/* Animation Container */}
        <PixelAnimation />

        {/* Form Container */}
        <div className="flex h-full w-137.5 flex-col gap-px">
          {/* Logo Area */}
          <div className="bg-secondary relative h-25 min-[1920px]:h-40">
            <Logo className="absolute inset-0 m-auto h-2/4 min-[1920px]:h-1/3" />
          </div>

          {/* Form Area */}
          <div className="bg-secondary flex grow px-8 py-10">
            {step == 1 && <BankAccForm onComplete={handleNICComplete} />}
            {step == 2 && (
              <OTPForm onVerify={handleOtpVerify} onBack={() => setStep(1)} />
            )}
            {step == 3 && (
              <SignUpForm
                onBack={() => setStep(2)}
                onComplete={handlePasswordComplete}
              />
            )}
          </div>

          {/* Bottom Area */}
          <div className="bg-secondary relative hidden h-25 min-[1920px]:block min-[1920px]:h-40">
            <Globe className="absolute inset-0 m-auto h-4/5" />
          </div>
        </div>
      </div>
    </main>
  );
};

export default App;
