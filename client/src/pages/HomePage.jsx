import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Sidebar from "../components/Sidebar";
import UserCard from "../components/UserCard";
import ProfilePanel from "../components/ProfilePanel";
import RequestModal from "../components/RequestModel";
import toast from 'react-hot-toast'
import Title from "../components/Title";
import { userAPI, requestAPI } from "../utils/api";

const HomePage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Draft filters (user edits here)
  const [searchDraft, setSearchDraft] = useState("");
  const [communityDraft, setCommunityDraft] = useState("All");
  const [skillHaveDraft, setSkillHaveDraft] = useState("All");
  const [skillWantDraft, setSkillWantDraft] = useState("All");

  // Applied filters (used for list)
  const [searchQuery, setSearchQuery] = useState("");
  const [communityFilter, setCommunityFilter] = useState("All");
  const [skillHaveFilter, setSkillHaveFilter] = useState("All");
  const [skillWantFilter, setSkillWantFilter] = useState("All");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userAPI.getAllUsers();
        const mappedUsers = data.map(u => ({
          ...u,
          id: u._id,
          avatar: u.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`,
          primarySkill: u.skillsHave?.[0] || "General",
          rating: 5.0,
          availability: "Flexible",
          skillsHave: u.skillsHave || [],
          skillsWant: u.skillsWant || [],
          community: u.community || "General",
        }));
        setUsers(mappedUsers);
      } catch (error) {
        console.error("Failed to fetch users", error);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSendRequest = async (message) => {
    try {
      await requestAPI.sendRequest(selectedUser.id, message);
      toast.success(`Request sent to ${selectedUser?.name} 🎉`);
      setShowRequestModal(false);
    } catch (error) {
      toast.error(error.message || "Failed to send request");
    }
  };

  const allCommunities = ["All", ...Array.from(new Set(users.map(u => u.community)))];
  const allSkillsHave = ["All", ...Array.from(new Set(users.flatMap(u => u.skillsHave)))];
  const allSkillsWant = ["All", ...Array.from(new Set(users.flatMap(u => u.skillsWant)))];

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.primarySkill.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCommunity =
      communityFilter === "All" || user.community === communityFilter;

    const matchesSkillHave =
      skillHaveFilter === "All" || user.skillsHave.includes(skillHaveFilter);

    const matchesSkillWant =
      skillWantFilter === "All" || user.skillsWant.includes(skillWantFilter);

    return matchesSearch && matchesCommunity && matchesSkillHave && matchesSkillWant;
  });

  const applyFilters = () => {
    setSearchQuery(searchDraft.trim());
    setCommunityFilter(communityDraft);
    setSkillHaveFilter(skillHaveDraft);
    setSkillWantFilter(skillWantDraft);
  };

  return (
    <div className="min-h-screen">
      <Title/>
      <Sidebar />
      
      <main className="ml-64 p-8 animate-fade-in">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Discover Skills</h1>
            <div className="rounded-2xl border border-[#ffd2dd] bg-[linear-gradient(135deg,#fff5f8,#fef0f6)] p-4 flex flex-wrap gap-3 items-center shadow-sm">
              <div className="relative w-full md:w-72">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#c0264a]" />
                <input
                  placeholder="Search by name or skill..."
                  value={searchDraft}
                  onChange={(e) => setSearchDraft(e.target.value)}
                  className="pl-12 pr-4 rounded-full h-12 w-full border border-[#ffd2dd] bg-white"
                />
              </div>
              <select
                className="h-12 px-4 rounded-full border border-[#ffd2dd] bg-white text-[#c0264a]"
                value={communityDraft}
                onChange={(e) => setCommunityDraft(e.target.value)}
              >
                {allCommunities.map((c) => (
                  <option key={c} value={c}>{c === "All" ? "All Communities" : c}</option>
                ))}
              </select>
              <select
                className="h-12 px-4 rounded-full border border-[#ffd2dd] bg-white text-[#c0264a]"
                value={skillHaveDraft}
                onChange={(e) => setSkillHaveDraft(e.target.value)}
              >
                {allSkillsHave.map((s) => (
                  <option key={s} value={s}>{s === "All" ? "Skill they have" : s}</option>
                ))}
              </select>
              <select
                className="h-12 px-4 rounded-full border border-[#ffd2dd] bg-white text-[#c0264a]"
                value={skillWantDraft}
                onChange={(e) => setSkillWantDraft(e.target.value)}
              >
                {allSkillsWant.map((s) => (
                  <option key={s} value={s}>{s === "All" ? "Skill they want" : s}</option>
                ))}
              </select>
              <button
                onClick={applyFilters}
                className="h-12 px-5 rounded-full bg-[#fda4b8] text-white font-semibold shadow hover:shadow-md transition"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {loading ? (
             <div className="flex items-center justify-center py-20">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f84565]"></div>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map(user => (
                <UserCard
                  key={user.id}
                  user={user}
                  onViewProfile={() => setSelectedUser(user)}
                />
              ))}
              {filteredUsers.length === 0 && (
                <div className="col-span-full text-center py-10 text-gray-500">
                  No users found matching your filters.
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <ProfilePanel
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onRequestSwap={() => setShowRequestModal(true)}
      />

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

export default HomePage;
