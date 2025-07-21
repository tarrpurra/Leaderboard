import { useState, useEffect } from "react";
import { LuUser, LuTrophy, LuHistory } from "react-icons/lu";
import { useNavigate, useLocation } from "react-router-dom";

export default function Topnav() {
  const navigate = useNavigate();
  const location = useLocation();
  const tabs = [
    { id: "User", label: "Profile", icon: LuUser, path: "/profile" },
    { id: "Leader_board", label: "Leaderboard", icon: LuTrophy, path: "/" },
    {
      id: "points_history",
      label: "History",
      icon: LuHistory,
      path: "/history",
    },
  ];
  // Set initial tab based on location
  const getTabIdFromPath = (pathname) => {
    if (pathname === "/profile") return "User";
    if (pathname === "/history") return "points_history";
    return "Leader_board";
  };
  const [activeTab, setActiveTab] = useState(
    getTabIdFromPath(location.pathname)
  );

  useEffect(() => {
    setActiveTab(getTabIdFromPath(location.pathname));
  }, [location.pathname]);

  return (
    <>
      <div className="w-full flex justify-center items-center fixed mt-6 left-0 z-50 py-4 px-4">
        {/* Glassmorphism background with gradient border */}
        <div className="absolute">
          {/* Gradient border effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-75 animate-pulse"></div>

          {/* Main navigation container */}
          <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
            <div className="flex relative">
              {/* Active tab background slider */}
              <div
                className="absolute top-1 bottom-1 bg-gradient-to-r from-purple-500/80 to-pink-500/80 rounded-xl transition-all duration-500 ease-out shadow-lg"
                style={{
                  left: `${
                    tabs.findIndex((tab) => tab.id === activeTab) * 33.33
                  }%`,
                  width: "33.33%",
                  transform: "translateX(2px)",
                }}
              ></div>

              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      navigate(tab.path);
                    }}
                    className={`relative z-10 flex items-center justify-center space-x-2 px-6 py-3 transition-all duration-300 ease-out group ${
                      isActive
                        ? "text-white font-semibold"
                        : "text-white/70 hover:text-white/90"
                    }`}
                    style={{ minWidth: "120px" }}
                  >
                    <IconComponent
                      size={18}
                      className={`transition-all duration-300 ${
                        isActive
                          ? "scale-110 drop-shadow-lg"
                          : "group-hover:scale-105"
                      }`}
                    />
                    <span
                      className={`text-sm transition-all duration-300 ${
                        isActive
                          ? "font-bold tracking-wide drop-shadow-sm"
                          : "font-medium group-hover:font-semibold"
                      }`}
                    >
                      {tab.label}
                    </span>
                    {/* Subtle glow effect on hover */}
                    <div
                      className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${
                        isActive
                          ? "opacity-0"
                          : "opacity-0 group-hover:opacity-20 bg-white/10"
                      }`}
                    ></div>
                  </button>
                );
              })}
            </div>

            {/* Bottom accent line */}
            <div className="h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          </div>

          {/* Floating particles effect */}
          <div className="absolute -top-2 -left-2 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-60"></div>
          <div className="absolute -top-1 -right-3 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping opacity-40 animation-delay-300"></div>
          <div className="absolute -bottom-2 left-1/2 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-50 animation-delay-700"></div>
        </div>
        <div className=""></div>
      </div>
      {/* Navigation logic for Profile tab */}
      {/* No direct Profile rendering here; handled by router */}
    </>
  );
}
