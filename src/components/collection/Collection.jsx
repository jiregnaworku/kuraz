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
    <section id="collection" className="bg-[#24312c] py-24 px-5 lg:px-14">
      {/* Header */}

      <div className="mx-auto mb-14 max-w-3xl text-center">
        <span className="text-sm font-semibold uppercase tracking-[6px] text-[#d4af37]">
          Our Collection
        </span>

        <h2 className="mt-4 text-5xl font-bold text-white md:text-4xl">
          Ethiopian Elegance
        </h2>

        <p className="mt-6 leading-8 text-gray-300">
          Explore our handcrafted Habesha cultural dresses inspired by Ethiopian
          heritage and designed with modern elegance.
        </p>
      </div>

      {/* Products */}

      {loading ? (
        <p className="text-center text-white">Loading collection...</p>
      ) : (
        <div
          className="
  mx-auto
  grid
  max-w-7xl
  grid-cols-2
  gap-3
  sm:gap-5
  lg:grid-cols-3
  xl:grid-cols-4
  "
        >
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <p className="col-span-full text-center text-lg text-white">
              No products available.
            </p>
          )}
        </div>
      )}

      {/* See More */}

      <div className="mt-14 flex justify-center">
        <Link
          to="/collection"
          className="flex items-center gap-3 rounded-full bg-[#d4af37] px-8 py-4 font-semibold text-white transition hover:bg-[#b88b21]"
        >
          See More Collection
          <FaArrowRight />
        </Link>
      </div>
    </section>
  );
}
