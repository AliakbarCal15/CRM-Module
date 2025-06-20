import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    leadOwnerName: { type: String },
    companyName: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String },
    title: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    fax: { type: String },
    leadSource: { type: String },
    status: { type: String },
    industry: { type: String },
    numberOfEmployees: { type: Number },
    annualRevenue: { type: String },
    rating: { type: String },
    teamId: { type: String },
    secondaryEmail: { type: String },
    twitter: { type: String },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String },
    description: { type: String },

    // ✅ Additions for CRM 2.0 style
    notes: {
      type: String,
      default: '',
    },
    attachments: [
      {
        fileName: String,
        fileUrl: String,
      },
    ],
    socialLinks: {
      twitter: String,
      facebook: String,
      email: String,
    },
    invitedMeeting: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Lead', leadSchema);
