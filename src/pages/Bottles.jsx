import { ShoppingBag } from 'lucide-react';
import { useProducts } from '../context/ProductContext';

const Bottles = () => {
  const { products, addToCart } = useProducts();
  const bottleProducts = products.filter(p => p.category === 'bottles');

  return (
    <div className="container pt-32 animate-fade-in mb-8">
      <div className="text-center mb-12">
        <h1 className="font-heading gold-gradient-text mb-4" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>Drinking Water</h1>
        <p className="text-light" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1rem' }}>
          Stay hydrated in style with our collection of high-quality drinking water bottles, designed for durability and elegance.
        </p>
      </div>

      <div className="horizontal-scroll-container">
        {bottleProducts.map(product => (
          <div key={product.id} className="card horizontal-scroll-item">
            <div className="card-img-wrapper">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="card-content">
              <h3 className="card-title">{product.name}</h3>
              <div className="card-price">${product.price.toFixed(2)}</div>
              <button 
                onClick={() => addToCart(product)}
                className="btn btn-primary w-full mt-4" 
                style={{ width: '100%' }}
              >
                <ShoppingBag size={18} /> Add to Order
              </button>
            </div>
          </div>
        ))}
        {bottleProducts.length === 0 && (
          <div className="col-span-full text-center text-light py-8" style={{ gridColumn: '1 / -1' }}>
            No bottles available right now. Please check back later or add some from the admin panel.
          </div>
        )}
      </div>
    </div>
  );
};

export default Bottles;
