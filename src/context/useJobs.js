
import { useContext } from 'react';
import { JobContext } from './JobContext';

export function useJobs() {
  return useContext(JobContext);
}
