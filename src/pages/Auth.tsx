import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';

const Auth = () => {
  const { user, signUp, signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signUp');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (mode === 'signUp' && !formData.name) {
      toast.error('Please enter your name');
      return;
    }

    setLoading(true);

    try {
      const { error } = mode === 'signUp' 
        ? await signUp(formData.email, formData.password, formData.name)
        : await signIn(formData.email, formData.password);

      if (error) {
        if (error.message?.includes('Invalid login credentials')) {
          toast.error('Invalid email or password');
        } else if (error.message?.includes('User already registered')) {
          toast.error('An account with this email already exists');
          setMode('signIn');
        } else if (error.message?.includes('Email not confirmed')) {
          toast.error('Please check your email and click the confirmation link');
        } else {
          toast.error(error.message || `Failed to ${mode === 'signUp' ? 'sign up' : 'sign in'}`);
        }
      } else {
        if (mode === 'signUp') {
          toast.success('Account created! Please check your email to verify your account.');
        } else {
          toast.success('Welcome back!');
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (error: any) {
      toast.error('An unexpected error occurred');
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast.error(error.message || 'Failed to sign in with Google');
      }
    } catch (error: any) {
      toast.error('An unexpected error occurred');
      console.error('Google auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-burgundy-900 via-burgundy-800 to-burgundy-700">
      {/* Animated Background Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-coral-600/30 via-coral-500/20 to-coral-500/25 animate-gradient" />
      <div className="absolute inset-0 bg-gradient-to-tr from-coral-400/10 via-coral-400/10 to-coral-600/10 animate-gradient delay-1000" />
      <div className="absolute inset-0 bg-gradient-to-bl from-burgundy-600/20 via-transparent to-coral-500/10 animate-gradient delay-2000" />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Back Button */}
          <div className="flex justify-start">
            <Button
              variant="ghost"
              asChild
              className="text-white/80 hover:text-white hover:bg-white/10 border border-white/10 rounded-full px-4"
            >
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>

          {/* Logo and Header */}
          <div className="text-center space-y-4">
            <BrandLogo className="mx-auto h-12 w-12" />
            <div>
              <h1 className="text-3xl font-light text-white mb-2">
                {mode === 'signUp' ? 'Create Your Account' : 'Welcome Back'}
              </h1>
              <p className="text-gray-300/90 text-sm">
                {mode === 'signUp' 
                  ? 'Start your journey to stronger relationships' 
                  : 'Continue building meaningful connections'
                }
              </p>
            </div>
          </div>

          {/* Auth Card */}
          <Card className="glass rounded-3xl border-white/10 shadow-3xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl font-light text-white text-center">
                {mode === 'signUp' ? 'Sign Up' : 'Sign In'}
              </CardTitle>
              <CardDescription className="text-gray-300/80 text-center">
                {mode === 'signUp' 
                  ? 'Enter your information to create an account'
                  : 'Enter your credentials to access your account'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Google Sign In */}
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10"
                onClick={handleGoogleAuth}
                disabled={loading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full bg-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-transparent px-2 text-gray-300/70">Or continue with email</span>
                </div>
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleEmailAuth} className="space-y-4">
                {mode === 'signUp' && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white/90">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/50 rounded-full"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/90">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/50 rounded-full"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white/90">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder:text-white/50 rounded-full"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0 text-white/60 hover:text-white/80"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full questionnaire-button-primary rounded-full py-3"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    mode === 'signUp' ? 'Create Account' : 'Sign In'
                  )}
                </Button>
              </form>

              {/* Mode Toggle */}
              <div className="text-center pt-4">
                <p className="text-gray-300/80 text-sm">
                  {mode === 'signUp' ? 'Already have an account?' : "Don't have an account?"}
                  {' '}
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto text-coral-300 hover:text-coral-200 underline"
                    onClick={() => setMode(mode === 'signUp' ? 'signIn' : 'signUp')}
                    disabled={loading}
                  >
                    {mode === 'signUp' ? 'Sign in' : 'Sign up'}
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;