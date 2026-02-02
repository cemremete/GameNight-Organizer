import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dice5, Mail, Lock, User, Globe, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

const TIMEZONES = [
  { id: 'UTC', name: 'UTC' },
  { id: 'America/New_York', name: 'Eastern Time (US)' },
  { id: 'America/Chicago', name: 'Central Time (US)' },
  { id: 'America/Denver', name: 'Mountain Time (US)' },
  { id: 'America/Los_Angeles', name: 'Pacific Time (US)' },
  { id: 'Europe/London', name: 'London' },
  { id: 'Europe/Paris', name: 'Paris' },
  { id: 'Europe/Berlin', name: 'Berlin' },
  { id: 'Asia/Tokyo', name: 'Tokyo' },
  { id: 'Asia/Singapore', name: 'Singapore' },
  { id: 'Australia/Sydney', name: 'Sydney' },
];

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    timezone: 'UTC',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await register(formData.email, formData.username, formData.password, formData.timezone);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

          <h1 className="font-display text-3xl font-bold text-center mb-3">Join the party! 🎉</h1>
          <p className="text-charcoal-700 text-lg text-center mb-10">Create your account</p>

          {error && (
            <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-display font-bold text-lg text-charcoal-900 mb-3">Email</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-charcoal-700" size={24} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="w-full pl-14 pr-5 py-4 text-lg rounded-xl border-3 border-charcoal-900 focus:outline-none focus:ring-2 focus:ring-coral-400"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-display font-bold text-lg text-charcoal-900 mb-3">Username</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-charcoal-700" size={24} />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => updateField('username', e.target.value)}
                  className="w-full pl-14 pr-5 py-4 text-lg rounded-xl border-3 border-charcoal-900 focus:outline-none focus:ring-2 focus:ring-coral-400"
                  placeholder="gamer123"
                  required
                  minLength={3}
                />
              </div>
            </div>

            <div>
              <label className="block font-display font-bold text-lg text-charcoal-900 mb-3">Timezone</label>
              <div className="relative">
                <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-charcoal-700" size={24} />
                <select
                  value={formData.timezone}
                  onChange={(e) => updateField('timezone', e.target.value)}
                  className="w-full pl-14 pr-5 py-4 text-lg rounded-xl border-3 border-charcoal-900 focus:outline-none focus:ring-2 focus:ring-coral-400 bg-white"
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz.id} value={tz.id}>
                      {tz.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-display font-bold text-lg text-charcoal-900 mb-3">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-charcoal-700" size={24} />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  className="w-full pl-14 pr-5 py-4 text-lg rounded-xl border-3 border-charcoal-900 focus:outline-none focus:ring-2 focus:ring-coral-400"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <label className="block font-display font-bold text-lg text-charcoal-900 mb-3">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-charcoal-700" size={24} />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
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
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <p className="text-center mt-6 text-charcoal-700">
            Already have an account?{' '}
            <Link to="/login" className="text-coral-500 font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
