
"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { UserProfile } from "@/types"
import { useTheme } from "@/hooks/use-theme"
import { Camera } from "lucide-react"

type SettingsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserProfile | null
}

export function SettingsDialog({ open, onOpenChange, user }: SettingsDialogProps) {
  const { theme, setTheme } = useTheme()

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl p-0">
        <Tabs defaultValue="profile" className="flex flex-col md:flex-row h-full max-h-[80vh]">
          <TabsList className="flex flex-row md:flex-col h-auto md:h-full p-4 bg-muted/40 border-b md:border-r rounded-none justify-start">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>
          <div className="flex-1 overflow-auto">
            <TabsContent value="profile" className="p-6 m-0">
              <DialogHeader className="mb-6 text-left">
                <DialogTitle className="text-xl">Profile Settings</DialogTitle>
                <DialogDescription>
                  Manage your personal information and password.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                     <Avatar className="h-20 w-20">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <Button variant="ghost" size="icon" className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-background/80 hover:bg-background">
                        <Camera className="h-4 w-4" />
                        <span className="sr-only">Change Photo</span>
                      </Button>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" defaultValue={user.name} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" defaultValue={user.email} />
                        </div>
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" defaultValue={user.phone} />
                    </div>
                </div>

                 <div className="space-y-4 border-t pt-6">
                    <h4 className="font-semibold">Change Password</h4>
                    <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input id="new-password" type="password" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <Input id="confirm-password" type="password" />
                        </div>
                    </div>
                </div>
                 <div className="flex justify-end pt-6">
                    <Button>Save Changes</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="p-6 m-0">
               <DialogHeader className="mb-6 text-left">
                <DialogTitle className="text-xl">Notification Preferences</DialogTitle>
                <DialogDescription>
                  Choose how you get alerts from KenaAI.
                </DialogDescription>
              </DialogHeader>
               <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <h4 className="font-medium">In-App Notifications</h4>
                        <p className="text-sm text-muted-foreground">Receive alerts directly within the dashboard.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                   <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-muted-foreground">Get summaries and important alerts sent to your email.</p>
                    </div>
                    <Switch />
                  </div>
                   <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <h4 className="font-medium">SMS Notifications</h4>
                        <p className="text-sm text-muted-foreground">Receive urgent alerts via text message.</p>
                    </div>
                    <Switch />
                  </div>
                   <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <h4 className="font-medium">Push Notifications</h4>
                        <p className="text-sm text-muted-foreground">Get browser notifications for new messages.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
               </div>
                <div className="flex justify-end pt-6">
                    <Button>Save Preferences</Button>
                </div>
            </TabsContent>

            <TabsContent value="appearance" className="p-6 m-0">
              <DialogHeader className="mb-6 text-left">
                <DialogTitle className="text-xl">Appearance Settings</DialogTitle>
                <DialogDescription>
                  Customize the look and feel of the application.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <Label>Theme</Label>
                    <div className="flex items-center space-x-2">
                        <Button variant={theme === 'light' ? 'default' : 'outline'} onClick={() => setTheme('light')}>Light</Button>
                        <Button variant={theme === 'dark' ? 'default' : 'outline'} onClick={() => setTheme('dark')}>Dark</Button>
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select defaultValue="en-us">
                      <SelectTrigger id="language">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en-us">English (United States)</SelectItem>
                        <SelectItem value="es-es">Español (España)</SelectItem>
                        <SelectItem value="fr-fr">Français (France)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Time Zone</Label>
                    <Select defaultValue="est">
                      <SelectTrigger id="timezone">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                        <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                        <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
              </div>
                <div className="flex justify-end pt-6">
                    <Button>Save Settings</Button>
                </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
