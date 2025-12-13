
import { X, Star, Clock } from "lucide-react";

const ProfilePanel = ({ user, onClose, onRequestSwap }) => {
  if (!user) return null;

  const skillsHave = user.skillsHave || user.skills || [];
  const skillsWant = user.skillsWant || [];

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-rose-50 to-purple-50" />
      <div
        className="absolute inset-0 bg-black/25 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      <div className="relative z-10 h-full w-full flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-5xl h-full sm:h-[90vh] bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 flex flex-col overflow-hidden">
          <header className="flex items-center justify-between p-6 border-b border-white/60">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#c0264a]">
                Profile Overview
              </p>
              <h2 className="text-3xl font-bold text-[#9a2240]">{user.name}</h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-black/5 transition"
              aria-label="Close profile"
            >
              <X className="w-5 h-5" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-6 md:p-8 grid gap-8 lg:grid-cols-[1.1fr,1fr]">
            <div className="bg-white/60 rounded-2xl p-6 border border-white/70 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg ring-4 ring-[#ffe0e9]">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-3 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <div className="flex items-center gap-1 text-[#c0264a] font-semibold">
                      <Star className="w-5 h-5 fill-[#f43f5e] text-[#f43f5e]" />
                      <span className="text-lg">{user.rating}</span>
                    </div>
                    {user.primarySkill && (
                      <span className="px-3 py-1 rounded-full bg-[#ffd9e1] text-[#c0264a] text-sm font-medium">
                        {user.primarySkill}
                      </span>
                    )}
                  </div>
                  <p className="text-[#7a4450] leading-relaxed">{user.bio}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-white/80 rounded-xl p-4 border border-white/70">
                  <p className="text-xs uppercase tracking-wide text-[#c94b63] mb-2">
                    Availability
                  </p>
                  <div className="flex items-center gap-2 text-[#7a4450]">
                    <Clock className="w-5 h-5 text-[#f43f5e]" />
                    <span>{user.availability || "Flexible"}</span>
                  </div>
                </div>

                {user.community && (
                  <div className="bg-white/80 rounded-xl p-4 border border-white/70">
                    <p className="text-xs uppercase tracking-wide text-[#c94b63] mb-2">
                      Community
                    </p>
                    <span className="px-3 py-1 rounded-full bg-[#fff0f4] text-[#c0264a] font-semibold">
                      {user.community}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white/70 rounded-2xl p-6 border border-white/70 shadow-sm">
                <p className="text-xs uppercase tracking-[0.15em] text-[#c94b63] mb-3">
                  Skills they have
                </p>
                <div className="flex flex-wrap gap-2">
                  {skillsHave.length ? (
                    skillsHave.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 rounded-full bg-[#ffd9e1] text-[#9a2240] text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-[#7a4450]">No skills listed</p>
                  )}
                </div>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-white/70 shadow-sm">
                <p className="text-xs uppercase tracking-[0.15em] text-[#c94b63] mb-3">
                  Looking to learn
                </p>
                <div className="flex flex-wrap gap-2">
                  {skillsWant.length ? (
                    skillsWant.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 rounded-full bg-white text-[#c0264a] border border-[#ffd2dd] text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-[#7a4450]">No interests added</p>
                  )}
                </div>
              </div>

              <div className="bg-[#fff3f7] border border-[#ffd9e1] rounded-2xl p-6 shadow-sm">
                <p className="text-sm text-[#7a4450]">
                  Ready to swap skills? Send a personalized request and share how you
                  can help {user.name.split(" ")[0]} grow.
                </p>
              </div>
            </div>
          </div>

          <footer className="p-6 border-t border-white/60 bg-white/70">
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
              <div className="text-sm text-[#7a4450]">
                Tap outside or hit close to return to your list.
              </div>
              <button
                onClick={onRequestSwap}
                className="w-full sm:w-auto px-6 rounded-full h-12 bg-gradient-to-r from-[#f84565] via-[#fb923c] to-[#fb7185] text-white font-semibold shadow-lg hover:opacity-90 transition-smooth"
              >
                Request Skill Swap
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;
