import { Link } from 'react-router-dom';
import { Settings, ArrowLeft } from 'lucide-react';

const Industrial = () => {
  return (
    <div className="container pt-32 animate-fade-in mb-8 flex justify-center items-center" style={{ minHeight: '60vh' }}>
      <div className="text-center" style={{ maxWidth: '600px' }}>
        <div className="animate-pulse" style={{ 
          display: 'inline-block', 
          padding: '2rem', 
          background: 'rgba(229, 184, 73, 0.1)', 
          borderRadius: '50%', 
          color: 'var(--secondary-color)', 
          marginBottom: '2rem' 
        }}>
          <Settings size={64} className="animate-spin-slow" />
        </div>
        
        <h1 className="font-heading mb-4 text-white" style={{ fontSize: '2.5rem' }}>
          Coming Soon
        </h1>
        
        <p className="text-light mb-8" style={{ fontSize: '1rem', lineHeight: '1.8' }}>
          Our Industrial Tech section is currently under development. 
          We are meticulously curating a selection of heavy-duty, reliable tools designed for excellence.
        </p>
        
        <Link to="/" className="btn btn-secondary">
          <ArrowLeft size={18} /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Industrial;
