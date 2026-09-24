import { useState } from 'react';
import { MessageSquare, X, Send, Sparkles, CheckCheck } from 'lucide-react';

const QUICK_PROMPTS = [
  { label: '💧 Order Drinking Water', text: 'Hello Shree Pratham, I would like to order drinking water jars / discuss subscription plans.' },
  { label: '🎁 Gifting Hampers Catalog', text: 'Hello Shree Pratham, I am interested in your luxury corporate/wedding gifting hampers.' },
  { label: '🍳 Kitchen Appliances Quote', text: 'Hello Shree Pratham, I would like to request a bulk quote for commercial kitchen equipment.' },
  { label: '📈 Digital Marketing / Ads', text: 'Hello Shree Pratham, I want to inquire about your SEO & performance marketing packages.' },
  { label: '💻 IT & Cloud Solutions', text: 'Hello Shree Pratham, I need custom web/app development and cloud IT support.' },
  { label: '📞 Speak to an Executive', text: 'Hello Shree Pratham, please connect me with a corporate business representative.' }
];

const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState(
    'Hello Shree Pratham, I am visiting your website and would like more details about your services.'
  );

  const phoneNumber = '919876543210'; // Official Shree Pratham WhatsApp business number

  const handleSend = (textToSend = message) => {
    const encoded = encodeURIComponent(textToSend || 'Hello Shree Pratham');
    const url = `https://wa.me/${phoneNumber}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSelectPrompt = (promptText) => {
    setMessage(promptText);
    handleSend(promptText);
  };

  return (
    <>
      {/* Floating Popover Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '24px',
            width: '360px',
            maxWidth: 'calc(100vw - 32px)',
            background: '#0d1321',
            borderRadius: '1.25rem',
            border: '1px solid rgba(37, 211, 102, 0.4)',
            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.75), 0 0 25px rgba(37, 211, 102, 0.2)',
            zIndex: 996,
            overflow: 'hidden',
            animation: 'slideUp 0.25s ease-out'
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #075E54 0%, #128C7E 100%)',
              color: '#ffffff',
              padding: '1.1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  border: '2px solid rgba(255, 255, 255, 0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '3px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
                  overflow: 'hidden',
                  flexShrink: 0
                }}
              >
                <img
                  src="/logo.png"
                  alt="Shree Pratham"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>

              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  Shree Pratham Desk <Sparkles size={13} color="#fcd34d" />
                </div>
                <div style={{ fontSize: '0.75rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#25D366' }} />
                  Online • Typically replies in 5 mins
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(0, 0, 0, 0.2)',
                border: 'none',
                color: '#fff',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Close chat preview"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: '1.2rem', maxHeight: '380px', overflowY: 'auto' }}>
            <div
              style={{
                background: 'rgba(18, 140, 126, 0.12)',
                border: '1px solid rgba(37, 211, 102, 0.25)',
                borderRadius: '0.75rem',
                padding: '0.85rem 1rem',
                fontSize: '0.85rem',
                color: '#e2e8f0',
                marginBottom: '1rem',
                position: 'relative'
              }}
            >
              <div style={{ fontWeight: 600, color: '#4ade80', marginBottom: '0.25rem' }}>
                Namaste! Welcome to Shree Pratham
              </div>
              How can we assist you today? Select a vertical below or type your custom requirement to start chatting directly on WhatsApp.
              <div style={{ textAlign: 'right', marginTop: '0.3rem', fontSize: '0.7rem', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.2rem' }}>
                Official Business Support <CheckCheck size={13} color="#4ade80" />
              </div>
            </div>

            {/* Quick Topic Chips */}
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Quick Selection:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
              {QUICK_PROMPTS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectPrompt(q.text)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '0.5rem',
                    padding: '0.55rem 0.75rem',
                    textAlign: 'left',
                    color: '#f1f5f9',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(37, 211, 102, 0.15)';
                    e.currentTarget.style.borderColor = '#25D366';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  }}
                >
                  <span>{q.label}</span>
                  <span style={{ fontSize: '0.75rem', color: '#4ade80' }}>→</span>
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div style={{ position: 'relative' }}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                placeholder="Type your message..."
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '0.65rem',
                  padding: '0.65rem 0.85rem',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  resize: 'none',
                  outline: 'none',
                  marginBottom: '0.75rem'
                }}
              />
              <button
                onClick={() => handleSend(message)}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  padding: '0.75rem',
                  borderRadius: '0.65rem',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(37, 211, 102, 0.35)',
                  transition: 'var(--transition)'
                }}
              >
                <Send size={16} /> Open WhatsApp Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 995,
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem'
        }}
      >
        {/* Tooltip Pill */}
        {!isOpen && (
          <div
            onClick={() => setIsOpen(true)}
            style={{
              background: '#0d1321',
              color: '#ffffff',
              border: '1px solid rgba(37, 211, 102, 0.4)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
              padding: '0.45rem 0.85rem',
              borderRadius: '2rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'none',
              alignItems: 'center',
              gap: '0.4rem',
              whiteSpace: 'nowrap',
              animation: 'fadeIn 0.3s ease'
            }}
            className="whatsapp-pill"
          >
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#25D366', display: 'inline-block' }} />
            Chat with us on WhatsApp
          </div>
        )}

        {/* Circular Action Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Chat on WhatsApp with Shree Pratham"
          style={{
            width: '58px',
            height: '58px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
            border: '2px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 8px 25px rgba(37, 211, 102, 0.45), 0 4px 10px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative',
            transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08) translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(37, 211, 102, 0.6), 0 6px 15px rgba(0, 0, 0, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1) translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(37, 211, 102, 0.45), 0 4px 10px rgba(0, 0, 0, 0.5)';
          }}
          title="Chat with Shree Pratham on WhatsApp"
        >
          {/* Animated Pulse Ring */}
          <span
            style={{
              position: 'absolute',
              inset: '-5px',
              borderRadius: '50%',
              border: '2px solid #25D366',
              animation: 'whatsappPulse 2.2s infinite',
              pointerEvents: 'none'
            }}
          />

          {/* Official WhatsApp SVG Icon */}
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="#ffffff"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.477-.15-.678.15-.201.3-.777.978-.953 1.178-.175.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.895-.798-1.5-1.783-1.676-2.084-.175-.3-.019-.462.132-.612.136-.135.301-.35.452-.526.15-.175.201-.3.301-.5.1-.2.05-.376-.025-.526-.075-.15-.678-1.634-.928-2.239-.244-.59-.492-.51-.678-.52l-.577-.01c-.201 0-.527.075-.803.376s-1.053 1.028-1.053 2.508 1.078 2.909 1.229 3.11c.15.2 2.122 3.24 5.141 4.544.718.31 1.279.495 1.716.634.721.229 1.377.197 1.896.12.578-.087 1.78-.727 2.031-1.429.251-.702.251-1.304.175-1.429-.075-.125-.276-.2-.577-.35z" />
            <path d="M12.004 2C6.484 2 2 6.484 2 12.004c0 1.947.561 3.764 1.527 5.309L2.105 21.89a.6.6 0 0 0 .75.75l4.577-1.422a9.96 9.96 0 0 0 4.572 1.111h.004c5.52 0 10.004-4.484 10.004-10.004A10.005 10.005 0 0 0 12.004 2zm0 18.257h-.003a8.214 8.214 0 0 1-4.184-1.144l-.3-.178-3.085.958.958-3.085-.178-.3A8.216 8.216 0 0 1 3.75 12.004C3.75 7.452 7.452 3.75 12.004 3.75c2.203 0 4.275.859 5.834 2.417a8.204 8.204 0 0 1 2.416 5.837c0 4.552-3.702 8.253-8.25 8.253z" />
          </svg>
        </button>
      </div>

      {/* Global CSS for pulsing animation & responsive pill */}
      <style>{`
        @keyframes whatsappPulse {
          0% {
            transform: scale(0.95);
            opacity: 0.9;
          }
          70% {
            transform: scale(1.35);
            opacity: 0;
          }
          100% {
            transform: scale(1.35);
            opacity: 0;
          }
        }
        @media (min-width: 640px) {
          .whatsapp-pill {
            display: inline-flex !important;
          }
        }
      `}</style>
    </>
  );
};

export default WhatsAppButton;
