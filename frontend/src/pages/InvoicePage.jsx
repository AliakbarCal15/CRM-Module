import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const InvoicePage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    billingAddress: '',
    invoiceDate: '',
    dueDate: '',
    products: [{ productName: '', sku: '', quantity: 1, unitPrice: 0, total: 0 }],
    discount: 0,
    taxRate: 18,
    notes: '',
    paymentStatus: 'Draft',
    subtotal: 0,
    taxAmount: 0,
    totalAmount: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProductChange = (index, field, value) => {
    const updated = [...form.products];
    updated[index][field] = field === 'quantity' || field === 'unitPrice'
      ? Number(value)
      : value;
    updated[index].total = updated[index].quantity * updated[index].unitPrice;

    const subtotal = updated.reduce((acc, item) => acc + item.total, 0);
    const taxAmount = ((subtotal - form.discount) * form.taxRate) / 100;
    const totalAmount = subtotal - form.discount + taxAmount;

    setForm((prev) => ({
      ...prev,
      products: updated,
      subtotal,
      taxAmount,
      totalAmount,
    }));
  };

  const addProduct = () => {
    setForm((prev) => ({
      ...prev,
      products: [...prev.products, { productName: '', sku: '', quantity: 1, unitPrice: 0, total: 0 }],
    }));
  };

  const removeProduct = (index) => {
    const updated = [...form.products];
    updated.splice(index, 1);
    const subtotal = updated.reduce((acc, item) => acc + item.total, 0);
    const taxAmount = ((subtotal - form.discount) * form.taxRate) / 100;
    const totalAmount = subtotal - form.discount + taxAmount;

    setForm((prev) => ({
      ...prev,
      products: updated,
      subtotal,
      taxAmount,
      totalAmount,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/invoices', form);
      toast.success('✅ Invoice Created!');
      setForm({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        billingAddress: '',
        invoiceDate: '',
        dueDate: '',
        products: [{ productName: '', sku: '', quantity: 1, unitPrice: 0, total: 0 }],
        discount: 0,
        taxRate: 18,
        notes: '',
        paymentStatus: 'Draft',
        subtotal: 0,
        taxAmount: 0,
        totalAmount: 0,
      });
      navigate('/invoices');
    } catch (err) {
      toast.error('❌ Error creating invoice');
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h2 className="text-2xl font-bold text-[#2c5f6f] mb-6">Create New Invoice</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Client Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="customerName" placeholder="Customer Name" value={form.customerName} onChange={handleChange} className="input" required />
          <input type="email" name="customerEmail" placeholder="Customer Email" value={form.customerEmail} onChange={handleChange} className="input" />
          <input type="text" name="customerPhone" placeholder="Customer Phone" value={form.customerPhone} onChange={handleChange} className="input" />
          <input type="text" name="billingAddress" placeholder="Billing Address" value={form.billingAddress} onChange={handleChange} className="input" />
          <input type="date" name="invoiceDate" value={form.invoiceDate} onChange={handleChange} className="input" required />
          <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} className="input" required />
        </div>

        {/* Products */}
        <div>
          <h3 className="font-semibold mb-2">Invoice Items</h3>
          {form.products.map((item, index) => (
            <div key={index} className="grid grid-cols-6 gap-2 mb-2">
              <input type="text" placeholder="Product Name" value={item.productName} onChange={(e) => handleProductChange(index, 'productName', e.target.value)} className="input col-span-2" required />
              <input type="text" placeholder="SKU" value={item.sku} onChange={(e) => handleProductChange(index, 'sku', e.target.value)} className="input" />
              <input type="number" min="1" placeholder="Qty" value={item.quantity} onChange={(e) => handleProductChange(index, 'quantity', e.target.value)} className="input" required />
              <input type="number" placeholder="Unit Price" value={item.unitPrice} onChange={(e) => handleProductChange(index, 'unitPrice', e.target.value)} className="input" required />
              <input type="number" disabled value={item.total.toFixed(2)} className="input bg-gray-100" />
              <button type="button" onClick={() => removeProduct(index)} className="text-red-600">❌</button>
            </div>
          ))}
          <button type="button" onClick={addProduct} className="text-sm text-[#2c5f6f] underline">+ Add Item</button>
        </div>

        {/* Payment Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="number" name="discount" placeholder="Discount ₹" value={form.discount} onChange={handleChange} className="input" />
          <input type="number" name="taxRate" placeholder="Tax Rate %" value={form.taxRate} onChange={handleChange} className="input" />
          <select name="paymentStatus" value={form.paymentStatus} onChange={handleChange} className="input">
            <option>Draft</option>
            <option>Sent</option>
            <option>Paid</option>
            <option>Overdue</option>
          </select>
        </div>

        <textarea name="notes" placeholder="Invoice Notes" value={form.notes} onChange={handleChange} className="input" />

        {/* Totals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="number" value={form.subtotal.toFixed(2)} disabled className="input bg-gray-100" placeholder="Subtotal" />
          <input type="number" value={form.taxAmount.toFixed(2)} disabled className="input bg-gray-100" placeholder="Tax Amount" />
          <input type="number" value={form.totalAmount.toFixed(2)} disabled className="input bg-gray-100 font-bold" placeholder="Total" />
        </div>

        {/* Submit */}
        <div className="text-right">
          <button type="submit" className="bg-[#2c5f6f] text-white py-2 px-6 rounded shadow-md">
            ➕ Submit Invoice
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoicePage;
