// src/controllers/auth.controller.js – Handles authentication request logic
import { getUserByEmail, createUser, getUserById } from '../services/auth.service.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { createUserToken } from '../utils/token.js';

/**
 * POST /api/auth/register
 *
 * Registration flow:
 *   1. Body has already been validated by Zod middleware in the route.
 *   2. Check if a user with this email already exists.
 *   3. Hash the password using bcrypt.
 *   4. Create the user in MongoDB.
 *   5. Return a safe user object (no password).
 */
export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    // Step 1: Check if email is already taken
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: `User with email ${email} already exists`,
      });
    }

    // Step 2: Hash password with bcrypt
    const hashedPassword = await hashPassword(password);

    // Step 3: Create user in database
    const user = await createUser(name, email, hashedPassword);

    // Step 4: Return safe user object 
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

// POST /api/auth/login
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Step 1: Check if user exists
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: `No account found with email ${email}`,
      });
    }

    // Step 2: Verify password using bcrypt compare
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password',
      });
    }

    // Step 3: Sign and return a JWT
    const token = createUserToken({ id: user._id });
    // Better response (same shape as register)
    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}


export async function getMe(req, res) {
  try {
    const user = await getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

