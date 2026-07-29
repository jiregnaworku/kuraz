import { FaTrash, FaTimes } from "react-icons/fa";

export default function DeleteProductModal({
  product,
  onClose,
  onConfirm,
  loading,
}) {
  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#24312c]">Delete Product</h2>

          <button
            onClick={onClose}
            className="rounded-full p-2 transition hover:bg-gray-100"
          >
            <FaTimes />
          </button>
        </div>

        {/* Warning */}

        <div className="mb-8">
          <p className="text-gray-600">
            Are you sure you want to delete this product?
          </p>

          <div className="mt-5 rounded-2xl border bg-gray-50 p-4">
            <div className="flex items-center gap-4">
              <img
                src={product.image}
                alt={product.name}
                className="h-20 w-20 rounded-xl object-cover"
              />

              <div>
                <h3 className="font-bold text-[#24312c]">{product.name}</h3>

                <p className="text-sm text-gray-500">{product.category}</p>

                <p className="mt-1 font-semibold text-[#d4af37]">
                  {product.price} ETB
                </p>
              </div>
            </div>
          </div>

          <p className="mt-5 text-sm text-red-500">
            This action cannot be undone.
          </p>
        </div>

        {/* Buttons */}

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-gray-300 px-6 py-3 font-semibold transition hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirm(product._id)}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            <FaTrash />

            {loading ? "Deleting..." : "Delete Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
