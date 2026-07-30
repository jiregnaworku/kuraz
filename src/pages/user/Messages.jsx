import { useEffect, useRef, useState } from "react";
import { FaPaperPlane, FaHeadset } from "react-icons/fa";
import { io } from "socket.io-client";

import MessageBubble from "../../components/profile/MessageBubble";
import { getMessages, sendMessage } from "../../api/messageApi";

const socket = io("https://kuraz-backend-sin2.onrender.com");

export default function Messages() {
  const [messages, setMessages] = useState([]);

  const [newMessage, setNewMessage] = useState("");

  const [loading, setLoading] = useState(true);

  const [sending, setSending] = useState(false);

  const bottomRef = useRef(null);

  // ==========================
  // Load Messages
  // ==========================

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await getMessages();

        setMessages(data.messages || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, []);

  // ==========================
  // Socket Connection
  // ==========================

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (user?._id) {
      socket.emit("join", user._id);
    }

    socket.on("receiveMessage", (message) => {
      setMessages((prev) => {
        const exists = prev.some((item) => item._id === message._id);

        if (exists) return prev;

        return [...prev, message];
      });
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  // ==========================
  // Auto Scroll
  // ==========================

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // ==========================
  // Send Message
  // ==========================

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      setSending(true);

      const ADMIN_ID = "ADMIN_USER_ID";

      await sendMessage({
        receiverId: ADMIN_ID,

        message: newMessage,
      });

      setNewMessage("");
    } catch (error) {
      console.log(error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div
        className="
      flex
      min-h-[50vh]
      items-center
      justify-center
      px-4
      text-center
      text-sm
      text-[#24312c]
      sm:text-base
      "
      >
        Loading conversations...
      </div>
    );
  }

  return (
    <div
      className="
    w-full
    overflow-hidden
    rounded-2xl
    border
    border-[#d4af37]/20

    bg-gradient-to-br
    from-[#000000]
    via-green-900
    to-[#02300b]

    shadow-lg

    sm:rounded-3xl
    sm:shadow-xl
    "
    >
      {/* HEADER */}

      <div
        className="
      flex
      items-center
      gap-3

      bg-[#1b7251]

      px-3
      py-4

      xs:px-4
      sm:px-6
      md:px-8
      "
      >
        <div
          className="
        flex
        h-10
        w-10
        shrink-0
        items-center
        justify-center

        rounded-full

        bg-[#d4af37]

        text-base
        text-[#24312c]

        xs:h-11
        xs:w-11

        sm:h-12
        sm:w-12
        sm:text-xl
        "
        >
          <FaHeadset />
        </div>

        <div className="min-w-0">
          <h1
            className="
          truncate

          text-base
          font-bold
          text-white

          xs:text-lg

          sm:text-2xl
          "
          >
            Kuraz Support
          </h1>

          <p
            className="
          truncate

          text-xs
          text-gray-200

          xs:text-sm
          "
          >
            Orders, products and delivery help
          </p>
        </div>
      </div>

      {/* CHAT AREA */}

      <div
        className="
      h-[55vh]

      min-h-[350px]

      max-h-[600px]

      overflow-y-auto

      px-2
      py-4

      xs:px-3

      sm:px-6
      sm:py-6
      "
      >
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageBubble key={message._id} message={message} />
          ))
        ) : (
          <div
            className="
            flex
            h-full
            flex-col
            items-center
            justify-center

            px-4

            text-center
            "
          >
            <FaHeadset
              className="
              mb-3

              text-4xl

              text-[#d4af37]

              sm:text-5xl
              "
            />

            <h3
              className="
              text-base
              font-semibold

              text-[#24312c]

              sm:text-lg
              "
            >
              Start conversation
            </h3>

            <p
              className="
              mt-2

              max-w-xs

              text-xs
              leading-5

              text-gray-500

              sm:text-sm
              "
            >
              Ask about your order, custom dresses or delivery.
            </p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT AREA */}

      <div
        className="
      border-t
      border-[#d4af37]/20

      bg-white/70

      p-3

      xs:p-4

      sm:p-6
      "
      >
        <div
          className="
        flex
        items-center

        gap-2

        sm:gap-3
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
            placeholder="Write message..."
            className="
          min-w-0
          flex-1

          rounded-xl

          border
          border-gray-200

          bg-[#fffaf0]

          px-3
          py-3

          text-sm

          text-[#24312c]

          outline-none

          placeholder:text-gray-400

          focus:border-[#d4af37]

          xs:px-4

          sm:rounded-2xl
          sm:py-4
          "
          />

          <button
            onClick={handleSend}
            disabled={sending}
            className="
          flex

          h-10
          w-10

          shrink-0

          items-center
          justify-center

          rounded-full

          bg-[#24312c]

          text-sm

          text-[#d4af37]

          transition

          hover:bg-[#d4af37]

          hover:text-[#24312c]

          disabled:opacity-50


          xs:h-12
          xs:w-12

          sm:h-14
          sm:w-14

          sm:text-lg
          "
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
}
