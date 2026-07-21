import InputGroup from "../../global/ui/InputGroup";
import PrimaryButton from "../../global/ui/PrimaryButton";

const OTPForm = () => {
  return (
    <form className="flex grow flex-col justify-between">
      {/* Text Wrapper */}
      <div className="space-y-4">
        <h4 className="font-title text-[20px] text-neutral-100 uppercase">
          Get started with atlas today
        </h4>
        <p className="min-[1920px]:text-[20px]">
          Please check the inbox of your email that is associated with your bank
          account for a 6 digit pin.
        </p>
      </div>

      {/* Input Wrapper */}
      <div className="space-y-9">
        {/* OTP */}
        <InputGroup
          type="string"
          id="otp"
          name="otp"
          label="Enter the 6 digit pin"
          maxLength={6}
          errorMessage="Invalid pin number"
        />
      </div>

      {/* CTA Wrapper */}
      <div className="space-y-4">
        <PrimaryButton text="Verify" />
        <div className="flex items-center justify-between">
          <p>Have an account already?</p>
          <p>Sign In</p>
        </div>
      </div>
    </form>
  );
};

export default OTPForm;
