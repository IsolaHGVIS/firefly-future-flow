
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Eye, EyeOff } from 'lucide-react';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please ensure both passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password should be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);

    try {
      const { data, error } = await signUp(email, password);
      
      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message || "Please try again later",
          variant: "destructive",
        });
        console.error("Sign up error:", error);
      } else {
        toast({
          title: "Account creation initiated",
          description: "Proceed to complete your profile details.",
        });
        navigate('/register');
      }
    } catch (error: any) {
      toast({
        title: "An error occurred",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
      console.error("Sign up exception:", error);
    } finally {
      setLoading(false);
    }
  };

  // Allow users to skip signup and see the profile demo
  const handleViewDemo = () => {
    navigate('/profile');
    toast({
      title: "Demo mode",
      description: "You're viewing the app in demo mode. Create an account to save your data.",
    });
  };

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-12">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="text-sm text-muted-foreground">
            Sign up to start tracking your path to FIRE
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Create your account to start your financial freedom journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input 
                  id="confirm-password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-fire-purple hover:bg-fire-purple/90"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
            
            <div className="mt-4">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleViewDemo}
              >
                View Demo Without Account
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-muted-foreground">
              <span>Already have an account? </span>
              <Button 
                variant="link" 
                onClick={() => navigate('/signin')}
                className="p-0 h-auto text-fire-purple"
              >
                Sign In
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
