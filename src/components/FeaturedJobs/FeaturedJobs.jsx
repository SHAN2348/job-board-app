import JobCard from '../JobCard/JobCard';
import { getAllJobs } from '../../utils/jobsService';
import './FeaturedJobs.css';

function FeaturedJobs() {
  const featuredJobs = getAllJobs().filter((job) => job.featured);

  return (
    <section className="featured-jobs">
      <div className="featured-jobs-container">
        <div className="featured-jobs-header">
          <h2>Featured Jobs</h2>
          <p>Hand-picked opportunities from top companies</p>
        </div>

        <div className="featured-jobs-grid">
          {featuredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedJobs;