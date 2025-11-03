import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <h1 className="display-4 mb-3 text-danger">404</h1>
      <h2 className="mb-3">Page Not Found</h2>
      <p className="text-muted mb-4">The page you're looking for doesn't exist.</p>

      <Link to="/" className="btn btn-primary">
        Go Back Home
      </Link>
    </div>
  );
}

export default NotFound;
