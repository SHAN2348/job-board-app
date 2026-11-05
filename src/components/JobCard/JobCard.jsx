
import { Link } from 'react-router-dom';
import './JobCard.css';

function JobCard({ job }) {
  const formatSalary = (salary) => {
    if (!salary || salary.min == null || salary.max == null) {
      return 'Salary not specified';
    }

    return `₹${(salary.min / 1000).toFixed(0)}k – ₹${(salary.max / 1000).toFixed(0)}k`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date unavailable';

    const posted = new Date(dateString);

    if (Number.isNaN(posted.getTime())) return 'Date unavailable';

    const today = new Date();
    const diffTime = Math.abs(today - posted);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';

    return `${diffDays} days ago`;
  };

  return (
    <article className="job-card">
      <div className="job-card-top">
        <div className="job-card-header">
          {job.companyLogo ? (
            <img
              className="job-card-logo"
              src={job.companyLogo}
              alt={`${job.company} logo`}
            />
          ) : (
            <div className="company-logo-placeholder" aria-hidden="true">
              {job.company?.charAt(0).toUpperCase() || 'C'}
            </div>
          )}

          <div className="job-card-heading">
            <h3 className="job-card-title">{job.title}</h3>
            <p className="job-card-company">{job.company}</p>
          </div>
        </div>

        {job.featured && (
          <span className="job-card-featured">Featured</span>
        )}
      </div>

      <div className="job-card-details">
        <span className="job-card-tag">
          <span className="job-card-tag-label">Location</span>
          {job.location}
        </span>

        <span className="job-card-tag">
          <span className="job-card-tag-label">Type</span>
          {job.type}
        </span>

        <span className="job-card-tag">
          <span className="job-card-tag-label">Experience</span>
          {job.experience}
        </span>
      </div>

      <div className="job-card-footer">
        <div className="job-card-compensation">
          <span className="job-card-salary">
            {formatSalary(job.salary)}
          </span>
          <span className="job-card-date">
            Posted {formatDate(job.postedDate)}
          </span>
        </div>

        <Link to={`/jobs/${job.id}`} className="job-card-apply">
          View Details <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

export default JobCard;
