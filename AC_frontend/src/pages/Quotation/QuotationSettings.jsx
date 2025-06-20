import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuotationSettings = () => {
  const [settings, setSettings] = useState({
    defaultPaymentTerms: '',
    defaultDeliveryTerms: '',
    defaultTaxRate: '',
    footerNote: '',
    templateName: '',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('/api/quotations/settings');
        if (data) setSettings(data);
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put('/api/quotations/settings', settings);
      alert('Settings saved successfully!');
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('Failed to save settings.');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Quotation Settings</h2>

      <div className="space-y-4">
        <div>
          <label className="block font-medium">Default Payment Terms</label>
          <input
            type="text"
            name="defaultPaymentTerms"
            value={settings.defaultPaymentTerms}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="e.g. Net 30 days"
          />
        </div>

        <div>
          <label className="block font-medium">Default Delivery Terms</label>
          <input
            type="text"
            name="defaultDeliveryTerms"
            value={settings.defaultDeliveryTerms}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="e.g. Delivery within 5 working days"
          />
        </div>

        <div>
          <label className="block font-medium">Default Tax Rate (%)</label>
          <input
            type="number"
            name="defaultTaxRate"
            value={settings.defaultTaxRate}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="e.g. 18"
          />
        </div>

        <div>
          <label className="block font-medium">Quotation Template Name</label>
          <input
            type="text"
            name="templateName"
            value={settings.templateName}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="e.g. Modern Layout A"
          />
        </div>

        <div>
          <label className="block font-medium">Footer Note / Disclaimer</label>
          <textarea
            name="footerNote"
            value={settings.footerNote}
            onChange={handleChange}
            rows={4}
            className="w-full border px-3 py-2 rounded"
            placeholder="e.g. This quotation is valid for 15 days..."
          />
        </div>

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded mt-4"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default QuotationSettings;
