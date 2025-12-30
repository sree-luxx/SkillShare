import { useMemo, useState, useEffect } from "react";
import { Search, CheckCircle, Clock, XCircle } from "lucide-react";
import UserCard from "../UserCard";
import ProfilePanel from "../ProfilePanel";
import RequestModal from "../RequestModel";
import toast from "react-hot-toast";
import { requestAPI } from "../../utils/api";

const ReceivedRequests = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await requestAPI.getRequestsReceived();
      setRequests(data);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSendRequest = () => {
    toast.success(`Request sent to ${selectedUser?.name} 🎉`);
    setShowRequestModal(false);
  };

  const handleDecision = async (requestId, decision) => {
    try {
      await requestAPI.updateRequestStatus(requestId, decision);
      setRequests((prev) =>
        prev.map((req) => (req.id === requestId ? { ...req, status: decision } : req))
      );
      toast.success(`Request ${decision}`);
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status");
    }
  };

  const filteredUsers = useMemo(
    () =>
      requests.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.primarySkill.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [requests, searchQuery]
  );

  return (
    <div className="min-h-screen">
      <main className="ml-20 p-8 animate-fade-in">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Received Requests</h1>

            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/50 border border-white/60 focus:bg-white/80 focus:border-[#f84565] transition-all outline-none"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading requests...</div>
          ) : filteredUsers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onViewProfile={() => setSelectedUser(user)}
                  footerContent={
                    <div className="space-y-2">
                      <div className="bg-white/50 p-3 rounded-xl text-sm text-gray-600 italic">
                        "{user.message}"
                      </div>
                      {user.status === 'pending' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDecision(user.id, "accepted")}
                            className="flex-1 rounded-full px-3 py-2 bg-[#22c55e] text-white font-semibold hover:opacity-90 transition"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleDecision(user.id, "rejected")}
                            className="flex-1 rounded-full px-3 py-2 bg-[#ef4444] text-white font-semibold hover:opacity-90 transition"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <div className={`text-center font-semibold py-2 rounded-xl ${
                          user.status === 'accepted' ? 'text-[#22c55e] bg-[#22c55e]/10' : 'text-[#ef4444] bg-[#ef4444]/10'
                        }`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </div>
                      )}
                    </div>
                  }
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700">No requests received yet</h3>
              <p className="text-gray-500 max-w-sm">
                When people want to learn from you, their requests will appear here.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Profile Panel */}
      <ProfilePanel
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onRequestSwap={() => setShowRequestModal(true)}
      />

      {/* Request Modal */}
      {showRequestModal && selectedUser && (
        <RequestModal
          userName={selectedUser.name}
          onClose={() => setShowRequestModal(false)}
          onSend={handleSendRequest}
        />
      )}
    </div>
  );
};

export default ReceivedRequests;