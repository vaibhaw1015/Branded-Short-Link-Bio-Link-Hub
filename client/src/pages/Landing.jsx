import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

// === Step-by-step demo data ===
const DEMO_STEPS = [
  {
    id: 1,
    label: 'Sign Up',
    icon: '👤',
    title: 'Create Your Free Account',
    description: 'Register in seconds. Verify your email to unlock your personal ShortLink Hub dashboard.',
    screen: <SignupScreen />,
  },
  {
    id: 2,
    label: 'Shorten URL',
    icon: '🔗',
    title: 'Paste & Shorten Any URL',
    description: 'Paste any long URL, choose a custom vanity slug or let us generate one, and instantly get a branded short link.',
    screen: <ShortenScreen />,
  },
  {
    id: 3,
    label: 'Share It',
    icon: '📤',
    title: 'Share Your Short Link',
    description: 'Copy the short link, scan the QR code, or share it directly to social media — all from your dashboard.',
    screen: <ShareScreen />,
  },
  {
    id: 4,
    label: 'Analytics',
    icon: '📊',
    title: 'Track Clicks & Analytics',
    description: 'Watch real-time clicks roll in. See device breakdown, top referrers, and a daily time-series chart powered by MongoDB pipelines.',
    screen: <AnalyticsScreen />,
  },
  {
    id: 5,
    label: 'Bio Page',
    icon: '🎨',
    title: 'Build Your Link-in-Bio',
    description: 'Design a beautiful creator profile with your avatar, social links, theme, and all your short links — all on one public page.',
    screen: <BioScreen />,
  },
];

// ======== Mock Screen Components ========

function SignupScreen() {
  return (
    <div className="mock-screen signup-mock">
      <div className="mock-header">
        <span className="mock-logo">⚡ ShortLink Hub</span>
      </div>
      <div className="mock-body center">
        <div className="mock-card animate-pop">
          <h3>Create Account</h3>
          <div className="mock-field"><span className="mock-label">Full Name</span><div className="mock-input filled">Vaibhaw Sharma</div></div>
          <div className="mock-field"><span className="mock-label">Email</span><div className="mock-input filled">vaibhaw@example.com</div></div>
          <div className="mock-field"><span className="mock-label">Password</span><div className="mock-input filled">••••••••••</div></div>
          <div className="mock-btn-primary">Create Account →</div>
          <p className="mock-hint">Already have an account? <span className="mock-link">Sign in</span></p>
        </div>
      </div>
    </div>
  );
}

function ShortenScreen() {
  const [typed, setTyped] = useState('');
  const full = 'https://www.example.com/very/long/article/path?ref=newsletter';
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setTyped(full.slice(0, i + 1));
      i++;
      if (i >= full.length) clearInterval(timer);
    }, 35);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="mock-screen shorten-mock">
      <div className="mock-header">
        <span className="mock-logo">⚡ ShortLink Hub</span>
        <span className="mock-nav">Dashboard</span>
      </div>
      <div className="mock-body">
        <div className="mock-card animate-pop">
          <h3>Shorten a URL</h3>
          <div className="mock-field">
            <span className="mock-label">Long URL</span>
            <div className="mock-input typing">{typed}<span className="cursor">|</span></div>
          </div>
          <div className="mock-field">
            <span className="mock-label">Custom Alias (optional)</span>
            <div className="mock-input filled">my-article</div>
          </div>
          <div className="mock-btn-primary">⚡ Shorten</div>
        </div>
        <div className="mock-result animate-pop-delay">
          <span className="result-label">✅ Short link created!</span>
          <span className="result-url">shlnk.io/<strong>my-article</strong></span>
          <div className="result-actions">
            <span className="result-btn">Copy</span>
            <span className="result-btn">QR Code</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShareScreen() {
  return (
    <div className="mock-screen share-mock">
      <div className="mock-header">
        <span className="mock-logo">⚡ ShortLink Hub</span>
      </div>
      <div className="mock-body center">
        <div className="mock-card animate-pop share-card">
          <h3>Share Your Link</h3>
          <div className="share-url-row">
            <span className="share-url">shlnk.io/my-article</span>
            <span className="share-copy-btn">Copy ✓</span>
          </div>
          <div className="share-qr">
            <div className="qr-visual">
              {[...Array(6)].map((_, r) => (
                <div key={r} className="qr-row">
                  {[...Array(6)].map((_, c) => (
                    <div key={c} className={`qr-cell ${Math.random() > 0.4 ? 'filled' : ''}`} />
                  ))}
                </div>
              ))}
            </div>
            <span className="qr-label">Scan QR Code</span>
          </div>
          <div className="share-socials">
            <span className="social-pill twitter">Twitter/X</span>
            <span className="social-pill linkedin">LinkedIn</span>
            <span className="social-pill whatsapp">WhatsApp</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsScreen() {
  const bars = [60, 85, 45, 95, 70, 55, 90];
  return (
    <div className="mock-screen analytics-mock">
      <div className="mock-header">
        <span className="mock-logo">⚡ ShortLink Hub</span>
        <span className="mock-nav">Analytics</span>
      </div>
      <div className="mock-body analytics-body">
        <div className="analytics-stats animate-pop">
          <div className="stat-chip"><span className="stat-num">1,248</span><span className="stat-lbl">Total Clicks</span></div>
          <div className="stat-chip green"><span className="stat-num">+18%</span><span className="stat-lbl">This Week</span></div>
          <div className="stat-chip pink"><span className="stat-num">62%</span><span className="stat-lbl">Mobile</span></div>
        </div>
        <div className="mock-chart animate-pop-delay">
          {bars.map((h, i) => (
            <div key={i} className="chart-col">
              <div className="chart-bar" style={{ '--bar-h': `${h}%`, animationDelay: `${i * 0.1}s` }} />
              <span className="chart-day">{['M','T','W','T','F','S','S'][i]}</span>
            </div>
          ))}
        </div>
        <div className="mock-devices animate-pop-delay">
          <div className="device-row"><span>Desktop</span><div className="device-bar" style={{ '--w': '55%' }} /></div>
          <div className="device-row"><span>Mobile</span><div className="device-bar mobile" style={{ '--w': '35%' }} /></div>
          <div className="device-row"><span>Tablet</span><div className="device-bar tablet" style={{ '--w': '10%' }} /></div>
        </div>
      </div>
    </div>
  );
}

function BioScreen() {
  return (
    <div className="mock-screen bio-mock">
      <div className="mock-header">
        <span className="mock-logo">⚡ ShortLink Hub</span>
        <span className="mock-nav">Bio Builder</span>
      </div>
      <div className="mock-body bio-body">
        <div className="bio-editor animate-pop">
          <h4>Customize Bio</h4>
          <div className="theme-pills">
            <span className="theme-pill active">🌙 Dark Slate</span>
            <span className="theme-pill">☀️ Minimal</span>
            <span className="theme-pill">🌈 Gradient</span>
          </div>
          <div className="bio-links-list">
            <div className="bio-link-item">🔗 My Latest Article</div>
            <div className="bio-link-item">📦 GitHub Portfolio</div>
            <div className="bio-link-item">🎥 YouTube Channel</div>
          </div>
        </div>
        <div className="bio-preview animate-pop-delay">
          <div className="bio-preview-phone">
            <div className="phone-avatar">VS</div>
            <div className="phone-name">Vaibhaw Sharma</div>
            <div className="phone-bio">Developer · Creator</div>
            <div className="phone-btn">🔗 My Latest Article</div>
            <div className="phone-btn">📦 GitHub Portfolio</div>
            <div className="phone-btn">🎥 YouTube Channel</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ======== Features Data ========
const FEATURES = [
  { icon: '⚡', title: 'Instant Redirection', desc: 'HTTP 302 with zero-latency async telemetry. No waiting — your users land fast.', color: 'indigo' },
  { icon: '📊', title: 'Rich Analytics', desc: 'Daily time-series, device breakdown, and referrer charts via MongoDB pipelines.', color: 'violet' },
  { icon: '🔒', title: 'Dual-Token Auth', desc: '15-min access tokens + 7-day rotating refresh tokens with session invalidation.', color: 'pink' },
  { icon: '🎨', title: 'Link-in-Bio Builder', desc: 'Visual creator profile with live preview, avatar upload, and 3 gorgeous themes.', color: 'emerald' },
  { icon: '🔗', title: 'Custom Vanity Slugs', desc: 'Claim your branded alias like shlnk.io/my-brand for any URL you shorten.', color: 'amber' },
  { icon: '📱', title: 'QR Code Generator', desc: 'Every short link gets an instant, high-resolution scannable QR code.', color: 'cyan' },
];

// ======== Main Landing Page ========
export function Landing() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const progressRef = useRef(null);

  const startPlay = () => {
    setIsPlaying(true);
    setActiveStep(0);
    setProgress(0);
  };

  const stopPlay = () => {
    setIsPlaying(false);
    clearInterval(intervalRef.current);
    clearInterval(progressRef.current);
    setProgress(0);
  };

  useEffect(() => {
    if (!isPlaying) return;

    setProgress(0);

    progressRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) return 100;
        return p + 1;
      });
    }, 50); // 5000ms total per step

    intervalRef.current = setTimeout(() => {
      setActiveStep(prev => {
        const next = prev + 1;
        if (next >= DEMO_STEPS.length) {
          setIsPlaying(false);
          setProgress(0);
          return 0;
        }
        setProgress(0);
        clearInterval(progressRef.current);
        return next;
      });
    }, 5000);

    return () => {
      clearTimeout(intervalRef.current);
      clearInterval(progressRef.current);
    };
  }, [isPlaying, activeStep]);

  const goToStep = (i) => {
    clearTimeout(intervalRef.current);
    clearInterval(progressRef.current);
    setActiveStep(i);
    setProgress(0);
    if (isPlaying) {
      // restart progress for new step
      progressRef.current = setInterval(() => {
        setProgress(p => (p >= 100 ? 100 : p + 1));
      }, 50);
      intervalRef.current = setTimeout(() => {
        setActiveStep(prev => {
          const next = prev + 1;
          if (next >= DEMO_STEPS.length) { setIsPlaying(false); setProgress(0); return 0; }
          setProgress(0);
          clearInterval(progressRef.current);
          return next;
        });
      }, 5000);
    }
  };

  return (
    <div className="landing-root">
      {/* === NAVBAR === */}
      <nav className="landing-nav">
        <div className="nav-inner">
          <div className="nav-brand">
            <span className="nav-logo-icon">⚡</span>
            <span className="nav-logo-text">ShortLink <span className="gradient-text">Hub</span></span>
          </div>
          <div className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
          </div>
          <div className="nav-cta">
            <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
            <Link to="/signup" className="btn btn-primary btn-sm">Get Started Free</Link>
          </div>
        </div>
      </nav>

      {/* === HERO === */}
      <section className="hero-section">
        <div className="hero-badge">
          <span className="badge badge-indigo">✨ Bitly + Linktree in one platform</span>
        </div>
        <h1 className="hero-title">
          Shorten Links.<br />
          <span className="gradient-text">Track Everything.</span><br />
          Build Your Brand.
        </h1>
        <p className="hero-subtitle">
          ShortLink Hub is your all-in-one branded URL shortener, analytics engine, and link-in-bio builder — built for creators, marketers, and developers who demand speed, insight, and style.
        </p>
        <div className="hero-cta-group">
          <Link to="/signup" className="btn btn-primary hero-btn">
            🚀 Start for Free — No Credit Card
          </Link>
          <a href="#how-it-works" className="btn btn-secondary hero-btn">
            ▶ See How It Works
          </a>
        </div>
        <div className="hero-stats">
          <div className="hero-stat"><strong>302ms</strong><span>Avg. Redirect Speed</span></div>
          <div className="hero-stat-divider" />
          <div className="hero-stat"><strong>∞</strong><span>Links per Account</span></div>
          <div className="hero-stat-divider" />
          <div className="hero-stat"><strong>100%</strong><span>Analytics Included</span></div>
        </div>

        {/* Floating mock preview */}
        <div className="hero-preview-wrapper">
          <div className="hero-preview glass-panel">
            <div className="preview-top-bar">
              <div className="window-dot red" /><div className="window-dot yellow" /><div className="window-dot green" />
              <div className="preview-url-bar">shlnk.io/dashboard</div>
            </div>
            <div className="preview-dashboard-mock">
              <div className="pdm-sidebar">
                <div className="pdm-nav-item active">📊 Dashboard</div>
                <div className="pdm-nav-item">🔗 Links</div>
                <div className="pdm-nav-item">📈 Analytics</div>
                <div className="pdm-nav-item">🎨 Bio Page</div>
              </div>
              <div className="pdm-main">
                <div className="pdm-stat-row">
                  <div className="pdm-stat-card"><div className="pdm-stat-val">1,248</div><div className="pdm-stat-lbl">Total Clicks</div></div>
                  <div className="pdm-stat-card"><div className="pdm-stat-val">24</div><div className="pdm-stat-lbl">Short Links</div></div>
                  <div className="pdm-stat-card"><div className="pdm-stat-val">+18%</div><div className="pdm-stat-lbl">This Week</div></div>
                </div>
                <div className="pdm-chart-area">
                  {[40,65,30,80,55,90,70].map((h,i)=>(
                    <div key={i} className="pdm-bar-col">
                      <div className="pdm-bar" style={{'--h':`${h}%`, animationDelay:`${i*0.12}s`}} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === FEATURES === */}
      <section className="features-section" id="features">
        <div className="section-inner">
          <div className="section-header">
            <span className="badge badge-indigo">🌟 Features</span>
            <h2 className="section-title">Everything You Need, Nothing You Don't</h2>
            <p className="section-subtitle">A production-grade stack — Node.js, MongoDB, React — delivering enterprise analytics without the enterprise price tag.</p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className={`feature-card glass-panel feature-card--${f.color}`} style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === HOW IT WORKS (Video-Style Demo) === */}
      <section className="how-section" id="how-it-works">
        <div className="section-inner">
          <div className="section-header">
            <span className="badge badge-indigo">▶ How It Works</span>
            <h2 className="section-title">See ShortLink Hub in Action</h2>
            <p className="section-subtitle">Watch the interactive step-by-step walkthrough of the full product experience — from signup to analytics.</p>
          </div>

          {/* Video Player Shell */}
          <div className="demo-player glass-panel">
            {/* Player top bar */}
            <div className="player-top-bar">
              <div className="window-dot red" /><div className="window-dot yellow" /><div className="window-dot green" />
              <span className="player-title">ShortLink Hub — Interactive Demo</span>
              <span className="player-time">{activeStep + 1} / {DEMO_STEPS.length}</span>
            </div>

            {/* Progress bar */}
            <div className="player-progress-track">
              <div
                className="player-progress-fill"
                style={{ width: isPlaying ? `${progress}%` : `${(activeStep / (DEMO_STEPS.length - 1)) * 100}%` }}
              />
            </div>

            {/* Step tabs */}
            <div className="player-step-tabs">
              {DEMO_STEPS.map((step, i) => (
                <button
                  key={step.id}
                  className={`step-tab ${i === activeStep ? 'active' : ''} ${i < activeStep ? 'done' : ''}`}
                  onClick={() => goToStep(i)}
                >
                  <span className="step-tab-icon">{i < activeStep ? '✓' : step.icon}</span>
                  <span className="step-tab-label">{step.label}</span>
                </button>
              ))}
            </div>

            {/* Screen area */}
            <div className="player-screen-area">
              <div className="player-screen" key={activeStep}>
                {DEMO_STEPS[activeStep].screen}
              </div>
              <div className="player-caption">
                <div className="caption-badge">{`Step ${activeStep + 1}`}</div>
                <h3 className="caption-title">{DEMO_STEPS[activeStep].title}</h3>
                <p className="caption-desc">{DEMO_STEPS[activeStep].description}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="player-controls">
              <button
                className="ctrl-btn"
                onClick={() => goToStep(Math.max(0, activeStep - 1))}
                disabled={activeStep === 0}
              >⏮ Prev</button>

              {isPlaying ? (
                <button className="ctrl-btn ctrl-play" onClick={stopPlay}>⏸ Pause</button>
              ) : (
                <button className="ctrl-btn ctrl-play" onClick={startPlay}>▶ Auto Play</button>
              )}

              <button
                className="ctrl-btn"
                onClick={() => goToStep(Math.min(DEMO_STEPS.length - 1, activeStep + 1))}
                disabled={activeStep === DEMO_STEPS.length - 1}
              >Next ⏭</button>
            </div>
          </div>
        </div>
      </section>

      {/* === TECH STACK === */}
      <section className="tech-section">
        <div className="section-inner">
          <div className="section-header">
            <span className="badge badge-indigo">🛠 Tech Stack</span>
            <h2 className="section-title">Built With Modern, Production-Grade Tech</h2>
          </div>
          <div className="tech-grid">
            {[
              { name: 'Node.js + Express', role: 'Backend API', icon: '🟢' },
              { name: 'MongoDB + Mongoose', role: 'Database', icon: '🍃' },
              { name: 'React + Vite', role: 'Frontend', icon: '⚛️' },
              { name: 'JWT Dual Tokens', role: 'Auth & Security', icon: '🔐' },
              { name: 'Recharts', role: 'Analytics Charts', icon: '📈' },
              { name: 'Cloudinary', role: 'Image Storage', icon: '☁️' },
              { name: 'TanStack Query', role: 'Data Fetching', icon: '🔄' },
              { name: 'Nanoid + SHA-256', role: 'Slug & Privacy', icon: '🔑' },
            ].map((t, i) => (
              <div key={i} className="tech-chip glass-panel">
                <span className="tech-icon">{t.icon}</span>
                <div>
                  <div className="tech-name">{t.name}</div>
                  <div className="tech-role">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === CTA SECTION === */}
      <section className="cta-section">
        <div className="cta-inner glass-panel">
          <span className="cta-emoji">🚀</span>
          <h2 className="cta-title">Ready to take control of your links?</h2>
          <p className="cta-sub">Join ShortLink Hub today and get instant access to URL shortening, real-time analytics, and a beautiful link-in-bio — for free.</p>
          <div className="cta-actions">
            <Link to="/signup" className="btn btn-primary cta-btn">Create Free Account →</Link>
            <Link to="/login" className="btn btn-secondary cta-btn">Sign In</Link>
          </div>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="landing-footer">
        <div className="footer-brand">
          <span className="nav-logo-icon">⚡</span>
          <span>ShortLink <span className="gradient-text">Hub</span></span>
        </div>
        <p className="footer-copy">© 2026 ShortLink Hub · Built with ❤️ using MERN Stack</p>
      </footer>
    </div>
  );
}

export default Landing;
