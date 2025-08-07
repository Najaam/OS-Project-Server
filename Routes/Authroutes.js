// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../Models/UserSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const secretKey = crypto.randomBytes(32).toString('hex');
const {sendWelcomeEmail,sendOtpEmail} = require("../Helpers/mailing")


router.get('/',(req, res)=>{
  res.status(200).json("This is auth route")
})
router.post('/newuser', async (req, res) => {
try {
const { username, email, password } = req.body;
if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required' });
  }
const hashedPassword = await bcrypt.hash(password, 10);
const user = new User({ username, email,password: hashedPassword });
await user.save();
try {
  await sendWelcomeEmail(username, email);
  console.log("Welcome email sent to", email);
} catch (error) {
  console.error("Error sending welcome email:", error);
  // Handle the error without interrupting the registration process
}
res.status(201).json({ 
  message: 'User registered successfully'
 });
} catch (error) {
res.status(500).json({ error: 'Registration failed -> '+error });
}
});

// User login
router.post('/existinguser', async (req, res) => {
  
try {
const { username, password } = req.body;
const user = await User.findOne({ username });
if (!user) {
return res.status(401).json({ error: 'Authentication failed' });
}
const passwordMatch = await bcrypt.compare(password, user.password);
if (!passwordMatch) {
return res.status(401).json({ error: 'Authentication failed' });
}
const token = jwt.sign({ userId: user._id }, secretKey, {
expiresIn: '1h',
});
console.log(secretKey);
res.status(200).json({ token });
} catch (error) {
res.status(500).json({ error: 'Login failed' });
}
});
router.get('/users', async (req, res) => {
  try {
    // Retrieve all users from the database
    const users = await User.find();

    // Exclude sensitive information like passwords
    const sanitizedUsers = users.map(user => ({
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    }));

    // Send response with all users
    res.status(200).json(sanitizedUsers);
  } catch (error) {
     console.error("Error fetching users:", error); 
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Generate OTP
const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString(); // Generate a random 6-digit OTP
};

// Send OTP API endpoint
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate OTP for resetting password
    const otp = generateOtp();
    user.otp = otp;  // Save OTP to the user's document temporarily
    await user.save();

    // Send OTP via email
    try {
      await sendOtpEmail(email, otp);  // Assuming sendOtpEmail is defined elsewhere
      res.status(200).json({ message: 'OTP sent to your email' });
    } catch (error) {
      console.error("Error sending OTP:", error);
      res.status(500).json({ error: 'Error sending OTP' });
    }
  } catch (error) {
    console.error('Error during forgot password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify OTP and reset password
router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ error: 'Email, OTP, and new password are required' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the OTP matches
    if (user.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedNewPassword;
    user.otp = null;  // Clear OTP after password reset
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;