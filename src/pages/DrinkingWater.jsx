import { useState } from 'react';
import {
  Droplets, CheckCircle2, MapPin, Calendar, Clock,
  ShieldCheck, ArrowRight, Zap, RefreshCw, Truck, AlertCircle
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { serviceAreaList } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const FREQUENCY_OPTIONS = [
  { id: 'daily', name: 'Daily Morning Route', dropsPerMonth: 30, discount: 15, tag: 'Most Popular for Homes' },
  { id: 'alternate', name: 'Alternate Days (Mon, Wed, Fri)', dropsPerMonth: 13, discount: 10, tag: 'Ideal for Offices' },
  { id: 'biweekly', name: 'Twice a Week (Tue & Fri)', dropsPerMonth: 8, discount: 5, tag: 'Small Families' },
  { id: 'weekly', name: 'Once a Week (Weekend)', dropsPerMonth: 4, discount: 0, tag: 'Flexible' }
];

const TIME_SLOTS = [
  'Early Morning (06:00 AM - 08:30 AM)',
  'Mid-Day Slot (11:30 AM - 01:30 PM)',
  'Evening Drop (05:00 PM - 07:30 PM)'
];

const DrinkingWater = () => {
  const { waterProducts, addToCart, createSubscription } = useProducts();
  const { user } = useAuth();

  // Tab filter for products
  const [selectedType, setSelectedType] = useState('All');

  // Service Area Checker state
  const [pincodeQuery, setPincodeQuery] = useState('');
  const [pincodeResult, setPincodeResult] = useState(null);

  // Subscription Builder state
  const [subFreq, setSubFreq] = useState(FREQUENCY_OPTIONS[0]);
  const [jarsPerDrop, setJarsPerDrop] = useState(2);
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[0]);
  const [deliveryAddress, setDeliveryAddress] = useState(
    user?.address ? `${user.address.line1}, ${user.address.city} ${user.address.pincode}` : 'Flat 402, Sea Green Heights, Bandra West, Mumbai 400050'
  );

  const basePricePerJar = 90;
  const totalJarsPerMonth = subFreq.dropsPerMonth * jarsPerDrop;
  const rawMonthlyTotal = totalJarsPerMonth * basePricePerJar;
  const discountAmount = Math.round((rawMonthlyTotal * subFreq.discount) / 100);
  const effectiveMonthlyTotal = rawMonthlyTotal - discountAmount;
  const perJarEffective = Math.round(effectiveMonthlyTotal / totalJarsPerMonth);

  const handleCheckPincode = (e) => {
    e.preventDefault();
    const cleanPin = pincodeQuery.trim();
    if (!cleanPin) return;

    const matched = serviceAreaList.find(s => s.pincode === cleanPin || s.area.toLowerCase().includes(cleanPin.toLowerCase()));

    if (matched) {
      setPincodeResult({
        serviceable: true,
        area: matched.area,
        pincode: matched.pincode,
        deliveryTime: matched.deliveryTime
      });
    } else {
      setPincodeResult({
        serviceable: true,
        area: `${cleanPin} Metropolitan Zone`,
        pincode: cleanPin,
        deliveryTime: 'Express Next-Day Route Available'
      });
    }
  };

  const handleCreateSubscription = () => {
    createSubscription({
      planName: `20L Alkaline Jars (${subFreq.name})`,
      frequency: `${subFreq.name} • ${jarsPerDrop} Jar(s) per delivery`,
      jarCount: totalJarsPerMonth,
      ratePerJar: perJarEffective,
      monthlyTotal: effectiveMonthlyTotal,
      preferredSlot: selectedSlot,
      address: deliveryAddress
    });
  };

  const filteredProducts = waterProducts.filter(item => {
    if (selectedType === 'All') return true;
    return item.type.toLowerCase() === selectedType.toLowerCase();
  });

  return (
    <div style={{ paddingBottom: '5rem' }}>
      {/* 1. Header / Hero */}
      <section style={{
        padding: '3.5rem 0 3rem 0',
        background: 'radial-gradient(ellipse at 50% 10%, rgba(14, 165, 233, 0.15) 0%, rgba(8, 12, 20, 1) 80%)',
        borderBottom: '1px solid var(--border-subtle)',
        textAlign: 'center'
      }}>
        <div className="container">
          <span className="badge-blue" style={{ marginBottom: '0.75rem' }}>
            <Droplets size={14} /> Shree Pratham Drinking Water Division
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', marginBottom: '0.75rem' }}>
            Pure Alkaline & Micro-Filtered Mineral Water
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '720px', margin: '0 auto 2rem auto', fontSize: '1.05rem' }}>
            Sourced, 10-stage purified with added essential minerals (pH 8.2), and sealed in 100% BPA-free food-grade containers. Delivered fresh to corporate towers and residential apartments every morning.
          </p>

          {/* Quick Metrics */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1.5rem',
            fontSize: '0.88rem',
            color: 'var(--text-main)'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} color="#38bdf8" /> 100% BPA-Free Food Grade Jars
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} color="#38bdf8" /> Enriched with Copper & Magnesium
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} color="#38bdf8" /> Zero Contact Touchless Bottling
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} color="#38bdf8" /> Free Doorstep Delivery Above ₹150
            </span>
          </div>
        </div>
      </section>

      {/* 2. Interactive Service Area Checker */}
      <section style={{ padding: '2.5rem 0' }}>
        <div className="container">
          <div className="glass-card" style={{
            padding: '2rem',
            background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1px solid rgba(14, 165, 233, 0.3)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                  <MapPin size={18} /> SERVICE AREA & ROUTE CHECKER
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Check Daily Delivery in Your Pincode</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  We operate active daily delivery vans across South Mumbai, Western Suburbs, Navi Mumbai, Pune, Delhi NCR, Bangalore, and Hyderabad.
                </p>
              </div>

              <div>
                <form onSubmit={handleCheckPincode} style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.75rem' }}>
                  <input
                    type="text"
                    required
                    placeholder="Enter 6-digit Pincode (e.g. 400050 or 110001)"
                    className="form-input"
                    value={pincodeQuery}
                    onChange={e => setPincodeQuery(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button type="submit" className="btn-gold" style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', color: '#fff' }}>
                    Check Slot
                  </button>
                </form>

                {pincodeResult && (
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    fontSize: '0.88rem',
                    color: '#6ee7b7'
                  }}>
                    <CheckCircle2 size={18} color="#10b981" />
                    <div>
                      <strong>Serviceable: {pincodeResult.area} ({pincodeResult.pincode})</strong>
                      <div style={{ fontSize: '0.78rem', color: '#d1fae5' }}>
                        Route Status: {pincodeResult.deliveryTime}. Order now to lock your morning slot.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Subscription Plans (Weekly / Monthly Delivery) */}
      <section style={{ padding: '3rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="badge-blue" style={{ marginBottom: '0.4rem' }}>Never Run Out of Water</span>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Custom Water Subscription Scheduler</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto' }}>
              Set your preferred delivery days and jar count. Pause, skip, or cancel anytime from your Customer Dashboard with zero penalty.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {/* Step 1 & 2: Frequency & Slot Builder */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={20} color="#38bdf8" /> 1. Select Delivery Routine
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
                {FREQUENCY_OPTIONS.map(opt => (
                  <div
                    key={opt.id}
                    onClick={() => setSubFreq(opt)}
                    style={{
                      border: subFreq.id === opt.id ? '2px solid #0ea5e9' : '1px solid var(--border-subtle)',
                      background: subFreq.id === opt.id ? 'rgba(14, 165, 233, 0.12)' : 'rgba(15, 23, 42, 0.6)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'var(--transition)'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{opt.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {opt.dropsPerMonth} deliveries/month • {opt.tag}
                      </div>
                    </div>
                    {opt.discount > 0 ? (
                      <span className="badge-green">Save {opt.discount}%</span>
                    ) : (
                      <span className="badge-blue">Standard</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Jar count per drop */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Jars Per Delivery Drop:</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  {[1, 2, 3, 5].map(qty => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setJarsPerDrop(qty)}
                      style={{
                        padding: '0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 700,
                        background: jarsPerDrop === qty ? '#0ea5e9' : 'rgba(255, 255, 255, 0.05)',
                        color: jarsPerDrop === qty ? '#fff' : 'var(--text-muted)',
                        border: jarsPerDrop === qty ? '1px solid #38bdf8' : '1px solid var(--border-subtle)'
                      }}
                    >
                      {qty} Jar{qty > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time slot preference */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Preferred Morning / Evening Window:</label>
                <select
                  className="form-select"
                  value={selectedSlot}
                  onChange={e => setSelectedSlot(e.target.value)}
                >
                  {TIME_SLOTS.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="form-label">Delivery Drop Location:</label>
                <input
                  type="text"
                  className="form-input"
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                />
              </div>
            </div>

            {/* Step 3: Calculation & Activation Card */}
            <div className="glass-card" style={{
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(8, 12, 20, 0.98) 100%)',
              border: '1px solid rgba(14, 165, 233, 0.4)'
            }}>
              <div>
                <div className="badge-blue" style={{ marginBottom: '0.75rem' }}>
                  Subscription Summary
                </div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>20L Alkaline Jars Routine</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  <div className="flex justify-between" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Frequency:</span>
                    <strong style={{ color: '#fff' }}>{subFreq.name}</strong>
                  </div>
                  <div className="flex justify-between" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Total Monthly Jars:</span>
                    <strong style={{ color: '#fff' }}>{totalJarsPerMonth} Jars ({jarsPerDrop} jar/drop)</strong>
                  </div>
                  <div className="flex justify-between" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Standard Rate:</span>
                    <span style={{ textDecoration: 'line-through', color: 'var(--text-subtle)' }}>₹{rawMonthlyTotal}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: '#6ee7b7' }}>Subscription Discount:</span>
                      <strong style={{ color: '#6ee7b7' }}>-₹{discountAmount} ({subFreq.discount}%)</strong>
                    </div>
                  )}
                  <div className="flex justify-between" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Doorstep Delivery:</span>
                    <strong style={{ color: '#6ee7b7' }}>FREE</strong>
                  </div>
                </div>

                <div style={{
                  background: 'rgba(14, 165, 233, 0.08)',
                  border: '1px solid rgba(14, 165, 233, 0.3)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Effective Monthly Investment:</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8' }}>
                    ₹{effectiveMonthlyTotal.toLocaleString()}
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', fontWeight: 500, marginLeft: '0.4rem' }}>
                      (approx. ₹{perJarEffective} / jar)
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#6ee7b7', marginTop: '0.25rem' }}>
                    ✓ 100% Refundable deposit for bubble top jars
                  </div>
                </div>
              </div>

              <div>
                <button
                  className="btn-gold"
                  style={{ width: '100%', background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', color: '#fff', padding: '0.9rem' }}
                  onClick={handleCreateSubscription}
                >
                  <Droplets size={18} /> Activate Water Subscription
                </button>
                <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.6rem' }}>
                  No long-term lock-in • Pause or cancel via Account dashboard anytime
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Product Types Catalog (Bottled, Jar, RO Purified) */}
      <section style={{ padding: '3.5rem 0', background: 'rgba(15, 23, 42, 0.4)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div className="flex justify-between items-center" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge-blue" style={{ marginBottom: '0.3rem' }}>Complete Range</span>
              <h2 style={{ fontSize: '2rem', margin: 0 }}>Drinking Water Products</h2>
            </div>

            {/* Type Filter Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['All', 'Jar', 'Bottled', 'RO Purified'].map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  style={{
                    padding: '0.5rem 1.1rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    background: selectedType === type ? '#0ea5e9' : 'rgba(255, 255, 255, 0.05)',
                    color: selectedType === type ? '#fff' : 'var(--text-muted)',
                    border: selectedType === type ? '1px solid #38bdf8' : '1px solid var(--border-subtle)'
                  }}
                >
                  {type === 'All' ? 'All Products' : type}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem' }}>
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="glass-card-interactive"
                style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
              >
                <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span className="badge-blue" style={{ position: 'absolute', top: '12px', left: '12px' }}>
                    {product.type}
                  </span>
                </div>

                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem', color: '#fff' }}>{product.name}</h3>

                  <div style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 600, marginBottom: '0.6rem' }}>
                    {product.purity}
                  </div>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, flex: 1, marginBottom: '1.25rem' }}>
                    {product.description}
                  </p>

                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                    <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
                      <div>
                        <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }}>
                          ₹{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                          <span style={{ textDecoration: 'line-through', color: 'var(--text-subtle)', fontSize: '0.85rem', marginLeft: '0.4rem' }}>
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.78rem', color: '#6ee7b7' }}>Available for Order</span>
                    </div>

                    <button
                      className="btn-gold"
                      style={{ width: '100%', background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', color: '#fff' }}
                      onClick={() => addToCart(product, 1)}
                    >
                      <Droplets size={16} /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DrinkingWater;
