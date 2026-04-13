
"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Truck, 
  Users, 
  MapPin, 
  Phone, 
  Plus, 
  Search, 
  ArrowRight, 
  Star,
  Clock,
  CheckCircle2,
  Info,
  Loader2,
  AlertCircle,
  ShoppingBasket,
  Store,
  Settings,
  X,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser, useDoc, useFirestore, useMemoFirebase, useCollection } from "@/firebase";
import { doc, collection, addDoc, serverTimestamp, query, where, orderBy } from "firebase/firestore";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

// Mock data for initial empty state or offline
const initialMockServices = [
  { id: "e1", category: "Equipment", type: "Tractor", title: "Mahindra 575 DI", village: "Anji", district: "Wardha", pincode: "442001", price: "₹800/hr", provider: "Rajesh K.", rating: 4.8, status: "Available" },
  { id: "l1", category: "Labor", type: "Sowing Group", title: "Suresh Sowing Team", village: "Deoli", district: "Wardha", pincode: "442301", price: "₹450/day", contractor: "Suresh D.", rating: 4.7, availability: "Immediate" },
  { id: "i1", category: "Inputs", type: "Seed Shop", title: "Bharat Seeds & Fertilizers", village: "Anji", district: "Wardha", pincode: "442001", price: "Market Rates", provider: "Amol G.", rating: 4.9, status: "Open" },
];

export default function FarmServicesPage() {
  const { user } = useUser();
  const db = useFirestore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userRef);

  // Firestore query for services
  const servicesRef = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, "farmServices");
  }, [db]);

  const { data: firestoreServices, isLoading: isServicesLoading } = useCollection(servicesRef);

  const allServices = useMemo(() => {
    const combined = [...initialMockServices];
    if (firestoreServices) {
      firestoreServices.forEach(fs => {
        if (!combined.find(c => c.id === fs.id)) {
          combined.push({
            id: fs.id,
            category: fs.category,
            type: fs.type,
            title: fs.title,
            village: fs.village,
            district: fs.district,
            pincode: fs.pincode,
            price: fs.unit ? `₹${fs.price}/${fs.unit}` : `₹${fs.price}`,
            provider: fs.providerName || "Local Provider",
            rating: fs.rating || 4.5,
            status: fs.status || "Available",
            ...fs
          });
        }
      });
    }
    return combined;
  }, [firestoreServices]);

  const filteredServices = useMemo(() => {
    return allServices.filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    }).sort((a, b) => {
      // Prioritize village then district based on profile
      if (profile?.village) {
        if (a.village === profile.village && b.village !== profile.village) return -1;
        if (b.village === profile.village && a.village !== profile.village) return 1;
      }
      if (profile?.district) {
        if (a.district === profile.district && b.district !== profile.district) return -1;
        if (b.district === profile.district && a.district !== profile.district) return 1;
      }
      return 0;
    });
  }, [searchTerm, profile, allServices]);

  const handleRegisterService = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !db) return;

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    const newService = {
      providerId: user.uid,
      providerName: profile?.name || user.displayName || "Unknown",
      category: formData.get("category"),
      type: formData.get("type"),
      title: formData.get("title"),
      description: formData.get("description"),
      price: Number(formData.get("price")),
      unit: formData.get("unit"),
      village: formData.get("village") || profile?.village || "",
      district: formData.get("district") || profile?.district || "",
      pincode: formData.get("pincode") || profile?.pincode || "",
      phone: formData.get("phone") || profile?.phone || "",
      rating: 5.0,
      status: "Available",
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "farmServices"), newService);
      toast({
        title: "Service Registered!",
        description: "Your service is now live for farmers in your area.",
      });
      setIsRegisterOpen(false);
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "Could not list your service. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isProfileLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Hero / Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <Badge variant="outline" className="rounded-full border-primary/20 text-primary bg-primary/5 px-4 py-1.5 font-bold flex items-center gap-2 w-fit">
            <Sparkles className="h-3 w-3 fill-primary" /> Krishi Mitra Marketplace
          </Badge>
          <h1 className="text-4xl font-headline font-black tracking-tight">Farm Services</h1>
          <p className="text-muted-foreground text-lg">Hyper-local access to tractors, labor groups, and input supplies.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="rounded-2xl border-2 font-bold bg-white h-12 px-6">
            My Listings
          </Button>
          
          <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-2xl h-12 px-8 font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105">
                <Plus className="mr-2 h-5 w-5" /> List My Service
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-[2.5rem] p-10 max-w-2xl bg-white border-none shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-3xl font-black">Register as Provider</DialogTitle>
                <CardDescription className="text-lg">Become a part of the KrishiMitra local economy.</CardDescription>
              </DialogHeader>
              <form onSubmit={handleRegisterService} className="space-y-6 mt-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category</Label>
                    <Select name="category" required defaultValue="Equipment">
                      <SelectTrigger className="rounded-2xl h-12 bg-muted/30 border-none font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-2xl">
                        <SelectItem value="Equipment">Equipment (Tractor/Harvester)</SelectItem>
                        <SelectItem value="Labor">Labor Group</SelectItem>
                        <SelectItem value="Inputs">Inputs (Seeds/Fertilizer)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Service Type</Label>
                    <Input name="type" placeholder="e.g. 50HP Tractor, Wheat Labor" required className="rounded-2xl h-12 bg-muted/30 border-none font-bold" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Title / Shop Name</Label>
                  <Input name="title" placeholder="e.g. Mahavir Agro Center" required className="rounded-2xl h-12 bg-muted/30 border-none font-bold text-lg" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Price (₹)</Label>
                    <Input name="price" type="number" placeholder="500" required className="rounded-2xl h-12 bg-muted/30 border-none font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Unit</Label>
                    <Select name="unit" required defaultValue="hour">
                      <SelectTrigger className="rounded-2xl h-12 bg-muted/30 border-none font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-2xl">
                        <SelectItem value="hour">Per Hour</SelectItem>
                        <SelectItem value="day">Per Day</SelectItem>
                        <SelectItem value="acre">Per Acre</SelectItem>
                        <SelectItem value="unit">Per Unit (Fixed)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Village</Label>
                    <Input name="village" defaultValue={profile?.village} required className="rounded-xl h-10 bg-muted/30 border-none font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">District</Label>
                    <Input name="district" defaultValue={profile?.district} required className="rounded-xl h-10 bg-muted/30 border-none font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Phone</Label>
                    <Input name="phone" defaultValue={profile?.phone} required className="rounded-xl h-10 bg-muted/30 border-none font-bold" />
                  </div>
                </div>

                <Button type="submit" className="w-full h-14 rounded-2xl text-xl font-black shadow-xl shadow-primary/20" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : "Publish Listing"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {!profile?.village && (
        <Card className="rounded-3xl border-none bg-amber-50 border-2 border-dashed border-amber-200">
          <CardContent className="p-8 flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-amber-100 rounded-2xl text-amber-700">
                <AlertCircle className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black text-amber-900">Location Missing</h4>
                <p className="text-sm font-medium text-amber-800/80 max-w-md leading-relaxed">
                  We need your village data to show you the closest services first. It only takes a minute to set up.
                </p>
              </div>
            </div>
            <Button className="rounded-2xl bg-amber-600 hover:bg-amber-700 font-bold h-12 px-8" asChild>
              <Link href="/dashboard/settings">Update Profile</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {profile?.village && (
        <div className="flex items-center gap-3 text-sm text-primary font-black bg-primary/5 w-fit px-6 py-3 rounded-2xl border border-primary/20 shadow-sm">
          <MapPin className="h-5 w-5" />
          <span className="uppercase tracking-widest text-xs">Serving: {profile.village}, {profile.district}</span>
        </div>
      )}

      <div className="relative group max-w-3xl">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input 
          className="pl-14 h-16 rounded-3xl bg-white border-none shadow-sm text-lg font-medium focus-visible:ring-primary/20" 
          placeholder="Search for 'Tractor', 'Labor' or specific village..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="Equipment" className="w-full">
        <TabsList className="bg-muted/50 p-2 rounded-[2rem] mb-10 h-16 inline-flex gap-2">
          {["Equipment", "Labor", "Inputs"].map((tab) => (
            <TabsTrigger 
              key={tab}
              value={tab} 
              className="rounded-2xl px-10 font-black h-full text-sm data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-xl transition-all"
            >
              {tab === "Equipment" && <Truck className="mr-2 h-4 w-4" />}
              {tab === "Labor" && <Users className="mr-2 h-4 w-4" />}
              {tab === "Inputs" && <ShoppingBasket className="mr-2 h-4 w-4" />}
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        {["Equipment", "Labor", "Inputs"].map((cat) => (
          <TabsContent key={cat} value={cat} className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.filter(s => s.category === cat).map((item) => (
                <Card key={item.id} className="rounded-[2.5rem] border-none shadow-sm overflow-hidden hover:shadow-2xl transition-all group bg-white">
                  <div className="h-48 bg-muted/20 relative p-6">
                    <div className="absolute top-6 right-6 flex flex-col gap-2 items-end z-10">
                      <Badge className={cn(
                        "rounded-xl px-3 py-1 font-bold border-none",
                        item.status === "Available" || item.status === "Open" ? "bg-emerald-500" : "bg-amber-500"
                      )}>
                        {item.status}
                      </Badge>
                      {profile?.village === item.village && (
                        <Badge className="bg-primary text-white border-none shadow-lg px-3 py-1 rounded-xl">In Your Village</Badge>
                      )}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-5 group-hover:opacity-10 transition-opacity">
                      {cat === "Equipment" && <Truck className="h-32 w-32 text-primary" />}
                      {cat === "Labor" && <Users className="h-32 w-32 text-primary" />}
                      {cat === "Inputs" && <Store className="h-32 w-32 text-primary" />}
                    </div>
                    <div className="relative z-10 mt-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{item.type}</p>
                      <h3 className="text-2xl font-black group-hover:text-primary transition-colors leading-tight">{item.title}</h3>
                    </div>
                  </div>
                  <CardContent className="p-8 space-y-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
                        <div className="p-2 bg-muted/50 rounded-lg"><MapPin className="h-4 w-4 text-primary" /></div>
                        {item.village}, {item.district}
                      </div>
                      <div className="flex items-center gap-3 text-2xl font-black text-primary">
                        {item.price}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary">
                          {item.provider?.charAt(0) || "P"}
                        </div>
                        <div>
                          <p className="text-xs font-black leading-none">{item.provider}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-3 w-3 text-accent fill-accent" />
                            <span className="text-[10px] font-bold">{item.rating}</span>
                          </div>
                        </div>
                      </div>
                      <Button className="rounded-xl font-bold h-11 px-6 shadow-lg shadow-primary/10 transition-transform hover:scale-105" asChild>
                        <a href={`tel:${item.phone || '18005550199'}`}>
                          <Phone className="mr-2 h-4 w-4" /> Contact
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredServices.filter(s => s.category === cat).length === 0 && (
                <div className="col-span-full py-32 text-center bg-muted/10 rounded-[3rem] border-2 border-dashed flex flex-col items-center justify-center gap-4">
                  <div className="p-6 bg-white rounded-full shadow-sm"><Info className="h-10 w-10 text-muted-foreground/40" /></div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-black">No services found</h3>
                    <p className="text-sm text-muted-foreground font-medium">Try broadening your search or be the first to list a service!</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Trust Banner */}
      <Card className="rounded-[3rem] border-none shadow-sm bg-emerald-950 text-white p-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-5 pointer-events-none">
          <CheckCircle2 className="w-full h-full" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <h3 className="text-3xl font-black">Verified Local Economy</h3>
            <p className="text-lg text-emerald-100/70 font-medium leading-relaxed">
              Every service listed here is verified by our field operations team. We prioritize local providers to keep the economy thriving within your village.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
              <div className="px-5 py-2 bg-white/10 rounded-2xl border border-white/20 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" /> Identity Verified
              </div>
              <div className="px-5 py-2 bg-white/10 rounded-2xl border border-white/20 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" /> Price Transparency
              </div>
            </div>
          </div>
          <Button variant="secondary" className="rounded-2xl h-16 px-10 font-black bg-white text-emerald-900 hover:bg-emerald-50 text-lg shadow-2xl" asChild>
            <Link href="/dashboard/settings">Complete Profile <ArrowRight className="ml-2 h-6 w-6" /></Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
