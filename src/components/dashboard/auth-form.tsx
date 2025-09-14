
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
import { Mail, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

const signupSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Please enter a valid email." }),
  phone: z.string().optional(),
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
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3l-.5 3h-2.5v6.95A10.02 10.02 0 0 0 22 12z"/>
    </svg>
)

const AppleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20.94c1.5 0 2.75-.81 3.5-2.06 1.25-1.93 1.14-5.2-1.3-5.2-1.02 0-2.11.8-3.21.8-1.07 0-2.09-.8-3.2-.8-2.53 0-3.44 3.32-1.3 5.2 1.01.91 2.21 2.06 3.71 2.06zM12 4c-1.3 0-2.9.8-4.2.8-1.3 0-2.6-.8-3.8-.8-1.5 0-2.8.9-3.5 2.1-.7 1.2-.8 2.9-.1 4.4.7 1.5 2 2.9 3.5 2.9 1.5 0 2.9-.9 4.2-.9s2.6.9 3.8.9c1.5 0 2.8-.9 3.5-2.1.7-1.2.8-2.9.1-4.4-.7-1.5-2-2.9-3.5-2.9C14.9 4 13.3 4.8 12 4.8z"/>
    </svg>
)


export function AuthForm({ onLogin }: AuthFormProps) {
  const [authMode, setAuthMode] = React.useState<'signup' | 'signin'>('signup');
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<SignUpFormValues | LoginFormValues>({
    resolver: zodResolver(authMode === 'signup' ? signupSchema : loginSchema),
    defaultValues: authMode === 'signup' ? {
        firstName: "",
        lastName: "",
        email: "",
    } : {
        email: "",
        password: ""
    }
  });
  
  React.useEffect(() => {
    form.reset();
    setError(null);
  }, [authMode, form]);

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

  const SignupForm = (
    <>
        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <Input
                            placeholder="First name"
                            className="bg-muted/30 border-white/20"
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
                            className="bg-muted/30 border-white/20"
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
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
                            className="pl-9 bg-muted/30 border-white/20"
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
            name="phone"
            render={({ field }) => (
                <FormItem>
                <div className="relative flex items-center">
                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">🇺🇸</span>
                    <FormControl>
                        <Input
                            type="tel"
                            placeholder="(775) 351-6501"
                            className="pl-10 bg-muted/30 border-white/20"
                            {...field}
                        />
                    </FormControl>
                </div>
                <FormMessage />
                </FormItem>
            )}
        />
    </>
  );

  const SigninForm = (
      <>
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
                            className="pl-9 bg-muted/30 border-white/20"
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
                        placeholder="Enter your password" 
                        className="bg-muted/30 border-white/20"
                        {...field} 
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
      </>
  )


  return (
    <div className="relative w-full max-w-md space-y-6 animate-in fade-in-50 duration-500 bg-card/80 backdrop-blur-sm p-8 rounded-2xl border border-white/10 z-10">
        <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-muted-foreground hover:bg-white/10">
            <X className="h-4 w-4" />
        </Button>
        <div className="flex justify-center">
            <div className="bg-secondary/50 p-1 rounded-full flex gap-1">
                <Button variant={authMode === 'signup' ? 'secondary' : 'ghost'} size="sm" className="rounded-full" onClick={() => setAuthMode('signup')}>Sign up</Button>
                <Button variant={authMode === 'signin' ? 'secondary' : 'ghost'} size="sm" className="rounded-full" onClick={() => setAuthMode('signin')}>Sign in</Button>
            </div>
        </div>
        
        <div className="text-left space-y-4">
            <h1 className="text-2xl font-bold">{authMode === 'signup' ? 'Create an account' : 'Sign in to your account'}</h1>
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                
                {authMode === 'signup' ? SignupForm : SigninForm}

                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting 
                        ? 'Processing...' 
                        : (authMode === 'signup' ? 'Create an account' : 'Sign in')
                    }
                </Button>
            </form>
            </Form>
        </div>

        <div>
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/20"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or {authMode === 'signup' ? 'sign up' : 'sign in'} with</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="bg-secondary/50 border-white/20 hover:bg-white/10">
                    <GoogleIcon />
                </Button>
                <Button variant="outline" className="bg-secondary/50 border-white/20 hover:bg-white/10">
                    <AppleIcon />
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
