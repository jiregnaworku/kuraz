import { useMemo, useState } from "react";
import { FaUser, FaSearch } from "react-icons/fa";

export default function ConversationList({
  conversations,
  selectedUser,
  setSelectedUser,
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return conversations.filter((item) =>
      item.user.fullName.toLowerCase().includes(search.toLowerCase()),
    );
  }, [conversations, search]);

  return (
    <aside
      className="
      flex
      h-full
      w-full
      flex-col
      border-r
      border-[#d4af37]/20
      bg-[#24312c]

      md:w-[320px]
      lg:w-[340px]
      xl:w-[360px]
      "
    >
      {/* Header */}

      <div
        className="
        sticky
        top-0
        z-20
        border-b
        border-white/10
        bg-[#24312c]
        p-4

        sm:p-5
        "
      >
        <h2
          className="
          text-xl
          font-bold
          text-white
          "
        >
          Customer Messages
        </h2>

        <p
          className="
          mt-1
          text-sm
          text-gray-300
          "
        >
          {filtered.length} conversation
          {filtered.length !== 1 && "s"}
        </p>

        {/* Search */}

        <div
          className="
          relative
          mt-4
          "
        >
          <FaSearch
            className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-gray-400
            "
          />

          <input
            type="text"
            placeholder="Search customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
            w-full
            rounded-xl
            border
            border-white/10
            bg-white/10
            py-3
            pl-11
            pr-4
            text-sm
            text-white
            outline-none
            placeholder:text-gray-400
            focus:border-[#d4af37]
            "
          />
        </div>
      </div>

      {/* Conversation List */}

      <div
        className="
        flex-1
        overflow-y-auto
        p-3
        "
      >
        {filtered.length > 0 ? (
          filtered.map((item) => {
            const active = selectedUser?._id === item.user._id;

            const initials = item.user.fullName
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase();

            return (
              <button
                key={item.user._id}
                onClick={() => setSelectedUser(item.user)}
                className={`
                mb-2
                flex
                w-full
                items-center
                gap-3
                rounded-2xl
                p-3
                text-left
                transition-all
                duration-200

                ${
                  active
                    ? "bg-[#d4af37] text-[#24312c] shadow-lg"
                    : "hover:bg-white/10 text-white"
                }
                `}
              >
                {/* Avatar */}

                <div
                  className={`
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  font-bold

                  ${
                    active
                      ? "bg-[#24312c] text-[#d4af37]"
                      : "bg-white text-[#24312c]"
                  }
                  `}
                >
                  {initials || <FaUser />}
                </div>

                {/* Info */}

                <div
                  className="
                  min-w-0
                  flex-1
                  "
                >
                  <div
                    className="
                    flex
                    items-center
                    justify-between
                    gap-2
                    "
                  >
                    <h3
                      className="
                      truncate
                      font-semibold
                      "
                    >
                      {item.user.fullName}
                    </h3>

                    {item.updatedAt && (
                      <span
                        className="
                        shrink-0
                        text-[11px]
                        opacity-70
                        "
                      >
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <p
                    className="
                    mt-1
                    truncate
                    text-sm
                    opacity-80
                    "
                  >
                    {item.lastMessage}
                  </p>
                </div>

                {/* Unread Badge */}

                {item.unreadCount > 0 && (
                  <div
                    className="
                    flex
                    h-6
                    min-w-[24px]
                    items-center
                    justify-center
                    rounded-full
                    bg-red-500
                    px-2
                    text-xs
                    font-bold
                    text-white
                    "
                  >
                    {item.unreadCount}
                  </div>
                )}
              </button>
            );
          })
        ) : (
          <div
            className="
            flex
            h-full
            flex-col
            items-center
            justify-center
            text-center
            "
          >
            <FaUser
              className="
              mb-4
              text-5xl
              text-[#d4af37]
              "
            />

            <h3
              className="
              text-lg
              font-semibold
              text-white
              "
            >
              No Conversations
            </h3>

            <p
              className="
              mt-2
              max-w-xs
              text-sm
              text-gray-400
              "
            >
              Customer conversations will appear here when they send a message.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
