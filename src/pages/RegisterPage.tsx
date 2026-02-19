import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Home, Mail, Phone, Lock, Eye, EyeOff, User, Building, Shield, ArrowRight, ArrowLeft, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

type UserRole = "tenant" | "owner" | "admin";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "tenant" as UserRole,
  });

  const roles = [
    { id: "tenant" as UserRole, title: "Tenant", subtitle: "Find your next home", description: "Search verified rentals, schedule visits, and communicate with owners.", icon: User },
    { id: "owner" as UserRole, title: "Property Owner", subtitle: "List & manage properties", description: "Add listings, receive inquiries, and manage tenants easily.", icon: Building },
    { id: "admin" as UserRole, title: "Administrator", subtitle: "Platform management", description: "Oversee users, properties, and platform operations.", icon: Shield },
  ];

  const passwordStrength = (password: string) => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[a-z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  };

  const getStrengthInfo = (s: number) => {
    if (s <= 1) return { label: "Weak", color: "bg-destructive" };
    if (s <= 2) return { label: "Fair", color: "bg-quickrent-warning" };
    if (s <= 3) return { label: "Good", color: "bg-primary" };
    return { label: "Strong", color: "bg-quickrent-success" };
  };

  const strength = passwordStrength(formData.password);
  const strengthInfo = getStrengthInfo(strength);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) { toast.error("Passwords do not match!"); return; }
    if (strength < 3) { toast.error("Please create a stronger password!"); return; }
    if (!formData.email) { toast.error("Please enter your email address!"); return; }

    setIsLoading(true);
    try {
      await signUp(formData.email, formData.password, {
        full_name: formData.name,
        phone: formData.phone,
        role: formData.role,
      });
      toast.success("Account created successfully! You can now sign in.");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left — Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2.5 mb-10">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <Home className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">Quick<span className="text-accent">Rent</span></span>
          </Link>

          <h1 className="text-3xl font-bold text-foreground mb-1">Create Account</h1>
          <p className="text-muted-foreground mb-8">Join QuickRent — it only takes a minute</p>

          {/* Step Indicator */}
          <div className="flex items-center gap-3 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {step > s ? <Check className="w-4 h-4" /> : s}
                </div>
                <span className="text-sm font-medium text-muted-foreground hidden sm:block">{s === 1 ? "Select Role" : "Details"}</span>
                {s === 1 && <div className="flex-1 h-px bg-border w-8 mx-1" />}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                  <Label className="text-base font-semibold mb-4 block text-foreground">I want to register as:</Label>
                  <div className="space-y-3">
                    {roles.map((role) => (
                      <button key={role.id} type="button" onClick={() => setFormData({ ...formData, role: role.id })}
                        className={`w-full flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 ${formData.role === role.id ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/30 hover:bg-secondary/50"}`}>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${formData.role === role.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                          <role.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-foreground">{role.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{role.description}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-colors ${formData.role === role.id ? "border-primary bg-primary" : "border-muted-foreground/40"}`}>
                          {formData.role === role.id && <Check className="w-3 h-3 text-primary-foreground" />}
                        </div>
                      </button>
                    ))}
                  </div>
                  <Button type="button" className="w-full mt-8 h-12 rounded-xl bg-primary hover:bg-primary/90 font-semibold" onClick={() => setStep(2)}>
                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input id="name" name="name" placeholder="Enter your full name" value={formData.name} onChange={handleInputChange} className="pl-10 h-12 rounded-xl" required />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input id="email" name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleInputChange} className="pl-10 h-12 rounded-xl" required />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Mobile Number <span className="text-muted-foreground text-xs">(optional)</span></Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input id="phone" name="phone" placeholder="10-digit mobile number" value={formData.phone} onChange={handleInputChange} className="pl-10 h-12 rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Create a strong password" value={formData.password} onChange={handleInputChange} className="pl-10 pr-10 h-12 rounded-xl" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {formData.password && (
                      <div className="space-y-1 mt-1">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength ? strengthInfo.color : "bg-muted"}`} />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">Strength: <span className="font-medium">{strengthInfo.label}</span></p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Re-enter password" value={formData.confirmPassword} onChange={handleInputChange} className="pl-10 pr-10 h-12 rounded-xl" required />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="text-xs text-destructive">Passwords do not match</p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-3">
                    <Button type="button" variant="outline" className="flex-1 h-12 rounded-xl font-semibold" onClick={() => setStep(1)}>
                      <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <Button type="submit" className="flex-1 h-12 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground font-semibold" disabled={isLoading}>
                      {isLoading ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full" />
                      ) : (
                        <>Create Account</>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <p className="text-center text-muted-foreground mt-8 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
          </p>
        </motion.div>
      </div>

      {/* Right — Decorative */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary via-primary/90 to-primary/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-[0.06]" />
        <div className="relative z-10 flex flex-col items-center justify-center p-14 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
            <div className="w-20 h-20 bg-primary-foreground/15 rounded-2xl flex items-center justify-center mb-8 mx-auto backdrop-blur-sm border border-primary-foreground/10">
              <Home className="w-10 h-10 text-primary-foreground" />
            </div>
            <h2 className="text-3xl font-bold text-primary-foreground mb-3">Welcome to QuickRent</h2>
            <p className="text-primary-foreground/70 max-w-sm mb-10">
              Join thousands of tenants & property owners who trust QuickRent for their rental needs.
            </p>
            <div className="flex items-center justify-center gap-8">
              {[{ v: "10K+", l: "Properties" }, { v: "50K+", l: "Users" }, { v: "100+", l: "Cities" }].map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-bold text-primary-foreground">{s.v}</p>
                  <p className="text-xs text-primary-foreground/50 mt-1">{s.l}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
