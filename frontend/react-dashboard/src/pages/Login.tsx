import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dice5, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="bg-white rounded-3xl border-3 border-charcoal-900 shadow-playful-lg p-12">
          {/* logo */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <Dice5 size={50} className="text-coral-400" />
            <span className="font-display text-3xl font-bold text-charcoal-900">GameNight</span>
          </div>

          <h1 className="font-display text-3xl font-bold text-center mb-3">Welcome back!</h1>
          <p className="text-charcoal-700 text-lg text-center mb-10">Sign in to your account</p>

          {error && (
            <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block font-display font-bold text-lg text-charcoal-900 mb-3">Email</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-charcoal-700" size={24} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-5 py-4 text-lg rounded-xl border-3 border-charcoal-900 focus:outline-none focus:ring-2 focus:ring-coral-400"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-display font-bold text-lg text-charcoal-900 mb-3">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-charcoal-700" size={24} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-5 py-4 text-lg rounded-xl border-3 border-charcoal-900 focus:outline-none focus:ring-2 focus:ring-coral-400"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full py-4 text-lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <p className="text-center mt-6 text-charcoal-700">
            Don't have an account?{' '}
            <Link to="/register" className="text-coral-500 font-bold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
