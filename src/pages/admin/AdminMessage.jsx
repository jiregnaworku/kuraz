import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";

import ConversationList from "../../components/AdminText/ConversationList";
import AdminChat from "../../components/AdminText/AdminChat";

import { getAdminConversations } from "../../api/adminMessageApi";
import { useLanguage } from "../../context/LanguageContext";

export default function Messages() {
  const { t } = useLanguage();
  const [conversations, setConversations] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);

  const loadConversations = async () => {
    try {
      const data = await getAdminConversations();

      setConversations(data.conversations || []);
    } catch (error) {
      console.log("Failed loading conversations", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadConversations();
  }, []);

  return (
    <section
      className="
      min-h-screen
      bg-gradient-to-br
      from-[#000000]
      via-[#000000]
      to-[#0182eb]
      p-2

      sm:p-4
      lg:p-6
      "
    >
      <div
        className="
        mx-auto
        flex
        h-[calc(100vh-110px)]
        max-w-[1800px]
        overflow-hidden
        rounded-3xl
        border
        border-[#d4af37]/20
        bg-white/10
        shadow-[0_25px_70px_rgba(0,0,0,0.08)]
        backdrop-blur-xl
        "
      >
        {/* ================= MOBILE CONVERSATIONS ================= */}

        <div
          className={`
          w-full
          md:hidden

          ${selectedUser ? "hidden" : "block"}
          `}
        >
          <ConversationList
            conversations={conversations}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />
        </div>

        {/* ================= MOBILE CHAT ================= */}

        <div
          className={`
          flex
          w-full
          flex-col
          md:hidden

          ${selectedUser ? "flex" : "hidden"}
          `}
        >
          <div
            className="
            flex
            items-center
            gap-3
            border-b
            border-[#d4af37]/20
            bg-[#0d5c3e]
            px-4
            py-4
            "
          >
            <button
              onClick={() => setSelectedUser(null)}
              className="
              rounded-full
              p-2
              text-black/70
              transition
              hover:bg-white/10
              "
            >
              <FaArrowLeft />
            </button>

            <div>
              <h2 className="font-semibold text-white">
                {selectedUser?.fullName}
              </h2>

              <p className="text-xs text-gray-300">
                {t("admin.customerSupportChat")}
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <AdminChat selectedUser={selectedUser} />
          </div>
        </div>

        {/* ================= TABLET & DESKTOP ================= */}

        <div
          className="
          hidden
          h-full
          w-full
          md:flex
          "
        >
          {/* Conversation List */}

          <aside
            className="
            h-full
            w-[300px]
            border-r
            border-[#d4af37]/20

            lg:w-[340px]
            xl:w-[360px]
            2xl:w-[380px]
            "
          >
            <ConversationList
              conversations={conversations}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
            />
          </aside>

          {/* Chat */}

          <main className="flex-1 overflow-hidden">
            <AdminChat selectedUser={selectedUser} />
          </main>
        </div>
      </div>
    </section>
  );
}
