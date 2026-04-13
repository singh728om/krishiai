
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Send, 
  FileDown, 
  Map, 
  TrendingUp, 
  Coins, 
  Search,
  MoreHorizontal,
  Plus
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function FPOPortalPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Wardha Farmer Producer Org (FPO)</h1>
          <p className="text-muted-foreground">Admin Portal: Managing 1,240 members across 15 villages.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-primary/20">
            <FileDown className="mr-2 h-4 w-4" /> Export Data
          </Button>
          <Button className="rounded-xl shadow-lg shadow-primary/20 bg-primary">
            <Send className="mr-2 h-4 w-4" /> Send Bulk Advisory
          </Button>
        </div>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Land Under Management", value: "5,420 Acres", icon: Map, color: "text-primary" },
          { label: "Avg Member Yield", value: "6.8 Q/Acre", icon: TrendingUp, color: "text-primary" },
          { label: "Total Carbon Credits", value: "842 Tonnes", icon: Coins, color: "text-blue-600" },
          { label: "Fee Collection (SaaS)", value: "₹4.2 Lakhs", icon: Users, color: "text-accent" },
        ].map((stat, i) => (
          <Card key={i} className="rounded-2xl border-none shadow-sm">
            <CardContent className="p-6">
              <div className="p-2 bg-muted/50 rounded-lg w-fit mb-4">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Member Management */}
        <Card className="rounded-2xl border-none shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-white border-b px-6 py-4">
            <div>
              <CardTitle className="text-lg">Member Management</CardTitle>
              <p className="text-xs text-muted-foreground">Active farmers in your cooperative</p>
            </div>
            <div className="flex gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9 h-9 w-64 rounded-xl text-xs" placeholder="Search members by name or village..." />
              </div>
              <Button size="sm" className="rounded-xl"><Plus className="h-4 w-4 mr-2" /> Add Member</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[300px]">Farmer Name</TableHead>
                  <TableHead>Village</TableHead>
                  <TableHead>Crop & Acreage</TableHead>
                  <TableHead>Health Score</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { name: "Suresh Deshmukh", village: "Anji", crop: "Cotton", acres: "5.5", health: 92, active: "10m ago", img: "2" },
                  { name: "Vinayak Rao", village: "Seloo", crop: "Soybean", acres: "12.0", health: 74, active: "2h ago", img: "3" },
                  { name: "Amol Kulkarni", village: "Deoli", crop: "Sugarcane", acres: "3.2", health: 88, active: "1d ago", img: "4" },
                  { name: "Prakash Jadhav", village: "Arvi", crop: "Cotton", acres: "8.4", health: 45, active: "3h ago", img: "5" },
                  { name: "Rahul Ghate", village: "Anji", crop: "Soybean", acres: "4.0", health: 96, active: "Just now", img: "6" },
                ].map((member, i) => (
                  <TableRow key={i} className="hover:bg-muted/10 transition-colors group">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage src={`https://picsum.photos/seed/${member.img}/32/32`} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-bold group-hover:text-primary transition-colors">{member.name}</p>
                          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">ID: #WDA-{1000 + i}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-medium">{member.village}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">{member.crop}</span>
                        <span className="text-[10px] text-muted-foreground">{member.acres} Acres</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full",
                              member.health > 80 ? "bg-emerald-500" : member.health > 60 ? "bg-amber-400" : "bg-red-500"
                            )} 
                            style={{ width: `${member.health}%` }} 
                          />
                        </div>
                        <span className="text-xs font-bold">{member.health}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{member.active}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bulk Advisory Preview */}
        <Card className="rounded-2xl border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Recent Bulk Advisories</CardTitle>
            <CardDescription>WhatsApp messages sent to your members</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: "Pest Warning Seloo", target: "242 Farmers", status: "Delivered", time: "Sep 08, 10:45 AM" },
              { title: "MSP Update Rice", target: "890 Farmers", status: "Scheduled", time: "Sep 12, 09:00 AM" },
            ].map((advisory, i) => (
              <div key={i} className="p-4 rounded-xl border bg-muted/20 flex justify-between items-center">
                <div>
                  <p className="text-sm font-bold">{advisory.title}</p>
                  <p className="text-xs text-muted-foreground">{advisory.target} • {advisory.time}</p>
                </div>
                <Badge variant={advisory.status === 'Delivered' ? 'secondary' : 'outline'} className="rounded-lg">
                  {advisory.status}
                </Badge>
              </div>
            ))}
            <Button variant="link" className="w-full text-xs font-bold uppercase text-primary">View Delivery Reports</Button>
          </CardContent>
        </Card>

        {/* Aggregate Charts Placeholder */}
        <Card className="rounded-2xl border-none shadow-sm overflow-hidden flex flex-col items-center justify-center p-8 bg-primary/5 text-center">
          <div className="p-4 bg-white rounded-full shadow-sm mb-4">
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-headline font-bold text-lg mb-2">Area-wise Analytics</h3>
          <p className="text-sm text-muted-foreground max-w-xs mb-6">Compare productivity across different villages and member clusters.</p>
          <Button variant="outline" className="rounded-xl">Open Full Dashboard</Button>
        </Card>
      </div>
    </div>
  );
}
