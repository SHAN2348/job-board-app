import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { API_BASE_URL } from '../../utils/api';
import './LoginPage.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const registrationSuccess = location.state?.registrationSuccess;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed. Check your credentials.');
      }

      const userResponse = await fetch(`${API_BASE_URL}/api/me/`, {
        headers: {
          Authorization: `Bearer ${data.access}`,
        },
      });

      const userData = await userResponse.json();

      if (!userResponse.ok) {
        throw new Error(userData.detail || 'Unable to verify user account.');
      }

      login(data.access, data.refresh, userData);

      if (userData.role === 'recruiter' || userData.is_superuser) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-layout">

        <section className="login-showcase">
          <div className="login-showcase-glow"></div>

          <div className="login-showcase-content">
            <span className="login-showcase-label">
              <span className="login-label-dot"></span>
              YOUR CAREER, YOUR NEXT CHAPTER
            </span>

            <h1>
              Great careers
              <br />
              start with
              <br />
              <span>one opportunity.</span>
            </h1>

            <p>
              Discover opportunities, connect with great companies,
              and move closer to the career you want.
            </p>

            <div className="login-showcase-bottom">
              <div className="login-showcase-icon">J</div>
              <div>
                <strong>JobBoard</strong>
                <span>Opportunities that move you forward.</span>
              </div>
            </div>
          </div>

          <div className="login-decoration login-decoration-one"></div>
          <div className="login-decoration login-decoration-two"></div>
        </section>

        <section className="login-form-panel">
          <div className="login-card">
            <div className="login-mobile-brand">
              <span className="login-mobile-brand-mark">J</span>
              <span>Job<span>Board</span></span>
            </div>

            <div className="login-heading">
              <span className="login-eyebrow">WELCOME BACK</span>
              <h2>Sign in to your account</h2>
              <p>
                Enter your credentials to access your JobBoard account.
              </p>
            </div>
            {registrationSuccess && (
                <div className="login-success" role="status">
                  {registrationSuccess}
                </div>
              )}

            <form onSubmit={handleSubmit}>
              <div className="login-field">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  autoComplete="username"
                  required
                />
              </div>

              <div className="login-field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
              </div>

              {error && (
                <div className="login-error" role="alert">
                  <span className="login-error-icon">!</span>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="login-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="login-spinner"></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <span aria-hidden="true">→</span>
                  </>
                )}
              </button>
            </form>

            <p className="login-register-link">
                Don't have an account? <Link to="/register">Create an account</Link>
              </p>

            <div className="login-security-note">
              <span aria-hidden="true">✦</span>
              Your account information is securely authenticated.
            </div>
          </div>

          <p className="login-copyright">
            © {new Date().getFullYear()} JobBoard. All rights reserved.
          </p>
        </section>

      </div>
    </main>
  );
}

export default LoginPage;