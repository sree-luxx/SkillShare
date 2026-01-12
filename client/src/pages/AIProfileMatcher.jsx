import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Title from "../components/Title";
import UserCard from "../components/UserCard";
import ProfilePanel from "../components/ProfilePanel";
import { matchAPI } from "../utils/api";
import { Sparkles, Brain, Calculator, Database, ChevronDown, ChevronUp } from "lucide-react";

const AIProfileMatcher = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const data = await matchAPI.getMatches();
        setMatches(
          data.map((m) => ({
            id: m._id,
            name: m.name,
            avatar: m.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name}`,
            bio: m.bio,
            primarySkill: m.skillsHave?.[0] || "General",
            rating: 5.0, // Default rating
            community: m.community,
            matchScore: Math.round(m.matchScore * 100), // Convert to percentage
            skillsHave: m.skillsHave,
            interests: m.interests
          }))
        );
      } catch (error) {
        console.error("Failed to fetch matches", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Title />
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-5xl font-bold text-[#c0264a] flex items-center gap-3">
                  <img 
                    src="https://api.dicebear.com/7.x/bottts/svg?seed=AiMatch" 
                    alt="AI Bot" 
                    className="w-14 h-14"
                  />
                  AI Profile Matcher
                </h1>
                <p className="text-[#7a4450] mt-3 text-xl">
                  Discover peers with similar interests and complementary skills using AI.
                </p>
              </div>
              
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-sm text-[#f43f5e] font-semibold text-lg border border-[#ffd2dd] hover:bg-[#fff0f4] transition-colors"
              >
                <Brain className="w-5 h-5" />
                How it works
                {showExplanation ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            {/* AI Explanation Card */}
            {showExplanation && (
              <div className="bg-white rounded-2xl p-8 shadow-md border border-[#ffd2dd] animate-fade-in">
                <h3 className="text-xl font-bold text-[#c0264a] mb-6">Behind the Scenes: Vector Similarity</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[#f43f5e] font-semibold text-lg">
                      <Database className="w-6 h-6" />
                      1. Data Collection
                    </div>
                    <p className="text-base text-gray-600 leading-relaxed">
                      We aggregate your <strong>Bio</strong>, <strong>Skills</strong>, and <strong>Interests</strong> into a semantic text profile.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[#f43f5e] font-semibold text-lg">
                      <Calculator className="w-6 h-6" />
                      2. Vectorization
                    </div>
                    <p className="text-base text-gray-600 leading-relaxed">
                      Using NLP (Natural Language Processing), we convert this text into a <strong>mathematical vector</strong> based on keyword frequency and importance.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[#f43f5e] font-semibold text-lg">
                      <Brain className="w-6 h-6" />
                      3. Cosine Similarity
                    </div>
                    <p className="text-base text-gray-600 leading-relaxed">
                      We calculate the angle between your vector and others. A smaller angle means a <strong>higher match score</strong> (closer interests).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Results Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-[#f43f5e]"></div>
              </div>
            ) : matches.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-[#ffd2dd]">
                <p className="text-[#7a4450] text-xl">No matches found yet. Try updating your profile with more skills and interests!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {matches.map((user) => (
                  <div key={user.id} className="relative group">
                    {/* Match Badge */}
                    <div className="absolute -top-4 -right-4 z-10 bg-white p-1.5 rounded-full shadow-md">
                      <div className={`
                        flex flex-col items-center justify-center w-16 h-16 rounded-full text-white font-bold text-base shadow-inner
                        ${user.matchScore >= 80 ? 'bg-gradient-to-br from-green-400 to-emerald-600' : 
                          user.matchScore >= 50 ? 'bg-gradient-to-br from-blue-400 to-indigo-600' : 
                          'bg-gradient-to-br from-orange-400 to-red-500'}
                      `}>
                        <span>{user.matchScore}%</span>
                        <span className="text-[10px] font-normal opacity-90">MATCH</span>
                      </div>
                    </div>

                    <UserCard
                      user={user}
                      onViewProfile={() => setSelectedUser(user)}
                      footerContent={
                        <div className="flex flex-wrap gap-2 mt-3">
                          {user.interests && user.interests.slice(0, 3).map((interest, idx) => (
                            <span key={idx} className="text-sm bg-[#fff0f4] text-[#c0264a] px-3 py-1.5 rounded-md font-medium">
                              {interest}
                            </span>
                          ))}
                        </div>
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <ProfilePanel
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onRequestSwap={() => setSelectedUser(null)}
      />
    </div>
  );
};

export default AIProfileMatcher;
