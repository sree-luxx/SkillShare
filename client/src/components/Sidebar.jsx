import { Home, MessageCircle, Network, Settings, Sparkles, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const classNames = (...classes) => classes.filter(Boolean).join(" ");

const navItems = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: MessageCircle, label: "Messages", path: "/messages" },
  { icon: Network, label: "Links", path: "/links" },
  { icon: Sparkles, label: "AI Profile Matcher", path: "/ai-matcher" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className="
        fixed left-0 top-auto h-screen w-64 
        bg-[linear-gradient(135deg,#fff0f4,#ffe6ec,#ffe9ef)]
        border-r border-[#ffd2dd]
        p-6 space-y-6 z-10 shadow-sm
      "
    >
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={classNames(
                `w-full flex items-center gap-3 px-4 py-3 rounded-2xl 
                 transition-all duration-300 font-medium hover:scale-[1.03]`,
                isActive
                  ? "bg-[#fda4b8] text-white shadow-md"
                  : "text-[#d14c61] hover:bg-[#ffe9ef]"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-6 left-6 right-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl 
                     transition-all duration-300 font-medium hover:scale-[1.03]
                     text-[#d14c61] hover:bg-[#ffe9ef] border border-[#ffd2dd]"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
