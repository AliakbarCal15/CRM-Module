// ...unchanged imports
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateQuotation = () => {
  const navigate = useNavigate();

  const [salesReps, setSalesReps] = useState([]);
  const [loadingSalesReps, setLoadingSalesReps] = useState(true);

  const [form, setForm] = useState({
    customer: {
      name: '',
      contact: '',
      email: '',
      billingAddress: '',
    },
    validUntil: '',
    currency: 'USD',
    salesRep: '',
    items: [{
      productName: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      tax: 0,
      subtotal: 0,
    }],
    terms: {
      payment: '',
      delivery: '',
      additionalNotes: '',
    },
    attachments: [],
  });

  useEffect(() => {
    const fetchSalesReps = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users/sales-reps', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSalesReps(response.data);
      } catch (err) {
        console.error('Error fetching sales reps:', err);
        setSalesReps([]);
      } finally {
        setLoadingSalesReps(false);
      }
    };

    fetchSalesReps();
  }, []);

  const handleItemChange = (index, field, value) => {
    const items = [...form.items];
    items[index][field] = value;

    const qty = parseFloat(items[index].quantity) || 0;
    const price = parseFloat(items[index].unitPrice) || 0;
    const discount = parseFloat(items[index].discount) || 0;
    const tax = parseFloat(items[index].tax) || 0;

    const subtotal = qty * price * (1 - discount / 100) * (1 + tax / 100);
    items[index].subtotal = parseFloat(subtotal.toFixed(2));

    setForm({ ...form, items });
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [
        ...form.items,
        {
          productName: '',
          description: '',
          quantity: 1,
          unitPrice: 0,
          discount: 0,
          tax: 0,
          subtotal: 0,
        }
      ]
    });
  };

  const removeItem = (index) => {
    const items = [...form.items];
    items.splice(index, 1);
    setForm({ ...form, items });
  };

  const calculateTotals = () => {
    const totalBeforeTax = form.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    const taxAmount = form.items.reduce((acc, item) => acc + ((item.quantity * item.unitPrice) * (item.tax / 100)), 0);
    const grandTotal = form.items.reduce((acc, item) => acc + item.subtotal, 0);

    return {
      totalBeforeTax: totalBeforeTax.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const totals = calculateTotals();

      if (!form.salesRep) {
        alert('Please select a Sales Representative');
        return;
      }

      const payload = {
        ...form,
        totals,
      };

      const token = localStorage.getItem('token');

      await axios.post('http://localhost:5000/api/quotations', payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Quotation created!');
      navigate('/quotations');
    } catch (error) {
      console.error('Error creating quotation:', error);
      alert('Failed to create quotation');
    }
  };

  const { totalBeforeTax, taxAmount, grandTotal } = calculateTotals();

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Create Quotation</h2>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Customer Info */}
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Customer Name" value={form.customer.name}
            onChange={(e) => setForm({ ...form, customer: { ...form.customer, name: e.target.value } })} required />
          <input type="text" placeholder="Contact" value={form.customer.contact}
            onChange={(e) => setForm({ ...form, customer: { ...form.customer, contact: e.target.value } })} />
          <input type="email" placeholder="Email" value={form.customer.email}
            onChange={(e) => setForm({ ...form, customer: { ...form.customer, email: e.target.value } })} />
          <input type="text" placeholder="Billing Address" value={form.customer.billingAddress}
            onChange={(e) => setForm({ ...form, customer: { ...form.customer, billingAddress: e.target.value } })} />
        </div>

        {/* Validity */}
        <input type="date" value={form.validUntil}
          onChange={(e) => setForm({ ...form, validUntil: e.target.value })} required />

        {/* Sales Rep Dropdown */}
        <div>
          <label className="block mb-1 font-medium">Sales Representative</label>
          <select
            value={form.salesRep}
            onChange={(e) => setForm({ ...form, salesRep: e.target.value })}
            required
            className="border px-2 py-1 rounded w-full"
          >
            <option value="">-- Select --</option>
            {loadingSalesReps ? (
              <option disabled>Loading...</option>
            ) : (
              salesReps.map(rep => (
                <option key={rep._id} value={rep._id}>
                  {rep.firstName} {rep.lastName}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Items */}
        <div>
          <h3 className="font-medium mb-2">Items</h3>
          {form.items.map((item, index) => (
            <div key={index} className="grid grid-cols-7 gap-2 mb-2">
              <input type="text" placeholder="Product" value={item.productName}
                onChange={(e) => handleItemChange(index, 'productName', e.target.value)} />
              <input type="number" placeholder="Qty" value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} />
              <input type="number" placeholder="Unit Price" value={item.unitPrice}
                onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)} />
              <input type="number" placeholder="Discount %" value={item.discount}
                onChange={(e) => handleItemChange(index, 'discount', e.target.value)} />
              <input type="number" placeholder="Tax %" value={item.tax}
                onChange={(e) => handleItemChange(index, 'tax', e.target.value)} />
              <input type="text" value={`₹ ${item.subtotal}`} readOnly />
              <button type="button" onClick={() => removeItem(index)}>❌</button>
            </div>
          ))}
          <button type="button" onClick={addItem} className="mt-2 text-blue-600">+ Add Item</button>
        </div>

        {/* Terms */}
        <textarea placeholder="Payment Terms" value={form.terms.payment}
          onChange={(e) => setForm({ ...form, terms: { ...form.terms, payment: e.target.value } })} />
        <textarea placeholder="Delivery Terms" value={form.terms.delivery}
          onChange={(e) => setForm({ ...form, terms: { ...form.terms, delivery: e.target.value } })} />
        <textarea placeholder="Additional Notes" value={form.terms.additionalNotes}
          onChange={(e) => setForm({ ...form, terms: { ...form.terms, additionalNotes: e.target.value } })} />

        {/* Totals */}
        <div>
          <p>Total Before Tax: ₹ {totalBeforeTax}</p>
          <p>Tax Amount: ₹ {taxAmount}</p>
          <p><strong>Grand Total: ₹ {grandTotal}</strong></p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={form.items.length === 0}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Save Quotation
        </button>
      </form>
    </div>
  );
};

export default CreateQuotation;
