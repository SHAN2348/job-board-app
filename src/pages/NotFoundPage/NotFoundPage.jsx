import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div style={{ padding: '5rem 1.5rem', textAlign: 'center', minHeight: '60vh' }}>
      <h1 style={{ fontSize: '4rem', margin: 0 }}>404</h1>
      <p style={{ fontSize: '1.2rem', color: '#6b7280', marginBottom: '1.5rem' }}>
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        style={{
          background: '#4f9dfa',
          color: '#fff',
          padding: '0.7rem 1.5rem',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 600,
        }}
      >
        Back to Home
      </Link>
    </div>
  );
}

export default NotFoundPage;