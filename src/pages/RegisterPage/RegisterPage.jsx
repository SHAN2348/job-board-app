
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../utils/api';
import './RegisterPage.css';

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const messages = Object.entries(data)
          .flatMap(([field, errors]) =>
            (Array.isArray(errors) ? errors : [errors]).map(
              (message) => `${field}: ${message}`
            )
          );

        throw new Error(
          messages.join(' ') || 'Registration failed. Please try again.'
        );
      }

      navigate('/login', {
        state: {
          registrationSuccess:
            'Account created successfully! Please sign in.',
        },
      });
    } catch (err) {
      setError(
        err.message || 'Unable to connect to the server. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-layout">
        <section className="register-showcase">
          <div className="register-showcase-glow" />

          <div className="register-showcase-content">
            <div className="register-showcase-label">
              <span className="register-label-dot" />
              YOUR NEXT OPPORTUNITY STARTS HERE
            </div>

            <h1>
              Build your
              <br />
              <span>career journey.</span>
            </h1>

            <p>
              Create your account, discover opportunities, and take the next
              step towards your professional future.
            </p>

            <div className="register-showcase-bottom">
              <div className="register-showcase-icon">J</div>
              <div>
                <strong>JobBoard</strong>
                <span>Connecting talent with opportunity</span>
              </div>
            </div>
          </div>

          <div className="register-decoration register-decoration-one" />
          <div className="register-decoration register-decoration-two" />
        </section>

        <section className="register-form-panel">
          <div className="register-card">
            <div className="register-mobile-brand">
              <span className="register-mobile-brand-mark">J</span>
              <span>Job<span>Board</span></span>
            </div>

            <div className="register-heading">
              <span className="register-eyebrow">GET STARTED</span>
              <h2>Create your account</h2>
              <p>Enter your details to join our job seeker community.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="register-field">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                  required
                />
              </div>

              <div className="register-field">
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="register-field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </div>

              <div className="register-field">
                <label htmlFor="confirmPassword">Confirm password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Enter your password again"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
              </div>

              <div className="register-role-note">
                Account type: <strong>Job Seeker</strong>
              </div>

              {error && (
                <div className="register-error" role="alert">
                  <span className="register-error-icon">!</span>
                  {error}
                </div>
              )}

              <button
                className="register-submit"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="register-spinner" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <span>→</span>
                  </>
                )}
              </button>
            </form>

            <p className="register-login-link">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>

            <p className="register-security-note">
              <span>✦</span> Your information is securely handled.
            </p>
          </div>

          <p className="register-copyright">
            © {new Date().getFullYear()} JobBoard. All rights reserved.
          </p>
        </section>
      </div>
    </div>
  );
}

export default RegisterPage;
