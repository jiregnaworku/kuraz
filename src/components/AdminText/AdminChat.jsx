import { useEffect, useRef, useState } from "react";
import { FaPaperPlane, FaUser, FaComments } from "react-icons/fa";
import { io } from "socket.io-client";

import { getConversation, sendAdminMessage } from "../../api/adminMessageApi";

const socket = io("http://localhost:5000");

export default function AdminChat({ selectedUser }) {
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);

  const [sending, setSending] = useState(false);

  const [newMessage, setNewMessage] = useState("");

  const bottomRef = useRef(null);

  // ==========================
  // Join Socket
  // ==========================

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("user") || "null");

    if (admin?._id) {
      socket.emit("join", admin._id);
    }

    socket.on("receiveMessage", (message) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m._id === message._id);

        if (exists) return prev;

        return [...prev, message];
      });
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  // ==========================
  // Load Conversation
  // ==========================

  useEffect(() => {
    if (!selectedUser) return;

    const loadConversation = async () => {
      try {
        setLoading(true);

        const data = await getConversation(selectedUser._id);

        setMessages(data.messages || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadConversation();
  }, [selectedUser]);

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

      await sendAdminMessage({
        receiverId: selectedUser._id,
        message: newMessage,
      });

      // Socket will update automatically

      setNewMessage("");
    } catch (error) {
      console.log(error);
    } finally {
      setSending(false);
    }
  };

  // ==========================
  // Empty State
  // ==========================
  // ==========================
  // Empty State
  // ==========================

  if (!selectedUser) {
    return (
      <div
        className="
        flex
        min-h-[60vh]
        flex-1
        items-center
        justify-center
        rounded-3xl
        bg-gradient-to-br
        from-[#fffaf0]
        via-[#fdfbf6]
        to-[#f3e7c8]
        p-6
        "
      >
        <div className="max-w-md text-center">
          <div
            className="
            mx-auto
            mb-6
            flex
            h-24
            w-24
            items-center
            justify-center
            rounded-full
            bg-[#24312c]
            shadow-xl
            "
          >
            <FaComments className="text-4xl text-[#d4af37]" />
          </div>

          <h2
            className="
            text-2xl
            font-bold
            text-[#24312c]

            sm:text-3xl
            "
          >
            Customer Support Center
          </h2>

          <p
            className="
            mx-auto
            mt-3
            max-w-sm
            text-sm
            leading-7
            text-gray-500

            sm:text-base
            "
          >
            Select a customer from the conversation list to start replying to
            messages.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
      flex
      h-[65vh]
      min-h-[500px]
      flex-1
      flex-col
      overflow-hidden
      rounded-r-3xl

      sm:h-[70vh]
      md:h-[75vh]
      lg:h-[80vh]
      "
    >
      {/* ================= HEADER ================= */}

      <div
        className="
        sticky
        top-0
        z-20
        flex
        items-center
        justify-between
        border-b
        border-[#d4af37]/20
        bg-white/95
        px-3
        py-3
        backdrop-blur

        sm:px-5
        md:px-6
        "
      >
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-[#24312c]
            text-lg
            font-bold
            text-white

            sm:h-12
            sm:w-12
            "
          >
            {selectedUser.fullName?.charAt(0)?.toUpperCase() || <FaUser />}
          </div>

          <div className="min-w-0">
            <h2
              className="
              truncate
              text-base
              font-bold
              text-[#24312c]

              sm:text-lg
              "
            >
              {selectedUser.fullName}
            </h2>

            <p
              className="
              truncate
              text-xs
              text-gray-500

              sm:text-sm
              "
            >
              {selectedUser.email}
            </p>

            <span
              className="
              mt-1
              inline-flex
              rounded-full
              bg-[#d4af37]/20
              px-2
              py-0.5
              text-[10px]
              font-medium
              text-[#8d6b09]

              sm:text-xs
              "
            >
              Customer Conversation
            </span>
          </div>
        </div>
      </div>

      {/* ================= CHAT ================= */}

      <div
        className="
        flex-1
        overflow-y-auto
        bg-gradient-to-b
        from-[#faf7f0]
        via-[#fffdf8]
        to-[#f4ead6]
        px-3
        py-4

        sm:px-5
        md:px-6
        "
      >
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div
                className="
                mx-auto
                mb-4
                h-12
                w-12
                animate-spin
                rounded-full
                border-4
                border-[#d4af37]
                border-t-transparent
                "
              />

              <p className="font-medium text-[#24312c]">
                Loading conversation...
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const isAdmin = message.sender?.role === "admin";

            return (
              <div
                key={message._id}
                className={`mb-4 flex ${
                  isAdmin ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`
                  max-w-[90%]
                  rounded-2xl
                  px-4
                  py-3
                  shadow-md
                  transition-all
                  duration-200

                  sm:max-w-[80%]
                  md:max-w-[72%]
                  lg:max-w-[65%]

                  ${
                    isAdmin
                      ? "rounded-br-none bg-[#24312c] text-white"
                      : "rounded-bl-none border border-[#d4af37]/20 bg-white text-[#24312c]"
                  }
                  `}
                >
                  <p
                    className="
                    whitespace-pre-wrap
                    break-words
                    text-sm
                    leading-6

                    sm:text-[15px]
                    "
                  >
                    {message.message}
                  </p>

                  <p
                    className={`
                    mt-3
                    text-right
                    text-[11px]

                    ${isAdmin ? "text-gray-300" : "text-gray-500"}
                    `}
                  >
                    {new Date(message.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })
        )}

        <div ref={bottomRef} />
      </div>

      {/* ================= INPUT ================= */}

      <div
        className="
        border-t
        border-[#d4af37]/20
        bg-white/95
        p-3
        backdrop-blur

        sm:p-4
        md:p-5
        "
      >
        <div
          className="
          flex
          items-end
          gap-2

          sm:gap-3
          "
        >
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Reply to customer..."
            className="
            flex-1
            rounded-2xl
            border
            border-gray-200
            bg-[#fffaf0]
            px-4
            py-3
            text-sm
            text-[#24312c]
            outline-none
            transition

            placeholder:text-gray-400

            focus:border-[#d4af37]
            focus:ring-2
            focus:ring-[#d4af37]/20

            sm:px-5
            sm:text-base
            "
          />

          <button
            onClick={handleSend}
            disabled={sending}
            className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-2xl

            bg-[#24312c]

            text-white

            shadow-lg

            transition-all
            duration-200

            hover:scale-105
            hover:bg-[#d4af37]
            hover:text-[#24312c]

            active:scale-95

            disabled:cursor-not-allowed
            disabled:opacity-50

            sm:h-12
            sm:w-12

            md:h-14
            md:w-14
            "
          >
            <FaPaperPlane className="text-base md:text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
}
