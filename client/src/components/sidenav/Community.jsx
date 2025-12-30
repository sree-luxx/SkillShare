import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { communityAPI } from "../../utils/api";

const Communities = () => {
  const navigate = useNavigate();

  const [communities, setCommunities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [form, setForm] = useState({
    communityName: "",
    primarySkill: "",
    description: "",
    purpose: "",
    visibility: "",
    guidelines: "",
    status: "Active",
    bannerUrl: "",
    logoUrl: "",
    requiresJoinApproval: false,
    requiresPostApproval: false,
    tagsText: "",
  });

  const SKILLS = [
    "Web Development",
    "Design",
    "Data Science",
    "Machine Learning",
    "Business",
    "Cloud",
    "Cybersecurity",
    "Mobile",
    "DevOps",
  ];

  useEffect(() => {
    const loadCommunities = async () => {
      try {
        const data = await communityAPI.listCommunities();
        setCommunities(
          data.map((c) => ({
            id: c._id,
            name: c.communityName,
            image: c.bannerUrl || "/images/it.jpg",
            description: c.description,
            members: 0,
          }))
        );
      } catch {
        setCommunities([]);
      }
    };
    loadCommunities();
  }, []);

  const handleFileToBase64 = (file, cb) => {
    const reader = new FileReader();
    reader.onloadend = () => cb(reader.result);
    reader.readAsDataURL(file);
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileToBase64(file, (base64) => setForm({ ...form, bannerUrl: base64 }));
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileToBase64(file, (base64) => setForm({ ...form, logoUrl: base64 }));
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Communities</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-full bg-[#fda4b8] text-white font-semibold shadow hover:shadow-lg transition"
        >
          Create Community
        </button>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {communities.map((community) => (
          <div
            key={community.name}
            onClick={() => navigate(`/links/community/${community.name}`)}
            className="cursor-pointer bg-white rounded-xl shadow-lg overflow-hidden border border-[#ffd2dd] hover:shadow-xl transition"
          >
            {/* Community Image */}
            <img
              src={community.image}
              alt={community.name}
              className="h-32 w-full object-cover"
            />

            <div className="p-4">
              <div className="flex items-start justify-between">
                <h2 className="text-xl font-semibold">{community.name}</h2>
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpenId(menuOpenId === community.id ? null : community.id);
                    }}
                    className="px-2 py-1 rounded-full hover:bg-[#fff0f4] border border-[#ffd2dd] text-[#c0264a]"
                    aria-label="More options"
                  >
                    ⋯
                  </button>
                  {menuOpenId === community.id && (
                    <div
                      className="absolute right-0 mt-2 w-40 bg-white border border-[#ffd2dd] rounded-xl shadow z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-[#fff0f4] text-[#c0264a]"
                        onClick={async () => {
                          const ok = window.confirm(`Delete community "${community.name}"?`);
                          if (!ok) return;
                          try {
                            await communityAPI.deleteCommunity(community.id);
                            setCommunities((prev) => prev.filter((c) => c.id !== community.id));
                            setMenuOpenId(null);
                          } catch {
                            setMenuOpenId(null);
                          }
                        }}
                      >
                        Delete community
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-gray-600 mt-1 line-clamp-2">{community.description}</p>

              <p className="text-xs text-gray-500 mt-3">
                {community.members} members
              </p>
            </div>
          </div>
        ))}
      </div>
      <Outlet />

      {/* Create Community Modal */}
      {showModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] animate-fade-in"
            onClick={() => setShowModal(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-[100] p-6 pointer-events-none">
            <div
              className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl border border-[#ffd2dd] pointer-events-auto overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 bg-[#fff0f4] border-b border-[#ffd2dd] -mx-6 -mt-6 px-6 py-4 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-[#c0264a]">Create Community</h3>
              </div>
              <div className="pt-4 -mx-6 px-6 max-h-[80vh] overflow-y-auto">
              {form.bannerUrl ? (
                <div className="mb-4 rounded-xl overflow-hidden border">
                  <img src={form.bannerUrl} alt="Banner" className="w-full h-32 object-cover" />
                </div>
              ) : (
                <div className="mb-4 h-32 rounded-xl bg-[#fff0f4] border border-[#ffd2dd] flex items-center justify-center text-[#c0264a]">
                  Add a banner like LinkedIn
                </div>
              )}
              <div className="flex items-center gap-3 mb-4">
                <label className="px-3 py-2 rounded-full border border-[#ffd2dd] bg-[#fff5f7] text-[#c0264a] font-semibold cursor-pointer">
                  Upload Banner
                  <input type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} />
                </label>
                <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden border">
                  {form.logoUrl ? (
                    <img src={form.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">Logo</div>
                  )}
                </div>
                <label className="px-3 py-2 rounded-full border border-[#ffd2dd] bg-[#fff5f7] text-[#c0264a] font-semibold cursor-pointer">
                  Upload Logo
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-medium">Community Name</label>
                  <input
                    className="w-full border rounded-lg px-3 py-2"
                    value={form.communityName}
                    onChange={(e) => setForm({ ...form, communityName: e.target.value })}
                    placeholder="e.g., React Learners Hub"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium">Primary Skill / Domain</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2"
                    value={form.primarySkill}
                    onChange={(e) => setForm({ ...form, primarySkill: e.target.value })}
                  >
                    <option value="">Select</option>
                    {SKILLS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="font-medium">Community Description</label>
                  <textarea
                    className="w-full border rounded-lg px-3 py-2 h-24 resize-none"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Purpose, audience, what members do here..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium">Community Purpose</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2"
                    value={form.purpose}
                    onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                  >
                    <option value="">Select</option>
                    <option>Learn</option>
                    <option>Teach</option>
                    <option>Learn & Teach</option>
                    <option>Collaborate</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-medium">Community Visibility</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2"
                    value={form.visibility}
                    onChange={(e) => setForm({ ...form, visibility: e.target.value })}
                  >
                    <option value="">Select</option>
                    <option>Public</option>
                    <option>Private</option>
                    <option>Request-based</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="font-medium">Community Rules / Guidelines</label>
                  <textarea
                    className="w-full border rounded-lg px-3 py-2 h-24 resize-none"
                    value={form.guidelines}
                    onChange={(e) => setForm({ ...form, guidelines: e.target.value })}
                    placeholder="Minimum acceptable behavior & usage rules"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium">Community Status</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-medium">Tags</label>
                  <input
                    className="w-full border rounded-lg px-3 py-2"
                    value={form.tagsText}
                    onChange={(e) => setForm({ ...form, tagsText: e.target.value })}
                    placeholder="e.g., react, beginners, mentoring"
                  />
                </div>
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.requiresJoinApproval}
                      onChange={(e) => setForm({ ...form, requiresJoinApproval: e.target.checked })}
                    />
                    <span className="text-sm">Require approval to join</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.requiresPostApproval}
                      onChange={(e) => setForm({ ...form, requiresPostApproval: e.target.checked })}
                    />
                    <span className="text-sm">Require approval to post</span>
                  </label>
                </div>
              </div>
              </div>
              <div className="mt-6 flex gap-2 sticky bottom-0 bg-white -mx-6 px-6 py-4 border-t border-[#ffd2dd]">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#ffd2dd] text-[#c0264a] hover:bg-[#fff0f4] transition"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (
                      !form.communityName ||
                      !form.primarySkill ||
                      !form.description ||
                      !form.purpose ||
                      !form.visibility ||
                      !form.guidelines
                    ) {
                      return;
                    }
                    try {
                      const payload = {
                        communityName: form.communityName,
                        primarySkill: form.primarySkill,
                        description: form.description,
                        purpose: form.purpose,
                        visibility: form.visibility,
                        guidelines: form.guidelines,
                        status: form.status,
                        bannerUrl: form.bannerUrl,
                        logoUrl: form.logoUrl,
                        requiresJoinApproval: form.requiresJoinApproval,
                        requiresPostApproval: form.requiresPostApproval,
                        tags: form.tagsText
                          .split(',')
                          .map((t) => t.trim())
                          .filter(Boolean),
                      };
                      await communityAPI.createCommunity(payload);
                      setShowModal(false);
                      const data = await communityAPI.listCommunities();
                      setCommunities(
                        data.map((c) => ({
                          id: c._id,
                          name: c.communityName,
                          image: c.bannerUrl || "/images/it.jpg",
                          description: c.description,
                          members: 0,
                        }))
                      );
                    } catch {
                      void 0;
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-[#f43f5e] text-white hover:bg-[#e11d48] transition"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Communities;
