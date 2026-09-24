// =========================================================================
// SHREE PRATHAM - RAZORPAY & UPI GATEWAY IN-CODE INTEGRATION
// =========================================================================
// To integrate your official Razorpay credentials directly in code:
// 1. Paste your Razorpay Key ID in KEY_ID below (e.g. 'rzp_live_xxxxxxxxxxxx')
// 2. Paste your Razorpay Merchant UPI ID in MERCHANT_UPI_ID below (e.g. 'yourvpa@razorpay')
// -------------------------------------------------------------------------
export const RAZORPAY_CONFIG = {
  // 1. YOUR RAZORPAY API KEY ID:
  // Integrated directly in code for secure merchant-side processing.
  KEY_ID: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_YOUR_RAZORPAY_KEY_HERE',

  // 2. RAZORPAY UPI ID / VPA TO RECEIVE PAYMENTS:
  // This is the official UPI ID provided by Razorpay through which you receive payments
  MERCHANT_UPI_ID: import.meta.env.VITE_RAZORPAY_UPI_ID || 'shreepratham@razorpay',

  // 3. REGISTERED BUSINESS / MERCHANT NAME:
  MERCHANT_NAME: 'Shree Pratham Conglomerate'
};

/**
 * Retrieves the integrated Razorpay Key ID from code / environment
 */
export const getRazorpayKey = () => {
  return RAZORPAY_CONFIG.KEY_ID;
};

/**
 * Retrieves the Razorpay Merchant UPI ID through which payments are received
 */
export const getMerchantUpiId = () => {
  return RAZORPAY_CONFIG.MERCHANT_UPI_ID;
};

/**
 * Generates an official, standard NPCI UPI Payment URI for direct app launch or QR code scanning.
 * Standard format: upi://pay?pa={vpa}&pn={name}&am={amount}&cu=INR&tn={note}&tr={ref}
 */
export const generateUpiUri = ({
  upiId = RAZORPAY_CONFIG.MERCHANT_UPI_ID,
  payeeName = RAZORPAY_CONFIG.MERCHANT_NAME,
  amount,
  orderRef,
  note = 'Shree Pratham Order Payment'
}) => {
  const formattedAmount = Number(amount || 0).toFixed(2);
  const encodedName = encodeURIComponent(payeeName);
  const encodedNote = encodeURIComponent(note);
  const ref = orderRef || ('SP-' + Date.now().toString().slice(-6));
  return `upi://pay?pa=${upiId}&pn=${encodedName}&am=${formattedAmount}&cu=INR&tn=${encodedNote}&tr=${ref}`;
};

/**
 * Dynamically loads the official Razorpay Checkout SDK if not already loaded.
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn('Failed to load Razorpay SDK from CDN.');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

/**
 * Initiates Razorpay Standard Checkout using the integrated API key in code
 */
export const initiateRazorpayCheckout = async ({
  amount,
  orderDetails,
  preferredMethod = 'upi',
  onSuccess,
  onDismiss,
  onError
}) => {
  const isLoaded = await loadRazorpayScript();
  const key = getRazorpayKey();

  if (!isLoaded || !window.Razorpay) {
    if (onError) {
      onError('Razorpay SDK could not be loaded. Check your internet connection.');
    }
    return;
  }

  try {
    const options = {
      key: key,
      amount: Math.round(amount * 100), // in paise (1 INR = 100 paise)
      currency: 'INR',
      name: RAZORPAY_CONFIG.MERCHANT_NAME,
      description: `Payment for Order (${orderDetails.items?.length || 1} items)`,
      image: window.location.origin + '/logo.png',
      prefill: {
        name: orderDetails.customer?.name || 'Customer',
        email: orderDetails.customer?.email || 'customer@example.com',
        contact: orderDetails.customer?.phone || '+91 98201 23456',
        method: preferredMethod || 'upi'
      },
      notes: {
        address: orderDetails.customer?.address || 'Pan-India Delivery',
        slot: orderDetails.deliverySlot || 'Standard Delivery',
        merchant_upi: RAZORPAY_CONFIG.MERCHANT_UPI_ID,
        merchant_email: 'sales@shreepratham.com'
      },
      theme: {
        color: '#f59e0b' // Shree Pratham luxury gold brand color
      },
      modal: {
        ondismiss: function () {
          if (onDismiss) onDismiss();
        }
      },
      handler: function (response) {
        if (onSuccess) {
          onSuccess(response);
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      console.error('Razorpay payment failed:', response.error);
      if (onError) {
        onError(response.error.description || 'Payment failed on Razorpay.');
      }
    });

    rzp.open();
  } catch (err) {
    console.error('Error opening Razorpay modal:', err);
    if (onError) {
      onError(err.message || 'Error initializing Razorpay.');
    }
  }
};
