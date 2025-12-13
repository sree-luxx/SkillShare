import { useState } from "react";
import { Send } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Title from "../components/Title";

const mockChats = [
  {
    id: 1,
    name: "Alex Rivera",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    lastMessage: "That sounds great! Let's schedule a session.",
    time: "2m ago"
  },
  {
    id: 2,
    name: "Maya Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
    lastMessage: "I'd love to help you with design!",
    time: "1h ago"
  },
];

const mockMessages = [
  {
    id: 1,
    sender: "them",
    text: "Hi! I saw your request to learn web development.",
    time: "10:30 AM"
  },
  {
    id: 2,
    sender: "me",
    text: "Yes! I'm really interested in learning React.",
    time: "10:32 AM"
  },
  {
    id: 3,
    sender: "them",
    text: "That sounds great! Let's schedule a session.",
    time: "10:35 AM"
  },
];

const MessagePage = () => {
  const [selectedChat, setSelectedChat] = useState(mockChats[0]);
  const [newMessage, setNewMessage] = useState("");

  return (
    <div className="min-h-screen">
      <Title/>
      <Sidebar/>
      <main className="ml-64 flex min-h-[calc(100vh-96px)] max-h-[calc(100vh-96px)] overflow-hidden animate-fade-in">
        {/* Chat List */}
        <div className="w-80 border-r border-border p-4 space-y-2 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">Messages</h2>
          {mockChats.map(chat => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`w-full p-4 rounded-2xl text-left transition-smooth hover:scale-105 ${
                selectedChat.id === chat.id ? "glass" : "hover:bg-muted"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-cool overflow-hidden flex-shrink-0">
                  <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{chat.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                </div>
                <span className="text-xs text-muted-foreground">{chat.time}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Chat Header */}
          <div className="glass border-b border-border p-6 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-cool overflow-hidden">
              <img src={selectedChat.avatar} alt={selectedChat.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{selectedChat.name}</h3>
              <p className="text-sm text-muted-foreground">Active now</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {mockMessages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-md px-6 py-3 rounded-3xl ${
                    msg.sender === "me"
                      ? "text-background ml-auto"
                      : "glass"
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="glass border-t border-border p-4 sticky bottom-0">
            <div className="flex gap-3 items-center">
              <input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="rounded-full h-12 flex-1 px-4 border border-border"
              />
              <button className="rounded-full px-4 py-2 text-white bg-btn-primary hover:opacity-90 transition-smooth flex items-center justify-center shadow">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MessagePage;