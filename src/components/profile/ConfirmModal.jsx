// components/common/ConfirmModal.jsx
import { useEffect, useRef } from "react";
import { FaExclamationTriangle, FaTimes, FaTrash } from "react-icons/fa";

export default function ConfirmModal({
  isOpen = true,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  danger = true,
  type = "warning", // 'warning', 'danger', 'info'
  icon = null,
  showCloseButton = true,
}) {
  const modalRef = useRef(null);

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && onCancel) {
        onCancel();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onCancel]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target) &&
        onCancel
      ) {
        onCancel();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  // Get icon based on type if no custom icon provided
  const getDefaultIcon = () => {
    if (icon) return icon;

    switch (type) {
      case "danger":
        return <FaTrash className="text-3xl text-red-600" />;
      case "info":
        return <FaExclamationTriangle className="text-3xl text-blue-600" />;
      default: // warning
        return <FaExclamationTriangle className="text-3xl text-yellow-600" />;
    }
  };

  // Get type styles
  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
          buttonBg: "bg-red-600 hover:bg-red-700",
          borderColor: "border-red-200",
        };
      case "info":
        return {
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
          buttonBg: "bg-blue-600 hover:bg-blue-700",
          borderColor: "border-blue-200",
        };
      default: // warning
        return {
          iconBg: "bg-yellow-100",
          iconColor: "text-yellow-600",
          buttonBg: danger
            ? "bg-red-600 hover:bg-red-700"
            : "bg-[#d4af37] hover:bg-[#b88f1d]",
          borderColor: "border-yellow-200",
        };
    }
  };

  const styles = getTypeStyles();

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
        animate-fadeIn
      "
    >
      <div
        ref={modalRef}
        className={`
          relative
          w-full
          max-w-md
          rounded-3xl
          bg-white
          p-6
          shadow-2xl
          transform
          transition-all
          duration-300
          animate-scaleIn
          border
          ${styles.borderColor}
        `}
      >
        {/* Close Button */}
        {showCloseButton && (
          <button
            onClick={onCancel}
            className="
              absolute
              right-4
              top-4
              text-gray-400
              transition
              hover:text-gray-600
            "
          >
            <FaTimes className="text-xl" />
          </button>
        )}

        {/* Icon */}
        <div className="flex flex-col items-center text-center">
          <div
            className={`
              mb-4
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              ${styles.iconBg}
            `}
          >
            {getDefaultIcon()}
          </div>

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
              w-full
              gap-3
            "
          >
            <button
              onClick={onCancel}
              className="
                flex-1
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
                flex-1
                rounded-xl
                px-5
                py-3
                font-medium
                text-white
                transition
                ${styles.buttonBg}
              `}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
