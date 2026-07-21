import { useState } from "react";

import { AxiosError } from "axios";

import api from "../../../lib/axios-instance";
import BankAccForm from "./BankAccForm";
import OTPForm from "./OTPForm";
import SignUpForm from "./SignUpForm";
import type {
  TNicStep,
  TOtpStep,
  TSignUpStep,
} from "../../../lib/validations/sign-up";

const SignUpFlow = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [email, setEmail] = useState("");
  const [expiresIn, setExpiresIn] = useState(0);
  const [nic, setNic] = useState("");
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const handleNICComplete = async (data: TNicStep) => {
    try {
      const res = await api.post("/auth/register/start", { ...data });
      if (res.status !== 200) throw new Error(res.data.message);

      const { email, expiresInSeconds } = { ...res.data };
      setNic(data.nic);
      setAccountNumber(data.accountNumber);
      setEmail(email);
      setExpiresIn(expiresInSeconds);
      setStep(2);
    } catch (err) {
      let errorMessage = "Something went wrong. Please try again.";

      if (err instanceof AxiosError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
    }
  };

  const handleOtpResend = async () => {
    try {
      const res = await api.post("/auth/register/start", {
        nic,
        accountNumber,
      });
      if (res.status !== 200) throw new Error(res.data.message);
    } catch (err) {
      let errorMessage = "Something went wrong. Please try again.";

      if (err instanceof AxiosError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
    }
  };

  const handleOtpVerify = async (data: TOtpStep) => {
    try {
      const res = await api.post("/auth/register/verify-otp", {
        accountNumber,
        ...data,
      });
      if (res.status !== 200) throw new Error(res.data.message);
      setStep(3);
    } catch (err) {
      let errorMessage = "Something went wrong. Please try again.";

      if (err instanceof AxiosError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
    }
  };

  const handlePasswordComplete = async (data: TSignUpStep) => {
    try {
      const res = await api.post("/auth/register/complete", {
        accountNumber,
        username: data.username,
        password: data.password,
      });
      if (res.status !== 200) throw new Error(res.data.message);
    } catch (err) {
      let errorMessage = "Something went wrong. Please try again.";

      if (err instanceof AxiosError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
    }
  };

  return (
    <>
      {step == 1 && <BankAccForm onComplete={handleNICComplete} />}
      {step == 2 && (
        <OTPForm
          email={email}
          expiresIn={expiresIn}
          onBack={() => setStep(1)}
          onOTPResend={handleOtpResend}
          onVerify={handleOtpVerify}
        />
      )}
      {step == 3 && (
        <SignUpForm
          onBack={() => setStep(2)}
          onComplete={handlePasswordComplete}
        />
      )}
    </>
  );
};

export default SignUpFlow;
