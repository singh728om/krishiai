import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Leaf, TrendingUp, CloudRain, Smartphone, ChevronRight, Globe, ShieldCheck, Zap } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-farm');
  
  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/20">
      {/* Header */}
      <header className="px-6 h-20 flex items-center border-b bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <Link className="flex items-center justify-center gap-2 group" href="/">
          <div className="bg-primary p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
            <Leaf className="h-6 w-6 text-white" />
          </div>
          <span className="font-headline text-2xl font-bold tracking-tight text-foreground">KrishiAI</span>
        </Link>
        <nav className="ml-auto hidden md:flex gap-8 items-center">
          <Link className="text-sm font-semibold hover:text-primary transition-colors" href="#features">Features</Link>
          <Link className="text-sm font-semibold hover:text-primary transition-colors" href="#pricing">Pricing</Link>
          <div className="h-4 w-[1px] bg-border mx-2" />
          <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/auth">Login</Link>
          <Button className="rounded-full px-6 shadow-lg shadow-primary/20 font-bold" asChild>
            <Link href="/auth">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 lg:py-32 overflow-hidden">
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="flex flex-col justify-center space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20 text-primary text-sm font-bold">
                    <Zap className="h-4 w-4 fill-primary" /> The Future of Indian Agriculture
                  </div>
                  <h1 className="text-5xl font-headline font-black tracking-tighter sm:text-6xl xl:text-7xl leading-tight">
                    Farming at the speed of <span className="text-primary italic">Light.</span>
                  </h1>
                  <p className="text-xl text-muted-foreground font-medium max-w-[600px] leading-relaxed">
                    AI-powered precision for Bharat. Increase yield by 40%, diagnose diseases in seconds, and unlock carbon credit revenue.
                  </p>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button size="lg" asChild className="rounded-full px-10 h-14 text-lg font-bold shadow-xl shadow-primary/30">
                    <Link href="/auth">Start Growing Free <ChevronRight className="ml-2 h-5 w-5" /></Link>
                  </Button>
                  <Button variant="outline" size="lg" className="rounded-full px-10 h-14 text-lg font-bold border-2">
                    View Impact Report
                  </Button>
                </div>
                <div className="flex items-center gap-6 pt-4">
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-muted overflow-hidden">
                        <Image src={`https://picsum.photos/seed/farmer${i}/40/40`} alt="User" width={40} height={40} />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm font-semibold text-muted-foreground">Joined by <span className="text-foreground">50,000+</span> farmers this month</p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-accent/20 blur-3xl rounded-full" />
                <div className="relative group rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                  <Image
                    alt="Indian Farming"
                    className="aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-110"
                    height={800}
                    src={heroImage?.imageUrl || "https://picsum.photos/seed/krishi1/800/600"}
                    width={800}
                    data-ai-hint="indian agriculture"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8">
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                      <p className="text-white font-bold text-lg">Wardha, Maharashtra</p>
                      <p className="text-white/80 text-sm italic">"Yield increased by 32% since joining KrishiAI"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="w-full py-24 bg-white relative">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-20">
              <h2 className="text-4xl font-headline font-black tracking-tight sm:text-5xl">The Krishi Intelligence Suite</h2>
              <p className="max-w-[700px] text-muted-foreground text-xl">One platform. Every agricultural need met with AI precision.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Disease Diagnostics', desc: 'Instant leaf-level pathology using Gemini Vision AI. Get cures in your native tongue.', icon: Smartphone, color: 'bg-emerald-500' },
                { title: 'Market Alpha', desc: 'Predict commodity price peaks 3 weeks ahead. Never sell at a loss again.', icon: TrendingUp, color: 'bg-blue-500' },
                { title: 'Carbon Economy', desc: 'Monetize your soil health. Earn credits from global corporates automatically.', icon: Leaf, color: 'bg-primary' },
                { title: 'Weather Guard', desc: 'Hyper-local rain forecasts with 98% accuracy for your specific pin code.', icon: CloudRain, color: 'bg-accent' },
                { title: 'FPO Global', desc: 'Unified dashboard for cooperatives to manage thousands of farmers at scale.', icon: Globe, color: 'bg-purple-500' },
                { title: 'Certified Safe', desc: 'End-to-end data encryption. Your farm data belongs strictly to you.', icon: ShieldCheck, color: 'bg-slate-700' },
              ].map((feature, i) => (
                <div key={i} className="group p-8 rounded-3xl border bg-white hover:bg-muted/30 transition-all hover:border-primary/30 relative overflow-hidden">
                  <div className={cn("mb-6 h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-lg", feature.color)}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-headline font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 h-full w-1/2 bg-white/5 skew-x-12 translate-x-1/2" />
          <div className="container px-4 md:px-6 relative z-10 text-center space-y-8">
            <h2 className="text-5xl font-headline font-black tracking-tighter sm:text-7xl">Ready to upgrade your farm?</h2>
            <p className="text-primary-foreground/90 text-xl max-w-2xl mx-auto">Join the digital revolution in Indian farming today. No credit card required to start.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" variant="secondary" className="rounded-full h-16 px-12 text-xl font-bold bg-white text-primary hover:bg-white/90 shadow-2xl">
                Get Started Now
              </Button>
              <Button size="lg" variant="outline" className="rounded-full h-16 px-12 text-xl font-bold border-2 border-white/30 text-white hover:bg-white/10">
                Contact Sales
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-12 px-6 bg-white border-t">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="space-y-4">
            <Link className="flex items-center gap-2" href="/">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="font-headline text-2xl font-bold">KrishiAI</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">Empowering the backbone of Bharat with cutting-edge Silicon Valley AI.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
            <div className="space-y-3">
              <h4 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Product</h4>
              <ul className="space-y-2 text-sm font-medium">
                <li><Link href="#">Analytics</Link></li>
                <li><Link href="#">Disease AI</Link></li>
                <li><Link href="#">Credits</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Company</h4>
              <ul className="space-y-2 text-sm font-medium">
                <li><Link href="#">About</Link></li>
                <li><Link href="#">Press</Link></li>
                <li><Link href="#">Impact</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Legal</h4>
              <ul className="space-y-2 text-sm font-medium">
                <li><Link href="#">Privacy</Link></li>
                <li><Link href="#">Terms</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="container mx-auto mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground font-bold uppercase tracking-widest">
          <p>© 2024 KrishiAI Technologies. Made with ❤️ for Bharat.</p>
          <div className="flex gap-6">
            <Link href="#">Twitter</Link>
            <Link href="#">LinkedIn</Link>
            <Link href="#">Instagram</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}