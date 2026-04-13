"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  MapPin, 
  Bell, 
  ShieldCheck, 
  CreditCard, 
  Globe, 
  Smartphone,
  CheckCircle2
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <h1 className="text-3xl font-headline font-bold">Account Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation Tabs Mock */}
        <div className="space-y-1">
          {[
            { name: "Profile", icon: User },
            { name: "Farm Details", icon: MapPin },
            { name: "Notifications", icon: Bell },
            { name: "Integrations", icon: ShieldCheck },
            { name: "Billing & Plans", icon: CreditCard },
          ].map((item, i) => (
            <Button key={i} variant={i === 0 ? "secondary" : "ghost"} className="w-full justify-start rounded-xl font-bold h-11">
              <item.icon className="mr-3 h-4 w-4" /> {item.name}
            </Button>
          ))}
        </div>

        <div className="md:col-span-2 space-y-8">
          {/* Profile Card */}
          <Card className="rounded-2xl border-none shadow-sm">
            <CardHeader>
              <CardTitle>Farmer Profile</CardTitle>
              <CardDescription>Personal information displayed across the platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6 pb-6 border-b">
                <Avatar className="h-20 w-20 rounded-2xl border-4 border-primary/10 shadow-sm">
                  <AvatarImage src="https://picsum.photos/seed/farmer1/80/80" />
                  <AvatarFallback>RP</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <Button variant="outline" size="sm" className="rounded-xl">Change Photo</Button>
                  <p className="text-xs text-muted-foreground">JPG or PNG. Max size 2MB.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input defaultValue="Ramesh Patel" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input defaultValue="+91 98765 43210" className="rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Primary Language</Label>
                <Select defaultValue="hindi">
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hindi">Hindi (हिंदी)</SelectItem>
                    <SelectItem value="marathi">Marathi (मराठी)</SelectItem>
                    <SelectItem value="telugu">Telugu (తెలుగు)</SelectItem>
                    <SelectItem value="tamil">Tamil (தமிழ்)</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="rounded-xl">Save Changes</Button>
            </CardContent>
          </Card>

          {/* Subscription Card */}
          <Card className="rounded-2xl border-none shadow-sm bg-primary/5 border border-primary/20">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Current Plan</CardTitle>
                <Badge className="bg-primary text-white">PRO PLAN</Badge>
              </div>
              <CardDescription>Next billing date: Oct 20, 2024</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Farmer Pro Season Pass</p>
                    <p className="text-xs text-muted-foreground">₹99 per season • Active</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="rounded-xl">Manage</Button>
              </div>
              <Button variant="link" className="w-full text-xs font-bold text-primary uppercase tracking-widest">Compare Plans</Button>
            </CardContent>
          </Card>

          {/* Notifications & Connectivity */}
          <Card className="rounded-2xl border-none shadow-sm">
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">WhatsApp Alerts</Label>
                  <p className="text-xs text-muted-foreground">Get daily market prices and disease warnings.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">SMS Notifications</Label>
                  <p className="text-xs text-muted-foreground">Backup channel for critical weather alerts.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="h-[1px] bg-muted" />
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Connected Services</h3>
                {[
                  { name: "eNAM Market Integration", status: "Connected" },
                  { name: "PMFBY Insurance", status: "Linked" },
                  { name: "Soil Health Card", status: "Linked" },
                ].map((conn, i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{conn.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase">
                      <CheckCircle2 className="h-3 w-3" /> {conn.status}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
