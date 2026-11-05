
import './FilterPanel.css';

function FilterPanel({ filters, onFilterChange, onClearFilters }) {
  const activeFilters = Object.values(filters).filter(Boolean).length;

  return (
    <aside className="filter-panel">
      <div className="filter-panel-header">
        <div>
          <span className="filter-panel-eyebrow">REFINE RESULTS</span>
          <h3>Filters</h3>
        </div>

        <button
          className="filter-clear"
          onClick={onClearFilters}
          type="button"
        >
          Reset
        </button>
      </div>

      <div className="filter-active-count">
        {activeFilters === 0
          ? 'No filters applied'
          : `${activeFilters} ${activeFilters === 1 ? 'filter' : 'filters'} applied`}
      </div>

      <div className="filter-group">
        <label htmlFor="jobType">Employment type</label>
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
        <label htmlFor="experience">Experience level</label>
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
        <label htmlFor="minSalary">Minimum salary (₹)</label>
        <input
          id="minSalary"
          type="number"
          min="0"
          placeholder="e.g. 50000"
          value={filters.minSalary}
          onChange={(e) => onFilterChange('minSalary', e.target.value)}
        />
        <span className="filter-input-hint">
          Enter your minimum expected salary.
        </span>
      </div>

      <div className="filter-panel-note">
        <span className="filter-note-icon">✦</span>
        <p>Use filters to discover opportunities that fit your goals.</p>
      </div>
    </aside>
  );
}

export default FilterPanel;
