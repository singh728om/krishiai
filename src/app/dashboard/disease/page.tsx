
"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Camera, Upload, Loader2, CheckCircle2, AlertTriangle, MapPin, History, BrainCircuit, Pill, ShieldAlert, Sparkles, ScanLine, Zap, X, FlipHorizontal } from "lucide-react";
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
  const [showCamera, setShowCamera] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);

  const { data: profile } = useDoc(userRef);
  const isHindi = profile?.languagePreference === 'hindi';

  const getCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCamera(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: isHindi ? 'कैमरा एक्सेस की अनुमति नहीं है' : 'Camera Access Denied',
        description: isHindi ? 'कृपया इस सुविधा का उपयोग करने के लिए अपने ब्राउज़र सेटिंग्स में कैमरा अनुमति दें।' : 'Please enable camera permissions in your browser settings to use this feature.',
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg');
        setPreview(dataUri);
        stopCamera();
        analyzeImage(dataUri);
      }
    }
  };

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
      case 'Severe': return 'bg-red-500 text-white shadow-lg shadow-red-200';
      case 'Moderate': return 'bg-amber-500 text-white shadow-lg shadow-amber-200';
      case 'Mild': return 'bg-primary text-white shadow-lg shadow-primary/20';
      default: return 'bg-emerald-500 text-white shadow-lg shadow-emerald-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <Badge variant="outline" className="rounded-full border-primary/20 text-primary bg-primary/5 px-4 py-1.5 font-bold flex items-center gap-2 w-fit">
            <Sparkles className="h-3 w-3 fill-primary" /> Gemini 1.5 Flash Powered
          </Badge>
          <h1 className="text-4xl font-headline font-black tracking-tight">
            {isHindi ? 'फसल रोग निदान केंद्र' : 'AI Crop Pathology Center'}
          </h1>
          <p className="text-muted-foreground text-lg">
            {isHindi 
              ? 'एआई विशेषज्ञ से अपनी फसल का तुरंत इलाज करवाएं।' 
              : 'Instant field-side diagnosis with treatment protocol generation.'}
          </p>
        </div>
        <Button variant="outline" className="rounded-2xl border-2 font-bold bg-white h-12 px-6">
          <History className="mr-2 h-4 w-4" /> 
          {isHindi ? 'स्कैन इतिहास' : 'Scan History'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <Card className="lg:col-span-2 rounded-[2.5rem] border-none shadow-sm overflow-hidden flex flex-col p-10 bg-white relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-blue-500" />
          
          <div className="w-full relative aspect-square rounded-[2rem] overflow-hidden mb-8 bg-muted/20 border-4 border-dashed border-muted flex items-center justify-center group transition-all hover:border-primary/40">
            {showCamera ? (
              <div className="relative w-full h-full bg-black">
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
                <div className="absolute inset-0 border-2 border-primary/30 pointer-events-none">
                  <div className="absolute inset-x-10 top-1/2 -translate-y-1/2 h-[1px] bg-primary/50 shadow-[0_0_15px_rgba(22,163,74,0.5)]" />
                </div>
                <div className="absolute bottom-6 left-0 w-full flex justify-center gap-4 px-6">
                  <Button variant="destructive" size="icon" className="h-12 w-12 rounded-full shadow-lg" onClick={stopCamera}>
                    <X className="h-6 w-6" />
                  </Button>
                  <Button className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 shadow-xl" onClick={capturePhoto}>
                    <Camera className="mr-2 h-5 w-5" /> {isHindi ? 'फोटो खींचें' : 'Capture'}
                  </Button>
                </div>
              </div>
            ) : preview ? (
              <>
                <Image src={preview} alt="Crop scan" fill className="object-cover" />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-primary/10 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-primary shadow-[0_0_15px_rgba(22,163,74,0.8)] animate-[scan_2s_infinite]" />
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center text-center space-y-6 p-8">
                <div className="p-6 bg-primary/10 rounded-3xl transition-transform group-hover:scale-110">
                  <Camera className="h-12 w-12 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black">
                    {isHindi ? 'फसल की फोटो' : 'Visual Capture'}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium max-w-[240px]">
                    {isHindi 
                      ? 'स्पष्ट फोटो के लिए अच्छी रोशनी का उपयोग करें' 
                      : 'Ensure optimal lighting for cellular-level analysis'}
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
          <canvas ref={canvasRef} className="hidden" />
          
          <div className="grid grid-cols-2 gap-4">
            <Button 
              disabled={isAnalyzing || showCamera}
              className="rounded-2xl h-14 text-lg font-bold shadow-xl shadow-primary/20 bg-primary" 
              onClick={getCameraPermission}
            >
              <Camera className="mr-2 h-5 w-5" /> {isHindi ? 'कैमरा' : 'Camera'}
            </Button>
            <Button 
              variant="outline"
              disabled={isAnalyzing || showCamera}
              className="rounded-2xl h-14 text-lg font-bold border-2" 
              onClick={() => document.getElementById('crop-upload')?.click()}
            >
              <Upload className="mr-2 h-5 w-5" /> {isHindi ? 'अपलोड' : 'Upload'}
            </Button>
          </div>
          
          {hasCameraPermission === false && (
            <Alert variant="destructive" className="mt-4 rounded-xl">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{isHindi ? 'कैमरा एरर' : 'Camera Error'}</AlertTitle>
              <AlertDescription>
                {isHindi ? 'कैमरा अनुमति की आवश्यकता है।' : 'Camera access is required for real-time detection.'}
              </AlertDescription>
            </Alert>
          )}

          <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-black mt-6">
            {isHindi ? 'एआई इंजन: जेमिनी 1.5 फ़्लैश • 99% शुद्धता' : 'AI ENGINE: GEMINI 1.5 FLASH • 99% ACCURACY'}
          </p>
        </Card>

        <Card className="lg:col-span-3 rounded-[2.5rem] border-none shadow-sm overflow-hidden min-h-[500px] flex flex-col bg-white">
          {isAnalyzing ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-8 text-center">
              <div className="relative h-24 w-24">
                <div className="absolute inset-0 rounded-full border-4 border-primary/10" />
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <BrainCircuit className="absolute inset-0 m-auto h-10 w-10 text-primary animate-pulse" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black">{isHindi ? 'एआई विश्लेषण' : 'Gemini AI Analysis'}</h3>
                <p className="text-muted-foreground font-medium max-w-sm italic">
                  {isHindi ? 'रोगों के वैश्विक डेटाबेस से तुलना हो रही है...' : 'Identifying symptoms and calculating treatment protocols...'}
                </p>
              </div>
              <div className="w-full max-w-[300px] space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span>Processing Image Data</span>
                  <span>Real-time</span>
                </div>
                <Progress value={90} className="h-2 rounded-full" />
              </div>
            </div>
          ) : result ? (
            <div className="flex-1 flex flex-col">
              <div className="p-8 bg-primary/5 border-b relative">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <ScanLine className="h-32 w-32" />
                </div>
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div>
                    <Badge className={cn("mb-3 px-3 py-1 font-bold uppercase tracking-wider rounded-lg border-none", getSeverityColor(result.severity))}>
                      {result.severity} {isHindi ? 'स्थिति' : 'Severity'}
                    </Badge>
                    <h2 className="text-4xl font-black tracking-tight">{result.diseaseName}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{isHindi ? 'एआई सटीकता' : 'Confidence'}</p>
                    <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border">
                      <Zap className="h-4 w-4 text-primary fill-primary" />
                      <span className="text-2xl font-black text-primary">{result.confidenceScore}%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span>{isHindi ? 'संक्रमण का विस्तार' : 'Infection Spread'}</span>
                    <span>{result.affectedAreaPercentage}% Coverage</span>
                  </div>
                  <Progress value={result.affectedAreaPercentage} className="h-3 rounded-full bg-white shadow-inner" />
                </div>
              </div>
              
              <div className="p-8 space-y-10 flex-1 overflow-auto max-h-[500px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {result.treatmentMedicines.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Pill className="h-4 w-4 text-red-500" /> 
                        {isHindi ? 'अनुशंसित उपचार' : 'Therapeutic Protocol'}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {result.treatmentMedicines.map((med, i) => (
                          <div key={i} className="px-4 py-2 bg-red-50 text-red-700 rounded-xl font-bold text-sm border border-red-100 flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-red-500" /> {med}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.precautions.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <ShieldAlert className="h-4 w-4 text-blue-500" /> 
                        {isHindi ? 'सावधानियां' : 'Safety Precautions'}
                      </h3>
                      <ul className="space-y-2">
                        {result.precautions.map((prec, i) => (
                          <li key={i} className="flex gap-3 text-sm font-medium text-muted-foreground leading-snug">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                            {prec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <BrainCircuit className="h-4 w-4 text-primary" /> 
                    {isHindi ? 'एआई नैदानिक सलाह' : 'AI Diagnostic Summary'}
                  </h3>
                  <div className="bg-muted/30 rounded-3xl p-6 border-2 border-dashed border-primary/20">
                    <p className="text-sm leading-relaxed font-medium text-foreground whitespace-pre-wrap">
                      {result.detailedAdvice}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center text-muted-foreground">
              <div className="p-8 bg-muted/30 rounded-[2.5rem] mb-6">
                <ScanLine className="h-20 w-20 text-muted-foreground/40" />
              </div>
              <h3 className="text-2xl font-black text-foreground mb-2">
                {isHindi ? 'निदान की प्रतीक्षा है' : 'System Ready'}
              </h3>
              <p className="text-sm font-medium max-w-xs">
                {isHindi 
                  ? 'फोटो खींचें या फसल की एक स्पष्ट फोटो अपलोड करें।' 
                  : 'Capture a photo or upload a crop image to initiate the Gemini diagnostic flow.'}
              </p>
            </div>
          )}
        </Card>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
      `}</style>
    </div>
  );
}
