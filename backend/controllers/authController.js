const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ── In-memory login cache ────────────────────────────────────────────────────
// After first login the hash is stored here. Subsequent logins hit only
// bcrypt.compare + JWT sign (no DB round-trip). TTL: 30 minutes.
const loginCache = new Map(); // { email: { userId, hashedPassword, userObj, expiresAt } }
const LOGIN_CACHE_TTL = 30 * 60 * 1000; // 30 min

const BCRYPT_ROUNDS = 8; // 8 rounds = ~80ms (vs 10 rounds = ~300ms)

// ── Helper: detect if a hash was made with more than BCRYPT_ROUNDS ────────────
const needsRehash = (hash) => {
  try {
    const rounds = parseInt(hash.split('$')[3], 10);
    return rounds > BCRYPT_ROUNDS;
  } catch {
    return false;
  }
};

// ── Helper: rehash password in background (don't block the response) ─────────
const rehashInBackground = (userId, plainPassword) => {
  setImmediate(async () => {
    try {
      const newHash = await bcrypt.hash(plainPassword, BCRYPT_ROUNDS);
      await User.updateOne({ _id: userId }, { password: newHash });
      // Update cache so next login uses the fast hash immediately
      for (const [email, entry] of loginCache.entries()) {
        if (String(entry.userId) === String(userId)) {
          entry.hashedPassword = newHash;
        }
      }
    } catch (err) {
      // Non-critical — log and ignore
      console.error('Rehash error (non-fatal):', err.message);
    }
  });
};

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

    // ── Fast path: cache hit ──────────────────────────────────────────────────
    const cached = loginCache.get(email);
    if (cached && Date.now() < cached.expiresAt) {
      const isMatch = await bcrypt.compare(password, cached.hashedPassword);
      if (isMatch) {
        // If cached hash still has old rounds, rehash silently after responding
        if (needsRehash(cached.hashedPassword)) {
          rehashInBackground(cached.userId, password);
        }
        const token = jwt.sign({ id: cached.userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
        return res.json({ user: cached.userObj, token });
      }
      loginCache.delete(email); // Wrong password — clear cache
    }

    // ── Normal path: DB lookup ────────────────────────────────────────────────
    // Minimal projection — only fetch the fields we actually need
    const user = await User.findOne(
      { email },
      { name: 1, email: 1, role: 1, password: 1 }
    ).lean();

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // ── Respond immediately ───────────────────────────────────────────────────
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const userObj = { id: user._id, name: user.name, email: user.email, role: user.role };

    // Cache for next login (skips DB query)
    loginCache.set(email, {
      userId: user._id,
      hashedPassword: user.password,
      userObj,
      expiresAt: Date.now() + LOGIN_CACHE_TTL,
    });

    res.json({ user: userObj, token });

    // ── After response: silently upgrade old 10-round hashes to 8 rounds ─────
    // On next login the cache will use the new fast hash (~80ms vs ~300ms).
    if (needsRehash(user.password)) {
      rehashInBackground(user._id, password);
    }
  } catch (error) {
    res.status(500).json({ error: error.message || 'Login failed' });
  }
};
