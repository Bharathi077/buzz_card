import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';

const Login = () => {
  const [email, setEmail] = useState('sudha@smartificia.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to log in. Please check your credentials.');
    }
    setLoading(false);
  };

  return (
    <AuthLayout title="Sign in to your account">
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && <p className="text-center text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email address
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full appearance-none rounded-md border border-slate-300 px-3 py-2 placeholder-slate-400 shadow-sm focus:border-brand-purple focus:outline-none focus:ring-brand-purple sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">
            Password
          </label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full appearance-none rounded-md border border-slate-300 px-3 py-2 placeholder-slate-400 shadow-sm focus:border-brand-purple focus:outline-none focus:ring-brand-purple sm:text-sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <Link to="/forgot-password" className="font-medium text-brand-purple hover:text-opacity-80">
              Forgot your password?
            </Link>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-md border border-transparent bg-brand-purple py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 disabled:bg-slate-400"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">
        Not a member?{' '}
        <Link to="/signup" className="font-medium text-brand-purple hover:text-opacity-80">
          Sign up now
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
