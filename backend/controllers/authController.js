import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, firstName, lastName, username, email, password, role, facultyRole, phoneNumber, university, department, branch, course, year, section, studentId, facultyId, studentSection, assignedSection, counsellorId } = req.body;

    // Log request data for debugging
    console.log('Register request data:', req.body);

    // Validate required fields
    if (!name || !username || !email || !password || !role) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    // Check if user exists by email or username
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      if (userExists.email === email) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      if (userExists.username === username) {
        return res.status(400).json({ message: 'Username already exists' });
      }
    }

    // Validate student-specific fields
    if (role === 'student') {
      if (!studentId) {
        return res.status(400).json({ message: 'Student ID is required for students' });
      }
      if (!branch || !course || !year || !studentSection || !department) {
        return res.status(400).json({ message: 'All student fields are required' });
      }
      if (studentSection < 1 || studentSection > 20) {
        return res.status(400).json({ message: 'Section must be between 1 and 20' });
      }
    }

    // Validate counsellor-specific fields
    if (role === 'counsellor') {
      if (!counsellorId) {
        return res.status(400).json({ message: 'Counsellor ID is required for counsellor' });
      }
      if (!branch || !course || !department || !assignedSection) {
        return res.status(400).json({ message: 'All counsellor fields are required' });
      }
      if (!counsellorRole) {
        return res.status(400).json({ message: 'Counsellor role is required' });
      }
      if (assignedSection < 1 || assignedSection > 20) {
        return res.status(400).json({ message: 'Assigned section must be between 1 and 20' });
      }
      // Counsellor email must end with @vignan.ac.in
      if (!email.endsWith('@vignan.ac.in')) {
        return res.status(400).json({ message: 'Counsellor email must end with @vignan.ac.in' });
      }
    }

    // Create user with auto-verified email (no email verification required)
    const user = await User.create({
      name,
      firstName,
      lastName,
      username,
      email,
      password,
      role,
      counsellorRole: role === 'counsellor' ? counsellorRole : undefined,
      phoneNumber,
      university: university || 'VFSTR',
      department,
      branch,
      course,
      year: role === 'student' ? year : undefined,
      studentSection: role === 'student' ? studentSection : undefined,
      assignedSection: role === 'counsellor' ? assignedSection : undefined,
      studentId: role === 'student' ? studentId : undefined,
      counsellorId: role === 'counsellor' ? counsellorId : undefined,
      isEmailVerified: true, // Auto-verify - no email verification required
    });

    if (user) {
      const token = generateToken(user._id);
      console.log('User registered successfully:', user._id);
      
      res.status(201).json({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        department: user.department,
        branch: user.branch,
        year: user.year,
        studentSection: user.studentSection,
        assignedSection: user.assignedSection,
        studentId: user.studentId,
        token: token,
        message: 'Registration successful!',
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    // Log request data for debugging
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Request body:', req.body);
    console.log('emailOrUsername:', emailOrUsername);
    console.log('password received:', password ? 'YES' : 'NO');

    // Validate required fields
    if (!emailOrUsername || !password) {
      console.log('Validation failed: Missing emailOrUsername or password');
      return res.status(400).json({ message: 'Please provide email/username and password' });
    }

    // Find user by email OR username
    console.log('Searching for user with:', emailOrUsername);
    const user = await User.findOne({
      $or: [
        { email: emailOrUsername.toLowerCase() },
        { username: emailOrUsername.toLowerCase() }
      ]
    });

    if (!user) {
      console.log('User not found for email/username:', emailOrUsername);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('User found:', user.email, '| Username:', user.username);

    // Check password - no email verification required
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      console.log('Invalid password for user:', emailOrUsername);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token and login directly
    const token = generateToken(user._id);
    console.log('✅ User logged in successfully:', user._id);
    
    res.json({
      _id: user._id,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      role: user.role,
      facultyRole: user.facultyRole,
      phoneNumber: user.phoneNumber,
      university: user.university,
      department: user.department,
      branch: user.branch,
      course: user.course,
      year: user.year,
      section: user.section,
      studentId: user.studentId,
      facultyId: user.facultyId,
      token: token,
    });
  } catch (error) {
    console.error('❌ Error logging in user:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    console.log('Profile request for user:', req.user._id);
    
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Forgot password - Send reset OTP
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Please provide email address' });
    }
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }
    
    // For development, bypass OTP and allow immediate password reset
    res.json({ 
      message: 'Password reset link sent to your email successfully!',
      email: email,
      canResetPassword: true
    });
  } catch (error) {
    console.error('Error processing password reset:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    
    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Please provide email and new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    
    // Find user by email (bypassing OTP verification for development)
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }
    
    // Update password
    user.password = newPassword; // Will be hashed by pre-save hook
    await user.save();
    
    res.json({ message: 'Password reset successfully! You can now login with your new password.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  getUserProfile,
  forgotPassword,
  resetPassword
};