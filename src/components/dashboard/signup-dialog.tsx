
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
import { KenaAILogo } from "../ui/kena-ai-logo";
import { KeyRound, Mail, User, Eye, EyeOff } from "lucide-react";

const signupFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

type SignupFormValues = z.infer<typeof signupFormSchema>;

type SignUpDialogProps = {
    onSwitchToLogin: () => void;
};

export function SignUpDialog({ onSwitchToLogin }: SignUpDialogProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(data: SignupFormValues) {
    console.log("Sign up data:", data);
    // Here you would handle the signup logic
    // For now, we just log it and switch to login
    alert("Sign up successful! Please log in.");
    onSwitchToLogin();
  }

  return (
    <div className="w-full max-w-md space-y-8 animate-in fade-in-50 duration-500">
        <div className="text-center">
            <KenaAILogo className="h-16 mx-auto mb-4 lg:hidden" />
            <h1 className="text-3xl font-bold">Create an Account</h1>
            <p className="text-muted-foreground">Join us and start simplifying your conversations.</p>
        </div>
        
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Full Name</FormLabel>
                 <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <FormControl>
                        <Input
                            placeholder="John Doe"
                            className="pl-10"
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
            name="email"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Email</FormLabel>
                 <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <FormControl>
                        <Input
                            type="email"
                            placeholder="john.doe@example.com"
                            className="pl-10"
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
                            className="pl-10 pr-10"
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

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
        </form>
        </Form>
        <p className="text-center text-sm text-muted-foreground">
            Already have an account? <Button variant="link" className="font-semibold text-primary p-0 h-auto" onClick={onSwitchToLogin}>Log In</Button>
        </p>
    </div>
  );
}
