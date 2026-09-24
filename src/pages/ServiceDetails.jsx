import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { servicesList } from '../data/services';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const service = servicesList.find(s => s.id === id);

  if (!service) {
    return (
      <div className="container pt-32 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="mb-4 text-3xl font-light">Service Not Found</h1>
        <Link to="/services" className="btn btn-secondary">
          <ArrowLeft size={18} /> Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ paddingTop: '80px', color: 'var(--text-color)' }}>
      {/* Hero Section */}
      <div 
        style={{ 
          position: 'relative', 
          height: '60vh', 
          minHeight: '400px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          overflow: 'hidden' 
        }}
      >
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${service.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.4)'
        }} />
        
        <div className="container relative z-10 text-center animate-fade-up">
          <div style={{ display: 'inline-block', marginBottom: '1.5rem', color: 'var(--secondary-color)', padding: '1rem', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', border: '1px solid var(--secondary-color)' }}>
            {service.icon}
          </div>
          <h1 style={{ fontSize: '4rem', fontWeight: 300, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem', textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
            {service.title}
          </h1>
        </div>
      </div>

      {/* Details Section */}
      <div className="container py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-8 animate-fade-up" style={{ animationDelay: '200ms' }}>
            <button 
              onClick={() => navigate('/services')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary-color)', background: 'transparent', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2rem', fontSize: '0.875rem' }}
            >
              <ArrowLeft size={16} /> Back to Services
            </button>
            
            <h2 style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: '2rem', color: 'var(--secondary-color)' }}>Overview</h2>
            <p style={{ fontSize: '1.25rem', lineHeight: 1.8, color: 'var(--text-light)', marginBottom: '2rem' }}>
              {service.description}
            </p>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-light)' }}>
              {service.details}
            </p>
          </div>
          
          {/* CTA Sidebar */}
          <div className="md:col-span-4 animate-fade-up" style={{ animationDelay: '400ms' }}>
            <div className="glass p-8 rounded-xl" style={{ border: '1px solid rgba(212, 175, 55, 0.2)', position: 'sticky', top: '100px' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 400, letterSpacing: '0.05em' }}>Interested in this service?</h3>
              <p style={{ color: 'var(--text-light)', marginBottom: '2rem', lineHeight: 1.6 }}>
                Let's discuss how we can tailor our {service.title} expertise to your specific needs.
              </p>
              <Link to="/contact" className="btn btn-primary w-full text-center" style={{ width: '100%' }}>
                Get a Quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
