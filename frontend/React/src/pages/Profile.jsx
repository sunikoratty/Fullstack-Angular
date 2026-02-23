import { useEffect, useState } from "react";
import API from "../services/api";
import { useForm } from "react-hook-form";
function Profile() {
  const [user, setUser] = useState({});
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [previewImage, setPreviewImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  useEffect(() => {
    API.get("/profile")
      .then((res) => {
        const user = res.data;
        if (!user) return;
        setValue("fullName", user.fullName || "");
        setValue("dob", user.dob ? user.dob.substring(0, 10) : "");
        setValue("sex", user.sex || "");
        setValue("qualification", user.qualification || "");

        if (user.photo) {
          setPreviewImage(user.photo);
          setBase64Image(user.photo);
        }
      })
      .catch(() => {
      });
  }, [setValue]);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      photo: base64Image || null
    };

    try {
      const res = await API.put("/profile", payload);
      // showAlert("Profile updated successfully", "success");
      setShowAlert(true);
      setAlertType("success");
      setAlertMessage(res.data.message);
      setTimeout(() => {
        setShowAlert(false);
        setAlertMessage("");
      }, 3000);
    } catch (error) {
      console.log('errror', error);
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

  
  // const onSubmit = async (data) => {
  //   const formData = new FormData();

  //   Object.keys(data).forEach(key => {
  //     formData.append(key, data[key]);
  //   });

  //   try {
  //     await API.put("/auth/profile", formData);
  //     showAlert("Profile updated successfully", "success");
  //   } catch {
  //     showAlert("Profile update failed", "danger");
  //   }
  // };
  
  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setBase64Image(reader.result);
      setPreviewImage(reader.result);
    };
  };

  const removePhoto = () => {
    setPreviewImage(null);
    setBase64Image(null);
  };

  return (
    <div className="container mt-5">
      <h3>Profile</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        {showAlert && (
          <div className={`alert alert-${alertType} mt-3`} role="alert">
            {alertMessage}
          </div>
        )}
        <div className="row">

          <div className="col-md-6 mb-3">
            <label className="form-label">Full Name</label>
            <input
              className="form-control"
              {...register("fullName", { required: "Full name required" })}
            />
            {errors.fullName && (
              <small className="text-danger">{errors.fullName.message}</small>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Date of Birth</label>
            <input
              type="date"
              className="form-control"
              {...register("dob")}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Sex</label>
            <select
              className="form-select"
              {...register("sex")}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Qualification</label>
            <input
              className="form-control"
              {...register("qualification")}
            />
          </div>

          <div className="col-12 mb-3">
            <label className="form-label">Photo</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={onFileChange}
            />
          </div>

          {previewImage && (
            <div className="col-12 mb-3">
              <img
                src={previewImage}
                alt="preview"
                className="img-thumbnail"
                style={{ maxWidth: "200px" }}
              />
              <button
                type="button"
                className="btn btn-danger btn-sm mt-2"
                onClick={removePhoto}
              >
                Delete Photo
              </button>
            </div>
          )}

        </div>

        <button className="btn btn-primary">
          Update Profile
        </button>

      </form>
    </div>
  );
}

export default Profile;