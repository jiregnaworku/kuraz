import { useEffect, useState } from "react";
import { FaHeart, FaShareAlt, FaShoppingBag, FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const [currentImage, setCurrentImage] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (!product.images || product.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % product.images.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [product.images]);

  const handleOrder = () => {
    const token = localStorage.getItem("token");

    const orderPage = `/order/${product._id}`;

    if (token) {
      navigate(orderPage);
    } else {
      localStorage.setItem("redirectAfterLogin", orderPage);

      navigate("/signin");
    }
  };

  return (
    <div
      className="
group
overflow-hidden
rounded-xl
bg-white
shadow-md
transition
duration-300
hover:-translate-y-1
hover:shadow-xl
"
    >
      {/* IMAGE */}

      <div className="relative overflow-hidden">
        {product.images?.length > 0 ? (
          <img
            src={product.images[currentImage]}
            alt={product.name}
            className="
h-36
w-full
object-cover
transition
duration-500
group-hover:scale-105

sm:h-44

md:h-52
"
          />
        ) : (
          <div
            className="
flex
h-36
items-center
justify-center
bg-gray-200
text-xs
text-gray-500
"
          >
            No Image
          </div>
        )}

        {/* Dots */}

        {product.images?.length > 1 && (
          <div
            className="
absolute
bottom-2
left-1/2
flex
-translate-x-1/2
gap-1
"
          >
            {product.images.map((_, i) => (
              <span
                key={i}
                className={`
h-1.5
rounded-full
transition-all
${currentImage === i ? "w-4 bg-[#d4af37]" : "w-1.5 bg-white"}
`}
              />
            ))}
          </div>
        )}

        {/* Featured */}

        {product.featured && (
          <span
            className="
absolute
left-2
top-2
rounded-full
bg-[#d4af37]
px-2
py-1
text-[10px]
font-bold
text-white
"
          >
            Featured
          </span>
        )}

        {/* Actions */}

        <div
          className="
absolute
right-2
top-2
flex
flex-col
gap-1
"
        >
          <button
            className="
flex
h-7
w-7
items-center
justify-center
rounded-full
bg-white
text-xs
text-red-500
shadow
"
          >
            <FaHeart />
          </button>

          <button
            className="
flex
h-7
w-7
items-center
justify-center
rounded-full
bg-white
text-xs
shadow
"
          >
            <FaShareAlt />
          </button>
        </div>
      </div>

      {/* CONTENT */}

      <div
        className="
space-y-2
p-3
"
      >
        <h3
          className="
truncate
text-sm
font-bold
text-[#24312c]
sm:text-base
"
        >
          {product.name}
        </h3>

        <p
          className="
text-xs
text-gray-500
"
        >
          {product.category}
        </p>

        <p
          className="
line-clamp-2
text-xs
text-gray-600
"
        >
          {product.description}
        </p>

        <div
          className="
flex
justify-between
border-y
py-2
text-xs
text-gray-500
"
        >
          <span>❤️ {product.likes || 0}</span>

          <span>💬 {product.comments || 0}</span>
        </div>

        <div
          className="
flex
items-center
justify-between
"
        >
          <span
            className="
text-sm
font-bold
text-[#d4af37]
sm:text-base
"
          >
            {product.price} ETB
          </span>
        </div>

        {/* Buttons */}

        <div
          className="
grid
grid-cols-2
gap-2
"
        >
          <Link
            to={`/product/${product._id}`}
            className="
flex
items-center
justify-center
gap-1
rounded-lg
bg-[#24312c]
py-2
text-xs
font-semibold
text-white
transition
hover:bg-[#1b2521]
"
          >
            <FaEye />

            <span className="hidden sm:inline">See More</span>
          </Link>

          <button
            onClick={handleOrder}
            className="
flex
items-center
justify-center
gap-1
rounded-lg
bg-[#d4af37]
py-2
text-xs
font-semibold
text-white
transition
hover:bg-[#bb9223]
"
          >
            <FaShoppingBag />

            <span className="hidden sm:inline">Order</span>
          </button>
        </div>
      </div>
    </div>
  );
}
