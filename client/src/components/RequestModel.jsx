import { X } from "lucide-react";
import { useState } from "react";

const RequestModal = ({ userName, onClose, onSend }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      // onClose(); // onClose is called by parent after successful send
    }
  };

  const Button = ({ children, variant, size, className, onClick, ...props }) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
    const variants = {
      ghost: "hover:bg-accent hover:text-accent-foreground",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      default: "bg-primary text-primary-foreground hover:bg-primary/90"
    };
    const sizes = {
      default: "h-10 px-4 py-2",
      icon: "h-10 w-10",
      sm: "h-9 rounded-md px-3"
    };
    
    // Fallback if variant/size not found
    const variantStyles = variants[variant] || variants.default;
    const sizeStyles = sizes[size] || sizes.default;

    return (
      <button 
        className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    );
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
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl space-y-6 animate-scale-in">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Send Skill Swap Request</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </Button>
          </div>

          {/* Subtitle */}
          <p className="text-gray-600">
            Send a message to{" "}
            <span className="font-semibold text-gray-900">{userName}</span>
          </p>

          {/* Message Box */}
          <div className="space-y-2">
            <label htmlFor="message" className="font-medium text-gray-700">
              Your Message
            </label>

            <textarea
              id="message"
              placeholder="Hi! I'd love to exchange skills with you. I can teach you..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="rounded-xl min-h-32 w-full p-3 bg-gray-50 border border-gray-200 resize-none outline-none focus:ring-2 focus:ring-[#f43f5e] focus:border-transparent transition-all"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>

            <Button
              onClick={handleSend}
              className="flex-1 rounded-xl bg-[#f43f5e] hover:bg-[#e11d48] text-white transition-colors"
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
