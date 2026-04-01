
"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, Smartphone, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LandingPageNavbar } from "@/components/layout/LandingPageNavbar";

const features = [
  {
    title: "Real-time Collaboration",
    description: "Work with your team in real time.",
    icon: Users,
    color: "bg-blue-500",
  },
  {
    title: "Simple Workflows",
    description: "Automate repetitive steps and keep work moving.",
    icon: Zap,
    color: "bg-indigo-500",
  },
  {
    title: "Secure by Design",
    description: "Your data is protected with standard security practices.",
    icon: Shield,
    color: "bg-emerald-500",
  },
  {
    title: "Mobile Optimized",
    description: "Use Operon from your phone or laptop.",
    icon: Smartphone,
    color: "bg-rose-500",
  },
];

const tiers = [
  {
    name: "Starter",
    price: "$0",
    description: "Perfect for individuals and small side projects.",
    features: ["5 Workspaces", "10 Team members", "Basic Analytics", "Community Support"],
    buttonText: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
    description: "The best choice for growing teams and startups.",
    features: ["Unlimited Workspaces", "50 Team members", "Advanced Analytics", "Priority Support", "Custom Domains"],
    buttonText: "Join Pro",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    description: "Custom solutions for large organizations.",
    features: ["Everything in Pro", "Unlimited Team members", "White-label Solution", "Dedicated Account Manager", "SSO & SAML"],
    buttonText: "Contact Sales",
    popular: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingPageNavbar />

      <section className="px-4 pb-20 pt-24 lg:pt-28">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-600">Built for student teams</p>
            <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
              Manage tasks and teams without making things complicated
            </h1>
            <p className="mt-4 max-w-xl text-base text-gray-600 sm:text-lg">
              Operon helps you organize projects, assign work, and stay aligned. It is simple enough to start quickly,
              but flexible enough as your team grows.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/teams">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Start free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline">View demo</Button>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="rounded-lg border bg-gray-50 p-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">Team Overview</p>
              <div className="space-y-2">
                <div className="h-9 rounded bg-white" />
                <div className="h-9 rounded bg-white" />
                <div className="h-9 rounded bg-white" />
                <div className="h-9 rounded bg-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-gray-50/50 py-10">
        <div className="container mx-auto px-4">
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Teams using Operon</p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-semibold text-gray-500 md:gap-10">
            {["ACME", "Globex", "Initech", "Pied Piper", "Umbrella"].map((name) => (
              <span key={name}>{name}</span>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-4 text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Features that keep work moving</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Clean features, no overload.
          </p>
        </div>
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-gray-200 p-6">
              <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${feature.color}`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">Choose the plan that is right for your team. All plans include all core features.</p>
        </div>
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
          {tiers.map((tier) => (
            <Card key={tier.name} className={`relative flex flex-col rounded-2xl border p-8 ${tier.popular ? "border-blue-300" : "border-gray-200"}`}>
              {tier.popular && (
                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white">
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
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 text-sm text-gray-600">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <Button className={tier.popular ? "w-full bg-blue-600 hover:bg-blue-700" : "w-full"}>
                {tier.buttonText}
              </Button>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-blue-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">Ready to ship faster?</h2>
          <p className="mx-auto mb-10 max-w-2xl text-blue-100">
            Start with the free plan and invite your team in a few minutes.
          </p>
          <Link href="/teams">
            <Button className="bg-white text-blue-600 hover:bg-blue-50">
              Start Your Free Trial
            </Button>
          </Link>
          <p className="mt-4 text-sm text-blue-200">No credit card required.</p>
        </div>
      </section>

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
          <p className="text-center text-sm text-gray-500">© 2026 Operon Inc. All rights reserved.</p>
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