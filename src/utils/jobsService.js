import initialJobs from '../data/jobs.json';

const STORAGE_KEY = 'jobBoardJobs';

export function getAllJobs() {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialJobs));
    return initialJobs;
  }

  return JSON.parse(stored);
}

export function saveAllJobs(jobs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
}

export function addJob(newJob) {
  const jobs = getAllJobs();
  const newId = jobs.length > 0 ? Math.max(...jobs.map((j) => j.id)) + 1 : 1;
  const jobWithId = { ...newJob, id: newId };
  const updatedJobs = [...jobs, jobWithId];
  saveAllJobs(updatedJobs);
  return jobWithId;
}

export function updateJob(id, updatedFields) {
  const jobs = getAllJobs();
  const updatedJobs = jobs.map((job) =>
    job.id === Number(id) ? { ...job, ...updatedFields } : job
  );
  saveAllJobs(updatedJobs);
}

export function deleteJob(id) {
  const jobs = getAllJobs();
  const updatedJobs = jobs.filter((job) => job.id !== Number(id));
  saveAllJobs(updatedJobs);
}