import { BellIcon, Sparkles, UserIcon, CheckCircle2, Megaphone } from "lucide-react";
import React, { useMemo, useState } from "react";
import ProfilePopup from "./ProfilePopup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Title = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: "req-1",
      title: "Request accepted",
      message: "Maya Chen accepted your swap request.",
      time: "2m ago",
      type: "request",
      read: false,
    },
    {
      id: "post-1",
      title: "New community post",
      message: "Alex Rivera shared an update in IT community.",
      time: "5m ago",
      type: "post",
      read: false,
    },
  ]);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);
  const { logout } = useAuth();

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const navigate=useNavigate();
  return (
    <div
      className="
        sticky top-0 z-50 flex justify-between items-center 
        px-8 py-5 border-b-pink-400
        bg-[linear-gradient(135deg,#fff0f4,#ffe6ec,#ffe9ef)]
        backdrop-blur-xl shadow-sm
      "
    >
      {/* Logo + Title */}
      <div
        className="
          flex items-center gap-2 
          font-bold text-2xl text-[#c0264a]
          transition-all duration-300 hover:scale-[1.02]
        "
      >
        <Sparkles className="w-7 h-7 text-[#f43f5e]" />
        <span>SkillShare</span>
      </div>

      {/* Icons */}
      <div className="flex items-center gap-4 text-[#c94b63] relative">
        <div className="relative">
          <BellIcon
            onClick={toggleNotifications}
            className="
              w-5 h-5 cursor-pointer
              transition-all duration-300 
              hover:text-[#f43f5e] hover:scale-110
            "
          />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#f43f5e] text-white text-[10px] rounded-full px-1.5">
              {unreadCount}
            </span>
          )}
        </div>
        {showNotifications && (
          <div className="absolute right-10 top-10 w-80 bg-white shadow-xl border border-[#ffd2dd] rounded-2xl p-3 space-y-2 z-50">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-[#c0264a]">Notifications</p>
              <button
                className="text-xs text-[#c0264a] hover:underline"
                onClick={() => setNotifications([])}
              >
                Clear all
              </button>
            </div>
            {notifications.length === 0 ? (
              <p className="text-sm text-gray-500 py-6 text-center">No new notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="flex items-start gap-3 p-2 rounded-xl hover:bg-[#fff5f8] transition"
                >
                  <div className="mt-0.5">
                    {n.type === "request" ? (
                      <CheckCircle2 className="w-5 h-5 text-[#22c55e]" />
                    ) : (
                      <Megaphone className="w-5 h-5 text-[#c0264a]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-gray-800">{n.title}</p>
                    <p className="text-sm text-gray-600 truncate">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        <UserIcon
          className="
            w-5 h-5 cursor-pointer
            transition-all duration-300 
            hover:text-[#f43f5e] hover:scale-110
          "  onClick={() => setShowPopup(prev => !prev)}
        />
        {showPopup && (
          <ProfilePopup
            onEdit={() => navigate('/profile')}
            onLogout={() => {
              logout();
              navigate('/login', { replace: true });
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Title;
