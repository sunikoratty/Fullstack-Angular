import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const linkClass = (path) =>
    `list-group-item list-group-item-action ${location.pathname === path ? "active" : ""
    }`;

  return (
    <div className="bg-dark text-white p-3" style={{ width: "250px" }}>
      <h5 className="text-center mb-4">My App</h5>

      <div className="list-group list-group-flush">
        <Link to="/dashboard" className={linkClass("/dashboard")}>
          <i className="bi bi-speedometer2 me-2"></i>
          Dashboard
        </Link>

        <Link to="/dashboard/profile" className={linkClass("/dashboard/profile")}>
          <i className="bi bi-person me-2"></i>
          Profile
        </Link>

        <Link to="/dashboard/products" className={linkClass("/dashboard/products")}>
          <i className="bi bi-box me-2"></i>
          Products
        </Link>
        <hr />
        <Link to="/dashboard/redux-products" className={linkClass("/dashboard/redux-products")}>
          <i className="bi bi-box me-2"></i>
          Redux Products
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;