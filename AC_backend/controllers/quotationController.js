import Quotation from '../models/Quotation.js';
import mongoose from 'mongoose';

// Improved Quotation ID Generator (safe even with deleted records)
const generateQuotationId = async () => {
  const lastQuotation = await Quotation.findOne().sort({ createdAt: -1 });
  let lastId = 0;

  if (lastQuotation?.quotationId) {
    const match = lastQuotation.quotationId.match(/QTN-(\d+)/);
    if (match) {
      lastId = parseInt(match[1], 10);
    }
  }

  return `QTN-${String(lastId + 1).padStart(4, '0')}`;
};

// Create new quotation
export const createQuotation = async (req, res) => {
  try {
    const {
      customer,
      validUntil,
      currency,
      salesRep,
      items,
      terms,
      attachments,
      totals
    } = req.body;

    if (!customer || !salesRep || !items || !totals || !req.user?._id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const quotationId = await generateQuotationId();

    const newQuotation = new Quotation({
      customer,
      validUntil,
      currency,
      salesRep: new mongoose.Types.ObjectId(salesRep),
      items,
      terms,
      attachments,
      totals,
      quotationId,
      createdBy: req.user._id,
      activityLog: [
        {
          action: 'Created',
          user: req.user._id,
          comment: 'Quotation created.',
          timestamp: new Date()
        }
      ]
    });

    await newQuotation.save();
    res.status(201).json(newQuotation);
  } catch (err) {
    console.error('Quotation creation failed:', err);
    res.status(500).json({ error: 'Failed to create quotation', details: err.message });
  }
};

// Get all quotations
export const getAllQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find().sort({ createdAt: -1 });
    res.json(quotations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch quotations' });
  }
};

// Get a quotation by ID
export const getQuotationById = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation) return res.status(404).json({ error: 'Quotation not found' });
    res.json(quotation);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch quotation' });
  }
};

// Update a quotation with versioning
export const updateQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const quotation = await Quotation.findById(id);
    if (!quotation) return res.status(404).json({ error: 'Quotation not found' });

    // Store the current state as a new version (deep copied)
    quotation.versions.push({
      versionNumber: quotation.versions.length + 1,
      items: JSON.parse(JSON.stringify(quotation.items)),
      totals: JSON.parse(JSON.stringify(quotation.totals)),
      notes: req.body.versionNote || 'Edited quotation',
      updatedAt: new Date()
    });

    // Apply updated fields
    Object.assign(quotation, req.body);

    // Add to activity log
    quotation.activityLog.push({
      action: 'Updated',
      user: req.user?._id || null,
      comment: req.body.versionNote || 'Quotation updated',
      timestamp: new Date()
    });

    await quotation.save();
    res.json(quotation);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update quotation', details: err.message });
  }
};

// Delete a quotation
export const deleteQuotation = async (req, res) => {
  try {
    const deleted = await Quotation.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Quotation not found' });
    res.json({ message: 'Quotation deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete quotation' });
  }
};



// ==============================
// ✅ VERSION CONTROL ENDPOINTS
// ==============================

// Get all versions of a quotation
export const getQuotationVersions = async (req, res) => {
  try {
    const { id } = req.params;
    const quotation = await Quotation.findById(id);
    if (!quotation) return res.status(404).json({ error: 'Quotation not found' });

    res.json(quotation.versions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch versions', details: err.message });
  }
};

// Get a specific version by version number
export const getQuotationVersionByNumber = async (req, res) => {
  try {
    const { id, versionNumber } = req.params;
    const quotation = await Quotation.findById(id);
    if (!quotation) return res.status(404).json({ error: 'Quotation not found' });

    const version = quotation.versions.find(
      (v) => v.versionNumber === parseInt(versionNumber)
    );

    if (!version) return res.status(404).json({ error: 'Version not found' });

    res.json(version);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch version', details: err.message });
  }
};

// Restore a quotation to a specific version
export const restoreQuotationVersion = async (req, res) => {
  try {
    const { id, versionNumber } = req.params;
    const quotation = await Quotation.findById(id);
    if (!quotation) return res.status(404).json({ error: 'Quotation not found' });

    const version = quotation.versions.find(
      (v) => v.versionNumber === parseInt(versionNumber)
    );
    if (!version) return res.status(404).json({ error: 'Version not found' });

    // Backup current state as new version
    quotation.versions.push({
      versionNumber: quotation.versions.length + 1,
      items: JSON.parse(JSON.stringify(quotation.items)),
      totals: JSON.parse(JSON.stringify(quotation.totals)),
      notes: 'Auto-saved before restore',
      updatedAt: new Date()
    });

    // Restore fields
    quotation.items = version.items;
    quotation.totals = version.totals;

    quotation.activityLog.push({
      action: 'Restored',
      user: req.user?._id || null,
      comment: `Restored to version ${versionNumber}`,
      timestamp: new Date()
    });

    await quotation.save();
    res.json({ message: `Restored to version ${versionNumber}`, quotation });
  } catch (err) {
    res.status(500).json({ error: 'Failed to restore version', details: err.message });
  }
};
