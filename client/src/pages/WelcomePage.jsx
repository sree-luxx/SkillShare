import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Users, Zap, Brain, Rocket, Globe } from "lucide-react";
import ParticlesBackground from "../utils/ParticlesBackground";  

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br from-[#fff0f4] via-[#ffe6ec] to-[#ffe9ef]">

      <div className="absolute inset-0 -z-10 opacity-60">
        <ParticlesBackground />
        
        {/* Floating Background Shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#ffd1dc] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-32 h-32 bg-[#ffb7c5] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-32 h-32 bg-[#ffc1cc] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-4xl w-full text-center space-y-10 relative z-10">
        {/* Hero Section */}
        <div className="space-y-6 animate-fade-in-up">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#f43f5e] to-[#ff8fa3] rounded-full opacity-20 blur-xl animate-pulse"></div>
              <img src="logo.png" alt="SkillShare Logo" className="w-24 h-24 relative z-10 drop-shadow-lg" />
            </div>
            <h1 className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#c0264a] to-[#f43f5e] tracking-tight">
              SkillShare
            </h1>
          </div>
          <p className="text-xl md:text-3xl text-[#7a4450] font-light max-w-2xl mx-auto leading-relaxed">
            Exchange Skills. <span className="font-medium text-[#f43f5e]">Empower Each Other.</span> <br/>
            Join the community of lifelong learners.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8 px-4">
          <div className="group bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-[#ffd2dd] hover:scale-105 hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-[#fff0f4] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#f43f5e] transition-colors duration-300">
              <Users className="w-8 h-8 text-[#f43f5e] group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-2xl font-bold text-[#c0264a] mb-2">Connect</h3>
            <p className="text-[#7a4450] text-base">Find peers who share your passion and professional interests.</p>
          </div>

          <div className="group bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-[#ffd2dd] hover:scale-105 hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-[#fff0f4] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#f43f5e] transition-colors duration-300">
              <Brain className="w-8 h-8 text-[#f43f5e] group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-2xl font-bold text-[#c0264a] mb-2">AI Match</h3>
            <p className="text-[#7a4450] text-base">Let our AI find the perfect skill partners based on your profile.</p>
          </div>

          <div className="group bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-[#ffd2dd] hover:scale-105 hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-[#fff0f4] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#f43f5e] transition-colors duration-300">
              <Rocket className="w-8 h-8 text-[#f43f5e] group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-2xl font-bold text-[#c0264a] mb-2">Grow</h3>
            <p className="text-[#7a4450] text-base">Level up your career by teaching others and learning new skills.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up delay-200">
          <button
            onClick={() => navigate("/login")}
            className="w-full sm:w-auto min-w-[160px] rounded-full text-lg font-semibold px-8 py-4 border-2 border-[#f43f5e] text-[#f43f5e] hover:bg-[#fff0f4] transition-all duration-300 shadow-sm hover:shadow-md"
          >
            Log In
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="w-full sm:w-auto min-w-[160px] rounded-full text-lg font-bold px-8 py-4 bg-gradient-to-r from-[#f43f5e] to-[#ff6b81] text-white hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl ring-4 ring-[#f43f5e]/20"
          >
            Get Started
          </button>
        </div>
      </div>

    </div>
  );
};

export default WelcomePage;
