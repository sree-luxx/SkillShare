import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { profileAPI } from "../utils/api";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

const communities = ["IT", "Machine Learning", "Design", "Business", "Cloud", "Cybersecurity"];

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({
    avatarUrl: "",
    name: "",
    email: "",
    bio: "",
    skillsHave: [],
    skillsWant: [],
    community: "",
    availabilitySlots: []
  });

  const [tempAvatar, setTempAvatar] = useState(null);
  const [skillInputHave, setSkillInputHave] = useState("");
  const [skillInputWant, setSkillInputWant] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Load profile data on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const profileData = await profileAPI.getProfile();
        setProfile({
          avatarUrl: profileData.avatarUrl || "",
          name: profileData.name || "",
          email: profileData.email || user?.email || "",
          bio: profileData.bio || "",
          skillsHave: profileData.skillsHave || [],
          skillsWant: profileData.skillsWant || [],
          community: profileData.community || "",
          availabilitySlots: profileData.availabilitySlots || []
        });
        if (profileData.avatarUrl) {
          setTempAvatar(profileData.avatarUrl);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
        // If API fails (e.g., server not running), use user data from context/localStorage
        if (user) {
          setProfile({
            avatarUrl: user.avatarUrl || "",
            name: user.name || "",
            email: user.email || "",
            bio: user.bio || "",
            skillsHave: user.skillsHave || [],
            skillsWant: user.skillsWant || [],
            community: user.community || "",
            availabilitySlots: user.availabilitySlots || []
          });
          if (user.avatarUrl) {
            setTempAvatar(user.avatarUrl);
          }
          // Only show error toast if it's not a connection error (user might be offline)
          if (!error.message.includes('connect to server')) {
            toast.error("Failed to load profile from server. Using cached data.");
          }
        } else {
          toast.error("Please log in to view your profile.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // For now, we'll convert to base64. In production, you'd upload to a file storage service
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setTempAvatar(base64String);
        setProfile({ ...profile, avatarUrl: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSkillHave = () => {
    if (skillInputHave.trim() !== "") {
      setProfile({
        ...profile,
        skillsHave: [...profile.skillsHave, skillInputHave.trim()],
      });
      setSkillInputHave("");
    }
  };

  const handleAddSkillWant = () => {
    if (skillInputWant.trim() !== "") {
      setProfile({
        ...profile,
        skillsWant: [...profile.skillsWant, skillInputWant.trim()],
      });
      setSkillInputWant("");
    }
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      const updatedProfile = await profileAPI.updateProfile({
        name: profile.name,
        email: profile.email,
        bio: profile.bio,
        avatarUrl: profile.avatarUrl,
        skillsHave: profile.skillsHave,
        skillsWant: profile.skillsWant,
        community: profile.community,
        availabilitySlots: profile.availabilitySlots
      });
      
      // Update user in context
      updateUser({
        ...user,
        ...updatedProfile,
      });
      
      // Show success modal instead of toast
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveSkillHave = (index) => {
    setProfile({
      ...profile,
      skillsHave: profile.skillsHave.filter((_, i) => i !== index),
    });
  };

  const handleRemoveSkillWant = (index) => {
    setProfile({
      ...profile,
      skillsWant: profile.skillsWant.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f84565] mx-auto"></div>
          <p className="mt-4 text-[#7a4450]">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-6 bg-secondary">
      <div className="max-w-3xl mx-auto bg-secondary-panel shadow-lg rounded-2xl p-8 space-y-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Go back to home"
          >
            <ArrowLeft className="w-5 h-5 text-[#c0264a]" />
          </button>
          <h1 className="text-3xl font-bold">Edit Profile</h1>
        </div>

        {/* Profile Picture Upload */}
        <div className="flex items-center gap-6">
          <div className="w-28 h-28 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
            {tempAvatar ? (
              <img src={tempAvatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : profile.email ? (
              <div className="w-full h-full flex items-center justify-center bg-[#f43f5e] text-white text-3xl font-bold">
                {profile.email.charAt(0).toUpperCase()}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-600">
                No Image
              </div>
            )}
          </div>

          <label className="cursor-pointer btn-primary px-4 py-2 rounded-lg">
            Upload Picture
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          </label>
        </div>

        {/* Name */}
        <div className="space-y-1">
          <label className="font-medium">Name</label>
          <input
            type="text"
            className="w-full border rounded-lg px-4 py-2"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            placeholder="Enter your full name"
          />
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="font-medium">Email ID</label>
          <input
            type="email"
            className="w-full border rounded-lg px-4 py-2"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            placeholder="your@email.com"
          />
        </div>

        {/* Bio */}
        <div className="space-y-1">
          <label className="font-medium">Bio</label>
          <textarea
            className="w-full border rounded-lg px-4 py-2 h-28 resize-none"
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            placeholder="Write something about yourself..."
          />
        </div>

        {/* Skills Have */}
        <div className="space-y-2">
          <label className="font-medium">Skills You Have</label>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 border rounded-lg px-4 py-2"
              placeholder="Add a skill you can teach"
              value={skillInputHave}
              onChange={(e) => setSkillInputHave(e.target.value)}
            />
            <button
              onClick={handleAddSkillHave}
              className="btn-primary px-4 py-2 rounded-lg"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {profile.skillsHave.map((skill, index) => (
              <span
                key={index}
                className="bg-primary-dull/10 text-primary-dull px-3 py-1 rounded-full flex items-center gap-2"
              >
                {skill}
                <button
                  onClick={() => handleRemoveSkillHave(index)}
                  className="text-primary hover:text-rose-600 font-semibold"
                  aria-label={`Remove ${skill}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Skills Want */}
        <div className="space-y-2">
          <label className="font-medium">Skills You Want to Learn</label>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 border rounded-lg px-4 py-2"
              placeholder="Add a skill you want to learn"
              value={skillInputWant}
              onChange={(e) => setSkillInputWant(e.target.value)}
            />
            <button
              onClick={handleAddSkillWant}
              className="btn-primary px-4 py-2 rounded-lg"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {profile.skillsWant.map((skill, index) => (
              <span
                key={index}
                className="bg-primary-dull/10 text-primary-dull px-3 py-1 rounded-full flex items-center gap-2"
              >
                {skill}
                <button
                  onClick={() => handleRemoveSkillWant(index)}
                  className="text-primary hover:text-rose-600 font-semibold"
                  aria-label={`Remove ${skill}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Community */}
        <div className="space-y-1">
          <label className="font-medium">Community You Want to Join</label>
          <select
            className="w-full border rounded-lg px-4 py-2"
            value={profile.community}
            onChange={(e) => setProfile({ ...profile, community: e.target.value })}
          >
            <option value="">Select a community</option>
            {communities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Availability Calendar */}
        <div className="space-y-2">
          <label className="font-medium">Available On</label>
          <div className="flex gap-2">
            <input
              type="datetime-local"
              className="flex-1 border rounded-lg px-4 py-2"
              onChange={(e) => {
                const value = e.target.value;
                e.target._pendingValue = value;
              }}
            />
            <button
              onClick={(e) => {
                const input = e.currentTarget.previousSibling;
                const value = input?._pendingValue;
                if (value) {
                  setProfile({
                    ...profile,
                    availabilitySlots: [...profile.availabilitySlots, value],
                  });
                  input.value = "";
                  input._pendingValue = "";
                }
              }}
              className="btn-primary px-4 py-2 rounded-lg"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.availabilitySlots.map((slot, index) => (
              <span
                key={`${slot}-${index}`}
                className="bg-primary-dull/10 text-primary-dull px-3 py-1 rounded-full flex items-center gap-2"
              >
                {new Date(slot).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                <button
                  onClick={() => {
                    setProfile({
                      ...profile,
                      availabilitySlots: profile.availabilitySlots.filter((_, i) => i !== index),
                    });
                  }}
                  className="text-primary hover:text-rose-600 font-semibold"
                  aria-label="Remove slot"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="mt-6 w-full btn-primary py-3 rounded-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] animate-fade-in"
            onClick={() => setShowSuccessModal(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-[100] p-6 pointer-events-none">
            <div 
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-scale-in pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Success Icon */}
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-800">
                  Profile Updated Successfully!
                </h2>

                {/* Message */}
                <p className="text-gray-600">
                  Your profile has been updated successfully!
                </p>

                {/* OK Button */}
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="mt-4 w-full bg-[#f43f5e] hover:bg-[#e11d48] text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
