import { useState } from "react";

const communities = ["IT", "Machine Learning", "Design", "Business", "Cloud", "Cybersecurity"];

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    avatar: "",
    name: "",
    email: "",
    bio: "",
    skillsHave: [],
    skillsWant: [],
    community: "",
  });

  const [tempAvatar, setTempAvatar] = useState(null);
  const [skillInputHave, setSkillInputHave] = useState("");
  const [skillInputWant, setSkillInputWant] = useState("");

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setTempAvatar(imageURL);
      setProfile({ ...profile, avatar: imageURL });
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

  const handleSubmit = () => {
    console.log("Profile Saved:", profile);
    alert("Profile Updated Successfully!");
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

  return (
    <div className="min-h-screen py-10 px-6 bg-secondary">
      <div className="max-w-3xl mx-auto bg-secondary-panel shadow-lg rounded-2xl p-8 space-y-8">
        <h1 className="text-3xl font-bold">Edit Profile</h1>

        {/* Profile Picture Upload */}
        <div className="flex items-center gap-6">
          <div className="w-28 h-28 rounded-full bg-gray-200 overflow-hidden">
            {tempAvatar ? (
              <img src={tempAvatar} alt="Avatar" className="w-full h-full object-cover" />
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

        {/* Save Button */}
        <button
          onClick={handleSubmit}
          className="mt-6 w-full btn-primary py-3 rounded-xl text-lg"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
