export default function ConfirmModal({
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  danger = true,
}) {
  return (
    <div
      className="
      fixed
      inset-0
      z-[9999]
      flex
      items-center
      justify-center
      bg-black/50
      px-4
      backdrop-blur-sm
      "
    >
      <div
        className="
        w-full
        max-w-md
        rounded-3xl
        bg-white
        p-6
        shadow-2xl
        "
      >
        {/* Title */}

        <h2
          className="
          text-2xl
          font-bold
          text-[#24312c]
          "
        >
          {title}
        </h2>

        {/* Message */}

        <p
          className="
          mt-3
          text-gray-500
          "
        >
          {message}
        </p>

        {/* Buttons */}

        <div
          className="
          mt-8
          flex
          justify-end
          gap-3
          "
        >
          <button
            onClick={onCancel}
            className="
            rounded-xl
            border
            border-gray-200
            px-5
            py-3
            font-medium
            text-gray-600
            transition
            hover:bg-gray-100
            "
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className={`
              rounded-xl
              px-5
              py-3
              font-medium
              text-white
              transition

              ${
                danger
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-[#24312c] hover:bg-[#d4af37]"
              }
            `}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
