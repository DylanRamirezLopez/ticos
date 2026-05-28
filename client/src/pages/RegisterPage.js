import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' });
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.username, form.email, form.password, remember);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const isValid = form.name && form.username && form.email && form.password.length >= 6;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-900/20 dark:via-ticos-dark-bg dark:to-blue-900/20 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="bg-white dark:bg-ticos-dark-card rounded-2xl shadow-ticos-lg dark:shadow-none p-8">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-ticos-primary dark:text-ticos-dark-primary select-none">
              TICOS
            </h1>
            <p className="text-ticos-secondary dark:text-ticos-dark-secondary mt-2 text-sm">
              Sign up to see photos from your friends
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-red-50 dark:bg-red-900/20 text-ticos-like-red p-3 rounded-xl mb-4 text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input label="Full Name" type="text" name="name" value={form.name} onChange={handleChange} required />
            <Input label="Username" type="text" name="username" value={form.username} onChange={handleChange} required />
            <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} required />
            <Input label="Password" type="password" name="password" value={form.password} onChange={handleChange} minLength={6} required />

            <label className="flex items-center gap-2 cursor-pointer select-none mt-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-ticos-accent focus:ring-ticos-accent cursor-pointer"
              />
              <span className="text-sm text-ticos-secondary dark:text-ticos-dark-secondary">Remember me</span>
            </label>

            <Button type="submit" variant="primary" className="w-full mt-2" loading={loading} disabled={!isValid}>
              Sign Up
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-ticos-secondary dark:text-ticos-dark-secondary">
            Have an account?{' '}
            <Link to="/login" className="text-ticos-accent font-semibold hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
