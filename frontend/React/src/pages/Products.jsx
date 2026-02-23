import { useEffect, useState } from "react";
import API from "../services/api";
import ConfirmModal from "../components/ConfirmModal";
import Alert from "../components/Alert";
function Products() {
  const [products, setProducts] = useState([]);

  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [editingId, setEditingId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [alert, setAlert] = useState({ message: "", type: "primary" });


  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    category: "Electronics",
    status: "Active",
    tags: []
  });

  useEffect(() => {
    loadProducts();
  }, [page, limit]);

  const loadProducts = async () => {
    const res = await API.get(`/products?page=${page}&limit=${limit}`);
    setProducts(res.data.data);
    setTotal(res.data.total);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleTag = (tag) => {
    let updatedTags = [...form.tags];

    if (updatedTags.includes(tag)) {
      updatedTags = updatedTags.filter(t => t !== tag);
    } else {
      updatedTags.push(tag);
    }

    setForm({ ...form, tags: updatedTags });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: "",
      description: "",
      price: 0,
      category: "Electronics",
      status: "Active",
      tags: []
    });
  };


  const save = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await API.put(`/products/${editingId}`, form);
        setAlert({ message: "Product updated successfully!", type: "success" });
        setEditingId(null);
      } else {
        await API.post("/products", form);
        setAlert({ message: "Product created successfully!", type: "success" });
      }

      resetForm();
      loadProducts();

    } catch (err) {
      console.log('error', err);
      const errorMessage =
        err.response?.data?.message || "Something went wrong";
      setAlert({ message: errorMessage, type: "danger" });
    }

    setTimeout(() => {
      setAlert({ message: "", type: "primary" });
    }, 3000);
  };

  const edit = (product) => {
    setEditingId(product._id);
    setForm(product);
  };

  const deleteProduct = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    await API.delete(`/products/${selectedId}`);
    setAlert({ message: "Product deleted successfully!", type: "success" });
    setShowModal(false);
    resetForm();
    loadProducts();
    setTimeout(() => {
      setAlert({ message: "", type: "primary" });
    }, 3000);
  };

  return (
    <div className="container mt-5">
      <h3>Products</h3>

      <div className="card p-4 mb-4">
        <h4>{editingId ? "Edit Product" : "Add Product"}</h4>

        <form>

          <input
            name="name"
            className="form-control mb-2"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />

          <textarea
            name="description"
            className="form-control mb-2"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />

          <input
            type="number"
            name="price"
            className="form-control mb-2"
            value={form.price}
            onChange={handleChange}
          />

          <select
            name="category"
            className="form-select mb-2"
            value={form.category}
            onChange={handleChange}
          >
            <option>Electronics</option>
            <option>Clothing</option>
            <option>Books</option>
          </select>

          <div className="mb-2">
            <input
              type="radio"
              checked={form.status === "Active"}
              onChange={() => setForm({ ...form, status: "Active" })}
            /> Active

            <input
              type="radio"
              className="ms-3"
              checked={form.status === "Inactive"}
              onChange={() => setForm({ ...form, status: "Inactive" })}
            /> Inactive
          </div>

          <div className="mb-2">
            {["New", "Featured", "Sale"].map(tag => (
              <label key={tag} className="me-3">
                <input
                  type="checkbox"
                  checked={form.tags.includes(tag)}
                  onChange={() => toggleTag(tag)}
                /> {tag}
              </label>
            ))}
          </div>

          <button className="btn btn-primary" onClick={save}>
            {editingId ? "Update" : "Save"}
          </button>
          <button type="button" className="btn btn-secondary ms-2" onClick={resetForm}>Clear</button>
        </form>

        <Alert message={alert.message} type={alert.type} />
      </div>

      <div className="card p-3">

        <p>Total products: {total}</p>

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Status</th>
              <th>Category</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map(p => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.price}</td>
                <td>{p.status}</td>
                <td>{p.category}</td>
                <td>
                  {p.tags?.map(tag => (
                    <span key={tag} className="badge bg-secondary me-1">
                      {tag}
                    </span>
                  ))}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => edit(p)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteProduct(p._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="d-flex justify-content-between">

          <div>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="form-select w-auto"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          <div>
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="btn btn-secondary btn-sm me-2"
            >
              Prev
            </button>

            Page {page}

            <button
              disabled={page * limit >= total}
              onClick={() => setPage(page + 1)}
              className="btn btn-secondary btn-sm ms-2"
            >
              Next
            </button>
          </div>

        </div>
      </div>

      <ConfirmModal
        show={showModal}
        title="Confirm Delete"
        onConfirm={confirmDelete}
        onClose={() => setShowModal(false)}
      >
        Are you sure you want to delete this product?
      </ConfirmModal>

    </div >
  );
}

export default Products;