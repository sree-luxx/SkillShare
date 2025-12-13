import { Star } from "lucide-react";

const UserCard = ({ user, onViewProfile, footerContent }) => {
  return (
    <div
      className="
        rounded-3xl p-6 space-y-5 cursor-pointer 
        bg-[linear-gradient(135deg,#fff0f4,#ffe6ec,#ffe9ef)]
        shadow-md border border-[#ffd2dd]
        hover:shadow-lg hover:scale-[1.02]
        transition-all duration-300
      "
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full overflow-hidden shadow">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* User Data */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate text-[#c0264a]">
            {user.name}
          </h3>

          <div className="flex items-center gap-1 text-sm text-[#c94b63]">
            <Star className="w-4 h-4 fill-[#f43f5e] text-[#f43f5e]" />
            <span>{user.rating}</span>
          </div>
        </div>
      </div>

      {/* Professional Skill Badge */}
      <div
        className="
          inline-block rounded-full 
          bg-[#ffd9e1] text-[#c0264a]
          px-3 py-1 text-sm font-medium
        "
      >
        {user.primarySkill}
      </div>

      {user.community && (
        <div className="text-sm text-[#7a4450] font-semibold">
          {user.community}
        </div>
      )}

      {/* Short Bio */}
      <p className="text-sm text-[#7a4450] leading-relaxed">
        {user.bio || "A dedicated learner who loves sharing skills and helping others grow."}
      </p>

      {/* CTA Button */}
      <button
        onClick={onViewProfile}
        className="
          w-full rounded-full p-2 mt-3 
          bg-[#f43f5e] 
          text-white font-semibold 
          transition-all duration-300
          hover:bg-[#e13354]
          shadow-md
        "
      >
        View Profile
      </button>

      {footerContent && <div className="pt-3">{footerContent}</div>}
    </div>
  );
};

export default UserCard;
