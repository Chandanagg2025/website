import { useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Hammer, ArrowLeft, Sparkles, Clock, MessageCircle } from 'lucide-react';

/**
 * Reusable "Under Development" page.
 *
 * Usage:
 *  - As a route:        /coming-soon                -> generic message
 *                       /coming-soon/industrial-appliances -> "Industrial Appliances"
 *                       /coming-soon?section=Blog   -> "Blog"
 *  - As a component:    <UnderDevelopment title="Industrial Appliances" />
 */
const formatSection = (slug = '') =>
  slug
    .replace(/[-_]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());

const UnderDevelopment = ({
  title,
  message,
  icon: Icon = Hammer,
  progress = 65,
  secondaryLink = { to: '/gifts', label: 'Visit Gift Gallery' },
}) => {
  const { section } = useParams();
  const [searchParams] = useSearchParams();

  const heading =
    title ||
    formatSection(section || searchParams.get('section') || '') ||
    'Something Exciting Is Coming';

  useEffect(() => {
    const previous = document.title;
    document.title = `${heading} – Under Development | Shree Pratham`;
    return () => {
      document.title = previous;
    };
  }, [heading]);

  return (
    <section className="ud-page" aria-labelledby="ud-title">
      <div className="ud-blob ud-blob-1" aria-hidden="true" />
      <div className="ud-blob ud-blob-2" aria-hidden="true" />

      <div className="ud-card">
        <div className="ud-orb">
          <span className="ud-orb-ring" aria-hidden="true" />
          <Icon size={38} color="#fbbf24" />
        </div>

        <span className="ud-pill">
          <Clock size={13} /> UNDER DEVELOPMENT
        </span>

        <h1 id="ud-title" className="ud-title">{heading}</h1>

        <p className="ud-text">
          {message ||
            "We're putting the finishing touches on this section. Our team is working hard to bring it to you very soon — please check back later!"}
        </p>

        <div className="ud-progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Development progress">
          <div className="ud-progress-bar" style={{ '--ud-progress': `${progress}%` }} />
        </div>
        <div className="ud-progress-label">
          <span>Building</span>
          <span>{progress}%</span>
        </div>

        <div className="ud-actions">
          <Link id="ud-home-btn" to="/" className="btn-gold ud-btn">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          {secondaryLink && (
            <Link id="ud-secondary-btn" to={secondaryLink.to} className="btn-secondary ud-btn">
              <Sparkles size={16} /> {secondaryLink.label}
            </Link>
          )}
        </div>

        <Link id="ud-contact-link" to="/contact" className="ud-contact">
          <MessageCircle size={14} /> Need it urgently? Contact us
        </Link>
      </div>
    </section>
  );
};

export default UnderDevelopment;
