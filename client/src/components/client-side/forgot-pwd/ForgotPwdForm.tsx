import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";

import { useToastStore } from "../../../store/toastStore";
import { useAuthStore } from "../../../store/authStore";
import {
  forgotPwdFormSchema,
  type TForgotPwdForm,
} from "../../../lib/validations/forgot-pwd";
import api from "../../../lib/axios-instance";
import InputGroup from "../../global/ui/InputGroup";
import PrimaryButton from "../../global/ui/PrimaryButton";

const ForgotPwdForm = () => {
  const { addToast } = useToastStore();
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TForgotPwdForm>({
    resolver: zodResolver(forgotPwdFormSchema),
  });

  const onSubmit = async (data: TForgotPwdForm) => {
    try {
      const res = await api.post(
        "/auth/login",
        { ...data },
        {
          headers: { "Content-Type": "application/json" },
        },
      );
      const accessToken = res.data.accessToken;
      setAuth({ user: data.username, accessToken });
      navigate("/dashboard", { replace: true });
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
          Welcome Back
        </h4>
        <p className="min-[1920px]:text-[20px]">
          Sign in to your online banking account to resume your digital journey
          with Atlas.
        </p>
      </div>

      {/* Input Wrapper */}
      <div className="space-y-9">
        {/* Username */}
        <InputGroup
          type="string"
          id="username"
          label="Enter username"
          {...register("username")}
          errorMessage={errors.username?.message}
        />
      </div>

      {/* CTA Wrapper */}
      <div className="space-y-4">
        <PrimaryButton type="submit" text="Sign In" disabled={isSubmitting} />
        <div className="flex items-center justify-between">
          <p>Don't have an account?</p>
          <button>Sign Up</button>
        </div>
      </div>
    </form>
  );
};

export default ForgotPwdForm;
