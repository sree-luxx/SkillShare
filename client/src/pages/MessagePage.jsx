import { useState, useEffect, useRef } from "react";
import { Send, MessageSquare, Phone, Calendar, Users } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Title from "../components/Title";
import { userAPI, messageAPI } from "../utils/api";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import ProfilePanel from "../components/ProfilePanel";

const MessagePage = () => {
  const { user: currentUser } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const [profileUser, setProfileUser] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDraft, setScheduleDraft] = useState("");

  const formatDayLabel = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const isSameDay = (a, b) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();
    if (isSameDay(d, today)) return "Today";
    if (isSameDay(d, yesterday)) return "Yesterday";
    return d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
  };

  const groupMessagesByDay = (msgs) => {
    const groups = [];
    let lastLabel = null;
    msgs.forEach((m) => {
      const label = formatDayLabel(m.createdAt);
      if (label !== lastLabel) {
        groups.push({ type: "header", label, key: `hdr-${label}-${m._id || Math.random()}` });
        lastLabel = label;
      }
      groups.push({ type: "msg", data: m, key: m._id || Math.random() });
    });
    return groups;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchPeers();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat._id);
      // Simple polling for new messages
      const interval = setInterval(() => fetchMessages(selectedChat._id), 3000);
      return () => clearInterval(interval);
    }
  }, [selectedChat]);

  const fetchPeers = async () => {
    try {
      const peers = await userAPI.getPeers();
      setChats(peers);
    } catch (error) {
      console.error("Failed to fetch peers:", error);
      toast.error("Failed to load chats");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (peerId) => {
    try {
      const msgs = await messageAPI.getMessages(peerId);
      setMessages(msgs);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const msg = await messageAPI.sendMessage(selectedChat._id, newMessage);
      setMessages([...messages, msg]);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    }
  };

  const openProfilePanel = () => {
    if (!selectedChat) return;
    const u = {
      name: selectedChat.name,
      avatar: selectedChat.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedChat.name}`,
      bio: selectedChat.bio || "",
      skillsHave: selectedChat.skillsHave || [],
      skillsWant: selectedChat.skillsWant || [],
      primarySkill: selectedChat.skillsHave?.[0],
      rating: 5.0,
      community: selectedChat.community || ""
    };
    setProfileUser(u);
  };

  const handleCall = () => {
    if (!selectedChat) return;
    toast.success(`Preparing a call with ${selectedChat.name}`);
  };

  const handleSchedule = () => {
    if (!selectedChat) return;
    setShowScheduleModal(true);
  };

  const confirmSchedule = async () => {
    if (!scheduleDraft.trim() || !selectedChat) {
      toast.error("Please pick a date/time");
      return;
    }
    const note = `Scheduled session on ${new Date(scheduleDraft).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}`;
    try {
      const msg = await messageAPI.sendMessage(selectedChat._id, note);
      setMessages([...messages, msg]);
      setShowScheduleModal(false);
      setScheduleDraft("");
      toast.success("Session scheduled");
    } catch (error) {
      console.error("Failed to schedule:", error);
      toast.error("Failed to schedule");
    }
  };

  return (
    <div className="min-h-screen">
      <Title/>
      <Sidebar/>
      <main className="ml-64 flex min-h-[calc(100vh-96px)] max-h-[calc(100vh-96px)] overflow-hidden animate-fade-in">
        {/* Chat List */}
        <div className="w-80 border-r border-border p-4 space-y-2 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">Messages</h2>
          {loading ? (
            <div className="text-center text-muted-foreground py-4">Loading chats...</div>
          ) : chats.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              <p>No connections yet.</p>
              <p className="text-sm mt-2">Connect with peers to start chatting!</p>
            </div>
          ) : (
            chats.map(chat => (
              <button
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                className={`w-full p-4 rounded-2xl text-left transition-smooth hover:scale-105 ${
                  selectedChat?._id === chat._id 
                    ? "glass" 
                    : "hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-cool overflow-hidden flex-shrink-0">
                    <img 
                      src={chat.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.name}`} 
                      alt={chat.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{chat.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{chat.bio || "Available for skill swap"}</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="glass border-b border-border p-6 flex items-center gap-3">
                <button
                  onClick={openProfilePanel}
                  className="w-12 h-12 rounded-full bg-gradient-cool overflow-hidden"
                  aria-label="View profile"
                >
                  <img
                    src={selectedChat.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedChat.name}`}
                    alt={selectedChat.name}
                    className="w-full h-full object-cover"
                  />
                </button>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{selectedChat.name}</h3>
                  <p className="text-sm text-muted-foreground">Active now</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCall}
                    className="px-3 py-2 rounded-full border border-[#ffd2dd] text-[#c0264a] hover:bg-[#fff0f4] transition"
                    aria-label="Call"
                  >
                    <Phone className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleSchedule}
                    className="px-3 py-2 rounded-full border border-[#ffd2dd] text-[#c0264a] hover:bg-[#fff0f4] transition"
                    aria-label="Schedule"
                  >
                    <Calendar className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <div className="bg-rose-50 p-6 rounded-full">
                      <Users className="w-16 h-16 text-[#f43f5e]" />
                    </div>
                    <h3 className="text-2xl font-bold">No messages yet</h3>
                    <p className="text-muted-foreground max-w-md">
                      Start your conversations by sending a message and plan your skillshare!
                    </p>
                  </div>
                ) : (
                  groupMessagesByDay(messages).map((item) =>
                    item.type === "header" ? (
                      <div
                        key={item.key}
                        className="flex justify-center"
                      >
                        <span className="px-3 py-1 text-xs rounded-full bg-white border border-[#ffd2dd] text-[#c0264a]">
                          {item.label}
                        </span>
                      </div>
                    ) : (
                      <div
                        key={item.key}
                        className={`flex ${item.data.sender === currentUser?.id ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] px-5 py-3 rounded-2xl shadow-sm ${
                            item.data.sender === currentUser?.id
                              ? "bg-[#f84565] text-white rounded-br-none"
                              : "rounded-bl-none border border-[#f1e3cc] bg-[#f8f1e3] text-gray-900"
                          }`}
                        >
                          <p>{item.data.text}</p>
                          <p className={`text-[10px] mt-1 text-right ${
                            item.data.sender === currentUser?.id ? "text-white/70" : "text-gray-600"
                          }`}>
                            {new Date(item.data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    )
                  )
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-6 glass border-t border-border">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 rounded-2xl bg-white/80 border border-white/80 shadow-inner focus:border-[#f84565] outline-none transition"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="px-5 py-3 bg-[#f84565] text-white rounded-2xl hover:bg-[#d63d56] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#f84565]/20"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="bg-rose-50 p-6 rounded-full">
                <Users className="w-16 h-16 text-[#f43f5e]" />
              </div>
              <h2 className="text-2xl font-bold mt-4">Start your conversation</h2>
              <p className="text-muted-foreground max-w-md mt-2">
                Choose a person from the list to begin. Plan calls or schedule sessions easily.
              </p>
            </div>
          )}
        </div>
      </main>
      
      {/* Profile Panel */}
      <ProfilePanel
        user={profileUser}
        onClose={() => setProfileUser(null)}
        onRequestSwap={() => {
          setProfileUser(null);
          if (selectedChat) setShowScheduleModal(true);
        }}
      />

      {/* Schedule Modal */}
      {showScheduleModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] animate-fade-in"
            onClick={() => setShowScheduleModal(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-[100] p-6 pointer-events-none">
            <div
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Schedule a session</h3>
              <div className="space-y-2">
                <label className="font-medium">Pick date & time</label>
                <input
                  type="datetime-local"
                  className="w-full border rounded-lg px-4 py-2"
                  value={scheduleDraft}
                  onChange={(e) => setScheduleDraft(e.target.value)}
                />
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#ffd2dd] text-[#c0264a] hover:bg-[#fff0f4] transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSchedule}
                  className="px-4 py-2 rounded-xl bg-[#f43f5e] text-white hover:bg-[#e11d48] transition"
                >
                  Schedule
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MessagePage;
