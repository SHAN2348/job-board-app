
import { Link } from 'react-router-dom';
import JobCard from '../JobCard/JobCard';
import { useJobs } from '../../context/useJobs';
import './FeaturedJobs.css';

function FeaturedJobs() {
  const { jobs, loading, error } = useJobs();
  const featuredJobs = jobs.filter((job) => job.featured);

  return (
    <section className="featured-jobs">
      <div className="featured-jobs-container">
        <div className="featured-jobs-header">
          <div>
            <span className="featured-jobs-eyebrow">
              CURATED OPPORTUNITIES
            </span>
            <h2>Featured opportunities</h2>
            <p>Explore hand-picked roles from companies worth knowing.</p>
          </div>

          <Link to="/jobs" className="featured-jobs-view-all">
            Explore all jobs <span aria-hidden="true">→</span>
          </Link>
        </div>

        {loading ? (
          <p className="featured-jobs-message">Loading featured jobs...</p>
        ) : error ? (
          <p className="featured-jobs-message">
            Unable to load featured jobs. Please try again later.
          </p>
        ) : featuredJobs.length === 0 ? (
          <p className="featured-jobs-message">
            No featured jobs available at the moment.
          </p>
        ) : (
          <div className="featured-jobs-grid">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedJobs;
