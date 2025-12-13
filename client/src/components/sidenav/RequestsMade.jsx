import { useState, useMemo } from "react";
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
    status: "accepted",
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
    status: "rejected",
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
    status: "pending",
  },
];

const statusBadge = (status) => {
  if (status === "accepted") {
    return (
      <button className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-2 rounded-full text-sm font-semibold w-full justify-center">
        <CheckCircle size={16} />
        Accepted
      </button>
    );
  }
  if (status === "rejected") {
    return (
      <button className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-2 rounded-full text-sm font-semibold w-full justify-center">
        <XCircle size={16} />
        Rejected
      </button>
    );
  }
  return (
    <button className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-3 py-2 rounded-full text-sm font-semibold w-full justify-center">
      <Clock size={16} />
      Pending
    </button>
  );
};

const RequestsMade = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [requests, setRequests] = useState(initialUsers);

  const handleSendRequest = () => {
    toast.success(`Request sent to ${selectedUser?.name} 🎉`);
    setShowRequestModal(false);
  };

  const handleWithdraw = (id) => {
    setRequests((prev) => prev.filter((u) => u.id !== id));
    toast.success("Request withdrawn");
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
            <h1 className="text-4xl font-bold">Your Requests</h1>

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
                    {statusBadge(user.status)}
                    <button
                      onClick={() => handleWithdraw(user.id)}
                      className="w-full rounded-full px-3 py-2 border border-[#ffd2dd] text-[#c0264a] font-semibold hover:bg-[#fff0f4] transition"
                    >
                      Withdraw
                    </button>
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

export default RequestsMade;
