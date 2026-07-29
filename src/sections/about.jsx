export default function About() {
  const features = [
    {
      title: "Worldwide",
      description: "Global delivery service",
    },
    {
      title: "Quality",
      description: "Premium cultural designs",
    },
    {
      title: "Heritage",
      description: "Tradition in every thread",
    },
  ];

  return (
    <section
      id="about"
      className="
      bg-[#405243]

      px-[8%]
      py-[120px]

      max-lg:px-[6%]
      max-lg:py-[90px]

      max-md:px-5
      max-md:py-[70px]
      "
    >
      <div
        className="
        grid
        grid-cols-[1fr_1.1fr]
        items-center
        gap-20

        max-lg:grid-cols-1
        max-lg:gap-[50px]
        "
      >
        {/* Image */}

        <div
          className="
          overflow-hidden
          rounded-[30px]
          shadow-[0_25px_60px_rgba(0,0,0,0.12)]
          "
        >
          <img
            src="/assets/images/dress5.jpg"
            alt="Kuraz Cultural Dress"
            className="
            h-[650px]
            w-full
            object-cover
            transition-transform
            duration-500
            hover:scale-110

            max-lg:h-[500px]

            max-md:h-[400px]

            max-[480px]:h-[320px]
            "
          />
        </div>

        {/* Content */}

        <div className="max-lg:text-center">
          <span
            className="
            mb-5
            inline-block
            rounded-full
            bg-[#d4af37]
            px-[18px]
            py-2
            text-[14px]
            text-white
            "
          >
            Our Story
          </span>

          <h2
            className="
            mb-[10px]
            text-[55px]
            text-[#fdfdfd]

            max-md:text-[40px]

            max-[480px]:text-[32px]
            "
          >
            ባህል ውበት ነዉ
          </h2>

          <h3
            className="
            mb-[30px]
            text-[30px]
            font-medium
            text-[#d4af37]

            max-md:text-[25px]
            "
          >
            Kuraz Design
          </h3>

          <p
            className="
            mb-[22px]
            text-[17px]
            leading-[1.9]
            text-[#f7f4f4]

            max-[480px]:text-[15px]
            "
          >
            At Kuraz Design, we deeply honor Ethiopia's rich cultural heritage.
            Our mission is to bring traditional Ethiopian attire to life while
            continuously meeting the evolving needs of our customers.
          </p>

          <p
            className="
            mb-[22px]
            text-[17px]
            leading-[1.9]
            text-[#f7f4f4]

            max-[480px]:text-[15px]
            "
          >
            Inspired by the beauty and craftsmanship of our ancestors, every
            design represents culture, identity, and timeless Ethiopian fashion.
            We preserve the elegance of tradition while combining it with modern
            creativity.
          </p>

          <p
            className="
            mb-[22px]
            text-[17px]
            leading-[1.9]
            text-[#f7f4f4]

            max-[480px]:text-[15px]
            "
          >
            Through customer feedback, appreciation, and collaboration, we
            remain committed to delivering professional service, high-quality
            designs, and beautiful clothing experiences for customers around the
            world.
          </p>

          {/* Features */}

          <div
            className="
            mt-10
            grid
            grid-cols-3
            gap-5

            max-md:grid-cols-1
            "
          >
            {features.map((feature) => (
              <div
                key={feature.title}
                className="
                rounded-[20px]
                bg-[rgb(15,131,146)]
                p-[25px]
                shadow-[0_15px_40px_rgba(0,0,0,0.06)]
                transition-all
                duration-300
                hover:-translate-y-2
                "
              >
                <strong
                  className="
                  mb-[10px]
                  block
                  text-[18px]
                  text-white
                  "
                >
                  {feature.title}
                </strong>

                <span className="text-[15px] text-[#dad3d3]">
                  {feature.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
