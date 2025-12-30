import { useEffect, useState } from "react";
import UserCard from "../UserCard";
import { userAPI } from "../../utils/api";
import ProfilePanel from "../ProfilePanel";

const Peers = () => {
  const [peers, setPeers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchPeers = async () => {
      try {
        setLoading(true);
        const data = await userAPI.getPeers();
        setPeers(
          (data || []).map((u) => ({
            id: u._id,
            name: u.name,
            avatar: u.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`,
            bio: u.bio,
            primarySkill: u.skillsHave?.[0] || "General",
            rating: 5.0,
            community: u.community,
          }))
        );
      } catch {
        setPeers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPeers();
  }, []);

  return (
    <div className="min-h-screen">
      <main className="p-8 animate-fade-in">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold">Your Network</h1>
          </div>

          {loading ? (
            <div className="text-center text-gray-500 py-12">Loading peers...</div>
          ) : peers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="bg-rose-50 p-6 rounded-full">
                <svg className="w-16 h-16 text-[#f43f5e]" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                  <path d="M4 21c0-4 4-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">No peers yet</h3>
              <p className="text-gray-600 max-w-md">
                Accept a skill swap request to see peers here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {peers.map((peer) => (
                <UserCard
                  key={peer.id}
                  user={peer}
                  onViewProfile={() => setSelectedUser(peer)}
                  footerContent={null}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <ProfilePanel
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onRequestSwap={() => setSelectedUser(null)}
      />
    </div>
  );
};

export default Peers;
