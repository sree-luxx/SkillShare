import { Edit } from "lucide-react";

const ProfilePopup = ({ onEdit, onLogout }) => {
  return (
    <div className="absolute right-4 top-14 bg-white shadow-lg rounded-xl p-4 w-48 flex flex-col gap-3 z-50">
      <button
        onClick={onEdit}
        className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg"
      >
        <Edit className="w-4 h-4" />
        <span>Edit Profile</span>
      </button>

      <button
        onClick={onLogout}
        className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
      >
        Log Out
      </button>
    </div>
  );
};

export default ProfilePopup;
