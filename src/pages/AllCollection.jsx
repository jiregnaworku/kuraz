import { useEffect, useMemo, useState } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";

import { getProducts } from "../api/productApi";
import ProductCard from "../components/collection/ProductCard";

export default function Collection() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [price, setPrice] = useState("All");

  const [sort, setSort] = useState("default");

  // Fetch Products

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

  // Categories

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  // Filtering

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search

    if (search) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.category?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Category

    if (category !== "All") {
      result = result.filter((product) => product.category === category);
    }

    // Price Filter

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

    // Sorting

    if (sort === "asc") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, search, category, price, sort]);

  return (
    <section
      className="
min-h-screen
bg-[#f6f7f8]
px-5
pb-20
pt-32
lg:px-14
"
    >
      <div
        className="
mx-auto
max-w-7xl
"
      >
        {/* Header */}

        <div
          className="
mb-12
text-center
"
        >
          <h1
            className="
text-5xl
font-bold
text-[#24312c]
"
          >
            Our Collection
          </h1>

          <p
            className="
mt-4
text-gray-600
"
          >
            Explore our complete Ethiopian fashion collection
          </p>
        </div>

        {/* Filters */}

        <div
          className="
mb-10
rounded-3xl
bg-white
p-6
shadow-lg
"
        >
          <div
            className="
grid
gap-5
md:grid-cols-4
"
          >
            {/* Search */}

            <div
              className="
relative
"
            >
              <FaSearch
                className="
absolute
left-4
top-4
text-gray-400
"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search dress..."
                className="
w-full
rounded-xl
border
py-3
pl-12
pr-4
text-[#24312c]
outline-none
focus:border-[#d4af37]
"
              />
            </div>

            {/* Category */}

            <div
              className="
relative
"
            >
              <FaFilter
                className="
absolute
left-4
top-4
text-gray-400
"
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="
w-full
rounded-xl
border
py-3
pl-12
text-[#24312c]
outline-none
focus:border-[#d4af37]
"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}

            <select
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="
rounded-xl
border
px-4
py-3
text-[#24312c]
outline-none
focus:border-[#d4af37]
"
            >
              <option value="All">All Prices</option>

              <option value="low">Under 1000 ETB</option>

              <option value="medium">1000 - 3000 ETB</option>

              <option value="high">Above 3000 ETB</option>
            </select>

            {/* Sort */}

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="
rounded-xl
border
px-4
py-3
text-[#24312c]
outline-none
focus:border-[#d4af37]
"
            >
              <option value="default">Sort</option>

              <option value="asc">Price Low → High</option>

              <option value="desc">Price High → Low</option>
            </select>
          </div>
        </div>

        {/* Products */}

        {loading ? (
          <p
            className="
text-center
text-xl
"
          >
            Loading collection...
          </p>
        ) : filteredProducts.length === 0 ? (
          <p
            className="
text-center
text-gray-500
"
          >
            No products found.
          </p>
        ) : (
          <div
            className="
grid
grid-cols-1
gap-6
sm:grid-cols-2
lg:grid-cols-3
xl:grid-cols-4
"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
