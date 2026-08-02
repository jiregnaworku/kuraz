import { FaUserShield, FaUser } from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";

export default function MessageBubble({ message }) {
  const { t } = useLanguage();
  const isAdmin =
    message.sender?.role === "admin" || message.senderRole === "admin";

  return (
    <div
      className={`
      mb-3
      flex
      w-full

      ${isAdmin ? "justify-start" : "justify-end"}

      sm:mb-4
      `}
    >
      <div
        className={`
        max-w-[88%]

        overflow-hidden

        rounded-2xl

        px-3
        py-3

        shadow-md

        break-words


        xs:max-w-[85%]

        sm:max-w-[75%]

        sm:px-5
        sm:py-4


        ${
          isAdmin
            ? `
              rounded-bl-none

              border
              border-[#d4af37]/20

              bg-[#ad7d1d]

              text-[#24312c]
            `
            : `
              rounded-br-none

              bg-[#24312c]

              text-white
            `
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
              <FaUserShield
                className="
                  text-[#d4af37]
                  "
              />

              <span>{t("messages.kurazSupport") || "Kuraz Support"}</span>
            </>
          ) : (
            <>
              <FaUser
                className="
                  text-[#d4af37]
                  "
              />

              <span>{t("messages.you") || "You"}</span>
            </>
          )}
        </div>

        {/* Message Content */}

        <p
          className="
          break-words

          whitespace-pre-wrap

          text-sm

          leading-5

          sm:text-[15px]

          sm:leading-6
          "
        >
          {message.message}
        </p>

        {/* Time */}

        <p
          className={`
          mt-2

          text-right

          text-[10px]

          sm:text-xs


          ${isAdmin ? "text-gray-400" : "text-gray-300"}

          `}
        >
          {new Date(message.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
