
"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Campaign } from "@/types";
import { ArrowLeft, ArrowRight, Bot, MessageSquare, Users, Calendar, Check } from "lucide-react";
import { Separator } from "../ui/separator";

const steps = [
  { id: "details", name: "Details", icon: MessageSquare },
  { id: "audience", name: "Audience", icon: Users },
  { id: "message", name: "Message", icon: Bot },
  { id: "schedule", name: "Schedule", icon: Calendar },
  { id: "review", name: "Review", icon: Check },
];

const campaignDetailsSchema = z.object({
  title: z.string().min(5, { message: "Campaign title must be at least 5 characters." }),
  description: z.string().optional(),
  type: z.enum(["Broadcast", "Scheduled", "Automated"]),
});

type CampaignDetailsValues = z.infer<typeof campaignDetailsSchema>;

const StepDetails = ({ form }: { form: any }) => (
    <div className="space-y-4">
        <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Campaign Title</FormLabel>
                <FormControl>
                <Input placeholder="e.g., 'Back-to-School Promo'" {...field} />
                </FormControl>
                <FormDescription>A public name for your campaign.</FormDescription>
                <FormMessage />
            </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Description (Internal)</FormLabel>
                <FormControl>
                <Textarea placeholder="Internal notes about this campaign..." {...field} />
                </FormControl>
                <FormDescription>This will not be shown to recipients.</FormDescription>
                <FormMessage />
            </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Campaign Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select a campaign type" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="Broadcast">Broadcast (One-time send)</SelectItem>
                        <SelectItem value="Scheduled">Scheduled (Send at a future date)</SelectItem>
                        <SelectItem value="Automated">Automated (Trigger-based)</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
            )}
        />
    </div>
);


const Stepper = ({ currentStep }: { currentStep: number }) => (
  <nav aria-label="Progress">
    <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
      {steps.map((step, index) => (
        <li key={step.name} className="md:flex-1">
          {index < currentStep ? (
            <div className="group flex w-full flex-col border-l-4 border-primary py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-primary transition-colors ">{step.name}</span>
            </div>
          ) : index === currentStep ? (
            <div
              className="flex w-full flex-col border-l-4 border-primary py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
              aria-current="step"
            >
              <span className="text-sm font-medium text-primary">{step.name}</span>
            </div>
          ) : (
            <div className="group flex w-full flex-col border-l-4 border-border py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-muted-foreground">{step.name}</span>
            </div>
          )}
        </li>
      ))}
    </ol>
  </nav>
)


type CreateCampaignSheetProps = {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCampaignCreate: (data: Partial<Campaign>) => void;
};

export function CreateCampaignSheet({ children, open, onOpenChange, onCampaignCreate }: CreateCampaignSheetProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [campaignData, setCampaignData] = React.useState<Partial<Campaign>>({});
  const { toast } = useToast();

  const form = useForm<CampaignDetailsValues>({
    resolver: zodResolver(campaignDetailsSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "Broadcast",
    },
  });

  const goToNextStep = () => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1));
  const goToPrevStep = () => setCurrentStep(prev => Math.max(0, prev - 1));

  async function processStep(data: CampaignDetailsValues) {
    const updatedData = {...campaignData, ...data};
    setCampaignData(updatedData);

    if (currentStep === steps.length - 1) {
        // Final step: create campaign
        onCampaignCreate(updatedData);
    } else {
        goToNextStep();
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
        case 0:
            return <StepDetails form={form} />;
        case 4: // Review Step
            return (
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Review Your Campaign</h3>
                    <div className="space-y-2 rounded-lg border p-4">
                        <p><span className="font-semibold">Title:</span> {campaignData.title}</p>
                        <p><span className="font-semibold">Type:</span> {campaignData.type}</p>
                        <p><span className="font-semibold">Audience:</span> Under construction</p>
                        <p><span className="font-semibold">Message:</span> Under construction</p>
                    </div>
                </div>
            )
        default:
            return <div className="text-center p-8 text-muted-foreground">This step is under construction.</div>;
    }
  };
  
  React.useEffect(() => {
    if (!open) {
        // Reset state when sheet is closed
        setTimeout(() => {
            setCurrentStep(0);
            setCampaignData({});
            form.reset();
        }, 300);
    }
  }, [open, form]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl flex flex-col">
        <SheetHeader>
          <SheetTitle>Create New Campaign</SheetTitle>
          <SheetDescription>
            Follow the steps to create and send a new bulk messaging campaign.
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-4">
            <Stepper currentStep={currentStep} />
        </div>
        <Separator />
        
        <div className="flex-1 overflow-auto -mr-6 pr-6">
            <Form {...form}>
                <form id="campaign-form" onSubmit={form.handleSubmit(processStep)} className="space-y-8 p-1">
                    {renderStepContent()}
                </form>
            </Form>
        </div>

        <SheetFooter className="mt-auto pt-4">
            <div className="flex w-full justify-between">
                <Button variant="outline" onClick={goToPrevStep} disabled={currentStep === 0}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                <Button type="submit" form="campaign-form">
                    {currentStep === steps.length - 1 ? 'Finish & Create' : 'Next'} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
