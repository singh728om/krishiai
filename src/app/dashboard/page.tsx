"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  ChevronRight, 
  Smartphone, 
  PhoneCall, 
  Coins, 
  BrainCircuit,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Calendar,
  Truck,
  Zap,
  Map as MapIcon
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useUser, useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";

export default function Dashboard() {
  const { user } = useUser();
  const db = useFirestore();
  
  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);

  const { data: profile } = useDoc(userRef);
  const isHindi = profile?.languagePreference === 'hindi';

  const stats = [
    { label: isHindi ? "फसल स्वास्थ्य" : "Crop Health", value: "92", sub: isHindi ? "इष्टतम" : "Optimal", color: "text-emerald-500", trend: "+4%", icon: Zap, bg: "bg-emerald-50" },
    { label: isHindi ? "उपज का अनुमान" : "Yield Forecast", value: "8.4", sub: isHindi ? "क्विंटल/एकड़" : "Q/Acre", color: "text-primary", trend: "+12%", icon: TrendingUp, bg: "bg-primary/5" },
    { label: isHindi ? "कार्बन क्रेडिट" : "Carbon Credits", value: "12.4", sub: "Tonnes CO₂", color: "text-blue-600", trend: "+2.1", icon: Coins, bg: "bg-blue-50" },
    { label: isHindi ? "सीजन लाभ" : "Season Revenue", value: "₹1.4L", sub: isHindi ? "अनुमानित" : "Projected", color: "text-accent", trend: "Market High", icon: ArrowUpRight, bg: "bg-amber-50" },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <Badge variant="outline" className="rounded-full border-primary/20 text-primary bg-primary/5 px-3 py-1 font-bold">
            {isHindi ? 'लाइव फार्म इंटेलिजेंस' : 'Live Farm Intelligence'}
          </Badge>
          <h1 className="text-4xl font-headline font-black tracking-tight">
            {isHindi ? `राम-राम, ${profile?.name || 'किसान'}` : `Greetings, ${profile?.name || 'Farmer'}`}
          </h1>
          <p className="text-muted-foreground text-lg">
            {isHindi ? 'आपके खेत का रियल-टाइम विश्लेषण तैयार है।' : "Your farm's real-time analysis is primed and ready."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-2xl h-12 px-6 border-2 font-bold bg-white">
            <Calendar className="mr-2 h-4 w-4" /> {isHindi ? 'इतिहास' : 'Activity History'}
          </Button>
          <Button className="rounded-2xl h-12 px-8 font-bold shadow-xl shadow-primary/20">
            <Plus className="mr-2 h-4 w-4" /> {isHindi ? 'नया रिकॉर्ड' : 'Log Field Data'}
          </Button>
        </div>
      </div>

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="rounded-3xl border-none shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <CardContent className="p-7">
              <div className="flex items-center justify-between mb-6">
                <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110", stat.bg)}>
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{isHindi ? 'ट्रेंड' : 'Trend'}</p>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-lg">
                    {stat.trend}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-bold uppercase tracking-tight mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className={cn("text-3xl font-black", stat.color)}>{stat.value}</h3>
                  <span className="text-xs font-bold text-muted-foreground uppercase">{stat.sub}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Farm Map - High Tech Look */}
        <Card className="lg:col-span-2 rounded-[2rem] border-none shadow-sm overflow-hidden bg-white">
          <CardHeader className="flex flex-row items-center justify-between border-b px-8 py-6">
            <div>
              <CardTitle className="text-xl font-bold">{isHindi ? 'खेत का स्वास्थ्य मानचित्र' : 'Field Health Mapping'}</CardTitle>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">Satellite Analysis • Kharif 2024</p>
            </div>
            <Badge className="rounded-xl px-3 py-1 bg-primary/10 text-primary border-primary/20 font-bold">
              92% {isHindi ? 'इष्टतम' : 'Accuracy'}
            </Badge>
          </CardHeader>
          <CardContent className="p-8">
            <div className="relative aspect-[2/1] bg-muted/20 rounded-3xl overflow-hidden p-3 border-4 border-muted/30">
              <div className="grid grid-cols-10 gap-1.5 h-full w-full">
                {Array.from({ length: 50 }).map((_, i) => {
                  const colors = ['bg-emerald-500', 'bg-emerald-400', 'bg-emerald-600', 'bg-amber-400', 'bg-red-500'];
                  let colorClass = colors[0];
                  if (i === 12 || i === 13 || i === 24) colorClass = colors[3];
                  if (i === 42 || i === 7) colorClass = colors[4];
                  return (
                    <div 
                      key={i} 
                      className={cn(
                        colorClass, 
                        "rounded-md opacity-80 hover:opacity-100 transition-all cursor-crosshair relative group/cell"
                      )}
                    >
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/cell:opacity-100 transition-opacity" />
                    </div>
                  );
                })}
              </div>
              <div className="absolute bottom-6 right-6 flex items-center gap-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border shadow-lg">
                <div className="flex items-center gap-1.5"><div className="h-3 w-3 rounded-full bg-emerald-500" /><span className="text-[10px] font-bold">Healthy</span></div>
                <div className="flex items-center gap-1.5"><div className="h-3 w-3 rounded-full bg-amber-400" /><span className="text-[10px] font-bold">Stress</span></div>
                <div className="flex items-center gap-1.5"><div className="h-3 w-3 rounded-full bg-red-500" /><span className="text-[10px] font-bold">Critical</span></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Center */}
        <div className="space-y-8">
          <Card className="rounded-[2rem] border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="border-b px-8 py-6">
              <CardTitle className="text-xl font-bold">{isHindi ? 'एआई अलर्ट' : 'Intelligent Alerts'}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {[
                  { title: isHindi ? "कीट चेतावनी" : "Pest Outbreak", desc: "Aphid activity detected in nearby Seloo village.", type: "warning", time: "2h ago", icon: AlertTriangle },
                  { title: isHindi ? "बाजार अलर्ट" : "Market Volatility", desc: "Global cotton demand spike expected tomorrow.", type: "info", time: "5h ago", icon: TrendingUp },
                  { title: isHindi ? "मौसम अपडेट" : "Precipitation Alert", desc: "Light rain forecast (2mm) in next 12 hours.", type: "critical", time: "Just now", icon: Zap },
                ].map((alert, i) => (
                  <div key={i} className="p-6 hover:bg-muted/30 transition-colors flex gap-5">
                    <div className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                      alert.type === 'critical' ? 'bg-red-50 text-red-600' : alert.type === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                    )}>
                      <alert.icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black uppercase tracking-widest">{alert.title}</p>
                        <span className="text-[10px] font-bold text-muted-foreground">{alert.time}</span>
                      </div>
                      <p className="text-sm leading-tight font-medium text-foreground">{alert.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full h-14 rounded-none text-xs font-bold uppercase tracking-widest text-primary border-t">
                {isHindi ? 'सभी अलर्ट देखें' : 'View All Notifications'} <ChevronRight className="ml-2 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Launch Buttons - Aggressive Modern Look */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {[
          { label: isHindi ? "ट्रैक्टर बुक करें" : "Book Equipment", icon: Truck, href: "/dashboard/services", color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: isHindi ? "फसल स्कैन" : "AI Scan Crop", icon: Smartphone, href: "/dashboard/disease", color: "text-blue-600", bg: "bg-blue-50" },
          { label: isHindi ? "उपज रिपोर्ट" : "Yield Forecast", icon: BrainCircuit, href: "/dashboard/yield", color: "text-purple-600", bg: "bg-purple-50" },
          { label: isHindi ? "कार्बन वॉलेट" : "Carbon Wallet", icon: Coins, href: "/dashboard/carbon", color: "text-amber-600", bg: "bg-amber-50" },
          { label: isHindi ? "एआई सलाहकार" : "AI Advisor", icon: PhoneCall, href: "tel:+9118005550199", color: "text-red-600", bg: "bg-red-50" },
        ].map((action, i) => (
          <Link key={i} href={action.href}>
            <Button variant="outline" className="w-full h-auto py-8 rounded-[2rem] border-none shadow-sm flex flex-col gap-4 group hover:shadow-xl hover:bg-white transition-all duration-300">
              <div className={cn("p-4 rounded-2xl group-hover:scale-110 transition-transform", action.bg)}>
                <action.icon className={cn("h-6 w-6", action.color)} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-foreground">{action.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}