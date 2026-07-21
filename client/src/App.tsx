import { useState } from "react";

import Globe from "./components/global/icons/Globe";
import Logo from "./components/global/icons/Logo";
import PixelAnimation from "./components/client-side/PixelAnimation";
import SignUpFlow from "./components/client-side/sign-up/SignUpFlow";
import SignInForm from "./components/client-side/sign-in/SignInForm";

const App = () => {
  const [signUpComplete, setSignUpComplete] = useState(true);

  const handleSignUpComplete = () => setSignUpComplete(true);
  const handleCancelSignIn = () => setSignUpComplete(false);

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
            {!signUpComplete && (
              <SignUpFlow onSignUpComplete={handleSignUpComplete} />
            )}
            {signUpComplete && (
              <SignInForm onCancelSignIn={handleCancelSignIn} />
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
