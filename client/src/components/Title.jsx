import { BellIcon, Sparkles, CheckCircle2, Megaphone } from "lucide-react";
import React, { useMemo, useState, useEffect } from "react";
import ProfilePopup from "./ProfilePopup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { notificationAPI } from "../utils/api";

const Title = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const { logout, user } = useAuth();

  const fetchNotifications = async () => {
    try {
      const data = await notificationAPI.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for notifications
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const toggleNotifications = async () => {
    setShowNotifications((prev) => !prev);
    if (!showNotifications && unreadCount > 0) {
      try {
        await notificationAPI.markAsRead();
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      } catch (error) {
        console.error("Failed to mark notifications as read", error);
      }
    }
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
                  key={n._id}
                  className="flex items-start gap-3 p-2 rounded-xl hover:bg-[#fff5f8] transition"
                >
                  <div className="mt-0.5">
                    {n.type === "request_accepted" ? (
                      <CheckCircle2 className="w-5 h-5 text-[#22c55e]" />
                    ) : (
                      <Megaphone className="w-5 h-5 text-[#c0264a]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-gray-800">
                      {n.type === 'request_accepted' ? 'Request Accepted' : 'New Request'}
                    </p>
                    <p className="text-sm text-gray-600 truncate">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        <div
          className="
            w-8 h-8 rounded-full cursor-pointer
            transition-all duration-300 
            hover:scale-110 overflow-hidden
            flex items-center justify-center
            border-2 border-[#c0264a]
          "
          onClick={() => setShowPopup(prev => !prev)}
        >
          {user?.avatarUrl && user.avatarUrl.trim() !== "" ? (
            <img 
              key={`avatar-${user.avatarUrl.substring(0, 50)}`}
              src={user.avatarUrl} 
              alt="Profile" 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Hide broken image
                e.target.style.display = 'none';
              }}
            />
          ) : user?.email ? (
            <div className="w-full h-full flex items-center justify-center bg-[#f43f5e] text-white text-sm font-bold">
              {user.email.charAt(0).toUpperCase()}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 text-sm font-bold">
              ?
            </div>
          )}
        </div>
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
