import { useEffect, useMemo, useState } from "react";
import { FaSearch, FaFilter, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

import { getProducts } from "../api/productApi";
import ProductCard from "../components/collection/ProductCard";
import { useLanguage } from "../context/LanguageContext";

export default function Collection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [price, setPrice] = useState("All");
  const [sort, setSort] = useState("default");
  const [showFilters, setShowFilters] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.category?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (category !== "All") {
      result = result.filter((product) => product.category === category);
    }

    if (price !== "All") {
      if (price === "low") {
        result = result.filter((product) => product.price <= 1000);
      }

      if (price === "medium") {
        result = result.filter(
          (product) => product.price > 1000 && product.price <= 3000,
        );
      }

      if (price === "high") {
        result = result.filter((product) => product.price > 3000);
      }
    }

    if (sort === "asc") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, search, category, price, sort]);

  return (
    <section className="min-h-screen bg-[#133337] px-3 sm:px-4 md:px-6 pb-16 sm:pb-20 pt-28 sm:pt-32 md:pt-36 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Back to Home Button */}
        <Link
          to="/"
          className="group mb-6 sm:mb-8 inline-flex items-center gap-2 rounded-lg border border-[#d4af37]/40 bg-[#1a3f44] px-4 py-2 sm:px-5 sm:py-2.5 text-sm sm:text-base font-medium text-[#d4af37] shadow-lg transition-all duration-300 hover:bg-[#1a3f44]/80 hover:border-[#d4af37] hover:shadow-xl hover:shadow-[#d4af37]/10 hover:-translate-y-0.5"
        >
          <FaArrowLeft className="text-sm transition-transform duration-300 group-hover:-translate-x-1" />
          <span>{t("") || "Back to Home"}</span>
        </Link>

        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#d4af37]">
            {t("collection.allCollection")}
          </h1>
          <div className="mx-auto mt-2 h-1 w-16 sm:w-20 rounded-full bg-gradient-to-r from-[#d4af37] to-[#f5d77a]"></div>
          <p className="mt-3 text-xs sm:text-sm lg:text-base text-[#c4d4cc] px-2">
            {t("collection.description")}
          </p>
        </div>

        {/* Simplified Filter Bar */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border border-[#1e4d52] bg-[#1a3f44]/80 p-3 sm:p-4 shadow-lg backdrop-blur-sm">
          {/* Search */}
          <div className="relative flex-1 min-w-0 sm:min-w-[180px] md:min-w-[200px]">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xs sm:text-sm text-[#d4af37]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("collection.searchPlaceholder")}
              className="w-full rounded-lg border border-[#1e4d52] bg-[#0f292c] py-2 sm:py-2.5 pl-8 sm:pl-9 pr-3 text-xs sm:text-sm text-[#e8f0ec] outline-none transition-colors placeholder:text-[#7a9e9b] focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
            />
          </div>

          {/* Sort and Filter Row */}
          <div className="flex gap-2 sm:gap-3">
            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="flex-1 sm:flex-none cursor-pointer rounded-lg border border-[#1e4d52] bg-[#0f292c] px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm text-[#e8f0ec] outline-none transition-colors focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
            >
              <option value="default">{t("collection.sort")}</option>
              <option value="asc">{t("collection.lowHigh")}</option>
              <option value="desc">{t("collection.highLow")}</option>
            </select>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 rounded-lg border border-[#1e4d52] px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-[#e8f0ec] transition-all hover:bg-[#1a3f44] hover:shadow-md"
            >
              <FaFilter className="text-[10px] sm:text-xs text-[#d4af37]" />
              <span className="hidden xs:inline">Filters</span>
              {(category !== "All" || price !== "All") && (
                <span className="flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-gradient-to-r from-[#d4af37] to-[#f5d77a] text-[10px] sm:text-xs text-[#133337] shadow-sm font-bold">
                  !
                </span>
              )}
            </button>
          </div>

          {/* Active Filters */}
          {(category !== "All" || price !== "All") && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2 w-full sm:w-auto">
              {category !== "All" && (
                <span className="inline-flex items-center gap-1 rounded-full border border-[#d4af37]/30 bg-[#1a3f44] px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs text-[#e8f0ec] shadow-sm">
                  {category}
                  <button
                    onClick={() => setCategory("All")}
                    className="ml-0.5 transition-colors hover:text-[#f5d77a]"
                  >
                    ×
                  </button>
                </span>
              )}
              {price !== "All" && (
                <span className="inline-flex items-center gap-1 rounded-full border border-[#d4af37]/30 bg-[#1a3f44] px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs text-[#e8f0ec] shadow-sm">
                  {price === "low"
                    ? t("collection.under1000")
                    : price === "medium"
                      ? t("collection.between1000And3000")
                      : t("collection.above3000")}
                  <button
                    onClick={() => setPrice("All")}
                    className="ml-0.5 transition-colors hover:text-[#f5d77a]"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mb-6 sm:mb-8 animate-fadeIn rounded-xl sm:rounded-2xl border border-[#1e4d52] bg-[#1a3f44]/90 p-4 sm:p-5 shadow-lg backdrop-blur-sm">
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 sm:mb-2 block text-[10px] sm:text-xs font-medium uppercase tracking-wider text-[#d4af37]">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full cursor-pointer rounded-lg border border-[#1e4d52] bg-[#0f292c] px-3 py-2 sm:py-2.5 text-xs sm:text-sm text-[#e8f0ec] outline-none transition-colors focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "All" ? t("collection.allCategories") : cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 sm:mb-2 block text-[10px] sm:text-xs font-medium uppercase tracking-wider text-[#d4af37]">
                  Price Range
                </label>
                <select
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full cursor-pointer rounded-lg border border-[#1e4d52] bg-[#0f292c] px-3 py-2 sm:py-2.5 text-xs sm:text-sm text-[#e8f0ec] outline-none transition-colors focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
                >
                  <option value="All">{t("collection.allPrices")}</option>
                  <option value="low">{t("collection.under1000")}</option>
                  <option value="medium">
                    {t("collection.between1000And3000")}
                  </option>
                  <option value="high">{t("collection.above3000")}</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid - Always 2 columns minimum */}
        {loading ? (
          <div className="flex items-center justify-center py-16 sm:py-20">
            <div className="h-6 w-6 sm:h-8 sm:w-8 animate-spin rounded-full border-3 sm:border-4 border-[#d4af37] border-t-transparent"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 sm:py-20 text-center">
            <p className="text-base sm:text-lg text-[#9bb5af]">
              {t("collection.noResults")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Product Count */}
        {!loading && filteredProducts.length > 0 && (
          <p className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-[#9bb5af]">
            Showing {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "product" : "products"}
          </p>
        )}
      </div>
    </section>
  );
}
