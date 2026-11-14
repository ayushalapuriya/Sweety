import { ArrowRight, BarChart3, Check, HeartPulse, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

export default function Home() {
  return <div className="home-page">
    <header className="home-nav">
      <Logo />
      <nav className="home-links">
        <a href="#how-it-works">How it works</a>
        <a href="#care">Your care, simplified</a>
      </nav>
      <div className="home-actions">
        <Link className="home-login" to="/login">Log in</Link>
        <Link className="button primary" to="/signup">Get started <ArrowRight size={16} /></Link>
      </div>
    </header>
    <main>
      <section className="hero-section">
        <div className="hero-copy">
          <div className="hero-kicker"><span><Sparkles size={14} /></span> Thoughtful glucose tracking</div>
          <h1>Feel more in control of your <em>everyday care.</em></h1>
          <p>Simple, calm, and personal. Sweety helps you understand your glucose patterns so you can focus on feeling your best.</p>
          <div className="hero-actions"><Link className="button primary hero-button" to="/signup">Start tracking for free <ArrowRight size={17} /></Link><span className="no-card"><ShieldCheck size={16} /> Private and secure</span></div>
          <div className="hero-trust"><div className="trust-avatars"><span>AM</span><span>JS</span><span>RK</span></div><span>Made for everyday wellness</span></div>
        </div>
        <div className="hero-visual">
          <div className="visual-glow"></div>
          <div className="preview-window">
            <div className="preview-top"><span className="preview-brand"><span className="preview-dot"><HeartPulse size={13} /></span> Sweety</span><span className="preview-user"></span></div>
            <div className="preview-content"><div className="preview-heading"><div><small>GOOD DAY, MAYA</small><h3>Your glucose overview</h3></div><span className="preview-add">+ Add reading</span></div><div className="preview-welcome"><div><span className="preview-heart"><HeartPulse size={14} /></span><b>Your daily check-in</b><small>Keep showing up for yourself. You’re doing great.</small></div><strong>3<small>/4<br />readings</small></strong></div><div className="preview-stats"><span><small>Total readings</small><b>3</b></span><span><small>Highest reading</small><b>148 <i>mg/dl</i></b></span><span><small>Daily average</small><b>127 <i>mg/dl</i></b></span></div><div className="preview-slots"><span><Check size={11} /><small>Morning</small><b>105 <i>mg/dl</i></b></span><span><Check size={11} /><small>After breakfast</small><b>132 <i>mg/dl</i></b></span><span className="preview-empty"><span>+</span><small>After dinner</small><b>Add reading</b></span></div></div>
          </div>
        </div>
      </section>
      <section className="home-benefits" id="how-it-works">
        <div className="benefit-intro"><p className="eyebrow">How it works</p><h2>Everything you need.<br /><em>Nothing you don’t.</em></h2><p className="benefit-intro-copy">Sweety keeps your daily routine simple: record your readings, see your progress, and understand your patterns at a glance.</p></div>
        <div className="benefit-grid"><div className="benefit"><span className="benefit-icon teal"><BarChart3 size={19} /></span><h3>See your patterns</h3><p>Clear daily and monthly summaries help you spot what matters without the overwhelm.</p></div><div className="benefit"><span className="benefit-icon blue"><HeartPulse size={19} /></span><h3>Build a simple habit</h3><p>Four thoughtful time slots make it easy to keep your routine consistent.</p></div><div className="benefit"><span className="benefit-icon lavender"><ShieldCheck size={19} /></span><h3>Your care is yours</h3><p>Your readings stay private, secure, and accessible only to you.</p></div></div>
      </section>
      <section className="care-section" id="care">
        <div className="care-illustration"><HeartPulse size={30} /></div>
        <div><p className="eyebrow">Your care, simplified</p><h2>Make room for what matters.</h2><p>Whether you’re checking in at home or sharing progress with your care team, Sweety gives you a calm, reliable place for your everyday numbers.</p><div className="care-points"><span><Check size={15} /> Private by design</span><span><Check size={15} /> Clear summaries</span><span><Check size={15} /> Easy daily tracking</span></div></div>
      </section>
    </main>
    <footer className="home-footer"><div className="home-footer-inner"><div className="footer-main"><div className="footer-brand"><Logo /><p>Simple, thoughtful glucose tracking<br />for your everyday care.</p></div><div className="footer-links"><div><b>Explore</b><a href="#how-it-works">How it works</a><a href="#care">Your care, simplified</a></div><div><b>Account</b><Link to="/login">Log in</Link><Link to="/signup">Create an account</Link></div></div><div className="footer-cta-card"><span className="footer-cta-icon"><HeartPulse size={18} /></span><b>Ready to feel more in control?</b><p>Start your wellness journey today.</p><Link to="/signup" className="footer-cta">Get started <ArrowRight size={14} /></Link></div></div><div className="footer-bottom"><span>© 2026 Sweety. Made for everyday wellness.</span><span className="footer-secure"><ShieldCheck size={14} /> Your data stays private and secure.</span></div></div></footer>
  </div>;
}
