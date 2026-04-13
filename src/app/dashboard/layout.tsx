'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { DashboardNav } from "@/components/dashboard/nav";
import { CloudRain, MapPin, Bell, Search, Loader2, Languages, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);

  const { data: profile } = useDoc(userRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/auth');
    }
  }, [user, isUserLoading, router]);

  const handleLanguageChange = async (lang: string) => {
    if (!userRef) return;
    try {
      await updateDoc(userRef, { languagePreference: lang });
      toast({
        title: lang === 'hindi' ? 'भाषा बदली गई' : 'Language Changed',
        description: lang === 'hindi' ? 'अब आपको सलाह हिंदी में मिलेगी।' : 'Interface and AI will now communicate in English.',
      });
    } catch (error) {
      console.error("Error updating language:", error);
    }
  };

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background selection:bg-primary/20">
      <DashboardNav />
      
      <div className="flex-1 flex flex-col md:pl-64">
        {/* Modern Header */}
        <header className="h-20 border-b bg-white/70 backdrop-blur-xl sticky top-0 z-40 px-6 md:px-10 flex items-center justify-between">
          <div className="hidden md:flex items-center gap-6 max-w-lg flex-1">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input className="pl-11 h-11 border-none bg-muted/50 rounded-2xl focus-visible:ring-1 focus-visible:ring-primary/20 transition-all font-medium text-sm" placeholder="Search crops, mandi prices, analytics..." />
            </div>
          </div>

          <div className="flex items-center gap-6 ml-auto">
            {/* Weather & Location - Silicon Valley Style */}
            <div className="hidden lg:flex items-center gap-4 px-5 py-2 bg-white rounded-2xl border shadow-sm">
              <div className="flex items-center gap-2">
                <CloudRain className="h-5 w-5 text-primary" />
                <span className="text-sm font-black tracking-tight">32°C</span>
              </div>
              <div className="h-4 w-[1px] bg-border" />
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">{profile?.district || 'Wardha, MH'}</span>
              </div>
            </div>

            {/* Language Selection */}
            <Select 
              value={profile?.languagePreference || 'english'} 
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger className="h-10 w-[110px] rounded-2xl border-none bg-primary/5 text-xs font-black uppercase tracking-widest text-primary focus:ring-0">
                <Languages className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-2xl">
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="hindi">हिंदी</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative h-11 w-11 rounded-2xl hover:bg-muted transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-3 right-3 h-2 w-2 bg-accent rounded-full border-2 border-white" />
              </Button>

              <div className="flex items-center gap-4 pl-4 border-l">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black leading-none">{profile?.name || user.displayName || user.email?.split('@')[0]}</p>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter mt-1">{profile?.subscriptionPlan || 'Free Tier'}</p>
                </div>
                <Avatar className="h-11 w-11 border-2 border-primary/20 rounded-2xl shadow-sm">
                  <AvatarImage src={user.photoURL || `https://picsum.photos/seed/${user.uid}/44/44`} />
                  <AvatarFallback className="bg-primary text-white font-black">{(user.displayName || user.email || 'F').charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 md:p-10 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}