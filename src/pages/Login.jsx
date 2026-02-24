import { useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Lock, ArrowRight, Loader } from 'lucide-react';
import axios from 'axios';

// Derive health URL from the same env var used by the API
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const HEALTH_URL = BASE_URL.replace(/\/api$/, '/api/health');

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 'checking' | 'ready' | 'slow'
  const [serverStatus, setServerStatus] = useState('checking');

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Poll health endpoint until server responds, then stop
  const checkServer = useCallback(async () => {
    try {
      await axios.get(HEALTH_URL, { timeout: 4000 });
      setServerStatus('ready');
      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    let stopped = false;
    let attempts = 0;

    const poll = async () => {
      if (stopped) return;
      const ok = await checkServer();
      if (ok || stopped) return;

      attempts++;
      // After 8 attempts (~4s) mark as 'slow' but keep retrying
      if (attempts >= 8) setServerStatus('slow');

      // Retry every 500ms until ready
      setTimeout(poll, 500);
    };

    poll();
    return () => { stopped = true; };
  }, [checkServer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // If server isn't confirmed ready yet, wait up to 3s before proceeding
      if (serverStatus !== 'ready') {
        await Promise.race([
          checkServer(),
          new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 3000)),
        ]).catch(() => { }); // proceed anyway even if still warming up
      }
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/admin' : '/employee');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Login failed');
      setLoading(false);
    }
  };

  const statusDot = {
    checking: { color: 'bg-yellow-400 animate-pulse', text: 'Connecting to server…' },
    slow: { color: 'bg-orange-400 animate-pulse', text: 'Server starting up, almost ready…' },
    ready: { color: 'bg-green-500', text: 'Server ready' },
  }[serverStatus];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-800 mb-2">Sign In</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full" />
          <p className="text-sm text-gray-500 mt-4">Use: admin@gmail.com (password: 123)</p>


        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <User className="w-5 h-5 text-gray-400 group-focus-within:text-purple-600" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gmail.com"
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 disabled:opacity-60"
              required
              disabled={loading}
            />
          </div>

          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-purple-600" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="123"
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 disabled:opacity-60"
              required
              disabled={loading}
            />
          </div>

          <div className="text-right">
            <Link to="#" className="text-sm text-gray-400 hover:text-purple-600">
              Forgot password?
            </Link>
          </div>

          <div className="flex items-center justify-end gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-10 py-4 rounded-full font-medium hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-gray-500 mt-8">
          Don't have an account?{' '}
          <Link to="/signup" className="text-purple-600 font-semibold hover:text-pink-600">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
