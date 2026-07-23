import { useEffect } from "react";

import { AxiosError } from "axios";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useToastStore } from "../../store/toastStore";
import {
  resetPwdFormSchema,
  resetPwdTokenSchema,
  type TResetPwdForm,
} from "../../lib/validations/reset-pwd";
import api from "../../lib/axios-instance";
import PasswordInputGroup from "../global/ui/PasswordInputGroup";
import PrimaryButton from "../global/ui/PrimaryButton";
import SecondaryButton from "../global/ui/SecondaryButton";

const ResetPwdForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    const result = resetPwdTokenSchema.safeParse(token);
    if (!result.success) {
      navigate("/sign-in", { replace: true });
      return;
    }
  }, [navigate, searchParams, token]);

  const { addToast } = useToastStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TResetPwdForm>({
    resolver: zodResolver(resetPwdFormSchema),
  });

  const onSubmit = async (data: TResetPwdForm) => {
    try {
      console.log(token);

      await api.post("/auth/reset-password", { token, ...data });
      addToast({
        message: "Password reset successful.",
        type: "success",
      });
      navigate("/sign-in", { replace: true });
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
    <form
      className="flex grow flex-col justify-between"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Text Wrapper */}
      <div className="space-y-4">
        <h4 className="font-title text-[20px] text-neutral-100 uppercase">
          Forgot Your Password?
        </h4>
        <p className="min-[1920px]:text-[20px]">
          No worries. We can send you a password reset link.
        </p>
      </div>

      {/* Input Wrapper */}
      <div className="space-y-9">
        {/* Passwrd */}
        <PasswordInputGroup
          id="password"
          label="Enter a password"
          {...register("password")}
          errorMessage={errors.password?.message}
        />

        {/* Confirm Passwrd */}
        <PasswordInputGroup
          id="confirm-password"
          label="Enter your password again"
          {...register("confirmPassword")}
          errorMessage={errors.confirmPassword?.message}
        />
      </div>

      {/* CTA Wrapper */}
      <div className="space-y-4">
        <PrimaryButton type="submit" disabled={isSubmitting}>
          Confirm
        </PrimaryButton>
        <Link to="/sign-in">
          <SecondaryButton type="button" disabled={isSubmitting}>
            Cancel
          </SecondaryButton>
        </Link>
      </div>
    </form>
  );
};

export default ResetPwdForm;
