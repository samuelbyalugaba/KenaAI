
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
import { useToast } from "@/hooks/use-toast";
import type { Agent } from "@/types";
import { updateAgentProfile } from "@/app/actions";

const agentFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
});

type AgentFormValues = z.infer<typeof agentFormSchema>;

type EditAgentDialogProps = {
    agent: Agent;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAgentUpdate: (agent: Agent) => void;
};

export function EditAgentDialog({ agent, open, onOpenChange, onAgentUpdate }: EditAgentDialogProps) {
  const { toast } = useToast();
  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: {
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
    },
  });

  React.useEffect(() => {
    form.reset({
        name: agent.name,
        email: agent.email,
        phone: agent.phone,
    });
  }, [agent, form]);

  async function onSubmit(data: AgentFormValues) {
    if (!agent.companyId) {
        toast({
            variant: 'destructive',
            title: "Error",
            description: "Company context is missing.",
        });
        return;
    }

    const result = await updateAgentProfile(agent.id, data.name, data.email, data.phone, agent.companyId);

    if (result.success && result.agent) {
        onAgentUpdate(result.agent);
        toast({
        title: "Agent Updated",
        description: `Agent "${data.name}" has been updated successfully.`,
        });
        onOpenChange(false);
    } else {
        toast({
            variant: 'destructive',
            title: "Failed to update agent",
            description: result.message || "An unexpected error occurred.",
        });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Agent</DialogTitle>
          <DialogDescription>
            Update the details for {agent.name}.
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
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

    