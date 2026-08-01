import { useEffect, useMemo, useState } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";

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
    <section className="min-h-screen bg-[#f6f7f8] px-5 pb-20 pt-32 lg:px-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-[#24312c]">
            {t("collection.allCollection")}
          </h1>

          <p className="mt-4 text-gray-600">{t("collection.description")}</p>
        </div>

        <div className="mb-10 rounded-3xl bg-white p-6 shadow-lg">
          <div className="grid gap-5 md:grid-cols-4">
            <div className="relative">
              <FaSearch className="absolute left-4 top-4 text-gray-400" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("collection.searchPlaceholder")}
                className="w-full rounded-xl border py-3 pl-12 pr-4 text-[#24312c] outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="relative">
              <FaFilter className="absolute left-4 top-4 text-gray-400" />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border py-3 pl-12 text-[#24312c] outline-none focus:border-[#d4af37]"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "All" ? t("collection.allCategories") : cat}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="rounded-xl border px-4 py-3 text-[#24312c] outline-none focus:border-[#d4af37]"
            >
              <option value="All">{t("collection.allPrices")}</option>
              <option value="low">{t("collection.under1000")}</option>
              <option value="medium">
                {t("collection.between1000And3000")}
              </option>
              <option value="high">{t("collection.above3000")}</option>
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border px-4 py-3 text-[#24312c] outline-none focus:border-[#d4af37]"
            >
              <option value="default">{t("collection.sort")}</option>
              <option value="asc">{t("collection.lowHigh")}</option>
              <option value="desc">{t("collection.highLow")}</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-xl">{t("collection.loading")}</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500">
            {t("collection.noResults")}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
