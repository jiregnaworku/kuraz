import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaShoppingBag,
  FaArrowLeft,
  FaPhone,
  FaMapMarkerAlt,
  FaCreditCard,
  FaTshirt,
  FaPalette,
  FaHashtag,
  FaClipboardList,
  FaShieldAlt,
  FaTruck,
  FaClock,
  FaTimes,
  FaCheckCircle,
  FaInfoCircle,
} from "react-icons/fa";
import { getProduct } from "../api/productApi";
import { createOrder } from "../api/OrderApi";
import { useLanguage } from "../context/LanguageContext";

export default function Order() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [stockError, setStockError] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const sizes = ["S", "M", "L", "XL", "XXL", "XXXL"];
  const savedUser = JSON.parse(localStorage.getItem("user"));
  const { t } = useLanguage();

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
        setLoading(true);
        const data = await getProduct(id);
        setProduct(data);
        setStockError(false);
      } catch (error) {
        console.error("Error loading product:", error);
        alert(t("order.loadFailed"));
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate quantity against stock
    if (name === "quantity" && product) {
      const qty = parseInt(value) || 0;
      if (qty > product.stock) {
        setStockError(true);
      } else {
        setStockError(false);
      }
    }
  };

  // Open confirmation dialog
  const handleOpenConfirm = (e) => {
    e.preventDefault();

    // Validate quantity
    if (formData.quantity > product.stock) {
      alert(`${product.stock} ${t("order.onlyStock")}`);
      return;
    }

    const token = localStorage.getItem("token");

    // User is not logged in
    if (!token) {
      localStorage.setItem("redirectAfterLogin", `/order/${id}`);
      alert(t("order.loginToOrder"));
      navigate("/signin");
      return;
    }

    // Validate required fields
    if (!formData.phone) {
      alert(t("order.enterPhone"));
      return;
    }
    if (!formData.address) {
      alert(t("order.enterAddress"));
      return;
    }
    if (!formData.color) {
      alert(t("order.selectColor"));
      return;
    }

    // Show confirmation dialog
    setShowConfirmDialog(true);
  };

  // Confirm and place order
  const handleConfirmOrder = async () => {
    try {
      setSubmitting(true);
      setShowConfirmDialog(false);

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

      alert(t("order.orderSuccess"));

      // Clear redirect after successful order
      localStorage.removeItem("redirectAfterLogin");

      // Navigate to orders page
      setTimeout(() => {
        navigate("/profile/orders");
      }, 1500);
    } catch (error) {
      console.error("Order error:", error);

      const errorMessage =
        error.response?.data?.message || t("order.orderFailed");
      alert(errorMessage);

      if (
        error.response?.status === 400 &&
        error.response?.data?.message?.includes("stock")
      ) {
        setStockError(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelOrder = () => {
    setShowConfirmDialog(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-[#d4af37] border-t-transparent"></div>
          <p className="mt-4 text-gray-500">{t("order.loading")}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="text-6xl text-gray-300 mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-[#24312c]">{t("order.notFoundTitle")}</h2>
        <p className="text-gray-500 mt-2">{t("order.notFoundBody")}</p>
        <button
          onClick={() => navigate("/home")}
          className="mt-6 rounded-xl bg-[#d4af37] px-8 py-3 font-medium text-white transition hover:bg-[#b88f1d]"
        >
          {t("order.backToShopping")}
        </button>
      </div>
    );
  }

  const totalPrice = product.price * formData.quantity;

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#f7f2e8] via-white to-[#e8d8aa] px-4 pb-16 pt-24">
      <div className="mx-auto max-w-7xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="group mb-8 flex items-center gap-2 rounded-xl bg-[#24312c] px-6 py-3 text-white shadow-lg transition hover:bg-[#18201d] hover:shadow-xl"
        >
          <FaArrowLeft className="transition-transform group-hover:-translate-x-1" />
          {t("order.back")}
        </button>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Product Preview - Left Side */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 overflow-hidden rounded-3xl bg-white shadow-2xl">
              {/* Product Image */}
              <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-[420px] w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-[420px] w-full items-center justify-center bg-gray-100">
                    <FaShoppingBag className="text-6xl text-gray-300" />
                  </div>
                )}

                {/* Stock Badge */}
                <div className="absolute left-4 top-4 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold shadow-lg backdrop-blur-sm">
                  {product.stock > 0 ? (
                    <span className="text-green-600">
                      ✓ {t("order.inStock")} ({product.stock} available)
                    </span>
                  ) : (
                    <span className="text-red-500">{t("order.outOfStock")}</span>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h1 className="text-2xl font-bold text-[#24312c]">
                  {product.name}
                </h1>
                <p className="mt-2 text-sm text-gray-500">{product.category}</p>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[#d4af37]">
                    {product.price.toLocaleString()} ETB
                  </span>
                  <span className="text-sm text-gray-400">{t("order.perItem")}</span>
                </div>

                {product.description && (
                  <div className="mt-4 rounded-xl bg-gray-50 p-4">
                    <p className="text-sm text-gray-600">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Order Summary */}
                <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                  <h3 className="mb-3 font-semibold text-[#24312c]">
                    Order Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t("order.perItem")}</span>
                      <span className="font-medium">
                        {product.price.toLocaleString()} ETB
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t("order.quantity")}</span>
                      <span className="font-medium">× {formData.quantity}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2">
                      <span className="font-semibold text-[#24312c]">{t("order.totalAmount")}</span>
                      <span className="text-xl font-bold text-[#d4af37]">
                        {totalPrice.toLocaleString()} ETB
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="rounded-xl bg-green-50 p-3 text-center">
                    <FaTruck className="mx-auto text-green-600" />
                    <p className="mt-1 text-xs text-gray-600">{t("order.freeDelivery")}</p>
                  </div>
                  <div className="rounded-xl bg-blue-50 p-3 text-center">
                    <FaShieldAlt className="mx-auto text-blue-600" />
                    <p className="mt-1 text-xs text-gray-600">{t("order.secureOrder")}</p>
                  </div>
                  <div className="rounded-xl bg-purple-50 p-3 text-center">
                    <FaClock className="mx-auto text-purple-600" />
                    <p className="mt-1 text-xs text-gray-600">{t("order.support247")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Form - Right Side */}
          <div className="lg:col-span-3">
            <form
              onSubmit={handleOpenConfirm}
              className="rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
            >
              <div className="mb-8 flex items-center gap-3">
                <div className="rounded-full bg-[#d4af37]/10 p-3">
                  <FaClipboardList className="text-2xl text-[#d4af37]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#24312c]">
                    Place Your Order
                  </h2>
                  <p className="text-sm text-gray-500">
                    Fill in the details below to complete your order
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Quantity & Size Row */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#24312c]">
                      <FaHashtag className="text-[#d4af37]" />
                      {t("order.quantity")}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      className={`w-full rounded-xl border px-4 py-3 text-[#24312c] outline-none transition focus:border-[#d4af37] ${
                        stockError ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {stockError && (
                      <p className="mt-1 text-sm text-red-500">
                        Only {product.stock} items available
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#24312c]">
                      <FaTshirt className="text-[#d4af37]" />
                      {t("order.size")}
                    </label>
                    <select
                      name="size"
                      value={formData.size}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[#24312c] outline-none transition focus:border-[#d4af37]"
                    >
                      {sizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Color */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#24312c]">
                    <FaPalette className="text-[#d4af37]" />
                    {t("order.color")}
                  </label>
                  <input
                    name="color"
                    placeholder="e.g., Black, White, Blue"
                    value={formData.color}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[#24312c] placeholder:text-gray-400 outline-none transition focus:border-[#d4af37]"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#24312c]">
                    <FaPhone className="text-[#d4af37]" />
                    {t("order.phone")}
                  </label>
                  <div className="flex items-center gap-3 rounded-xl border border-gray-300 px-4 transition focus-within:border-[#d4af37]">
                    <FaPhone className="text-[#d4af37]" />
                    <input
                      name="phone"
                      placeholder="09XXXXXXXX"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-transparent py-3 text-[#24312c] outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#24312c]">
                    <FaMapMarkerAlt className="text-[#d4af37]" />
                    {t("order.deliveryAddress")}
                  </label>
                  <div className="flex items-start gap-3 rounded-xl border border-gray-300 px-4 transition focus-within:border-[#d4af37]">
                    <FaMapMarkerAlt className="mt-3 text-[#d4af37]" />
                    <textarea
                      name="address"
                      placeholder="Enter your full delivery address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full bg-transparent py-3 text-[#24312c] outline-none"
                      rows="2"
                      required
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#24312c]">
                    <FaCreditCard className="text-[#d4af37]" />
                    {t("order.paymentMethod")}
                  </label>
                  <div className="flex items-center gap-3 rounded-xl border border-gray-300 px-4 transition focus-within:border-[#d4af37]">
                    <FaCreditCard className="text-[#d4af37]" />
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                      className="w-full bg-transparent py-3 text-[#24312c] outline-none"
                    >
                      <option value="Cash">{t("order.paymentCash")}</option>
                      <option value="Telebirr">{t("order.paymentTelebirr")}</option>
                      <option value="CBE">{t("order.paymentCbe")}</option>
                      <option value="Bank">{t("order.paymentBank")}</option>
                    </select>
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#24312c]">
                    <FaClipboardList className="text-[#d4af37]" />
                    {t("order.note")}
                  </label>
                  <textarea
                    name="note"
                    placeholder="Any special instructions for delivery..."
                    value={formData.note}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[#24312c] placeholder:text-gray-400 outline-none transition focus:border-[#d4af37]"
                    rows="2"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting || stockError || product.stock === 0}
                  className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b88f1d] py-4 font-bold text-white transition hover:shadow-lg hover:shadow-[#d4af37]/30 disabled:opacity-50 disabled:hover:shadow-none"
                >
                  <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                  {submitting ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      {t("order.placing")}
                    </>
                  ) : (
                    <>
                      <FaShoppingBag />
                      {t("order.reviewOrder")} - {totalPrice.toLocaleString()} ETB
                    </>
                  )}
                </button>

                {/* Security Note */}
                <p className="text-center text-xs text-gray-400">
                  <FaShieldAlt className="mx-auto mb-1 inline-block text-gray-300" />
                  {t("order.secure")}
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ============================================
          CONFIRMATION DIALOG - FULLY RESPONSIVE
      ============================================ */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCancelOrder}
          ></div>

          {/* Dialog */}
          <div className="relative w-full max-w-lg transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all animate-in fade-in zoom-in duration-300 max-h-[90vh] flex flex-col">
            {/* Header - Fixed */}
            <div className="flex-shrink-0 border-b border-gray-100 bg-gradient-to-r from-[#24312c] to-[#3a4a42] px-4 sm:px-6 py-4 sm:py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="flex-shrink-0 rounded-full bg-[#d4af37]/20 p-1.5 sm:p-2">
                    <FaInfoCircle className="text-lg sm:text-2xl text-[#d4af37]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-xl font-bold text-white truncate">
                      {t("order.confirmOrder")}
                    </h3>
                    <p className="hidden sm:block text-xs sm:text-sm text-gray-300 truncate">
                      {t("order.confirmBody")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCancelOrder}
                  className="flex-shrink-0 rounded-full p-1.5 sm:p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
                >
                  <FaTimes className="text-lg sm:text-xl" />
                </button>
              </div>
            </div>

            {/* Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {/* Product Info */}
              <div className="flex items-center gap-3 sm:gap-4 rounded-xl bg-gray-50 p-3 sm:p-4">
                {product.images?.[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-12 w-12 sm:h-16 sm:w-16 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm sm:text-base font-semibold text-[#24312c] truncate">
                    {product.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">
                    {product.category} • Size: {formData.size}
                  </p>
                </div>
              </div>

              {/* Order Details */}
              <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3 sm:p-4">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-500">{t("order.perItem")}</span>
                  <span className="font-medium text-[#24312c]">
                    {product.price.toLocaleString()} ETB
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-500">Quantity</span>
                  <span className="font-medium text-[#24312c]">
                    × {formData.quantity}
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-500">Color</span>
                  <span className="font-medium text-[#24312c] truncate max-w-[120px] sm:max-w-[180px]">
                    {formData.color || "Not specified"}
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-500">Payment</span>
                  <span className="font-medium text-[#24312c]">
                    {formData.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-500">Delivery</span>
                  <span className="font-medium text-[#24312c] truncate max-w-[120px] sm:max-w-[180px]">
                    {formData.address || "Not specified"}
                  </span>
                </div>
                {formData.note && (
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-500">Note</span>
                    <span className="font-medium text-[#24312c] truncate max-w-[120px] sm:max-w-[180px]">
                      {formData.note}
                    </span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="mt-3 sm:mt-4 rounded-xl bg-gradient-to-r from-[#d4af37]/10 to-[#b88f1d]/10 p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="text-sm sm:text-base font-semibold text-[#24312c]">
                      {t("order.totalAmount")}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      {t("order.inclDelivery")}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#d4af37]">
                      {totalPrice.toLocaleString()} ETB
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer - Fixed */}
            <div className="flex-shrink-0 border-t border-gray-100 px-4 sm:px-6 py-3 sm:py-4 bg-white">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={handleCancelOrder}
                  className="order-2 sm:order-1 flex-1 rounded-xl border-2 border-gray-200 px-4 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-gray-600 transition hover:bg-gray-50 hover:border-gray-300"
                >
                  {t("order.cancel")}
                </button>
                <button
                  onClick={handleConfirmOrder}
                  disabled={submitting}
                  className="order-1 sm:order-2 flex-1 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b88f1d] px-4 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white transition hover:shadow-lg hover:shadow-[#d4af37]/30 disabled:opacity-50"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span className="text-xs sm:text-sm">{t("order.placing")}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <FaCheckCircle className="text-sm sm:text-base" />
                      <span className="text-xs sm:text-sm">{t("order.confirmOrder")}</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
