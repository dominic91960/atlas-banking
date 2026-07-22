import Notification from "../global/icons/Notification";
import Settings from "../global/icons/Settings";

const DashboardHeader = () => {
  return (
    <div className="bg-secondary flex items-center justify-between p-8 text-neutral-100">
      {/* Greet */}
      <div className="flex items-center gap-8">
        <div className="size-18 bg-neutral-700 p-0.5">
          <img
            src="https://cdn.prod.website-files.com/66b341976189d914e93ad574/6a3372ee792584d66ee72c94_headshot-after.webp"
            alt="Headshot of the user"
            className="size-full object-cover object-center"
          />
        </div>
        <p className="text-[30px]">Good Afternoon, Chanuka.</p>
      </div>

      {/* Settings */}
      <div className="flex gap-8">
        <Settings className="size-8" />
        <Notification className="h-8" />
      </div>
    </div>
  );
};

export default DashboardHeader;
