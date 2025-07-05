import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [email, setEmail] = useState(localStorage.getItem('urmonitor_email') || '');
  const [inputEmail, setInputEmail] = useState('');
  const [status, setStatus] = useState('');
  const [lastChecked, setLastChecked] = useState(null);
  const [changed, setChanged] = useState(false);
  const [alert, setAlert] = useState(null);
  const [monitorDays, setMonitorDays] = useState(7);
  const [monitorUntil, setMonitorUntil] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('urmonitor_dark');
    return saved === 'true';
  });
  const [page, setPage] = useState('home');

  useEffect(() => {
    fetchStatus();
    // Poll every 30s for demo
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('urmonitor_dark', darkMode);
  }, [darkMode]);

  const fetchStatus = async () => {
    try {
      const res = await axios.get(`${API_URL}/status`);
      setStatus(res.data.status);
      setLastChecked(res.data.lastChecked);
      setChanged(res.data.changed);
    } catch (err) {
      setStatus('Error fetching status');
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!inputEmail) return;
    try {
      const res = await axios.post(`${API_URL}/subscribe`, { email: inputEmail, days: monitorDays });
      setAlert({ type: 'success', message: res.data.message });
      setEmail(inputEmail);
      localStorage.setItem('urmonitor_email', inputEmail);
      setInputEmail('');
      setMonitorUntil(res.data.monitorUntil);
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Error subscribing.' });
    }
  };

  return (
    <div className="ur-main">
      <header className="ur-header">
        <div className="ur-logo">
          <span className="ur-logo-icon" role="img" aria-label="Monitor">📊</span>
          <span style={{ fontWeight: 600, fontSize: '1.25rem', color: 'var(--primary)' }}>UR Monitor</span>
        </div>
        <nav className="ur-nav">
          <button className={`ur-nav-btn${page === 'home' ? ' active' : ''}`} onClick={() => setPage('home')}>Home</button>
          <button className={`ur-nav-btn${page === 'about' ? ' active' : ''}`} onClick={() => setPage('about')}>About</button>
          <button className={`ur-nav-btn${page === 'contact' ? ' active' : ''}`} onClick={() => setPage('contact')}>Contact Us</button>
        </nav>
        <button
          className="ur-dark-toggle"
          onClick={() => setDarkMode((d) => !d)}
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle dark mode"
        >
          {darkMode ? '🌙' : '☀️'}
        </button>
      </header>

      <aside className="ur-sidebar">
        <div className="ur-card">
          <h3>Quick Stats</h3>
          <div className="ur-status-section">
            <div>
              <span className="ur-label">Status:</span> {status}
            </div>
            <div>
              <span className="ur-label">Last checked:</span> {lastChecked ? new Date(lastChecked).toLocaleString() : 'N/A'}
            </div>
            <div>
              <span className="ur-label">Change detected:</span> {changed ? 'Yes' : 'No'}
            </div>
          </div>
        </div>
        {email && (
          <div className="ur-card">
            <h3>Your Subscription</h3>
            <div className="ur-status-section">
              <div>
                <span className="ur-label">Email:</span> {email}
              </div>
              {monitorUntil && (
                <div>
                  <span className="ur-label">Monitoring until:</span> {new Date(monitorUntil).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        )}
      </aside>

      <main className="ur-content">
        {page === 'home' && (
          <>
            <div className="ur-card">
              <h1 className="ur-title">University Result Monitor</h1>
              <div className="ur-desc">
                Monitor your university result page and get notified by email when it changes.
              </div>
              <form onSubmit={handleSubscribe} className="ur-form">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={inputEmail}
                  onChange={e => setInputEmail(e.target.value)}
                  required
                />
                <select value={monitorDays} onChange={e => setMonitorDays(Number(e.target.value))}>
                  <option value={1}>1 day</option>
                  <option value={3}>3 days</option>
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                  <option value={30}>30 days</option>
                </select>
                <button type="submit">Subscribe</button>
              </form>
              {alert && (
                <div className={`ur-alert ${alert.type}`}>{alert.message}</div>
              )}
            </div>
            <div className="ur-bmsce-box">
              <strong>Note:</strong> This website is exclusively for <span style={{ color: 'var(--primary)', fontWeight: 600 }}>BMSCE</span> students.<br />
              <a
                href="https://results.bmsce.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="ur-bmsce-link"
              >
                Go to Official BMSCE Results Page
              </a>
            </div>
          </>
        )}

        {page === 'about' && (
          <div className="ur-card">
            <h1 className="ur-title">About</h1>
            <div className="ur-desc">
              <p><b>UR Monitor</b> is a free tool that helps you track changes to your university result page. Subscribe with your email and get instant notifications when your results are updated. Built with privacy and simplicity in mind.</p>
              <ul style={{ textAlign: 'left', margin: '16px auto', maxWidth: 400 }}>
                <li>No login required</li>
                <li>Choose your monitoring duration</li>
                <li>Unsubscribe automatically after expiry</li>
                <li>Open source and easy to use</li>
              </ul>
            </div>
          </div>
        )}

        {page === 'contact' && (
          <div className="ur-card">
            <h1 className="ur-title">Contact Us</h1>
            <div className="ur-desc">
              <p>Have questions, feedback, or need support?</p>
              <p>Email: <a href="mailto:support@urmonitor.com" style={{ color: 'var(--primary)' }}>support@urmonitor.com</a></p>
              <p>We'll get back to you as soon as possible!</p>
            </div>
          </div>
        )}
      </main>

      <footer className="ur-footer">
        <div className="ur-footer-section">
          <h3>Quick Links</h3>
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="ur-footer-section">
          <h3>Resources</h3>
          <a href="#faq">FAQ</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
        </div>
        <div className="ur-footer-section">
          <h3>Connect</h3>
          <a href="#github">GitHub</a>
          <a href="#twitter">Twitter</a>
          <a href="#linkedin">LinkedIn</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
