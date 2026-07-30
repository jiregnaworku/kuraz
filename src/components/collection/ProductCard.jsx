import { useEffect, useState } from "react";
import {
  FaHeart,
  FaShareAlt,
  FaShoppingBag,
  FaEye,
  FaCommentDots,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toggleLike } from "../../api/productApi";
import CommentModal from "../CommentModal";

export default function ProductCard({ product }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(product.likes || 0);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentsCount, setCommentsCount] = useState(
    product.commentsCount || 0,
  );

  const navigate = useNavigate();

  // ==========================
  // Image Slider
  // ==========================
  useEffect(() => {
    if (!product.images || product.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % product.images.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [product.images]);

  // ==========================
  // Check User Like
  // ==========================
  useEffect(() => {
    const likedProducts = JSON.parse(
      localStorage.getItem("likedProducts") || "[]",
    );
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLiked(likedProducts.includes(product._id));
  }, [product._id]);

  // ==========================
  // Order
  // ==========================
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

  // ==========================
  // Like Product
  // ==========================
  const handleLike = async () => {
    try {
      const data = await toggleLike(product._id);

      setLikesCount(data.likes);
      setLiked(data.liked);

      const likedProducts = JSON.parse(
        localStorage.getItem("likedProducts") || "[]",
      );

      if (data.liked) {
        if (!likedProducts.includes(product._id)) {
          likedProducts.push(product._id);
        }
        localStorage.setItem("likedProducts", JSON.stringify(likedProducts));
      } else {
        const updated = likedProducts.filter((id) => id !== product._id);
        localStorage.setItem("likedProducts", JSON.stringify(updated));
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ==========================
  // Share Product
  // ==========================
  const handleShare = async () => {
    const url = `${window.location.origin}/product/${product._id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url,
        });
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        // User cancelled the share dialog — ignore
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert("Product link copied.");
      } catch (error) {
        console.error("Failed to copy link:", error);
      }
    }
  };

  return (
    <div
      className="
        group relative flex flex-col overflow-hidden rounded-2xl bg-white
        border border-gray-100 shadow-sm transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl
        w-[85vw] min-w-[280px] max-w-[320px] shrink-0 snap-center
        sm:w-full sm:min-w-0 sm:max-w-none
      "
    >
      {/* ==========================
          IMAGE SECTION
      ========================== */}
      <div className="relative overflow-hidden bg-gray-100">
        {product.images?.length > 0 ? (
          <img
            src={product.images[currentImage]}
            alt={product.name}
            className="
              h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105
              sm:h-56 md:h-64
            "
          />
        ) : (
          <div className="flex h-40 items-center justify-center text-sm text-gray-400 sm:h-56 md:h-64">
            No Image
          </div>
        )}

        {/* Featured Badge */}
        {product.featured && (
          <span
            className="
              absolute left-2 top-2 rounded-full bg-[#d4af37] px-2 py-0.5
              text-[10px] font-bold uppercase tracking-wider text-white shadow-sm
              sm:px-3 sm:py-1 sm:text-xs
            "
          >
            Featured
          </span>
        )}

        {/* Slider Dots */}
        {product.images?.length > 1 && (
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5 sm:bottom-3">
            {product.images.map((_, i) => (
              <span
                key={i}
                className={`
                  h-1.5 rounded-full transition-all duration-300 sm:h-2
                  ${
                    currentImage === i
                      ? "w-4 bg-[#d4af37] sm:w-5"
                      : "w-1.5 bg-white/80 sm:w-2"
                  }
                `}
              />
            ))}
          </div>
        )}

        {/* ==========================
            Floating Actions
        ========================== */}
        <div className="absolute right-2 top-2 flex flex-col gap-1.5 sm:right-3 sm:top-3 sm:gap-2">
          <button
            onClick={handleLike}
            className={`
              flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm
              transition hover:scale-110 sm:h-10 sm:w-10 sm:shadow-lg
              ${liked ? "text-red-500" : "text-gray-500 hover:text-red-500"}
            `}
          >
            <FaHeart className="text-sm sm:text-base" />
          </button>

          <button
            onClick={() => setCommentOpen(true)}
            className="
              flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm
              text-[#24312c] shadow-sm transition hover:scale-110 hover:text-[#d4af37]
              sm:h-10 sm:w-10 sm:shadow-lg
            "
          >
            <FaCommentDots className="text-sm sm:text-base" />
          </button>

          <button
            onClick={handleShare}
            className="
              flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm
              text-[#24312c] shadow-sm transition hover:scale-110 hover:text-[#d4af37]
              sm:h-10 sm:w-10 sm:shadow-lg
            "
          >
            <FaShareAlt className="text-sm sm:text-base" />
          </button>
        </div>
      </div>

      {/* ==========================
          PRODUCT CONTENT
      ========================== */}
      <div className="flex flex-1 flex-col space-y-2 p-3 sm:space-y-3 sm:p-4">
        <div>
          <h3 className="truncate text-sm font-bold text-[#24312c] sm:text-base">
            {product.name}
          </h3>
          <p className="mt-0.5 text-[10px] uppercase tracking-wide text-gray-400 sm:text-xs">
            {product.category}
          </p>
          <p className="mt-2 hidden text-xs leading-5 text-gray-500 line-clamp-2 sm:block">
            {product.description}
          </p>
        </div>

        {/* Like & Comment Count */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-xs text-gray-500 sm:pt-3 sm:text-sm">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 transition sm:gap-2 ${
              liked ? "font-semibold text-red-500" : "hover:text-red-500"
            }`}
          >
            <FaHeart className="text-xs sm:text-sm" />
            <span>{likesCount}</span>
          </button>

          <button
            onClick={() => setCommentOpen(true)}
            className="flex items-center gap-1.5 transition hover:text-[#d4af37] sm:gap-2"
          >
            <FaCommentDots className="text-xs sm:text-sm" />
            <span>{commentsCount}</span>
          </button>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-base font-extrabold text-[#d4af37] sm:text-xl">
            {product.price} ETB
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto grid grid-cols-2 gap-2 sm:gap-3">
          <Link
            to={`/product/${product._id}`}
            className="
              flex h-10 w-10 items-center justify-center rounded-xl bg-[#24312c]
              text-xs font-semibold text-white transition hover:bg-[#18201d]
              sm:h-auto sm:w-auto sm:gap-2 sm:px-4 sm:py-3 sm:text-sm
            "
          >
            <FaEye className="text-sm sm:text-base" />
            <span className="hidden sm:inline">See More</span>
          </Link>

          <button
            onClick={handleOrder}
            className="
              flex h-10 w-10 items-center justify-center rounded-xl bg-[#d4af37]
              text-xs font-semibold text-white transition hover:bg-[#b88f1d]
              sm:h-auto sm:w-auto sm:gap-2 sm:px-4 sm:py-3 sm:text-sm
            "
          >
            <FaShoppingBag className="text-sm sm:text-base" />
            <span className="hidden sm:inline">Order</span>
          </button>
        </div>
      </div>

      {/* ==========================
          COMMENT MODAL
      ========================== */}
      <CommentModal
        open={commentOpen}
        onClose={() => setCommentOpen(false)}
        productId={product._id}
        setCommentsCount={setCommentsCount}
      />
    </div>
  );
}
