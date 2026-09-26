// ========================================================
// Shree Pratham GST Tax Invoice Generator
// GSTIN: 07ELQPA7054H1ZW
// ========================================================

import { OFFICIAL_SALES_EMAIL, OFFICIAL_SENDER_NAME } from './emailService';

// Company Details
const COMPANY = {
  name: 'SHREE PRATHAM CONGLOMERATE',
  gstin: '07ELQPA7054H1ZW',
  pan: 'ELQPA7054H',
  address: 'Flat 402, Sea Green Heights, Hill Road, Bandra West',
  city: 'Mumbai',
  state: 'Maharashtra',
  stateCode: '27',
  pincode: '400050',
  phone: '+91 (022) 6982-5000',
  email: 'contact@shreepratham.com',
  website: 'www.shreepratham.com',
  logoUrl: '/logo.png'
};

// HSN/SAC codes mapping by category
const HSN_CODES = {
  'Corporate': '4911',
  'Wedding': '4911',
  'Birthday': '4911',
  'Festive': '4911',
  'Gift': '4911',
  'gift': '4911',
  'Water': '2201',
  'water': '2201',
  'Appliance': '8418',
  'appliance': '8418',
  'Industrial': '8418',
  'industrial': '8418',
  'Marketing': '9983',
  'marketing': '9983',
  'Digital': '9983',
  'digital': '9983',
  'IT': '9983',
  'it': '9983',
  'Services': '9983',
  'default': '4911'
};

/**
 * Determine the HSN/SAC code for a product based on its category or name.
 */
const getHsnCode = (item) => {
  const category = item.category || item.vertical || '';
  const name = (item.name || '').toLowerCase();

  for (const [key, code] of Object.entries(HSN_CODES)) {
    if (category.toLowerCase().includes(key.toLowerCase()) || name.includes(key.toLowerCase())) {
      return code;
    }
  }
  return HSN_CODES.default;
};

/**
 * Convert number to Indian words for invoice amount display
 */
const numberToWords = (num) => {
  if (num === 0) return 'Zero';

  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convert = (n) => {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + convert(n % 100) : '');
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
    return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
  };

  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);

  let result = 'Rupees ' + convert(rupees);
  if (paise > 0) {
    result += ' and ' + convert(paise) + ' Paise';
  }
  result += ' Only';
  return result;
};

/**
 * Generate a unique invoice number
 */
const generateInvoiceNumber = (orderId) => {
  const dateCode = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const seq = orderId ? orderId.replace(/\D/g, '').slice(-4) : Math.floor(1000 + Math.random() * 9000);
  return `SP/GST/${dateCode}/${seq}`;
};

/**
 * Calculate GST breakdown for items
 */
const calculateGST = (items, deliveryCharge = 0, discount = 0, customerState = 'Maharashtra') => {
  const isIntraState = customerState.toLowerCase().includes('maharashtra') || 
                       customerState.toLowerCase().includes('mh');
  const gstRate = 0.18; // 18% GST

  let totalTaxableValue = 0;

  const lineItems = items.map((item, index) => {
    const unitPrice = item.price || 0;
    const qty = item.quantity || 1;
    const lineTotal = unitPrice * qty;
    const itemDiscount = discount > 0 ? (lineTotal / items.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0)) * discount : 0;
    const taxableValue = lineTotal - itemDiscount;
    const gstAmount = taxableValue * gstRate;

    totalTaxableValue += taxableValue;

    return {
      sno: index + 1,
      name: item.name || 'Product',
      description: item.customization?.engravingText ? `Customization: "${item.customization.engravingText}"` : (item.description || ''),
      hsn: getHsnCode(item),
      qty,
      unitPrice,
      discount: itemDiscount,
      taxableValue,
      cgst: isIntraState ? gstAmount / 2 : 0,
      sgst: isIntraState ? gstAmount / 2 : 0,
      igst: isIntraState ? 0 : gstAmount,
      total: taxableValue + gstAmount
    };
  });

  // Shipping GST (18% on shipping)
  const shippingTaxable = deliveryCharge;
  const shippingGst = shippingTaxable * gstRate;

  const totalCgst = lineItems.reduce((s, i) => s + i.cgst, 0) + (isIntraState ? shippingGst / 2 : 0);
  const totalSgst = lineItems.reduce((s, i) => s + i.sgst, 0) + (isIntraState ? shippingGst / 2 : 0);
  const totalIgst = lineItems.reduce((s, i) => s + i.igst, 0) + (isIntraState ? 0 : shippingGst);
  const totalTax = totalCgst + totalSgst + totalIgst;
  const grandTotal = totalTaxableValue + shippingTaxable + totalTax;
  const roundedTotal = Math.round(grandTotal);
  const roundOff = roundedTotal - grandTotal;

  return {
    lineItems,
    isIntraState,
    shippingTaxable,
    shippingGst,
    shippingCgst: isIntraState ? shippingGst / 2 : 0,
    shippingSgst: isIntraState ? shippingGst / 2 : 0,
    shippingIgst: isIntraState ? 0 : shippingGst,
    totalTaxableValue,
    totalCgst,
    totalSgst,
    totalIgst,
    totalTax,
    discount,
    grandTotal,
    roundOff,
    roundedTotal
  };
};

/**
 * Generate the full GST invoice HTML
 */
export const generateGSTInvoiceHtml = (order) => {
  const invoiceNumber = generateInvoiceNumber(order.id);
  const invoiceDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const dueDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const customer = order.customer || {};
  const customerState = customer.state || customer.address?.split(',').pop()?.trim() || 'Maharashtra';
  const deliveryCharge = order.deliveryCharge || 0;
  const discount = order.discount || 0;

  const gst = calculateGST(order.items || [], deliveryCharge, discount, customerState);

  // Build line items rows
  const itemRowsHtml = gst.lineItems.map(item => `
    <tr>
      <td style="padding: 10px 8px; border: 1px solid #d1d5db; text-align: center; font-size: 13px;">${item.sno}</td>
      <td style="padding: 10px 8px; border: 1px solid #d1d5db; font-size: 13px;">
        <strong>${item.name}</strong>
        ${item.description ? `<br><span style="font-size: 11px; color: #6b7280;">${item.description}</span>` : ''}
      </td>
      <td style="padding: 10px 8px; border: 1px solid #d1d5db; text-align: center; font-size: 13px;">${item.hsn}</td>
      <td style="padding: 10px 8px; border: 1px solid #d1d5db; text-align: center; font-size: 13px;">${item.qty}</td>
      <td style="padding: 10px 8px; border: 1px solid #d1d5db; text-align: right; font-size: 13px;">₹${item.unitPrice.toFixed(2)}</td>
      <td style="padding: 10px 8px; border: 1px solid #d1d5db; text-align: right; font-size: 13px;">${item.discount > 0 ? `(-)₹${item.discount.toFixed(2)}` : '-'}</td>
      <td style="padding: 10px 8px; border: 1px solid #d1d5db; text-align: right; font-size: 13px;">₹${item.taxableValue.toFixed(2)}</td>
      ${gst.isIntraState ? `
        <td style="padding: 10px 8px; border: 1px solid #d1d5db; text-align: right; font-size: 12px;">₹${item.cgst.toFixed(2)}<br><span style="font-size:10px;color:#6b7280;">@9%</span></td>
        <td style="padding: 10px 8px; border: 1px solid #d1d5db; text-align: right; font-size: 12px;">₹${item.sgst.toFixed(2)}<br><span style="font-size:10px;color:#6b7280;">@9%</span></td>
      ` : `
        <td style="padding: 10px 8px; border: 1px solid #d1d5db; text-align: right; font-size: 12px;">₹${item.igst.toFixed(2)}<br><span style="font-size:10px;color:#6b7280;">@18%</span></td>
      `}
      <td style="padding: 10px 8px; border: 1px solid #d1d5db; text-align: right; font-size: 13px; font-weight: 600;">₹${item.total.toFixed(2)}</td>
    </tr>
  `).join('');

  // Shipping row
  const shippingRowHtml = deliveryCharge > 0 ? `
    <tr style="background: #f9fafb;">
      <td style="padding: 10px 8px; border: 1px solid #d1d5db; text-align: center; font-size: 13px;"></td>
      <td style="padding: 10px 8px; border: 1px solid #d1d5db; font-size: 13px;"><strong>Shipping & Packaging</strong></td>
      <td style="padding: 10px 8px; border: 1px solid #d1d5db; text-align: center; font-size: 13px;">9965</td>
      <td style="padding: 10px 8px; border: 1px solid #d1d5db; text-align: center; font-size: 13px;">1</td>
      <td style="padding: 10px 8px; border: 1px solid #d1d5db; text-align: right; font-size: 13px;">₹${deliveryCharge.toFixed(2)}</td>
      <td style="padding: 10px 8px; border: 1px solid #d1d5db; text-align: right; font-size: 13px;">-</td>
      <td style="padding: 10px 8px; border: 1px solid #d1d5db; text-align: right; font-size: 13px;">₹${gst.shippingTaxable.toFixed(2)}</td>
      ${gst.isIntraState ? `
        <td style="padding: 10px 8px; border: 1px solid #d1d5db; text-align: right; font-size: 12px;">₹${gst.shippingCgst.toFixed(2)}<br><span style="font-size:10px;color:#6b7280;">@9%</span></td>
        <td style="padding: 10px 8px; border: 1px solid #d1d5db; text-align: right; font-size: 12px;">₹${gst.shippingSgst.toFixed(2)}<br><span style="font-size:10px;color:#6b7280;">@9%</span></td>
      ` : `
        <td style="padding: 10px 8px; border: 1px solid #d1d5db; text-align: right; font-size: 12px;">₹${gst.shippingIgst.toFixed(2)}<br><span style="font-size:10px;color:#6b7280;">@18%</span></td>
      `}
      <td style="padding: 10px 8px; border: 1px solid #d1d5db; text-align: right; font-size: 13px; font-weight: 600;">₹${(gst.shippingTaxable + (gst.isIntraState ? gst.shippingCgst + gst.shippingSgst : gst.shippingIgst)).toFixed(2)}</td>
    </tr>
  ` : '';

  const taxHeaders = gst.isIntraState 
    ? '<th style="padding: 10px 6px; border: 1px solid #0891b2; text-align: right; font-size: 12px; white-space: nowrap;">CGST</th><th style="padding: 10px 6px; border: 1px solid #0891b2; text-align: right; font-size: 12px; white-space: nowrap;">SGST</th>'
    : '<th style="padding: 10px 6px; border: 1px solid #0891b2; text-align: right; font-size: 12px; white-space: nowrap;">IGST</th>';

  const colSpan = gst.isIntraState ? 10 : 9;
  const taxColSpan = gst.isIntraState ? 6 : 5;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>GST Tax Invoice ${invoiceNumber}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; background: #f1f5f9; color: #1e293b; }
    @media print {
      body { background: white; }
      .no-print { display: none !important; }
      .invoice-container { box-shadow: none !important; margin: 0 !important; }
    }
  </style>
</head>
<body>
  <div class="invoice-container" style="max-width: 900px; margin: 30px auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); overflow: hidden;">

    <!-- Header Bar -->
    <div style="background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); padding: 24px 32px; display: flex; justify-content: space-between; align-items: center;">
      <div style="display: flex; align-items: center; gap: 16px;">
        <div style="width: 56px; height: 56px; background: #ffffff; border-radius: 12px; display: flex; align-items: center; justify-content: center; padding: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
          <img src="${COMPANY.logoUrl}" alt="${COMPANY.name}" style="width: 100%; height: 100%; object-fit: contain;" />
        </div>
        <div>
          <div style="font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: 0.03em;">${COMPANY.name}</div>
          <div style="font-size: 11px; color: rgba(255,255,255,0.8); letter-spacing: 0.08em; text-transform: uppercase; margin-top: 2px;">Enterprise & Lifestyle Multi-Vertical</div>
        </div>
      </div>
      <div style="text-align: right; color: #ffffff;">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: rgba(255,255,255,0.7);">Original for Recipient</div>
        <div style="font-size: 24px; font-weight: 800; margin-top: 2px;">TAX INVOICE</div>
        <div style="font-size: 14px; font-weight: 700; color: #fde68a; margin-top: 4px;">${invoiceNumber}</div>
      </div>
    </div>

    <!-- Invoice Meta -->
    <div style="display: flex; justify-content: flex-end; gap: 32px; padding: 14px 32px; background: #f0fdfa; border-bottom: 1px solid #99f6e4;">
      <div style="font-size: 12px;"><strong>Date:</strong> ${invoiceDate}</div>
      <div style="font-size: 12px;"><strong>Due Date:</strong> ${dueDate}</div>
      <div style="font-size: 12px;"><strong>Order Ref:</strong> ${order.id}</div>
    </div>

    <!-- Seller / Buyer Details -->
    <div style="display: flex; gap: 0; border-bottom: 2px solid #0891b2;">
      <!-- Seller -->
      <div style="flex: 1; padding: 20px 32px; border-right: 1px solid #e2e8f0;">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #0891b2; font-weight: 700; margin-bottom: 8px;">Seller Details</div>
        <div style="font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 6px;">${COMPANY.name}</div>
        <div style="font-size: 12px; color: #475569; line-height: 1.6;">
          📍 ${COMPANY.address}<br>
          ${COMPANY.city}, ${COMPANY.state} - ${COMPANY.pincode}<br>
          📞 ${COMPANY.phone}<br>
          ✉️ ${COMPANY.email}<br>
          🌐 ${COMPANY.website}
        </div>
        <div style="margin-top: 8px; font-size: 12px; font-weight: 700; color: #0891b2;">GSTIN: ${COMPANY.gstin}</div>
        <div style="font-size: 11px; color: #64748b;">PAN: ${COMPANY.pan} | State: ${COMPANY.state} (${COMPANY.stateCode})</div>
      </div>

      <!-- Buyer -->
      <div style="flex: 1; padding: 20px 32px;">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #0891b2; font-weight: 700; margin-bottom: 8px;">Bill To</div>
        <div style="font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 6px;">${customer.name || 'Customer'}</div>
        <div style="font-size: 12px; color: #475569; line-height: 1.6;">
          📍 ${customer.address || 'Address on file'}<br>
          📞 ${customer.phone || 'N/A'}<br>
          ✉️ ${customer.email || 'N/A'}
        </div>
        ${customer.gstin ? `<div style="margin-top: 8px; font-size: 12px; font-weight: 700; color: #0891b2;">GSTIN: ${customer.gstin}</div>` : '<div style="margin-top: 8px; font-size: 11px; color: #94a3b8;">Unregistered / B2C Customer</div>'}
        <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Place of Supply: ${customerState}</div>
      </div>

      <!-- Shipment Info -->
      <div style="flex: 0.7; padding: 20px 24px; border-left: 1px solid #e2e8f0; background: #f8fafc;">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #0891b2; font-weight: 700; margin-bottom: 8px;">Shipment</div>
        <div style="font-size: 12px; color: #475569; line-height: 1.8;">
          <div><strong>AWB:</strong> ${order.shiprocketAwb || 'Pending'}</div>
          <div><strong>Courier:</strong> ${order.shiprocketCourier || 'Shiprocket'}</div>
          <div><strong>Payment:</strong> ${order.paymentMethod || 'Online'}</div>
          <div><strong>Slot:</strong> ${order.slot || 'Standard'}</div>
        </div>
      </div>
    </div>

    <!-- Items Table -->
    <div style="padding: 0 32px;">
      <table style="width: 100%; border-collapse: collapse; margin-top: 0;">
        <thead>
          <tr style="background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);">
            <th style="padding: 10px 6px; border: 1px solid #0891b2; color: #fff; text-align: center; font-size: 12px; width: 40px;">NO</th>
            <th style="padding: 10px 6px; border: 1px solid #0891b2; color: #fff; text-align: left; font-size: 12px;">PRODUCT / SERVICE</th>
            <th style="padding: 10px 6px; border: 1px solid #0891b2; color: #fff; text-align: center; font-size: 12px; white-space: nowrap;">HSN/SAC</th>
            <th style="padding: 10px 6px; border: 1px solid #0891b2; color: #fff; text-align: center; font-size: 12px;">QTY</th>
            <th style="padding: 10px 6px; border: 1px solid #0891b2; color: #fff; text-align: right; font-size: 12px; white-space: nowrap;">UNIT PRICE</th>
            <th style="padding: 10px 6px; border: 1px solid #0891b2; color: #fff; text-align: right; font-size: 12px;">DISCOUNT</th>
            <th style="padding: 10px 6px; border: 1px solid #0891b2; color: #fff; text-align: right; font-size: 12px; white-space: nowrap;">TAXABLE</th>
            ${taxHeaders}
            <th style="padding: 10px 6px; border: 1px solid #0891b2; color: #fff; text-align: right; font-size: 12px;">AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          ${itemRowsHtml}
          ${shippingRowHtml}
        </tbody>

        <!-- Totals -->
        <tfoot>
          <tr style="background: #f0fdfa; font-weight: 700;">
            <td colspan="${taxColSpan}" style="padding: 10px 8px; border: 1px solid #d1d5db;"></td>
            <td style="padding: 10px 8px; border: 1px solid #d1d5db; text-align: right; font-size: 13px;">₹${(gst.totalTaxableValue + gst.shippingTaxable).toFixed(2)}</td>
            ${gst.isIntraState ? `
              <td style="padding: 10px 8px; border: 1px solid #d1d5db; text-align: right; font-size: 13px;">₹${gst.totalCgst.toFixed(2)}</td>
              <td style="padding: 10px 8px; border: 1px solid #d1d5db; text-align: right; font-size: 13px;">₹${gst.totalSgst.toFixed(2)}</td>
            ` : `
              <td style="padding: 10px 8px; border: 1px solid #d1d5db; text-align: right; font-size: 13px;">₹${gst.totalIgst.toFixed(2)}</td>
            `}
            <td style="padding: 10px 8px; border: 1px solid #d1d5db; text-align: right; font-size: 14px; font-weight: 800; color: #0891b2;">₹${gst.grandTotal.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Summary Section -->
    <div style="display: flex; gap: 0; margin: 0 32px; border: 1px solid #d1d5db; border-top: none;">
      <!-- Amount in Words -->
      <div style="flex: 1; padding: 16px 20px; border-right: 1px solid #d1d5db;">
        <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; margin-bottom: 6px;">Total Amount (in words)</div>
        <div style="font-size: 13px; font-weight: 600; color: #0f172a;">₹ ${numberToWords(gst.roundedTotal)}</div>
      </div>

      <!-- Amount Breakdown -->
      <div style="width: 320px; padding: 12px 20px;">
        <table style="width: 100%; font-size: 12px;">
          <tr>
            <td style="padding: 4px 0; color: #475569;">Total Before Tax</td>
            <td style="padding: 4px 0; text-align: right; font-weight: 600;">₹${(gst.totalTaxableValue + gst.shippingTaxable).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          </tr>
          ${gst.discount > 0 ? `
          <tr>
            <td style="padding: 4px 0; color: #16a34a;">Discount</td>
            <td style="padding: 4px 0; text-align: right; font-weight: 600; color: #16a34a;">(-)₹${gst.discount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          </tr>
          ` : ''}
          ${gst.isIntraState ? `
          <tr>
            <td style="padding: 4px 0; color: #475569;">CGST @9%</td>
            <td style="padding: 4px 0; text-align: right; font-weight: 600;">₹${gst.totalCgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #475569;">SGST @9%</td>
            <td style="padding: 4px 0; text-align: right; font-weight: 600;">₹${gst.totalSgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          </tr>
          ` : `
          <tr>
            <td style="padding: 4px 0; color: #475569;">IGST @18%</td>
            <td style="padding: 4px 0; text-align: right; font-weight: 600;">₹${gst.totalIgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          </tr>
          `}
          <tr>
            <td style="padding: 4px 0; color: #475569;">Total Tax Amount</td>
            <td style="padding: 4px 0; text-align: right; font-weight: 600;">₹${gst.totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          </tr>
          ${Math.abs(gst.roundOff) > 0.001 ? `
          <tr>
            <td style="padding: 4px 0; color: #94a3b8; font-size: 11px;">Rounded Off</td>
            <td style="padding: 4px 0; text-align: right; font-size: 11px; color: #94a3b8;">${gst.roundOff >= 0 ? '+' : ''}₹${gst.roundOff.toFixed(2)}</td>
          </tr>
          ` : ''}
          <tr style="border-top: 2px solid #0891b2;">
            <td style="padding: 8px 0 4px; font-size: 14px; font-weight: 800; color: #0891b2;">TOTAL AMOUNT</td>
            <td style="padding: 8px 0 4px; text-align: right; font-size: 16px; font-weight: 800; color: #0891b2;">₹${gst.roundedTotal.toLocaleString('en-IN')}</td>
          </tr>
          <tr>
            <td style="padding: 2px 0; font-size: 13px; font-weight: 800; color: #0f172a;">AMOUNT DUE</td>
            <td style="padding: 2px 0; text-align: right; font-size: 15px; font-weight: 800; color: #0f172a;">₹${order.paymentStatus === 'Paid' ? '0' : gst.roundedTotal.toLocaleString('en-IN')}</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Authorized Signatory & Notes -->
    <div style="display: flex; gap: 0; margin: 20px 32px 0; border: 1px solid #e2e8f0; border-radius: 0 0 8px 8px;">
      <div style="flex: 1; padding: 20px; border-right: 1px solid #e2e8f0;">
        <div style="font-size: 11px; color: #0891b2; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 12px;">Bank Details for NEFT/RTGS</div>
        <div style="font-size: 12px; color: #475569; line-height: 1.7;">
          Bank: <strong>HDFC Bank</strong><br>
          A/C Name: <strong>Shree Pratham Conglomerate</strong><br>
          A/C No: <strong>50200085432100</strong><br>
          IFSC: <strong>HDFC0001234</strong><br>
          Branch: <strong>Bandra West, Mumbai</strong>
        </div>
      </div>
      <div style="flex: 1; padding: 20px; text-align: right;">
        <div style="font-size: 11px; color: #0891b2; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 10px;">For ${COMPANY.name}</div>
        <div style="margin: 20px 0;">
          <div style="font-family: 'Brush Script MT', cursive; font-size: 28px; color: #0891b2; font-style: italic;">Shree Pratham</div>
        </div>
        <div style="font-size: 12px; font-weight: 700; color: #0f172a;">Authorized Signatory</div>
        <div style="font-size: 11px; color: #64748b; margin-top: 2px;">(Computer Generated Invoice)</div>
      </div>
    </div>

    <!-- Notes -->
    <div style="margin: 16px 32px 24px; padding: 16px 20px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; font-size: 11px; color: #92400e; line-height: 1.6;">
      <strong style="font-size: 12px;">NOTE:</strong><br>
      1. All products are fragile and need to be transported with caution.<br>
      2. Goods once sold will not be taken back or exchanged unless damaged in transit.<br>
      3. Subject to Mumbai Jurisdiction only.<br>
      4. E&OE – Errors and Omissions Excepted.<br>
      5. This is a computer-generated invoice and does not require physical signature.
    </div>

    <!-- Footer -->
    <div style="background: #f8fafc; padding: 14px 32px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8;">
      ${COMPANY.name} | GSTIN: ${COMPANY.gstin} | ${COMPANY.phone} | ${COMPANY.email} | ${COMPANY.website}
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Send GST Invoice via email (same pattern as order confirmation)
 */
export const sendGSTInvoiceEmail = async (order) => {
  const recipientEmail = order.customer?.email || 'customer@example.com';
  const recipientName = order.customer?.name || 'Customer';
  const invoiceNumber = generateInvoiceNumber(order.id);

  const emailRecord = {
    id: 'INV-' + Date.now() + '-' + Math.floor(100 + Math.random() * 900),
    orderId: order.id,
    invoiceNumber,
    type: 'gst_invoice',
    from: OFFICIAL_SALES_EMAIL,
    fromName: OFFICIAL_SENDER_NAME,
    to: recipientEmail,
    toName: recipientName,
    subject: `GST Tax Invoice ${invoiceNumber} | Order #${order.id} | ${COMPANY.name}`,
    timestamp: new Date().toISOString(),
    status: 'Delivered',
    html: generateGSTInvoiceHtml(order)
  };

  // Save to audit trail
  try {
    const existing = JSON.parse(localStorage.getItem('sp_sent_invoices') || '[]');
    existing.unshift(emailRecord);
    localStorage.setItem('sp_sent_invoices', JSON.stringify(existing.slice(0, 100)));
  } catch (err) {
    console.error('Failed to save invoice to audit log:', err);
  }

  // Forward to webhook if configured
  const webhookUrl = import.meta.env.VITE_EMAIL_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailRecord)
      });
    } catch (err) {
      console.warn('Invoice webhook delivery notice:', err);
    }
  }

  console.log(`[Shree Pratham Invoice] GST Invoice ${invoiceNumber} dispatched from ${OFFICIAL_SALES_EMAIL} to ${recipientEmail} for Order ${order.id}`);

  return {
    success: true,
    invoiceNumber,
    email: emailRecord
  };
};

/**
 * Retrieve saved invoices
 */
export const getSentInvoices = () => {
  try {
    return JSON.parse(localStorage.getItem('sp_sent_invoices') || '[]');
  } catch {
    return [];
  }
};

/**
 * Get invoice by order ID
 */
export const getInvoiceByOrderId = (orderId) => {
  const all = getSentInvoices();
  return all.find(e => e.orderId === orderId);
};

export { COMPANY as GST_COMPANY_DETAILS, generateInvoiceNumber, calculateGST, numberToWords };
