import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import InputGroup from "../global/ui/InputGroup";
import PasswordInputGroup from "../global/ui/PasswordInputGroup";
import PrimaryButton from "../global/ui/PrimaryButton";
import {
  signUpStepSchema,
  type TSignUpStep,
} from "../../lib/validations/sign-up";
import SecondaryButton from "../global/ui/SecondaryButton";

type SignUpFormProps = {
  onBack: () => void;
  onComplete: (data: TSignUpStep) => void;
};

const SignUpForm: React.FC<SignUpFormProps> = ({ onComplete, onBack }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TSignUpStep>({
    resolver: zodResolver(signUpStepSchema),
  });

  return (
    <form
      className="flex grow flex-col justify-between"
      onSubmit={handleSubmit(onComplete)}
    >
      {/* Text Wrapper */}
      <div className="space-y-4">
        <h4 className="font-title text-[20px] text-neutral-100 uppercase">
          Get started with atlas today
        </h4>
        <p className="min-[1920px]:text-[20px]">
          Create your online banking account to begin your digital journey with
          Atlas.
        </p>
      </div>

      {/* Input Wrapper */}
      <div className="space-y-9">
        {/* Username */}
        <InputGroup
          type="string"
          id="username"
          label="Enter a username"
          {...register("username")}
          errorMessage={errors.username?.message}
        />

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
          Sign Up
        </PrimaryButton>
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

export default SignUpForm;
