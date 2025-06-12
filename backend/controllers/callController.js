// backend/controllers/callController.js

import Call from '../models/callModel.js';

// ✅ CREATE a Call (Schedule or Log)
export const createCall = async (req, res) => {
  try {
    const {
      leadId,
      formType,
      callType,
      callOwner,
      subject,
      callStartTime,
      reminder,
      callPurpose,
      callAgenda,
      outcome,
    } = req.body;

    // 🔍 Server-side validation (always double-check the client)
    if (!leadId || !formType || !callType || !callOwner || !subject) {
      return res.status(400).json({ message: 'Required fields missing.' });
    }

    if (formType === 'Log' && !outcome) {
      return res.status(400).json({ message: 'Outcome is required for Log Call.' });
    }

    // 🏗️ Create new call doc
    const newCall = new Call({
      leadId,
      formType,
      callType,
      callOwner,
      subject,
      callStartTime,
      reminder,
      callPurpose,
      callAgenda,
      outcome: formType === 'Log' ? outcome : undefined, // Only store if Log
    });

    await newCall.save();

    res.status(201).json({ message: `${formType} Call created successfully`, data: newCall });
  } catch (error) {
    console.error('❌ Error in createCall:', error.message);
    res.status(500).json({ message: 'Server error while saving call.' });
  }
};

// ✅ GET all Calls for a lead
export const getCallsByLead = async (req, res) => {
  try {
    const leadId = req.params.leadId;

    const calls = await Call.find({ leadId }).sort({ createdAt: -1 });

    res.status(200).json(calls);
  } catch (error) {
    console.error('❌ Error fetching calls:', error.message);
    res.status(500).json({ message: 'Failed to fetch call history.' });
  }
};
