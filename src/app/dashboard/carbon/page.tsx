
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Leaf, 
  Wallet, 
  ArrowUpRight, 
  History, 
  CheckCircle2, 
  Clock, 
  Search, 
  ChevronRight,
  TrendingUp,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CarbonCreditsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Carbon Credits</h1>
          <p className="text-muted-foreground">Earn income from sustainable farming practices.</p>
        </div>
        <Button className="rounded-xl shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
          List My Credits
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Metric Hero */}
        <Card className="lg:col-span-2 rounded-2xl border-none shadow-sm bg-gradient-to-br from-primary to-emerald-700 text-white overflow-hidden">
          <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="relative h-40 w-40 flex items-center justify-center shrink-0">
              <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-pulse" />
              <div className="text-center z-10">
                <p className="text-5xl font-headline font-bold">12.4</p>
                <p className="text-xs font-bold uppercase tracking-widest text-white/70">Tonnes CO₂</p>
              </div>
              <Leaf className="absolute -top-2 -right-2 h-10 w-10 text-white/30 rotate-12" />
            </div>
            <div className="space-y-4 text-center md:text-left">
              <div>
                <h2 className="text-2xl font-bold">Total CO₂ Sequestered</h2>
                <p className="text-white/80">Your regenerative practices have significantly offset local emissions.</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl">
                  <p className="text-[10px] uppercase font-bold text-white/60">Value in Market</p>
                  <p className="text-lg font-bold">₹1,18,400</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl">
                  <p className="text-[10px] uppercase font-bold text-white/60">Trees Equivalent</p>
                  <p className="text-lg font-bold">~148 Trees</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Ticker & Wallet */}
        <div className="space-y-6">
          <Card className="rounded-2xl border-none shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" /> Live Global Price
                </CardTitle>
                <Badge className="bg-emerald-100 text-emerald-700 border-none">+2.3%</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-headline">$14.50</span>
                <span className="text-muted-foreground text-sm">/ tonne</span>
              </div>
              <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-tight">₹1,208.40 per credit</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-none shadow-sm bg-accent text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Wallet className="h-5 w-5" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Carbon Wallet</p>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs font-medium text-white/80">Available to Sell</p>
                    <p className="text-2xl font-bold">8.4 Credits</p>
                  </div>
                  <Button size="sm" variant="secondary" className="bg-white text-accent hover:bg-white/90">Withdraw</Button>
                </div>
                <div className="h-[1px] bg-white/20" />
                <div className="flex justify-between text-xs font-medium">
                  <span>Sold: 4.0 Credits</span>
                  <span>Pending: 2.2 Credits</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Verification Timeline */}
        <Card className="rounded-2xl border-none shadow-sm overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle className="text-lg">Current Batch Status (Kharif '24)</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-muted before:content-['']">
              {[
                { title: "Data Collection", status: "completed", date: "Aug 12, 2024", icon: CheckCircle2 },
                { title: "Satellite Verification", status: "completed", date: "Sep 05, 2024", icon: CheckCircle2 },
                { title: "Quality Audit", status: "current", date: "In Progress", icon: Clock },
                { title: "Credit Issuance", status: "pending", date: "Expected Oct 10", icon: Clock },
              ].map((step, i) => (
                <div key={i} className="relative flex items-center gap-6">
                  <div className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full z-10",
                    step.status === 'completed' ? 'bg-primary text-white' : step.status === 'current' ? 'bg-accent text-white ring-4 ring-accent/20' : 'bg-muted text-muted-foreground'
                  )}>
                    <step.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Marketplace */}
        <Card className="rounded-2xl border-none shadow-sm overflow-hidden">
          <CardHeader className="border-b flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Active Buyers</CardTitle>
              <p className="text-xs text-muted-foreground">Corporates looking for high-quality offsets</p>
            </div>
            <Button variant="ghost" size="sm" className="text-primary font-bold">Browse All <ChevronRight className="ml-1 h-3 w-3" /></Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {[
                { name: "Tata Steel Ltd.", rating: "AAA", price: "$14.75", type: "Premium Offset" },
                { name: "Infosys ESG", rating: "AA+", price: "$14.40", type: "Tech Carbon Neutral" },
                { name: "Mahindra & Mahindra", rating: "AA", price: "$14.20", type: "Direct Payout" },
              ].map((buyer, i) => (
                <div key={i} className="p-4 flex justify-between items-center hover:bg-muted/30 transition-colors">
                  <div className="flex gap-4 items-center">
                    <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center font-headline font-bold text-muted-foreground">
                      {buyer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{buyer.name}</p>
                      <div className="flex gap-2 items-center mt-0.5">
                        <Badge variant="outline" className="text-[10px] py-0">{buyer.rating}</Badge>
                        <span className="text-[10px] text-muted-foreground uppercase">{buyer.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">{buyer.price}</p>
                    <Button variant="link" className="h-auto p-0 text-xs font-bold text-accent">Sell Now</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payout History */}
      <Card className="rounded-2xl border-none shadow-sm overflow-hidden">
        <CardHeader className="px-6 py-4 border-b">
          <CardTitle className="text-lg">Payout History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Tonnes</TableHead>
                <TableHead>Price/Tonne</TableHead>
                <TableHead className="text-right">Total Received (₹)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { date: "May 15, 2024", tonnes: "2.4", price: "$13.90", total: "28,240" },
                { date: "Jan 10, 2024", tonnes: "1.6", price: "$13.20", total: "17,650" },
              ].map((row, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{row.date}</TableCell>
                  <TableCell>{row.tonnes} T</TableCell>
                  <TableCell>{row.price}</TableCell>
                  <TableCell className="text-right font-bold text-primary">₹{row.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
