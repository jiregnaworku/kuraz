import { useLanguage } from "../context/LanguageContext";

export default function LanguageSwitcher({ className = "" }) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div
      className={`inline-flex items-center rounded-full border border-white/20 bg-black/35 p-1 backdrop-blur-md ${className}`}
    >
      <span className="hidden px-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 sm:inline">
        {t("nav.language")}
      </span>

      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => setLanguage("am")}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition sm:px-4 sm:text-sm ${
            language === "am"
              ? "bg-[#d4af37] text-white shadow-lg"
              : "text-white/75 hover:text-white"
          }`}
        >
          አማ
        </button>

        <button
          type="button"
          onClick={() => setLanguage("en")}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition sm:px-4 sm:text-sm ${
            language === "en"
              ? "bg-white text-[#24312c] shadow-lg"
              : "text-white/75 hover:text-white"
          }`}
        >
          EN
        </button>
      </div>
    </div>
  );
}
