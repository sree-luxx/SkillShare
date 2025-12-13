import { useMemo, useState } from "react";
import { Search, CheckCircle, Clock, XCircle } from "lucide-react";
import UserCard from "../UserCard";
import ProfilePanel from "../ProfilePanel";
import RequestModal from "../RequestModel";
import toast from "react-hot-toast";

const initialUsers = [
  {
    id: 1,
    name: "Alex Rivera",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    primarySkill: "Web Development",
    rating: 4.8,
    bio: "Full-stack developer passionate about teaching and learning new technologies.",
    skillsHave: ["React", "Node.js", "TypeScript", "UI/UX"],
    skillsWant: ["GraphQL"],
    community: "IT",
    availability: "Weekends, 2-5 PM",
    status: "pending",
  },
  {
    id: 2,
    name: "Maya Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
    primarySkill: "Graphic Design",
    rating: 4.9,
    bio: "Creative designer who loves teaching others the art of visual storytelling.",
    skillsHave: ["Figma", "Illustration", "Branding", "Animation"],
    skillsWant: ["3D"],
    community: "Design",
    availability: "Mon-Fri, Evenings",
    status: "pending",
  },
  {
    id: 3,
    name: "Jordan Lee",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
    primarySkill: "Photography",
    rating: 4.7,
    bio: "Professional photographer specializing in portraits and landscapes.",
    skillsHave: ["Portrait", "Lightroom", "Composition", "Studio Lighting"],
    skillsWant: ["Video"],
    community: "Design",
    availability: "Flexible Schedule",
    status: "accepted",
  },
  {
    id: 4,
    name: "Sam Taylor",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
    primarySkill: "Music Production",
    rating: 4.6,
    bio: "Producer and sound engineer helping others create their sound.",
    skillsHave: ["Ableton", "Mixing", "Sound Design", "Music Theory"],
    skillsWant: ["Mastering"],
    community: "Business",
    availability: "Tue/Thu Evenings",
    status: "rejected",
  },
];

const ReceivedRequests = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [requests, setRequests] = useState(initialUsers);

  const handleSendRequest = () => {
    toast.success(`Request sent to ${selectedUser?.name} 🎉`);
    setShowRequestModal(false);
  };

  const handleDecision = (id, decision) => {
    setRequests((prev) =>
      prev.map((user) => (user.id === id ? { ...user, status: decision } : user))
    );
    toast.success(`Request ${decision}`);
  };

  const filteredUsers = useMemo(
    () =>
      requests.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.primarySkill.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [requests, searchQuery]
  );

  return (
    <div className="min-h-screen">
      <main className="ml-20 p-8 animate-fade-in">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Received Requests</h1>

            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 rounded-full h-12 border-2"
              />
            </div>
          </div>

          {/* User Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onViewProfile={() => setSelectedUser(user)}
                footerContent={
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDecision(user.id, "accepted")}
                        className="flex-1 rounded-full px-3 py-2 bg-[#22c55e] text-white font-semibold hover:opacity-90 transition"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleDecision(user.id, "rejected")}
                        className="flex-1 rounded-full px-3 py-2 bg-[#ef4444] text-white font-semibold hover:opacity-90 transition"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                }
              />
            ))}
          </div>
        </div>
      </main>

      {/* Profile Panel */}
      <ProfilePanel
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onRequestSwap={() => setShowRequestModal(true)}
      />

      {/* Request Modal */}
      {showRequestModal && selectedUser && (
        <RequestModal
          userName={selectedUser.name}
          onClose={() => setShowRequestModal(false)}
          onSend={handleSendRequest}
        />
      )}
    </div>
  );
};

export default ReceivedRequests;