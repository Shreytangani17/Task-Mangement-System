const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ── In-memory user cache ─────────────────────────────────────────────────────
// Avoids a MongoDB Atlas round-trip (200-400ms) on every authenticated request.
// Cache entries expire after 5 minutes.
const userCache = new Map(); // { userId: { user, expiresAt } }
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getCachedUser = (id) => {
  const entry = userCache.get(id);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    userCache.delete(id);
    return null;
  }
  return entry.user;
};

const setCachedUser = (id, user) => {
  userCache.set(id, { user, expiresAt: Date.now() + CACHE_TTL });
};

// Clear a specific user from cache (call this on role/password changes)
exports.clearUserCache = (id) => userCache.delete(String(id));

// ── Auth middleware ──────────────────────────────────────────────────────────
exports.auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error('No token');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = String(decoded.id);

    // Try cache first — skips one Atlas round-trip
    let user = getCachedUser(userId);
    if (!user) {
      user = await User.findById(userId).lean();
      if (!user) throw new Error('User not found');
      setCachedUser(userId, user);
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin only.' });
  }
  next();
};
