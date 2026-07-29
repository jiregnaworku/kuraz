export default function Contact() {
  const contacts = [
    {
      title: "Call Us",
      icon: "/assets/icons/phone.png",
      value: "+251 937 398 157",
      link: "tel:+251937398157",
    },
    {
      title: "Telegram Channel",
      icon: "/assets/icons/telegram.png",
      value: "t.me/habesha3661",
      link: "https://t.me/habesha3661",
    },
    {
      title: "Telegram Support",
      icon: "/assets/icons/telegram.png",
      value: "@habesha3661",
      link: "https://t.me/habesha3661",
    },
  ];

  return (
    <section
      id="contact-section"
      className="
      w-full
      bg-[#183b2a]

      px-5
      py-[clamp(50px,8vw,110px)]

      max-md:px-4
      max-md:py-[50px]
      "
    >
      <div
        className="
        mx-auto
        max-w-[850px]
        rounded-[24px]
        border
        border-white/10
        bg-[#122d35]
        p-[clamp(30px,5vw,60px)]
        shadow-[0_25px_60px_rgba(0,0,0,0.35)]

        max-md:px-[22px]
        max-md:py-[30px]

        max-[480px]:rounded-[18px]
        "
      >
        {/* Tag */}

        <span
          className="
          mb-5
          inline-block
          rounded-full
          bg-[#8b5e3c]
          px-[18px]
          py-2
          text-[0.85rem]
          tracking-[1px]
          text-white
          "
        >
          Contact Us
        </span>

        {/* Heading */}

        <h2
          className="
          mb-[18px]
          text-[clamp(2rem,5vw,2.8rem)]
          font-bold
          leading-tight
          text-white

          max-[480px]:text-[1.8rem]
          "
        >
          We're Here to Help
        </h2>

        {/* Description */}

        <p
          className="
          mb-10
          text-[clamp(.95rem,2vw,1.05rem)]
          leading-[1.9]
          text-[#c7d7d3]
          "
        >
          Have questions about our traditional Ethiopian clothing or want to
          place an order? Contact us directly through phone or Telegram. We are
          happy to assist you and respond as quickly as possible.
        </p>

        {/* Contact Cards */}

        <div className="flex flex-col gap-[22px]">
          {contacts.map((item, index) => (
            <div
              key={index}
              className="
              flex
              items-center
              gap-5
              rounded-[18px]
              border
              border-white/10
              bg-white/5
              p-[22px]
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-[#8b5e3c]
              hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)]

              max-md:p-[18px]

              max-[480px]:flex-col
              max-[480px]:text-center
              "
            >
              {/* Icon */}

              <div
                className="
                flex
                h-[65px]
                w-[65px]
                min-w-[65px]
                items-center
                justify-center
                rounded-full
                bg-[#8b5e3c]

                max-md:h-[55px]
                max-md:w-[55px]
                max-md:min-w-[55px]
                "
              >
                <img
                  src={item.icon}
                  alt={item.title}
                  className="
                  h-8
                  w-8
                  object-contain

                  max-md:h-[27px]
                  max-md:w-[27px]
                  "
                />
              </div>

              {/* Content */}

              <div
                className="
                flex
                flex-col
                gap-[7px]

                max-[480px]:items-center
                "
              >
                <h3 className="text-[1.1rem] font-semibold text-white">
                  {item.title}
                </h3>

                <a
                  href={item.link}
                  target={item.link.startsWith("http") ? "_blank" : undefined}
                  rel={
                    item.link.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="
                  break-all
                  text-base
                  font-semibold
                  text-[#4fbea3]
                  transition-colors
                  duration-300
                  hover:text-white

                  max-[480px]:text-[0.95rem]
                  "
                >
                  {item.value}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
