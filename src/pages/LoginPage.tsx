import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Home, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const LoginPage = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn(formData.email, formData.password);

      // Fetch user role to redirect accordingly
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .maybeSingle();

        const role = roleData?.role || "tenant";
        toast.success("Welcome back!");

        if (role === "admin") navigate("/admin/dashboard");
        else if (role === "owner") navigate("/owner/dashboard");
        else navigate("/tenant/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left — Decorative */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-accent via-accent/90 to-accent/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-[0.06]" />
        <div className="relative z-10 flex flex-col items-center justify-center p-14 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
            <div className="w-20 h-20 bg-accent-foreground/15 rounded-2xl flex items-center justify-center mb-8 mx-auto backdrop-blur-sm border border-accent-foreground/10">
              <Home className="w-10 h-10 text-accent-foreground" />
            </div>
            <h2 className="text-3xl font-bold text-accent-foreground mb-3">Welcome Back!</h2>
            <p className="text-accent-foreground/70 max-w-sm mb-10">
              Sign in to continue managing your properties or finding your next home.
            </p>

            {/* Animated Cards */}
            <div className="relative h-48 w-full max-w-xs mx-auto">
              {[0, 1, 2].map((i) => (
                <motion.div key={i}
                  animate={{ y: [0, i % 2 === 0 ? -10 : 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                  className={`absolute ${i === 0 ? "left-0 top-0" : i === 1 ? "right-0 top-6" : "left-1/4 bottom-0"} w-32 h-24 bg-accent-foreground/10 backdrop-blur-sm rounded-xl p-4 border border-accent-foreground/10`}>
                  <div className="w-full h-1.5 bg-accent-foreground/20 rounded mb-2" />
                  <div className="w-3/4 h-1.5 bg-accent-foreground/20 rounded mb-2" />
                  <div className="w-1/2 h-1.5 bg-accent-foreground/20 rounded" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2.5 mb-10">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <Home className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">Quick<span className="text-accent">Rent</span></span>
          </Link>

          <h1 className="text-3xl font-bold text-foreground mb-1">Sign In</h1>
          <p className="text-muted-foreground mb-8">Welcome back! Enter your credentials to continue.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="email" name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleInputChange} className="pl-10 h-12 rounded-xl" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={formData.password} onChange={handleInputChange} className="pl-10 pr-10 h-12 rounded-xl" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 font-semibold text-base" disabled={isLoading}>
              {isLoading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" />
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4 ml-2" /></>
              )}
            </Button>
          </form>

          <div className="text-center mt-6">
            <Link to="/forgot-password" className="text-sm text-accent font-semibold hover:underline">Forgot your password?</Link>
          </div>

          <p className="text-center text-muted-foreground mt-4 text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">Create Account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
