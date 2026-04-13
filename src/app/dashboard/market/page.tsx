
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  LineChart, 
  Line, 
  ResponsiveContainer, 
  Tooltip,
  AreaChart,
  Area
} from "recharts";
import { 
  Store, 
  TrendingUp, 
  TrendingDown, 
  MapPin, 
  ExternalLink, 
  Search,
  Sparkles,
  ArrowRight,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

const trendData = [
  { day: 'Mon', price: 6100 },
  { day: 'Tue', price: 6250 },
  { day: 'Wed', price: 6200 },
  { day: 'Thu', price: 6400 },
  { day: 'Fri', price: 6600 },
  { day: 'Sat', price: 6550 },
  { day: 'Sun', price: 6720 },
];

export default function MarketIntelligencePage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Market Intelligence</h1>
          <p className="text-muted-foreground">Compare mandi prices and find the best time to sell.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-primary/10 text-primary border-primary/20 py-1.5 px-4 rounded-xl flex items-center gap-2">
            <span className="h-2 w-2 bg-primary rounded-full animate-pulse" /> eNAM Integrated
          </Badge>
        </div>
      </div>

      {/* AI Recommendation Banner */}
      <Card className="rounded-2xl border-none shadow-sm bg-accent text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
          <Sparkles className="h-24 w-24" />
        </div>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left space-y-2">
              <h2 className="text-2xl font-bold font-headline">Best Time to Sell Prediction</h2>
              <p className="text-white/90 leading-relaxed text-sm md:text-base">
                Wait for <span className="font-black underline decoration-2 underline-offset-4">2-3 weeks</span>. Cotton prices in Maharashtra are expected to rise by <span className="font-black underline decoration-2 underline-offset-4">8-10%</span> due to export demand increase.
              </p>
            </div>
            <Button variant="secondary" className="bg-white text-accent hover:bg-white/90 font-bold px-8 rounded-xl h-12 shadow-lg">
              Detailed Analysis
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          { name: "Wheat", price: "₹2,275", msp: "₹2,125", trend: "+4.2%", up: true },
          { name: "Cotton", price: "₹6,720", msp: "₹6,620", trend: "+8.1%", up: true },
          { name: "Soybean", price: "₹4,150", msp: "₹4,600", trend: "-2.4%", up: false },
          { name: "Tomato", price: "₹1,200", msp: "N/A", trend: "+12.5%", up: true },
          { name: "Rice", price: "₹3,400", msp: "₹2,183", trend: "+1.1%", up: true },
        ].map((item, i) => (
          <Card key={i} className="rounded-2xl border-none shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-5">
              <div className="flex justify-between items-center mb-3">
                <p className="text-xs font-bold text-muted-foreground uppercase">{item.name}</p>
                <div className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-0.5", item.up ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600")}>
                  {item.up ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                  {item.trend}
                </div>
              </div>
              <h3 className="text-xl font-bold">{item.price}</h3>
              <div className="mt-2 flex justify-between items-center text-[10px] text-muted-foreground font-medium border-t pt-2">
                <span>MSP: {item.msp}</span>
                <span className={cn(
                  "font-bold",
                  item.price > item.msp ? "text-primary" : "text-red-500"
                )}>
                  {item.price > item.msp ? "Above MSP" : item.msp === 'N/A' ? 'Mkt Driven' : 'Below MSP'}
                </span>
              </div>
              <div className="h-8 mt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData.map(d => ({ ...d, price: d.price * (Math.random() * 0.2 + 0.9) }))}>
                    <Area type="monotone" dataKey="price" stroke={item.up ? "#16a34a" : "#dc2626"} fill={item.up ? "#16a34a33" : "#dc262633"} strokeWidth={1} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Nearby Mandis */}
        <Card className="lg:col-span-2 rounded-2xl border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
            <div>
              <CardTitle className="text-lg">Nearby Mandis</CardTitle>
              <p className="text-xs text-muted-foreground">Prices updated 10 mins ago</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9 h-9 w-48 text-xs rounded-xl" placeholder="Search Mandi..." />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {[
                { name: "Nagpur Mandi (Cotton Hub)", dist: "45 km", price: "₹6,850", trend: "+₹150", status: "Active" },
                { name: "Wardha Local Mandi", dist: "12 km", price: "₹6,720", trend: "Stable", status: "Active" },
                { name: "Amravati Market", dist: "78 km", price: "₹6,910", trend: "+₹200", status: "Busy" },
                { name: "Yavatmal APMC", dist: "62 km", price: "₹6,680", trend: "-₹50", status: "Slow" },
              ].map((mandi, i) => (
                <div key={i} className="p-4 px-6 flex justify-between items-center hover:bg-muted/30 transition-colors">
                  <div className="flex gap-4 items-center">
                    <div className="h-10 w-10 bg-muted/50 rounded-xl flex items-center justify-center">
                      <Store className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{mandi.name}</p>
                      <div className="flex gap-3 text-xs text-muted-foreground items-center mt-0.5">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {mandi.dist}</span>
                        <span className="h-1 w-1 bg-muted-foreground rounded-full" />
                        <span>{mandi.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">{mandi.price}</p>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase justify-end">
                      <span className={cn(mandi.trend.startsWith('+') ? 'text-emerald-500' : mandi.trend === 'Stable' ? '' : 'text-red-500')}>
                        {mandi.trend}
                      </span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full h-12 text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary/5 rounded-none">
              Load More Mandis <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardContent>
        </Card>

        {/* Commodity Analysis Sidebar */}
        <div className="space-y-6">
          <Card className="rounded-2xl border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">Price Comparison</CardTitle>
            </CardHeader>
            <CardContent className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="p-2 bg-muted/30 rounded-lg text-center">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Week High</p>
                  <p className="text-sm font-bold">₹6,720</p>
                </div>
                <div className="p-2 bg-muted/30 rounded-lg text-center">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Week Low</p>
                  <p className="text-sm font-bold">₹6,100</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-none shadow-sm bg-primary/5 border border-primary/20">
            <CardContent className="p-6">
              <h3 className="font-bold text-primary mb-2 flex items-center gap-2">
                <Info className="h-4 w-4" /> Market Tip
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Global cotton stocks are declining. Expect volatility in the next quarter. We recommend holding your current stock for at least 15 more days to capitalize on price spikes.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
