import InputGroup from "../../global/ui/InputGroup";
import PasswordInputGroup from "../../global/ui/PasswordInputGroup";
import PrimaryButton from "../../global/ui/PrimaryButton";

const SignUpForm = () => {
  return (
    <form className="flex grow flex-col justify-between">
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
          name="username"
          label="Enter a username"
          errorMessage="Invalid format"
        />

        {/* Passwrd */}
        <PasswordInputGroup
          id="password"
          name="password"
          label="Enter a password"
          errorMessage="Invalid format"
        />

        {/* Confirm Passwrd */}
        <PasswordInputGroup
          id="confirm-password"
          name="confirm-password"
          label="Enter your password again"
          errorMessage="Invalid format"
        />
      </div>

      {/* CTA Wrapper */}
      <div className="space-y-4">
        <PrimaryButton text="Sign Up" />
        <div className="flex items-center justify-between">
          <p>Have an account already?</p>
          <p>Sign In</p>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
