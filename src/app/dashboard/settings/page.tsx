
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

const stateData: Record<string, string[]> = {
  "Maharashtra": ["Wardha", "Nagpur", "Amravati", "Yavatmal", "Pune", "Nashik", "Aurangabad", "Solapur"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Bikaner", "Kota", "Ajmer"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Meerut", "Prayagraj"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Tirupati"]
};

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
    state: "Maharashtra",
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
        state: profile.state || "Maharashtra",
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
      <h1 className="text-4xl font-headline font-black tracking-tight">Account Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="space-y-2">
          {[
            { name: "Profile & Location", icon: User },
            { name: "Notifications", icon: Bell },
            { name: "Integrations", icon: ShieldCheck },
            { name: "Billing & Plans", icon: CreditCard },
          ].map((item, i) => (
            <Button key={i} variant={i === 0 ? "secondary" : "ghost"} className="w-full justify-start rounded-2xl font-black h-14 text-sm px-6">
              <item.icon className="mr-3 h-5 w-5" /> {item.name}
            </Button>
          ))}
        </div>

        <div className="md:col-span-2 space-y-8">
          <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-2xl font-black">Farmer Profile</CardTitle>
              <CardDescription className="text-base font-medium">Personal information and location for precision services.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="flex items-center gap-8 pb-8 border-b">
                <Avatar className="h-24 w-24 rounded-3xl border-4 border-primary/10 shadow-lg">
                  <AvatarImage src={user?.photoURL || `https://picsum.photos/seed/${user?.uid}/96/96`} />
                  <AvatarFallback className="bg-primary text-white text-3xl font-black">{(formData.name || 'F').charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" className="rounded-2xl h-10 px-6 font-bold border-2">Change Photo</Button>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">JPG or PNG • Max 2MB</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Full Name</Label>
                  <Input 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="rounded-2xl h-14 bg-muted/30 border-none font-bold text-lg" 
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Phone Number</Label>
                  <Input 
                    value={formData.phone} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="rounded-2xl h-14 bg-muted/30 border-none font-bold text-lg" 
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>

              <div className="space-y-6 pt-8 border-t">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Regional Precision Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">State</Label>
                    <Select 
                      value={formData.state} 
                      onValueChange={(val) => setFormData({...formData, state: val, district: stateData[val][0]})}
                    >
                      <SelectTrigger className="rounded-2xl h-14 bg-muted/30 border-none font-bold text-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-2xl">
                        {Object.keys(stateData).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">District</Label>
                    <Select 
                      value={formData.district} 
                      onValueChange={(val) => setFormData({...formData, district: val})}
                    >
                      <SelectTrigger className="rounded-2xl h-14 bg-muted/30 border-none font-bold text-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-2xl">
                        {stateData[formData.state].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Village</Label>
                    <Input 
                      value={formData.village} 
                      onChange={(e) => setFormData({...formData, village: e.target.value})}
                      className="rounded-2xl h-14 bg-muted/30 border-none font-bold text-lg" 
                      placeholder="e.g. Anji"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Pincode</Label>
                    <Input 
                      value={formData.pincode} 
                      onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                      className="rounded-2xl h-14 bg-muted/30 border-none font-bold text-lg" 
                      placeholder="442XXX"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-8 border-t">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Primary Language & Communication</Label>
                <Select 
                  value={formData.languagePreference} 
                  onValueChange={(val) => setFormData({...formData, languagePreference: val})}
                >
                  <SelectTrigger className="rounded-2xl h-14 bg-muted/30 border-none font-bold text-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-2xl">
                    <SelectItem value="hindi">Hindi (हिंदी)</SelectItem>
                    <SelectItem value="marathi">Marathi (मराठी)</SelectItem>
                    <SelectItem value="telugu">Telugu (తెలుగు)</SelectItem>
                    <SelectItem value="tamil">Tamil (தமிழ்)</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                className="rounded-2xl w-full h-16 font-black text-xl shadow-2xl shadow-primary/20 hover:scale-[1.01] transition-transform" 
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : null}
                Save Profile
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] border-none shadow-sm bg-primary/5 border border-primary/20 p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="space-y-1">
                <CardTitle className="text-xl font-black">Current Plan Status</CardTitle>
                <CardDescription className="font-medium text-primary">Scalable access for modern farmers.</CardDescription>
              </div>
              <Badge className="bg-primary text-white px-4 py-1.5 rounded-full font-bold">
                {profile?.subscriptionPlan?.toUpperCase() || 'FREE'}
              </Badge>
            </div>
            <div className="flex justify-between items-center p-6 bg-white rounded-[2rem] border border-primary/10 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-black leading-none">
                    {profile?.subscriptionPlan === 'Farmer Pro' ? 'Farmer Pro Season Pass' : 'Standard Access'}
                  </p>
                  <p className="text-sm font-medium text-muted-foreground mt-1">
                    {profile?.subscriptionPlan === 'Farmer Pro' ? '₹99 per season • Active' : 'Free Limited Access'}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl border-2 font-bold px-6">Manage</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
