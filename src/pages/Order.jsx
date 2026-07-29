import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  FaShoppingBag,
  FaArrowLeft,
  FaPhone,
  FaMapMarkerAlt,
  FaCreditCard,
} from "react-icons/fa";

import { getProduct } from "../api/productApi";
import { createOrder } from "../api/OrderApi";

export default function Order() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const sizes = ["M", "L", "LL", "XL", "XXL"];

  const savedUser = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    quantity: 1,
    size: "M",
    color: "",
    phone: savedUser?.phone || "",
    address: savedUser?.address || "",
    note: "",
    paymentMethod: "Cash",
  });

  // Load Product

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProduct(id);

        setProduct(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    // User is not logged in
    if (!token) {
      localStorage.setItem("redirectAfterLogin", `/order/${id}`);

      navigate("/signin");

      return;
    }

    try {
      setSubmitting(true);

      const orderData = {
        productId: product._id,
        quantity: Number(formData.quantity),
        size: formData.size,
        color: formData.color,
        phone: formData.phone,
        address: formData.address,
        note: formData.note,
        paymentMethod: formData.paymentMethod,
      };

      await createOrder(orderData);

      alert("Order placed successfully");

      // remove old redirect after successful order
      localStorage.removeItem("redirectAfterLogin");

      navigate("/");
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Order failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-xl">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center text-xl">
        Product not found
      </div>
    );
  }

  return (
    <section
      className="
      min-h-screen
      bg-gradient-to-br
      from-[#f7f2e8]
      via-white
      to-[#e8d8aa]
      px-4
      pb-16
      pt-28
      "
    >
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => navigate(-1)}
          className="
          mb-8
          flex
          items-center
          gap-2
          rounded-xl
          bg-[#24312c]
          px-5
          py-3
          text-white
          shadow-lg
          "
        >
          <FaArrowLeft />
          Back
        </button>

        <div
          className="
          grid
          gap-8
          lg:grid-cols-2
          "
        >
          {/* Product Preview */}

          <div
            className="
            overflow-hidden
            rounded-3xl
            bg-white
            shadow-xl
            "
          >
            <img
              src={product.images?.[0]}
              alt={product.name}
              className="
              h-[420px]
              w-full
              object-cover
              "
            />

            <div className="p-6">
              <h1
                className="
                text-3xl
                font-bold
                text-[#24312c]
                "
              >
                {product.name}
              </h1>

              <p
                className="
                mt-3
                text-2xl
                font-bold
                text-[#d4af37]
                "
              >
                {product.price} ETB
              </p>
            </div>
          </div>

          {/* Order Form */}

          <form
            onSubmit={handleSubmit}
            className="
            rounded-3xl
            bg-white
            p-6
            shadow-xl
            sm:p-8
            "
          >
            <h2
              className="
              mb-6
              flex
              items-center
              gap-3
              text-2xl
              font-bold
              text-[#24312c]
              "
            >
              <FaShoppingBag className="text-[#d4af37]" />
              Place Order
            </h2>

            <InputLabel text="Quantity" />

            <input
              type="number"
              min="1"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className={inputStyle}
            />

            <InputLabel text="Size" />

            <select
              name="size"
              value={formData.size}
              onChange={handleChange}
              className={inputStyle}
            >
              {sizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            <InputLabel text="Color" />

            <input
              name="color"
              placeholder="Example: Black"
              value={formData.color}
              onChange={handleChange}
              className={inputStyle}
            />

            <InputLabel text="Phone Number" />

            <div className={boxStyle}>
              <FaPhone className="text-[#d4af37]" />

              <input
                name="phone"
                placeholder="09XXXXXXXX"
                value={formData.phone}
                onChange={handleChange}
                className="
                w-full
                bg-transparent
                py-3
                text-[#24312c]
                outline-none
                "
              />
            </div>

            <InputLabel text="Delivery Address" />

            <div className={boxStyle}>
              <FaMapMarkerAlt className="text-[#d4af37]" />

              <textarea
                name="address"
                placeholder="Your address"
                value={formData.address}
                onChange={handleChange}
                className="
                w-full
                bg-transparent
                py-3
                text-[#24312c]
                outline-none
                "
              />
            </div>

            <InputLabel text="Payment Method" />

            <div className={boxStyle}>
              <FaCreditCard className="text-[#d4af37]" />

              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="
                w-full
                bg-transparent
                py-3
                text-[#24312c]
                outline-none
                "
              >
                <option>Cash</option>

                <option>Telebirr</option>

                <option>CBE</option>

                <option>Bank</option>
              </select>
            </div>

            <InputLabel text="Note" />

            <textarea
              name="note"
              placeholder="Additional note"
              value={formData.note}
              onChange={handleChange}
              className={inputStyle}
            />

            <button
              disabled={submitting}
              className="
              mt-5
              flex
              w-full
              items-center
              justify-center
              gap-3
              rounded-xl
              bg-[#d4af37]
              py-4
              font-bold
              text-white
              transition
              hover:bg-[#b89025]
              disabled:opacity-50
              "
            >
              <FaShoppingBag />

              {submitting ? "Placing..." : "Confirm Order"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function InputLabel({ text }) {
  return (
    <label
      className="
mb-2
mt-4
block
text-sm
font-semibold
text-[#24312c]
"
    >
      {text}
    </label>
  );
}

const inputStyle = `
w-full
rounded-xl
border
border-gray-300
bg-white
px-4
py-3
text-[#24312c]
placeholder:text-gray-400
outline-none
focus:border-[#d4af37]
`;

const boxStyle = `
mb-2
flex
items-center
gap-3
rounded-xl
border
border-gray-300
px-4
focus-within:border-[#d4af37]
`;
