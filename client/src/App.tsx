import SignUpForm from "./components/client-side/sign-up/SignUpForm";
import Globe from "./components/global/icons/Globe";
import Logo from "./components/global/icons/Logo";
import PixelBlast from "./components/global/ui/PixelBlast";

const App = () => {
  return (
    <main className="flex h-dvh p-8">
      {/* Container */}
      <div className="flex grow gap-px bg-neutral-700 p-px">
        {/* Animation Container */}
        <div className="bg-secondary relative flex grow">
          <PixelBlast
            variant="square"
            pixelSize={1}
            color="#ffff00"
            patternScale={1}
            patternDensity={1}
            pixelSizeJitter={0}
            enableRipples={false}
            rippleSpeed={0.4}
            rippleThickness={0.12}
            rippleIntensityScale={1.5}
            liquid={false}
            liquidStrength={0.12}
            liquidRadius={1.2}
            liquidWobbleSpeed={5}
            speed={0.1}
            edgeFade={0}
            transparent={true}
          />

          <div className="pointer-events-none absolute right-0 bottom-0 size-fit p-9">
            <h1 className="font-title text-right text-[96px] leading-[1.3em] text-neutral-50 uppercase min-[1920px]:text-[128px]">
              The <br /> secure <br /> way <br /> forward
              <span className="text-primary">.</span>
            </h1>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex h-full w-137.5 flex-col gap-px">
          {/* Logo Area */}
          <div className="bg-secondary relative h-25 min-[1920px]:h-40">
            <Logo className="absolute inset-0 m-auto h-2/4 min-[1920px]:h-1/3" />
          </div>

          {/* Form Area */}
          <div className="bg-secondary flex grow px-8 py-10">
            {/* <BankAccForm /> */}
            {/* <OTPForm /> */}
            <SignUpForm />
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
