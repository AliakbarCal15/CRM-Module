import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const ADMIN_SECRET_CODE = process.env.ADMIN_SECRET_CODE || 'supersecureadmin2025';

export const register = async (req, res) => {
  try {
    let {
      firstName,
      middleName,
      lastName,
      phoneNumber,
      email,
      password,
      confirmPassword,
      role,            // accept role from frontend
      adminSecretCode, // accept secret code from frontend
    } = req.body;

    console.log('Register request body:', req.body);

    // Trim inputs
    firstName = firstName?.trim();
    middleName = middleName?.trim();
    lastName = lastName?.trim();
    phoneNumber = phoneNumber?.trim();
    email = email?.trim().toLowerCase();
    role = role?.trim().toLowerCase();

    console.log('Trimmed values:', {
      firstName,
      middleName,
      lastName,
      phoneNumber,
      email,
      role,
      adminSecretCode,
    });

    if (!firstName || !lastName || !phoneNumber || !email || !password || !confirmPassword) {
      console.log('Missing required fields');
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    if (password !== confirmPassword) {
      console.log('Passwords do not match');
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (role === 'admin') {
      console.log('Role is admin, checking admin secret code');
      if (!adminSecretCode) {
        console.log('Admin secret code missing');
        return res.status(400).json({ message: 'Admin secret code is required for admin registration' });
      }
      if (adminSecretCode !== ADMIN_SECRET_CODE) {
        console.log('Invalid admin secret code:', adminSecretCode, 'Expected:', ADMIN_SECRET_CODE);
        return res.status(403).json({ message: 'Invalid admin secret code' });
      }
    } else {
      role = 'user'; // fallback to user if not admin
      console.log('Role is user or unspecified, setting role to user');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Email already registered:', email);
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      middleName,
      lastName,
      phoneNumber,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    console.log('User registered successfully:', email);

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};




export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email?.trim().toLowerCase();
    console.log('Login attempt:', email);

    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Incorrect password for:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Login successful:', email);
    return res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
