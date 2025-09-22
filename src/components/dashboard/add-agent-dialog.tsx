
"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Agent, AgentRole, UserProfile } from "@/types";
import { createAgent } from "@/app/actions";

const agentFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  role: z.enum(["admin", "agent", "super_agent"]),
});

type AgentFormValues = z.infer<typeof agentFormSchema>;

type AddAgentDialogProps = {
    onAgentAdd: (agent: Agent) => void;
    user: UserProfile | null;
};

export function AddAgentDialog({ onAgentAdd, user }: AddAgentDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      role: "agent",
    },
  });

  async function onSubmit(data: AgentFormValues) {
    if (!user?.companyId) {
        toast({
            variant: 'destructive',
            title: "Error",
            description: "Cannot add agent without a company context.",
        });
        return;
    }
    const result = await createAgent(data.name, data.email, data.password, data.role as AgentRole, user.companyId);

    if (result.success && result.agent) {
        const newAgent: Agent = {
            id: result.agent._id!,
            ...data,
            avatar: '',
            role: data.role as AgentRole,
            status: "Offline",
            conversationsToday: 0,
            avgResponseTime: "N/A",
            csat: 90 + Math.floor(Math.random() * 10), // Random high CSAT for new agent
        };
        onAgentAdd(newAgent);

        toast({
        title: "Agent Created",
        description: `New agent "${data.name}" has been added successfully.`,
        });
        
        form.reset();
        setOpen(false);
    } else {
        toast({
            variant: 'destructive',
            title: "Failed to create agent",
            description: result.message || "An unexpected error occurred.",
        });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add New Agent</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Agent</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new agent to your team.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
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
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john.doe@example.com"
                      {...field}
                    />
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
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 234 567 890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="agent">Agent</SelectItem>
                      <SelectItem value="super_agent">Super Agent</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Create Agent</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

    