"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  Cell
} from "recharts";
import { Loader2, TrendingUp, TrendingDown, Target, Info, ArrowRight } from "lucide-react";

const comparisonData = [
  { name: 'Your Farm', yield: 8.2, fill: 'hsl(var(--primary))' },
  { name: 'District Avg', yield: 6.1, fill: 'hsl(var(--muted-foreground))' },
  { name: 'State Avg', yield: 5.8, fill: 'hsl(var(--muted-foreground))' },
];

const historicalData = [
  { year: '2020', yield: 5.2 },
  { year: '2021', yield: 6.8 },
  { year: '2022', yield: 6.1 },
  { year: '2023', yield: 7.4 },
  { year: '2024', yield: 8.2 },
];

export default function YieldPredictionPage() {
  const [isPredicting, setIsPredicting] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handlePredict = () => {
    setIsPredicting(true);
    setTimeout(() => {
      setIsPredicting(false);
      setShowResult(true);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Yield Prediction & Advisory</h1>
          <p className="text-muted-foreground">Maximize your output with data-driven AI forecasting.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <Card className="rounded-2xl border-none shadow-sm">
          <CardHeader>
            <CardTitle>Farm Parameters</CardTitle>
            <CardDescription>Enter details about your current crop cycle</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="crop-type">Crop Type</Label>
              <Select defaultValue="cotton">
                <SelectTrigger id="crop-type" className="rounded-xl">
                  <SelectValue placeholder="Select crop" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cotton">Cotton (कपास)</SelectItem>
                  <SelectItem value="soybean">Soybean (सोयाबीन)</SelectItem>
                  <SelectItem value="wheat">Wheat (गेहूं)</SelectItem>
                  <SelectItem value="rice">Rice (चावल)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="acreage">Acreage (Acres)</Label>
              <Input id="acreage" type="number" placeholder="e.g. 4.5" defaultValue="4.5" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="soil-type">Soil Type</Label>
              <Select defaultValue="black">
                <SelectTrigger id="soil-type" className="rounded-xl">
                  <SelectValue placeholder="Select soil type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="black">Black Soil (काली मिट्टी)</SelectItem>
                  <SelectItem value="red">Red Soil (लाल मिट्टी)</SelectItem>
                  <SelectItem value="alluvial">Alluvial Soil (जलोढ़ मिट्टी)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="irrigation">Irrigation System</Label>
              <Select defaultValue="drip">
                <SelectTrigger id="irrigation" className="rounded-xl">
                  <SelectValue placeholder="Select irrigation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="drip">Drip Irrigation</SelectItem>
                  <SelectItem value="sprinkler">Sprinkler</SelectItem>
                  <SelectItem value="rainfed">Rainfed (बारिश पर निर्भर)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sowing-date">Sowing Date</Label>
              <Input id="sowing-date" type="date" defaultValue="2024-06-15" className="rounded-xl" />
            </div>
            <Button className="w-full rounded-xl" onClick={handlePredict} disabled={isPredicting}>
              {isPredicting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Calculating...</> : "Generate Prediction"}
            </Button>
          </CardContent>
        </Card>

        {/* Results and Visuals */}
        <div className="lg:col-span-2 space-y-8">
          {showResult ? (
            <>
              {/* Result Summary */}
              <Card className="rounded-2xl border-none shadow-sm bg-primary text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Target className="h-32 w-32" />
                </div>
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-1">
                      <p className="text-primary-foreground/80 font-bold uppercase tracking-widest text-xs">Predicted Yield Range</p>
                      <h2 className="text-4xl font-headline font-bold">7.8 – 8.6 <span className="text-xl">Quintals/Acre</span></h2>
                      <p className="text-primary-foreground/90 font-medium">+34% vs. District Average</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4">
                      <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-tight text-white/80">Growth Status</p>
                        <p className="text-lg font-bold">Strong Optimal</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Comparison Chart */}
                <Card className="rounded-2xl border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Yield Benchmark</CardTitle>
                    <CardDescription>Quintals per Acre Comparison</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[250px] p-0 pb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="yield" radius={[8, 8, 0, 0]} barSize={40}>
                          {comparisonData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Trend Chart */}
                <Card className="rounded-2xl border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Historical Trend</CardTitle>
                    <CardDescription>Last 5 Seasons performance</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[250px] p-0 pb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={historicalData} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Line type="monotone" dataKey="yield" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 6, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Advisory Actions */}
              <Card className="rounded-2xl border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">AI Yield Advisory</CardTitle>
                  <CardDescription>Top actions to maximize your current harvest</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { title: "Increase Boron Spray", desc: "Apply 20% Boron solubalized spray in next 48 hours for better boll retention.", icon: Target },
                    { title: "Adjust Water Frequency", desc: "Decrease drip interval to 4 hours due to high evapotranspiration forecast.", icon: Info },
                    { title: "Final Top Dressing", desc: "Apply 45kg Nitrogen/acre before the flower set stage ends.", icon: TrendingUp },
                  ].map((action, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl border bg-muted/20 items-start">
                      <div className="p-2 bg-white rounded-lg shadow-sm shrink-0">
                        <action.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{action.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed mt-1">{action.desc}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="ml-auto rounded-full">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-muted/30 rounded-2xl border border-dashed">
              <div className="h-20 w-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-headline font-bold mb-2">Ready to predict your yield?</h3>
              <p className="text-muted-foreground max-w-sm mb-8">Fill out your farm details and click 'Generate Prediction' to see AI insights.</p>
              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                <div className="p-4 bg-white rounded-xl shadow-sm border text-left">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Impact</p>
                  <p className="text-sm font-bold">+25% Precision</p>
                </div>
                <div className="p-4 bg-white rounded-xl shadow-sm border text-left">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Method</p>
                  <p className="text-sm font-bold">Multi-modal AI</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
