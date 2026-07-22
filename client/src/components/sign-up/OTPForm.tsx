import { useEffect, useRef, useState } from "react";

import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import InputGroup from "../global/ui/InputGroup";
import PrimaryButton from "../global/ui/PrimaryButton";
import SecondaryButton from "../global/ui/SecondaryButton";
import { otpStepSchema, type TOtpStep } from "../../lib/validations/sign-up";

type OTPFormProps = {
  email: string;
  expiresIn: number;
  onBack: () => void;
  onOTPResend: () => void;
  onVerify: (data: TOtpStep) => void;
};

const OTPForm: React.FC<OTPFormProps> = ({
  email,
  expiresIn,
  onBack,
  onOTPResend,
  onVerify,
}) => {
  const [resendCooldown, setResendCooldown] = useState(expiresIn);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const id = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    intervalRef.current = id;
  };

  useEffect(() => {
    startInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TOtpStep>({
    resolver: zodResolver(otpStepSchema),
    defaultValues: { otp: "" },
  });

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setResendCooldown(expiresIn);
    onOTPResend();
    startInterval();
  };

  return (
    <form
      className="flex grow flex-col justify-between"
      onSubmit={handleSubmit(onVerify)}
    >
      {/* Text Wrapper */}
      <div className="space-y-4">
        <h4 className="font-title text-[20px] text-neutral-100 uppercase">
          Get started with atlas today
        </h4>
        <p className="min-[1920px]:text-[20px]">
          Please check your inbox ({email}) for a 6 digit pin.
        </p>
      </div>

      {/* Input Wrapper */}
      <div className="relative space-y-9">
        {/* OTP */}
        <InputGroup
          type="string"
          id="otp"
          label="Enter the 6 digit pin"
          {...register("otp")}
          errorMessage={errors.otp?.message}
        />
        <div className="absolute top-0 right-0">
          {resendCooldown > 0 ? (
            <>Resend code in {resendCooldown}s</>
          ) : (
            <button
              type="button"
              className="hover:text-primary underline underline-offset-4"
              onClick={handleResend}
            >
              Resend code
            </button>
          )}
        </div>
      </div>

      {/* CTA Wrapper */}
      <div className="space-y-4">
        <PrimaryButton type="submit" text="Verify" disabled={isSubmitting} />
        <SecondaryButton type="button" text="Back" onClick={onBack} />
        <div className="flex items-center justify-between">
          <p>Have an account already?</p>
          <Link to="/sign-in" className="transition-default hover:text-primary">
            Sign In
          </Link>
        </div>
      </div>
    </form>
  );
};

export default OTPForm;
