import { FaTimes, FaShoppingBag } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function ProductModal({ product, close }) {
  if (!product) return null;

  return (
    <div
      className="
      fixed
      inset-0
      z-[2000]
      flex
      items-center
      justify-center
      bg-black/70
      px-5
      backdrop-blur-sm
      "
      onClick={close}
    >
      <div
        className="
        relative
        w-full
        max-w-4xl
        overflow-hidden
        rounded-3xl
        bg-[#24312c]
        shadow-2xl
        "
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          className="
          absolute
          right-5
          top-5
          z-10
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          bg-white/20
          text-white
          transition
          hover:bg-[#d4af37]
          "
        >
          <FaTimes />
        </button>

        <div className="grid md:grid-cols-2">
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="
            h-full
            min-h-[400px]
            w-full
            object-cover
            "
          />

          <div
            className="
            flex
            flex-col
            justify-center
            p-8
            "
          >
            <h2
              className="
              text-3xl
              font-bold
              text-white
              "
            >
              {product.name}
            </h2>

            <p
              className="
              mt-3
              text-[#d4af37]
              "
            >
              {product.category}
            </p>

            <p
              className="
              mt-5
              leading-7
              text-gray-300
              "
            >
              {product.description ||
                "Beautiful Ethiopian traditional dress handcrafted with premium quality materials."}
            </p>

            <h3
              className="
              mt-6
              text-2xl
              font-bold
              text-white
              "
            >
              {product.price ? `${product.price} ETB` : "Price on request"}
            </h3>

            <Link
              to={`/order/${product._id}`}
              className="
              mt-8
              flex
              items-center
              justify-center
              gap-3
              rounded-xl
              bg-[#d4af37]
              py-4
              font-semibold
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
  );
}
