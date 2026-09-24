import { Link } from 'react-router-dom';
import { servicesList } from '../data/services';

const Services = () => {
  return (
    <div className="services-page animate-fade-in" style={{ paddingTop: '100px', minHeight: '100vh', color: 'var(--text-color)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }} className="animate-fade-up">
          <h1 className="font-heading gold-gradient-text" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1rem' }}>Our Services</h1>
          <p style={{ color: 'var(--text-light)', maxWidth: '600px', margin: '0 auto', fontSize: '1rem' }}>
            Elevate your brand with our comprehensive suite of digital services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ paddingBottom: '4rem' }}>
          {servicesList.map((service, index) => (
            <Link 
              key={index} 
              to={`/services/${service.id}`}
              className="glass-card hover-scale service-card-bg animate-fade-up flex flex-col group"
              style={{ animationDelay: `${index * 150}ms`, color: 'inherit', textDecoration: 'none' }}
            >
              <div className="card-img-wrapper" style={{ flexShrink: 0 }}>
                <img src={service.image} alt={service.title} style={{ height: '200px' }} />
              </div>
              <div className="card-content" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ color: 'var(--secondary-color)', padding: '0.75rem', background: 'rgba(229, 184, 73, 0.1)', borderRadius: '50%' }}>
                    {service.icon}
                  </div>
                  <h3 className="font-heading group-hover:text-gold-400 transition-colors" style={{ fontSize: '1.5rem' }}>{service.title}</h3>
                </div>
                <p style={{ color: 'var(--text-light)', lineHeight: 1.6 }}>{service.description}</p>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Call to action section */}
        <div className="glass-card p-10 text-center animate-fade-up" style={{ animationDelay: '600ms', marginBottom: '4rem', padding: '3rem' }}>
          <h2 className="font-heading" style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--secondary-color)' }}>Ready to start your project?</h2>
          <p style={{ color: 'var(--text-light)', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem', fontSize: '1rem' }}>
            Let's collaborate to bring your vision to life. Our team of experts is ready to help you achieve your digital goals.
          </p>
          <a href="/contact" className="btn btn-primary">
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  );
};

export default Services;
