import { useState } from 'react';
import JobForm from '../../components/JobForm/JobForm';
import { getAllJobs, addJob, updateJob, deleteJob } from '../../utils/jobsService';
import './AdminPage.css';

function AdminPage() {
  const [jobs, setJobs] = useState(() => getAllJobs());
  const [view, setView] = useState('list');
  const [editingJob, setEditingJob] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);



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

  const handleFormSubmit = (jobPayload) => {
    if (editingJob) {
      updateJob(editingJob.id, jobPayload);
      showToast('Job updated successfully!');
    } else {
      addJob(jobPayload);
      showToast('Job added successfully!');
    }

    setJobs(getAllJobs());
    setEditingJob(null);
    setView('list');
  };

  const handleDeleteClick = (id) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = () => {
    deleteJob(confirmDeleteId);
    setJobs(getAllJobs());
    setConfirmDeleteId(null);
    showToast('Job deleted successfully!');
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Admin Panel</h1>
          <p>Manage job listings — add, edit, or remove postings</p>
        </div>
        {view === 'list' && (
          <button className="admin-add-btn" onClick={handleAddClick}>
            + Add New Job
          </button>
        )}
      </div>

      {view === 'form' ? (
        <div className="admin-form-wrapper">
          <h2>{editingJob ? 'Edit Job' : 'Add New Job'}</h2>
          <JobForm
            initialData={editingJob}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <div className="admin-table-wrapper">
          {jobs.length === 0 ? (
            <p className="admin-empty">No jobs yet. Click "Add New Job" to create one.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td>{job.title}</td>
                    <td>{job.company}</td>
                    <td>{job.location}</td>
                    <td>{job.type}</td>
                    <td className="admin-table-actions">
                      <button
                        className="admin-edit-btn"
                        onClick={() => handleEditClick(job)}
                      >
                        Edit
                      </button>
                      <button
                        className="admin-delete-btn"
                        onClick={() => handleDeleteClick(job.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {confirmDeleteId && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h3>Delete this job?</h3>
            <p>This action cannot be undone.</p>
            <div className="admin-modal-actions">
              <button
                className="admin-modal-cancel"
                onClick={() => setConfirmDeleteId(null)}
              >
                Cancel
              </button>
              <button className="admin-modal-confirm" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && <div className="toast">✅ {toastMessage}</div>}
    </div>
  );
}

export default AdminPage;