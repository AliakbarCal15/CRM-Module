import { useState } from 'react';
import axios from 'axios';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import logo from '../assets/logo.png';

const LoginPage = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onLoginSuccess();
      // Removed navigate('/dashboard') to prevent duplicate rendering
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <article className="w-full max-w-md bg-white p-8 rounded shadow-lg">
        <div className="flex flex-col items-center">
          <img src={logo} alt="Logo" className="h-14 mb-2" />
          <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        </div>

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email Address</label>
            <div className="flex items-center border rounded px-3 py-2 bg-white">
              <FiMail className="text-gray-400 mr-2" />
              <input
                type="email"
                placeholder="abc@gmail.com"
                className="w-full outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <div className="flex items-center border rounded px-3 py-2 bg-white">
              <FiLock className="text-gray-400 mr-2" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••"
                className="w-full outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-gray-400 focus:outline-none ml-2"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-700 hover:bg-teal-800 text-white py-2 rounded transition"
          >
            Log In
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Don’t have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-blue-600 font-semibold hover:underline"
          >
            Register here
          </button>
        </p>
      </article>
    </div>
  );
};

export default LoginPage;