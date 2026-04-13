
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
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser, useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import Link from "next/link";

const equipmentMock = [
  { id: "1", type: "Tractor", model: "Mahindra 575 DI", village: "Anji", district: "Wardha", pincode: "442001", price: "₹800/hr", provider: "Rajesh K.", rating: 4.8, status: "Available" },
  { id: "2", type: "Harvester", model: "John Deere W70", village: "Seloo", district: "Wardha", pincode: "442102", price: "₹2,500/hr", provider: "Vikram S.", rating: 4.5, status: "Busy" },
  { id: "3", type: "Tractor", model: "Swaraj 744 FE", village: "Anji", district: "Wardha", pincode: "442001", price: "₹750/hr", provider: "Amit P.", rating: 4.9, status: "Available" },
  { id: "4", type: "Plough", model: "Universal 3-Bottom", village: "Deoli", district: "Wardha", pincode: "442301", price: "₹400/hr", provider: "Amol G.", rating: 4.6, status: "Available" },
];

const laborMock = [
  { id: "1", type: "Sowing Group", count: 12, village: "Deoli", district: "Wardha", pincode: "442301", price: "₹450/day", contractor: "Suresh Group", rating: 4.7, availability: "Immediate" },
  { id: "2", type: "Harvesting Team", count: 25, village: "Anji", district: "Wardha", pincode: "442001", price: "₹500/day", contractor: "Janata Labor", rating: 4.4, availability: "Next Week" },
  { id: "3", type: "Pesticide Spray", count: 5, village: "Seloo", district: "Wardha", pincode: "442102", price: "₹600/day", contractor: "SafeCrop Team", rating: 4.9, availability: "Immediate" },
];

export default function FarmServicesPage() {
  const { user } = useUser();
  const db = useFirestore();
  const [searchTerm, setSearchTerm] = useState("");

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userRef);

  const filteredEquipment = useMemo(() => {
    return equipmentMock.filter(item => {
      const matchesSearch = 
        item.model.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    }).sort((a, b) => {
      // Prioritize village then district
      if (profile?.village && a.village === profile.village && b.village !== profile.village) return -1;
      if (profile?.village && b.village === profile.village && a.village !== profile.village) return 1;
      if (profile?.district && a.district === profile.district && b.district !== profile.district) return -1;
      if (profile?.district && b.district === profile.district && a.district !== profile.district) return 1;
      return 0;
    });
  }, [searchTerm, profile]);

  const filteredLabor = useMemo(() => {
    return laborMock.filter(item => {
      const matchesSearch = 
        item.contractor.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    }).sort((a, b) => {
      if (profile?.village && a.village === profile.village && b.village !== profile.village) return -1;
      if (profile?.village && b.village === profile.village && a.village !== profile.village) return 1;
      return 0;
    });
  }, [searchTerm, profile]);

  const hasLocation = profile?.village || profile?.district;

  if (isProfileLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Farm Services</h1>
          <p className="text-muted-foreground">Find tractors, harvesters, and labor groups near you.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl border-primary/20">
            My Listings
          </Button>
          <Button className="rounded-xl shadow-lg shadow-primary/20 bg-primary">
            <Plus className="mr-2 h-4 w-4" /> Register Service
          </Button>
        </div>
      </div>

      {!hasLocation && (
        <Card className="rounded-2xl border-none bg-amber-50 border border-amber-200">
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <p className="text-sm font-medium text-amber-800">
                Complete your location profile to see services in your village.
              </p>
            </div>
            <Button size="sm" variant="outline" className="rounded-lg bg-white border-amber-300 text-amber-800 hover:bg-amber-100" asChild>
              <Link href="/dashboard/settings">Settings</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {hasLocation && (
        <div className="flex items-center gap-2 text-sm text-primary font-bold bg-primary/5 w-fit px-4 py-2 rounded-full border border-primary/10">
          <MapPin className="h-4 w-4" />
          Showing services for: {profile?.village || 'Local'}, {profile?.district}
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input 
          className="pl-11 h-12 rounded-2xl bg-white border-none shadow-sm" 
          placeholder="Search by equipment, village or district..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="equipment" className="w-full">
        <TabsList className="bg-muted/50 p-1 rounded-2xl mb-8">
          <TabsTrigger value="equipment" className="rounded-xl px-8 data-[state=active]:bg-primary data-[state=active]:text-white">
            <Truck className="mr-2 h-4 w-4" /> Equipment
          </TabsTrigger>
          <TabsTrigger value="labor" className="rounded-xl px-8 data-[state=active]:bg-primary data-[state=active]:text-white">
            <Users className="mr-2 h-4 w-4" /> Labor & Workers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="equipment" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipment.map((item) => (
              <Card key={item.id} className="rounded-2xl border-none shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                <div className="h-48 bg-muted relative">
                  <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                    <Badge className={cn(
                      "rounded-lg font-bold",
                      item.status === "Available" ? "bg-emerald-500" : "bg-amber-500"
                    )}>
                      {item.status}
                    </Badge>
                    {profile?.village === item.village && (
                      <Badge className="bg-primary text-white border-none shadow-sm">Your Village</Badge>
                    )}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <Truck className="h-24 w-24 text-primary" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.type}</p>
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{item.model}</h3>
                    </div>
                    <div className="flex items-center gap-1 bg-primary/5 px-2 py-1 rounded-lg">
                      <Star className="h-3 w-3 text-accent fill-accent" />
                      <span className="text-xs font-bold">{item.rating}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      {item.village}, {item.district}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-primary">
                      {item.price}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                        {item.provider.charAt(0)}
                      </div>
                      <span className="text-xs font-medium">{item.provider}</span>
                    </div>
                    <Button size="sm" className="rounded-xl">
                      <Phone className="mr-2 h-3 w-3" /> Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredEquipment.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <p className="text-muted-foreground">No equipment services found matching your criteria.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="labor" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLabor.map((item) => (
              <Card key={item.id} className="rounded-2xl border-none shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                <CardHeader className="bg-primary/5 pb-4">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="border-primary/20 text-primary">{item.type}</Badge>
                    <div className="flex items-center gap-1 text-xs font-bold">
                      <Star className="h-3 w-3 text-accent fill-accent" />
                      {item.rating}
                    </div>
                  </div>
                  <CardTitle className="mt-4">{item.contractor}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Users className="h-3 w-3" /> {item.count} Workers Available
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="font-bold flex items-center gap-1">
                        {profile?.village === item.village && <span className="h-2 w-2 rounded-full bg-primary" />}
                        {item.village}, {item.district}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Rate:</span>
                      <span className="font-bold text-primary">{item.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Availability:</span>
                      <Badge variant="secondary" className="rounded-lg">{item.availability}</Badge>
                    </div>
                  </div>
                  <Button className="w-full mt-6 rounded-xl">
                    Request Booking <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
            {filteredLabor.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <p className="text-muted-foreground">No labor services found matching your criteria.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Card className="rounded-2xl border-none shadow-sm bg-accent/10 border border-accent/20">
        <CardContent className="p-6 flex items-start gap-4">
          <div className="bg-accent/20 p-2 rounded-xl">
            <Info className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h4 className="font-bold text-accent">Service Verification</h4>
            <p className="text-sm text-muted-foreground mt-1">
              All services listed on KrishiAI undergo village-level verification. 
              {profile?.district ? ` We are currently prioritizing providers in the ${profile.district} area.` : ''}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
