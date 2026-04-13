
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Bug, 
  BarChart3, 
  Leaf, 
  Store, 
  Users, 
  Settings,
  Menu,
  X,
  Wheat,
  Truck,
  Map,
  ShoppingBag,
  LineChart,
  Brain
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Disease Detection", href: "/dashboard/disease", icon: Bug },
  { name: "Yield Prediction", href: "/dashboard/yield", icon: BarChart3 },
  { name: "Farm Services", href: "/dashboard/services", icon: Truck },
];

const ecosystemItems = [
  { name: "Lease Your Land", href: "/dashboard/lease", icon: Map },
  { name: "Harit Store", href: "/dashboard/store", icon: ShoppingBag },
];

const internalItems = [
  { name: "Field Operations", href: "/dashboard/lease/ops", icon: Users },
  { name: "AI Planner", href: "/dashboard/lease/planner", icon: Brain },
  { name: "Store Management", href: "/dashboard/store/ops", icon: Store },
  { name: "Intelligence BI", href: "/dashboard/bi", icon: LineChart },
];

export function DashboardNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const NavLink = ({ item }: { item: any }) => {
    const Icon = item.icon;
    const isActive = pathname === item.href;
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setIsOpen(false)}
        className={cn(
          "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all",
          isActive 
            ? "bg-primary text-white shadow-md shadow-primary/20" 
            : "text-sidebar-foreground hover:bg-primary/10 hover:text-primary"
        )}
      >
        <Icon className="h-5 w-5" />
        {item.name}
      </Link>
    );
  };

  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-[60]">
        <Button variant="outline" size="icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[55] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-[56] w-64 bg-sidebar border-r transition-transform duration-300 transform md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <span className="font-headline text-2xl font-bold tracking-tight text-primary">KrishiAI</span>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
            <div className="space-y-1">
              {navItems.map((item) => <NavLink key={item.href} item={item} />)}
            </div>

            <div className="space-y-1">
              <p className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Krishi Mitra Ecosystem</p>
              {ecosystemItems.map((item) => <NavLink key={item.href} item={item} />)}
            </div>

            <div className="space-y-1">
              <p className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Internal Operations</p>
              {internalItems.map((item) => <NavLink key={item.href} item={item} />)}
            </div>
            
            <div className="pt-4">
              <NavLink item={{ name: "Settings", href: "/dashboard/settings", icon: Settings }} />
            </div>
          </nav>

          <div className="p-4 mt-auto">
            <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
              <p className="text-xs font-semibold text-primary uppercase mb-2">Live Status</p>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Wheat className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold">Kharif Season</p>
                  <p className="text-[10px] text-muted-foreground uppercase">847 Acres Under Mgmt</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
