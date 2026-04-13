
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Map, 
  Coins, 
  ShieldCheck, 
  Sprout, 
  ArrowRight, 
  CheckCircle2, 
  Calculator,
  Calendar,
  Phone,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const districts = ["Wardha", "Nagpur", "Amravati", "Yavatmal", "Pune", "Nashik"];

export default function LeaseLandPage() {
  const [calcData, setCalcData] = useState({
    district: "Wardha",
    acres: 5,
    soil: "black",
    irrigation: "yes"
  });

  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    const baseRates: Record<string, number> = {
      Wardha: 10000,
      Nagpur: 11500,
      Amravati: 9500,
      Yavatmal: 8500,
      Pune: 18000,
      Nashik: 15000
    };

    const base = baseRates[calcData.district] || 10000;
    const irrigationBonus = calcData.irrigation === "yes" ? 2000 : 0;
    const soilBonus = calcData.soil === "black" ? 1500 : 0;
    
    const ratePerAcre = base + irrigationBonus + soilBonus;
    const total = ratePerAcre * calcData.acres;

    setResult({
      rate: ratePerAcre,
      total: total,
      base: base,
      bonuses: irrigationBonus + soilBonus
    });
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <div className="relative rounded-[2.5rem] bg-emerald-950 text-white p-10 md:p-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
          <Map className="w-full h-full" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-6">
          <Badge className="bg-primary/20 text-primary-foreground border-none px-4 py-1">
            Apni Zameen Lease Karo
          </Badge>
          <h1 className="text-5xl font-headline font-black leading-tight">
            Apni khaali zameen se guaranteed income pao — <span className="text-primary italic">bina koi kaam kiye</span>
          </h1>
          <p className="text-lg text-emerald-100/80 font-medium">
            Join the KrishiMitra Land Lease program. We farm your land organically, you get a fixed annual rent. Zero risk, better soil.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Button size="lg" className="rounded-2xl h-14 px-8 font-bold bg-primary text-white hover:bg-primary/90">
              Start Application <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="rounded-2xl h-14 px-8 font-bold border-2 border-white/20 text-white hover:bg-white/10">
              View Sample Agreement
            </Button>
          </div>
        </div>
      </div>

      {/* Promise Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Guaranteed Rent", desc: "Fasal ho ya na ho, aapka rent fix hai. Paid in advance every season.", icon: Coins, color: "text-amber-500", bg: "bg-amber-50" },
          { title: "1-3 Year Flexible Lease", desc: "Zameen aapki hi rahegi. Short term agreements with easy renewal.", icon: Calendar, color: "text-blue-500", bg: "bg-blue-50" },
          { title: "Soil Health Improvement", desc: "Hum sirf organic kheti karte hain. Aapki zameen ki quality badhegi.", icon: Sprout, color: "text-emerald-500", bg: "bg-emerald-50" },
        ].map((item, i) => (
          <Card key={i} className="rounded-3xl border-none shadow-sm p-8 flex flex-col items-center text-center space-y-4">
            <div className={cn("p-4 rounded-2xl", item.bg)}>
              <item.icon className={cn("h-8 w-8", item.color)} />
            </div>
            <h3 className="text-xl font-bold">{item.title}</h3>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Rate Calculator */}
        <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden flex flex-col bg-white">
          <CardHeader className="bg-primary/5 p-8 border-b">
            <div className="flex items-center gap-3">
              <Calculator className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl font-black">AI Lease Rate Calculator</CardTitle>
            </div>
            <CardDescription className="text-base font-medium">Find out the exact annual rent for your plot.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="font-bold">District</Label>
                <Select value={calcData.district} onValueChange={(v) => setCalcData({...calcData, district: v})}>
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Land Size (Acres)</Label>
                <Input type="number" value={calcData.acres} onChange={(e) => setCalcData({...calcData, acres: Number(e.target.value)})} className="rounded-xl h-12" />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Soil Type</Label>
                <Select value={calcData.soil} onValueChange={(v) => setCalcData({...calcData, soil: v})}>
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="black">Black Soil (Kaali)</SelectItem>
                    <SelectItem value="red">Red Soil (Laal)</SelectItem>
                    <SelectItem value="alluvial">Alluvial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Irrigation</Label>
                <Select value={calcData.irrigation} onValueChange={(v) => setCalcData({...calcData, irrigation: v})}>
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleCalculate} className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20">
              Calculate Payout
            </Button>

            {result && (
              <div className="pt-6 border-t mt-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-emerald-700/60 mb-1">Aapki Zameen Ka Rate</p>
                    <p className="text-4xl font-black text-emerald-700">₹{result.rate.toLocaleString()}<span className="text-sm">/acre/year</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black uppercase tracking-widest text-emerald-700/60 mb-1">Total Annual Payout</p>
                    <p className="text-3xl font-black text-emerald-700">₹{result.total.toLocaleString()}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/30 rounded-2xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">District Base</p>
                    <p className="font-bold">₹{result.base.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-2xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Quality Bonus</p>
                    <p className="font-bold text-primary">+₹{result.bonuses.toLocaleString()}</p>
                  </div>
                </div>
                <Alert className="bg-amber-50 border-amber-200">
                  <Coins className="h-4 w-4 text-amber-600" />
                  <AlertTitle className="text-amber-800 font-bold">Safe vs Risky</AlertTitle>
                  <AlertDescription className="text-amber-700 text-sm">
                    खुद खेती में ₹85,000 कमा सकते हैं पर ₹40,000 का रिस्क है। Lease safer है — zero effort, guaranteed income.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Active Leases */}
        <div className="space-y-8">
          <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="p-8 border-b">
              <CardTitle className="text-2xl font-black">My Lease Dashboard</CardTitle>
              <CardDescription className="text-base font-medium">Monitor your enrolled plots and payments.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="flex items-center gap-6 p-6 bg-primary/5 rounded-3xl border border-primary/10">
                <div className="h-16 w-16 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                  <Sprout className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-lg">Plot ID: WD-047</h4>
                    <Badge className="bg-emerald-500 text-white border-none">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">Anji Village • 4.5 Acres • Organic Cotton</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="rounded-2xl p-4 bg-muted/20 border-none">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Field Monitor</p>
                  <p className="font-bold text-sm">Vijay Kumar</p>
                  <p className="text-[10px] font-bold text-primary mt-1">9876543210</p>
                </Card>
                <Card className="rounded-2xl p-4 bg-muted/20 border-none">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Next Payment</p>
                  <p className="font-bold text-sm">15 March 2025</p>
                  <p className="text-[10px] font-bold text-accent mt-1">47 days left</p>
                </Card>
              </div>

              <div className="space-y-4">
                <h5 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Recent Rent Credits</h5>
                <Table>
                  <TableBody>
                    {[
                      { date: "Oct 12, 2024", amount: "₹23,625", ref: "TXN...847" },
                      { date: "Jun 05, 2024", amount: "₹23,625", ref: "TXN...212" },
                    ].map((row, i) => (
                      <TableRow key={i} className="hover:bg-transparent border-none">
                        <TableCell className="p-0 py-2 font-medium text-sm">{row.date}</TableCell>
                        <TableCell className="p-0 py-2 text-right font-black text-primary">{row.amount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Button variant="outline" className="w-full rounded-2xl h-12 font-bold border-2">
                Download Lease Agreement
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-accent/5 p-8 border border-accent/10">
            <h4 className="font-bold text-accent mb-2 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" /> Trust & Security
            </h4>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              Every lease is backed by a legal contract and registered under district agricultural norms. First month rent is paid as advance before we take possession of the land.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Alert({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("flex gap-3 p-4 rounded-2xl border items-start", className)}>
      {children}
    </div>
  );
}

function AlertTitle({ children, className }: { children: React.ReactNode, className?: string }) {
  return <h5 className={cn("text-sm font-bold leading-none mb-1", className)}>{children}</h5>;
}

function AlertDescription({ children, className }: { children: React.ReactNode, className?: string }) {
  return <p className={cn("text-xs leading-relaxed", className)}>{children}</p>;
}
