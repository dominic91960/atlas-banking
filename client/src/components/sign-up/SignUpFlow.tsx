import { useRef, useState } from "react";

import { useNavigate } from "react-router";
import { AxiosError } from "axios";

import { useToastStore } from "../../store/toastStore";
import api from "../../lib/axios-instance";
import BankAccForm from "./BankAccForm";
import OTPForm from "./OTPForm";
import SignUpForm from "./SignUpForm";
import type {
  TNicStep,
  TOtpStep,
  TSignUpStep,
} from "../../lib/validations/sign-up";

const SignUpFlow = () => {
  const { addToast } = useToastStore();
  const navigate = useNavigate();
  const nicDataRef = useRef<TNicStep>({ nic: "", accountNumber: "" });
  const [email, setEmail] = useState("");
  const [expiresIn, setExpiresIn] = useState(0);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const handleNICComplete = async (data: TNicStep) => {
    try {
      const res = await api.post("/auth/register/start", { ...data });
      const { email, expiresInSeconds } = { ...res.data };

      nicDataRef.current = data;
      setEmail(email);
      setExpiresIn(expiresInSeconds);
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

  const handleOtpResend = async () => {
    try {
      await api.post("/auth/register/start", nicDataRef.current);
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

  const handleOtpVerify = async (data: TOtpStep) => {
    try {
      await api.post("/auth/register/verify-otp", {
        accountNumber: nicDataRef.current.accountNumber,
        ...data,
      });

      setStep(3);
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

  const handlePasswordComplete = async (data: TSignUpStep) => {
    try {
      await api.post("/auth/register/complete", {
        accountNumber: nicDataRef.current.accountNumber,
        username: data.username,
        password: data.password,
      });
      navigate("/sign-in");
      return;
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
