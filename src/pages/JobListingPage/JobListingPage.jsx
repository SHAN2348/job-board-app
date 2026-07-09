import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import JobCard from '../../components/JobCard/JobCard';
import FilterPanel from '../../components/FilterPanel/FilterPanel';
import { getAllJobs } from '../../utils/jobsService';
import './JobListingPage.css';

function JobListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState({
    jobType: '',
    experience: '',
    minSalary: '',
  });

  const searchTitle = searchParams.get('title') || '';
  const searchLocation = searchParams.get('location') || '';
  const searchCategory = searchParams.get('category') || '';

  useEffect(() => {
  const timer = setTimeout(() => {
    setIsLoading(false);
  }, 500);

  return () => clearTimeout(timer);
}, [searchParams, filters]);

  const handleFilterChange = (filterName, value) => {
  setIsLoading(true);
  setFilters((prevFilters) => ({
    ...prevFilters,
    [filterName]: value,
  }));
};

  const handleClearFilters = () => {
    setFilters({ jobType: '', experience: '', minSalary: '' });
    setSearchParams({});
  };

  const filteredJobs = getAllJobs().filter((job) => {
    const matchesTitle = job.title.toLowerCase().includes(searchTitle.toLowerCase());
    const matchesLocation = job.location.toLowerCase().includes(searchLocation.toLowerCase());
    const matchesCategory = searchCategory ? job.category === searchCategory : true;
    const matchesJobType = filters.jobType ? job.type === filters.jobType : true;
    const matchesExperience = filters.experience ? job.experience === filters.experience : true;
    const matchesSalary = filters.minSalary
      ? job.salary.min >= Number(filters.minSalary)
      : true;

    return (
      matchesTitle &&
      matchesLocation &&
      matchesCategory &&
      matchesJobType &&
      matchesExperience &&
      matchesSalary
    );
  });

  return (
    <div className="job-listing-page">
      <div className="job-listing-header">
        <h1>Browse Jobs</h1>
        <p>{filteredJobs.length} jobs found</p>
      </div>

      <div className="job-listing-layout">
        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        <div className="job-listing-results">
          {isLoading ? (
            <div className="job-listing-loader">
              <div className="spinner"></div>
              <p>Loading jobs...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="job-listing-empty">
              <span className="job-listing-empty-icon">🔍</span>
              <h3>No jobs found</h3>
              <p>Try adjusting your search or filters to find more results.</p>
            </div>
          ) : (
            <div className="job-listing-grid">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobListingPage;