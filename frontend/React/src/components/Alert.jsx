function Alert({ message, type }) {
  if (!message) return null;

  return (
    <div className={`alert alert-${type} mt-3`}>
      {message}
    </div>
  );
}

export default Alert;