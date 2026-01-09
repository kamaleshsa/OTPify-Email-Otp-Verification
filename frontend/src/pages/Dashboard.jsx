import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Mail, 
  Copy, 
  RefreshCw, 
  LogOut, 
  Send, 
  CheckCircle, 
  Activity,
  FileText,
  Settings,
  Eye,
  EyeOff,
  Zap,
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../lib/api';

export const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [localUser, setLocalUser] = useState(user);
  const [showApiKey, setShowApiKey] = useState(false);
  const [otpTestForm, setOtpTestForm] = useState({ email: '' });
  const [verifyForm, setVerifyForm] = useState({ email: '', code: '' });
  const [isTestingOtp, setIsTestingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  const [stats, setStats] = useState([
    { label: 'Total Requests', value: '0', icon: <Activity className="w-5 h-5" />, change: 'Last 7 days', color: 'from-blue-500 to-indigo-500' },
    { label: 'Success Rate', value: '0%', icon: <CheckCircle className="w-5 h-5" />, change: 'Average', color: 'from-green-500 to-emerald-500' },
    { label: 'Avg Latency', value: '0ms', icon: <Zap className="w-5 h-5" />, change: 'Global', color: 'from-orange-500 to-amber-500' },
    { label: 'Active Keys', value: '1', icon: <Settings className="w-5 h-5" />, change: 'Production', color: 'from-purple-500 to-pink-500' }
  ]);
  
  const [chartData, setChartData] = useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, userRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/auth/me')
        ]);
        
        const s = statsRes.data;
        setStats([
          { label: 'Total Requests', value: s.total_requests.toString(), icon: <Activity className="w-5 h-5" />, change: 'Last 7 days', color: 'from-blue-500 to-indigo-500' },
          { label: 'Success Rate', value: s.success_rate, icon: <CheckCircle className="w-5 h-5" />, change: 'Average', color: 'from-green-500 to-emerald-500' },
          { label: 'Avg Latency', value: s.avg_response, icon: <Zap className="w-5 h-5" />, change: 'Global', color: 'from-orange-500 to-amber-500' },
          { label: 'Active Keys', value: '1', icon: <Settings className="w-5 h-5" />, change: 'Production', color: 'from-purple-500 to-pink-500' }
        ]);

        setChartData(s.chart_data || []);
        
        if (userRes.data) {
           setLocalUser(userRes.data);
           localStorage.setItem('user', JSON.stringify(userRes.data));
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    };
    fetchData();
  }, []);

  const copyApiKey = () => {
    navigator.clipboard.writeText(localUser.api_key || localUser.apiKey);
    toast.success('API key copied to clipboard!');
  };

  const regenerateApiKey = async () => {
    try {
      const response = await api.post('/auth/regenerate-api-key');
      const updatedUser = response.data;
      toast.success('API Key Regenerated!');
      setLocalUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setShowApiKey(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to regenerate API key");
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsTestingOtp(true);
    try {
      await api.post('/otp/send', { email: otpTestForm.email });
      toast.success(`OTP sent to ${otpTestForm.email}`);
      setOtpTestForm({ email: '' });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.detail || "Failed to send OTP");
    } finally {
      setIsTestingOtp(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    try {
      await api.post('/otp/verify', { 
        email: verifyForm.email,
        otp: verifyForm.code 
      });
      toast.success('OTP verified successfully!');
      setVerifyForm({ email: '', code: '' });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.detail || "Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden font-sans text-slate-200">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px]" />
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/" className="group flex items-center space-x-2">
            <span className="text-3xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">OTP</span>
              <span className="text-white">ify</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
             <Link to="/docs">
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/5 font-medium transition-all">
                  <FileText className="w-4 h-4 mr-2" />
                  Documentation
                </Button>
              </Link>
            <div className="flex items-center gap-2 pl-4 border-l border-white/10">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-semibold ring-2 ring-indigo-500/30">
                {localUser.name?.[0] || 'U'}
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-400 hover:text-red-400 hover:bg-white/5">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Welcome */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400">Monitor your API usage and manage authentications.</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="p-6 border-white/10 shadow-lg hover:shadow-xl transition-shadow bg-slate-900/50 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                   <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                     {stat.icon}
                   </div>
                   <span className="text-xs font-semibold text-slate-500">{stat.change}</span>
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* TRAFFIC CHART */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 border-white/10 shadow-lg bg-slate-900/50 backdrop-blur-sm overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-indigo-400" />
                      Traffic Overview
                    </h2>
                    <p className="text-sm text-slate-400">Request volume over the last 7 days</p>
                  </div>
                </div>
                
                <div className="h-[300px] w-full">
                  {chartData.length > 0 && chartData.some(d => d.value > 0) ? (
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#94a3b8', fontSize: 12 }} 
                            dy={10}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#94a3b8', fontSize: 12 }} 
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)' }}
                            itemStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                            labelStyle={{ color: '#94a3b8', marginBottom: '0.25rem' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#818cf8" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorValue)" 
                          />
                        </AreaChart>
                     </ResponsiveContainer>
                  ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center text-slate-500 bg-slate-900/30 rounded-xl border-2 border-dashed border-slate-700">
                      <BarChart3 className="w-10 h-10 mb-2 opacity-50" />
                      <p className="font-medium">No traffic data available yet</p>
                      <p className="text-xs">Send your first OTP to see analytics</p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* API Playground */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 }}
            >
              <Card className="p-6 border-white/10 shadow-lg bg-slate-900/50 backdrop-blur-sm">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" />
                    API Playground
                  </h2>
                  <p className="text-sm text-slate-400">Test your endpoints directly</p>
                </div>

                <Tabs defaultValue="send" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6 bg-black/20 p-1 rounded-lg">
                    <TabsTrigger value="send" className="data-[state=active]:bg-slate-800 data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm rounded-md transition-all text-slate-400 hover:text-slate-200">Send OTP</TabsTrigger>
                    <TabsTrigger value="verify" className="data-[state=active]:bg-slate-800 data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm rounded-md transition-all text-slate-400 hover:text-slate-200">Verify OTP</TabsTrigger>
                  </TabsList>

                  <TabsContent value="send" className="space-y-4">
                     <div className="flex gap-4">
                       <Input 
                         placeholder="Enter email address" 
                         value={otpTestForm.email}
                         onChange={(e) => setOtpTestForm({email: e.target.value})}
                         className="flex-1 bg-black/20 border-white/10 focus:ring-indigo-500 text-white placeholder:text-slate-500"
                       />
                       <Button 
                         onClick={handleSendOtp} 
                         disabled={isTestingOtp}
                         className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]"
                       >
                         {isTestingOtp ? 'Sending...' : 'Send Code'}
                       </Button>
                     </div>
                     <p className="text-xs text-slate-500">
                       This will trigger your real email. Check your inbox.
                     </p>
                  </TabsContent>

                  <TabsContent value="verify" className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                       <Input 
                         placeholder="Email address" 
                         value={verifyForm.email}
                         onChange={(e) => setVerifyForm({...verifyForm, email: e.target.value})}
                         className="bg-black/20 border-white/10 focus:ring-indigo-500 text-white placeholder:text-slate-500"
                       />
                       <Input 
                         placeholder="6-digit code" 
                         value={verifyForm.code}
                         maxLength={6}
                         onChange={(e) => setVerifyForm({...verifyForm, code: e.target.value})}
                         className="bg-black/20 border-white/10 focus:ring-indigo-500 font-mono text-white placeholder:text-slate-500"
                       />
                     </div>
                     <Button 
                       onClick={handleVerifyOtp} 
                       disabled={isVerifying}
                       className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                     >
                       {isVerifying ? 'Verifying...' : 'Verify Code'}
                     </Button>
                  </TabsContent>
                </Tabs>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            {/* API Key */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6 border-white/10 shadow-lg bg-gradient-to-br from-indigo-900/80 to-slate-900/80 backdrop-blur-md text-white">
                 <h3 className="font-bold mb-2 flex items-center gap-2">
                   <Settings className="w-4 h-4 text-indigo-300" />
                   Your API Key
                 </h3>
                 <p className="text-indigo-200 text-sm mb-4">Use this key to authenticate your requests.</p>
                 
                 <div className="relative mb-4">
                    <div className="bg-black/40 rounded-lg p-3 font-mono text-sm break-all border border-indigo-500/20 text-indigo-100 shadow-inner">
                       {showApiKey ? (localUser.api_key || localUser.apiKey) : 'sk_live_••••••••••••••••'}
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button onClick={() => setShowApiKey(!showApiKey)} className="p-1 hover:text-white text-indigo-300 transition-colors">
                        {showApiKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                      <button onClick={copyApiKey} className="p-1 hover:text-white text-indigo-300 transition-colors">
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                 </div>
                 
                 <Button 
                   onClick={regenerateApiKey}
                   variant="outline" 
                   className="w-full border-white/10 hover:bg-white/5 text-slate-300 bg-transparent text-xs h-8 hover:text-white"
                 >
                   <RefreshCw className="w-3 h-3 mr-2" />
                   Regenerate Key
                 </Button>
              </Card>
            </motion.div>
            
            {/* Quick Docs */}
            <motion.div
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.5 }}
            >
               <Card className="p-6 border-orange-500/20 shadow-lg bg-orange-950/10 backdrop-blur-sm">
                  <h3 className="font-bold text-orange-400 mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-orange-500" />
                    Integration Guide
                  </h3>
                  <div className="space-y-3">
                     <div className="flex items-start gap-3 text-sm">
                       <span className="w-5 h-5 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-mono text-xs shadow-sm">1</span>
                       <span className="text-slate-400">Get your API Key</span>
                     </div>
                     <div className="flex items-start gap-3 text-sm">
                       <span className="w-5 h-5 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-mono text-xs shadow-sm">2</span>
                       <span className="text-slate-400">Send POST request to <code className="bg-black/30 px-1 py-0.5 rounded border border-orange-500/20 text-orange-400">/api/send</code></span>
                     </div>
                     <div className="flex items-start gap-3 text-sm">
                       <span className="w-5 h-5 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-mono text-xs shadow-sm">3</span>
                       <span className="text-slate-400">Verify code via <code className="bg-black/30 px-1 py-0.5 rounded border border-orange-500/20 text-orange-400">/api/verify</code></span>
                     </div>
                  </div>
                  <Link to="/docs" className="block mt-4">
                     <Button variant="link" className="text-orange-400 p-0 text-sm h-auto hover:text-orange-300">
                       View full documentation &rarr;
                     </Button>
                  </Link>
               </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;