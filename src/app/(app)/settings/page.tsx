"use client";

import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  CreditCard, 
  Layers, 
  Globe, 
  Mail,
  Lock,
  Eye,
  Trash2,
  Save,
  Check,
  Plus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { useState } from "react";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 max-w-5xl"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              <h1 className="text-4xl font-black tracking-tight text-foreground">Settings</h1>
            </div>
            <p className="text-muted-foreground text-sm font-medium">Manage your personal preferences, workspace configurations, and security protocols.</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full space-y-8">
        <TabsList className="bg-secondary/40 p-1.5 rounded-2xl border border-border/40 gap-2 h-auto flex-wrap justify-start">
          <TabsTrigger value="general" className="rounded-xl px-5 py-2.5 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/5 font-bold text-xs uppercase tracking-widest gap-2">
            <User className="h-3.5 w-3.5" /> General
          </TabsTrigger>
          <TabsTrigger value="workspace" className="rounded-xl px-5 py-2.5 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/5 font-bold text-xs uppercase tracking-widest gap-2">
            <Layers className="h-3.5 w-3.5" /> Workspace
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl px-5 py-2.5 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/5 font-bold text-xs uppercase tracking-widest gap-2">
            <Shield className="h-3.5 w-3.5" /> Security
          </TabsTrigger>
          <TabsTrigger value="billing" className="rounded-xl px-5 py-2.5 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/5 font-bold text-xs uppercase tracking-widest gap-2">
            <CreditCard className="h-3.5 w-3.5" /> Billing
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-xl px-5 py-2.5 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/5 font-bold text-xs uppercase tracking-widest gap-2">
            <Bell className="h-3.5 w-3.5" /> Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 space-y-6">
                <Card className="border-border/40 bg-card/40 backdrop-blur-md shadow-sm">
                   <CardHeader>
                      <CardTitle className="text-xl font-black tracking-tight">Public Profile</CardTitle>
                      <CardDescription className="text-muted-foreground/80 font-medium">This information will be displayed on your team profile.</CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                            <Input defaultValue="Kunal Pandey" className="h-11 rounded-xl bg-secondary/20 border-none focus-visible:ring-1 focus-visible:ring-primary shadow-none" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                            <Input defaultValue="kunal@operon.so" disabled className="h-11 rounded-xl bg-secondary/10 border-none opacity-60 cursor-not-allowed shadow-none" />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Bio / Headline</label>
                         <Input placeholder="Senior Frontend Engineer @ Operon" className="h-11 rounded-xl bg-secondary/20 border-none focus-visible:ring-1 focus-visible:ring-primary shadow-none" />
                      </div>
                   </CardContent>
                   <CardFooter className="bg-secondary/10 px-8 py-4 flex justify-end gap-3 border-t border-border/40">
                      <Button variant="ghost" className="rounded-xl font-bold text-xs uppercase tracking-widest">Cancel</Button>
                      <Button 
                        variant="premium" 
                        className="rounded-xl font-bold text-xs uppercase tracking-widest px-8"
                        onClick={handleSave}
                        disabled={isSaving}
                      >
                        {isSaving ? "Saving..." : success ? <Check className="h-4 w-4" /> : "Save Changes"}
                      </Button>
                   </CardFooter>
                </Card>

                <Card className="border-border/40 bg-card/40 backdrop-blur-md shadow-sm">
                   <CardHeader>
                      <CardTitle className="text-xl font-black tracking-tight">Personal Portfolio</CardTitle>
                      <CardDescription className="text-muted-foreground/80 font-medium">Showcase your work and link your professional profiles.</CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-6">
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                         <Globe className="h-5 w-5 text-primary" />
                         <div className="flex-1">
                            <p className="text-sm font-bold text-foreground">Custom Profile URL</p>
                            <p className="text-xs font-medium text-muted-foreground">operon.so/p/kunal-pandey</p>
                         </div>
                         <Button variant="outline" size="sm" className="rounded-lg h-8 text-[10px] uppercase font-black tracking-widest">Edit URL</Button>
                      </div>
                   </CardContent>
                </Card>
             </div>

             <div className="space-y-6">
                <Card className="border-border/40 bg-card/40 backdrop-blur-md shadow-sm text-center p-8">
                   <div className="mx-auto h-24 w-24 rounded-[2rem] bg-secondary/40 border-2 border-dashed border-border/80 flex items-center justify-center mb-6 overflow-hidden relative group cursor-pointer transition-all hover:border-primary/40">
                      <img src="https://i.pravatar.cc/150?u=kunal" className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                         <Plus className="h-6 w-6 text-white" />
                      </div>
                   </div>
                   <h3 className="text-lg font-black tracking-tight">Avatar</h3>
                   <p className="text-xs font-medium text-muted-foreground mt-2 mb-6">Recommended size 400x400px. Max weight 2MB.</p>
                   <div className="flex flex-col gap-2">
                      <Button variant="outline" className="w-full rounded-xl h-10 text-xs font-bold ring-1 ring-border/20">Change Photo</Button>
                      <Button variant="ghost" className="w-full rounded-xl h-10 text-xs font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-500/5">Remove</Button>
                   </div>
                </Card>
             </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 outline-none">
           <Card className="border-border/40 bg-card/40 backdrop-blur-md shadow-sm max-w-2xl">
              <CardHeader>
                 <CardTitle className="text-xl font-black tracking-tight text-foreground flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" /> Password Authentication
                 </CardTitle>
                 <CardDescription className="font-medium">Secure your account with a strong, permanent password.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Current Password</label>
                    <div className="relative">
                       <Input type="password" value="********" className="h-11 rounded-xl bg-secondary/20 border-none shadow-none pl-4 pr-10" />
                       <Eye className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer" />
                    </div>
                 </div>
                 <Separator className="bg-border/40" />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="flex items-center gap-2 text-emerald-500 font-bold">
                       <Check className="h-3 w-3" /> Min 8 characters
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground/40 font-bold">
                       <Check className="h-3 w-3" /> Special symbol (@, $, !)
                    </div>
                 </div>
              </CardContent>
              <CardFooter className="bg-secondary/10 px-8 py-4 flex justify-end border-t border-border/40">
                 <Button variant="premium" className="rounded-xl font-bold text-xs uppercase tracking-widest px-8">Update Password</Button>
              </CardFooter>
           </Card>

           <Card className="border-rose-500/20 bg-rose-500/5 backdrop-blur-md shadow-sm max-w-2xl overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-700">
                 <Trash2 className="h-48 w-48 text-rose-500" />
              </div>
              <CardHeader>
                 <CardTitle className="text-xl font-black tracking-tight text-rose-600">Danger Zone</CardTitle>
                 <CardDescription className="text-rose-600/70 font-medium italic">All data associated with this account will be permanently deleted. This action is irreversible.</CardDescription>
              </CardHeader>
              <CardContent>
                 <Button variant="ghost" className="rounded-xl h-12 px-6 border border-rose-500/20 text-rose-500 font-black text-xs uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-xl shadow-rose-500/5">
                    Delete Account Permanently
                 </Button>
              </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}