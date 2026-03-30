
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Shield, 
  Smartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LandingPageNavbar } from "@/components/layout/LandingPageNavbar";
const features = [
  {
    title: "Real-time Collaboration",
    description: "Work together with your team in real-time, no matter where they are.",
    icon: Users,
    color: "bg-blue-500"
  },
  {
    title: "Intelligent Workflows",
    description: "Automate repetitive tasks and focus on what really matters for your business.",
    icon: Zap,
    color: "bg-indigo-500"
  },
  {
    title: "Secure by Design",
    description: "Your data is encrypted and protected with industry-leading security protocols.",
    icon: Shield,
    color: "bg-emerald-500"
  },
  {
    title: "Mobile Optimized",
    description: "Manage your projects on the go with our fully responsive mobile app.",
    icon: Smartphone,
    color: "bg-rose-500"
  }
];

const tiers = [
  {
    name: "Starter",
    price: "$0",
    description: "Perfect for individuals and small side projects.",
    features: ["5 Workspaces", "10 Team members", "Basic Analytics", "Community Support"],
    buttonText: "Get Started",
    popular: false
  },
  {
    name: "Pro",
    price: "$19",
    description: "The best choice for growing teams and startups.",
    features: ["Unlimited Workspaces", "50 Team members", "Advanced Analytics", "Priority Support", "Custom Domains"],
    buttonText: "Join Pro",
    popular: true
  },
  {
    name: "Enterprise",
    price: "$99",
    description: "Custom solutions for large organizations.",
    features: ["Everything in Pro", "Unlimited Team members", "White-label Solution", "Dedicated Account Manager", "SSO & SAML"],
    buttonText: "Contact Sales",
    popular: false
  }
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <LandingPageNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-20 lg:pt-32 lg:pb-32">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-6 border border-blue-100 uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              v2.0 is now live
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
              Manage Work with <br />
              <span className="text-blue-600">Zero Friction.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-10 leading-relaxed font-normal px-4">
              Operon is the next-generation SaaS platform designed to streamline your development workflows, team collaboration, and task management.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/teams">
                <Button className="h-14 px-10 text-lg bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all hover:scale-105 active:scale-95 group">
                  Get Started for Free <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="outline" className="h-14 px-10 text-lg border-2 hover:bg-gray-50 transition-all hover:scale-105 active:scale-95">
                Watch Demo
              </Button>
            </div>
            
            {/* Hero Mockup */}
            <motion.div 
              className="mt-20 relative mx-auto max-w-5xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="rounded-2xl border bg-gray-50/50 p-4 shadow-2xl">
                <div className="rounded-xl overflow-hidden border bg-white shadow-sm ring-1 ring-gray-900/5">
                  <div className="h-8 bg-gray-100 flex items-center px-4 gap-1.5 border-b">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                    <div className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                   {/* This would be an image or a mockup of the dashboard */}
                   <div className="aspect-16/10 bg-gray-50 flex items-center justify-center relative group">
                      <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                       <span className="text-gray-400 font-medium">Platform Preview</span>
                   </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-100/50 blur-3xl opacity-30 rounded-full" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 border-y border-gray-50 bg-gray-50/30">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-gray-500 mb-8">Trusted by industry leaders</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
            {['ACME', 'Globex', 'Soylent Corp', 'Initech', 'Umbrella'].map(name => (
              <span key={name} className="text-xl font-bold text-gray-900 tracking-tighter">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-4 text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything you need to scale</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Build, manage, and scale your business with power-user features out of the box.
          </p>
        </div>
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -10 }}
              className="p-8 rounded-3xl border border-gray-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-50/50 transition-all duration-300"
            >
              <div className={`h-12 w-12 rounded-2xl ${feature.color} flex items-center justify-center mb-6 shadow-lg shadow-${feature.color.split('-')[1]}-200`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">Choose the plan that is right for your team. All plans include all core features.</p>
        </div>
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
          {tiers.map((tier, idx) => (
            <Card key={idx} className={`relative flex flex-col p-8 rounded-3xl border-none shadow-xl ${tier.popular ? 'ring-2 ring-blue-600 shadow-blue-100' : 'shadow-gray-200'}`}>
              {tier.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                  Most Popular
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-gray-900">{tier.price}</span>
                  <span className="text-gray-500 font-medium">/month</span>
                </div>
                <p className="mt-4 text-gray-600 text-sm leading-relaxed">{tier.description}</p>
              </div>
              <div className="flex-1 space-y-4 mb-8">
                {tier.features.map(f => (
                  <div key={f} className="flex items-start gap-3 text-sm text-gray-600">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <Button className={`w-full h-12 rounded-xl text-md font-bold transition-all ${tier.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-gray-800'}`}>
                {tier.buttonText}
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Ready to transform your workflow?</h2>
          <p className="text-blue-100 text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Join thousands of teams using Operon to ship faster and build better products.
          </p>
          <Link href="/teams">
            <Button className="h-16 px-12 bg-white text-blue-600 hover:bg-blue-50 text-xl font-bold rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95">
              Start Your Free Trial
            </Button>
          </Link>
          <p className="mt-6 text-blue-200 text-sm">No credit card required. Cancel anytime.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t bg-gray-50/50">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">Operon</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              The next-generation platform for modern teams. Build products that people love.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">Product</h4>
            <ul className="space-y-4 text-sm text-gray-600">
              <li><Link href="#" className="hover:text-blue-600">Features</Link></li>
              <li><Link href="#" className="hover:text-blue-600">Pricing</Link></li>
              <li><Link href="#" className="hover:text-blue-600">Integrations</Link></li>
              <li><Link href="#" className="hover:text-blue-600">Roadmap</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">Company</h4>
            <ul className="space-y-4 text-sm text-gray-600">
              <li><Link href="#" className="hover:text-blue-600">About Us</Link></li>
              <li><Link href="#" className="hover:text-blue-600">Careers</Link></li>
              <li><Link href="#" className="hover:text-blue-600">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-blue-600">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">Newsletter</h4>
            <p className="text-sm text-gray-600 mb-6">Join our newsletter for the latest updates.</p>
            <div className="flex gap-2">
              <Input placeholder="email@example.com" className="bg-white rounded-xl border-gray-100" />
              <Button className="bg-blue-600">Join</Button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 pt-12 border-t flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-gray-500 text-center">© 2024 Operon Inc. All rights reserved. Crafted with ❤️ for modern teams.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-gray-400 hover:text-blue-600 transition-colors">Twitter</Link>
            <Link href="#" className="text-gray-400 hover:text-blue-600 transition-colors">LinkedIn</Link>
            <Link href="#" className="text-gray-400 hover:text-blue-600 transition-colors">GitHub</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}