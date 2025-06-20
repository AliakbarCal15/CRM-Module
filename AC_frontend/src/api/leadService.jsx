import axios from 'axios';

const API_URL = '/api/leads';

 // backend URL

// Create a new lead
export const createLead = (leadData) => {
  return axios.post(API_URL, leadData);
};

// Get all leads
export const getLeads = () => {
  return axios.get(API_URL);
};

// Get single lead by ID
export const getLeadById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

// Update a lead
export const updateLead = (id, leadData) => {
  return axios.put(`${API_URL}/${id}`, leadData);
};

// Delete a lead
export const deleteLead = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
