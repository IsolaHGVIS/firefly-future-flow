import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp, updateProfile } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Eye, EyeOff } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
  currentSavings: z.coerce.number().nonnegative(),
  monthlyIncome: z.coerce.number().nonnegative(),
  monthlyExpenses: z.coerce.number().nonnegative(),
  fireGoal: z.coerce.number().nonnegative().default(1000000)
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof formSchema>;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      currentSavings: 0,
      monthlyIncome: 0,
      monthlyExpenses: 0,
      fireGoal: 1000000
    }
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setLoading(true);

    try {
      // 1. Create account
      const { data, error } = await signUp(values.email, values.password);
      
      if (error) {
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // 2. Save financial profile data
      if (data?.user) {
        const { error: profileError } = await updateProfile(data.user.id, {
          id: data.user.id,
          email: values.email,
          monthly_income: values.monthlyIncome,
          monthly_expenses: values.monthlyExpenses,
          savings: values.currentSavings,
          fire_goal: values.fireGoal,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (profileError) {
          toast({
            title: "Error saving profile data",
            description: "Your account was created but we couldn't save your financial information",
            variant: "destructive",
          });
        }
      }

      toast({
        title: "Account created",
        description: "Please check your email to confirm your account",
      });
      navigate('/signin');
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 md:w-[600px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-3xl font-bold">Start Your Financial Journey</h1>
          <p className="text-sm text-muted-foreground">
            Create your account and provide your financial details to begin tracking your path to FIRE
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>
              Enter your details to create an account and track your finances
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Account Information</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="you@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="••••••••" 
                                {...field} 
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
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="••••••••" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Financial Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="currentSavings"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Savings ($)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="fireGoal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>FIRE Goal ($)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="monthlyIncome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Income ($)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="monthlyExpenses"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Expenses ($)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-fire-purple hover:bg-fire-purple/90"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </Form>
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

export default Register;
