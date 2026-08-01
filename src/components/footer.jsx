import { FaHouse, FaCircleInfo, FaShirt, FaEnvelope } from "react-icons/fa6";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const year = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer
      className="
      relative overflow-hidden
      border-t-[3px] border-[#d4af37]
      bg-gradient-to-b from-[#1a1a1a] to-[#0b0b0b]
      text-white

      px-[clamp(18px,6vw,80px)]
      pt-[clamp(60px,7vw,90px)]
      pb-[25px]

      max-lg:px-[35px]
      max-lg:pt-[70px]

      max-md:px-6
      max-md:pt-[60px]

      max-[480px]:px-4
      max-[480px]:pt-[50px]
      max-[480px]:pb-5

      max-[340px]:px-3
      max-[340px]:pt-10
      max-[340px]:pb-[18px]
      "
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at top right, rgba(212,175,55,0.09), transparent 45%)",
        }}
      />

      <div
        className="
        relative z-10
        mx-auto
        grid
        max-w-[1400px]
        grid-cols-[1.8fr_1fr_1.2fr]
        gap-[clamp(35px,5vw,80px)]

        max-lg:grid-cols-2
        max-lg:gap-10

        max-md:grid-cols-1
        max-md:gap-[22px]

        max-[480px]:gap-[18px]
        "
      >
        <div
          className="
          max-lg:col-span-2
          max-lg:text-center

          max-md:col-span-1
          max-md:border-b
          max-md:border-white/10
          max-md:pb-6
          "
        >
          <img
            src="/assets/images/kuraz.png"
            alt="Kuraz Design Logo"
            className="
            mb-6
            w-[clamp(90px,8vw,130px)]

            max-lg:mx-auto

            max-[480px]:w-[85px]
            "
          />

          <p
            className="
            max-w-[430px]
            text-[#d5d5d5]
            leading-[1.9]
            text-[clamp(.92rem,.95vw,1rem)]

            max-lg:mx-auto
            max-lg:max-w-[650px]

            max-[480px]:text-[14px]
            max-[480px]:leading-[1.8]

            max-[340px]:text-[13px]
            "
          >
            {t("footer.description")}
          </p>
        </div>

        <div
          className="
          flex flex-col gap-[15px]

          max-md:rounded-[18px]
          max-md:border
          max-md:border-white/10
          max-md:bg-white/5
          max-md:p-[25px]
          max-md:backdrop-blur-xl

          max-[480px]:rounded-2xl
          max-[480px]:p-5

          max-[340px]:p-4
          "
        >
          <h3 className="mb-6 text-[clamp(20px,2vw,24px)] font-semibold text-[#d4af37]">
            {t("footer.quickLinks")}
            <span className="mt-2 block h-[2px] w-[45px] bg-[#d4af37]" />
          </h3>

          <FooterLink href="#home" icon={<FaHouse />} text={t("nav.home")} />
          <FooterLink
            href="#about"
            icon={<FaCircleInfo />}
            text={t("nav.about")}
          />
          <FooterLink
            href="#collection"
            icon={<FaShirt />}
            text={t("nav.collection")}
          />
          <FooterLink
            href="#contact-section"
            icon={<FaEnvelope />}
            text={t("nav.contact")}
          />
        </div>

        <div
          className="
          flex flex-col gap-[15px]

          max-md:rounded-[18px]
          max-md:border
          max-md:border-white/10
          max-md:bg-white/5
          max-md:p-[25px]
          max-md:backdrop-blur-xl

          max-[480px]:rounded-2xl
          max-[480px]:p-5

          max-[340px]:p-4
          "
        >
          <h3 className="mb-6 text-[clamp(20px,2vw,24px)] font-semibold text-[#d4af37]">
            {t("footer.contact")}
            <span className="mt-2 block h-[2px] w-[45px] bg-[#d4af37]" />
          </h3>

          <ContactLink
            href="tel:+251937398157"
            icon="/assets/icons/phone.png"
            text="+251 937 398 157"
          />

          <ContactLink
            href="https://t.me/habesha3661"
            icon="/assets/icons/telegram.png"
            text="Telegram"
          />

          <ContactLink
            href="https://maps.google.com/?q=22+Golagul+Tower,+Addis+Ababa"
            icon="/assets/icons/map.png"
            text="22 Golagul Tower"
          />
        </div>
      </div>

      <div
        className="
        relative z-10
        mx-auto
        mt-[60px]
        max-w-[1400px]
        border-t border-white/10
        pt-[22px]
        text-center
        text-[14px]
        text-[#a9a9a9]

        max-md:mt-[35px]

        max-[480px]:text-[12px]
        max-[480px]:leading-[1.7]
        "
      >
        © {year} Kuraz Design. {t("footer.rights")}
      </div>
    </footer>
  );
}

function FooterLink({ href, icon, text }) {
  return (
    <a
      href={href}
      className="
      group
      flex items-center gap-[14px]
      text-[15px]
      text-[#dddddd]
      transition-all
      duration-300
      hover:text-white

      max-[480px]:gap-3
      max-[480px]:text-[14px]

      max-[340px]:gap-[10px]
      max-[340px]:text-[13px]
      "
    >
      <span className="transition-transform duration-300 group-hover:scale-110">
        {icon}
      </span>

      {text}
    </a>
  );
}

function ContactLink({ href, icon, text }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className="
      group
      flex items-center gap-[14px]
      text-[15px]
      text-[#dddddd]
      transition-all
      duration-300
      hover:text-white

      max-[480px]:gap-3
      max-[480px]:text-[14px]

      max-[340px]:gap-[10px]
      max-[340px]:text-[13px]
      "
    >
      <img
        src={icon}
        alt=""
        className="h-5 w-5 flex-shrink-0 object-contain transition-transform duration-300 group-hover:scale-110"
      />

      {text}
    </a>
  );
}
