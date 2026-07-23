import { AxiosError } from "axios";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useToastStore } from "../../store/toastStore";
import {
  forgotPwdFormSchema,
  type TForgotPwdForm,
} from "../../lib/validations/forgot-pwd";
import api from "../../lib/axios-instance";
import InputGroup from "../global/ui/InputGroup";
import PrimaryButton from "../global/ui/PrimaryButton";
import SecondaryButton from "../global/ui/SecondaryButton";

const ForgotPwdForm = () => {
  const { addToast } = useToastStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TForgotPwdForm>({
    resolver: zodResolver(forgotPwdFormSchema),
  });

  const onSubmit = async (data: TForgotPwdForm) => {
    try {
      await api.post("/auth/forgot-password", { ...data });
      addToast({
        message: "A reset link was sent to your email.",
        type: "success",
      });
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
        {/* Username */}
        <InputGroup
          type="string"
          id="username"
          label="Enter your Username"
          {...register("username")}
          errorMessage={errors.username?.message}
        />

        {/* Account Number */}
        <InputGroup
          type="string"
          id="bank-acc-no"
          label="Enter your Bank Account Number"
          {...register("accountNumber")}
          errorMessage={errors.accountNumber?.message}
        />

        {/* Email */}
        <InputGroup
          type="email"
          id="email"
          label="Enter your Email"
          {...register("email")}
          errorMessage={errors.email?.message}
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

export default ForgotPwdForm;
