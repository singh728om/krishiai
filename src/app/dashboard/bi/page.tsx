
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Map, 
  ShoppingBag, 
  Users, 
  Coins, 
  ArrowUpRight, 
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  PieChart,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function IntelligenceBIPage() {
  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-black tracking-tight">CEO Dashboard</h1>
          <p className="text-muted-foreground font-medium">Integrated Business Intelligence for KrishiMitra Ecosystem.</p>
        </div>
        <div className="flex gap-3">
          <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2 rounded-xl font-bold">
            <span className="h-2 w-2 bg-primary rounded-full animate-pulse mr-2" /> Live Ops Mode
          </Badge>
          <Button variant="outline" className="rounded-xl font-bold border-2">Export Board Report</Button>
        </div>
      </div>

      {/* KPI Rows */}
      <div className="space-y-8">
        {/* Row 1: Land */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Map className="h-4 w-4" /> Vertical A: Bhumi Lease Management
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: "Total Leased", value: "847 Acres", sub: "134 Active Plots", trend: "+12 this week" },
              { label: "Rent Committed", value: "₹89.4L/yr", sub: "Avg ₹10,540/ac", trend: "On Budget" },
              { label: "New Apps", value: "42", sub: "Under Inspection", trend: "High Demand", color: "text-amber-600" },
              { label: "Portfolio Health", value: "98.2%", sub: "Soil Quality ↑", trend: "Verified", color: "text-emerald-600" },
            ].map((stat, i) => (statCard(stat, i)))}
          </div>
        </div>

        {/* Row 2: Cultivation */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Target className="h-4 w-4" /> Vertical B: Organic Cultivation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: "Crops in Ground", value: "4 Types", sub: "Cotton, Soybean, Veg", trend: "Kharif Phase" },
              { label: "Harvest Forecast", value: "₹6.2Cr", sub: "23 Plots this mo", trend: "+8.4% yield" },
              { label: "Field Monitors", value: "18", sub: "1 monitor / 47 ac", trend: "Optimal Load" },
              { label: "Cert. Status", value: "100%", sub: "PGS-India Organic", trend: "Verified", color: "text-emerald-600" },
            ].map((stat, i) => (statCard(stat, i)))}
          </div>
        </div>

        {/* Row 3: Store */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" /> Vertical C: Harit Retail Store
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: "Revenue MTD", value: "₹38.4L", sub: "6 Active Stores", trend: "+23% MoM" },
              { label: "Subscriptions", value: "847", sub: "Weekly Veg Box", trend: "₹4.2L MRR" },
              { label: "Waste %", value: "2.1%", sub: "Target <2%", trend: "Decreasing", color: "text-emerald-600" },
              { label: "NPS Score", value: "74", sub: "Customer Sat", trend: "High Trust", color: "text-primary" },
            ].map((stat, i) => (statCard(stat, i)))}
          </div>
        </div>
      </div>

      {/* Integrated Profit Flow */}
      <Card className="rounded-[3rem] border-none shadow-sm bg-emerald-950 text-white p-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-5">
          <TrendingUp className="w-full h-full" />
        </div>
        <div className="relative z-10 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black font-headline">Integrated Profit Flow Analysis</h2>
            <p className="text-emerald-100/60 font-medium">Vertical integration saves ₹2.1Cr in middleman margins annually.</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 hidden md:block -translate-y-1/2" />
            {[
              { label: "Leased Land", amount: "₹89.4L", sub: "Rent Cost", icon: Map },
              { label: "Cultivation", amount: "₹1.8Cr", sub: "Inputs/Labour", icon: Sprout },
              { label: "Harvest Value", amount: "₹6.2Cr", sub: "Market Est.", icon: Zap },
              { label: "Store Revenue", amount: "₹8.4Cr", sub: "Retail Sales", icon: ShoppingBag },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center space-y-4 relative z-10 w-full md:w-auto">
                <div className="h-20 w-20 rounded-[2rem] bg-white text-emerald-900 flex items-center justify-center shadow-2xl">
                  <step.icon className="h-10 w-10" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-black">{step.amount}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-100/60">{step.label}</p>
                  <p className="text-[10px] text-emerald-100/40 italic">{step.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-1 text-center md:text-left">
              <p className="text-sm font-black uppercase tracking-widest text-primary">Annualized Net Margin</p>
              <h3 className="text-5xl font-black">₹4.6Cr <span className="text-xl text-primary font-bold">(54%)</span></h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-[10px] font-bold text-emerald-100/60 uppercase">Direct Distribution Gain</p>
                <p className="text-sm font-black">+₹2.1Cr Savings</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-[10px] font-bold text-emerald-100/60 uppercase">Traceability Premium</p>
                <p className="text-sm font-black">+34% Basket Value</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Waste Efficiency", desc: "Subscription model reduced waste by 41% vs walk-in retail.", icon: BarChart3 },
          { title: "Scale Potential", desc: "Wardha cluster is 100% leased. Expanding to Nagpur Rural next month.", icon: ArrowUpRight },
          { title: "Top Performing Crop", desc: "Cherry Tomato yields 82% net margin at Bandra store.", icon: Zap },
        ].map((insight, i) => (
          <Card key={i} className="rounded-3xl border-none shadow-sm p-8 bg-white space-y-4">
            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <insight.icon className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-lg">{insight.title}</h4>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">{insight.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

function statCard(stat: any, i: number) {
  return (
    <Card key={i} className="rounded-3xl border-none shadow-sm hover:shadow-xl transition-all duration-300 group bg-white overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
          <Badge className={cn("rounded-lg text-[8px] font-black", stat.color || "bg-primary/10 text-primary")}>
            {stat.trend}
          </Badge>
        </div>
        <h4 className="text-2xl font-black">{stat.value}</h4>
        <p className="text-[10px] font-bold text-muted-foreground mt-1">{stat.sub}</p>
      </CardContent>
    </Card>
  );
}

function Sprout(props: any) {
  return <SproutIcon {...props} />;
}

import { Sprout as SproutIcon } from "lucide-react";
