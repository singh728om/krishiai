'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { DashboardNav } from "@/components/dashboard/nav";
import { CloudRain, MapPin, Bell, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/auth');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardNav />
      
      <div className="flex-1 flex flex-col md:pl-64">
        {/* Top Header */}
        <header className="h-16 border-b bg-white/50 backdrop-blur sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between">
          <div className="hidden md:flex items-center gap-6 max-w-md flex-1">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-10 h-10 border-none bg-muted/50 rounded-xl" placeholder="Search crops, prices, reports..." />
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {/* Weather Widget */}
            <div className="hidden sm:flex items-center gap-3 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
              <div className="text-right">
                <p className="text-xs font-bold leading-none">32°C</p>
                <p className="text-[10px] text-primary leading-none mt-0.5">Partly Cloudy</p>
              </div>
              <CloudRain className="h-5 w-5 text-primary" />
              <div className="h-4 w-[1px] bg-primary/20" />
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span className="text-[10px] font-medium uppercase">Wardha, MH</span>
              </div>
            </div>

            <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-xl">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-accent rounded-full border-2 border-white" />
            </Button>

            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-none">{user.displayName || user.email?.split('@')[0] || 'Farmer'}</p>
                <p className="text-[10px] text-muted-foreground uppercase mt-1">Farmer Pro</p>
              </div>
              <Avatar className="h-10 w-10 border-2 border-primary/20 rounded-xl">
                <AvatarImage src={user.photoURL || `https://picsum.photos/seed/${user.uid}/40/40`} />
                <AvatarFallback>{(user.displayName || user.email || 'F').charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
