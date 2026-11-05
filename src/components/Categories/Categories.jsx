
import { useNavigate } from 'react-router-dom';
import { useJobs } from '../../context/useJobs';
import './Categories.css';

const categoryIcons = {
  Engineering: '⌘',
  Design: '✳',
  Marketing: '↗',
  Data: '▥',
  Sales: '◇',
  Finance: '◎',
};

function Categories() {
  const navigate = useNavigate();
  const { jobs, loading, error } = useJobs();

  const categoryCounts = jobs.reduce((counts, job) => {
    counts[job.category] = (counts[job.category] || 0) + 1;
    return counts;
  }, {});

  const categories = Object.keys(categoryCounts).map((name) => ({
    name,
    count: categoryCounts[name],
    icon: categoryIcons[name] || '▦',
  }));

  const handleCategoryClick = (categoryName) => {
    navigate(`/jobs?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="categories">
      <div className="categories-container">
        <div className="categories-header">
          <div>
            <span className="categories-eyebrow">FIND YOUR DIRECTION</span>
            <h2>Explore by category</h2>
            <p>Find opportunities that match your skills and ambitions.</p>
          </div>
        </div>

        {loading ? (
          <p className="categories-message">Loading categories...</p>
        ) : error ? (
          <p className="categories-message">Unable to load categories.</p>
        ) : categories.length === 0 ? (
          <p className="categories-message">No categories available.</p>
        ) : (
          <div className="categories-grid">
            {categories.map((category) => (
              <button
                key={category.name}
                className="category-card"
                onClick={() => handleCategoryClick(category.name)}
                type="button"
              >
                <span className="category-icon" aria-hidden="true">
                  {category.icon}
                </span>

                <span className="category-name">{category.name}</span>

                <span className="category-card-footer">
                  <span className="category-count">
                    {category.count} {category.count === 1 ? 'job' : 'jobs'}
                  </span>
                  <span className="category-arrow" aria-hidden="true">↗</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Categories;
