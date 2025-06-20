import React, { useState } from 'react';
import axios from 'axios';

function RegisterPage({ onRegisterSuccess, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user', // default role
    adminSecretCode: '', // for admin verification
    termsAccepted: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (formData.role === 'admin' && !formData.adminSecretCode) {
      setErrorMsg("Admin secret code is required for admin role.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role,
        adminSecretCode: formData.role === 'admin' ? formData.adminSecretCode : undefined,
      });

      console.log('Registered:', response.data);
      onRegisterSuccess(); // e.g. redirect to login
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-4 py-12 bg-white md:px-8 md:w-full">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Sign Up</h1>
        </div>
        {errorMsg && <p className="text-red-600 text-sm text-center">{errorMsg}</p>}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* First, Middle, Last Name */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">First Name *</label>
              <input
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full rounded border px-3 py-2"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Middle Name</label>
              <input
                name="middleName"
                type="text"
                value={formData.middleName}
                onChange={handleChange}
                placeholder="Middle Name"
                className="w-full rounded border px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name *</label>
            <input
              name="lastName"
              type="text"
              required
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-full rounded border px-3 py-2"
            />
          </div>

          {/* Phone and Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number *</label>
            <input
              name="phoneNumber"
              type="tel"
              required
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+91 1234567890"
              className="w-full rounded border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email Address *</label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full rounded border px-3 py-2"
            />
          </div>

          {/* Role selection */}
          <div>
            <label className="block text-sm font-medium mb-1">Role *</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2"
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="salesrep">Sales Rep</option>
              

            </select>
          </div>

          {/* Admin secret code (only if role is admin) */}
          {formData.role === 'admin' && (
            <div>
              <label className="block text-sm font-medium mb-1">Admin Secret Code *</label>
              <input
                name="adminSecretCode"
                type="password"
                value={formData.adminSecretCode}
                onChange={handleChange}
                placeholder="Enter admin secret code"
                className="w-full rounded border px-3 py-2"
                required={formData.role === 'admin'}
              />
            </div>
          )}

          {/* Password and Confirm */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <label className="block text-sm font-medium mb-1">Password *</label>
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full rounded border px-3 py-2 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-8 right-3 text-gray-500"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            <div className="flex-1 relative">
              <label className="block text-sm font-medium mb-1">Confirm Password *</label>
              <input
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full rounded border px-3 py-2 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-8 right-3 text-gray-500"
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-center">
            <input
              name="termsAccepted"
              type="checkbox"
              checked={formData.termsAccepted}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600"
              required
            />
            <label className="ml-2 text-sm">
              I accept the <a href="#" className="text-blue-600 underline">Terms and Conditions</a>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !formData.termsAccepted}
            className={`w-full py-3 text-white font-semibold rounded ${
              formData.termsAccepted ? 'bg-blue-700 hover:bg-blue-800' : 'bg-gray-400'
            }`}
          >
            {loading ? 'Registering...' : 'REGISTER ACCOUNT'}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="text-blue-600 hover:underline">
            Sign In for SMarTea
          </button>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
