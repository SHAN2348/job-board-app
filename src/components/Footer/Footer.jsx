
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span className="footer-logo-mark">J</span>
            <span>Job<span className="footer-logo-accent">Board</span></span>
          </Link>

          <p>
            Helping ambitious people discover meaningful opportunities
            and build the careers they want.
          </p>

          <span className="footer-brand-caption">
            YOUR NEXT CHAPTER STARTS HERE.
          </span>
        </div>

        <div className="footer-links">
          <h4>Explore</h4>
          <Link to="/">Home</Link>
          <Link to="/jobs">Browse Jobs</Link>
          <Link to="/login">Sign In</Link>
        </div>

        <div className="footer-links">
          <h4>Platform</h4>
          <Link to="/my-applications">My Applications</Link>
          <Link to="/admin">Recruiter Dashboard</Link>
        </div>

        <div className="footer-links">
          <h4>Information</h4>
          <a href="#about">About Us</a>
          <a href="#contact">Contact</a>
          <a href="#privacy">Privacy Policy</a>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>
            © {new Date().getFullYear()} JobBoard. All rights reserved.
          </p>
          <span>Built with React, Django & MySQL.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
