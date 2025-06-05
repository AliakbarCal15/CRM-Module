import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const PurchasePage = () => {
  const [form, setForm] = useState({
    vendorName: '',
    vendorEmail: '',
    vendorPhone: '',
    vendorAddress: '',
    purchaseDate: '',
    deliveryDate: '',
    products: [{ productName: '', sku: '', quantity: 1, unitCost: 0, taxPercent: 0, total: 0 }],
    modeOfPayment: 'Cash',
    paymentTerms: '',
    paymentStatus: 'Pending',
    procurementOfficer: '',
    notes: '',
    discount: 0,
    taxSummary: '',
    subtotal: 0,
    grandTotal: 0,
    status: 'Draft',
    deliveryPartner: '',
    followUpReminder: '',
  });

  // 🔁 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🧾 Handle product item change
  const handleProductChange = (index, field, value) => {
    const updated = [...form.products];
    updated[index][field] = field.includes('quantity') || field.includes('unitCost') || field.includes('taxPercent')
      ? Number(value)
      : value;

    updated[index].total = (
      updated[index].quantity * updated[index].unitCost * (1 + updated[index].taxPercent / 100)
    ).toFixed(2);

    setForm((prev) => ({
      ...prev,
      products: updated,
      subtotal: calcSubtotal(updated),
      grandTotal: calcGrandTotal(updated, form.discount),
    }));
  };

  // ➕ Add/Remove Product Rows
  const addProduct = () => setForm((prev) => ({
    ...prev,
    products: [...prev.products, { productName: '', sku: '', quantity: 1, unitCost: 0, taxPercent: 0, total: 0 }],
  }));
  const removeProduct = (index) => setForm((prev) => {
    const updated = [...prev.products];
    updated.splice(index, 1);
    return { ...prev, products: updated };
  });

  // 🧠 Totals Calculations
  const calcSubtotal = (items) =>
    items.reduce((acc, item) => acc + Number(item.total), 0).toFixed(2);

  const calcGrandTotal = (items, discount) => {
    const subtotal = calcSubtotal(items);
    const grand = subtotal - Number(discount || 0);
    return grand > 0 ? grand.toFixed(2) : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/purchases', form);
      toast.success('Purchase Order Submitted!');
      setForm({
        vendorName: '',
        vendorEmail: '',
        vendorPhone: '',
        vendorAddress: '',
        purchaseDate: '',
        deliveryDate: '',
        products: [{ productName: '', sku: '', quantity: 1, unitCost: 0, taxPercent: 0, total: 0 }],
        modeOfPayment: 'Cash',
        paymentTerms: '',
        paymentStatus: 'Pending',
        procurementOfficer: '',
        notes: '',
        discount: 0,
        taxSummary: '',
        subtotal: 0,
        grandTotal: 0,
        status: 'Draft',
        deliveryPartner: '',
        followUpReminder: '',
      });
    } catch (err) {
      toast.error('Error submitting purchase order');
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h2 className="text-2xl font-bold text-[#2c5f6f] mb-6">Purchase Entry Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Basic Vendor Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="vendorName" required placeholder="Vendor Name" value={form.vendorName} onChange={handleChange} className="input" />
          <input type="email" name="vendorEmail" placeholder="Vendor Email" value={form.vendorEmail} onChange={handleChange} className="input" />
          <input type="text" name="vendorPhone" placeholder="Vendor Phone" value={form.vendorPhone} onChange={handleChange} className="input" />
          <input type="text" name="vendorAddress" placeholder="Vendor Address" value={form.vendorAddress} onChange={handleChange} className="input" />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="date" name="purchaseDate" required value={form.purchaseDate} onChange={handleChange} className="input" />
          <input type="date" name="deliveryDate" value={form.deliveryDate} onChange={handleChange} className="input" />
        </div>

        {/* Product List */}
        <div>
          <h3 className="font-semibold mb-2">Product/Material List</h3>
          {form.products.map((item, index) => (
            <div key={index} className="grid grid-cols-6 gap-2 mb-2">
              <input type="text" placeholder="Product Name" value={item.productName} onChange={(e) => handleProductChange(index, 'productName', e.target.value)} className="input col-span-2" required />
              <input type="text" placeholder="SKU" value={item.sku} onChange={(e) => handleProductChange(index, 'sku', e.target.value)} className="input" />
              <input type="number" min="1" placeholder="Qty" value={item.quantity} onChange={(e) => handleProductChange(index, 'quantity', e.target.value)} className="input" required />
              <input type="number" placeholder="Cost" value={item.unitCost} onChange={(e) => handleProductChange(index, 'unitCost', e.target.value)} className="input" required />
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
            <option>Credit</option>
            <option>Bank Transfer</option>
          </select>
          <input type="text" name="paymentTerms" placeholder="Payment Terms" value={form.paymentTerms} onChange={handleChange} className="input" />
          <select name="paymentStatus" value={form.paymentStatus} onChange={handleChange} className="input">
            <option>Pending</option>
            <option>Paid</option>
            <option>Partial</option>
          </select>
        </div>

        {/* Misc */}
        <textarea name="notes" placeholder="Purchase Notes" value={form.notes} onChange={handleChange} className="input" />
        <input type="text" name="procurementOfficer" placeholder="Procurement Officer" value={form.procurementOfficer} onChange={handleChange} className="input" />
        <input type="text" name="deliveryPartner" placeholder="Delivery Partner" value={form.deliveryPartner} onChange={handleChange} className="input" />
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
            <option>Received</option>
            <option>Cancelled</option>
          </select>
          <button type="submit" className="bg-[#2c5f6f] text-white py-2 px-4 rounded">Submit Purchase</button>
        </div>
      </form>
    </div>
  );
};

export default PurchasePage;
