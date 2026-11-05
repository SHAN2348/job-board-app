
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useJobs } from '../../context/useJobs';
import { useAuth } from '../../context/useAuth';
import { apiRequest } from '../../utils/api';
import './JobDetailsPage.css';

function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, loading, error } = useJobs();
  const { user } = useAuth();

  const [applying, setApplying] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  const job = jobs.find((j) => String(j.id) === id);

  const formatSalary = (salary) => {
    if (!salary || salary.min == null || salary.max == null) {
      return 'Salary not disclosed';
    }

    return `₹${(salary.min / 1000).toFixed(0)}k – ₹${(salary.max / 1000).toFixed(0)}k / year`;
  };

  const handleApply = async () => {
    setApplicationMessage('');
    setApplicationSuccess(false);

    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'job_seeker') {
      setApplicationMessage('Only job seekers can apply for jobs.');
      return;
    }

    try {
      setApplying(true);

      const response = await apiRequest(
        'http://127.0.0.1:8000/api/applications/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            job: job.id,
            cover_letter: '',
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data.detail ||
          data.non_field_errors?.[0] ||
          data.job?.[0] ||
          'Unable to submit your application.';

        throw new Error(errorMessage);
      }

      setApplicationSuccess(true);
      setApplicationMessage('Your application has been submitted successfully.');
    } catch (err) {
      setApplicationSuccess(false);
      setApplicationMessage(err.message);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="job-details-state">
        <div className="job-details-spinner"></div>
        <p>Loading job details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="job-not-found">
        <h2>Unable to load job details</h2>
        <p>{error}</p>
        <Link to="/jobs" className="job-not-found-link">
          Browse All Jobs
        </Link>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="job-not-found">
        <span className="job-not-found-icon">⌕</span>
        <h2>Job not found</h2>
        <p>
          The opportunity you're looking for doesn't exist or may have been removed.
        </p>
        <Link to="/jobs" className="job-not-found-link">
          Browse All Jobs
        </Link>
      </div>
    );
  }

  const companyInfo = job.companyInfo || {};

  return (
    <main className="job-details-page">
      <Link to="/jobs" className="job-details-back">
        <span aria-hidden="true">←</span> Back to opportunities
      </Link>

      <section className="job-details-hero">
        <div className="job-details-header">
          {job.companyLogo ? (
            <img
              className="job-details-logo"
              src={job.companyLogo}
              alt={`${job.company} logo`}
            />
          ) : (
            <div className="job-details-logo-placeholder" aria-hidden="true">
              {job.company?.charAt(0).toUpperCase() || 'C'}
            </div>
          )}

          <div className="job-details-heading">
            <span className="job-details-eyebrow">
              {job.featured ? 'FEATURED OPPORTUNITY' : 'CAREER OPPORTUNITY'}
            </span>
            <h1>{job.title}</h1>
            <p className="job-details-company">{job.company}</p>
          </div>
        </div>

        <div className="job-details-tags">
          <span className="job-details-tag">⌖ {job.location || 'Location not specified'}</span>
          <span className="job-details-tag">◷ {job.type || 'Type not specified'}</span>
          <span className="job-details-tag">◎ {job.experience || 'Experience not specified'}</span>
          <span className="job-details-tag">◇ {job.category || 'General'}</span>
        </div>
      </section>

      <div className="job-details-layout">
        <div className="job-details-main">
          <section className="job-details-section">
            <span className="job-section-eyebrow">THE ROLE</span>
            <h2>Job description</h2>
            <p>{job.description || 'No job description has been provided.'}</p>
          </section>

          <section className="job-details-section">
            <span className="job-section-eyebrow">WHAT YOU'LL DO</span>
            <h2>Responsibilities</h2>
            {job.responsibilities?.length > 0 ? (
              <ul>
                {job.responsibilities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>Responsibilities have not been specified.</p>
            )}
          </section>

          <section className="job-details-section">
            <span className="job-section-eyebrow">WHAT YOU BRING</span>
            <h2>Required skills</h2>
            {job.skills?.length > 0 ? (
              <div className="job-details-skills">
                {job.skills.map((skill, index) => (
                  <span key={index} className="job-details-skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p>No specific skills have been listed.</p>
            )}
          </section>

          <section className="job-details-section">
            <span className="job-section-eyebrow">THE BENEFITS</span>
            <h2>Benefits</h2>
            {job.benefits?.length > 0 ? (
              <ul>
                {job.benefits.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>Benefits have not been specified.</p>
            )}
          </section>

          <section className="job-details-section job-company-section">
            <span className="job-section-eyebrow">GET TO KNOW THE TEAM</span>
            <h2>About {job.company}</h2>
            <p>
              {companyInfo.about || 'Company information is not currently available.'}
            </p>

            {companyInfo.website && (
              <a
                className="job-company-website"
                href={companyInfo.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit company website <span aria-hidden="true">↗</span>
              </a>
            )}
          </section>
        </div>

        <aside className="job-details-sidebar">
          <div className="job-details-card">
            <span className="job-card-eyebrow">COMPENSATION</span>

            <p className="job-details-salary-value">
              {formatSalary(job.salary)}
            </p>

            <div className="job-sidebar-divider"></div>

            <div className="job-sidebar-info">
              <span>Employment type</span>
              <strong>{job.type || 'Not specified'}</strong>
            </div>

            <div className="job-sidebar-info">
              <span>Experience</span>
              <strong>{job.experience || 'Not specified'}</strong>
            </div>

            <div className="job-sidebar-info">
              <span>Location</span>
              <strong>{job.location || 'Not specified'}</strong>
            </div>

            <button
              className="job-details-apply-btn"
              onClick={handleApply}
              disabled={applying || applicationSuccess}
              type="button"
            >
              {applying
                ? 'Submitting application...'
                : applicationSuccess
                  ? 'Application submitted ✓'
                  : 'Apply for this position →'}
            </button>

            {applicationMessage && (
              <p
                className={`job-application-message ${
                  applicationSuccess ? 'success' : 'error'
                }`}
                role="status"
              >
                {applicationMessage}
              </p>
            )}

            <p className="job-application-note">
              {user
                ? 'Your application will be submitted securely.'
                : 'Sign in as a job seeker to apply for this position.'}
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default JobDetailsPage;
