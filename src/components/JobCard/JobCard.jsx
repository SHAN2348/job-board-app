import { Link } from 'react-router-dom';
import './JobCard.css';

function JobCard({ job }) {
  const formatSalary = (salary) => {
    return `₹${(salary.min / 1000).toFixed(0)}k - ₹${(salary.max / 1000).toFixed(0)}k`;
  };

  const formatDate = (dateString) => {
    const posted = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - posted);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  return (
    <div className="job-card">
      <div className="job-card-header">
        <img
          src={job.companyLogo}
          alt={`${job.company} logo`}
          className="job-card-logo"
        />
        <div>
          <h3 className="job-card-title">{job.title}</h3>
          <p className="job-card-company">{job.company}</p>
        </div>
      </div>

      <div className="job-card-details">
        <span className="job-card-tag">📍 {job.location}</span>
        <span className="job-card-tag">💼 {job.type}</span>
        <span className="job-card-tag">⏳ {job.experience}</span>
      </div>

      <div className="job-card-footer">
        <div>
          <span className="job-card-salary">{formatSalary(job.salary)}</span>
          <span className="job-card-date">Posted {formatDate(job.postedDate)}</span>
        </div>
        <Link to={`/jobs/${job.id}`} className="job-card-apply">
          View Details
        </Link>
      </div>
    </div>
  );
}

export default JobCard;