
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
    onLogin: (email: string, password_unused: string) => boolean;
};

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C41.38,34.463,44,29.598,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
    </svg>
);

const AppleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
      <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.028-2.44Zm-5.94-1.12c-1.052.13-2.02.753-2.584 1.343-.58.613-.928 1.354-1.02 2.137-.092.782.166 1.527.584 2.144.43.633 1.01.96 1.63.96.625 0 1.29-.333 1.943-.964.55-.544 1.07-.938 1.68-.938.61 0 1.11.394 1.64.938.658.63 1.343.964 1.964.964.62 0 1.2-.327 1.61-.964.42-.617.682-1.362.59-2.147-.092-.782-.418-1.52-.99-2.137-.58-.613-1.54-.94-2.55-.94-.93 0-1.73.46-2.26.938-.52.48-1.03.82-1.64.82-.62 0-1.13-.34-1.64-.82Z"/>
      <path d="M4.184 6.126c.44-.633.9-1.238 1.438-1.78.525-.526 1.12-.926 1.766-1.204a5 5 0 0 1 2.212-.482c.326 0 .64.03.94.086.29.055.57.12.84.198.28.08.54.174.79.282.26.108.5.224.73.352.24.13.46.268.66.41.21.14.4.285.58.43.18.14.34.28.48.42.15.14.28.27.4.4.12.12.23.23.33.34.1.1.2.2.28.3.09.1.16.2.23.3.07.1.13.18.18.27.06.1.1.18.15.27s.08.18.11.27c.04.1.06.2.08.28.02.09.04.18.05.27.01.09.02.18.02.28s-.01.19-.02.28a1.2 1.2 0 0 1-.05.27c-.02.09-.05.18-.08.28-.03.09-.07.18-.11.27-.05.09-.09.18-.15.27-.05.09-.1.18-.18.27-.07.09-.14.19-.23.3-.09.1-.18.2-.28.3-.1.1-.21.2-.33.34s-.25.26-.4.4a8 8 0 0 1-.48.42c-.18.145-.37.285-.58.43-.2.142-.42.272-.66.41-.23.128-.47.244-.73.352a7.4 7.4 0 0 1-.79.282c-.27.078-.55.143-.84.198-.3.056-.61.086-.94.086a5 5 0 0 1-2.212-.482A6.3 6.3 0 0 1 5.62 9.9c-.525-.526-.95-1.13-1.28-1.804a4.4 4.4 0 0 1-.156-2.97z"/>
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
      firstName: "",
      lastName: "",
    },
  });
  
  React.useEffect(() => {
    setError(null);
  }, [authMode]);

  function onSubmit(data: SignUpFormValues | LoginFormValues) {
    setError(null);
    if (authMode === 'signin') {
        const success = onLogin((data as LoginFormValues).email, (data as LoginFormValues).password);
        if (!success) {
            setError("Invalid email or password. Please try again.");
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
            
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" key={authMode}>
                
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

            <div className="grid grid-cols-2 gap-4">
                <Button variant="outline">
                    <GoogleIcon />
                    Google
                </Button>
                <Button variant="outline">
                    <AppleIcon />
                    Apple
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
