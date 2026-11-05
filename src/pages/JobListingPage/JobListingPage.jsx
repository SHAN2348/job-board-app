
import { useJobs } from '../../context/useJobs';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import JobCard from '../../components/JobCard/JobCard';
import FilterPanel from '../../components/FilterPanel/FilterPanel';
import './JobListingPage.css';

function JobListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { jobs, loading, error } = useJobs();

  const [filters, setFilters] = useState({
    jobType: '',
    experience: '',
    minSalary: '',
  });

  const searchTitle = searchParams.get('title') || '';
  const searchLocation = searchParams.get('location') || '';
  const searchCategory = searchParams.get('category') || '';

  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({ jobType: '', experience: '', minSalary: '' });
    setSearchParams({});
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesTitle = (job.title || '')
      .toLowerCase()
      .includes(searchTitle.toLowerCase());

    const matchesLocation = (job.location || '')
      .toLowerCase()
      .includes(searchLocation.toLowerCase());

    const matchesCategory = searchCategory
      ? job.category === searchCategory
      : true;

    const matchesJobType = filters.jobType
      ? job.type === filters.jobType
      : true;

    const matchesExperience = filters.experience
      ? job.experience === filters.experience
      : true;

    const matchesSalary = filters.minSalary
      ? job.salary?.min != null &&
        job.salary.min >= Number(filters.minSalary)
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
    <main className="job-listing-page">
      <section className="job-listing-header">
        <div className="job-listing-heading">
          <span className="job-listing-eyebrow">CAREER OPPORTUNITIES</span>
          <h1>Find your next opportunity.</h1>
          <p>
            Explore roles that match your skills, experience and ambitions.
          </p>
        </div>

        <div className="job-listing-summary">
          <span className="job-listing-result-count">
            {loading ? '—' : filteredJobs.length}
          </span>
          <span>Matching jobs</span>
        </div>
      </section>

      {(searchTitle || searchLocation || searchCategory) && (
        <div className="job-search-context">
          <span>Search results</span>
          {searchTitle && <span className="search-context-tag">{searchTitle}</span>}
          {searchLocation && <span className="search-context-tag">{searchLocation}</span>}
          {searchCategory && <span className="search-context-tag">{searchCategory}</span>}
        </div>
      )}

      <div className="job-listing-layout">
        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        <section className="job-listing-results">
          <div className="job-results-header">
            <div>
              <h2>Available positions</h2>
              <p>Discover your next career move.</p>
            </div>
            {!loading && !error && (
              <span className="job-results-total">
                {filteredJobs.length} results
              </span>
            )}
          </div>

          {loading ? (
            <div className="job-listing-state">
              <div className="spinner"></div>
              <p>Finding opportunities...</p>
            </div>
          ) : error ? (
            <div className="job-listing-empty">
              <span className="job-listing-empty-icon">!</span>
              <h3>Unable to load jobs</h3>
              <p>{error}</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="job-listing-empty">
              <span className="job-listing-empty-icon">⌕</span>
              <h3>No jobs found</h3>
              <p>
                Try adjusting your search or clearing some filters to see
                more opportunities.
              </p>
              <button
                type="button"
                className="job-empty-clear"
                onClick={handleClearFilters}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="job-listing-grid">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default JobListingPage;
