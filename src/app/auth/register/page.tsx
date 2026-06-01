'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Phone, Building2, Eye, EyeOff, Loader2, ChevronRight } from 'lucide-react';
import { registerUser, friendlyAuthError } from '@/lib/auth';
import { MAHARASHTRA_CITIES, UserRole } from '@/types';
import toast from 'react-hot-toast';

const ROLES = [
  {
    value: 'general' as UserRole,
    label: 'General User',
    emoji: '👤',
    desc: 'View public Bhandaras & festival food near you',
    color: 'from-blue-400 to-cyan-400',
  },
  {
    value: 'donor' as UserRole,
    label: 'Food Donor',
    emoji: '🍛',
    desc: 'Post Bhandara, wedding, temple or festival food',
    color: 'from-orange-400 to-amber-400',
  },
  {
    value: 'ngo' as UserRole,
    label: 'NGO / Social Org',
    emoji: '🤝',
    desc: 'Find & collect available food for distribution',
    color: 'from-green-400 to-emerald-400',
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRole>('general');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    city: '',
    orgName: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  function update(k: keyof typeof form, v: string) {
    setForm(f => ({ ...f, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Please enter your name'); return; }
    setLoading(true);
    try {
      await registerUser(form.email, form.password, form.name.trim(), role, {
        phone: form.phone || undefined,
        city: form.city || undefined,
        organizationName: form.orgName.trim() || undefined,
      });
      toast.success('Account created! Welcome 🙏');
      router.push('/dashboard');
    } catch (err) {
      const code = (err as { code?: string })?.code ?? '';
      if (code === 'auth/email-already-in-use') {
        // Show inline banner so user knows exactly what to do
        setEmailExists(true);
      } else {
        toast.error(friendlyAuthError(err));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 mandala-bg px-4 py-8">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <span className="absolute top-10 left-10 text-4xl animate-float opacity-20">🐘</span>
        <span className="absolute top-40 right-20 text-3xl animate-float-delay opacity-20">🪷</span>
        <span className="absolute bottom-40 left-20 text-3xl animate-float opacity-20">🌸</span>
        <span className="absolute bottom-20 right-10 text-3xl animate-float-delay opacity-20">🙏</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-orange-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 px-8 py-7 text-white">
            <div className="flex items-center gap-3">
              <span className="text-4xl animate-flicker">🪔</span>
              <div>
                <h1 className="text-xl font-bold">Join Nam Bhandara</h1>
                <p className="text-orange-100 text-sm">Be part of the food seva movement</p>
              </div>
            </div>
            {/* Step indicators */}
            <div className="flex items-center gap-2 mt-5">
              {[1, 2].map(s => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step > s ? 'bg-white text-green-600' :
                    step === s ? 'bg-white text-orange-500' :
                    'bg-orange-400 text-white'
                  }`}>
                    {step > s ? '✓' : s}
                  </div>
                  {s < 2 && <div className={`h-1 w-12 rounded transition-all ${step > s ? 'bg-white' : 'bg-orange-400'}`} />}
                </div>
              ))}
              <span className="text-xs text-orange-100 ml-2">
                {step === 1 ? 'Choose your role' : 'Create account'}
              </span>
            </div>
          </div>

          <div className="px-8 py-7">
            <AnimatePresence mode="wait">
              {/* Step 1 — Role selection */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <h2 className="text-lg font-bold text-stone-800 mb-1">How will you use Nam Bhandara?</h2>
                  <p className="text-sm text-stone-500 mb-5">Choose the role that best describes you</p>
                  <div className="space-y-3">
                    {ROLES.map(r => (
                      <button
                        key={r.value}
                        onClick={() => setRole(r.value)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                          role === r.value ? 'border-orange-400 bg-orange-50' : 'border-stone-200 hover:border-orange-200 hover:bg-stone-50'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center text-2xl shadow-md flex-shrink-0`}>
                          {r.emoji}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-stone-800">{r.label}</div>
                          <div className="text-xs text-stone-500 mt-0.5">{r.desc}</div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          role === r.value ? 'border-orange-500 bg-orange-500' : 'border-stone-300'
                        }`}>
                          {role === r.value && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    className="w-full mt-6 py-3.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Continue <ChevronRight size={18} />
                  </button>
                  <p className="text-center text-sm text-stone-500 mt-4">
                    Already have an account?{' '}
                    <Link href="/auth/login" className="text-orange-600 font-semibold hover:underline">Login</Link>
                  </p>
                </motion.div>
              )}

              {/* Step 2 — Account details */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-lg font-bold text-stone-800 mb-1">Create your account</h2>
                  <p className="text-sm text-stone-500 mb-5">
                    Registering as{' '}
                    <span className="font-semibold text-orange-600">
                      {ROLES.find(r => r.value === role)?.emoji} {ROLES.find(r => r.value === role)?.label}
                    </span>
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {/* Full name */}
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-stone-600 mb-1">Full Name *</label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 text-stone-400" size={16} />
                          <input
                            type="text"
                            value={form.name}
                            onChange={e => update('name', e.target.value)}
                            required
                            autoComplete="name"
                            placeholder="Your full name"
                            className="w-full pl-9 pr-3 py-2.5 border-2 border-stone-200 rounded-xl focus:border-orange-400 focus:outline-none text-sm transition-colors"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-stone-600 mb-1">Email *</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 text-stone-400" size={16} />
                          <input
                            type="email"
                            value={form.email}
                            onChange={e => update('email', e.target.value)}
                            required
                            autoComplete="email"
                            placeholder="your@email.com"
                            className="w-full pl-9 pr-3 py-2.5 border-2 border-stone-200 rounded-xl focus:border-orange-400 focus:outline-none text-sm transition-colors"
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-stone-600 mb-1">Password *</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 text-stone-400" size={16} />
                          <input
                            type={showPass ? 'text' : 'password'}
                            value={form.password}
                            onChange={e => update('password', e.target.value)}
                            required
                            minLength={6}
                            autoComplete="new-password"
                            placeholder="At least 6 characters"
                            className="w-full pl-9 pr-10 py-2.5 border-2 border-stone-200 rounded-xl focus:border-orange-400 focus:outline-none text-sm transition-colors"
                          />
                          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-stone-400">
                            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1">Phone</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 text-stone-400" size={16} />
                          <input
                            type="tel"
                            value={form.phone}
                            onChange={e => update('phone', e.target.value)}
                            autoComplete="tel"
                            placeholder="+91 9999..."
                            className="w-full pl-9 pr-3 py-2.5 border-2 border-stone-200 rounded-xl focus:border-orange-400 focus:outline-none text-sm transition-colors"
                          />
                        </div>
                      </div>

                      {/* City */}
                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1">City</label>
                        <select
                          value={form.city}
                          onChange={e => update('city', e.target.value)}
                          className="w-full px-3 py-2.5 border-2 border-stone-200 rounded-xl focus:border-orange-400 focus:outline-none text-sm transition-colors appearance-none bg-white"
                        >
                          <option value="">Select city</option>
                          {MAHARASHTRA_CITIES.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      {/* Org name (donor / NGO only) */}
                      {(role === 'ngo' || role === 'donor') && (
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-stone-600 mb-1">
                            {role === 'ngo' ? 'Organization Name *' : 'Mandal / Temple / Group Name'}
                          </label>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-3 text-stone-400" size={16} />
                            <input
                              type="text"
                              value={form.orgName}
                              onChange={e => update('orgName', e.target.value)}
                              required={role === 'ngo'}
                              placeholder={role === 'ngo' ? 'Your NGO / organization name' : 'Ganesh Mandal, Temple name, etc.'}
                              className="w-full pl-9 pr-3 py-2.5 border-2 border-stone-200 rounded-xl focus:border-orange-400 focus:outline-none text-sm transition-colors"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Email-already-exists banner */}
                    {emailExists && (
                      <div className="rounded-2xl bg-amber-50 border border-amber-300 p-4 text-sm">
                        <p className="font-semibold text-amber-800 mb-1">⚠️ This email is already registered</p>
                        <p className="text-amber-700 mb-3">An account with <span className="font-medium">{form.email}</span> already exists.</p>
                        <div className="flex gap-2">
                          <Link
                            href={`/auth/login`}
                            className="flex-1 text-center py-2 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition-colors"
                          >
                            Login instead
                          </Link>
                          <Link
                            href={`/auth/login`}
                            onClick={() => {
                              sessionStorage.setItem('resetEmail', form.email);
                            }}
                            className="flex-1 text-center py-2 rounded-xl border border-amber-400 text-amber-700 text-xs font-bold hover:bg-amber-100 transition-colors"
                          >
                            Forgot password?
                          </Link>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-4 py-3 rounded-2xl border-2 border-stone-200 text-stone-600 text-sm font-medium hover:bg-stone-50 transition-all"
                      >
                        ← Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70"
                      >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : '🙏'}
                        {loading ? 'Creating account...' : 'Create Account'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
