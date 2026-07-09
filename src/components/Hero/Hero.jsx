import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

function Hero() {
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?title=${searchTitle}&location=${searchLocation}`);
  };

  return (
    <section className="hero">
      <div className="hero-container">
        <h1 className="hero-title">Find Your Dream Job Today</h1>
        <p className="hero-subtitle">
          Browse thousands of job openings from top companies, all in one place.
        </p>

        <form className="hero-search" onSubmit={handleSearch}>
  <label htmlFor="hero-search-title" className="visually-hidden">
    Job title or keyword
  </label>
  <input
    id="hero-search-title"
    name="title"
    type="text"
    placeholder="Job title or keyword"
    value={searchTitle}
    onChange={(e) => setSearchTitle(e.target.value)}
    className="hero-search-input"
    autoComplete="off"
  />

  <label htmlFor="hero-search-location" className="visually-hidden">
    Location
  </label>
  <input
    id="hero-search-location"
    name="location"
    type="text"
    placeholder="Location"
    value={searchLocation}
    onChange={(e) => setSearchLocation(e.target.value)}
    className="hero-search-input"
    autoComplete="off"
  />

  <button type="submit" className="hero-search-button">
    Search Jobs
  </button>
</form>

        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-number">2,500+</span>
            <span className="hero-stat-label">Active Jobs</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-number">800+</span>
            <span className="hero-stat-label">Companies</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-number">50k+</span>
            <span className="hero-stat-label">Job Seekers</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;