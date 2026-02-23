import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedForm = {
      ...form,
      [name]: value
    };

    setForm(updatedForm);
    const newErrors = validateForm(updatedForm);
    setErrors(newErrors);
  };

  const validateForm = (data) => {
    const newErrors = {};

    if (!data.name) {
      newErrors.name = "Name is required";
    } else if (data.name.length < 2) {
      newErrors.name = "Minimum name length is 3";
    }


    if (!data.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(data.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (!data.password) {
      newErrors.password = "Password is required";
    } else if (data.password.length < 4) {
      newErrors.password = "Minimum password length is 4";
    }

    return newErrors;
  };

  const submit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm(form);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }
    try {
      const res = await API.post("/register", form);

      setShowAlert(true);
      setAlertType("success");
      setAlertMessage(res.data.message + ', Please login to continue.');

      setTimeout(() => {
        setShowAlert(false);
        navigate("/login");
      }, 3000);

    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";
      setShowAlert(true);
      setAlertType("danger");
      setAlertMessage(message);

      setTimeout(() => {
        setShowAlert(false);
        setAlertMessage("");
      }, 3000);
    }
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="col-md-4">
        <div className="card">
          <div className="card-header">Register</div>
          <div className="card-body">
            <form onSubmit={submit}>
              <input name="name" className="form-control mb-2" onChange={handleChange} placeholder="Name" />
              {errors.name && <div className="text-danger">{errors.name}</div>}
              <input name="phone" className="form-control mb-2" onChange={handleChange} placeholder="Phone" />
              {errors.phone && <div className="text-danger">{errors.phone}</div>}
              <input name="password" type="password" className="form-control mb-2" onChange={handleChange} placeholder="Password" />
              {errors.password && <div className="text-danger">{errors.password}</div>}
              
              <div className="d-flex justify-content-center">
                <button className="btn btn-primary me-2">Register</button>
                <button className="btn btn-info" onClick={() => navigate("/login")}>Login</button>
              </div>
            </form>
            {showAlert && (
              <div className={`alert alert-${alertType} mt-3`} role="alert">
                {alertMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;