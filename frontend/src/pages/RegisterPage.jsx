import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, ShieldCheck, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import api from '../lib/api';

export const RegisterPage = ({ onRegister }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      const user = response.data;
      toast.success('Account created successfully! Please sign in.');
      navigate('/login');
    } catch (error) {
      console.error("Registration Error:", error);
      const msg = error.response?.data?.detail || "Registration failed.";
      toast.error(msg);
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
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px]" />
         </div>

         <div className="relative z-10">
            <div className="mb-8">
               <span className="text-4xl font-black tracking-tight">
                 <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">OTP</span>
                 <span className="text-white">ify</span>
               </span>
            </div>
            <h1 className="text-4xl font-bold leading-tight mb-4">
               Start your journey <br/> with secure Auth.
            </h1>
            <p className="text-slate-400 text-lg max-w-md">
               Get your free API key instantly. Integrate in minutes, valid anywhere.
            </p>
         </div>

         <div className="relative z-10 grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
               <Rocket className="w-6 h-6 text-indigo-400 mb-2" />
               <h3 className="font-semibold">Instant Access</h3>
               <p className="text-sm text-slate-400">No waiting. Keys generated immediately.</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
               <ShieldCheck className="w-6 h-6 text-emerald-400 mb-2" />
               <h3 className="font-semibold">Enterprise Grade</h3>
               <p className="text-sm text-slate-400">99.9% availability and unmatched security.</p>
            </div>
         </div>
      </div>

      {/* Right Panel - Form (Converted to Dark) */}
      <div className="w-full lg:w-1/2 bg-slate-950 flex flex-col justify-center items-center p-8 relative text-white">
         <Link to="/" className="absolute top-8 left-8 text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Home
         </Link>

         <div className="w-full max-w-md space-y-8">
            <div className="text-center">
               <h2 className="text-3xl font-bold tracking-tight text-white">Create an Account</h2>
               <p className="text-slate-400 mt-2">Get started for free. No credit card required.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-200">Full Name</Label>
                <div className="relative">
                   <User className="absolute left-3 top-3 text-slate-500 w-5 h-5" />
                   <Input 
                     id="name" 
                     name="name" 
                     className="pl-10 h-11 bg-white/5 border-white/10 focus:ring-indigo-500 text-white placeholder:text-slate-500 focus:bg-white/10"
                     placeholder="John Doe"
                     required
                     value={formData.name}
                     onChange={handleChange}
                   />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200">Email</Label>
                <div className="relative">
                   <Mail className="absolute left-3 top-3 text-slate-500 w-5 h-5" />
                   <Input 
                     id="email" 
                     name="email" 
                     className="pl-10 h-11 bg-white/5 border-white/10 focus:ring-indigo-500 text-white placeholder:text-slate-500 focus:bg-white/10"
                     placeholder="you@company.com"
                     type="email"
                     required
                     value={formData.email}
                     onChange={handleChange}
                   />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200">Password</Label>
                <div className="relative">
                   <Lock className="absolute left-3 top-3 text-slate-500 w-5 h-5" />
                   <Input 
                     id="password" 
                     name="password"
                     className="pl-10 h-11 bg-white/5 border-white/10 focus:ring-indigo-500 text-white placeholder:text-slate-500 focus:bg-white/10"
                     placeholder="Create a password"
                     type={showPassword ? 'text' : 'password'}
                     required
                     value={formData.password}
                     onChange={handleChange}
                   />
                   <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-500 hover:text-indigo-400">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                   </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-200">Confirm Password</Label>
                <div className="relative">
                   <Lock className="absolute left-3 top-3 text-slate-500 w-5 h-5" />
                   <Input 
                     id="confirmPassword" 
                     name="confirmPassword"
                     className="pl-10 h-11 bg-white/5 border-white/10 focus:ring-indigo-500 text-white placeholder:text-slate-500 focus:bg-white/10"
                     placeholder="Confirm password"
                     type={showPassword ? 'text' : 'password'}
                     required
                     value={formData.confirmPassword}
                     onChange={handleChange}
                   />
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-base shadow-lg shadow-indigo-500/20 mt-2">
                 {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <p className="text-center text-sm text-slate-400">
              Already have an account? 
              <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 ml-1">Sign in</Link>
            </p>
         </div>
      </div>
    </div>
  );
};

export default RegisterPage;