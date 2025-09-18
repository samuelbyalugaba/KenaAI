
"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Target, BarChart, Users, Mail, Send } from "lucide-react";
import type { Campaign } from "@/types";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";

type CampaignReportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: Campaign | null;
};

export function CampaignReportDialog({ open, onOpenChange, campaign }: CampaignReportDialogProps) {
  const { toast } = useToast();
  const [email, setEmail] = React.useState("");

  const handleSendReport = () => {
    if (!email.includes('@')) {
        toast({
            variant: 'destructive',
            title: "Invalid Email",
            description: "Please enter a valid email address.",
        });
        return;
    }
    
    toast({
        title: "Feature Not Implemented",
        description: `This feature is for demonstration. In a real app, an email would be sent to ${email}.`,
    });
    setEmail("");
    onOpenChange(false);
  }
  
  if (!campaign) return null;

  const reportData = [
      { title: "Delivery Rate", value: `${campaign.delivery.toFixed(2)}%`, icon: CheckCircle, description: "Messages successfully delivered." },
      { title: "Engagement Rate", value: `${campaign.engagement.toFixed(2)}%`, icon: Target, description: "Recipients who opened or clicked." },
      { title: "Conversion Rate", value: `${campaign.conversion.toFixed(2.0)}%`, icon: BarChart, description: "Recipients who took action." },
      { title: "Audience Size", value: campaign.audience.length.toString(), icon: Users, description: "Total recipients targeted." },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Campaign Report: "{campaign.title}"</DialogTitle>
          <DialogDescription>
            Detailed performance metrics for your campaign sent on {new Date(campaign.sentAt!).toLocaleDateString()}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {reportData.map(item => (
                     <Card key={item.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                            <item.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{item.value}</div>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

             <div>
                <h3 className="text-md font-semibold mb-2">Message Sent</h3>
                <blockquote className="border-l-2 pl-6 italic text-sm text-muted-foreground">
                    "{campaign.message}"
                </blockquote>
            </div>

            <Separator />
            
            <div>
                <h3 className="text-md font-semibold mb-2">Export Report</h3>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="email" className="sr-only">Email</Label>
                        <Input 
                            id="email" 
                            type="email" 
                            placeholder="Enter email to send report"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <Button type="button" onClick={handleSendReport}>
                        <Send className="mr-2 h-4 w-4" /> Send Report
                    </Button>
                </div>
            </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
