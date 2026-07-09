import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAllJobs } from '../../utils/jobsService';
import './JobDetailsPage.css';

function JobDetailsPage() {
  const { id } = useParams();
  const [showToast, setShowToast] = useState(false);

  const job = getAllJobs().find((j) => j.id === Number(id));

  const formatSalary = (salary) => {
    return `₹${(salary.min / 1000).toFixed(0)}k - ₹${(salary.max / 1000).toFixed(0)}k / year`;
  };

  const handleApply = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (!job) {
    return (
      <div className="job-not-found">
        <span className="job-not-found-icon">😕</span>
        <h2>Job Not Found</h2>
        <p>The job you're looking for doesn't exist or may have been removed.</p>
        <Link to="/jobs" className="job-not-found-link">
          Browse All Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="job-details-page">
      <Link to="/jobs" className="job-details-back">
        ← Back to Jobs
      </Link>

      <div className="job-details-layout">
        <div className="job-details-main">
          <div className="job-details-header">
            <img
              src={job.companyLogo}
              alt={`${job.company} logo`}
              className="job-details-logo"
            />
            <div>
              <h1>{job.title}</h1>
              <p className="job-details-company">{job.company}</p>
            </div>
          </div>

          <div className="job-details-tags">
            <span className="job-details-tag">📍 {job.location}</span>
            <span className="job-details-tag">💼 {job.type}</span>
            <span className="job-details-tag">⏳ {job.experience}</span>
            <span className="job-details-tag">🏷️ {job.category}</span>
          </div>

          <section className="job-details-section">
            <h2>Job Description</h2>
            <p>{job.description}</p>
          </section>

          <section className="job-details-section">
            <h2>Responsibilities</h2>
            <ul>
              {job.responsibilities.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="job-details-section">
            <h2>Required Skills</h2>
            <div className="job-details-skills">
              {job.skills.map((skill, index) => (
                <span key={index} className="job-details-skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section className="job-details-section">
            <h2>Benefits</h2>
            <ul>
              {job.benefits.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="job-details-section">
            <h2>About {job.company}</h2>
            <p>{job.companyInfo.about}</p>
            <a href={job.companyInfo.website} target="_blank" rel="noopener noreferrer">
              Visit Company Website →
            </a>
          </section>
        </div>

        <aside className="job-details-sidebar">
          <div className="job-details-card">
            <p className="job-details-salary-label">Salary</p>
            <p className="job-details-salary-value">{formatSalary(job.salary)}</p>
            <button className="job-details-apply-btn" onClick={handleApply}>
              Apply Now
            </button>
          </div>
        </aside>
      </div>

      {showToast && (
        <div className="toast">
          ✅ Application submitted successfully!
        </div>
      )}
    </div>
  );
}

export default JobDetailsPage;