// backend/models/callModel.js

import mongoose from 'mongoose';

const callSchema = new mongoose.Schema({
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: true,
  },
  formType: {
    type: String,
    enum: ['Schedule', 'Log'],
    required: true,
  },
  callType: {
    type: String,
    enum: ['Outbound', 'Inbound'],
    required: true,
  },
  callOwner: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  callStartTime: {
    type: Date,
    default: Date.now,
  },
  reminder: {
    type: Boolean,
    default: false,
  },
  callPurpose: {
    type: String,
  },
  callAgenda: {
    type: String,
  },
  outcome: {
    type: String, // Only for "Log" type
    required: function () {
      return this.formType === 'Log';
    },
  },
}, {
  timestamps: true
});

export default mongoose.model('Call', callSchema);
