"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/axios";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Lock, Phone, Loader2, AlertCircle, KeyRound } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await apiClient.post("/api/auth/admin-login", {
        phone,
        password,
      });

      if (res.data.success) {
        localStorage.setItem("adminToken", res.data.token);
        localStorage.setItem("adminUser", JSON.stringify(res.data.user));
        router.push("/admin/dashboard");
      }
    } catch (err: any) {
      console.error("Admin login error:", err);
      setErrorMsg(
        err?.message || err?.response?.data?.error || "লগইন করতে সমস্যা হয়েছে। সঠিক তথ্য দিন।"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = () => {
    setPhone("01700000000");
    setPassword("admin123");
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 font-sans relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-brand/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Logo Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand text-white shadow-xl shadow-brand/30 mb-2">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">সহজ উপায়</h1>
          <p className="text-xs text-slate-400 font-semibold tracking-widest uppercase">
            Admin Manager Portal Login
          </p>
        </div>

        {/* Login Form Card */}
        <Card className="border-slate-800 bg-slate-950/80 backdrop-blur-xl text-slate-200 shadow-2xl">
          <CardHeader className="pb-4 border-b border-slate-800">
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-brand" />
              এডমিন লগইন
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs">
              ড্যাশবোর্ড একসেস করতে আপনার এডমিন ইউজারনেম ও পাসওয়ার্ড দিন।
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  এডমিন ফোন নম্বর / ইউজারনেম
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01700000000"
                    required
                    className="pl-9 bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus:border-brand"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  পাসওয়ার্ড (Password)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pl-9 bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus:border-brand"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand hover:bg-brand-dark text-white font-bold h-10 shadow-lg shadow-brand/25"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    প্রবেশ করা হচ্ছে...
                  </>
                ) : (
                  "লগইন করুন (Login)"
                )}
              </Button>
            </form>

            {/* Quick Fill Testing Helper */}
            <div className="pt-4 border-t border-slate-800/80 text-center">
              <button
                type="button"
                onClick={handleQuickFill}
                className="inline-flex items-center gap-1.5 text-xs text-brand hover:underline font-semibold"
              >
                <KeyRound className="w-3.5 h-3.5" />
                টেস্টিং ক্রেডেনশিয়াল ব্যবহার করুন (01700000000 / admin123)
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
