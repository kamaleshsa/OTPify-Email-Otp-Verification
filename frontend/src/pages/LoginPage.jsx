import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import api from '../lib/api';

export const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const loginParams = new URLSearchParams();
      loginParams.append('username', formData.email);
      loginParams.append('password', formData.password);

      const response = await api.post('/auth/login', loginParams, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const { access_token, user } = response.data;
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('apiKey', user.api_key);
      
      onLogin(user);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error("Login Error:", error);
      const msg = error.response?.data?.detail || "Login failed.";
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
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px]" />
         </div>

         <div className="relative z-10">
            <div className="mb-8">
               <span className="text-4xl font-black tracking-tight">
                 <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">OTP</span>
                 <span className="text-white">ify</span>
               </span>
            </div>
            <h1 className="text-4xl font-bold leading-tight mb-4">
               Secure Authentication <br/> for Modern Apps.
            </h1>
            <p className="text-slate-400 text-lg max-w-md">
               Developer-first OTP service. Simple API, reliable delivery, and beautiful dashboards.
            </p>
         </div>

         <div className="relative z-10 glass-strong p-6 rounded-xl border border-white/10 backdrop-blur-md max-w-sm w-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                   <p className="text-indigo-200 font-medium mb-1">Systems Normal</p>
                   <div className="flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                      </span>
                      <span className="text-sm text-slate-300">Operational</span>
                   </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-3 border border-white/5 backdrop-blur-sm">
                   <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Latency</p>
                   <p className="text-2xl font-bold text-white">~45ms</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/5 backdrop-blur-sm">
                   <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Uptime</p>
                   <p className="text-2xl font-bold text-emerald-400">99.9%</p>
                </div>
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
               <h2 className="text-3xl font-bold tracking-tight text-white">Welcome Back</h2>
               <p className="text-slate-400 mt-2">Sign in to your dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
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
                {/* <div className="flex items-center justify-between">
                   <Label htmlFor="password" className="text-slate-200">Password</Label>
                   <a href="#" className="text-sm font-medium text-indigo-400 hover:text-indigo-300">Forgot password?</a>
                </div> */}
                <div className="relative">
                   <Lock className="absolute left-3 top-3 text-slate-500 w-5 h-5" />
                   <Input 
                     id="password" 
                     name="password"
                     className="pl-10 h-11 bg-white/5 border-white/10 focus:ring-indigo-500 text-white placeholder:text-slate-500 focus:bg-white/10"
                     placeholder="••••••••"
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
              <div className="flex items-center justify-end">
                <Link to="/forgot-password" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-base shadow-lg shadow-indigo-500/20">
                 {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <p className="text-center text-sm text-slate-400">
              Don't have an account? 
              <Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 ml-1">Get started for free</Link>
            </p>
         </div>
      </div>
    </div>
  );
};

export default LoginPage;