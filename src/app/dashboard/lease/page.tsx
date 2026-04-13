
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
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
  MapPin,
  Sparkles,
  Info,
  User,
  CreditCard,
  Camera,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser, useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";

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

const highDemandDistricts = ["Wardha", "Nagpur", "Indore", "Jaipur", "Visakhapatnam"];

// Unit conversion relative to 1 Acre
const unitMultipliers: Record<string, number> = {
  "acre": 1,
  "bigha": 0.625, // 1 Bigha = 0.625 Acre (Standard approx)
  "biswa": 0.03125 // 1 Biswa = 1/20 Bigha = 0.03125 Acre
};

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
    area: 5,
    unit: "acre",
    soil: "black",
    irrigation: "yes"
  });

  const [result, setResult] = useState<any>(null);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const acresEquivalent = calcData.area * unitMultipliers[calcData.unit];
    
    const isHighDemand = highDemandDistricts.includes(calcData.district);
    const districtPremium = isHighDemand ? 0.2 : 0;
    
    const irrigationBonus = calcData.irrigation === "yes" ? 2500 : calcData.irrigation === "partial" ? 1200 : 0;
    const soilBonus = calcData.soil === "black" ? 1800 : calcData.soil === "alluvial" ? 1000 : 0;
    
    const baseRateWithDistrict = base * (1 + districtPremium);
    const ratePerAcre = baseRateWithDistrict + irrigationBonus + soilBonus;
    
    // Convert rate back to local unit for display
    const ratePerUnit = ratePerAcre * unitMultipliers[calcData.unit];
    const total = ratePerUnit * calcData.area;

    setResult({
      rate: Math.round(ratePerUnit),
      total: Math.round(total),
      base: base,
      districtBonus: Math.round(base * districtPremium),
      qualityBonus: irrigationBonus + soilBonus,
      demandStatus: isHighDemand ? "High" : "Standard",
      unit: calcData.unit,
      area: calcData.area
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

  const handleApplySubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!db || !user) return;
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const application = {
      userId: user.uid,
      farmerName: formData.get("farmerName"),
      aadharNumber: formData.get("aadharNumber"),
      phone: formData.get("phone"),
      bankName: formData.get("bankName"),
      accountNumber: formData.get("accountNumber"),
      ifscCode: formData.get("ifscCode"),
      landDetails: {
        ...calcData,
        calculatedRate: result?.rate || 0,
        totalPayout: result?.total || 0
      },
      status: "Pending Inspection",
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, "leaseApplications"), application);
      toast({
        title: "Application Submitted!",
        description: "Our field monitor will contact you within 48 hours for inspection.",
      });
      setIsApplyOpen(false);
    } catch (error) {
      console.error("Apply error:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "Please check your network and try again.",
      });
    } finally {
      setIsSubmitting(false);
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
            <Button 
              size="lg" 
              className="rounded-2xl h-16 px-10 font-black bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/20 text-lg transition-all hover:scale-105"
              onClick={() => setIsApplyOpen(true)}
            >
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
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Land Unit</Label>
                <Select value={calcData.unit} onValueChange={(v) => setCalcData({...calcData, unit: v})}>
                  <SelectTrigger className="rounded-2xl h-14 bg-muted/30 border-none font-bold text-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-2xl">
                    <SelectItem value="acre">Acre</SelectItem>
                    <SelectItem value="bigha">Bigha</SelectItem>
                    <SelectItem value="biswa">Biswa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Area ({calcData.unit})</Label>
                <Input 
                  type="number"
                  value={calcData.area} 
                  onChange={(e) => setCalcData({...calcData, area: Number(e.target.value)})}
                  className="rounded-2xl h-14 bg-muted/30 border-none font-bold text-lg" 
                />
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
                  <div className="relative z-10">
                    <p className="text-xs font-black uppercase tracking-widest text-emerald-700/60 mb-1">Aapki Zameen Ka Rate</p>
                    <h3 className="text-5xl font-black text-emerald-700">₹{result.rate.toLocaleString()}<span className="text-sm font-medium">/{result.unit}/year</span></h3>
                  </div>
                  <div className="text-center md:text-right relative z-10">
                    <p className="text-xs font-black uppercase tracking-widest text-emerald-700/60 mb-1">Total Annual Guaranteed Payout</p>
                    <p className="text-4xl font-black text-emerald-700">₹{result.total.toLocaleString()}</p>
                    <Button 
                      className="mt-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 h-12 px-8 font-black shadow-lg"
                      onClick={() => setIsApplyOpen(true)}
                    >
                      Apply with this Offer
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Application Dialog */}
        <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
          <DialogContent className="max-w-3xl rounded-[2.5rem] p-0 overflow-hidden border-none bg-white">
            <form onSubmit={handleApplySubmission}>
              <div className="p-8 bg-primary text-white space-y-2">
                <DialogTitle className="text-3xl font-black">Lease Application Form</DialogTitle>
                <DialogDescription className="text-primary-foreground/80 font-medium">
                  Please provide your identity and banking details for automated rent payouts.
                </DialogDescription>
              </div>
              <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[60vh] overflow-y-auto">
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                    <User className="h-4 w-4" /> Personal Information
                  </h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-tight">Full Farmer Name (as per Aadhar)</Label>
                      <Input name="farmerName" defaultValue={profile?.name} required className="rounded-xl h-12 bg-muted/30 border-none font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-tight">Aadhar Number</Label>
                      <Input name="aadharNumber" placeholder="XXXX XXXX XXXX" required className="rounded-xl h-12 bg-muted/30 border-none font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-tight">Contact Phone</Label>
                      <Input name="phone" defaultValue={profile?.phone} required className="rounded-xl h-12 bg-muted/30 border-none font-bold" />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                    <CreditCard className="h-4 w-4" /> Banking Details
                  </h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-tight">Bank Name</Label>
                      <Input name="bankName" placeholder="e.g. SBI, HDFC" required className="rounded-xl h-12 bg-muted/30 border-none font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-tight">Account Number</Label>
                      <Input name="accountNumber" type="password" required className="rounded-xl h-12 bg-muted/30 border-none font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-tight">IFSC Code</Label>
                      <Input name="ifscCode" placeholder="SBIN00XXXXX" required className="rounded-xl h-12 bg-muted/30 border-none font-bold" />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4 pt-4 border-t">
                  <div className="flex items-center gap-6 p-6 bg-muted/20 rounded-2xl border-2 border-dashed border-muted">
                    <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-muted-foreground shadow-sm">
                      <Camera className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Landowner Profile Photo</p>
                      <p className="text-xs text-muted-foreground">Used for field monitor identification</p>
                      <Input type="file" accept="image/*" className="mt-2 text-xs" />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter className="p-10 pt-0 flex flex-col sm:flex-row gap-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full rounded-2xl h-14 text-lg font-black shadow-xl shadow-primary/20"
                >
                  {isSubmitting ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : "Submit Application"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

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
