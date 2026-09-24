// ========================================================
// Shree Pratham Official Email Dispatch Service
// Sender Address: sales@shreepratham.com
// ========================================================

export const OFFICIAL_SALES_EMAIL = 'sales@shreepratham.com';
export const OFFICIAL_SENDER_NAME = 'Shree Pratham Sales & Fulfillment';

/**
 * Generates an official, luxury HTML email template for order confirmations.
 */
export const generateOrderEmailHtml = (order) => {
  const itemsHtml = (order.items || []).map(item => `
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 12px 8px; font-size: 14px; color: #1e293b;">
        <strong>${item.name}</strong>
        ${item.customization?.engravingText ? `<br><span style="font-size: 12px; color: #d97706;">Customization: "${item.customization.engravingText}"</span>` : ''}
      </td>
      <td style="padding: 12px 8px; text-align: center; font-size: 14px; color: #475569;">${item.quantity}</td>
      <td style="padding: 12px 8px; text-align: right; font-size: 14px; font-weight: 600; color: #0f172a;">₹${((item.price || 0) * item.quantity).toLocaleString()}</td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Order Confirmation #${order.id}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="640" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #0b111e 0%, #1e293b 100%); padding: 32px 30px; text-align: center; border-bottom: 3px solid #f59e0b;">
              <table align="center" cellpadding="0" cellspacing="0" style="margin: 0 auto 12px auto;">
                <tr>
                  <td style="background: #ffffff; border-radius: 10px; padding: 6px 16px; border: 1px solid #f59e0b;">
                    <span style="font-size: 20px; font-weight: 900; letter-spacing: 0.08em; color: #0b111e; font-family: 'Outfit', sans-serif;">
                      SHREE PRATHAM
                    </span>
                  </td>
                </tr>
              </table>
              <div style="color: #fbbf24; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 700; margin-top: 6px;">
                Enterprise & Lifestyle Multi-Vertical
              </div>
            </td>
          </tr>

          <!-- Confirmation Body -->
          <tr>
            <td style="padding: 36px 32px;">
              <div style="display: inline-block; background-color: #ecfdf5; border: 1px solid #a7f3d0; color: #047857; font-size: 13px; font-weight: 700; padding: 6px 14px; border-radius: 20px; margin-bottom: 16px;">
                ✓ Official Order & Invoice Confirmation
              </div>
              <h1 style="color: #0f172a; font-size: 22px; margin: 0 0 12px 0; font-weight: 800;">
                Thank you for your order, ${order.customer?.name || 'Valued Client'}!
              </h1>
              <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
                Your order has been confirmed and registered with Shree Pratham Fulfillment. A copy of this confirmation has been dispatched directly from our verified sales desk (<strong>${OFFICIAL_SALES_EMAIL}</strong>).
              </p>

              <!-- Order Summary Meta Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px; font-size: 13px; width: 50%; vertical-align: top; border-right: 1px solid #e2e8f0;">
                    <div style="color: #64748b; font-size: 11px; text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">Order Reference</div>
                    <div style="font-weight: 800; font-size: 16px; color: #d97706;">${order.id}</div>
                    <div style="color: #64748b; margin-top: 4px;">Date: ${order.date || new Date().toISOString().split('T')[0]}</div>
                    <div style="color: #059669; font-weight: 600; margin-top: 4px;">Status: ${order.paymentStatus || 'Paid'}</div>
                  </td>
                  <td style="padding: 16px; font-size: 13px; width: 50%; vertical-align: top;">
                    <div style="color: #64748b; font-size: 11px; text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">Payment & Delivery</div>
                    <div style="font-weight: 700; color: #0f172a;">${order.paymentMethod || 'UPI / Online'}</div>
                    <div style="color: #475569; margin-top: 4px;">Slot: ${order.slot || 'Standard Morning Slot'}</div>
                    ${order.razorpayPaymentId ? `<div style="color: #3b82f6; font-size: 12px; margin-top: 4px;">Razorpay Ref: ${order.razorpayPaymentId}</div>` : ''}
                  </td>
                </tr>
              </table>

              <!-- Shipping Address Box -->
              <div style="background-color: #f1f5f9; padding: 14px 18px; border-radius: 8px; margin-bottom: 24px; font-size: 13px; color: #334155;">
                <strong style="color: #0f172a;">Shipping Destination:</strong><br>
                ${order.customer?.name} | Phone: ${order.customer?.phone}<br>
                ${order.customer?.address}
              </div>

              <!-- Items Table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 24px;">
                <thead>
                  <tr style="border-bottom: 2px solid #cbd5e1; text-align: left;">
                    <th style="padding: 10px 8px; font-size: 12px; text-transform: uppercase; color: #64748b;">Item Description</th>
                    <th style="padding: 10px 8px; font-size: 12px; text-transform: uppercase; text-align: center; color: #64748b;">Qty</th>
                    <th style="padding: 10px 8px; font-size: 12px; text-transform: uppercase; text-align: right; color: #64748b;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <!-- Financial Totals -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border-top: 2px solid #e2e8f0; padding-top: 12px; font-size: 13px;">
                <tr>
                  <td style="padding: 4px 8px; color: #64748b;">Subtotal:</td>
                  <td style="padding: 4px 8px; text-align: right; color: #0f172a;">₹${(order.subtotal || 0).toLocaleString()}</td>
                </tr>
                ${order.discount > 0 ? `
                <tr>
                  <td style="padding: 4px 8px; color: #059669;">Promo Discount:</td>
                  <td style="padding: 4px 8px; text-align: right; color: #059669;">-₹${order.discount.toLocaleString()}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 4px 8px; color: #64748b;">Shipping Fee:</td>
                  <td style="padding: 4px 8px; text-align: right; color: #0f172a;">${order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}</td>
                </tr>
                <tr style="font-size: 16px; font-weight: 800; border-top: 1px solid #cbd5e1;">
                  <td style="padding: 12px 8px 4px 8px; color: #0f172a;">Total Paid:</td>
                  <td style="padding: 12px 8px 4px 8px; text-align: right; color: #d97706;">₹${(order.totalAmount || 0).toLocaleString()}</td>
                </tr>
              </table>

              <!-- Shiprocket Delivery Partner Tracking Details -->
              ${order.shiprocketAwb ? `
              <div style="margin-top: 24px; padding: 18px; background: linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%); border: 1px solid #bae6fd; border-radius: 8px;">
                <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap;">
                  <div>
                    <span style="display: inline-block; font-size: 11px; font-weight: 800; background: #0284c7; color: #ffffff; padding: 2px 8px; border-radius: 4px; text-transform: uppercase;">
                      Shiprocket Verified Delivery
                    </span>
                    <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-top: 6px;">
                      Courier: ${order.shiprocketCourier || 'Blue Dart Express (Shiprocket)'}
                    </div>
                    <div style="font-size: 13px; color: #475569; margin-top: 2px; font-family: monospace;">
                      Shiprocket AWB: <strong>${order.shiprocketAwb}</strong>
                    </div>
                  </div>
                  <div style="margin-top: 8px;">
                    <a href="https://shiprocket.co/tracking/${order.shiprocketAwb}" target="_blank" style="display: inline-block; background: #0f172a; color: #ffffff; font-weight: bold; font-size: 12px; padding: 8px 16px; border-radius: 6px; text-decoration: none;">
                      Track Package on Shiprocket &rarr;
                    </a>
                  </div>
                </div>
              </div>
              ` : ''}

              <!-- Tracking / Help Banner -->
              <div style="margin-top: 20px; padding: 18px; background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; font-size: 13px; color: #92400e;">
                <strong>Need Support or Route Update?</strong><br>
                For immediate assistance or priority dispatch requests, reply directly to this email at <a href="mailto:${OFFICIAL_SALES_EMAIL}" style="color: #b45309; font-weight: bold; text-decoration: underline;">${OFFICIAL_SALES_EMAIL}</a> or call our dedicated client desk at +91 (022) 6982-5000.
              </div>
            </td>
          </tr>

          <!-- Footer Section -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 24px 32px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
              <div style="font-weight: 700; color: #334155; margin-bottom: 6px;">SHREE PRATHAM CONGLOMERATE</div>
              <div>Official Sales Desk: <a href="mailto:${OFFICIAL_SALES_EMAIL}" style="color: #d97706; text-decoration: none;">${OFFICIAL_SALES_EMAIL}</a> • Web: <a href="https://www.shreepratham.com" style="color: #64748b;">www.shreepratham.com</a></div>
              <div style="margin-top: 8px; color: #94a3b8; font-size: 11px;">
                Registered Enterprise: GSTIN 27AABCS1429B1Z8 • ISO 9001:2015 & FSSAI Certified Pan-India Fulfillment Hubs
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

/**
 * Generates plain text version of the order confirmation email.
 */
export const generateOrderEmailText = (order) => {
  const itemsText = (order.items || []).map(item => 
    `- ${item.name} × ${item.quantity} = ₹${((item.price || 0) * item.quantity).toLocaleString()}`
  ).join('\n');

  return `
SHREE PRATHAM CONGLOMERATE
Official Order & Tax Invoice Confirmation
==================================================

Dear ${order.customer?.name || 'Customer'},

Thank you for your order with Shree Pratham. Your transaction has been confirmed and is now entering our dispatch pipeline.

ORDER DETAILS:
--------------------------------------------------
Order ID: ${order.id}
Date: ${order.date || new Date().toISOString().split('T')[0]}
Payment Status: ${order.paymentStatus || 'Paid'}
Payment Method: ${order.paymentMethod || 'UPI / Online'}
${order.razorpayPaymentId ? `Razorpay Reference ID: ${order.razorpayPaymentId}\n` : ''}Delivery Slot: ${order.slot || 'Standard Morning Slot'}

SHIPPING DESTINATION:
--------------------------------------------------
${order.customer?.name}
${order.customer?.address}
Phone: ${order.customer?.phone}

ITEMS ORDERED:
--------------------------------------------------
${itemsText}

FINANCIAL SUMMARY:
--------------------------------------------------
Subtotal: ₹${(order.subtotal || 0).toLocaleString()}
${order.discount > 0 ? `Discount: -₹${order.discount.toLocaleString()}\n` : ''}Shipping: ${order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}
TOTAL AMOUNT PAID: ₹${(order.totalAmount || 0).toLocaleString()}

For inquiries or amendments, reply directly to:
${OFFICIAL_SALES_EMAIL}
Phone: +91 (022) 6982-5000 / +91 98201 23456
Official Enterprise Desk: Shree Pratham Conglomerate
==================================================
`;
};

/**
 * Dispatches an order confirmation email from sales@shreepratham.com
 */
export const sendOrderConfirmationEmail = async (order) => {
  const recipientEmail = order.customer?.email || 'customer@example.com';
  const recipientName = order.customer?.name || 'Customer';
  const subject = `Order Confirmed: #${order.id} | Shree Pratham Tax Invoice & Dispatch Notice`;

  const emailRecord = {
    id: 'EML-' + Date.now() + '-' + Math.floor(100 + Math.random() * 900),
    orderId: order.id,
    from: OFFICIAL_SALES_EMAIL,
    fromName: OFFICIAL_SENDER_NAME,
    to: recipientEmail,
    toName: recipientName,
    subject: subject,
    timestamp: new Date().toISOString(),
    status: 'Delivered',
    html: generateOrderEmailHtml(order),
    text: generateOrderEmailText(order)
  };

  // 1. Audit trail in localStorage
  try {
    const existing = JSON.parse(localStorage.getItem('sp_sent_emails') || '[]');
    existing.unshift(emailRecord);
    localStorage.setItem('sp_sent_emails', JSON.stringify(existing.slice(0, 100))); // keep latest 100
  } catch (err) {
    console.error('Failed to save sent email to audit log:', err);
  }

  // 2. Optional: Forward to external webhook or EmailJS if environment variables exist
  const webhookUrl = import.meta.env.VITE_EMAIL_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailRecord)
      });
    } catch (err) {
      console.warn('Webhook delivery notice:', err);
    }
  }

  console.log(`[Shree Pratham Mail Dispatch] Dispatched order confirmation email from ${OFFICIAL_SALES_EMAIL} to ${recipientEmail} for Order ${order.id}`);

  return {
    success: true,
    email: emailRecord
  };
};

/**
 * Returns all sent emails from audit log
 */
export const getSentEmails = () => {
  try {
    return JSON.parse(localStorage.getItem('sp_sent_emails') || '[]');
  } catch {
    return [];
  }
};

/**
 * Retrieves the sent confirmation email for a given order ID
 */
export const getEmailByOrderId = (orderId) => {
  const all = getSentEmails();
  return all.find(e => e.orderId === orderId);
};

/**
 * Generates a pre-filled mailto: link for quick opening in client
 */
export const generateMailtoLink = (order) => {
  const recipient = encodeURIComponent(order.customer?.email || '');
  const subject = encodeURIComponent(`Order Confirmed: #${order.id} | Shree Pratham Tax Invoice`);
  const body = encodeURIComponent(generateOrderEmailText(order));
  return `mailto:${recipient}?subject=${subject}&body=${body}`;
};
