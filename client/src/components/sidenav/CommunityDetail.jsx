import { useParams } from "react-router-dom";
import { useState } from "react";

const CommunityDetail = () => {
  const { name } = useParams();

  const allCommunities = [
    {
      name: "IT",
      image: "/images/it.jpg",
      description: "A community for tech enthusiasts.",
      members: 1200,
    },
    {
      name: "Machine Learning",
      image: "/images/ml.jpg",
      description: "Learn ML, AI and build models.",
      members: 980,
    },
    {
      name: "Design",
      image: "/images/design.jpg",
      description: "UI/UX and product design.",
      members: 760,
    },
    {
      name: "Business",
      image: "/images/business.jpg",
      description: "Startup, business knowledge, leadership.",
      members: 540,
    },
  ];

  const community = allCommunities.find((c) => c.name === name);

  const [joined, setJoined] = useState(false);
  const [membersCount, setMembersCount] = useState(community?.members || 0);
  const [newPostText, setNewPostText] = useState("");
  const [newPostImage, setNewPostImage] = useState(null);
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Alex Johnson",
      headline: "Full Stack Engineer",
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&q=80",
      timeAgo: "2h",
      content:
        "Just wrapped up a knowledge-sharing session on modern API design. Slides are in the community files—happy to answer questions!",
      image:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80",
      likes: 48,
      comments: 12,
      reposts: 3,
    },
    {
      id: 2,
      author: "Priya Desai",
      headline: "Product Designer",
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&q=80&sat=-40",
      timeAgo: "5h",
      content:
        "Quick tip: add accessibility acceptance criteria to every story. It keeps teams honest and users happy.",
      image: null,
      likes: 36,
      comments: 9,
      reposts: 1,
    },
  ]);

  if (!community) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        Community not found.
      </div>
    );
  }

  const handleJoin = () => {
    if (!joined) {
      setJoined(true);
      setMembersCount((prev) => prev + 1);
    }
  };

  const handlePostSubmit = () => {
    if (!joined) return;
    if (!newPostText.trim() && !newPostImage) return;

    const imageUrl = newPostImage ? URL.createObjectURL(newPostImage) : null;
    const newEntry = {
      id: Date.now(),
      author: "You",
      headline: "Community Member",
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&q=80&sat=-20",
      timeAgo: "Just now",
      content: newPostText.trim(),
      image: imageUrl,
      likes: 0,
      comments: 0,
      reposts: 0,
    };

    setPosts((prev) => [newEntry, ...prev]);
    setNewPostText("");
    setNewPostImage(null);
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    setNewPostImage(file || null);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      {/* Banner */}
      <div className="relative h-48 w-full overflow-hidden">
        <img src={community.image} alt={community.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/20" />
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-3xl font-bold drop-shadow-md">{community.name}</h1>
          <p className="text-sm opacity-90">{community.description}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Header card */}
        <div className="bg-white rounded-xl shadow border border-[#ffd2dd] p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-lg font-semibold text-gray-800">{community.name} Community</p>
            <p className="text-sm text-gray-500 mt-1">{membersCount} members</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleJoin}
              className={`px-5 py-2 rounded-full font-semibold transition ${
                joined
                  ? "bg-white border border-[#fda4b8] text-[#c0264a]"
                  : "bg-[#fda4b8] text-white shadow-md hover:shadow-lg"
              }`}
            >
              {joined ? "Joined" : "Join"}
            </button>
          </div>
        </div>

        {/* Composer */}
        <div className="bg-white rounded-xl shadow border border-[#ffd2dd] p-4 relative">
          {!joined && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center text-center px-6">
              <p className="text-gray-700 font-semibold">Join to start a conversation</p>
              <p className="text-sm text-gray-500 mt-1">
                You need to join this community before you can post.
              </p>
              <button
                onClick={handleJoin}
                className="mt-3 px-4 py-2 rounded-full bg-[#fda4b8] text-white font-semibold shadow"
              >
                Join now
              </button>
            </div>
          )}

          <div className="flex gap-3">
            <img
              src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&q=80&sat=-20"
              alt="avatar"
              className="w-12 h-12 rounded-full object-cover border"
            />
            <div className="flex-1 space-y-3">
              <textarea
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                disabled={!joined}
                className="w-full border rounded-xl px-4 py-3 resize-none h-28 focus:outline-none focus:ring-2 focus:ring-[#fda4b8] disabled:bg-gray-100"
                placeholder="Start a post..."
              />
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <label className="inline-flex items-center gap-2 text-[#c0264a] font-semibold cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={!joined}
                    onChange={handleImageChange}
                  />
                  <span className="px-3 py-2 rounded-full border border-[#ffd2dd] bg-[#fff5f7]">
                    + Add image
                  </span>
                </label>
                <button
                  onClick={handlePostSubmit}
                  disabled={!joined}
                  className={`px-5 py-2 rounded-full font-semibold transition ${
                    joined
                      ? "bg-[#fda4b8] text-white shadow hover:shadow-lg"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Post
                </button>
              </div>
              {newPostImage && (
                <div className="border rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(newPostImage)}
                    alt="preview"
                    className="w-full max-h-64 object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Feed */}
        <div className="space-y-4">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl shadow border border-[#ffd2dd] p-4 space-y-3"
            >
              <div className="flex items-start gap-3">
                <img
                  src={post.avatar}
                  alt={post.author}
                  className="w-11 h-11 rounded-full object-cover border"
                />
                <div>
                  <p className="font-semibold text-gray-900">{post.author}</p>
                  <p className="text-sm text-gray-500">{post.headline}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{post.timeAgo}</p>
                </div>
              </div>
              <p className="text-gray-800 leading-relaxed">{post.content}</p>
              {post.image && (
                <div className="rounded-xl overflow-hidden border">
                  <img src={post.image} alt="post visual" className="w-full object-cover max-h-96" />
                </div>
              )}
              <div className="flex gap-6 text-sm text-gray-500 pt-1">
                <span>👍 {post.likes}</span>
                <span>💬 {post.comments}</span>
                <span>🔁 {post.reposts}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityDetail;
