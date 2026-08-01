import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

import { getProducts } from "../../api/productApi";
import ProductCard from "./ProductCard";
import { useLanguage } from "../../context/LanguageContext";

export default function Collection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <section
      id="collection"
      className="bg-[#24312c] py-16 px-4 sm:py-24 sm:px-5 lg:px-14"
    >
      <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
        <span className="text-xs font-semibold uppercase tracking-[4px] text-[#d4af37] sm:text-sm sm:tracking-[6px]">
          {t("collection.tag")}
        </span>

        <h2 className="mt-3 text-3xl font-bold text-white sm:mt-4 sm:text-4xl md:text-5xl">
          {t("collection.title")}
        </h2>

        <p className="mt-4 text-sm leading-7 text-gray-300 sm:mt-6 sm:text-base sm:leading-8">
          {t("collection.description")}
        </p>
      </div>

      {loading ? (
        <p className="text-center text-white">{t("collection.loading")}</p>
      ) : (
        <div
          className="
            mx-auto grid max-w-7xl 
            grid-cols-2 gap-4 px-2
            sm:grid-cols-3
            lg:grid-cols-4
          "
        >
          {products.length > 0 ? (
            products
              .slice(0, 10)
              .map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
          ) : (
            <p className="w-full text-center text-base text-white sm:text-lg">
              {t("collection.empty")}
            </p>
          )}
        </div>
      )}

      <div className="mt-10 flex justify-center sm:mt-14">
        <Link
          to="/collection"
          className="
            flex items-center gap-2 rounded-full bg-[#d4af37] px-6 py-3 
            text-sm font-semibold text-white transition hover:bg-[#b88b21]
            sm:gap-3 sm:px-8 sm:py-4 sm:text-base
          "
        >
          {t("collection.more")}
          <FaArrowRight className="text-xs sm:text-sm" />
        </Link>
      </div>
    </section>
  );
}
