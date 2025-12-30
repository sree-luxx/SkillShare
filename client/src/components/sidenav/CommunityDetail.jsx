import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { communityAPI, communityPostsAPI } from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";
import { ThumbsUp, Heart, PartyPopper, Lightbulb, Smile, MessageSquare } from "lucide-react";

const CommunityDetail = () => {
  const { name } = useParams();
  const { user } = useAuth();

  const [community, setCommunity] = useState(null);
  const [requiresPostApproval, setRequiresPostApproval] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const load = async () => {
      try {
        const data = await communityAPI.listCommunities();
        const found = (data || []).find((c) => c.communityName === name);
        if (found) {
          setCommunity({
            name: found.communityName,
            image: found.bannerUrl || "/images/it.jpg",
            description: found.description || "",
            members: 0,
          });
          setRequiresPostApproval(Boolean(found.requiresPostApproval));
          const adminCheck =
            String(found.createdBy) === String(user?.id) ||
            (Array.isArray(found.moderators) && found.moderators.some((m) => String(m) === String(user?.id)));
          setIsAdmin(Boolean(adminCheck));
        } else {
          setCommunity(null);
        }
      } catch {
        setCommunity(null);
      }
    };
    load();
  }, [name, user]);

  const [joined, setJoined] = useState(false);
  const [membersCount, setMembersCount] = useState(0);
  const [newPostText, setNewPostText] = useState("");
  const [newPostImage, setNewPostImage] = useState(null);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await communityPostsAPI.listByCommunity(name);
        setPosts(
          (data || []).map((p) => ({
            id: p.id,
            authorName: p.author?.name || "Member",
            authorAvatar: p.author?.avatarUrl || "",
            timeAgo: "", // could format p.createdAt if needed
            content: p.content,
            image: p.imageUrl || null,
            reactions: p.reactions || { like: 0, love: 0, celebrate: 0, insightful: 0, funny: 0 },
            pending: false,
            showCommentBox: false,
            myReaction: null,
            showReactionPicker: false,
            comments: [],
          }))
        );
      } catch {
        setPosts([]);
      }
    };
    loadPosts();
  }, [name]);

  useEffect(() => {
    const key = `community:joined:${user?.id || "guest"}:${name}`;
    const saved = localStorage.getItem(key);
    if (isAdmin || saved === "true") {
      setJoined(true);
    } else {
      setJoined(false);
    }
  }, [isAdmin, name, user]);

  if (!community) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        Community not found.
      </div>
    );
  }

  const handleJoinToggle = () => {
    if (isAdmin) return;
    const key = `community:joined:${user?.id || "guest"}:${name}`;
    if (!joined) {
      setJoined(true);
      localStorage.setItem(key, "true");
      setMembersCount((prev) => prev + 1);
    } else {
      setJoined(false);
      localStorage.removeItem(key);
      setMembersCount((prev) => (prev > 0 ? prev - 1 : 0));
    }
  };

  const handlePostSubmit = async () => {
    if (!joined) return;
    if (!newPostText.trim() && !newPostImage) return;

    try {
      let imageBase64 = "";
      if (newPostImage) {
        const reader = new FileReader();
        const filePromise = new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result);
        });
        reader.readAsDataURL(newPostImage);
        imageBase64 = await filePromise;
      }
      const created = await communityPostsAPI.create({
        communityName: name,
        content: newPostText.trim(),
        imageUrl: imageBase64,
      });
      setNewPostText("");
      setNewPostImage(null);
      // If pending, do not show in the list until approved; otherwise prepend
      if (created.status !== "pending") {
        setPosts((prev) => [
          {
            id: created.id,
            authorName: created.author?.name || user?.name || "You",
            authorAvatar: created.author?.avatarUrl || user?.avatarUrl || "",
            timeAgo: "Just now",
            content: created.content,
            image: created.imageUrl || null,
            reactions: created.reactions || { like: 0, love: 0, celebrate: 0, insightful: 0, funny: 0 },
            pending: false,
            showCommentBox: false,
            showReactionPicker: false,
            myReaction: null,
            comments: [],
          },
          ...prev,
        ]);
      }
    } catch {
      // silently ignore
    }
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
            {isAdmin ? (
              <span className="px-5 py-2 rounded-full bg-white border border-[#fda4b8] text-[#c0264a] font-semibold">
                Admin
              </span>
            ) : (
              <button
                onClick={handleJoinToggle}
                className={`px-5 py-2 rounded-full font-semibold transition ${
                  joined
                    ? "bg-white border border-[#fda4b8] text-[#c0264a] hover:bg-[#fff0f4]"
                    : "bg-[#fda4b8] text-white shadow-md hover:shadow-lg"
                }`}
              >
                {joined ? "Unjoin" : "Join"}
              </button>
            )}
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
                onClick={handleJoinToggle}
                className="mt-3 px-4 py-2 rounded-full bg-[#fda4b8] text-white font-semibold shadow"
              >
                Join now
              </button>
            </div>
          )}

          <div className="flex gap-3">
            <img
              src={
                user?.avatarUrl && user.avatarUrl.trim() !== ""
                  ? user.avatarUrl
                  : user?.email
                  ? `https://api.dicebear.com/7.x/initials/svg?seed=${user.email[0].toUpperCase()}`
                  : "https://api.dicebear.com/7.x/initials/svg?seed=?"
              }
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
          {posts.length === 0 ? (
            <div className="text-center text-gray-600 py-12">No posts yet</div>
          ) : posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl shadow border border-[#ffd2dd] p-4 space-y-3"
            >
              <div className="flex items-start gap-3">
                <img
                  src={
                    post.authorAvatar && post.authorAvatar.trim() !== ""
                      ? post.authorAvatar
                      : "https://api.dicebear.com/7.x/initials/svg?seed=?"
                  }
                  alt={post.authorName}
                  className="w-11 h-11 rounded-full object-cover border"
                />
                <div>
                  <p className="font-semibold text-gray-900">{post.authorName}</p>
                  <p className="text-sm text-gray-500">Community Member</p>
                  <p className="text-xs text-gray-400 mt-0.5">{post.timeAgo}</p>
                </div>
              </div>
              <p className="text-gray-800 leading-relaxed">{post.content}</p>
              {post.pending && (
                <span className="inline-block text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                  Pending approval
                </span>
              )}
              {post.image && (
                <div className="rounded-xl overflow-hidden border">
                  <img src={post.image} alt="post visual" className="w-full object-cover max-h-96" />
                </div>
              )}
              <div className="flex flex-wrap gap-3 text-sm text-gray-600 pt-1 relative">
                <div
                  className="relative"
                  onMouseEnter={() =>
                    setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, showReactionPicker: true } : p)))
                  }
                  onMouseLeave={() =>
                    setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, showReactionPicker: false } : p)))
                  }
                >
                  <button
                    className={`px-3 py-1 rounded-full border flex items-center gap-2 ${
                      post.myReaction ? "bg-[#fff0f4] text-[#c0264a] border-[#ffd2dd]" : "border-[#ffd2dd]"
                    }`}
                    disabled={post.pending}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    {post.myReaction ? "Reacted" : "Like"}
                  </button>
                  {post.showReactionPicker && (
                    <div className="absolute -top-12 left-0 bg-white border border-[#ffd2dd] rounded-full shadow px-2 py-1 flex gap-2">
                      {[
                        { key: "like", icon: ThumbsUp },
                        { key: "celebrate", icon: PartyPopper },
                        { key: "love", icon: Heart },
                        { key: "insightful", icon: Lightbulb },
                        { key: "funny", icon: Smile },
                      ].map(({ key, icon }) => {
                        const IconComp = icon;
                        return (
                          <button
                            key={key}
                            className={`p-2 rounded-full ${post.myReaction === key ? "bg-[#fff0f4] text-[#c0264a]" : "hover:bg-[#fff0f4]"}`}
                            onClick={async () => {
                              try {
                                const res = await communityPostsAPI.react(post.id, key);
                                setPosts((prev) =>
                                  prev.map((p) =>
                                    p.id === post.id
                                      ? { ...p, reactions: res.reactions, myReaction: p.myReaction === key ? null : key, showReactionPicker: false }
                                      : p
                                  )
                                );
                              } catch {
                                void 0;
                              }
                            }}
                            disabled={post.pending}
                            aria-label={key}
                          >
                            <IconComp className="w-4 h-4" />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                <button
                  className="ml-auto px-3 py-1 rounded-full border border-[#ffd2dd] flex items-center gap-2"
                  onClick={() =>
                    setPosts((prev) =>
                      prev.map((p) =>
                        p.id === post.id ? { ...p, showCommentBox: !p.showCommentBox } : p
                      )
                    )
                  }
                >
                  <MessageSquare className="w-4 h-4" />
                  {post.showCommentBox ? "Hide comments" : `Comments (${post.comments.length})`}
                </button>
              </div>
              
              {post.showCommentBox && (
                <div className="mt-2">
                  <input
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Write a comment..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.currentTarget.value.trim()) {
                        const text = e.currentTarget.value.trim();
                        (async () => {
                          try {
                            const res = await communityPostsAPI.comment(post.id, text);
                            setPosts((prev) =>
                              prev.map((p) =>
                                p.id === post.id
                                  ? {
                                      ...p,
                                      comments: (res.comments || []).map((c) => ({
                                        authorName: c.author?.name || "Member",
                                        authorAvatar: c.author?.avatarUrl || "",
                                        text: c.text,
                                        createdAt: c.createdAt,
                                      })),
                                    }
                                  : p
                              )
                            );
                          } catch {
                            void 0;
                          } finally {
                            e.currentTarget.value = "";
                          }
                        })();
                      }
                    }}
                  />
                  <div className="mt-3 space-y-2">
                    {post.comments.map((c, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <img
                          src={c.authorAvatar && c.authorAvatar.trim() !== "" ? c.authorAvatar : "https://api.dicebear.com/7.x/initials/svg?seed=?"}
                          alt={c.authorName}
                          className="w-7 h-7 rounded-full object-cover border"
                        />
                        <div className="bg-[#fff5f7] border border-[#ffd2dd] rounded-xl px-3 py-2">
                          <p className="text-sm font-semibold text-[#c0264a]">{c.authorName}</p>
                          <p className="text-sm text-gray-700">{c.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
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
