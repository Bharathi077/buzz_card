import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await forgotPassword(email);
      setMessage('Check your inbox for further instructions.');
    } catch (err: any) {
      setError(err.message || 'Failed to reset password.');
    }
    setLoading(false);
  };

  return (
    <AuthLayout title="Reset your password">
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && <p className="text-center text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}
        {message && <p className="text-center text-sm text-green-600 bg-green-50 p-3 rounded-md">{message}</p>}
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
          <button
            type="submit"
            disabled={loading || !!message}
            className="flex w-full justify-center rounded-md border border-transparent bg-brand-purple py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 disabled:bg-slate-400"
          >
            {loading ? 'Sending...' : 'Send Password Reset'}
          </button>
        </div>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">
        Remember your password?{' '}
        <Link to="/login" className="font-medium text-brand-purple hover:text-opacity-80">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default ForgotPassword;
