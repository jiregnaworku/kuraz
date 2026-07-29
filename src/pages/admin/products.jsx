import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";

import ProductTable from "./ProductTable";
import ProductForm from "./ProductForm";
import DeleteProductModal from "./DeleteProductModal";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../api/productApi";

export default function Products() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);

  const [deleteProductData, setDeleteProductData] = useState(null);

  // ===========================
  // Load Products
  // ===========================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const data = await getProducts();

      setProducts(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, []);

  // ===========================
  // Add Product
  // ===========================

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  // ===========================
  // Edit Product
  // ===========================

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  // ===========================
  // Save Product
  // ===========================

  const handleSave = async (formData) => {
    try {
      setSaving(true);

      if (editingProduct) {
        await updateProduct(editingProduct._id, formData);
      } else {
        await createProduct(formData);
      }

      setShowForm(false);
      setEditingProduct(null);

      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  // ===========================
  // Delete
  // ===========================

  const handleDelete = (product) => {
    setDeleteProductData(product);
  };

  const confirmDelete = async (id) => {
    try {
      setDeleting(true);

      await deleteProduct(id);

      setDeleteProductData(null);

      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Failed to delete product.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] p-8">
      {/* Header */}

      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-[#24312c]">
            Product Management
          </h1>

          <p className="mt-2 text-gray-500">
            Manage your Kuraz Design products.
          </p>
        </div>

        <button
          onClick={handleAddProduct}
          className="flex items-center gap-3 rounded-xl bg-[#d4af37] px-6 py-4 font-semibold text-white transition hover:bg-[#b88b21]"
        >
          <FaPlus />
          Add Product
        </button>
      </div>

      {/* Table */}

      <ProductTable
        products={products}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Add/Edit Form */}

      {showForm && (
        <ProductForm
          product={editingProduct}
          loading={saving}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
          onSubmit={handleSave}
        />
      )}

      {/* Delete */}

      {deleteProductData && (
        <DeleteProductModal
          product={deleteProductData}
          loading={deleting}
          onClose={() => setDeleteProductData(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
