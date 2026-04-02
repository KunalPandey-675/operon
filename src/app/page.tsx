
"use client";

import Link from "next/link";
import { 
  ArrowRight, 
  CheckCircle2, 
  Shield, 
  Smartphone, 
  Users, 
  Zap, 
  LayoutDashboard, 
  MessageSquare, 
  BarChart3, 
  Clock, 
  Plus,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LandingPageNavbar } from "@/components/layout/LandingPageNavbar";
import { motion } from "framer-motion";

const features = [
  {
    title: "Project Intelligence",
    description: "Get real-time insights into your team's velocity and project health with AI-powered analytics.",
    icon: BarChart3,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Global Collaboration",
    description: "Work seamlessly across timezones with instant sync and real-time multiplayer editing.",
    icon: Users,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    title: "Secure Workspaces",
    description: "Enterprise-grade security with end-to-end encryption and custom permission layers.",
    icon: Shield,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Lightning Performance",
    description: "Built for speed. Operon responds in milliseconds, keeping your team in the flow.",
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <LandingPageNavbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-500/5 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border text-xs font-semibold text-primary mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                v2.0 is now live
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
                Better teams build <span className="text-primary italic">faster</span>.
              </h1>
              <p className="text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed">
                Operon is the next-gen task and team management platform designed for high-performance squads. Scale your output, not your overhead.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/auth/login">
                  <Button variant="premium" size="lg" className="h-14 px-8 rounded-2xl text-base group">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Button variant="ghost" size="lg" className="h-14 px-8 rounded-2xl text-base border hover:bg-secondary">
                  <Play className="mr-2 h-5 w-5 fill-current" />
                  Watch Demo
                </Button>
              </div>
              
              <div className="mt-12 flex items-center gap-4 py-2">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-background bg-secondary flex items-center justify-center overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?u=${i}`} alt="User" />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Joined by <span className="font-bold text-foreground">2,000+</span> teams this month
                </p>
              </div>
            </motion.div>

            {/* Realistic Product Preview */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative perspective-1000"
            >
              <div className="relative z-10 glass rounded-[2rem] p-3 shadow-2xl premium-shadow overflow-hidden border border-white/20 max-w-full lg:max-w-none">
                <div className="bg-background rounded-[1.5rem] overflow-hidden border shadow-inner">
                  {/* Mock UI Header */}
                  <div className="h-12 border-b bg-secondary/30 flex items-center px-4 justify-between">
                    <div className="flex gap-1.5 leading-none">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <div className="flex bg-secondary/50 rounded-md px-3 py-1 items-center gap-2">
                      <LayoutDashboard className="h-3 w-3 text-muted-foreground" />
                      <span className="text-[10px] font-medium text-muted-foreground">Sprint Overview</span>
                    </div>
                    <div className="w-12 h-4 rounded-full bg-secondary/50" />
                  </div>
                  
                  {/* Mock UI Body */}
                  <div className="p-6 min-h-[300px] lg:h-[400px] flex flex-col md:flex-row gap-6">
                    <div className="hidden md:block w-1/3 space-y-4">
                      <div className="h-4 w-1/2 bg-secondary rounded mb-6" />
                      {[1, 2, 3].map(i => (
                        <div key={i} className="p-3 bg-secondary/20 rounded-xl border-dashed border-2 border-secondary space-y-2">
                          <div className="h-2 w-3/4 bg-secondary rounded" />
                          <div className="h-1.5 w-1/2 bg-secondary/50 rounded" />
                        </div>
                      ))}
                    </div>
                    <div className="flex-1 space-y-6">
                       <div className="flex justify-between items-center mb-4">
                          <div className="h-6 w-1/3 bg-secondary rounded" />
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Plus className="h-4 w-4 text-primary" />
                          </div>
                       </div>
                       <div className="grid grid-cols-1 gap-4">
                          <div className="p-4 bg-white dark:bg-zinc-900 border rounded-2xl shadow-sm space-y-3">
                            <div className="flex justify-between">
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-600 text-[10px] font-bold">Review</span>
                              <div className="flex -space-x-2">
                                <div className="h-5 w-5 rounded-full border border-background bg-secondary" />
                                <div className="h-5 w-5 rounded-full border border-background bg-secondary" />
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <div className="h-3 w-full bg-secondary/80 rounded" />
                              <div className="h-2 w-1/2 bg-secondary/40 rounded" />
                            </div>
                          </div>
                          <div className="p-4 bg-white dark:bg-zinc-900 border rounded-2xl shadow-sm space-y-3">
                            <div className="flex justify-between">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-bold">Done</span>
                              <div className="h-5 w-5 rounded-full border border-background bg-secondary" />
                            </div>
                            <div className="h-3 w-4/5 bg-secondary/80 rounded" />
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Float Elements */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-2 lg:-right-6 z-20 glass p-4 rounded-2xl shadow-xl border-white/30 scale-90 lg:scale-100 origin-right"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-500 p-2 rounded-lg shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                  <div className="pr-2 lg:pr-4">
                     <p className="text-[10px] lg:text-xs font-bold">Task Completed</p>
                     <p className="text-[8px] lg:text-[10px] text-muted-foreground">Main hero section redesigned</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-8 lg:-bottom-12 -left-4 lg:-left-12 z-20 glass p-4 rounded-2xl shadow-xl border-white/30 w-48 lg:w-56 scale-90 lg:scale-100 origin-left"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-bold">Velocity</p>
                    <span className="text-[10px] font-bold text-emerald-500">+12%</span>
                  </div>
                  <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "75%" }}
                      transition={{ duration: 1, delay: 1 }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Social Proof */}
      <section className="py-20 border-y bg-secondary/20">
        <div className="container mx-auto px-4">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground mb-12">Trusted by modern organizations</p>
          <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-20 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer">
            {["LINEAR", "VERCEL", "STRIPE", "NOTION", "RAYCAST", "ARC"].map((name) => (
              <span key={name} className="text-2xl font-black tracking-tighter text-foreground decoration-primary decoration-4 underline-offset-8 transition-all hover:underline">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary font-bold text-xs uppercase tracking-widest bg-primary/10 px-4 py-1.5 rounded-full inline-block mb-4">Core Capabilities</span>
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 tracking-tight">Everything you need to ship.</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              We've distilled the complex world of project management into a simple, high-fidelity experience.
            </p>
          </motion.div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature) => (
            <motion.div 
              key={feature.title} 
              variants={itemVariants}
              className="group p-8 rounded-[2rem] bg-secondary/20 border-transparent border-2 hover:border-primary/20 transition-all duration-300 hover:bg-background hover:shadow-2xl hover:-translate-y-2"
            >
              <div className={`mb-6 h-12 w-12 rounded-2xl flex items-center justify-center ${feature.bg} group-hover:scale-110 transition-transform`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Product Showcase / Stats */}
      <section className="py-24 bg-card border-y">
        <div className="container mx-auto px-4">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="order-2 lg:order-1">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                       <div className="p-6 bg-background rounded-3xl border shadow-sm space-y-4">
                          <Clock className="h-8 w-8 text-indigo-500" />
                          <p className="text-3xl font-black">2.4x</p>
                          <p className="text-xs text-muted-foreground">Average team velocity increase after 3 months.</p>
                       </div>
                       <div className="p-6 bg-primary dark:bg-primary rounded-3xl shadow-xl shadow-primary/20 space-y-4">
                          <Zap className="h-8 w-8 text-primary-foreground fill-primary-foreground" />
                          <p className="text-3xl font-black text-primary-foreground">Instant</p>
                          <p className="text-xs text-primary-foreground/80">Zero database lag. Every action is reflected in real-time.</p>
                       </div>
                    </div>
                    <div className="space-y-4 pt-8">
                       <div className="p-6 bg-background rounded-3xl border shadow-sm space-y-4">
                          <MessageSquare className="h-8 w-8 text-amber-500" />
                          <p className="text-3xl font-black">0</p>
                          <p className="text-xs text-muted-foreground">Unnoticed messages. Built-in contextual threads.</p>
                       </div>
                       <div className="p-6 bg-background rounded-3xl border shadow-sm space-y-4">
                          <Users className="h-8 w-8 text-emerald-500" />
                          <p className="text-3xl font-black">99.9%</p>
                          <p className="text-xs text-muted-foreground">Uptime SLA for enterprise organizations.</p>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="order-1 lg:order-2 space-y-8">
                 <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight">Built for speed.<br/>Built for scale.</h2>
                 <p className="text-muted-foreground text-lg leading-relaxed">
                    Operon isn't just another task list. It's a system designed to help your team maintain momentum. We eliminate the friction of clicking through menus, so you can focus on writing code or designing experiences.
                 </p>
                 <Link href="/auth/login" className="inline-block">
                    <Button variant="premium" className="h-12 px-8 rounded-xl font-bold">Start Building</Button>
                 </Link>
              </div>
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-10" />
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto p-12 lg:p-20 rounded-[3rem] bg-foreground dark:bg-zinc-900 shadow-2xl relative overflow-hidden"
          >
            {/* Background elements for CTA */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
               <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary rounded-full blur-[80px]" />
               <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-400 rounded-full blur-[80px]" />
            </div>

            <h2 className="text-4xl lg:text-6xl font-black text-background dark:text-foreground mb-8 tracking-tighter">Ready to join the<br/>top 1% of teams?</h2>
            <p className="text-background/70 dark:text-muted-foreground/80 text-xl mb-12 max-w-2xl mx-auto">
              Join thousands of teams who have already ditched legacy tools for Operon. Start free and upgrade when you're ready.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth/login">
                <Button variant="premium" size="lg" className="h-16 px-12 rounded-2xl text-lg font-black w-full sm:w-auto">
                  Start Your Sprint
                </Button>
              </Link>
              <Button variant="ghost" size="lg" className="h-16 px-12 rounded-2xl text-lg font-bold w-full sm:w-auto text-background dark:text-foreground hover:bg-background/10">
                Book Enterprise Demo
              </Button>
            </div>
            <p className="mt-8 text-background/50 dark:text-muted-foreground/50 text-sm">No credit card required • Free for up to 10 users</p>
          </motion.div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="py-24 border-t bg-background">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 mb-8">
              <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <Zap className="h-5 w-5 text-primary-foreground fill-primary-foreground" />
              </div>
              <span className="font-black text-2xl tracking-tighter">Operon</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-xs">
              The next-generation platform for modern teams. Built for speed, designed for clarity.
            </p>
            <div className="flex items-center gap-4">
               {['TWITTER', 'GITHUB', 'LINKEDIN'].map(social => (
                  <Link key={social} href="#" className="text-xs font-black tracking-widest text-muted-foreground hover:text-primary transition-colors">{social}</Link>
               ))}
            </div>
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest mb-10">Product</h4>
            <ul className="space-y-4 text-sm font-medium text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Platform</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Release Notes</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Integrations</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest mb-10">Company</h4>
            <ul className="space-y-4 text-sm font-medium text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Press Kit</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest mb-10">Stay Updated</h4>
            <p className="text-sm text-muted-foreground mb-6">Join 10,000+ engineers receiving our weekly product updates.</p>
            <div className="flex gap-2">
              <Input placeholder="Engineering Email" className="bg-secondary/30 rounded-xl border-secondary h-11 focus-visible:ring-1" />
              <Button className="h-11 rounded-xl bg-foreground text-background dark:bg-primary dark:text-primary-foreground px-6 font-bold">Sub</Button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 pt-12 border-t flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-center text-xs font-medium text-muted-foreground tracking-wide">© 2026 OPERON INC. ALL RIGHTS RESERVED. (SF / LONDON / REMOTE)</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs font-bold text-muted-foreground hover:text-foreground">PRIVACY POLICY</Link>
            <Link href="#" className="text-xs font-bold text-muted-foreground hover:text-foreground">TERMS OF SERVICE</Link>
            <Link href="#" className="text-xs font-bold text-muted-foreground hover:text-foreground">STATUS</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}