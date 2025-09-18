
"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "../ui/alert";
import { Mail } from "lucide-react";
import { KenaAILogo } from "../ui/kena-ai-logo";

const signupSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type SignUpFormValues = z.infer<typeof signupSchema>;
type LoginFormValues = z.infer<typeof loginSchema>;

type AuthFormProps = {
    onLogin: (email: string, password_unused: string) => Promise<{success: boolean, message?: string}>;
};

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
_MESSAGE_,
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C41.38,34.463,44,29.598,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
    </svg>
);

export function AuthForm({ onLogin }: AuthFormProps) {
  const [authMode, setAuthMode] = React.useState<'signin' | 'signup'>('signin');
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<SignUpFormValues | LoginFormValues>({
    resolver: zodResolver(authMode === 'signup' ? signupSchema : loginSchema),
    defaultValues: {
      email: "",
      password: "",
      ...(authMode === 'signup' && { firstName: "", lastName: "" }),
    },
  });

  async function onSubmit(data: SignUpFormValues | LoginFormValues) {
    setError(null);
    if (authMode === 'signin') {
        const result = await onLogin((data as LoginFormValues).email, (data as LoginFormValues).password);
        if (!result.success) {
            setError(result.message || "Invalid email or password. Please try again.");
            form.setValue("password", "");
        } else {
            form.reset();
        }
    } else {
        // Handle signup logic
        console.log("Signup data:", data);
        alert("Signup functionality is not implemented yet. Please use an existing agent account to log in.");
        setAuthMode('signin');
    }
  }

  return (
    <div className="relative w-full max-w-md space-y-6 animate-in fade-in-50 duration-500 bg-card p-8 rounded-2xl border z-10">
        <div className="flex flex-col items-center space-y-2 text-center">
            <KenaAILogo className="h-10" />
            <h1 className="text-2xl font-bold">{authMode === 'signin' ? 'Welcome Back!' : 'Create an Account'}</h1>
            <p className="text-muted-foreground text-sm">
                {authMode === 'signin' ? 'Sign in to access your dashboard.' : 'Get started with KenaAI.'}
            </p>
        </div>

        <div className="flex justify-center gap-2">
            <Button variant={authMode === 'signin' ? 'secondary' : 'ghost'} size="sm" className="rounded-full transition-all duration-200 ease-in-out hover:scale-105" onClick={() => setAuthMode('signin')}>Sign in</Button>
            <Button variant={authMode === 'signup' ? 'secondary' : 'ghost'} size="sm" className="rounded-full transition-all duration-200 ease-in-out hover:scale-105" onClick={() => setAuthMode('signup')}>Sign up</Button>
        </div>
        
        <div className="text-left space-y-4">
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            
            <Form {...form} key={authMode}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                
                {authMode === 'signup' && (
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                <FormControl>
                                    <Input
                                        placeholder="First name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                <FormControl>
                                    <Input
                                        placeholder="Last name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                )}

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="pl-9"
                                    {...field}
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
                        <FormControl>
                            <Input 
                                type="password" 
                                placeholder={authMode === 'signin' ? 'Enter your password' : 'Create a password'}
                                {...field} 
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_4px_14px_0_hsl(var(--primary)/40%)] hover:shadow-[0_6px_20px_hsl(var(--primary)/30%)]" size="lg" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting 
                        ? 'Processing...' 
                        : (authMode === 'signin' ? 'Sign in' : 'Create an account')
                    }
                </Button>
            </form>
            </Form>
        </div>

        <div>
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or {authMode === 'signin' ? 'sign in' : 'sign up'} with</span>
                </div>
            </div>

            <div className="grid gap-4">
                 <Button variant="outline" className="w-full">
                    <GoogleIcon />
                    Google
                </Button>
            </div>
        </div>
        
        {authMode === 'signup' && (
            <p className="px-8 text-center text-xs text-muted-foreground">
                By creating an account, you agree to our{" "}
                <a
                href="#"
                className="underline underline-offset-4 hover:text-primary"
                >
                Terms & Service
                </a>
                .
            </p>
        )}
    </div>
  );
}
