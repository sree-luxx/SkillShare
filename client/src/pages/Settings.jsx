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

      <main className="ml-64 px-10 py-12 animate-fade-in">
        <div className="max-w-4xl mx-auto space-y-12">

          {/* Page Header */}
          <div>
            <h1 className="text-5xl font-bold mb-2">Settings</h1>
            <p className="text-xl text-gray-500">Manage your account and preferences</p>
          </div>

          {/* Active Status Visibility */}
          <div className="bg-[linear-gradient(135deg,#fff0f4,#ffe6ec,#ffe9ef)] shadow-md border border-[#ffd2dd] hover:shadow-lg rounded-3xl p-10 space-y-8">
            <h2 className="text-3xl font-bold">Active Status</h2>
            <p className="text-lg text-gray-500">Control who can see when you are active</p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  id="active-all"
                  name="active-visibility"
                  defaultChecked={localStorage.getItem("activeVisibilityMode") === "all" || !localStorage.getItem("activeVisibilityMode")}
                  onChange={() => localStorage.setItem("activeVisibilityMode", "all")}
                  className="w-5 h-5"
                />
                <label htmlFor="active-all" className="font-semibold text-lg cursor-pointer">All</label>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  id="active-selected"
                  name="active-visibility"
                  defaultChecked={localStorage.getItem("activeVisibilityMode") === "selected"}
                  onChange={() => localStorage.setItem("activeVisibilityMode", "selected")}
                  className="w-5 h-5"
                />
                <label htmlFor="active-selected" className="font-semibold text-lg cursor-pointer">Selected peers</label>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  id="active-none"
                  name="active-visibility"
                  defaultChecked={localStorage.getItem("activeVisibilityMode") === "none"}
                  onChange={() => localStorage.setItem("activeVisibilityMode", "none")}
                  className="w-5 h-5"
                />
                <label htmlFor="active-none" className="font-semibold text-lg cursor-pointer">None</label>
              </div>
              {localStorage.getItem("activeVisibilityMode") === "selected" && (
                <p className="text-base text-gray-500">Go to Messages to pick peers; visibility will apply where relevant.</p>
              )}
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-[linear-gradient(135deg,#fff0f4,#ffe6ec,#ffe9ef)]
        shadow-xl border border-[#ffd2dd]
        hover:shadow-lg rounded-3xl p-10 space-y-8 ">
            <h2 className="text-3xl font-bold">Privacy</h2>

            <div className="space-y-8">
              {/* Toggle Item */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-semibold text-lg">Show my profile to everyone</label>
                  <p className="text-base text-gray-500 mt-1">
                    Make your profile visible in search results
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="toggle-checkbox w-6 h-6"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-semibold text-lg">Allow skill swap requests</label>
                  <p className="text-base text-gray-500 mt-1">
                    Let others send you skill swap requests
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="toggle-checkbox w-6 h-6"
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
