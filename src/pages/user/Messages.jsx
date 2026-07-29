import { useEffect, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

import MessageBubble from "../../components/profile/MessageBubble";

import { getMessages, sendMessage } from "../../api/messageApi";

export default function Messages() {
  const [messages, setMessages] = useState([]);

  const [newMessage, setNewMessage] = useState("");

  const [loading, setLoading] = useState(true);

  const [sending, setSending] = useState(false);

  // ==========================
  // Load Messages
  // ==========================

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await getMessages();

        setMessages(data.messages || []);
      } catch (error) {
        console.log("Failed to load messages", error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, []);

  // ==========================
  // Send Message
  // ==========================

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      setSending(true);

      const data = await sendMessage({
        content: newMessage,
      });

      setMessages([...messages, data.message]);

      setNewMessage("");
    } catch (error) {
      console.log("Message sending failed", error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-gray-500">
        Loading messages...
      </div>
    );
  }

  return (
    <div
      className="
      rounded-3xl
      bg-white
      p-6
      shadow-xl
      "
    >
      {/* Header */}

      <div
        className="
        mb-6
        border-b
        pb-4
        "
      >
        <h1
          className="
          text-2xl
          font-bold
          text-[#24312c]
          "
        >
          Messages
        </h1>

        <p
          className="
          text-sm
          text-gray-500
          "
        >
          Chat with Kuraz Design support
        </p>
      </div>

      {/* Messages */}

      <div
        className="
        h-[450px]
        overflow-y-auto
        rounded-2xl
        bg-gray-50
        p-5
        "
      >
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageBubble key={message._id} message={message} />
          ))
        ) : (
          <p
            className="
            text-center
            text-gray-400
            "
          >
            No messages yet
          </p>
        )}
      </div>

      {/* Input */}

      <div
        className="
        mt-5
        flex
        gap-3
        "
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          placeholder="Write a message..."
          className="
          flex-1
          rounded-xl
          border
          px-4
          py-3
          outline-none

          focus:border-[#d4af37]
          "
        />

        <button
          onClick={handleSend}
          disabled={sending}
          className="
          flex
          items-center
          justify-center

          rounded-xl

          bg-[#24312c]

          px-5

          text-white

          transition

          hover:bg-[#d4af37]

          disabled:opacity-50
          "
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}
