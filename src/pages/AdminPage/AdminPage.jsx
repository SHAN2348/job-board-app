
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JobForm from '../../components/JobForm/JobForm';
import { apiRequest, API_BASE_URL } from '../../utils/api';
import { useJobs } from '../../context/useJobs';
import { mapJobToAPI, mapJobFromAPI } from '../../utils/jobMapper';
import './AdminPage.css';

function AdminPage() {
  const { jobs, setJobs, loading, error } = useJobs();

  const [view, setView] = useState('list');
  const [editingJob, setEditingJob] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const navigate = useNavigate();

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleAddClick = () => {
    setEditingJob(null);
    setView('form');
  };

  const handleEditClick = (job) => {
    setEditingJob(job);
    setView('form');
  };

  const handleCancel = () => {
    setEditingJob(null);
    setView('list');
  };

  const handleFormSubmit = async (jobPayload) => {
    try {
      if (editingJob) {
        const response = await apiRequest(
          `${API_BASE_URL}/api/jobs/${editingJob.id}/`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mapJobToAPI(jobPayload)),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(JSON.stringify(data));
        }

        const updatedJob = mapJobFromAPI(data);

        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job.id === updatedJob.id ? updatedJob : job
          )
        );

        setEditingJob(null);
        setView('list');
        showToast('Job updated successfully!');
        return;
      }

      const response = await apiRequest(
        `${API_BASE_URL}/api/jobs/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mapJobToAPI(jobPayload)),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(JSON.stringify(data));
      }

      setJobs((prevJobs) => [mapJobFromAPI(data), ...prevJobs]);

      setEditingJob(null);
      setView('list');
      showToast('Job added successfully!');
    } catch (err) {
      showToast(err.message);
    }
  };

  const handleDeleteClick = (id) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      const response = await apiRequest(
        `${API_BASE_URL}/api/jobs/${confirmDeleteId}/`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(JSON.stringify(data));
      }

      setJobs((prevJobs) =>
        prevJobs.filter((job) => job.id !== confirmDeleteId)
      );

      setConfirmDeleteId(null);
      showToast('Job deleted successfully!');
    } catch (err) {
      setConfirmDeleteId(null);
      showToast(err.message);
    }
  };

  const featuredCount = jobs.filter((job) => job.featured).length;
  const companyCount = new Set(
    jobs.map((job) => job.company).filter(Boolean)
  ).size;

  return (
    <main className="admin-page">
      {view === 'list' ? (
        <>
          <section className="admin-header">
            <div className="admin-heading-content">
              <span className="admin-eyebrow">
                RECRUITER WORKSPACE
              </span>
              <h1>Dashboard overview</h1>
              <p>
                Manage your job listings, track opportunities, and
                keep your recruitment activity organized.
              </p>
            </div>

            <div className="admin-header-actions">
              <button
                type="button"
                className="admin-manage-btn"
                onClick={() => navigate('/admin/applications')}
              >
                <span aria-hidden="true">▤</span>
                Manage Applications
              </button>

              <button
                type="button"
                className="admin-add-btn"
                onClick={handleAddClick}
              >
                <span aria-hidden="true">+</span>
                Add New Job
              </button>
            </div>
          </section>

          <section className="admin-stats">
            <article className="admin-stat-card">
              <div className="admin-stat-top">
                <span>Total Job Listings</span>
                <span className="admin-stat-icon">▤</span>
              </div>
              <strong>{jobs.length}</strong>
              <span className="admin-stat-caption">
                Jobs currently in your workspace
              </span>
            </article>

            <article className="admin-stat-card">
              <div className="admin-stat-top">
                <span>Featured Jobs</span>
                <span className="admin-stat-icon">✦</span>
              </div>
              <strong>{featuredCount}</strong>
              <span className="admin-stat-caption">
                Highlighted opportunities
              </span>
            </article>

            <article className="admin-stat-card">
              <div className="admin-stat-top">
                <span>Companies</span>
                <span className="admin-stat-icon">◇</span>
              </div>
              <strong>{companyCount}</strong>
              <span className="admin-stat-caption">
                Companies represented in listings
              </span>
            </article>
          </section>

          <section className="admin-list-section">
            <div className="admin-list-heading">
              <div>
                <span className="admin-section-eyebrow">
                  CONTENT MANAGEMENT
                </span>
                <h2>Your job listings</h2>
                <p>Review and manage the opportunities you've published.</p>
              </div>

              <span className="admin-job-count">
                {jobs.length} {jobs.length === 1 ? 'listing' : 'listings'}
              </span>
            </div>

            {loading && (
              <div className="admin-state">
                <span className="admin-loading-spinner"></span>
                Loading job listings...
              </div>
            )}

            {error && (
              <div className="admin-error" role="alert">
                Failed to load jobs: {error}
              </div>
            )}

            {!loading && !error && (
              <div className="admin-table-wrapper">
                {jobs.length === 0 ? (
                  <div className="admin-empty">
                    <span className="admin-empty-icon">▤</span>
                    <h3>No job listings yet</h3>
                    <p>
                      Create your first job listing to get started.
                    </p>
                    <button
                      type="button"
                      className="admin-add-btn"
                      onClick={handleAddClick}
                    >
                      + Create a Job
                    </button>
                  </div>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>JOB DETAILS</th>
                        <th>LOCATION</th>
                        <th>JOB TYPE</th>
                        <th>STATUS</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>

                    <tbody>
                      {jobs.map((job) => (
                        <tr key={job.id}>
                          <td>
                            <div className="admin-job-cell">
                              <div className="admin-company-avatar">
                                {job.company?.charAt(0).toUpperCase() || 'C'}
                              </div>
                              <div>
                                <strong>{job.title}</strong>
                                <span>{job.company}</span>
                              </div>
                            </div>
                          </td>

                          <td>{job.location}</td>

                          <td>
                            <span className="admin-type-tag">
                              {job.type}
                            </span>
                          </td>

                          <td>
                            <span className="admin-status-tag">
                              <span></span>
                              Published
                            </span>
                          </td>

                          <td>
                            <div className="admin-table-actions">
                              <button
                                type="button"
                                className="admin-edit-btn"
                                onClick={() => handleEditClick(job)}
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                className="admin-delete-btn"
                                onClick={() => handleDeleteClick(job.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </section>
        </>
      ) : (
        <section className="admin-form-section">
          <div className="admin-form-heading">
            <button
              type="button"
              className="admin-back-btn"
              onClick={handleCancel}
            >
              ← Back to dashboard
            </button>

            <span className="admin-eyebrow">JOB MANAGEMENT</span>

            <h1>{editingJob ? 'Edit job listing' : 'Create a new job'}</h1>

            <p>
              {editingJob
                ? 'Update the details of your existing opportunity.'
                : 'Add the details below to publish a new opportunity.'}
            </p>
          </div>

          <div className="admin-form-wrapper">
            <JobForm
              initialData={editingJob}
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
            />
          </div>
        </section>
      )}

      {confirmDeleteId !== null && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" role="dialog" aria-modal="true">
            <div className="admin-modal-icon">!</div>
            <h3>Delete this job listing?</h3>
            <p>
              This action cannot be undone. The selected job will be
              permanently removed.
            </p>

            <div className="admin-modal-actions">
              <button
                type="button"
                className="admin-modal-cancel"
                onClick={() => setConfirmDeleteId(null)}
              >
                Keep Job
              </button>

              <button
                type="button"
                className="admin-modal-confirm"
                onClick={confirmDelete}
              >
                Delete Job
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="toast" role="status">
          <span aria-hidden="true">✓</span>
          {toastMessage}
        </div>
      )}
    </main>
  );
}

export default AdminPage;
