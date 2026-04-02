"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingPage() {
  const { token, user } = useAuth();
  const router = useRouter();

  // If already logged in, redirect to dashboard or onboarding
  useEffect(() => {
    if (token) {
      if (user?.profile_completed) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
      }
    }
  }, [token, user, router]);

  return (
    <div className="min-h-screen bg-[#07090f] text-white selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-black text-sm rounded-xl shadow-lg">LP</div>
          <h1 className="text-xl font-black tracking-tighter uppercase">LinguaPath</h1>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Sign In</Link>
          <Link href="/signup"
            className="px-6 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:bg-gray-200 transition-all transform active:scale-[0.95] shadow-lg shadow-white/10"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Next-Gen Language Learning</span>
          </div>

          <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
            Master English <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              With Precision AI.
            </span>
          </h2>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Say goodbye to generic courses. LinguaPath uses advanced diagnostic analytics to build a curriculum tailored to your goals, style, and proficiency.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup"
              className="group relative px-10 py-5 rounded-2xl font-black text-lg text-white transition-all transform active:scale-[0.98] overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                boxShadow: '0 20px 40px -10px rgba(99,102,241,0.5)'
              }}
            >
              <span className="relative z-10 flex items-center gap-3">
                Start Your Journey
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            <Link href="/login"
              className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 font-bold text-lg text-gray-300 hover:bg-white/10 hover:text-white transition-all"
            >
              View Demo
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          {[
            { title: "Adaptive Engine", desc: "Our AI adjusts difficulty in real-time based on your performance.", icon: "🎯" },
            { title: "Personalized Roadmap", desc: "A curriculum built specifically for your IELTS, TOEFL, or Business goals.", icon: "🗺️" },
            { title: "Mastery Tracking", desc: "Detailed analytics on your proficiency across all English skills.", icon: "📊" }
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-colors group">
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-20 border-t border-white/5 text-center">
        <p className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.5em]">
          Precision Language Learning &bull; AI Powered &bull; CEFR Compliant
        </p>
        <p className="mt-4 text-[10px] text-gray-800 uppercase tracking-widest">
          &copy; 2026 LinguaPath Technologies. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
