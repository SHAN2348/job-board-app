
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

function NotFoundPage() {
  return (
    <main className="not-found-page">
      <div className="not-found-glow" />

      <section className="not-found-content">
        <div className="not-found-illustration">
          <span className="not-found-code">404</span>
          <span className="not-found-orbit orbit-one" />
          <span className="not-found-orbit orbit-two" />
          <span className="not-found-center-dot" />
        </div>

        <span className="not-found-eyebrow">
          PAGE NOT FOUND
        </span>

        <h1>
          Looks like you're
          <span> off the map.</span>
        </h1>

        <p>
          The page you're looking for may have been moved,
          removed, or never existed. Let's get you back on track.
        </p>

        <div className="not-found-actions">
          <Link to="/" className="not-found-home-btn">
            <span aria-hidden="true">←</span>
            Back to Home
          </Link>

          <Link to="/jobs" className="not-found-jobs-btn">
            Explore Jobs
            <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className="not-found-footer">
          <span>JOB BOARD</span>
          <span className="not-found-footer-dot" />
          <span>Error code 404</span>
        </div>
      </section>
    </main>
  );
}

export default NotFoundPage;
