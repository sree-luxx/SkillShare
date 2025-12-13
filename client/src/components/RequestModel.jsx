import { X } from "lucide-react";
import { useState } from "react";

const RequestModal = ({ userName, onClose, onSend }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      onClose();
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-6">
        <div className="glass rounded-3xl p-8 max-w-md w-full space-y-6 animate-scale-in">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Send Skill Swap Request</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Subtitle */}
          <p className="text-muted-foreground">
            Send a message to{" "}
            <span className="font-semibold text-foreground">{userName}</span>
          </p>

          {/* Message Box */}
          <div className="space-y-2">
            <label htmlFor="message" className="font-medium">
              Your Message
            </label>

            <textarea
              id="message"
              placeholder="Hi! I'd love to exchange skills with you. I can teach you..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="rounded-2xl min-h-32 w-full p-3 bg-background border border-border resize-none outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-full"
            >
              Cancel
            </Button>

            <Button
              onClick={handleSend}
              className="flex-1 rounded-full bg-gradient-warm hover:opacity-90 transition-smooth"
            >
              Send Request
            </Button>
          </div>

        </div>
      </div>
    </>
  );
};

export default RequestModal;
