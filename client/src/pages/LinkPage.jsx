import { RadioReceiverIcon, SendIcon, Users, UsersRound } from "lucide-react";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Title from "../components/Title";

import RequestsMade from "../components/sidenav/RequestsMade";
import ReceivedRequests from "../components/sidenav/ReceivedRequests";
import Peers from "../components/sidenav/Peers";
import Community from "../components/sidenav/Community";
import CommunityDetail from "../components/sidenav/CommunityDetail";

const LinkPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const sideNav = [
    { icon: SendIcon, title: "Requests Made", link: "/links" },
    { icon: RadioReceiverIcon, title: "Received Requests", link: "/links/received-requests" },
    { icon: Users, title: "Peers", link: "/links/peers" },
    { icon: UsersRound, title: "Community", link: "/links/community" },
  ];

  return (
    <div className="min-h-screen">
      <Title />
      <Sidebar />

      {/* SHIFT PAGE RIGHT TO AVOID OVERLAP */}
      <div className="pl-64">

        {/* SUB NAV */}
        <div className="flex gap-4 px-8 py-4 shadow-sm bg-[linear-gradient(135deg,#fff0f4,#ffe6ec,#ffe9ef)]">
          {sideNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.link;

            return (
              <button
                key={item.link}
                onClick={() => navigate(item.link)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all 
                  ${isActive
                    ? "bg-[#fda4b8] text-white shadow-md scale-[1.03]"
                    : "text-[#c0264a] hover:bg-[linear-gradient(135deg,#ede9fe,#f5e8ff,#f3ecff)]"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {item.title}
              </button>
            );
          })}
        </div>

        {/* MAIN CONTENT — NESTED ROUTES */}
        <div className="p-5">
          <Routes>
            <Route index element={<RequestsMade />} />
            <Route path="received-requests" element={<ReceivedRequests />} />
            <Route path="peers" element={<Peers />} />
            <Route path="community">
            <Route index element={<Community />} />
              <Route path=":name" element={<CommunityDetail />} />
            </Route>

          </Routes>
        </div>

      </div>
    </div>
  );
};

export default LinkPage;
