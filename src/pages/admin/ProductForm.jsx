import { useState } from "react";
import { FaUpload, FaTrash, FaPlus } from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";

const emptyForm = {
  name: "",
  category: "",
  description: "",
  price: "",
  stock: "",
  featured: false,
  images: [],
};

export default function ProductForm({
  initialData = {},
  onSubmit,
  loading = false,
}) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    ...emptyForm,
    ...initialData,
    images: initialData.images || [],
  });

  const [previewImages, setPreviewImages] = useState(initialData.images || []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =============================
  // IMAGE PICK FROM DEVICE
  // =============================

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    const imageUrls = files.map((file) => URL.createObjectURL(file));

    setPreviewImages((prev) => [...prev, ...imageUrls]);

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const removeImage = (index) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));

    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("name", formData.name);
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("featured", formData.featured);

    // Upload every selected image
    formData.images.forEach((image) => {
      data.append("images", image);
    });

    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
mx-auto
max-w-5xl
rounded-[35px]
border
border-white/10
bg-gradient-to-br
from-[#24312c]
to-[#111]
p-8
shadow-2xl
backdrop-blur-xl
space-y-8
"
    >
      {/* HEADER */}

      <div>
        <h2
          className="
text-3xl
font-bold
text-white
"
        >
          {t("admin.createProduct")}
        </h2>

        <p
          className="
mt-2
text-gray-400
"
        >
          {t("admin.createProductDesc")}
        </p>
      </div>

      <div
        className="
grid
gap-8
lg:grid-cols-2
"
      >
        {/* LEFT SIDE */}

        <div className="space-y-6">
          <Input
            label={t("admin.productName")}
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t("admin.productNamePlaceholder") || "Habesha Kemis"}
          />

          <div>
            <label className="mb-2 block text-white font-semibold">
              {t("admin.category")}
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-white outline-none focus:border-[#d4af37]"
              required
            >
              <option value="">{t("admin.selectCategory")}</option>
              <option value="Women's Dress">{t("admin.womensDress")}</option>
              <option value="Men's Wear">{t("admin.mensWear")}</option>
              <option value="Wedding">{t("admin.wedding")}</option>
              <option value="Kids">{t("admin.kids")}</option>
              <option value="Accessories">{t("admin.accessories")}</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label={t("admin.priceETB")}
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
            />

            <Input
              label={t("admin.stock")}
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              className="
mb-2
block
text-white
font-semibold
"
            >
              {t("admin.description")}
            </label>

            <textarea
              rows="6"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="
w-full
rounded-xl
bg-black/30
border
border-white/10
px-4
py-3
text-white
outline-none
focus:border-[#d4af37]
"
            />
          </div>

          <div
            className="
flex
items-center
gap-3
"
          >
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="h-5 w-5"
            />

            <label className="text-white font-semibold">
              {t("admin.featuredProduct")}
            </label>
          </div>
        </div>

        {/* RIGHT SIDE IMAGE */}

        <div>
          <label
            className="
mb-3
block
text-white
font-semibold
"
          >
            {t("admin.productImages")}
          </label>

          <label
            className="
flex
cursor-pointer
flex-col
items-center
justify-center
rounded-3xl
border-2
border-dashed
border-[#d4af37]/50
bg-black/20
p-10
text-center
transition
hover:bg-black/40
"
          >
            <FaUpload
              className="
mb-4
text-4xl
text-[#d4af37]
"
            />

            <p className="text-white">{t("admin.uploadImages")}</p>

            <span
              className="
mt-2
text-sm
text-gray-400
"
            >
              {t("admin.dragDrop")}
            </span>

            <input
              hidden
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>

          <div
            className="
mt-6
grid
grid-cols-2
gap-4
"
          >
            {previewImages.map((img, index) => (
              <div
                key={index}
                className="
relative
overflow-hidden
rounded-2xl
"
              >
                <img
                  src={img}
                  className="
h-40
w-full
object-cover
"
                />

                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="
absolute
right-2
top-2
rounded-full
bg-red-500
p-3
text-white
"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        disabled={loading}
        className="
flex
w-full
items-center
justify-center
gap-3
rounded-2xl
bg-[#d4af37]
py-4
text-lg
font-bold
text-white
transition
hover:bg-[#b88b21]
disabled:opacity-50
"
      >
        {loading ? (
          t("common.saving") || "Saving..."
        ) : (
          <>
            <FaPlus />
            {t("admin.saveProduct")}
          </>
        )}
      </button>
    </form>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label
        className="
mb-2
block
font-semibold
text-white
"
      >
        {label}
      </label>

      <input
        {...props}
        className="
w-full
rounded-xl
border
border-white/10
bg-black/30
px-4
py-3
text-white
outline-none
transition
focus:border-[#d4af37]
"
      />
    </div>
  );
}
