
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "../ui/alert";
import { KenaAILogo } from "../ui/kena-ai-logo";
import { KeyRound, Mail, Eye, EyeOff } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";

const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

type LoginDialogProps = {
    onLogin: (email: string, password_unused: string) => boolean;
    onSwitchToSignUp: () => void;
};

export function LoginDialog({ onLogin, onSwitchToSignUp }: LoginDialogProps) {
  const [error, setError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: LoginFormValues) {
    setError(null);
    const success = onLogin(data.email, data.password);
    if (!success) {
      setError("Invalid email or password. Please try again.");
      form.setValue("password", "");
    } else {
      form.reset();
    }
  }

  return (
    <div className="w-full max-w-md space-y-8 animate-in fade-in-50 duration-500">
        <div className="text-center">
            <KenaAILogo className="h-16 mx-auto mb-4 lg:hidden" />
            <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">Enter your credentials to access your account.</p>
        </div>
        
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Email</FormLabel>
                 <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <FormControl>
                        <Input
                            type="email"
                            placeholder="john.d@example.com"
                            className="pl-10 bg-secondary/50"
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
                <FormLabel>Password</FormLabel>
                <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <FormControl>
                        <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="********" 
                            className="pl-10 pr-10 bg-secondary/50"
                            {...field} 
                        />
                    </FormControl>
                    <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:bg-transparent"
                        onClick={() => setShowPassword(prev => !prev)}
                    >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                    </Button>
                </div>
                <FormMessage />
                </FormItem>
            )}
            />
            
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                    <Checkbox id="remember-me" />
                    <label htmlFor="remember-me" className="text-muted-foreground cursor-pointer">Remember me</label>
                </div>
                <Link href="#" className="font-medium text-primary hover:underline">
                    Forgot password?
                </Link>
            </div>

            <Button type="submit" className="w-full shadow-sm" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Logging in..." : "Log In"}
            </Button>
        </form>
        </Form>
        <p className="text-center text-sm text-muted-foreground">
            Don't have an account? <Button variant="link" className="font-semibold text-primary p-0 h-auto" onClick={onSwitchToSignUp}>Sign Up</Button>
        </p>
    </div>
  );
}
