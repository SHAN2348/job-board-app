function FilterPanel({ filters, onFilterChange, onClearFilters }) {
  return (
    <aside className="filter-panel">
      <div className="filter-panel-header">
        <h3>Filters</h3>
        <button className="filter-clear" onClick={onClearFilters}>
          Clear All
        </button>
      </div>

      <div className="filter-group">
        <label htmlFor="jobType">Job Type</label>
        <select
          id="jobType"
          value={filters.jobType}
          onChange={(e) => onFilterChange('jobType', e.target.value)}
        >
          <option value="">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="experience">Experience</label>
        <select
          id="experience"
          value={filters.experience}
          onChange={(e) => onFilterChange('experience', e.target.value)}
        >
          <option value="">Any Experience</option>
          <option value="0-1 years">0-1 years</option>
          <option value="1-2 years">1-2 years</option>
          <option value="1-3 years">1-3 years</option>
          <option value="2-4 years">2-4 years</option>
          <option value="3-5 years">3-5 years</option>
          <option value="3-6 years">3-6 years</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="minSalary">Minimum Salary (₹)</label>
        <input
          id="minSalary"
          type="number"
          placeholder="e.g. 50000"
          value={filters.minSalary}
          onChange={(e) => onFilterChange('minSalary', e.target.value)}
        />
      </div>
    </aside>
  );
}

export default FilterPanel;