import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Sparkles, Eye, EyeOff } from "lucide-react";
import ParticlesBackground from "../../utils/ParticlesBackground";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(email, password);
    setIsLoading(false);

    if (result?.success) {
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br from-amber-50 via-rose-50 to-purple-50">
      <div className="absolute inset-0 -z-10">
        <ParticlesBackground />
      </div>

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
            <span className="text-sm font-semibold">Skill Share</span>
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-[#9a2240]">Welcome Back!</h1>
            <p className="text-[#7a4450]">Log in to continue swapping skills.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
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
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-2xl h-12 px-4 border border-white/80 bg-white/80 shadow-inner focus:border-[#f84565] outline-none transition pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full h-12 bg-gradient-to-r from-[#f84565] via-[#fb923c] to-[#fb7185] text-white font-semibold hover:opacity-90 transition-smooth shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <p className="text-center text-sm text-[#7a4450]">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-[#c0264a] font-semibold hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;