import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Trash2, ArrowRight, ShieldCheck, Tag,
  Gift, Droplets, Sparkles, AlertCircle, ChevronLeft
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';

const Cart = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    coupon,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDiscount,
    getCartTotal
  } = useProducts();

  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const deliveryCharge = subtotal > 1500 || subtotal === 0 ? 0 : 90;
  const total = getCartTotal();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput) return;
    applyCoupon(couponInput);
    setCouponInput('');
  };

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(245, 158, 11, 0.1)',
          border: '2px solid var(--border-gold)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto',
          color: 'var(--accent-gold)'
        }}>
          <ShoppingCart size={36} />
        </div>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Your Shopping Cart is Empty</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '450px', margin: '0 auto 2rem auto', fontSize: '1rem' }}>
          Explore our bespoke gift gallery, order pure drinking water, or browse industrial kitchen appliances.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/gifts" className="btn-gold">
            <Gift size={16} /> Explore Gift Gallery
          </Link>
          <Link to="/water" className="btn-outline">
            <Droplets size={16} /> Order Drinking Water
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0 6rem 0' }}>
      <div className="container">
        {/* Header */}
        <div className="flex justify-between items-center" style={{ marginBottom: '2.5rem' }}>
          <div>
            <span className="badge-gold" style={{ marginBottom: '0.4rem' }}>Checkout Bag</span>
            <h1 style={{ fontSize: '2.2rem', margin: 0 }}>Review Your Order ({cart.length} Items)</h1>
          </div>
          <button onClick={clearCart} className="btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Trash2 size={14} /> Clear All
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'flex-start' }}>
          {/* Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {cart.map(item => (
              <div
                key={item.cartItemId}
                className="glass-card"
                style={{ padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}
                />

                <div style={{ flex: 1 }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="badge-blue" style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem', marginBottom: '0.35rem' }}>
                        {item.category}
                      </span>
                      <h4 style={{ fontSize: '1.1rem', color: '#fff', margin: 0 }}>{item.name}</h4>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      style={{ background: 'transparent', color: '#94a3b8', padding: '4px' }}
                      title="Remove Item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Personalization Details (if any) */}
                  {item.customization && (
                    <div style={{
                      background: 'rgba(245, 158, 11, 0.08)',
                      border: '1px solid rgba(245, 158, 11, 0.25)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.6rem 0.8rem',
                      fontSize: '0.8rem',
                      marginTop: '0.6rem',
                      color: 'var(--text-muted)'
                    }}>
                      <div style={{ color: 'var(--accent-gold-light)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Sparkles size={12} /> Custom Engraving: "{item.customization.engravingText}"
                      </div>
                      <div style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>
                        Wrap: {item.customization.wrapName} • Ribbon: {item.customization.ribbonName}
                        {item.customization.waxSeal && ' • Royal Wax Seal'}
                      </div>
                    </div>
                  )}

                  {/* Subscription details (if any) */}
                  {item.subscriptionPlan && (
                    <div style={{
                      background: 'rgba(14, 165, 233, 0.08)',
                      border: '1px solid rgba(14, 165, 233, 0.25)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.8rem',
                      marginTop: '0.6rem',
                      color: '#93c5fd'
                    }}>
                      Routine: {item.subscriptionPlan.frequency}
                    </div>
                  )}

                  {/* Price & Quantity Controls */}
                  <div className="flex justify-between items-center" style={{ marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                        style={{ background: 'transparent', color: '#fff', padding: '0.35rem 0.7rem', fontSize: '1rem' }}
                      >
                        -
                      </button>
                      <span style={{ padding: '0 0.6rem', fontWeight: 700, fontSize: '0.9rem' }}>{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                        style={{ background: 'transparent', color: '#fff', padding: '0.35rem 0.7rem', fontSize: '1rem' }}
                      >
                        +
                      </button>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-gold-light)' }}>
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                        ₹{item.price.toLocaleString()} each
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Link to="/gifts" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-gold-light)', fontSize: '0.9rem', fontWeight: 600 }}>
              <ChevronLeft size={16} /> Continue Exploring Other Verticals
            </Link>
          </div>

          {/* Order Summary & Coupon Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Promo Code Card */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Tag size={16} color="var(--accent-gold)" /> Have a Promo Code?
              </h4>

              {coupon ? (
                <div style={{
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <span style={{ fontWeight: 800, color: '#6ee7b7' }}>{coupon.code}</span>
                    <div style={{ fontSize: '0.78rem', color: '#d1fae5' }}>{coupon.description}</div>
                  </div>
                  <button onClick={removeCoupon} style={{ background: 'transparent', color: '#f87171', fontSize: '0.8rem', fontWeight: 600 }}>
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Try PRATHAM10 or SHREE20"
                    className="form-input"
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value)}
                    style={{ textTransform: 'uppercase' }}
                  />
                  <button type="submit" className="btn-secondary btn-sm" style={{ padding: '0 1.25rem', fontWeight: 700 }}>
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                Order Summary
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Bag Subtotal:</span>
                  <span style={{ fontWeight: 600, color: '#fff' }}>₹{subtotal.toLocaleString()}</span>
                </div>

                {coupon && (
                  <div className="flex justify-between" style={{ color: '#6ee7b7' }}>
                    <span>Promo Discount ({coupon.discountPercent}%):</span>
                    <span style={{ fontWeight: 700 }}>-₹{discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Express Blue Dart Shipping:</span>
                  <span style={{ fontWeight: 600, color: deliveryCharge === 0 ? '#6ee7b7' : '#fff' }}>
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Estimated GST (Included):</span>
                  <span style={{ color: 'var(--text-muted)' }}>18% Standard GST</span>
                </div>

                <div style={{ borderTop: '2px solid var(--border-subtle)', paddingTop: '1rem' }} className="flex justify-between items-center">
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Total Amount:</span>
                  <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-gold-light)' }}>
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                className="btn-gold"
                onClick={() => navigate('/checkout')}
                style={{ width: '100%', padding: '1rem', fontSize: '1.05rem' }}
              >
                Proceed to Secure Checkout <ArrowRight size={18} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--text-subtle)', fontSize: '0.8rem', marginTop: '1rem' }}>
                <ShieldCheck size={14} color="#10b981" /> 256-Bit Encrypted Secure Checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
