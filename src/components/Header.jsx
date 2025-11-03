import { Link } from "react-router-dom";
import PersonIcon from "../assets/person.svg";

function Header() {
  return (
    <header className="full-bleed-sticky">
      <div className="container d-flex align-items-center py-2">
        <Link to="/" className="navbar-brand fw-bold mb-0">
          <img src={PersonIcon} alt="Copy" width="14" height="14" className="me-1" />
          ReadySetHire
        </Link>
        <nav className="ms-auto">
          <ul className="navbar-nav flex-row">
            <li className="nav-item">
              <Link to="/" className="nav-link px-2">Home</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
