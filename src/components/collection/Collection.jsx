import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

import { getProducts } from "../../api/productApi";
import ProductCard from "./ProductCard";

export default function Collection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
      {/* Header */}
      <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
        <span className="text-xs font-semibold uppercase tracking-[4px] text-[#d4af37] sm:text-sm sm:tracking-[6px]">
          Our Collection
        </span>

        <h2 className="mt-3 text-3xl font-bold text-white sm:mt-4 sm:text-4xl md:text-5xl">
          Ethiopian Elegance
        </h2>

        <p className="mt-4 text-sm leading-7 text-gray-300 sm:mt-6 sm:text-base sm:leading-8">
          Explore our handcrafted Habesha cultural dresses inspired by Ethiopian
          heritage and designed with modern elegance.
        </p>
      </div>

      {/* Products Container: Hybrid Flex (Mobile) / Grid (Desktop) */}
      {loading ? (
        <p className="text-center text-white">Loading collection...</p>
      ) : (
        <div
          className="
            mx-auto flex max-w-7xl 
            overflow-x-auto snap-x snap-mandatory 
            gap-4 pb-8 px-2 
            [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
            
            /* Desktop Grid Override */
            md:grid md:grid-cols-2 md:overflow-visible md:snap-none md:pb-0 md:px-0 md:gap-5 
            lg:grid-cols-3 xl:grid-cols-4
          "
        >
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <p className="w-full text-center text-base text-white sm:text-lg">
              No products available.
            </p>
          )}
        </div>
      )}

      {/* See More */}
      <div className="mt-10 flex justify-center sm:mt-14">
        <Link
          to="/collection"
          className="
            flex items-center gap-2 rounded-full bg-[#d4af37] px-6 py-3 
            text-sm font-semibold text-white transition hover:bg-[#b88b21]
            sm:gap-3 sm:px-8 sm:py-4 sm:text-base
          "
        >
          See More Collection
          <FaArrowRight className="text-xs sm:text-sm" />
        </Link>
      </div>
    </section>
  );
}
