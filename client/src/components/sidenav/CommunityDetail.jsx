import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { communityAPI, communityPostsAPI } from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";
import { ThumbsUp, Heart, PartyPopper, Lightbulb, Laugh } from "lucide-react";

const CommunityDetail = () => {
  const { name } = useParams();
  const { isAuthenticated, user } = useAuth();

  const [community, setCommunity] = useState(null);
  const [requiresPostApproval, setRequiresPostApproval] = useState(false);
  const [posts, setPosts] = useState([]);
  const [commentDrafts, setCommentDrafts] = useState({});
  const [pickerFor, setPickerFor] = useState(null);
  const [reactingPostId, setReactingPostId] = useState(null);
  useEffect(() => {
    const load = async () => {
      try {
        const found = await communityAPI.getCommunityByName(name);
        if (found && found.communityName) {
          setCommunity({
            name: found.communityName,
            image: found.bannerUrl || "/images/it.jpg",
            description: found.description || "",
            members: 0,
          });
          setRequiresPostApproval(Boolean(found.requiresPostApproval));
          const isOwner = user && String(found.createdBy) === String(user.id);
          const isModerator = user && Array.isArray(found.moderators) && found.moderators.some((m) => String(m) === String(user.id));
          setJoined(Boolean(isOwner || isModerator));
          const feed = await communityPostsAPI.getPosts(found.communityName);
          setPosts(feed.map(p => ({ ...p, showCommentBox: false })));
        } else {
          setCommunity(null);
        }
      } catch {
        setCommunity(null);
      }
    };
    load();
  }, [name]);

  const [joined, setJoined] = useState(false);
  const [membersCount, setMembersCount] = useState(0);
  const [newPostText, setNewPostText] = useState("");
  const [newPostImage, setNewPostImage] = useState(null);

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

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handlePostSubmit = async () => {
    if (!isAuthenticated) return;
    if (!newPostText.trim() && !newPostImage) return;
    let imageUrl = "";
    if (newPostImage) {
      imageUrl = await toBase64(newPostImage);
    }
    const created = await communityPostsAPI.createPost({
      communityName: community.name,
      content: newPostText.trim(),
      imageUrl
    });
    setPosts(prev => [{ ...created, showCommentBox: false }, ...prev]);
    setNewPostText("");
    setNewPostImage(null);
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    setNewPostImage(file || null);
  };

  const handleReact = async (postId, type) => {
    if (reactingPostId === postId) return;
    setReactingPostId(postId);
    const res = await communityPostsAPI.react(postId, type);
    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p;
        const next = { ...p, reactions: res.reactions };
        next.myReaction = p.myReaction === type ? null : type;
        return next;
      })
    );
    setPickerFor(null);
    setReactingPostId(null);
  };

  const submitComment = async (postId) => {
    const text = (commentDrafts[postId] || "").trim();
    if (!text) return;
    const created = await communityPostsAPI.addComment(postId, { text });
    setPosts(prev =>
      prev.map(p => (p.id === postId ? { ...p, comments: [...(p.comments || []), created], showCommentBox: false } : p))
    );
    setCommentDrafts(prev => ({ ...prev, [postId]: "" }));
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
              src={user?.avatarUrl || "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&q=80&sat=-20"}
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
                {requiresPostApproval && (
                  <span className="text-xs text-gray-500">
                    Posts may require moderator approval
                  </span>
                )}
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
                  src={post.author?.avatarUrl || ""}
                  alt={post.author?.name || ""}
                  className="w-11 h-11 rounded-full object-cover border"
                />
                <div>
                  <p className="font-semibold text-gray-900">{post.author?.name || ""}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
                  </p>
                </div>
              </div>
              <p className="text-gray-800 leading-relaxed">{post.content}</p>
              {post.status === "pending" && (
                <span className="inline-block text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                  Pending approval
                </span>
              )}
              {post.imageUrl && (
                <div className="rounded-xl overflow-hidden border">
                  <img src={post.imageUrl} alt="post visual" className="w-full object-cover max-h-96" />
                </div>
              )}
              <div className="flex gap-4 text-sm text-gray-600 pt-1 relative">
                <div>
                  <button
                    className={`px-3 py-1 rounded-full border border-[#ffd2dd] ${post.myReaction ? "bg-[#fff0f4] text-[#c0264a]" : ""}`}
                    disabled={post.status === "pending"}
                    onClick={() => setPickerFor(pickerFor === post.id ? null : post.id)}
                  >
                    {post.myReaction ? post.myReaction : "React"}
                  </button>
                  {pickerFor === post.id && (
                    <div
                      className="absolute z-10 mt-2 p-2 rounded-2xl bg-white border border-[#ffd2dd] shadow flex gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-[#fff0f4] text-[#c0264a] border border-transparent"
                        onClick={() => handleReact(post.id, "like")}
                        disabled={reactingPostId === post.id}
                      >
                        <ThumbsUp size={18} /> Like
                      </button>
                      <button
                        className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-[#fff0f4] text-[#c0264a] border border-transparent"
                        onClick={() => handleReact(post.id, "love")}
                        disabled={reactingPostId === post.id}
                      >
                        <Heart size={18} /> Love
                      </button>
                      <button
                        className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-[#fff0f4] text-[#c0264a] border border-transparent"
                        onClick={() => handleReact(post.id, "celebrate")}
                        disabled={reactingPostId === post.id}
                      >
                        <PartyPopper size={18} /> Celebrate
                      </button>
                      <button
                        className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-[#fff0f4] text-[#c0264a] border border-transparent"
                        onClick={() => handleReact(post.id, "insightful")}
                        disabled={reactingPostId === post.id}
                      >
                        <Lightbulb size={18} /> Insightful
                      </button>
                      <button
                        className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-[#fff0f4] text-[#c0264a] border border-transparent"
                        onClick={() => handleReact(post.id, "funny")}
                        disabled={reactingPostId === post.id}
                      >
                        <Laugh size={18} /> Funny
                      </button>
                    </div>
                  )}
                </div>
                <button
                  className="px-3 py-1 rounded-full border border-[#ffd2dd]"
                  onClick={() => setPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, showCommentBox: !p.showCommentBox } : p))}
                >
                  💬 Comment
                </button>
              </div>
              <div className="flex gap-6 text-sm text-gray-500">
                <span className="inline-flex items-center gap-1"><ThumbsUp size={16} /> {post.reactions?.like || 0}</span>
                <span className="inline-flex items-center gap-1"><Heart size={16} /> {post.reactions?.love || 0}</span>
                <span className="inline-flex items-center gap-1"><PartyPopper size={16} /> {post.reactions?.celebrate || 0}</span>
                <span className="inline-flex items-center gap-1"><Lightbulb size={16} /> {post.reactions?.insightful || 0}</span>
                <span className="inline-flex items-center gap-1"><Laugh size={16} /> {post.reactions?.funny || 0}</span>
                <span>💬 {(post.comments || []).length}</span>
              </div>
              {post.showCommentBox && (
                <div className="mt-2">
                  <div className="flex gap-2">
                    <input
                      className="flex-1 border rounded-lg px-3 py-2"
                      placeholder="Write a comment..."
                      value={commentDrafts[post.id] || ""}
                      onChange={(e) => setCommentDrafts(prev => ({ ...prev, [post.id]: e.target.value }))}
                    />
                    <button className="px-4 py-2 rounded-full bg-[#fda4b8] text-white" onClick={() => submitComment(post.id)}>Post</button>
                    <button className="px-4 py-2 rounded-full border border-[#ffd2dd]" onClick={() => setPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, showCommentBox: false } : p))}>Hide</button>
                  </div>
                </div>
              )}
              {(post.comments || []).length > 0 && (
                <div className="mt-2 space-y-2">
                  {post.comments.map((c) => (
                    <div key={c.id} className="flex items-start gap-2">
                      <img src={c.author?.avatarUrl || ""} alt={c.author?.name || ""} className="w-6 h-6 rounded-full object-cover border" />
                      <div className="bg-[#fff5f7] border border-[#ffd2dd] rounded-xl px-3 py-2">
                        <p className="text-sm font-semibold text-[#c0264a]">{c.author?.name || ""}</p>
                        <p className="text-sm text-gray-700">{c.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityDetail;
