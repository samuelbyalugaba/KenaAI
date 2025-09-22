
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

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

type AuthFormProps = {
    onLogin: (email: string, password_unused: string) => Promise<{success: boolean, message?: string}>;
};

export function AuthForm({ onLogin }: AuthFormProps) {
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setError(null);
    const result = await onLogin(data.email, data.password);
    if (!result.success) {
        setError(result.message || "Invalid email or password. Please try again.");
        form.setValue("password", "");
    } else {
        form.reset();
    }
  }

  return (
    <div className="relative w-full max-w-md space-y-6 animate-in fade-in-50 duration-500 bg-card p-8 rounded-2xl border z-10">
        <div className="flex flex-col items-center space-y-2 text-center">
            <KenaAILogo className="h-10" />
            <h1 className="text-2xl font-bold">Welcome Back!</h1>
            <p className="text-muted-foreground text-sm">
                Sign in to access your dashboard.
            </p>
        </div>
        
        <div className="text-left space-y-4">
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                placeholder="Enter your password"
                                {...field} 
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_4px_14px_0_hsl(var(--primary)/40%)] hover:shadow-[0_6px_20px_hsl(var(--primary)/30%)]" size="lg" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting 
                        ? 'Signing in...' 
                        : 'Sign in'
                    }
                </Button>
            </form>
            </Form>
        </div>
    </div>
  );
}

    
