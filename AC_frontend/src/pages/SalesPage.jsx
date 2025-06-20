import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const SalesPage = () => {
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    billingAddress: '',
    shippingAddress: '',
    salesOrderDate: '',
    products: [{ productName: '', sku: '', quantity: 1, unitPrice: 0, taxPercent: 0, total: 0 }],
    modeOfPayment: 'Cash',
    paymentTerms: '',
    paymentStatus: 'Pending',
    assignedSalesperson: '',
    notes: '',
    discount: 0,
    taxSummary: '',
    subtotal: 0,
    grandTotal: 0,
    status: 'Draft',
    followUpReminder: '',
    sourceOfLead: '',
  });

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle product item changes
  const handleProductChange = (index, field, value) => {
    const updated = [...form.products];
    updated[index][field] = field.includes('quantity') || field.includes('unitPrice') || field.includes('taxPercent')
      ? Number(value)
      : value;

    updated[index].total = (
      updated[index].quantity * updated[index].unitPrice * (1 + updated[index].taxPercent / 100)
    ).toFixed(2);

    setForm((prev) => ({
      ...prev,
      products: updated,
      subtotal: calcSubtotal(updated),
      grandTotal: calcGrandTotal(updated, form.discount),
    }));
  };

  // Add / Remove Product Row
  const addProduct = () => {
    setForm((prev) => ({
      ...prev,
      products: [...prev.products, { productName: '', sku: '', quantity: 1, unitPrice: 0, taxPercent: 0, total: 0 }],
    }));
  };

  const removeProduct = (index) => {
    const updated = [...form.products];
    updated.splice(index, 1);
    setForm((prev) => ({
      ...prev,
      products: updated,
    }));
  };

  // Calculate totals
  const calcSubtotal = (items) =>
    items.reduce((acc, item) => acc + Number(item.total), 0).toFixed(2);

  const calcGrandTotal = (items, discount) => {
    const subtotal = calcSubtotal(items);
    const grand = subtotal - Number(discount || 0);
    return grand > 0 ? grand.toFixed(2) : 0;
  };

  // Submit to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/sales', form);
      toast.success('Sales Order Submitted!');
      setForm({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        billingAddress: '',
        shippingAddress: '',
        salesOrderDate: '',
        products: [{ productName: '', sku: '', quantity: 1, unitPrice: 0, taxPercent: 0, total: 0 }],
        modeOfPayment: 'Cash',
        paymentTerms: '',
        paymentStatus: 'Pending',
        assignedSalesperson: '',
        notes: '',
        discount: 0,
        taxSummary: '',
        subtotal: 0,
        grandTotal: 0,
        status: 'Draft',
        followUpReminder: '',
        sourceOfLead: '',
      });
    } catch (err) {
      toast.error('Error submitting sales order');
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h2 className="text-2xl font-bold text-[#2c5f6f] mb-6">Sales Entry Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Customer Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="customerName" required placeholder="Customer Name" value={form.customerName} onChange={handleChange} className="input" />
          <input type="email" name="customerEmail" placeholder="Customer Email" value={form.customerEmail} onChange={handleChange} className="input" />
          <input type="text" name="customerPhone" placeholder="Customer Phone" value={form.customerPhone} onChange={handleChange} className="input" />
          <input type="text" name="billingAddress" placeholder="Billing Address" value={form.billingAddress} onChange={handleChange} className="input" />
          <input type="text" name="shippingAddress" placeholder="Shipping Address" value={form.shippingAddress} onChange={handleChange} className="input" />
          <input type="date" name="salesOrderDate" required value={form.salesOrderDate} onChange={handleChange} className="input" />
        </div>

        {/* Product List */}
        <div>
          <h3 className="font-semibold mb-2">Product/Service List</h3>
          {form.products.map((item, index) => (
            <div key={index} className="grid grid-cols-6 gap-2 mb-2">
              <input type="text" placeholder="Product Name" value={item.productName} onChange={(e) => handleProductChange(index, 'productName', e.target.value)} className="input col-span-2" required />
              <input type="text" placeholder="SKU" value={item.sku} onChange={(e) => handleProductChange(index, 'sku', e.target.value)} className="input" />
              <input type="number" min="1" placeholder="Qty" value={item.quantity} onChange={(e) => handleProductChange(index, 'quantity', e.target.value)} className="input" required />
              <input type="number" placeholder="Unit Price" value={item.unitPrice} onChange={(e) => handleProductChange(index, 'unitPrice', e.target.value)} className="input" required />
              <input type="number" placeholder="Tax %" value={item.taxPercent} onChange={(e) => handleProductChange(index, 'taxPercent', e.target.value)} className="input" />
              <button type="button" onClick={() => removeProduct(index)} className="text-red-600">❌</button>
            </div>
          ))}
          <button type="button" onClick={addProduct} className="text-sm text-[#2c5f6f] underline">+ Add Product</button>
        </div>

        {/* Payments + Others */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select name="modeOfPayment" value={form.modeOfPayment} onChange={handleChange} className="input">
            <option>Cash</option>
            <option>Card</option>
            <option>Bank Transfer</option>
            <option>UPI</option>
          </select>
          <input type="text" name="paymentTerms" placeholder="Payment Terms" value={form.paymentTerms} onChange={handleChange} className="input" />
          <select name="paymentStatus" value={form.paymentStatus} onChange={handleChange} className="input">
            <option>Pending</option>
            <option>Paid</option>
            <option>Partially Paid</option>
          </select>
        </div>

        <textarea name="notes" placeholder="Sales Notes" value={form.notes} onChange={handleChange} className="input" />
        <input type="text" name="assignedSalesperson" placeholder="Salesperson" value={form.assignedSalesperson} onChange={handleChange} className="input" />
        <input type="text" name="sourceOfLead" placeholder="Lead Source" value={form.sourceOfLead} onChange={handleChange} className="input" />
        <input type="date" name="followUpReminder" value={form.followUpReminder} onChange={handleChange} className="input" />

        {/* Totals */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <input type="number" name="discount" placeholder="Discount ₹" value={form.discount} onChange={handleChange} className="input" />
          <input type="text" name="taxSummary" placeholder="Tax Summary (GST/IGST/CGST)" value={form.taxSummary} onChange={handleChange} className="input" />
          <input type="number" value={form.subtotal} disabled className="input bg-gray-100" placeholder="Subtotal" />
          <input type="number" value={form.grandTotal} disabled className="input bg-gray-100" placeholder="Grand Total" />
        </div>

        {/* Status + Submit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <select name="status" value={form.status} onChange={handleChange} className="input">
            <option>Draft</option>
            <option>Confirmed</option>
            <option>Cancelled</option>
            <option>Invoiced</option>
          </select>
          <button type="submit" className="bg-[#2c5f6f] text-white py-2 px-4 rounded">Submit Sale</button>
        </div>
      </form>
    </div>
  );
};

export default SalesPage;
