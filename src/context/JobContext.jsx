
import { mapJobFromAPI } from '../utils/jobMapper';
import { useEffect, useState } from 'react';
import { JobContext } from './JobContext';
import { API_BASE_URL } from '../utils/api';

export function JobProvider({ children }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        setError(null);

        let nextUrl = `${API_BASE_URL}/api/jobs/`;
        let allJobs = [];

        while (nextUrl) {
          const response = await fetch(nextUrl);

          if (!response.ok) {
            throw new Error('Failed to fetch jobs');
          }

          const data = await response.json();

          allJobs = [...allJobs, ...data.results];

          nextUrl = data.next;
        }

        const mappedJobs = allJobs.map(mapJobFromAPI);

        setJobs(mappedJobs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  return (
    <JobContext.Provider value={{ jobs, setJobs, loading, error }}>
      {children}
    </JobContext.Provider>
  );
}
