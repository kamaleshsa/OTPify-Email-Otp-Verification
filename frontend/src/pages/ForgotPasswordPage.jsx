import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import api from '../lib/api';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
      setEmailSent(true);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error) {
      console.error('Forgot password error:', error);
      // Still show success message for security (don't reveal if email exists)
      setEmailSent(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-950">
      {/* Left Panel - Visual Branding */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-12 text-white border-r border-white/5">
         <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[100px]" />
         </div>

         <div className="relative z-10">
            <div className="mb-8">
               <span className="text-4xl font-black tracking-tight">
                 <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">OTP</span>
                 <span className="text-white">ify</span>
               </span>
            </div>
            <h1 className="text-4xl font-bold leading-tight mb-4">
               Reset Your Password
            </h1>
            <p className="text-slate-400 text-lg">
               Enter your email address and we'll send you a link to reset your password.
            </p>
         </div>

         <div className="relative z-10 text-sm text-slate-500">
            © 2026 OTPify. Secure authentication made simple.
         </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
         >
            <Link to="/login" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
               <ArrowLeft className="w-4 h-4 mr-2" />
               Back to Login
            </Link>

            {!emailSent ? (
               <>
                  <h2 className="text-3xl font-bold text-white mb-2">Forgot Password?</h2>
                  <p className="text-slate-400 mb-8">No worries, we'll send you reset instructions.</p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                     <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                           Email Address
                        </label>
                        <div className="relative">
                           <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                           <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                              placeholder="Enter your email"
                              required
                           />
                        </div>
                     </div>

                     <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium py-3 shadow-lg shadow-indigo-500/25"
                     >
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                     </Button>
                  </form>
               </>
            ) : (
               <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                     <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">Check Your Email</h2>
                  <p className="text-slate-400 mb-8">
                     We've sent a password reset link to <span className="text-white font-medium">{email}</span>
                  </p>
                  <p className="text-sm text-slate-500 mb-6">
                     Didn't receive the email? Check your spam folder or{' '}
                     <button
                        onClick={() => setEmailSent(false)}
                        className="text-indigo-400 hover:text-indigo-300 underline"
                     >
                        try again
                     </button>
                  </p>
                  <Link to="/login">
                     <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                        Back to Login
                     </Button>
                  </Link>
               </div>
            )}
         </motion.div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
