import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Send, Shield, CheckCircle, Zap, Code, Lock, Mail, Copy, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage = ({ user }) => {
  const features = [
    {
      icon: <Send className="w-8 h-8" />,
      title: 'Send OTP',
      description: 'Generate and send secure one-time passwords via email instantly',
      gradient: 'from-primary to-accent'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Verify OTP',
      description: 'Validate OTP codes with built-in expiration and retry limits',
      gradient: 'from-accent to-secondary'
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: 'Email Validation',
      description: 'Secure user authentication with email-based verification flows',
      gradient: 'from-secondary to-primary'
    }
  ];

  const benefits = [
    { icon: <Zap className="w-5 h-5" />, text: 'Lightning fast API responses' },
    { icon: <Lock className="w-5 h-5" />, text: 'Enterprise-grade security' },
    { icon: <Code className="w-5 h-5" />, text: 'Developer-friendly integration' },
    { icon: <CheckCircle className="w-5 h-5" />, text: '99.9% uptime guarantee' }
  ];

  const stats = [
    { value: '10M+', label: 'OTPs Sent' },
    { value: '<2s', label: 'Avg Response' },
    { value: '99.9%', label: 'Uptime' },
    { value: 'Free', label: 'Forever' }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="group flex items-center space-x-2">
              <span className="text-3xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">OTP</span>
                <span className="text-white">ify</span>
              </span>
            </Link>
            <div className="flex items-center gap-4">
              {user ? (
                <Link to="/dashboard">
                  <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium px-6 shadow-lg shadow-indigo-500/25 transition-all">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/5 font-medium transition-all">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium px-6 shadow-lg shadow-indigo-500/25 transition-all">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <span className="px-4 py-2 rounded-full glass text-sm font-medium text-secondary border border-secondary/30 glow-cyan">
                🚀 Open Source & Free Forever
              </span>
            </motion.div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Free Email OTP
              <br />
              Verification with{' '}
              <span className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">OTP</span>
                <span className="text-white">ify</span>
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Secure, fast, and reliable email OTP verification for your applications.
              Start authenticating users in minutes with our developer-friendly API.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity glow-primary text-lg px-8 py-6">
                  Get API Key Free
                </Button>
              </Link>
              <Link to="/docs">
                <Button size="lg" variant="outline" className="glass border-secondary/30 hover:border-secondary/50 text-foreground text-lg px-8 py-6">
                  <Terminal className="w-5 h-5 mr-2" />
                  View Documentation
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="glass-strong p-6 rounded-xl text-center hover-lift cursor-default"
              >
                <div className="text-3xl font-bold gradient-text-hero mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to implement secure email verification
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="relative group"
              >
                <Card className="glass-strong p-8 h-full border-border/50 hover:border-primary/30 transition-all duration-300 relative overflow-hidden">
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  
                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 glow-primary`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Simple Integration</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started in three easy steps
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-8">
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up and get your API key instantly' },
              { step: '02', title: 'Send OTP Request', desc: 'Make a simple API call to send OTP to user email' },
              { step: '03', title: 'Verify Code', desc: 'Validate the OTP code entered by your user' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-6 items-start glass-strong p-6 rounded-xl hover-lift"
              >
                <div className="text-5xl font-bold gradient-text-hero opacity-50">{item.step}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-strong p-12 rounded-2xl max-w-4xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">Why Choose OTPify?</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-3 p-4 rounded-lg hover:bg-primary/5 transition-colors"
                >
                  <div className="text-secondary">{benefit.icon}</div>
                  <span className="text-foreground font-medium">{benefit.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-strong p-12 rounded-2xl max-w-4xl mx-auto text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10"></div>
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join developers worldwide using OTPify for secure email verification
              </p>
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity glow-primary text-lg px-10 py-6">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">OTP</span>
                <span className="text-white">ify</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 OTPify. Open source & free forever.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;