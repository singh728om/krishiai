
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Camera, Upload, Loader2, CheckCircle2, AlertTriangle, MapPin, History, BrainCircuit, Pill, ShieldAlert } from "lucide-react";
import { cropDiseaseDiagnosis, type CropDiseaseDiagnosisOutput } from "@/ai/flows/crop-disease-diagnosis";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useUser, useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";

export default function DiseaseDetectionPage() {
  const { user } = useUser();
  const db = useFirestore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<CropDiseaseDiagnosisOutput | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);

  const { data: profile } = useDoc(userRef);
  const isHindi = profile?.languagePreference === 'hindi';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: isHindi ? "फ़ाइल बहुत बड़ी है" : "File too large",
          description: isHindi ? "कृपया 10MB से छोटी छवि अपलोड करें।" : "Please upload an image smaller than 10MB.",
          variant: "destructive"
        });
        return;
      }

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
      const languagePrompt = isHindi ? "Hindi (हिंदी)" : "English";

      const response = await cropDiseaseDiagnosis({
        photoDataUri: dataUri,
        language: languagePrompt
      });

      if (!response.isCrop) {
        toast({
          title: isHindi ? "अमान्य छवि" : "Invalid Image",
          description: isHindi 
            ? "एआई इस फोटो में फसल की पहचान नहीं कर सका। कृपया पौधे की स्पष्ट फोटो लें।" 
            : "The AI could not identify a crop in this photo. Please try a clearer shot of the plant.",
          variant: "destructive"
        });
      }
      
      setResult(response);
    } catch (error: any) {
      console.error("Diagnosis error:", error);
      toast({
        title: isHindi ? "निदान विफल" : "Diagnosis failed",
        description: error.message || (isHindi ? "छवि विश्लेषण में त्रुटि हुई।" : "There was an error analyzing the crop image."),
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Severe': return 'bg-red-500 hover:bg-red-600';
      case 'Moderate': return 'bg-orange-500 hover:bg-orange-600';
      case 'Mild': return 'bg-yellow-500 hover:bg-yellow-600 text-black';
      default: return 'bg-emerald-500 hover:bg-emerald-600';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">
            {isHindi ? 'फसल रोग पहचान' : 'Crop Disease Detection'}
          </h1>
          <p className="text-muted-foreground">
            {isHindi 
              ? 'त्वरित एआई निदान और उपचार योजना के लिए एक फोटो अपलोड करें।' 
              : 'Upload a photo for instant AI diagnosis and treatment plan.'}
          </p>
        </div>
        <Button variant="outline" className="rounded-xl">
          <History className="mr-2 h-4 w-4" /> 
          {isHindi ? 'इतिहास देखें' : 'View History'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="rounded-2xl border-none shadow-sm overflow-hidden flex flex-col justify-center items-center p-8 bg-white relative">
          <div className="w-full relative aspect-square rounded-xl overflow-hidden mb-6 bg-muted/30 border-2 border-dashed border-muted flex items-center justify-center">
            {preview ? (
              <Image src={preview} alt="Crop scan" fill className="object-cover" />
            ) : (
              <div className="flex flex-col items-center text-center space-y-4 p-4">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Camera className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    {isHindi ? 'फसल की फोटो अपलोड करें' : 'Upload Crop Image'}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-[200px]">
                    {isHindi 
                      ? 'प्रभावित पत्तियों या तनों को स्पष्ट रूप से कैद करें' 
                      : 'Capture the affected leaves or stems clearly'}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <input 
            type="file" 
            id="crop-upload" 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
            disabled={isAnalyzing}
          />
          <Button 
            disabled={isAnalyzing}
            className="rounded-xl w-full" 
            onClick={() => document.getElementById('crop-upload')?.click()}
          >
            {isAnalyzing ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {isHindi ? 'विश्लेषण हो रहा है...' : 'Analyzing Symptoms...'}</>
            ) : (
              <><Upload className="mr-2 h-4 w-4" /> {preview ? (isHindi ? 'दूसरी फोटो चुनें' : 'Try Another Photo') : (isHindi ? 'फोटो चुनें' : 'Select Photo')}</>
            )}
          </Button>
          <p className="text-[10px] text-muted-foreground mt-4 uppercase tracking-widest font-bold">{isHindi ? 'सुझाव: उच्च रिज़ॉल्यूशन JPG/PNG' : 'Recommended: High resolution JPG/PNG'}</p>
        </Card>

        <Card className="rounded-2xl border-none shadow-sm overflow-hidden min-h-[400px] flex flex-col bg-white">
          {isAnalyzing ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6">
              <div className="relative h-20 w-20">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <BrainCircuit className="absolute inset-0 m-auto h-8 w-8 text-primary" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold">{isHindi ? 'जेमिनी एआई विशेषज्ञ' : 'Gemini AI Pathologist'}</h3>
                <p className="text-sm text-muted-foreground italic">{isHindi ? 'रोगों की डेटाबेस से तुलना हो रही है...' : 'Running cross-reference on 10,000+ crop diseases...'}</p>
              </div>
              <div className="w-full max-w-[200px] space-y-2">
                <Progress value={65} className="h-2" />
              </div>
            </div>
          ) : result ? (
            <div className="flex-1 flex flex-col">
              <div className="p-6 bg-primary/5 border-b">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Badge className={cn("mb-2 font-bold border-none", getSeverityColor(result.severity))}>
                      {result.severity} {isHindi ? 'गंभीरता' : 'Severity'}
                    </Badge>
                    <h2 className="text-2xl font-bold">{result.diseaseName}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{isHindi ? 'एआई सटीकता' : 'AI Confidence'}</p>
                    <p className="text-2xl font-bold text-primary">{result.confidenceScore}%</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold uppercase">
                    <span>{isHindi ? 'प्रभावित क्षेत्र' : 'Field Impact'}</span>
                    <span>{result.affectedAreaPercentage}% Area</span>
                  </div>
                  <Progress value={result.affectedAreaPercentage} className="h-2" />
                </div>
              </div>
              
              <div className="p-6 space-y-6 flex-1 overflow-auto max-h-[400px]">
                {result.treatmentMedicines.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Pill className="h-4 w-4 text-red-500" /> 
                      {isHindi ? 'अनुशंसित उपचार' : 'Recommended Treatments'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.treatmentMedicines.map((med, i) => (
                        <Badge key={i} variant="secondary" className="px-3 py-1 bg-red-50 text-red-700 border-red-100">
                          {med}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {result.precautions.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4 text-blue-500" /> 
                      {isHindi ? 'सावधानियां' : 'Precautions'}
                    </h3>
                    <ul className="space-y-1 text-sm list-disc pl-5">
                      {result.precautions.map((prec, i) => (
                        <li key={i} className="text-muted-foreground">{prec}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" /> 
                    {isHindi ? 'नैदानिक सलाह' : 'Diagnostic Advice'}
                  </h3>
                  <div className="bg-muted/30 rounded-xl p-4 border border-dashed border-primary/30">
                    <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                      {result.detailedAdvice}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
              <div className="p-4 bg-muted/50 rounded-full mb-4">
                <AlertTriangle className="h-12 w-12" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                {isHindi ? 'कोई विश्लेषण नहीं' : 'No analysis performed'}
              </h3>
              <p className="text-sm">
                {isHindi 
                  ? 'एआई निदान यहाँ देखने के लिए एक फोटो अपलोड करें।' 
                  : 'Upload a photo to see the AI diagnosis here.'}
              </p>
            </div>
          )}
        </Card>
      </div>

      {result && (
        <Card className="rounded-2xl border-none shadow-sm overflow-hidden bg-white">
          <CardHeader className="px-6 py-4 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-accent" /> 
              {isHindi ? 'नजदीकी दवा विक्रेता' : 'Nearby Agro-Dealers for Medicines'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {[
                { name: "Kisan Suvidha Kendra", dist: "2.4 km", status: isHindi ? "खुला है" : "Open Now" },
                { name: "Varuna Agro Solutions", dist: "5.1 km", status: isHindi ? "6 बजे बंद होगा" : "Closes 6 PM" },
              ].map((dealer, i) => (
                <div key={i} className="flex items-center justify-between p-4 px-6 hover:bg-muted/5 transition-colors">
                  <div>
                    <p className="text-sm font-bold">{dealer.name}</p>
                    <p className="text-xs text-muted-foreground">{dealer.dist} • {dealer.status}</p>
                  </div>
                  <Button size="sm" variant="outline" className="rounded-lg h-8 border-primary/30 text-primary hover:bg-primary/5">
                    {isHindi ? 'कॉल करें' : 'Call'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
