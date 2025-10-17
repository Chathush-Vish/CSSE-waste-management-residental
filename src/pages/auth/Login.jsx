import { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Mock authentication logic with hardcoded credentials
    const validCredentials = {
      user: 'password',
      admin: 'password'
    };

    if (!credentials.username || !credentials.password) {
      setError('Please enter both username and password');
      return;
    }

    // Check if credentials match the expected format
    if (validCredentials[credentials.username] === credentials.password) {
      const userData = {
        id: credentials.username === 'admin' ? 'admin-1' : 'user-1',
        username: credentials.username,
        type: credentials.username === 'admin' ? 'admin' : 'user',
        coinBalance: credentials.username === 'admin' ? 0 : 100 // Users start with 100 coins
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      onLogin(userData);
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-600">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Waste Management</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Username Field */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Username"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p className="font-medium mb-2">Demo Credentials:</p>
          <div className="space-y-1">
            <p><span className="font-medium">User:</span> username: <code className="bg-gray-100 px-1 rounded">user</code> password: <code className="bg-gray-100 px-1 rounded">password</code></p>
            <p><span className="font-medium">Admin:</span> username: <code className="bg-gray-100 px-1 rounded">admin</code> password: <code className="bg-gray-100 px-1 rounded">password</code></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
