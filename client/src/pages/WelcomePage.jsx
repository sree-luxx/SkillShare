import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Users, Zap } from "lucide-react";
import ParticlesBackground from "../utils/ParticlesBackground";  

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden ">

      <div className="absolute inset-0 -z-10">
        <ParticlesBackground />
      </div>

      <div className="max-w-2xl w-full text-center space-y-8 relative z-10 ">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-0  text-[#df5c1a] text-5xl md:text-7xl font-bold mb-2">
            <img src="logo.png" alt="" className='w-20 h-20'/>
            <h1 className='m-0'>kill Share</h1>
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground font-light">
            Exchange Skills. Empower Each Other.
          </p>
        </div>

        <div className="glass rounded-3xl p-8 md:p-12 space-y-6">
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-gradient-warm rounded-2xl flex items-center justify-center mx-auto">
                <Users className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium">Connect</p>
            </div>

            <div className="space-y-2">
              <div className="w-12 h-12 bg-gradient-warm rounded-2xl flex items-center justify-center mx-auto">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium">Exchange</p>
            </div>

            <div className="space-y-2">
              <div className="w-12 h-12 bg-gradient-warm rounded-2xl flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium">Grow</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/login")}
              className="rounded-full text-lg px-8 h-14 border-2 hover:scale-105 transition-smooth"
            >
              Log In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="rounded-full text-lg px-8 h-14 bg-gradient-warm hover:opacity-90 hover:scale-105 transition-smooth shadow-lg"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default WelcomePage;
