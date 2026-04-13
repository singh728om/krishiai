import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Leaf, TrendingUp, CloudRain, Smartphone, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-farm');
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <Link className="flex items-center justify-center gap-2" href="/">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="font-headline text-2xl font-bold tracking-tight text-primary">KrishiAI</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#features">Features</Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#pricing">Pricing</Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="/auth">Login</Link>
          <Button size="sm" asChild>
            <Link href="/auth">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden">
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px] items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    AI-powered farming for <span className="text-primary">Bharat</span>
                  </h1>
                  <p className="text-xl text-muted-foreground font-medium italic">
                    भारत के किसानों के लिए आधुनिक तकनीक। (Modern technology for India's farmers.)
                  </p>
                  <p className="max-w-[600px] text-muted-foreground md:text-lg">
                    Increase your crop yield by up to 40% with real-time disease detection, precise market intelligence, and carbon credit earnings.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild className="px-8">
                    <Link href="/auth">Start Free Trial <ChevronRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                  <Button variant="outline" size="lg">Watch Demo</Button>
                </div>
              </div>
              <div className="relative group rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  alt="Indian Farming"
                  className="aspect-video object-cover transition-transform duration-500 group-hover:scale-105"
                  height={600}
                  src={heroImage?.imageUrl || "https://picsum.photos/seed/krishi1/800/600"}
                  width={800}
                  data-ai-hint="indian farm"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          </div>
          {/* Background Decorative elements */}
          <div className="absolute top-0 right-0 -z-10 w-1/3 h-1/2 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -z-10 w-1/4 h-1/3 bg-accent/5 rounded-full blur-3xl" />
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <p className="text-4xl font-headline font-bold text-primary">146M+</p>
                <p className="text-sm text-muted-foreground uppercase tracking-wider">Farmers Impacted</p>
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-headline font-bold text-primary">₹24B</p>
                <p className="text-sm text-muted-foreground uppercase tracking-wider">Market Value</p>
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-headline font-bold text-primary">40%</p>
                <p className="text-sm text-muted-foreground uppercase tracking-wider">Yield Improvement</p>
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-headline font-bold text-primary">10+</p>
                <p className="text-sm text-muted-foreground uppercase tracking-wider">Indian Languages</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">Core Modules</div>
                <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl">Tools designed for prosperity</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to transform your farm into a high-tech business.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Crop Disease AI', desc: 'Upload a photo and get instant diagnosis with treatment advice in regional languages.', icon: Smartphone },
                { title: 'Yield Prediction', desc: 'AI-driven forecasting based on soil, weather, and historical data.', icon: TrendingUp },
                { title: 'Carbon Credits', desc: 'Earn money by sequestering CO2 through sustainable soil practices.', icon: Leaf },
                { title: 'Market Prices', desc: 'Real-time commodity rates from across India with optimal selling predictions.', icon: CloudRain },
              ].map((feature, i) => (
                <Card key={i} className="group hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardContent className="p-6 space-y-4">
                    <div className="p-3 bg-primary/10 w-fit rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-headline font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-muted/20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl">Simple, fair pricing</h2>
              <p className="max-w-[600px] text-muted-foreground">Choose the plan that fits your farm's scale.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'Free', price: '₹0', features: ['WhatsApp Price Alerts', 'Basic Weather Forecasts', '5 Disease Scans/Season'], cta: 'Get Started' },
                { name: 'Farmer Pro', price: '₹99', sub: '/season', features: ['Unlimited AI Disease Scans', 'Yield Prediction Reports', 'Carbon Credit Listing', 'Priority Support'], cta: 'Go Pro', featured: true },
                { name: 'FPO / Co-op', price: '₹2,000', sub: '/month', features: ['Bulk Farmer Management', 'Aggregate Analytics', 'Automated Bulk Advisories', 'White-labeled Reports'], cta: 'Contact Sales' },
              ].map((plan, i) => (
                <Card key={i} className={`relative flex flex-col p-8 ${plan.featured ? 'border-primary ring-1 ring-primary' : ''}`}>
                  {plan.featured && (
                    <div className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</div>
                  )}
                  <div className="mb-8">
                    <h3 className="text-2xl font-headline font-bold">{plan.name}</h3>
                    <div className="flex items-baseline mt-4">
                      <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                      <span className="text-muted-foreground ml-1">{plan.sub || ''}</span>
                    </div>
                  </div>
                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm">
                        <Check className="h-4 w-4 text-primary" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={plan.featured ? 'default' : 'outline'}>{plan.cta}</Button>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl text-center mb-12">Trusted by farmers across India</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'Ramesh Patel', state: 'Maharashtra', quote: 'KrishiAI identified pests in my Cotton crop in seconds. Saved me lakhs in potential loss.' },
                { name: 'Balvinder Singh', state: 'Punjab', quote: 'Yield prediction helped me plan my harvest and get the best price in the mandi.' },
                { name: 'Ananya Reddy', state: 'Andhra Pradesh', quote: 'Carbon credits are a new source of income I never thought was possible for small farmers.' },
              ].map((t, i) => (
                <div key={i} className="flex flex-col gap-4 p-6 bg-muted/10 rounded-2xl">
                  <p className="italic text-lg">"{t.quote}"</p>
                  <div>
                    <p className="font-bold text-primary">{t.name}</p>
                    <p className="text-xs text-muted-foreground uppercase">{t.state}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-6 bg-white border-t">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2024 KrishiAI. All rights reserved.</p>
          <nav className="flex gap-4 sm:gap-6">
            <Link className="text-xs hover:underline underline-offset-4" href="#">Terms</Link>
            <Link className="text-xs hover:underline underline-offset-4" href="#">Privacy</Link>
            <Link className="text-xs hover:underline underline-offset-4" href="#">Contact</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
