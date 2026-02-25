import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
} from "../redux/slices/productSlice";
import ConfirmModal from "../components/ConfirmModal";
import Alert from "../components/Alert";
function ReduxProducts() {
    const dispatch = useDispatch();

    const { products, total, loading, error } = useSelector(
        (state) => state.productState
    );

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
        tags: [],
    });

    useEffect(() => {
        dispatch(fetchProducts({ page, limit }));
    }, [page, limit, dispatch]);


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const toggleTag = (tag) => {
        let updatedTags = [...form.tags];

        if (updatedTags.includes(tag)) {
            updatedTags = updatedTags.filter((t) => t !== tag);
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
            tags: [],
        });
    };

    const save = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                await dispatch(updateProduct({ id: editingId, formData: form })).unwrap();
                setAlert({ message: "Product updated successfully!", type: "success" });
            } else {
                await dispatch(createProduct(form)).unwrap();
                setAlert({ message: "Product created successfully!", type: "success" });
            }

            resetForm();
            dispatch(fetchProducts({ page, limit }));

        } catch (err) {
            setAlert({ message: err, type: "danger" });
        }

        setTimeout(() => {
            setAlert({ message: "", type: "primary" });
        }, 3000);
    };

    const edit = (product) => {
        setEditingId(product._id);
        setForm(product);
    };

    /* ---------------- Delete ---------------- */
    const deleteHandler = (id) => {
        setSelectedId(id);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        try {
            await dispatch(deleteProduct(selectedId)).unwrap();
            setAlert({ message: "Product deleted successfully!", type: "success" });
            setShowModal(false);
        } catch (err) {
            setAlert({ message: err, type: "danger" });
        }

        setTimeout(() => {
            setAlert({ message: "", type: "primary" });
        }, 3000);
    };


    return (
        <div className="container mt-5">
            <h3>Products</h3>

            {/* ---------------- Form Card ---------------- */}
            <div className="card p-4 mb-4">
                <h4>{editingId ? "Edit Product" : "Add Product"}</h4>

                <form onSubmit={save}>
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
                        />{" "}
                        Active

                        <input
                            type="radio"
                            className="ms-3"
                            checked={form.status === "Inactive"}
                            onChange={() => setForm({ ...form, status: "Inactive" })}
                        />{" "}
                        Inactive
                    </div>

                    <div className="mb-2">
                        {["New", "Featured", "Sale"].map((tag) => (
                            <label key={tag} className="me-3">
                                <input
                                    type="checkbox"
                                    checked={form.tags.includes(tag)}
                                    onChange={() => toggleTag(tag)}
                                />{" "}
                                {tag}
                            </label>
                        ))}
                    </div>

                    <button type="submit" className="btn btn-primary">
                        {editingId ? "Update" : "Save"}
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary ms-2"
                        onClick={resetForm}
                    >
                        Clear
                    </button>
                </form>

                <Alert message={alert.message} type={alert.type} />
            </div>

            {/* ---------------- Products Table ---------------- */}
            <div className="card p-3">
                <p>Total products: {total}</p>

                {loading && <p>Loading...</p>}
                {error && <p className="text-danger">{error}</p>}

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
                        {products.map((p) => (
                            <tr key={p._id}>
                                <td>{p.name}</td>
                                <td>{p.price}</td>
                                <td>{p.status}</td>
                                <td>{p.category}</td>
                                <td>
                                    {p.tags?.map((tag) => (
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
                                        onClick={() => deleteHandler(p._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* ---------------- Pagination ---------------- */}
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

            {/* ---------------- Confirm Modal ---------------- */}
            <ConfirmModal
                show={showModal}
                title="Confirm Delete"
                onConfirm={confirmDelete}
                onClose={() => setShowModal(false)}
            >
                Are you sure you want to delete this product?
            </ConfirmModal>
        </div>
    )
}

export default ReduxProducts