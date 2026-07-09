import { useNavigate } from 'react-router-dom';
import { getAllJobs } from '../../utils/jobsService';
import './Categories.css';

const categoryIcons = {
  Engineering: '💻',
  Design: '🎨',
  Marketing: '📣',
  Data: '📊',
  Sales: '💰',
  Finance: '📈',
};

function Categories() {
  const navigate = useNavigate();

  const categoryCounts = getAllJobs().reduce((counts, job) => {
    counts[job.category] = (counts[job.category] || 0) + 1;
    return counts;
  }, {});

  const categories = Object.keys(categoryCounts).map((name) => ({
    name,
    count: categoryCounts[name],
    icon: categoryIcons[name] || '🗂️',
  }));

  const handleCategoryClick = (categoryName) => {
    navigate(`/jobs?category=${categoryName}`);
  };

  return (
    <section className="categories">
      <div className="categories-container">
        <div className="categories-header">
          <h2>Browse by Category</h2>
          <p>Explore opportunities across different fields</p>
        </div>

        <div className="categories-grid">
          {categories.map((category) => (
            <button
              key={category.name}
              className="category-card"
              onClick={() => handleCategoryClick(category.name)}
            >
              <span className="category-icon">{category.icon}</span>
              <h3 className="category-name">{category.name}</h3>
              <p className="category-count">
                {category.count} {category.count === 1 ? 'job' : 'jobs'}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;