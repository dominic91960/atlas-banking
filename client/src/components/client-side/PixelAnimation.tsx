import PixelBlast from "../global/ui/PixelBlast";

const PixelAnimation = () => {
  return (
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

      <div className="absolute right-0 bottom-0 size-fit p-9">
        <h1 className="font-title text-right text-[96px] leading-[1.3em] text-neutral-100 uppercase min-[1920px]:text-[128px]">
          The <br /> secure <br /> way <br /> forward
          <span className="text-primary">.</span>
        </h1>
      </div>
    </div>
  );
};

export default PixelAnimation;
