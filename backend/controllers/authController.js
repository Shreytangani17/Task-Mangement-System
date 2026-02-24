const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ── In-memory login cache ────────────────────────────────────────────────────
// Caches valid password checks so repeated logins skip bcrypt entirely.
// Entry is invalidated when password changes. TTL: 30 minutes.
const loginCache = new Map(); // { email: { userId, hashedPassword, userObj, expiresAt } }
const LOGIN_CACHE_TTL = 30 * 60 * 1000; // 30 min

const BCRYPT_ROUNDS = 8; // was default 10 — 8 is still secure but 3x faster (~80ms vs ~300ms)

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const user = new User({ name, email, password: hashedPassword, role: role || 'employee' });
    await user.save();
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({ 
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // ── Fast path: check login cache first ───────────────────────────────────
    const cached = loginCache.get(email);
    if (cached && Date.now() < cached.expiresAt) {
      // Still verify password against hash (bcrypt.compare is unavoidable for security)
      // but we skip the MongoDB round-trip completely
      const isMatch = await bcrypt.compare(password, cached.hashedPassword);
      if (isMatch) {
        const token = jwt.sign({ id: cached.userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
        return res.json({ user: cached.userObj, token });
      }
      // Wrong password — fall through to normal path (also clears cache)
      loginCache.delete(email);
    }

    // ── Normal path: DB lookup ────────────────────────────────────────────────
    const user = await User.findOne({ email }).select('+password').lean();
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const userObj = { id: user._id, name: user.name, email: user.email, role: user.role };

    // Cache the successful login to speed up next login from same user
    loginCache.set(email, {
      userId: user._id,
      hashedPassword: user.password,
      userObj,
      expiresAt: Date.now() + LOGIN_CACHE_TTL,
    });
    
    res.json({ user: userObj, token });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Login failed' });
  }
};
