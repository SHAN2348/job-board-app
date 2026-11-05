
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

function Hero() {
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(
      `/jobs?title=${encodeURIComponent(searchTitle)}&location=${encodeURIComponent(searchLocation)}`
    );
  };

  return (
    <section className="hero">
      <div className="hero-glow hero-glow-one"></div>
      <div className="hero-glow hero-glow-two"></div>

      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot"></span>
            YOUR NEXT OPPORTUNITY STARTS HERE
          </div>

          <h1 className="hero-title">
            Discover work that
            <br />
            <span>moves you forward.</span>
          </h1>

          <p className="hero-subtitle">
            Explore meaningful opportunities, connect with leading companies,
            and take the next step in your career.
          </p>
        </div>

        <form className="hero-search" onSubmit={handleSearch}>
          <div className="hero-search-field">
            <span className="hero-field-icon" aria-hidden="true">⌕</span>
            <div className="hero-input-wrapper">
              <label htmlFor="hero-search-title">What are you looking for?</label>
              <input
                id="hero-search-title"
                name="title"
                type="text"
                placeholder="Job title or keyword"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                autoComplete="off"
              />
            </div>
          </div>

          <div className="hero-search-divider"></div>

          <div className="hero-search-field">
            <span className="hero-field-icon" aria-hidden="true">⌖</span>
            <div className="hero-input-wrapper">
              <label htmlFor="hero-search-location">Where?</label>
              <input
                id="hero-search-location"
                name="location"
                type="text"
                placeholder="City or remote"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                autoComplete="off"
              />
            </div>
          </div>

          <button type="submit" className="hero-search-button">
            Find Jobs <span aria-hidden="true">→</span>
          </button>
        </form>

        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-number">2,500+</span>
            <span className="hero-stat-label">Active Jobs</span>
          </div>

          <div className="hero-stat-divider"></div>

          <div className="hero-stat">
            <span className="hero-stat-number">800+</span>
            <span className="hero-stat-label">Companies</span>
          </div>

          <div className="hero-stat-divider"></div>

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
