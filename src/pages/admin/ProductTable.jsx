import { FaEdit, FaTrash } from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";

export default function ProductTable({ products, onEdit, onDelete, loading }) {
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow">
        <p className="text-gray-600">{t("common.loading")}</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow">
        <p className="text-gray-600">{t("admin.noProducts")}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          {/* Header */}

          <thead className="bg-[#24312c] text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                {t("admin.image")}
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                {t("admin.name")}
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                {t("admin.category")}
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                {t("admin.price")}
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                {t("admin.stock")}
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                {t("admin.featured")}
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold">
                {t("admin.actions")}
              </th>
            </tr>
          </thead>

          {/* Body */}

          <tbody>
            {products.map((product) => (
              <tr
                key={product._id}
                className="border-b transition hover:bg-gray-50"
              >
                {/* Image */}

                <td className="px-6 py-4">
                  {product.images?.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="
                      h-20
                      w-20
                      rounded-xl
                      object-cover
                      shadow
                      "
                    />
                  ) : (
                    <div
                      className="
                      flex
                      h-20
                      w-20
                      items-center
                      justify-center
                      rounded-xl
                      bg-gray-200
                      text-xs
                      text-gray-500
                      "
                    >
                      {t("admin.noImage")}
                    </div>
                  )}
                </td>

                {/* Name */}

                <td className="px-6 py-4">
                  <p className="font-semibold text-[#24312c]">{product.name}</p>
                </td>

                {/* Category */}

                <td className="px-6 py-4 text-gray-600">{product.category}</td>

                {/* Price */}

                <td className="px-6 py-4 font-bold text-[#d4af37]">
                  {product.price} ETB
                </td>

                {/* Stock */}

                <td className="px-6 py-4 text-gray-600">{product.stock}</td>

                {/* Featured */}

                <td className="px-6 py-4">
                  {product.featured ? (
                    <span
                      className="
                      rounded-full
                      bg-green-100
                      px-3
                      py-1
                      text-sm
                      font-semibold
                      text-green-700
                      "
                    >
                      {t("admin.featuredYes")}
                    </span>
                  ) : (
                    <span
                      className="
                      rounded-full
                      bg-gray-100
                      px-3
                      py-1
                      text-sm
                      text-gray-600
                      "
                    >
                      {t("admin.featuredNo")}
                    </span>
                  )}
                </td>

                {/* Actions */}

                <td className="px-6 py-4">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => onEdit(product)}
                      className="
                      rounded-xl
                      bg-blue-500
                      p-3
                      text-white
                      transition
                      hover:bg-blue-600
                      "
                      title={t("admin.edit")}
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => onDelete(product)}
                      className="
                      rounded-xl
                      bg-red-500
                      p-3
                      text-white
                      transition
                      hover:bg-red-600
                      "
                      title={t("admin.delete")}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
