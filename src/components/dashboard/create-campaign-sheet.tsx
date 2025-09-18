
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
import type { Campaign, User } from "@/types";
import { ArrowLeft, ArrowRight, Bot, MessageSquare, Users, Calendar, Check, Search, Sparkles } from "lucide-react";
import { Separator } from "../ui/separator";
import { generateCampaignMessage } from "@/ai/flows/generate-campaign-message";
import { ScrollArea } from "../ui/scroll-area";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "../ui/calendar";

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

const campaignAudienceSchema = z.object({
    audience: z.array(z.string()).min(1, "Please select at least one contact."),
});

const campaignMessageSchema = z.object({
    message: z.string().min(10, "Message must be at least 10 characters long."),
});

const campaignScheduleSchema = z.object({
    scheduleType: z.enum(['now', 'later']),
    scheduledAtDate: z.date().optional(),
    scheduledAtTime: z.string().optional(),
}).refine(data => {
    if (data.scheduleType === 'later') {
        return !!data.scheduledAtDate && !!data.scheduledAtTime;
    }
    return true;
}, {
    message: "Please select a date and time for scheduled sending.",
    path: ["scheduledAtDate"],
});


type CampaignDetailsValues = z.infer<typeof campaignDetailsSchema>;
type CampaignAudienceValues = z.infer<typeof campaignAudienceSchema>;
type CampaignMessageValues = z.infer<typeof campaignMessageSchema>;
type CampaignScheduleValues = z.infer<typeof campaignScheduleSchema>;


const validationSchemas = [
    campaignDetailsSchema,
    campaignAudienceSchema,
    campaignMessageSchema,
    campaignScheduleSchema,
    z.object({}) // No validation for review step
]

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


const StepAudience = ({ form, contacts }: { form: any, contacts: User[] }) => {
    const [searchTerm, setSearchTerm] = React.useState("");
    
    const filteredContacts = contacts.filter(contact => 
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <FormField
            control={form.control}
            name="audience"
            render={({ field }) => (
                <FormItem className="h-full flex flex-col">
                    <FormLabel className="text-lg font-medium">Select Audience</FormLabel>
                    <FormDescription>Choose which contacts will receive this campaign.</FormDescription>
                    <div className="relative pt-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search contacts..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <ScrollArea className="flex-1 my-4 border rounded-md">
                         <div className="p-4 space-y-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="select-all"
                                    checked={field.value?.length === filteredContacts.length && filteredContacts.length > 0}
                                    onCheckedChange={(checked) => {
                                        const allContactIds = filteredContacts.map(c => c.id);
                                        field.onChange(checked ? allContactIds : []);
                                    }}
                                />
                                <Label htmlFor="select-all">Select all</Label>
                            </div>
                            <Separator />
                            {filteredContacts.map(contact => (
                                <div key={contact.id} className="flex items-center space-x-2">
                                     <Checkbox
                                        id={contact.id}
                                        checked={field.value?.includes(contact.id)}
                                        onCheckedChange={(checked) => {
                                            return checked
                                            ? field.onChange([...field.value, contact.id])
                                            : field.onChange(field.value?.filter((id: string) => id !== contact.id))
                                        }}
                                    />
                                    <Label htmlFor={contact.id} className="flex-1 flex items-center gap-3 cursor-pointer font-normal">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={contact.avatar} alt={contact.name} />
                                            <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p>{contact.name}</p>
                                            <p className="text-xs text-muted-foreground">{contact.email}</p>
                                        </div>
                                    </Label>
                                </div>
                            ))}
                         </div>
                    </ScrollArea>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

const StepMessage = ({ form }: { form: any }) => {
    const [isGenerating, setIsGenerating] = React.useState(false);
    const { toast } = useToast();

    const handleGenerateMessage = async () => {
        const title = form.getValues("title");
        if (!title) {
            toast({
                variant: 'destructive',
                title: "Title is missing",
                description: "Please provide a campaign title before generating a message."
            });
            return;
        }
        setIsGenerating(true);
        try {
            const result = await generateCampaignMessage({ campaignTitle: title });
            form.setValue("message", result.message);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: "AI Generation Failed",
                description: "Could not generate a message. Please try again."
            })
        }
        setIsGenerating(false);
    }
    
    return (
        <div className="space-y-4">
             <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Campaign Message</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Write your message here or generate one with AI..." {...field} rows={8}/>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <Button type="button" variant="outline" onClick={handleGenerateMessage} disabled={isGenerating}>
                <Sparkles className="mr-2 h-4 w-4" />
                {isGenerating ? "Generating..." : "Generate with AI"}
            </Button>
        </div>
    )
}

const StepSchedule = ({ form }: { form: any }) => {
     return (
        <FormField
            control={form.control}
            name="scheduleType"
            render={({ field }) => (
                <FormItem className="space-y-3">
                    <FormLabel className="text-lg font-medium">Schedule</FormLabel>
                    <FormControl>
                        <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                        >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value="now" />
                                </FormControl>
                                <FormLabel className="font-normal">Send immediately</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value="later" />
                                </FormControl>
                                <FormLabel className="font-normal">Schedule for later</FormLabel>
                            </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />

                     {form.watch("scheduleType") === 'later' && (
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <FormField
                                control={form.control}
                                name="scheduledAtDate"
                                render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Date</FormLabel>
                                     <Popover>
                                        <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                            >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                        <CalendarComponent
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                                            initialFocus
                                        />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="scheduledAtTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Time</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    )}
                </FormItem>
            )}
        />
    )
}

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
  onCampaignCreate: (data: Partial<Campaign> & { scheduleType?: 'now' | 'later' }) => void;
  contacts: User[];
};

export function CreateCampaignSheet({ children, open, onOpenChange, onCampaignCreate, contacts }: CreateCampaignSheetProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  
  const form = useForm({
    resolver: zodResolver(validationSchemas[currentStep]),
    defaultValues: {
      title: "",
      description: "",
      type: "Broadcast",
      audience: [],
      message: "",
      scheduleType: "now",
      scheduledAtDate: undefined,
      scheduledAtTime: undefined,
    },
    mode: "onChange"
  });

  const goToNextStep = () => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1));
  const goToPrevStep = () => setCurrentStep(prev => Math.max(0, prev - 1));

  async function processStep(data: any) {
    if (currentStep === steps.length - 1) {
        onCampaignCreate(form.getValues());
    } else {
        goToNextStep();
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
        case 0:
            return <StepDetails form={form} />;
        case 1:
            return <StepAudience form={form} contacts={contacts} />;
        case 2:
            return <StepMessage form={form} />;
        case 3:
            return <StepSchedule form={form} />;
        case 4: // Review Step
            const data = form.getValues();
            return (
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Review Your Campaign</h3>
                    <div className="space-y-2 rounded-lg border p-4">
                        <p><span className="font-semibold">Title:</span> {data.title}</p>
                        <p><span className="font-semibold">Type:</span> {data.type}</p>
                        <p><span className="font-semibold">Audience:</span> {data.audience.length} contacts selected</p>
                        <p><span className="font-semibold">Message:</span> "{data.message}"</p>
                        <p><span className="font-semibold">Schedule:</span> {data.scheduleType === 'now' ? 'Send immediately' : `Scheduled for ${data.scheduledAtDate ? format(data.scheduledAtDate, 'PPP') : ''} at ${data.scheduledAtTime}`}</p>
                    </div>
                </div>
            )
        default:
            return <div className="text-center p-8 text-muted-foreground">This step is under construction.</div>;
    }
  };
  
  React.useEffect(() => {
    if (!open) {
        setTimeout(() => {
            setCurrentStep(0);
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
                <form id="campaign-form" onSubmit={form.handleSubmit(processStep)} className="space-y-8 p-1 h-full">
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
