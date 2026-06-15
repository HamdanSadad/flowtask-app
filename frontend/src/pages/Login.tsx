import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { CheckSquare, Mail, Lock, ArrowRight, ArrowLeft, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);
      toast.success('Welcome back!');
      navigate('/app/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      
      // Jika errornya dari backend lama (Invalid credentials) atau backend baru (Akun tidak ditemukan)
      if (errorMessage.includes('Akun tidak ditemukan') || errorMessage === 'Invalid credentials') {
        setShowRegisterPrompt(true);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side: Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary transition-colors mb-6">
              <ArrowLeft size={16} /> Back to home
            </Link>
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary text-white p-1.5 rounded-lg">
                <CheckSquare size={24} />
              </div>
              <span className="font-bold text-2xl text-gray-900">FlowTask</span>
            </Link>
          </div>
          
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600 mb-8">
            Please enter your details to sign in.
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">Remember me</label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-primary-hover">Forgot password?</a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-all hover:-translate-y-0.5"
              >
                {isLoading ? 'Signing in...' : 'Sign in'} <ArrowRight size={18} />
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary hover:text-primary-hover">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side: Visual */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-900">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 flex flex-col justify-center items-center w-full h-full p-12 text-white">
          <div className="max-w-md text-center">
            <h2 className="text-4xl font-bold mb-6">Master your time.</h2>
            <p className="text-lg text-blue-100 mb-12">
              Join thousands of professionals who have discovered the perfect flow state with FlowTask.
            </p>
            
            {/* Abstract Decorative Element */}
            <div className="relative w-64 h-64 mx-auto">
              <div className="absolute inset-0 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
              <div className="absolute inset-0 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-75"></div>
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-2xl">
                <div className="h-4 w-1/2 bg-white/30 rounded-full mb-4"></div>
                <div className="h-12 w-full bg-white/20 rounded-xl mb-3"></div>
                <div className="h-12 w-full bg-white/20 rounded-xl mb-3"></div>
                <div className="h-12 w-full bg-white/20 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Popup Modal for Unregistered User */}
      <AnimatePresence>
        {showRegisterPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center border border-gray-100 mx-auto"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-inner">
                <AlertCircle size={32} className="sm:w-10 sm:h-10" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Akun Belum Terdaftar</h3>
              <p className="text-sm sm:text-base text-gray-500 mb-6 sm:mb-8 leading-relaxed">
                Email <span className="font-semibold text-gray-700">{email}</span> belum terdaftar di sistem kami. Silakan buat akun terlebih dahulu untuk melanjutkan.
              </p>
              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={() => navigate('/register')}
                  className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-primary-hover hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  Daftar Sekarang
                </button>
                <button
                  onClick={() => setShowRegisterPrompt(false)}
                  className="w-full py-3.5 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium transition-colors"
                >
                  Coba Email Lain
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
