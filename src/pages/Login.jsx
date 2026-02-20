import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/admin' : '/employee');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md relative z-10 animate-fadeIn">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-800 mb-2 animate-slideDown">Sign In</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full animate-expandWidth"></div>
          <p className="text-sm text-gray-500 mt-4">Use: admin@gmail.com (password: 123)</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6 animate-shake">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group animate-slideUp" style={{animationDelay: '0.1s'}}>
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 group-hover:scale-110">
              <User className="w-5 h-5 text-gray-400 group-hover:text-purple-500 group-focus-within:text-purple-600 transition-colors duration-300" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gmail.com"
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 hover:border-purple-300 hover:shadow-md"
              required
            />
          </div>
          
          <div className="relative group animate-slideUp" style={{animationDelay: '0.2s'}}>
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 group-hover:scale-110">
              <Lock className="w-5 h-5 text-gray-400 group-hover:text-purple-500 group-focus-within:text-purple-600 transition-colors duration-300" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="123"
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 hover:border-purple-300 hover:shadow-md"
              required
            />
          </div>

          <div className="text-right animate-slideUp" style={{animationDelay: '0.3s'}}>
            <Link to="#" className="text-sm text-gray-400 hover:text-purple-600 transition-colors duration-300">
              Forgot password?
            </Link>
          </div>
          
          <div className="flex items-center justify-end gap-4 animate-slideUp" style={{animationDelay: '0.4s'}}>
            <button
              type="submit"
              className="group relative flex items-center gap-3 bg-gradient-to-r from-purple-500 via-purple-600 to-pink-500 text-white px-10 py-4 rounded-full font-medium overflow-hidden transition-all duration-500 hover:shadow-2xl transform hover:scale-105 hover:from-pink-500 hover:via-purple-600 hover:to-purple-500"
            >
              <span className="relative z-10">Sign in</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>
          </div>
        </form>
        
        <p className="text-center text-gray-500 mt-8 animate-fadeIn" style={{animationDelay: '0.5s'}}>
          Don't have an account?{' '}
          <Link to="/signup" className="text-purple-600 font-semibold hover:text-pink-600 transition-colors duration-300">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
