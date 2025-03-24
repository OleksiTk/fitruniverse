
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Mail, Lock, User, Facebook, Github } from 'lucide-react';
import { toast } from 'sonner';

import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const signUpSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (values: SignUpFormValues) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Store user data in localStorage (for demo purposes only)
      localStorage.setItem('userEmail', values.email);
      localStorage.setItem('userName', values.name);
      
      setIsLoading(false);
      toast.success('Account created successfully!');
      navigate('/profile-setup');
    }, 1500);
  };

  const handleSocialSignUp = (provider: string) => {
    setIsLoading(true);
    
    // Simulate social login
    setTimeout(() => {
      localStorage.setItem('userEmail', `user@${provider.toLowerCase()}.com`);
      localStorage.setItem('userName', `${provider} User`);
      
      setIsLoading(false);
      toast.success(`Signed up with ${provider}!`);
      navigate('/profile-setup');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto max-w-md px-4 pt-32 pb-20">
        <div className="mb-6 animate-fade-in">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Back to Home</span>
          </Link>
        </div>

        <Card className="animate-scale-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
            <CardDescription>Track your runs and achieve your goals</CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="pl-10" 
                            placeholder="Your full name" 
                            disabled={isLoading} 
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="email" 
                            className="pl-10" 
                            placeholder="Your email address" 
                            disabled={isLoading} 
                          />
                        </FormControl>
                      </div>
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
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="password" 
                            className="pl-10" 
                            placeholder="Create a password" 
                            disabled={isLoading} 
                          />
                        </FormControl>
                      </div>
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
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="password" 
                            className="pl-10" 
                            placeholder="Confirm your password" 
                            disabled={isLoading} 
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full mt-6"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </Form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialSignUp('Facebook')}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2"
                >
                  <Facebook className="h-5 w-5 text-[#1877F2]" />
                  <span>Facebook</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialSignUp('Google')}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2"
                >
                  <Github className="h-5 w-5" />
                  <span>Google</span>
                </Button>
              </div>
            </div>

            <div className="mt-8 text-center text-sm">
              <span className="text-muted-foreground">Already have an account?</span>
              <Link to="/" className="ml-1 text-primary font-medium hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
