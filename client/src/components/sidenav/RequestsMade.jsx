import { useState, useMemo, useEffect } from "react";
import { Search, CheckCircle, Clock, XCircle, Users } from "lucide-react";
import UserCard from "../UserCard";
import ProfilePanel from "../ProfilePanel";
import RequestModal from "../RequestModel";
import toast from "react-hot-toast";
import { requestAPI } from "../../utils/api";

const statusBadge = (status) => {
  if (status === "accepted") {
    return (
      <button className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-2 rounded-full text-sm font-semibold w-full justify-center">
        <CheckCircle size={16} />
        Accepted
      </button>
    );
  }
  if (status === "rejected") {
    return (
      <button className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-2 rounded-full text-sm font-semibold w-full justify-center">
        <XCircle size={16} />
        Rejected
      </button>
    );
  }
  return (
    <button className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-3 py-2 rounded-full text-sm font-semibold w-full justify-center">
      <Clock size={16} />
      Pending
    </button>
  );
};

const RequestsMade = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await requestAPI.getRequestsMade();
      // Transform data to match UserCard expectations if needed
      // The API returns data already formatted for the most part
      setRequests(data);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (message) => {
    try {
      await requestAPI.sendRequest(selectedUser.id, message);
      toast.success(`Request sent to ${selectedUser?.name} 🎉`);
      setShowRequestModal(false);
      fetchRequests(); // Refresh list
    } catch (error) {
      toast.error(error.message || "Failed to send request");
    }
  };

  const handleWithdraw = async (requestId) => {
    try {
      await requestAPI.withdrawRequest(requestId);
      setRequests((prev) => prev.filter((req) => req.requestId !== requestId));
      toast.success("Request withdrawn");
    } catch (error) {
      toast.error(error.message || "Failed to withdraw request");
    }
  };

  const filteredUsers = useMemo(
    () =>
      requests.filter(
        (user) =>
          (user.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
          (user.primarySkill?.toLowerCase() || "").includes(searchQuery.toLowerCase())
      ),
    [requests, searchQuery]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center ml-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f84565]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="ml-20 p-8 animate-fade-in">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Your Requests</h1>

            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 rounded-full h-12 border-2"
              />
            </div>
          </div>

          {/* User Cards */}
          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="bg-rose-50 p-6 rounded-full">
                <Users className="w-16 h-16 text-[#f43f5e]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">No requests yet</h3>
              <p className="text-gray-600 max-w-md">
                Make the request with people you want to gain knowledge from!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <UserCard
                  key={user.requestId} // Use requestId as key
                  user={user}
                  onViewProfile={() => setSelectedUser(user)}
                  footerContent={
                    <div className="space-y-2">
                      {statusBadge(user.status)}
                      {user.status === 'pending' && (
                        <button
                          onClick={() => handleWithdraw(user.requestId)}
                          className="w-full rounded-full px-3 py-2 border border-[#ffd2dd] text-[#c0264a] font-semibold hover:bg-[#fff0f4] transition"
                        >
                          Withdraw
                        </button>
                      )}
                    </div>
                  }
                />
              ))}
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

export default RequestsMade;
