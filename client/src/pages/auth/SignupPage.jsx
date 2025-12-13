import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Upload, Sparkles } from "lucide-react";
import ParticlesBackground from "../../utils/ParticlesBackground";
import { useAuth } from "../../contexts/AuthContext";

const popularSkills = [
  "Web Development",
  "Graphic Design",
  "Photography",
  "Music Production",
  "Writing",
  "Video Editing",
  "Marketing",
  "Languages",
  "Cooking",
  "Yoga",
];

const Signup = () => {
  const navigate = useNavigate();
  const { signup, isAuthenticated } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
 useEffect(() => {
  if (isAuthenticated) {
    navigate("/home");
  }
}, [isAuthenticated, navigate]);

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const userData = {
      name,
      email,
      password,
      skills: selectedSkills,
      avatarUrl: "", // You can add avatar upload functionality later
    };

    const result = await signup(userData);
    
    if (result.success) {
      navigate("/home", { replace: true });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br from-amber-50 via-rose-50 to-purple-50">

      <div className="w-full max-w-md space-y-6 z-10">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-sm text-[#9a2240] px-4 py-2 rounded-full bg-white/70 border border-white/80 shadow-sm hover:shadow-md transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="glass rounded-3xl p-8 space-y-6 bg-white/85 backdrop-blur-xl border border-white/70 shadow-2xl">
          <div className="flex items-center justify-center gap-2 text-[#c0264a]">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Join Skill Share</span>
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-[#9a2240]">Create Account</h1>
            <p className="text-[#7a4450]">Start exchanging skills with the community.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-[#7a4450]">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-2xl h-12 px-4 border border-white/80 bg-white/80 shadow-inner focus:border-[#f84565] outline-none transition"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-[#7a4450]">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-2xl h-12 px-4 border border-white/80 bg-white/80 shadow-inner focus:border-[#f84565] outline-none transition"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-[#7a4450]">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-2xl h-12 px-4 border border-white/80 bg-white/80 shadow-inner focus:border-[#f84565] outline-none transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#7a4450]">Your Skills</label>
              <div className="flex flex-wrap gap-2">
                {popularSkills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    className={`px-4 py-1.5 rounded-full text-sm border transition ${
                      selectedSkills.includes(skill)
                        ? "bg-[#f84565] text-white border-[#f84565] shadow"
                        : "border-[#ffd2dd] text-[#c0264a] hover:bg-[#fff0f4]"
                    }`}
                    onClick={() => toggleSkill(skill)}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#7a4450]">Profile Picture</label>
              <div className="border-2 border-dashed border-[#ffd2dd] rounded-2xl p-6 text-center cursor-pointer hover:border-[#f84565] transition bg-white/70">
                <Upload className="w-8 h-8 mx-auto mb-2 text-[#c0264a]" />
                <p className="text-sm text-[#7a4450]">Click to upload</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full h-12 bg-gradient-to-r from-[#f84565] via-[#fb923c] to-[#fb7185] text-white font-semibold hover:opacity-90 transition-smooth shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-[#7a4450]">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-[#c0264a] font-semibold hover:underline"
            >
              Log In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
