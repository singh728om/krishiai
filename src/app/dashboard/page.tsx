
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
  TrendingDown,
  Calendar,
  Truck
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
    { label: isHindi ? "फसल स्वास्थ्य" : "Crop Health Score", value: "88", sub: isHindi ? "उत्कृष्ट" : "Excellent", color: "text-primary", trend: "+4%", icon: BrainCircuit },
    { label: isHindi ? "उपज का अनुमान" : "Yield Forecast", value: "8.2", sub: isHindi ? "क्विंटल/एकड़" : "Quintals/Acre", color: "text-primary", trend: "+15%", icon: ArrowUpRight },
    { label: isHindi ? "कार्बन क्रेडिट" : "Carbon Credits", value: "12.4", sub: isHindi ? "टन कार्बन" : "Tonnes Sequestered", color: "text-blue-600", trend: "+2.1", icon: Coins },
    { label: isHindi ? "सीजन का लाभ" : "Season P&L", value: "₹1,24,500", sub: isHindi ? "अनुमानित" : "Projected Profit", color: "text-primary", trend: "+12k", icon: ArrowUpRight },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">
            {isHindi ? `नमस्ते, ${profile?.name || 'किसान'}` : `Welcome back, ${profile?.name || 'Farmer'}`}
          </h1>
          <p className="text-muted-foreground">
            {isHindi ? 'यहाँ आपके खेत (वर्धा) की आज की जानकारी है।' : "Here's what's happening at your farm in Wardha today."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="rounded-xl shadow-lg shadow-primary/20">
            <Plus className="mr-2 h-4 w-4" /> {isHindi ? 'नया रिकॉर्ड' : 'Add Field Record'}
          </Button>
          <Button variant="outline" className="rounded-xl">
            <Calendar className="mr-2 h-4 w-4" /> {isHindi ? 'सितंबर 2024' : 'Aug 12 - Sep 11'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="rounded-2xl border-none shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-muted/50 rounded-lg">
                  <stat.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary font-bold">
                  {stat.trend}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className={`text-2xl font-bold ${stat.color}`}>{stat.value}</h3>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{stat.sub}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 rounded-2xl border-none shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-white border-b px-6 py-4">
            <div>
              <CardTitle className="text-lg">{isHindi ? 'फसल स्वास्थ्य मानचित्र' : 'Crop Health Map'}</CardTitle>
              <p className="text-xs text-muted-foreground">{isHindi ? 'खेत ए (कपास) का विश्लेषण' : 'Live satellite analysis of Field A (Cotton)'}</p>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-emerald-500">{isHindi ? '92% इष्टतम' : '92% Optimal'}</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-10 gap-1 aspect-[2/1] bg-muted/20 rounded-xl overflow-hidden p-2">
              {Array.from({ length: 50 }).map((_, i) => {
                const colors = ['bg-emerald-500', 'bg-emerald-400', 'bg-emerald-600', 'bg-amber-400', 'bg-red-500'];
                let colorClass = colors[0];
                if (i === 12 || i === 13) colorClass = colors[3];
                if (i === 42) colorClass = colors[4];
                return (
                  <div 
                    key={i} 
                    className={`${colorClass} rounded-sm opacity-80 hover:opacity-100 transition-opacity cursor-pointer`}
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-sm">
          <CardHeader className="border-b px-6 py-4">
            <CardTitle className="text-lg">{isHindi ? 'महत्वपूर्ण अलर्ट' : 'Recent Alerts'}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {[
                { title: isHindi ? "रोग चेतावनी" : "Disease Warning", desc: isHindi ? "दक्षिण क्षेत्र में पत्तियों के धब्बे देखे गए।" : "Early signs of Alternaria Leaf Spot detected.", type: "warning", time: "2h ago" },
                { title: isHindi ? "बाजार अलर्ट" : "Price Alert", desc: isHindi ? "नागपुर मंडी में कपास के भाव ₹200 बढ़े।" : "Cotton prices in Nagpur Mandi rose by ₹200.", type: "info", time: "5h ago" },
              ].map((alert, i) => (
                <div key={i} className="p-4 hover:bg-muted/30 transition-colors flex gap-4">
                  <div className={cn(
                    "h-2 w-2 rounded-full mt-1.5 shrink-0",
                    alert.type === 'critical' ? 'bg-red-500' : alert.type === 'warning' ? 'bg-accent' : 'bg-blue-500'
                  )} />
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-tight">{alert.title}</p>
                    <p className="text-sm leading-tight text-muted-foreground">{alert.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[
          { label: isHindi ? "ट्रैक्टर बुक करें" : "Book Tractor", icon: Truck, href: "/dashboard/services" },
          { label: isHindi ? "फसल फोटो अपलोड" : "Upload Crop Photo", icon: Smartphone, href: "/dashboard/disease" },
          { label: isHindi ? "उपज सलाह" : "Get Yield Advisory", icon: BrainCircuit, href: "/dashboard/yield" },
          { label: isHindi ? "कार्बन क्रेडिट" : "Sell Carbon Credits", icon: Coins, href: "/dashboard/carbon" },
          { label: isHindi ? "एआई सलाहकार" : "Call AI Advisor", icon: PhoneCall, href: "tel:+9118005550199" },
        ].map((action, i) => (
          <Link key={i} href={action.href}>
            <Button variant="outline" className="w-full h-auto py-6 rounded-2xl flex flex-col gap-3 group hover:border-primary transition-all">
              <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                <action.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold leading-none">{action.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
