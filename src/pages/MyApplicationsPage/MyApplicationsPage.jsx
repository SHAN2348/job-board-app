
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useJobs } from '../../context/useJobs';
import { apiRequest, API_BASE_URL } from '../../utils/api';
import './MyApplicationsPage.css';

function MyApplicationsPage() {
  const { jobs, loading: jobsLoading } = useJobs();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function fetchApplications() {
      try {
        setLoading(true);
        setError('');

        const response = await apiRequest(
          `${API_BASE_URL}/api/applications/`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail || 'Unable to load your applications.'
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

    fetchApplications();

    return () => {
      ignore = true;
    };
  }, []);

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
    return `application-status status-${status || 'pending'}`;
  };

  if (loading || jobsLoading) {
    return (
      <main className="my-applications-page">
        <div className="applications-loading">
          <span className="applications-spinner" />
          <p>Loading your applications...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="my-applications-page">
        <div className="applications-error">
          <span className="applications-state-icon">!</span>
          <h2>Unable to load applications</h2>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="my-applications-page">
      <div className="applications-container">
        <header className="applications-header">
          <div>
            <span className="applications-eyebrow">
              YOUR CAREER JOURNEY
            </span>
            <h1>My Applications</h1>
            <p>
              Keep track of your job applications and stay updated
              on your progress.
            </p>
          </div>

          <Link to="/jobs" className="applications-browse-btn">
            <span>Explore jobs</span>
            <span aria-hidden="true">↗</span>
          </Link>
        </header>

        <section className="applications-overview">
          <div className="applications-overview-card">
            <span className="overview-label">Total applications</span>
            <strong>{applications.length}</strong>
            <span className="overview-caption">
              Jobs you've applied to
            </span>
          </div>

          <div className="applications-overview-card">
            <span className="overview-label">Under review</span>
            <strong>
              {applications.filter(
                (item) =>
                  item.status === 'pending' ||
                  item.status === 'reviewed'
              ).length}
            </strong>
            <span className="overview-caption">
              Waiting for an update
            </span>
          </div>

          <div className="applications-overview-card">
            <span className="overview-label">Shortlisted</span>
            <strong>
              {applications.filter(
                (item) => item.status === 'shortlisted'
              ).length}
            </strong>
            <span className="overview-caption">
              Positive responses
            </span>
          </div>
        </section>

        <div className="applications-section-heading">
          <div>
            <h2>Application activity</h2>
            <p>Your submitted applications and their latest status.</p>
          </div>

          <span className="applications-count">
            {applications.length} applications
          </span>
        </div>

        {applications.length === 0 ? (
          <section className="applications-empty">
            <div className="applications-empty-icon">⌕</div>
            <h2>No applications yet</h2>
            <p>
              You haven't applied for any jobs yet. Explore available
              opportunities and take your next career step.
            </p>
            <Link to="/jobs" className="applications-browse-btn">
              Browse jobs <span aria-hidden="true">↗</span>
            </Link>
          </section>
        ) : (
          <div className="applications-list">
            {applications.map((application) => {
              const job = jobs.find(
                (item) => item.id === application.job
              );

              return (
                <article
                  className="my-application-card"
                  key={application.id}
                >
                  <div className="my-application-main">
                    <div className="application-company-mark">
                      {job?.company?.charAt(0)?.toUpperCase() || 'J'}
                    </div>

                    <div className="application-job-info">
                      <h3>{application.job_title || 'Job application'}</h3>
                      <p className="application-company">
                        {job?.company || 'Company information unavailable'}
                      </p>

                      <div className="application-job-meta">
                        {job?.location && (
                          <span>⌖ {job.location}</span>
                        )}
                        {job?.type && (
                          <span>◷ {job.type}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="application-card-divider" />

                  <div className="application-card-footer">
                    <div className="application-submitted">
                      <span className="application-meta-label">
                        APPLIED ON
                      </span>
                      <strong>
                        {formatDate(application.applied_at)}
                      </strong>
                    </div>

                    <div className="application-status-wrap">
                      <span className="application-meta-label">
                        APPLICATION STATUS
                      </span>
                      <span className={getStatusClass(application.status)}>
                        <span className="status-dot" />
                        {application.status || 'pending'}
                      </span>
                    </div>

                    <Link
                      to={`/jobs/${application.job}`}
                      className="application-view-link"
                    >
                      View job <span aria-hidden="true">→</span>
                    </Link>
                  </div>

                  {application.cover_letter && (
                    <div className="application-cover-letter">
                      <span className="application-meta-label">
                        YOUR COVER LETTER
                      </span>
                      <p>{application.cover_letter}</p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default MyApplicationsPage;
