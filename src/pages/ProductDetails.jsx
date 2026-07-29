import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaHeart,
  FaShareAlt,
  FaShoppingBag,
  FaArrowLeft,
} from "react-icons/fa";

import { getProduct } from "../api/productApi";

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProduct(id);
        setProduct(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-xl">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center text-xl">
        Product not found.
      </div>
    );
  }

  return (
    <section
      className="
      min-h-screen
      bg-[#f8f8f8]
      px-4
      pb-20
      pt-28
      sm:px-6
      lg:px-10
      "
    >
      <div className="mx-auto max-w-7xl">
        {/* Back Button */}

        <Link
          to="/"
          className="
          mb-8
          inline-flex
          items-center
          gap-2
          rounded-xl
          bg-[#24312c]
          px-5
          py-3
          text-sm
          font-semibold
          text-white
          transition
          hover:bg-[#1a2420]
          sm:text-base
          "
        >
          <FaArrowLeft />
          Back
        </Link>

        <div
          className="
          grid
          gap-8
          lg:grid-cols-2
          lg:gap-14
          "
        >
          {/* IMAGE SECTION */}

          <div>
            <div
              className="
              overflow-hidden
              rounded-3xl
              bg-white
              shadow-lg
              "
            >
              <img
                src={product.images?.[activeImage]}
                alt={product.name}
                className="
                h-[350px]
                w-full
                object-cover

                sm:h-[450px]

                lg:h-[550px]
                "
              />
            </div>

            {/* Thumbnails */}

            <div
              className="
              mt-5
              flex
              max-w-full
              gap-3
              overflow-x-auto
              pb-2
              "
            >
              {product.images?.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`
                  flex-shrink-0
                  overflow-hidden
                  rounded-xl
                  border-2

                  ${
                    activeImage === index
                      ? "border-[#d4af37]"
                      : "border-transparent"
                  }

                  `}
                >
                  <img
                    src={img}
                    alt=""
                    className="
                    h-20
                    w-20
                    object-cover

                    sm:h-24
                    sm:w-24
                    "
                  />
                </button>
              ))}
            </div>
          </div>

          {/* PRODUCT INFO */}

          <div
            className="
            flex
            flex-col
            justify-center
            "
          >
            <span
              className="
              w-fit
              rounded-full
              bg-[#d4af37]
              px-4
              py-2
              text-sm
              font-semibold
              text-white
              "
            >
              {product.category}
            </span>

            <h1
              className="
              mt-5
              text-3xl
              font-bold
              leading-tight
              text-[#24312c]

              sm:text-4xl

              lg:text-5xl
              "
            >
              {product.name}
            </h1>

            <h2
              className="
              mt-5
              text-2xl
              font-bold
              text-[#d4af37]

              sm:text-3xl
              "
            >
              {product.price} ETB
            </h2>

            <p
              className="
              mt-6
              text-sm
              leading-7
              text-gray-700

              sm:text-base
              "
            >
              {product.description}
            </p>

            {/* Details */}

            <div
              className="
              mt-7
              space-y-3
              rounded-2xl
              bg-white
              p-5
              shadow-sm
              "
            >
              <p>
                <strong>Stock:</strong> {product.stock}
              </p>

              <p>
                <strong>Status:</strong> {product.status}
              </p>

              <p>
                <strong>Category:</strong> {product.category}
              </p>
            </div>

            {/* ACTION BUTTONS */}

            <div
              className="
              mt-8
              flex
              flex-col
              gap-3

              sm:flex-row
              sm:flex-wrap
              "
            >
              <button
                className="
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-gray-300
                px-6
                py-3
                transition
                hover:bg-gray-100
                "
              >
                <FaHeart />
                Like
              </button>

              <button
                className="
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-gray-300
                px-6
                py-3
                transition
                hover:bg-gray-100
                "
              >
                <FaShareAlt />
                Share
              </button>

              <Link
                to={`/order/${product._id}`}
                className="
                flex
                items-center
                justify-center
                gap-3
                rounded-xl
                bg-[#d4af37]
                px-8
                py-3
                font-bold
                text-white
                transition
                hover:bg-[#b88b21]
                "
              >
                <FaShoppingBag />
                Order Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
