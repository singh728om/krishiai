
"use client";

import { useState, useEffect } from "react";
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
  ArrowUpRight,
  MapPin,
  Sparkles,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser, useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";

const stateData: Record<string, string[]> = {
  "Maharashtra": ["Wardha", "Nagpur", "Amravati", "Yavatmal", "Pune", "Nashik", "Aurangabad", "Solapur"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Bikaner", "Kota", "Ajmer"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Meerut", "Prayagraj"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Tirupati"]
};

const stateBaseRates: Record<string, number> = {
  "Maharashtra": 9500,
  "Madhya Pradesh": 8200,
  "Rajasthan": 7800,
  "Uttar Pradesh": 8800,
  "Andhra Pradesh": 9200
};

// High demand districts get a 20% premium
const highDemandDistricts = ["Wardha", "Nagpur", "Indore", "Jaipur", "Visakhapatnam"];

export default function LeaseLandPage() {
  const { user } = useUser();
  const db = useFirestore();

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);

  const { data: profile } = useDoc(userRef);

  const [calcData, setCalcData] = useState({
    state: "Maharashtra",
    district: "Wardha",
    village: "",
    pincode: "",
    acres: 5,
    soil: "black",
    irrigation: "yes"
  });

  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (profile) {
      setCalcData(prev => ({
        ...prev,
        state: profile.state || "Maharashtra",
        district: profile.district || "Wardha",
        village: profile.village || "",
        pincode: profile.pincode || ""
      }));
    }
  }, [profile]);

  const handleCalculate = () => {
    const base = stateBaseRates[calcData.state] || 8000;
    
    // District Multiplier
    const isHighDemand = highDemandDistricts.includes(calcData.district);
    const districtPremium = isHighDemand ? 0.2 : 0;
    
    // Quality Bonuses
    const irrigationBonus = calcData.irrigation === "yes" ? 2500 : calcData.irrigation === "partial" ? 1200 : 0;
    const soilBonus = calcData.soil === "black" ? 1800 : calcData.soil === "alluvial" ? 1000 : 0;
    
    const baseRateWithDistrict = base * (1 + districtPremium);
    const ratePerAcre = baseRateWithDistrict + irrigationBonus + soilBonus;
    const total = ratePerAcre * calcData.acres;

    setResult({
      rate: Math.round(ratePerAcre),
      total: Math.round(total),
      base: base,
      districtBonus: Math.round(base * districtPremium),
      qualityBonus: irrigationBonus + soilBonus,
      demandStatus: isHighDemand ? "High" : "Standard"
    });
  };

  const autofillFromProfile = () => {
    if (profile) {
      setCalcData(prev => ({
        ...prev,
        state: profile.state || "Maharashtra",
        district: profile.district || "Wardha",
        village: profile.village || "",
        pincode: profile.pincode || ""
      }));
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <div className="relative rounded-[2.5rem] bg-emerald-950 text-white p-10 md:p-20 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <Map className="w-full h-full" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-8">
          <Badge className="bg-primary/20 text-primary-foreground border-none px-5 py-2 rounded-full font-black uppercase tracking-widest text-[10px]">
            Apni Zameen Lease Karo
          </Badge>
          <h1 className="text-5xl md:text-6xl font-headline font-black leading-tight tracking-tighter">
            Apni khaali zameen se <span className="text-primary">Guaranteed Income</span> pao.
          </h1>
          <p className="text-xl text-emerald-100/80 font-medium leading-relaxed">
            Join the KrishiMitra Land Lease program. We farm your land organically, you get a fixed annual rent. Zero risk, better soil, monthly updates.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Button size="lg" className="rounded-2xl h-16 px-10 font-black bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/20 text-lg transition-all hover:scale-105">
              Apply Now <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
            <Button variant="outline" size="lg" className="rounded-2xl h-16 px-10 font-black border-2 border-white/20 text-white hover:bg-white/10 text-lg">
              View Agreement
            </Button>
          </div>
        </div>
      </div>

      {/* Promise Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Guaranteed Rent", desc: "Fasal ho ya na ho, aapka rent fix hai. Paid in advance every season.", icon: Coins, color: "text-amber-500", bg: "bg-amber-50" },
          { title: "Flexible Agreements", desc: "Zameen aapki hi rahegi. 1-3 year flexible agreements with easy renewal options.", icon: Calendar, color: "text-blue-500", bg: "bg-blue-50" },
          { title: "Certified Organic", desc: "Hum sirf organic kheti karte hain. Aapki zameen ki quality aur soil carbon badhega.", icon: Sprout, color: "text-emerald-500", bg: "bg-emerald-50" },
        ].map((item, i) => (
          <Card key={i} className="rounded-[2.5rem] border-none shadow-sm p-10 flex flex-col items-center text-center space-y-6 bg-white hover:shadow-xl transition-all group">
            <div className={cn("p-6 rounded-3xl transition-transform group-hover:scale-110", item.bg)}>
              <item.icon className={cn("h-10 w-10", item.color)} />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-black">{item.title}</h3>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Enhanced Rate Calculator */}
        <Card className="rounded-[3rem] border-none shadow-sm overflow-hidden flex flex-col bg-white border-t-8 border-primary">
          <CardHeader className="p-10 pb-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <Calculator className="h-6 w-6 text-primary" />
                  <CardTitle className="text-3xl font-black">AI Payout Estimator</CardTitle>
                </div>
                <CardDescription className="text-lg font-medium">Hyper-local regional valuation engine.</CardDescription>
              </div>
              {profile && (
                <Button variant="outline" size="sm" className="rounded-xl border-primary/20 text-primary font-bold bg-primary/5 h-10" onClick={autofillFromProfile}>
                  <MapPin className="h-4 w-4 mr-2" /> Sync Profile
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-10 pt-4 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">State</Label>
                <Select value={calcData.state} onValueChange={(v) => setCalcData({...calcData, state: v, district: stateData[v][0]})}>
                  <SelectTrigger className="rounded-2xl h-14 bg-muted/30 border-none font-bold text-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-2xl">
                    {Object.keys(stateData).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">District</Label>
                <Select value={calcData.district} onValueChange={(v) => setCalcData({...calcData, district: v})}>
                  <SelectTrigger className="rounded-2xl h-14 bg-muted/30 border-none font-bold text-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-2xl">
                    {stateData[calcData.state].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Village</Label>
                <Input 
                  value={calcData.village} 
                  onChange={(e) => setCalcData({...calcData, village: e.target.value})} 
                  placeholder="e.g. Anji"
                  className="rounded-2xl h-14 bg-muted/30 border-none font-bold text-lg" 
                />
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Pincode</Label>
                <Input 
                  type="number"
                  value={calcData.pincode} 
                  onChange={(e) => setCalcData({...calcData, pincode: e.target.value})} 
                  placeholder="442XXX"
                  className="rounded-2xl h-14 bg-muted/30 border-none font-bold text-lg" 
                />
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Land Size (Acres)</Label>
                <div className="flex items-center gap-4 bg-muted/30 rounded-2xl p-2 px-4 h-14">
                  <input 
                    type="range" 
                    min="1" 
                    max="50" 
                    value={calcData.acres} 
                    onChange={(e) => setCalcData({...calcData, acres: Number(e.target.value)})}
                    className="flex-1 accent-primary" 
                  />
                  <span className="font-black text-xl w-12 text-center">{calcData.acres}</span>
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Soil Type</Label>
                <Select value={calcData.soil} onValueChange={(v) => setCalcData({...calcData, soil: v})}>
                  <SelectTrigger className="rounded-2xl h-14 bg-muted/30 border-none font-bold text-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-2xl">
                    <SelectItem value="black">Black Soil (Kaali)</SelectItem>
                    <SelectItem value="red">Red Soil (Laal)</SelectItem>
                    <SelectItem value="alluvial">Alluvial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3 md:col-span-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Irrigation Access</Label>
                <div className="grid grid-cols-3 gap-3">
                  {['yes', 'partial', 'no'].map((opt) => (
                    <Button 
                      key={opt}
                      variant="outline"
                      className={cn(
                        "rounded-2xl h-14 font-bold border-2 capitalize",
                        calcData.irrigation === opt ? "border-primary bg-primary/5 text-primary" : "border-muted/50"
                      )}
                      onClick={() => setCalcData({...calcData, irrigation: opt})}
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            <Button onClick={handleCalculate} className="w-full h-16 rounded-2xl text-xl font-black shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-transform">
              Generate AI Payout Offer <Sparkles className="ml-2 h-6 w-6" />
            </Button>

            {result && (
              <div className="pt-10 border-t space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="bg-emerald-50 p-10 rounded-[2.5rem] border border-emerald-100 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <CheckCircle2 className="h-40 w-40" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700/60 mb-2 flex items-center gap-2">
                      <MapPin className="h-3 w-3" /> {calcData.district}, {calcData.state}
                    </p>
                    <p className="text-xs font-black uppercase tracking-widest text-emerald-700/60 mb-1">Aapki Zameen Ka Rate</p>
                    <h3 className="text-5xl font-black text-emerald-700">₹{result.rate.toLocaleString()}<span className="text-sm font-medium">/acre/year</span></h3>
                  </div>
                  <div className="text-center md:text-right relative z-10">
                    <p className="text-xs font-black uppercase tracking-widest text-emerald-700/60 mb-1">Total Annual Guaranteed Payout</p>
                    <p className="text-4xl font-black text-emerald-700">₹{result.total.toLocaleString()}</p>
                    <Badge className={cn("mt-3 px-4 py-1.5 rounded-full font-bold border-none", result.demandStatus === 'High' ? 'bg-emerald-600' : 'bg-emerald-400')}>
                      {result.demandStatus} Demand Zone
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-6 bg-muted/20 rounded-3xl border border-muted/30">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">State Base</p>
                    <p className="text-xl font-bold">₹{result.base.toLocaleString()}</p>
                  </div>
                  <div className="p-6 bg-muted/20 rounded-3xl border border-muted/30">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Regional Premium</p>
                    <p className="text-xl font-bold text-primary">+₹{result.districtBonus.toLocaleString()}</p>
                  </div>
                  <div className="p-6 bg-muted/20 rounded-3xl border border-muted/30">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Quality Bonuses</p>
                    <p className="text-xl font-bold text-primary">+₹{result.qualityBonus.toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-200 flex gap-4 items-start">
                  <Info className="h-6 w-6 text-amber-600 shrink-0 mt-1" />
                  <div className="space-y-1">
                    <h5 className="font-black text-amber-900">Why KrishiAI Lease?</h5>
                    <p className="text-sm text-amber-800 leading-relaxed font-medium">
                      Traditional farming has a 40% risk factor due to pests and weather. Our lease model offers 100% security — your rent is fixed and paid before we start the season.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Active Leases & Status */}
        <div className="space-y-8">
          <Card className="rounded-[3rem] border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="p-10 border-b">
              <CardTitle className="text-3xl font-black">My Lease Portfolio</CardTitle>
              <CardDescription className="text-lg font-medium">Live monitoring of your enrolled plots.</CardDescription>
            </CardHeader>
            <CardContent className="p-10 space-y-10">
              <div className="flex flex-col md:flex-row items-center gap-8 p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10 relative group">
                <div className="h-20 w-20 rounded-3xl bg-white flex items-center justify-center shadow-lg transition-transform group-hover:rotate-6">
                  <Sprout className="h-10 w-10 text-primary" />
                </div>
                <div className="flex-1 space-y-2 text-center md:text-left">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                    <h4 className="font-black text-2xl tracking-tight">Plot WD-047</h4>
                    <Badge className="bg-emerald-500 text-white border-none px-4 py-1 font-bold">Active</Badge>
                  </div>
                  <p className="text-muted-foreground font-medium text-lg">Wardha Cluster • 4.5 Acres • Organic Cherry Tomato</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-[2rem] bg-muted/20 border border-muted/30 space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Field Operations Manager</p>
                  <p className="text-xl font-black">Vijay Kumar</p>
                  <Button variant="link" className="p-0 h-auto text-primary font-black text-sm">9876543210</Button>
                </div>
                <div className="p-6 rounded-[2rem] bg-muted/20 border border-muted/30 space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Next Payment Milestone</p>
                  <p className="text-xl font-black">15 March 2025</p>
                  <p className="text-xs font-black text-accent uppercase tracking-tighter">47 Days Left</p>
                </div>
              </div>

              <div className="space-y-6">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b pb-4">Advance Rent Credits</h5>
                <div className="space-y-4">
                  {[
                    { date: "Oct 12, 2024", amount: "₹23,625", ref: "TXN...847", status: "Credited" },
                    { date: "Jun 05, 2024", amount: "₹23,625", ref: "TXN...212", status: "Credited" },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-muted/10">
                      <div>
                        <p className="text-sm font-black">{row.date}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">{row.ref}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-primary">{row.amount}</p>
                        <p className="text-[10px] text-emerald-500 font-bold uppercase">{row.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button variant="outline" className="w-full rounded-2xl h-14 text-lg font-black border-2 border-primary/20 text-primary hover:bg-primary/5">
                Download Registered Agreement
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] border-none shadow-sm bg-gradient-to-br from-emerald-900 to-emerald-950 p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
              <ShieldCheck className="w-full h-full" />
            </div>
            <div className="relative z-10 space-y-4">
              <h4 className="text-2xl font-black flex items-center gap-3">
                <ShieldCheck className="h-8 w-8 text-primary" /> Verified & Legal
              </h4>
              <p className="text-lg text-emerald-100/80 leading-relaxed font-medium">
                Every lease is registered with the district authority. All payments are automated via escrow, ensuring you never have to ask for your rent.
              </p>
              <div className="flex items-center gap-4 pt-4">
                <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-bold text-emerald-100/60 uppercase">E-sign compliant under IT Act 2000</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

