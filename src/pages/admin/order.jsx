import { useState } from "react";
import { FaArrowLeft, FaShoppingBag } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Order() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    telegram: "",
    city: "",
    address: "",
    size: "",
    quantity: 1,
    delivery: "Home Delivery",
    note: "",
  });

  // =====================================
  // TODO:
  // Replace with product from backend
  // const { id } = useParams();
  // Fetch product by id
  // =====================================

  const product = {
    id: 1,
    name: "Kuraz Traditional Dress",
    category: "Habesha Cultural Dress",
    image: "/assets/images/dress1.jpg",
    price: "Contact for Price",
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitOrder = (e) => {
    e.preventDefault();

    // =====================================
    // TODO:
    // POST /api/orders
    // axios.post("/api/orders",{
    //    productId:product.id,
    //    ...form
    // })
    // =====================================

    console.log(form);
  };

  return (
    <section className="min-h-screen bg-[#183b2a] py-32 px-5">
      <div className="mx-auto max-w-7xl">
        {/* Back */}

        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-3 text-white hover:text-[#d4af37]"
        >
          <FaArrowLeft />
          Back to Collection
        </Link>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Product */}

          <div className="rounded-3xl bg-[#122d35] p-8 shadow-2xl">
            <img
              src={product.image}
              alt={product.name}
              className="h-[550px] w-full rounded-3xl object-cover"
            />

            <h2 className="mt-8 text-3xl font-bold text-white">
              {product.name}
            </h2>

            <p className="mt-3 text-[#4fbea3]">{product.category}</p>

            <p className="mt-6 text-2xl font-bold text-[#d4af37]">
              {product.price}
            </p>

            <div className="mt-8 rounded-2xl border border-[#d4af37]/20 bg-[#183b2a] p-5">
              <h3 className="mb-3 text-lg font-semibold text-white">
                Ordering Information
              </h3>

              <ul className="space-y-2 text-gray-300">
                <li>✔ Handmade Ethiopian cultural clothing</li>
                <li>✔ Premium quality materials</li>
                <li>✔ Custom sizing available</li>
                <li>✔ Worldwide delivery</li>
              </ul>
            </div>
          </div>

          {/* Form */}

          <form
            onSubmit={submitOrder}
            className="rounded-3xl bg-[#122d35] p-8 shadow-2xl"
          >
            <h2 className="mb-8 text-4xl font-bold text-white">
              Complete Your Order
            </h2>

            <div className="grid gap-6">
              <input
                name="fullName"
                placeholder="Full Name"
                onChange={handleChange}
                className="rounded-xl border border-white/10 bg-[#183b2a] p-4 text-white outline-none focus:border-[#d4af37]"
              />

              <input
                name="phone"
                placeholder="Phone Number"
                onChange={handleChange}
                className="rounded-xl border border-white/10 bg-[#183b2a] p-4 text-white outline-none focus:border-[#d4af37]"
              />

              <input
                name="telegram"
                placeholder="Telegram Username"
                onChange={handleChange}
                className="rounded-xl border border-white/10 bg-[#183b2a] p-4 text-white outline-none focus:border-[#d4af37]"
              />

              <div className="grid gap-5 md:grid-cols-2">
                <select
                  name="size"
                  onChange={handleChange}
                  className="rounded-xl border border-white/10 bg-[#183b2a] p-4 text-white"
                >
                  <option>Choose Size</option>
                  <option>S</option>
                  <option>M</option>
                  <option>L</option>
                  <option>XL</option>
                  <option>XXL</option>
                </select>

                <input
                  type="number"
                  min="1"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  className="rounded-xl border border-white/10 bg-[#183b2a] p-4 text-white"
                />
              </div>

              <input
                name="city"
                placeholder="City"
                onChange={handleChange}
                className="rounded-xl border border-white/10 bg-[#183b2a] p-4 text-white"
              />

              <textarea
                rows="3"
                name="address"
                placeholder="Delivery Address"
                onChange={handleChange}
                className="rounded-xl border border-white/10 bg-[#183b2a] p-4 text-white"
              />

              <textarea
                rows="4"
                name="note"
                placeholder="Special Request (Optional)"
                onChange={handleChange}
                className="rounded-xl border border-white/10 bg-[#183b2a] p-4 text-white"
              />

              <div>
                <label className="mb-3 block font-semibold text-white">
                  Delivery Method
                </label>

                <div className="space-y-3 text-white">
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="delivery"
                      value="Home Delivery"
                      defaultChecked
                      onChange={handleChange}
                    />
                    Home Delivery
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="delivery"
                      value="Pickup"
                      onChange={handleChange}
                    />
                    Pickup
                  </label>
                </div>
              </div>

              <button className="mt-6 flex items-center justify-center gap-3 rounded-full bg-[#d4af37] py-4 text-lg font-semibold text-white transition hover:bg-[#b88b21]">
                <FaShoppingBag />
                Place Order
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
