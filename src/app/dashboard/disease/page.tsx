"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Camera, Upload, Loader2, CheckCircle2, AlertTriangle, MapPin, History } from "lucide-react";
import { cropDiseaseDiagnosis, type CropDiseaseDiagnosisOutput } from "@/ai/flows/crop-disease-diagnosis";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";

export default function DiseaseDetectionPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<CropDiseaseDiagnosisOutput | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setPreview(dataUri);
        analyzeImage(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (dataUri: string) => {
    setIsAnalyzing(true);
    setResult(null);
    try {
      const response = await cropDiseaseDiagnosis({
        photoDataUri: dataUri,
        language: "Hindi + English"
      });
      setResult(response);
    } catch (error) {
      toast({
        title: "Diagnosis failed",
        description: "There was an error analyzing the crop image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Crop Disease Detection</h1>
          <p className="text-muted-foreground">Upload a photo for instant diagnosis and treatment plan.</p>
        </div>
        <Button variant="outline" className="rounded-xl">
          <History className="mr-2 h-4 w-4" /> View Scan History
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Card */}
        <Card className="rounded-2xl border-none shadow-sm overflow-hidden flex flex-col justify-center items-center p-12 bg-white relative">
          {preview ? (
            <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-6">
              <Image src={preview} alt="Crop scan" fill className="object-cover" />
            </div>
          ) : (
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <Camera className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Upload Crop Image</h3>
                <p className="text-sm text-muted-foreground max-w-[250px]">Take a clear photo of the affected plant leaf or stem</p>
              </div>
            </div>
          )}
          
          <input 
            type="file" 
            id="crop-upload" 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
          />
          <Button 
            disabled={isAnalyzing}
            className="rounded-xl w-full mt-4" 
            onClick={() => document.getElementById('crop-upload')?.click()}
          >
            {isAnalyzing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</> : <><Upload className="mr-2 h-4 w-4" /> Select Photo</>}
          </Button>
          <p className="text-[10px] text-muted-foreground mt-4 uppercase tracking-widest font-bold">Max file size: 10MB</p>
        </Card>

        {/* Results Card */}
        <Card className="rounded-2xl border-none shadow-sm overflow-hidden min-h-[400px]">
          {isAnalyzing ? (
            <div className="h-full flex flex-col items-center justify-center p-8 space-y-6">
              <div className="relative h-24 w-24">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <BrainCircuit className="absolute inset-0 m-auto h-8 w-8 text-primary" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold">Analyzing Pathology...</h3>
                <p className="text-sm text-muted-foreground italic">Checking against 50,000+ disease patterns</p>
              </div>
              <div className="w-full space-y-2">
                <Progress value={45} className="h-2" />
                <p className="text-[10px] text-center font-bold text-muted-foreground uppercase">Identifying symptoms</p>
              </div>
            </div>
          ) : result ? (
            <div className="p-0">
              <div className="p-6 bg-primary/5 border-b">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Badge className={cn(
                      "mb-2 font-bold",
                      result.severity === 'Severe' ? 'bg-red-500' : result.severity === 'Moderate' ? 'bg-accent' : 'bg-emerald-500'
                    )}>
                      {result.severity} Severity
                    </Badge>
                    <h2 className="text-2xl font-bold">{result.diseaseName}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Confidence</p>
                    <p className="text-2xl font-bold text-primary">{result.confidenceScore}%</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold uppercase">
                    <span>Affected Area</span>
                    <span>{result.affectedAreaPercentage}%</span>
                  </div>
                  <Progress value={result.affectedAreaPercentage} className="h-2" />
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" /> Recommended Treatment
                  </h3>
                  <div className="bg-muted/30 rounded-xl p-4 border border-dashed border-primary/30">
                    <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                      {result.treatmentRecommendation}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-accent" /> Nearby Agro-Dealers
                  </h3>
                  <div className="space-y-3">
                    {[
                      { name: "Kisan Suvidha Kendra", dist: "2.4 km", status: "Open Now" },
                      { name: "Varuna Agro Solutions", dist: "5.1 km", status: "Closes 6 PM" },
                    ].map((dealer, i) => (
                      <div key={i} className="flex justify-between items-center p-3 rounded-xl border bg-white hover:border-primary transition-colors cursor-pointer group">
                        <div>
                          <p className="text-sm font-bold group-hover:text-primary">{dealer.name}</p>
                          <p className="text-xs text-muted-foreground">{dealer.dist} • {dealer.status}</p>
                        </div>
                        <Button size="icon" variant="ghost" className="rounded-full">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
              <div className="p-4 bg-muted/50 rounded-full mb-4">
                <AlertTriangle className="h-12 w-12" />
              </div>
              <h3 className="text-lg font-bold text-foreground">No analysis yet</h3>
              <p className="text-sm">Upload a crop photo to start the AI diagnostic process.</p>
            </div>
          )}
        </Card>
      </div>

      {/* History Table */}
      <Card className="rounded-2xl border-none shadow-sm overflow-hidden">
        <CardHeader className="px-6 py-4 border-b">
          <CardTitle className="text-lg">Recent Scans</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {[
              { date: "Oct 24, 2024", crop: "Soybean", disease: "Rust", severity: "Mild", area: "12%" },
              { date: "Sep 12, 2024", crop: "Cotton", disease: "Alternaria Leaf Spot", severity: "Moderate", area: "24%" },
            ].map((scan, i) => (
              <div key={i} className="flex items-center justify-between p-4 px-6 hover:bg-muted/30 transition-colors">
                <div className="flex gap-4 items-center">
                  <div className="h-10 w-10 bg-muted/50 rounded-lg flex items-center justify-center">
                    <Bug className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{scan.disease} — {scan.crop}</p>
                    <p className="text-xs text-muted-foreground">{scan.date} • {scan.area} Affected</p>
                  </div>
                </div>
                <Badge variant={scan.severity === 'Mild' ? 'secondary' : 'default'} className="rounded-lg">
                  {scan.severity}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
