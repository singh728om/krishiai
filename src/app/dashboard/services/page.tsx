
"use client";

import { useState } from "react";
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
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

const equipmentMock = [
  { id: "1", type: "Tractor", model: "Mahindra 575 DI", village: "Anji", price: "₹800/hr", provider: "Rajesh K.", rating: 4.8, status: "Available" },
  { id: "2", type: "Harvester", model: "John Deere W70", village: "Seloo", price: "₹2,500/hr", provider: "Vikram S.", rating: 4.5, status: "Busy" },
  { id: "3", type: "Tractor", model: "Swaraj 744 FE", village: "Anji", price: "₹750/hr", provider: "Amit P.", rating: 4.9, status: "Available" },
];

const laborMock = [
  { id: "1", type: "Sowing Group", count: 12, village: "Deoli", price: "₹450/day", contractor: "Suresh Group", rating: 4.7, availability: "Immediate" },
  { id: "2", type: "Harvesting Team", count: 25, village: "Anji", price: "₹500/day", contractor: "Janata Labor", rating: 4.4, availability: "Next Week" },
];

export default function FarmServicesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Farm Services</h1>
          <p className="text-muted-foreground">Find tractors, harvesters, and labor groups near your village.</p>
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
            {equipmentMock.map((item) => (
              <Card key={item.id} className="rounded-2xl border-none shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                <div className="h-48 bg-muted relative">
                  <div className="absolute top-4 right-4">
                    <Badge className={cn(
                      "rounded-lg font-bold",
                      item.status === "Available" ? "bg-emerald-500" : "bg-amber-500"
                    )}>
                      {item.status}
                    </Badge>
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
                      <MapPin className="h-4 w-4" />
                      {item.village}, Wardha
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
          </div>
        </TabsContent>

        <TabsContent value="labor" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {laborMock.map((item) => (
              <Card key={item.id} className="rounded-2xl border-none shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                <CardHeader className="bg-primary/5 pb-4">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="border-primary/20 text-primary">{item.type}</Badge>
                    <div className="flex items-center gap-1 text-xs font-bold">
                      <Star className="h-3 w-3 text-accent fill-accent" />
                      {item.rating}
                    </div>
                  </div>
                  <CardTitle className="mt-4">{item.contractorName}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Users className="h-3 w-3" /> {item.count} Workers Available
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="font-bold">{item.village}</span>
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
          </div>
        </TabsContent>
      </Tabs>

      {/* Info Banner */}
      <Card className="rounded-2xl border-none shadow-sm bg-accent/10 border border-accent/20">
        <CardContent className="p-6 flex items-start gap-4">
          <div className="bg-accent/20 p-2 rounded-xl">
            <Info className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h4 className="font-bold text-accent">Service Verification</h4>
            <p className="text-sm text-muted-foreground mt-1">
              All tractor and labor services listed on KrishiAI undergo a village-level verification process. 
              Always verify equipment condition before payment.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
