import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  return (
    <div
      className="bg-white shadow-sm d-flex justify-content-between align-items-center px-4"
      style={{ height: "60px" }}
    >
      <h6 className="mb-0">Dashboard</h6>

      <button className="btn btn-outline-danger btn-sm" onClick={logout}>
        <i className="bi bi-box-arrow-right me-1"></i>
        Logout
      </button>
    </div>
  );
}

export default Header;