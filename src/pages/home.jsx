import { useEffect, useState } from "react";

import About from "../sections/about";
import Collection from "../components/collection/Collection";
import Contact from "../sections/contact";

const images = [
  "/assets/images/dress1.jpg",
  "/assets/images/dress2.jpg",
  "/assets/images/dress3.jpg",
  "/assets/images/dress4.jpg",
  "/assets/images/dress5.jpg",
  "/assets/images/dress6.jpg",
  "/assets/images/dress7.jpg",
  "/assets/images/dress8.jpg",
  "/assets/images/dress9.jpg",
  "/assets/images/dress10.jpg",
  "/assets/images/dress11.jpg",
  "/assets/images/dress12.jpg",
  "/assets/images/dress13.jpg",
  "/assets/images/dress14.jpg",
  "/assets/images/dress15.jpg",
  "/assets/images/dress16.jpg",
  "/assets/images/dress17.jpg",
];

export default function Home() {
  const [visible, setVisible] = useState(0);
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState([images[0], images[1]]);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextVisible = (visible + 1) % 2;
      const nextCurrent = (current + 1) % images.length;

      const updated = [...slides];
      updated[nextVisible] = images[nextCurrent];

      setSlides(updated);
      setVisible(nextVisible);
      setCurrent(nextCurrent);
    }, 5000);

    return () => clearInterval(interval);
  }, [visible, current, slides]);

  return (
    <>
      {/* ================= HERO ================= */}

      <section
        id="home"
        className="relative flex min-h-screen items-center justify-center overflow-hidden px-[30px] pt-[140px] pb-[70px] lg:px-[30px] lg:pt-[120px] lg:pb-[60px] md:px-5 md:pt-[110px] md:pb-[50px] max-[480px]:px-[18px] max-[480px]:pt-[100px] max-[480px]:pb-[40px]"
      >
        {/* Background Slider */}

        <div className="absolute inset-0 -z-20">
          {slides.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[1500ms] ${
                visible === index ? "opacity-100" : "opacity-0"
              } animate-[zoom_10s_linear_infinite]`}
              style={{
                backgroundImage: `url(${image})`,
              }}
            />
          ))}
        </div>

        {/* Dark Overlay */}

        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/35 to-black/70" />

        {/* Hero Content */}

        <div
          className="
            relative z-10
            w-full
            max-w-[900px]
            translate-y-[35px]
            text-center
            lg:translate-y-[25px]
            md:translate-y-[15px]
          "
        >
          {/* Small Title */}

          <span
            className="
              mb-[18px]
              inline-block
              text-[15px]
              font-semibold
              uppercase
              tracking-[6px]
              text-[#d4af37]
              md:text-[12px]
              md:tracking-[4px]
            "
          >
            Ethiopian Cultural Fashion
          </span>

          {/* Main Title */}

          <h1
            className="
              mb-3
              text-[clamp(3.2rem,8vw,6rem)]
              font-bold
              tracking-[4px]
              text-white
              drop-shadow-lg
              max-[480px]:tracking-[2px]
            "
          >
            ባህል ውበት ነዉ
          </h1>

          {/* Brand */}

          <h2
            className="
              mb-7
              text-[clamp(1.8rem,4vw,3rem)]
              font-light
              text-[#f2f2f2]
            "
          >
            Kuraz Design
          </h2>

          {/* Description */}

          <p
            className="
              mx-auto
              mb-[45px]
              max-w-[720px]
              text-[18px]
              leading-[1.9]
              text-[#ececec]
              md:text-[16px]
              max-[480px]:text-[15px]
              max-[480px]:leading-[1.8]
            "
          >
            Discover elegant Habesha cultural dresses crafted with Ethiopian
            tradition, timeless beauty, and modern creativity. Every design is
            carefully handmade to celebrate our rich cultural heritage while
            bringing elegance and authenticity to every occasion.
          </p>

          {/* Buttons */}

          <div className="flex flex-wrap items-center justify-center gap-[18px] md:flex-col">
            <a
              href="#collection"
              className="
                rounded-full
                bg-[#d4af37]
                px-[42px]
                py-4
                font-semibold
                tracking-[0.5px]
                text-white
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-[#b88b21]
                hover:shadow-[0_12px_30px_rgba(212,175,55,0.35)]
                md:w-[240px]
                max-[480px]:w-[220px]
              "
            >
              Explore Collection
            </a>

            <a
              href="#contact-section"
              className="
                rounded-full
                border-2
                border-white
                bg-transparent
                px-[42px]
                py-4
                font-semibold
                tracking-[0.5px]
                text-white
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-white
                hover:text-[#222]
                md:w-[240px]
                max-[480px]:w-[220px]
              "
            >
              Book Designer
            </a>
          </div>

          {/* Gold Line */}

          <div className="mx-auto mt-10 h-[3px] w-[90px] rounded-full bg-[#d4af37]" />
        </div>
      </section>

      {/* ================= OTHER SECTIONS ================= */}

      <About />

      <Collection />

      <Contact />
    </>
  );
}
