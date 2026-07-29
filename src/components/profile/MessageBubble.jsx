import { FaUserShield, FaUser } from "react-icons/fa";

export default function MessageBubble({ message }) {
  const isAdmin = message.senderRole === "admin";

  return (
    <div
      className={`
      flex
      mb-4
      ${isAdmin ? "justify-start" : "justify-end"}
      `}
    >
      <div
        className={`
        max-w-[75%]
        rounded-2xl
        px-5
        py-3
        shadow-md

        ${
          isAdmin
            ? "bg-gray-100 text-[#24312c] rounded-bl-none"
            : "bg-[#24312c] text-white rounded-br-none"
        }
        `}
      >
        {/* Sender */}

        <div
          className="
          mb-2
          flex
          items-center
          gap-2
          text-xs
          font-semibold
          "
        >
          {isAdmin ? (
            <>
              <FaUserShield className="text-[#d4af37]" />
              Admin
            </>
          ) : (
            <>
              <FaUser className="text-[#d4af37]" />
              You
            </>
          )}
        </div>

        {/* Message */}

        <p
          className="
          break-words
          text-sm
          leading-6
          "
        >
          {message.content}
        </p>

        {/* Time */}

        <p
          className={`
          mt-2
          text-right
          text-xs

          ${isAdmin ? "text-gray-400" : "text-gray-300"}
          `}
        >
          {new Date(message.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
