import { useState } from "react";
import { Search } from "lucide-react";
import Sidebar from "../components/Sidebar";
import UserCard from "../components/UserCard";
import ProfilePanel from "../components/ProfilePanel";
import RequestModal from "../components/RequestModel";
import toast from 'react-hot-toast'
import Title from "../components/Title";

const mockUsers = [
  {
    id: 1,
    name: "Alex Rivera",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    primarySkill: "Web Development",
    rating: 4.8,
    bio: "Full-stack developer passionate about teaching and learning new technologies.",
    skillsHave: ["React", "Node.js", "TypeScript", "UI/UX"],
    skillsWant: ["GraphQL", "Next.js"],
    community: "IT",
    availability: "Weekends, 2-5 PM"
  },
  {
    id: 2,
    name: "Maya Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
    primarySkill: "Graphic Design",
    rating: 4.9,
    bio: "Creative designer who loves teaching others the art of visual storytelling.",
    skillsHave: ["Figma", "Illustration", "Branding", "Animation"],
    skillsWant: ["3D Design", "Motion Graphics"],
    community: "Design",
    availability: "Mon-Fri, Evenings"
  },
  {
    id: 3,
    name: "Jordan Lee",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
    primarySkill: "Photography",
    rating: 4.7,
    bio: "Professional photographer specializing in portraits and landscapes.",
    skillsHave: ["Portrait", "Lightroom", "Composition", "Studio Lighting"],
    skillsWant: ["Video Editing", "Color Grading"],
    community: "Design",
    availability: "Flexible Schedule"
  },
  {
    id: 4,
    name: "Sam Taylor",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
    primarySkill: "Music Production",
    rating: 4.6,
    bio: "Producer and sound engineer helping others create their sound.",
    skillsHave: ["Ableton", "Mixing", "Sound Design", "Music Theory"],
    skillsWant: ["Mastering", "Live Performance"],
    community: "Business",
    availability: "Tue/Thu Evenings"
  },
  {
    id: 5,
    name: "Riley Morgan",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Riley",
    primarySkill: "Writing",
    rating: 4.8,
    bio: "Author and content creator teaching storytelling and copywriting.",
    skillsHave: ["Creative Writing", "Copywriting", "Editing", "SEO"],
    skillsWant: ["Script Writing", "Podcasting"],
    community: "Business",
    availability: "Mon-Wed, Mornings"
  },
  {
    id: 6,
    name: "Casey Kim",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Casey",
    primarySkill: "Video Editing",
    rating: 4.9,
    bio: "Video editor with 5+ years experience in narrative storytelling.",
    skillsHave: ["Premiere Pro", "After Effects", "Color Grading", "Motion Graphics"],
    skillsWant: ["Sound Design", "3D Animation"],
    community: "IT",
    availability: "Weekends"
  }
];

const HomePage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

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


  const handleSendRequest = () => {
    toast({
      title: "Request Sent! 🎉",
      description: `Your skill swap request has been sent to ${selectedUser?.name}`,
    });
    setShowRequestModal(false);
  };

  const allCommunities = ["All", ...Array.from(new Set(mockUsers.map(u => u.community)))];
  const allSkillsHave = ["All", ...Array.from(new Set(mockUsers.flatMap(u => u.skillsHave)))];
  const allSkillsWant = ["All", ...Array.from(new Set(mockUsers.flatMap(u => u.skillsWant)))];

  const filteredUsers = mockUsers.filter(user => {
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map(user => (
              <UserCard
                key={user.id}
                user={user}
                onViewProfile={() => setSelectedUser(user)}
              />
            ))}
          </div>
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
