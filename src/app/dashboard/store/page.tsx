
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ShoppingBag, 
  MapPin, 
  Leaf, 
  ArrowRight, 
  Star, 
  CheckCircle2, 
  Search,
  Zap,
  Package,
  Clock,
  QrCode,
  ScanLine
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const products = [
  { 
    id: "1", 
    name: "Organic Cherry Tomato", 
    price: 140, 
    unit: "kg", 
    origin: "WD-047, Wardha", 
    farmer: "Sunita Devi",
    stock: 23, 
    harvest: "36 hours ago",
    img: "tomato",
    category: "Vegetables"
  },
  { 
    id: "2", 
    name: "Organic Baby Spinach", 
    price: 80, 
    unit: "250g", 
    origin: "NG-034, Nagpur", 
    farmer: "Ramesh Patel",
    stock: 12, 
    harvest: "24 hours ago",
    img: "spinach",
    category: "Superfoods"
  },
  { 
    id: "3", 
    name: "Stone-Ground Wheat", 
    price: 320, 
    unit: "5kg", 
    origin: "AM-012, Amravati", 
    farmer: "Govind Rao",
    stock: 45, 
    harvest: "1 week ago",
    img: "wheat",
    category: "Grains"
  },
  { 
    id: "4", 
    name: "Organic Moong Dal", 
    price: 220, 
    unit: "kg", 
    origin: "WD-001, Wardha", 
    farmer: "Amol G.",
    stock: 18, 
    harvest: "2 weeks ago",
    img: "pulses",
    category: "Pulses"
  },
];

export default function HaritStorePage() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div className="space-y-12 pb-20 selection:bg-emerald-100">
      {/* Metro Hero */}
      <div className="relative rounded-[3rem] bg-emerald-900 text-white overflow-hidden p-10 md:p-20">
        <Image 
          src="https://picsum.photos/seed/harit/1200/800" 
          alt="Harit Farm" 
          fill 
          className="object-cover opacity-20"
        />
        <div className="relative z-10 space-y-6 max-w-2xl">
          <Badge className="bg-white/10 text-white border-white/20 px-4 py-1.5 font-black uppercase tracking-widest text-[10px]">
            Direct From Our Leased Farms
          </Badge>
          <h1 className="text-5xl font-headline font-black leading-tight tracking-tight">
            Farm se seedha aapki thali tak.
          </h1>
          <p className="text-xl text-emerald-100/70 font-medium leading-relaxed">
            100% Certified Organic. Full Traceability. No Middlemen. Just pure nutrition grown on land we personally care for.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Button size="lg" className="rounded-2xl h-14 px-10 font-black bg-white text-emerald-900 hover:bg-emerald-50">
              Browse Harvest <ShoppingBag className="ml-2 h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3 px-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <MapPin className="h-5 w-5 text-emerald-400" />
              <span className="text-sm font-bold">Pune: Koregaon Park Delivery Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Harvest Ticker */}
      <div className="bg-primary/5 border rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Today's Fresh Batch</p>
            <p className="text-lg font-bold">Organic Baby Spinach — 48 bunches just arrived from Wardha</p>
          </div>
        </div>
        <Button variant="outline" className="rounded-xl border-2 font-bold px-6 h-12">
          Track This Batch <ScanLine className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar Categories */}
        <div className="w-full md:w-64 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-10 h-12 rounded-2xl border-none shadow-sm bg-white" placeholder="Search organic..." />
          </div>
          <div className="space-y-1">
            {["All", "Vegetables", "Grains", "Pulses", "Superfoods"].map((cat) => (
              <Button 
                key={cat} 
                variant={activeCategory === cat ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start rounded-xl h-11 font-bold",
                  activeCategory === cat ? "bg-primary/10 text-primary" : ""
                )}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>

          <Card className="rounded-3xl border-none shadow-sm bg-primary text-white p-6 space-y-4">
            <Package className="h-8 w-8 opacity-50" />
            <h4 className="font-bold text-lg">Weekly Harit Box</h4>
            <p className="text-xs text-primary-foreground/80 leading-relaxed">
              Subscribe to a seasonal box of the best organic produce. Saves 20% vs single orders.
            </p>
            <Button className="w-full bg-white text-primary hover:bg-emerald-50 font-black rounded-xl h-10 text-xs">
              BUILD MY BOX
            </Button>
          </Card>
        </div>

        {/* Product Grid */}
        <div className="flex-1 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((item) => (
              <Card key={item.id} className="rounded-[2rem] border-none shadow-sm overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-500">
                <div className="relative aspect-square bg-muted/20">
                  <Image 
                    src={`https://picsum.photos/seed/${item.img}/400/400`} 
                    alt={item.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 backdrop-blur-md text-emerald-900 border-none px-3 py-1 font-bold">
                      {item.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6 space-y-4 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight">{item.name}</h3>
                      <p className="text-xs font-medium text-muted-foreground mt-1 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-primary" /> {item.origin}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-emerald-700">₹{item.price}</p>
                      <p className="text-[10px] font-bold text-muted-foreground">per {item.unit}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t flex flex-col gap-3">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      <span>Harvested</span>
                      <span className="text-primary">{item.harvest}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      <span>Stock</span>
                      <span>{item.stock} {item.unit} left</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl shrink-0 border-2">
                          <QrCode className="h-5 w-5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="rounded-[2.5rem] p-8 max-w-lg">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-black text-center mb-6">Farm Story: {item.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-8">
                          <div className="relative aspect-video rounded-3xl overflow-hidden border-4 border-muted">
                            <Image src="https://picsum.photos/seed/farm1/600/400" alt="The Farm" fill className="object-cover" />
                            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm">
                              <p className="text-[10px] font-black text-muted-foreground uppercase">Landowner</p>
                              <p className="text-sm font-black">{item.farmer}</p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4" /> Organic Cultivation Log
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="p-3 bg-muted/30 rounded-2xl">
                                <p className="text-[10px] font-black text-muted-foreground uppercase">Fertilizer</p>
                                <p className="text-xs font-bold">Cow Dung Compost</p>
                              </div>
                              <div className="p-3 bg-muted/30 rounded-2xl">
                                <p className="text-[10px] font-black text-muted-foreground uppercase">Pesticide</p>
                                <p className="text-xs font-bold">Organic Neem Oil</p>
                              </div>
                            </div>
                            <p className="text-xs font-medium leading-relaxed text-muted-foreground">
                              "This land belongs to a farmer family in {item.origin.split(', ')[1]} who receives guaranteed annual rent — ensuring their livelihood while we regenerate their soil."
                            </p>
                          </div>
                          <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-3xl border border-primary/20">
                            <Clock className="h-5 w-5 text-primary" />
                            <div className="text-[10px] font-bold">
                              <p className="text-muted-foreground uppercase">Journey Duration</p>
                              <p className="text-foreground">Sowed 84 days ago • Harvested {item.harvest} • At your door tomorrow</p>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button className="flex-1 rounded-xl h-12 font-black shadow-lg shadow-primary/20 bg-primary">
                      ADD TO CART
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
