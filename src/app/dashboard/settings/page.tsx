
"use client";

import { useState, useEffect } from "react";
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
  CheckCircle2,
  Loader2
} from "lucide-react";
import { useUser, useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";

export default function SettingsPage() {
  const { user } = useUser();
  const db = useFirestore();
  
  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userRef);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    village: "",
    district: "",
    pincode: "",
    languagePreference: "hindi",
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        phone: profile.phone || "",
        village: profile.village || "",
        district: profile.district || "",
        pincode: profile.pincode || "",
        languagePreference: profile.languagePreference || "hindi",
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user?.uid || !db) return;
    
    setIsSaving(true);
    const updatedProfile = {
      ...formData,
      id: user.uid,
      email: user.email,
      subscriptionPlan: profile?.subscriptionPlan || "Free",
      updatedAt: serverTimestamp(),
    };

    const docRef = doc(db, "users", user.uid);
    
    setDoc(docRef, updatedProfile, { merge: true })
      .then(() => {
        toast({
          title: "Profile Updated",
          description: "Your settings have been saved successfully.",
        });
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: "Could not save your changes. Please try again.",
        });
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  if (isProfileLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <h1 className="text-3xl font-headline font-bold">Account Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-1">
          {[
            { name: "Profile & Location", icon: User },
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
          <Card className="rounded-2xl border-none shadow-sm">
            <CardHeader>
              <CardTitle>Farmer Profile</CardTitle>
              <CardDescription>Personal information and location for precision services.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6 pb-6 border-b">
                <Avatar className="h-20 w-20 rounded-2xl border-4 border-primary/10 shadow-sm">
                  <AvatarImage src={user?.photoURL || `https://picsum.photos/seed/${user?.uid}/80/80`} />
                  <AvatarFallback>{(formData.name || 'F').charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <Button variant="outline" size="sm" className="rounded-xl">Change Photo</Button>
                  <p className="text-xs text-muted-foreground">JPG or PNG. Max size 2MB.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="rounded-xl" 
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input 
                    value={formData.phone} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="rounded-xl" 
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Location Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Village</Label>
                    <Input 
                      value={formData.village} 
                      onChange={(e) => setFormData({...formData, village: e.target.value})}
                      className="rounded-xl" 
                      placeholder="e.g. Anji"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>District</Label>
                    <Input 
                      value={formData.district} 
                      onChange={(e) => setFormData({...formData, district: e.target.value})}
                      className="rounded-xl" 
                      placeholder="e.g. Wardha"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Pincode</Label>
                    <Input 
                      value={formData.pincode} 
                      onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                      className="rounded-xl" 
                      placeholder="442XXX"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Label>Primary Language</Label>
                <Select 
                  value={formData.languagePreference} 
                  onValueChange={(val) => setFormData({...formData, languagePreference: val})}
                >
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

              <Button 
                className="rounded-xl w-full" 
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-none shadow-sm bg-primary/5 border border-primary/20">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Current Plan</CardTitle>
                <Badge className="bg-primary text-white">{profile?.subscriptionPlan?.toUpperCase() || 'FREE'}</Badge>
              </div>
              <CardDescription>Plan specific to your farming scale.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">
                      {profile?.subscriptionPlan === 'Farmer Pro' ? 'Farmer Pro Season Pass' : 'Standard Access'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {profile?.subscriptionPlan === 'Farmer Pro' ? '₹99 per season • Active' : 'Free Limited Access'}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="rounded-xl">Manage</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
