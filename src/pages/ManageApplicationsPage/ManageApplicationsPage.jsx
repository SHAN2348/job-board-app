
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../../utils/api';
import './ManageApplicationsPage.css';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'rejected', label: 'Rejected' },
];

function ManageApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadApplications() {
      try {
        setError('');

        const response = await apiRequest(
          'http://127.0.0.1:8000/api/applications/'
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail || 'Unable to load applications.'
          );
        }

        if (!ignore) {
          setApplications(data.results || data);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadApplications();

    return () => {
      ignore = true;
    };
  }, []);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      setUpdatingId(applicationId);
      setError('');

      const response = await apiRequest(
        `http://127.0.0.1:8000/api/applications/${applicationId}/status/`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
          data.status?.[0] ||
          'Unable to update application status.'
        );
      }

      setApplications((previousApplications) =>
        previousApplications.map((application) =>
          application.id === applicationId
            ? { ...application, status: data.status }
            : application
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Date unavailable';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return 'Date unavailable';
    }

    return parsedDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusClass = (status) => {
    return `manage-status status-${status || 'pending'}`;
  };

  const getStatusCount = (status) =>
    applications.filter((application) => application.status === status).length;

  if (loading) {
    return (
      <main className="manage-applications-page">
        <div className="manage-applications-loading">
          <span className="manage-applications-spinner" />
          <p>Loading applications...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="manage-applications-page">
      <div className="manage-applications-container">
        <Link to="/admin" className="manage-back-link">
          <span aria-hidden="true">←</span> Back to dashboard
        </Link>

        <header className="manage-applications-header">
          <div>
            <span className="manage-eyebrow">RECRUITER WORKSPACE</span>
            <h1>Manage Applications</h1>
            <p>
              Review candidates, evaluate applications and update
              their hiring progress.
            </p>
          </div>

          <div className="manage-total-card">
            <span>Total received</span>
            <strong>{applications.length}</strong>
            <small>Applications</small>
          </div>
        </header>

        {error && (
          <div className="manage-error" role="alert">
            <span>!</span>
            <p>{error}</p>
          </div>
        )}

        <section className="manage-stats">
          <div className="manage-stat-card">
            <span className="manage-stat-indicator pending-indicator" />
            <div>
              <span>Pending</span>
              <strong>{getStatusCount('pending')}</strong>
            </div>
          </div>

          <div className="manage-stat-card">
            <span className="manage-stat-indicator reviewed-indicator" />
            <div>
              <span>Reviewed</span>
              <strong>{getStatusCount('reviewed')}</strong>
            </div>
          </div>

          <div className="manage-stat-card">
            <span className="manage-stat-indicator shortlisted-indicator" />
            <div>
              <span>Shortlisted</span>
              <strong>{getStatusCount('shortlisted')}</strong>
            </div>
          </div>

          <div className="manage-stat-card">
            <span className="manage-stat-indicator rejected-indicator" />
            <div>
              <span>Rejected</span>
              <strong>{getStatusCount('rejected')}</strong>
            </div>
          </div>
        </section>

        <div className="manage-list-heading">
          <div>
            <h2>Candidate applications</h2>
            <p>Review the details submitted by each candidate.</p>
          </div>

          <span className="manage-results-count">
            {applications.length} results
          </span>
        </div>

        {applications.length === 0 ? (
          <section className="manage-empty">
            <div className="manage-empty-icon">♧</div>
            <h2>No applications received</h2>
            <p>
              When candidates apply to your job postings, their
              applications will appear here.
            </p>
            <Link to="/admin" className="manage-empty-link">
              Return to dashboard
            </Link>
          </section>
        ) : (
          <div className="manage-applications-list">
            {applications.map((application) => (
              <article
                className="manage-application-card"
                key={application.id}
              >
                <div className="manage-candidate-top">
                  <div className="manage-candidate-identity">
                    <div className="manage-avatar">
                      {application.applicant_username
                        ?.charAt(0)
                        ?.toUpperCase() || 'C'}
                    </div>

                    <div className="manage-candidate-info">
                      <h3>
                        {application.applicant_username || 'Candidate'}
                      </h3>
                      <p>
                        {application.applicant_email || 'Email not provided'}
                      </p>
                    </div>
                  </div>

                  <span className={getStatusClass(application.status)}>
                    <span className="manage-status-dot" />
                    {application.status || 'pending'}
                  </span>
                </div>

                <div className="manage-job-reference">
                  <span className="manage-field-label">APPLIED FOR</span>
                  <strong>
                    {application.job_title || 'Job application'}
                  </strong>
                </div>

                <div className="manage-application-details">
                  <div>
                    <span className="manage-field-label">SUBMITTED ON</span>
                    <strong>{formatDate(application.applied_at)}</strong>
                  </div>

                  <div>
                    <span className="manage-field-label">APPLICATION ID</span>
                    <strong>#{application.id}</strong>
                  </div>
                </div>

                <div className="manage-cover-letter">
                  <span className="manage-field-label">COVER LETTER</span>
                  <p>
                    {application.cover_letter ||
                      'No cover letter provided by this candidate.'}
                  </p>
                </div>

                <div className="manage-card-footer">
                  <div className="manage-status-control">
                    <label htmlFor={`status-${application.id}`}>
                      Update application status
                    </label>

                    <select
                      id={`status-${application.id}`}
                      value={application.status}
                      disabled={updatingId === application.id}
                      onChange={(event) =>
                        handleStatusChange(
                          application.id,
                          event.target.value
                        )
                      }
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {updatingId === application.id ? (
                    <span className="manage-updating">
                      <span className="manage-mini-spinner" />
                      Updating...
                    </span>
                  ) : (
                    <span className="manage-update-hint">
                      Changes are saved automatically
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default ManageApplicationsPage;
