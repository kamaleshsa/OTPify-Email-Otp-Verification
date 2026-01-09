import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Mail, 
  Copy,
  LogOut,
  FileText,
  LayoutDashboard,
  Terminal,
  Code2,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export const ApiDocs = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard!');
  };

  const handleLogout = () => {
    onLogout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const curlSendExample = `curl -X POST http://localhost:8000/api/otp/send \\
  -H "X-API-KEY: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com"
  }'`;

  const curlVerifyExample = `curl -X POST http://localhost:8000/api/otp/verify \\
  -H "X-API-KEY: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "otp": "123456"
  }'`;

  const jsSendExample = `const response = await fetch('http://localhost:8000/api/otp/send', {
  method: 'POST',
  headers: {
    'X-API-KEY': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com'
  })
});

const data = await response.json();
console.log(data);
// { "message": "OTP sent successfully" }`;

  const jsVerifyExample = `const response = await fetch('http://localhost:8000/api/otp/verify', {
  method: 'POST',
  headers: {
    'X-API-KEY': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    otp: '123456'
  })
});

const data = await response.json();
console.log(data);
// { "message": "OTP verified successfully" }`;

  const pythonSendExample = `import requests

url = "http://localhost:8000/api/otp/send"
headers = {
    "X-API-KEY": "YOUR_API_KEY",
    "Content-Type": "application/json"
}
data = {
    "email": "user@example.com"
}

response = requests.post(url, headers=headers, json=data)
print(response.json())
# { "message": "OTP sent successfully" }`;

  const pythonVerifyExample = `import requests

url = "http://localhost:8000/api/otp/verify"
headers = {
    "X-API-KEY": "YOUR_API_KEY",
    "Content-Type": "application/json"
}
data = {
    "email": "user@example.com",
    "otp": "123456"
}

response = requests.post(url, headers=headers, json=data)
print(response.json())
# { "message": "OTP verified successfully" }`;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }}></div>
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
                <>
                  <Link to="/dashboard">
                    <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/5 font-medium transition-all">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                    <span className="text-sm text-slate-400">Welcome, <span className="text-white font-medium">{user.name}</span></span>
                    <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-400 hover:text-red-400 hover:bg-white/5">
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
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
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 flex items-center gap-3 text-white">
              <FileText className="w-10 h-10 text-indigo-400" />
              API Documentation
            </h1>
            <p className="text-xl text-slate-400 font-medium">
              Complete guide to integrating OTPify in your application
            </p>
          </div>

          {/* Authentication */}
          <Card className="glass-strong p-8 border-border/50 mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Terminal className="w-6 h-6 text-accent" />
              Authentication
            </h2>
            <p className="text-muted-foreground mb-4">
              All API requests must include your API key in the X-API-KEY header:
            </p>
            <div className="glass p-4 rounded-lg relative">
              <pre className="text-sm text-foreground overflow-x-auto">
                <code>X-API-KEY: YOUR_API_KEY</code>
              </pre>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyCode('X-API-KEY: YOUR_API_KEY')}
                className="absolute top-2 right-2"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            {user ? (
              <div className="mt-4 p-4 glass rounded-lg border-l-4 border-indigo-500">
                <p className="text-sm text-slate-200">
                  <span className="font-semibold">Your API Key:</span> <code className="ml-2 text-indigo-400 font-mono">{user.api_key || user.apiKey}</code>
                </p>
              </div>
            ) : (
              <div className="mt-4 p-4 glass rounded-lg border-l-4 border-amber-500 bg-amber-500/10">
                <p className="text-sm text-slate-200">
                  <span className="font-semibold text-amber-400">Sign in to get your API key:</span>
                  <Link to="/register" className="ml-2 text-indigo-400 hover:text-indigo-300 underline">Create a free account</Link>
                </p>
              </div>
            )}
          </Card>

          {/* Base URL */}
          <Card className="glass-strong p-8 border-border/50 mb-8">
            <h2 className="text-2xl font-bold mb-4">Base URL</h2>
            <div className="glass p-4 rounded-lg relative">
              <pre className="text-sm text-foreground">
                <code>http://localhost:8000</code>
              </pre>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyCode('http://localhost:8000')}
                className="absolute top-2 right-2"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          {/* Send OTP Endpoint */}
          <Card className="glass-strong p-8 border-border/50 mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <Code2 className="w-6 h-6 text-primary" />
                  Send OTP
                </h2>
                <p className="text-muted-foreground">Send a one-time password to a user's email</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-mono">POST</span>
            </div>

            <div className="glass p-3 rounded-lg mb-6">
              <code className="text-foreground">/api/otp/send</code>
            </div>

            <h3 className="font-semibold mb-3 text-foreground">Request Body</h3>
            <div className="glass p-4 rounded-lg mb-6">
              <pre className="text-sm text-muted-foreground">
                <code>{`{
  "email": "user@example.com"  // Required: Email address to send OTP
}`}</code>
              </pre>
            </div>

            <h3 className="font-semibold mb-3 text-foreground">Response</h3>
            <div className="glass p-4 rounded-lg mb-6">
              <pre className="text-sm text-muted-foreground">
                <code>{`{
  "message": "OTP sent successfully"
}`}</code>
              </pre>
            </div>

            <h3 className="font-semibold mb-3 text-foreground">Examples</h3>
            <Tabs defaultValue="curl" className="w-full">
              <TabsList className="glass">
                <TabsTrigger value="curl" className="data-[state=active]:bg-primary/20">cURL</TabsTrigger>
                <TabsTrigger value="javascript" className="data-[state=active]:bg-primary/20">JavaScript</TabsTrigger>
                <TabsTrigger value="python" className="data-[state=active]:bg-primary/20">Python</TabsTrigger>
              </TabsList>

              <TabsContent value="curl" className="mt-4">
                <div className="glass p-4 rounded-lg relative">
                  <pre className="text-xs text-muted-foreground overflow-x-auto">
                    <code>{curlSendExample}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyCode(curlSendExample)}
                    className="absolute top-2 right-2"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="javascript" className="mt-4">
                <div className="glass p-4 rounded-lg relative">
                  <pre className="text-xs text-muted-foreground overflow-x-auto">
                    <code>{jsSendExample}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyCode(jsSendExample)}
                    className="absolute top-2 right-2"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="python" className="mt-4">
                <div className="glass p-4 rounded-lg relative">
                  <pre className="text-xs text-muted-foreground overflow-x-auto">
                    <code>{pythonSendExample}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyCode(pythonSendExample)}
                    className="absolute top-2 right-2"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Verify OTP Endpoint */}
          <Card className="glass-strong p-8 border-border/50 mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-accent" />
                  Verify OTP
                </h2>
                <p className="text-muted-foreground">Validate an OTP code entered by the user</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-mono">POST</span>
            </div>

            <div className="glass p-3 rounded-lg mb-6">
              <code className="text-foreground">/api/otp/verify</code>
            </div>

            <h3 className="font-semibold mb-3 text-foreground">Request Body</h3>
            <div className="glass p-4 rounded-lg mb-6">
              <pre className="text-sm text-muted-foreground">
                <code>{`{
  "email": "user@example.com",  // Required: Email address
  "otp": "123456"                // Required: 6-digit OTP code
}`}</code>
              </pre>
            </div>

            <h3 className="font-semibold mb-3 text-foreground">Response</h3>
            <div className="glass p-4 rounded-lg mb-6">
              <pre className="text-sm text-muted-foreground">
                <code>{`{
  "message": "OTP verified successfully"
}`}</code>
              </pre>
            </div>

            <h3 className="font-semibold mb-3 text-foreground">Examples</h3>
            <Tabs defaultValue="curl" className="w-full">
              <TabsList className="glass">
                <TabsTrigger value="curl" className="data-[state=active]:bg-primary/20">cURL</TabsTrigger>
                <TabsTrigger value="javascript" className="data-[state=active]:bg-primary/20">JavaScript</TabsTrigger>
                <TabsTrigger value="python" className="data-[state=active]:bg-primary/20">Python</TabsTrigger>
              </TabsList>

              <TabsContent value="curl" className="mt-4">
                <div className="glass p-4 rounded-lg relative">
                  <pre className="text-xs text-muted-foreground overflow-x-auto">
                    <code>{curlVerifyExample}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyCode(curlVerifyExample)}
                    className="absolute top-2 right-2"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="javascript" className="mt-4">
                <div className="glass p-4 rounded-lg relative">
                  <pre className="text-xs text-muted-foreground overflow-x-auto">
                    <code>{jsVerifyExample}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyCode(jsVerifyExample)}
                    className="absolute top-2 right-2"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="python" className="mt-4">
                <div className="glass p-4 rounded-lg relative">
                  <pre className="text-xs text-muted-foreground overflow-x-auto">
                    <code>{pythonVerifyExample}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyCode(pythonVerifyExample)}
                    className="absolute top-2 right-2"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Error Responses */}
          <Card className="glass-strong p-8 border-border/50 mb-8">
            <h2 className="text-2xl font-bold mb-4">Error Responses</h2>
            <p className="text-muted-foreground mb-4">
              All errors follow this format:
            </p>
            <div className="glass p-4 rounded-lg mb-6">
              <pre className="text-sm text-muted-foreground">
                <code>{`{
  "detail": "Error description"
}`}</code>
              </pre>
            </div>

            <h3 className="font-semibold mb-3 text-foreground">Common Error Codes</h3>
            <div className="space-y-3">
              {[
                { code: '403', message: 'Forbidden - Invalid or missing API key' },
                { code: '400', message: 'Bad Request - Missing required fields or invalid OTP' },
                { code: '404', message: 'Not Found - User not found' },
                { code: '500', message: 'Internal Server Error - Something went wrong' }
              ].map((error, index) => (
                <div key={index} className="flex items-start gap-3 p-3 glass rounded-lg">
                  <span className="px-2 py-1 rounded bg-destructive/20 text-destructive text-sm font-mono">{error.code}</span>
                  <span className="text-sm text-muted-foreground">{error.message}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Rate Limits */}
          <Card className="glass-strong p-8 border-border/50">
            <h2 className="text-2xl font-bold mb-4">Rate Limits</h2>
            <p className="text-muted-foreground mb-4">
              To ensure fair usage, the following rate limits apply:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="glass p-4 rounded-lg">
                <h3 className="font-semibold mb-2 text-foreground">Send OTP</h3>
                <p className="text-2xl font-bold gradient-text-hero mb-1">100</p>
                <p className="text-sm text-muted-foreground">requests per hour</p>
              </div>
              <div className="glass p-4 rounded-lg">
                <h3 className="font-semibold mb-2 text-foreground">Verify OTP</h3>
                <p className="text-2xl font-bold gradient-text-hero mb-1">1000</p>
                <p className="text-sm text-muted-foreground">requests per hour</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ApiDocs;