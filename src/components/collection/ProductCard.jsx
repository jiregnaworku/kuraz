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
import { getComments } from "../../api/commentApi"; // Add this import
import CommentModal from "../CommentModal";
import { useLanguage } from "../../context/LanguageContext";

export default function ProductCard({ product }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(product.likes || 0);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentsCount, setCommentsCount] = useState(
    product.commentsCount || 0,
  );
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    if (!product.images || product.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % product.images.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [product.images]);

  useEffect(() => {
    const likedProducts = JSON.parse(
      localStorage.getItem("likedProducts") || "[]",
    );
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLiked(likedProducts.includes(product._id));
  }, [product._id]);

  // Fetch actual comment count from API
  useEffect(() => {
    const fetchCommentCount = async () => {
      try {
        const data = await getComments(product._id);
        let commentsList = [];
        if (Array.isArray(data)) {
          commentsList = data;
        } else if (Array.isArray(data?.comments)) {
          commentsList = data.comments;
        } else if (Array.isArray(data?.data)) {
          commentsList = data.data;
        } else if (Array.isArray(data?.data?.comments)) {
          commentsList = data.data.comments;
        }
        setCommentsCount(commentsList.length);
      } catch (error) {
        console.error("Failed to fetch comment count:", error);
        // Keep the initial count if fetch fails
      }
    };

    if (product._id) {
      fetchCommentCount();
    }
  }, [product._id]);

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
    } catch {
      console.error("Failed to toggle like");
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/product/${product._id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url,
        });
      } catch {
        // User cancelled the share dialog.
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert(t("product.copied"));
      } catch (error) {
        console.error("Failed to copy link:", error);
      }
    }
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl w-full">
      <div className="relative w-full" style={{ paddingBottom: "100%" }}>
        {product.images?.length > 0 ? (
          <img
            src={product.images[currentImage]}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-sm text-gray-400">
            {t("product.noImage")}
          </div>
        )}

        {product.featured && (
          <span className="absolute left-2 top-2 rounded-full bg-[#d4af37] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm sm:px-3 sm:py-1 sm:text-xs">
            {t("product.featured")}
          </span>
        )}

        {product.images?.length > 1 && (
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5 sm:bottom-3">
            {product.images.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 sm:h-2 ${currentImage === i ? "w-4 bg-[#d4af37] sm:w-5" : "w-1.5 bg-white/80 sm:w-2"}`}
              />
            ))}
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-2 sm:p-3 md:p-4">
          <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-white">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1 sm:gap-2 transition ${liked ? "font-semibold text-red-400" : "hover:text-red-400"}`}
              >
                <FaHeart className="text-sm sm:text-base md:text-lg" />
                <span className="text-xs sm:text-sm md:text-base">
                  {likesCount}
                </span>
              </button>

              <button
                onClick={() => setCommentOpen(true)}
                className="flex items-center gap-1 sm:gap-2 transition hover:text-[#d4af37]"
              >
                <FaCommentDots className="text-sm sm:text-base md:text-lg" />
                <span className="text-xs sm:text-sm md:text-base">
                  {commentsCount}
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-xs sm:text-sm md:text-base font-extrabold text-[#d4af37]">
              {product.price} ETB
            </span>

            <div className="flex gap-1.5 sm:gap-2 md:gap-3">
              <Link
                to={`/product/${product._id}`}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30 sm:h-8 sm:w-8 md:h-9 md:w-9"
              >
                <FaEye className="text-xs sm:text-sm md:text-base" />
              </Link>

              <button
                onClick={handleShare}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30 sm:h-8 sm:w-8 md:h-9 md:w-9"
              >
                <FaShareAlt className="text-xs sm:text-sm md:text-base" />
              </button>

              <button
                onClick={handleOrder}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#d4af37] text-white transition hover:bg-[#b88f1d] sm:h-8 sm:w-8 md:h-9 md:w-9"
              >
                <FaShoppingBag className="text-xs sm:text-sm md:text-base" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <CommentModal
        open={commentOpen}
        onClose={() => setCommentOpen(false)}
        productId={product._id}
        setCommentsCount={setCommentsCount}
      />
    </div>
  );
}
