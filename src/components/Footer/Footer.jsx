import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h3>JobBoard</h3>
          <p>Connecting talented people with great companies.</p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/jobs">Browse Jobs</Link>
          <Link to="/admin">Admin</Link>
        </div>

        <div className="footer-links">
          <h4>Company</h4>
          <a href="#about">About Us</a>
          <a href="#contact">Contact</a>
          <a href="#privacy">Privacy Policy</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} JobBoard. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;