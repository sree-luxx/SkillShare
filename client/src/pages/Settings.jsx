import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Title from "../components/Title";

const Settings = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen text-gray-900">
      <Title />
      <Sidebar />

      <main className="ml-40 px-8 py-10 animate-fade-in">
        <div className="max-w-3xl mx-auto space-y-10">

          {/* Page Header */}
          <div>
            <h1 className="text-4xl font-bold mb-1">Settings</h1>
            <p className="text-gray-500">Manage your account and preferences</p>
          </div>

          {/* Profile Settings */}
          <div className="bg-[linear-gradient(135deg,#fff0f4,#ffe6ec,#ffe9ef)]
        shadow-md border border-[#ffd2dd]
        hover:shadow-lg  rounded-3xl p-8 space-y-6">
            <h2 className="text-2xl font-bold">Profile Settings</h2>

            <div className="space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="font-medium">
                  Full Name
                </label>
                <input
                  id="name"
                  defaultValue="Jane Doe"
                  className="w-full h-12 px-4 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none bg-white"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  defaultValue="jane@example.com"
                  className="w-full h-12 px-4 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none bg-white"
                />
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label htmlFor="bio" className="font-medium">
                  Bio
                </label>
                <textarea
                  id="bio"
                  placeholder="Tell others about yourself..."
                  defaultValue="Full-stack developer passionate about teaching and learning."
                  className="w-full min-h-28 p-4 border rounded-xl resize-none focus:ring-2 focus:ring-blue-400 outline-none bg-white"
                />
              </div>

              <button  className=" w-full rounded-full p-2 mt-3 bg-[#f43f5e] 
          text-white font-semibold  transition-all duration-300 hover:bg-[#e13354] shadow-md ">
                Save Changes
              </button>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-[linear-gradient(135deg,#fff0f4,#ffe6ec,#ffe9ef)]
        shadow-xl border border-[#ffd2dd]
        hover:shadow-lg rounded-3xl p-8 space-y-6 ">
            <h2 className="text-2xl font-bold">Privacy</h2>

            <div className="space-y-6">
              {/* Toggle Item */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Show my profile to everyone</label>
                  <p className="text-sm text-gray-500">
                    Make your profile visible in search results
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="toggle-checkbox"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Allow skill swap requests</label>
                  <p className="text-sm text-gray-500">
                    Let others send you skill swap requests
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="toggle-checkbox"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Email notifications</label>
                  <p className="text-sm text-gray-500">
                    Receive updates about requests and messages
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="toggle-checkbox"
                />
              </div>
            </div>
          </div>

          {/* Logout Section */}
          <div className="bg-[linear-gradient(135deg,#fff0f4,#ffe6ec,#ffe9ef)]
        shadow-md border border-[#ffd2dd]
        hover:shadow-lg rounded-3xl p-8">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-600 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Settings;
