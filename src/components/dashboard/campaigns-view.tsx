
"use client";

import * as React from "react";
import { PlusCircle, Send, BarChart, Users, CheckCircle, Target, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import type { UserProfile, Campaign } from "@/types";
import { CreateCampaignSheet } from "./create-campaign-sheet";
import { getCampaignsByCompany, createCampaign } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "../ui/skeleton";


const overviewData = [
    { title: "Campaigns Sent", value: "12", icon: Send },
    { title: "Delivery Rate", value: "98.5%", icon: CheckCircle },
    { title: "Engagement Rate", value: "15.2%", icon: Target },
    { title: "Conversions", value: "2.3%", icon: BarChart },
];

const statusVariantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    Completed: "default",
    "In Progress": "secondary",
    Scheduled: "outline",
    Failed: "destructive",
    Draft: "outline"
};

type CampaignsViewProps = {
  onMenuClick: () => void;
  user: UserProfile | null;
};

export function CampaignsView({ onMenuClick, user }: CampaignsViewProps) {
    const [campaigns, setCampaigns] = React.useState<Campaign[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isCreateSheetOpen, setIsCreateSheetOpen] = React.useState(false);
    const [showReportDialog, setShowReportDialog] = React.useState(false);
    const { toast } = useToast();

    React.useEffect(() => {
        async function fetchCampaigns() {
            if (user?.companyId) {
                setIsLoading(true);
                const fetchedCampaigns = await getCampaignsByCompany(user.companyId);
                setCampaigns(fetchedCampaigns);
                setIsLoading(false);
            }
        }
        fetchCampaigns();
    }, [user]);

    const handleCreateCampaign = async (data: Partial<Campaign>) => {
        if (!user?.companyId) return;

        const result = await createCampaign(data, user.companyId);

        if (result.success && result.campaign) {
            setCampaigns(prev => [result.campaign!, ...prev]);
            toast({
                title: "Campaign Created",
                description: `Campaign "${result.campaign.title}" has been created as a draft.`,
            });
        } else {
             toast({
                variant: 'destructive',
                title: "Failed to create campaign",
                description: result.message || "An unexpected error occurred.",
            });
        }
    };
    
    if (user?.role !== 'admin' && user?.role !== 'super_agent') {
      return (
          <div className="flex h-screen w-full flex-col bg-background text-foreground">
             <header className="flex items-start sm:items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
                        <PanelLeft className="h-5 w-5" />
                        <span className="sr-only">Open Menu</span>
                    </Button>
                    <h1 className="text-2xl font-bold">Access Denied</h1>
                </div>
            </header>
            <main className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Permission Required</CardTitle>
                        <CardDescription>
                            You do not have permission to view this page. This area is restricted.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </main>
          </div>
      )
  }

  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground">
      <header className="flex items-start sm:items-center justify-between gap-4 p-4 border-b">
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Open Menu</span>
            </Button>
            <h1 className="text-2xl font-bold">Campaigns & Bulk Messaging</h1>
        </div>
        <CreateCampaignSheet
            open={isCreateSheetOpen}
            onOpenChange={setIsCreateSheetOpen}
            onCampaignCreate={handleCreateCampaign}
        >
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Campaign
            </Button>
        </CreateCampaignSheet>
      </header>
      <main className="flex-1 overflow-auto p-4 space-y-4">
        {/* Top Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {overviewData.map(item => (
                <Card key={item.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{item.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>

        {/* Campaign List */}
        <Card>
            <CardHeader>
                <CardTitle>Campaigns</CardTitle>
                <CardDescription>View and manage all your past and upcoming campaigns.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Campaign Name</TableHead>
                            <TableHead>Date Created</TableHead>
                            <TableHead className="text-center">Audience</TableHead>
                            <TableHead className="text-center">Delivery</TableHead>
                            <TableHead className="text-center">Engagement</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                                    <TableCell className="text-center"><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
                                    <TableCell className="text-center"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                                    <TableCell className="text-center"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                                    <TableCell className="text-center"><Skeleton className="h-6 w-20 mx-auto" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : campaigns.map(campaign => (
                            <TableRow key={campaign.id}>
                                <TableCell className="font-medium">{campaign.title}</TableCell>
                                <TableCell>{new Date(campaign.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-center">{campaign.audience.length}</TableCell>
                                <TableCell className="text-center">{campaign.delivery || 0}%</TableCell>
                                <TableCell className="text-center">{campaign.engagement || 0}%</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant={statusVariantMap[campaign.status]}>{campaign.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm" onClick={() => setShowReportDialog(true)}>
                                        View Report
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </main>

       <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Detailed Report</DialogTitle>
                    <DialogDescription>
                        Detailed campaign reports are coming soon!
                    </DialogDescription>
                </DialogHeader>
                 <DialogFooter>
                    <DialogClose asChild>
                        <Button>Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  );
}
