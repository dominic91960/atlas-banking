import Notification from "../global/icons/Notification";
import Settings from "../global/icons/Settings";
import { useAuthStore } from "../../store/authStore";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

const DashboardHeader = () => {
  const { auth } = useAuthStore();
  const username = auth.user?.username ?? "User";

  return (
    <div className="bg-secondary flex items-center justify-between p-8 text-neutral-100">
      {/* Greet */}
      <div className="flex items-center gap-8">
        <div className="size-18 bg-neutral-700 p-0.5">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURI(username)}&background=random&size=128&format=png`}
            alt="Headshot of the user"
            className="size-full object-cover object-center"
          />
        </div>
        <p className="text-[30px]">{getGreeting()}, {username}.</p>
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

