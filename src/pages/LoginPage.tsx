import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Home, Mail, Lock, Eye, EyeOff, User, Building, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

type UserRole = "tenant" | "owner" | "admin";

const LoginPage = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "tenant" as UserRole,
  });

  const roles = [
    { id: "tenant", title: "Tenant", icon: User, color: "bg-blue-500" },
    { id: "owner", title: "Owner", icon: Building, color: "bg-green-500" },
    { id: "admin", title: "Admin", icon: Shield, color: "bg-purple-500" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (value: string) => {
    setFormData({ ...formData, role: value as UserRole });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn(formData.email, formData.password);
      toast.success(`Welcome back! Logged in successfully`);
      
      if (formData.role === "admin") {
        navigate("/admin/dashboard");
      } else if (formData.role === "owner") {
        navigate("/owner/dashboard");
      } else {
        navigate("/tenant/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex flex-1 bg-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-10" />
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <div className="w-24 h-24 bg-accent-foreground/20 rounded-3xl flex items-center justify-center mb-8 mx-auto">
              <Home className="w-12 h-12 text-accent-foreground" />
            </div>
            <h2 className="text-3xl font-bold text-accent-foreground mb-4">Welcome Back!</h2>
            <p className="text-accent-foreground/80 max-w-md mb-8">Sign in to continue your property search or manage your listings.</p>
            <div className="relative h-48 w-full max-w-sm mx-auto">
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="absolute left-0 top-0 w-32 h-24 bg-accent-foreground/10 backdrop-blur-sm rounded-xl p-3">
                <div className="w-full h-2 bg-accent-foreground/20 rounded mb-2" />
                <div className="w-3/4 h-2 bg-accent-foreground/20 rounded mb-2" />
                <div className="w-1/2 h-2 bg-accent-foreground/20 rounded" />
              </motion.div>
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute right-0 top-8 w-32 h-24 bg-accent-foreground/10 backdrop-blur-sm rounded-xl p-3">
                <div className="w-full h-2 bg-accent-foreground/20 rounded mb-2" />
                <div className="w-2/3 h-2 bg-accent-foreground/20 rounded mb-2" />
                <div className="w-1/3 h-2 bg-accent-foreground/20 rounded" />
              </motion.div>
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute left-1/4 bottom-0 w-32 h-24 bg-accent-foreground/10 backdrop-blur-sm rounded-xl p-3">
                <div className="w-full h-2 bg-accent-foreground/20 rounded mb-2" />
                <div className="w-4/5 h-2 bg-accent-foreground/20 rounded mb-2" />
                <div className="w-2/5 h-2 bg-accent-foreground/20 rounded" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <Home className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">
              Quick<span className="text-accent">Rent</span>
            </span>
          </Link>

          <h1 className="text-3xl font-bold text-foreground mb-2">Sign In</h1>
          <p className="text-muted-foreground mb-8">Welcome back! Please enter your details</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Login as:</Label>
              <RadioGroup value={formData.role} onValueChange={handleRoleChange} className="flex gap-3">
                {roles.map((role) => (
                  <label key={role.id} className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.role === role.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                    <RadioGroupItem value={role.id} className="sr-only" />
                    <div className={`w-10 h-10 ${role.color} rounded-lg flex items-center justify-center`}>
                      <role.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{role.title}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="email" name="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleInputChange} className="pl-10 h-12 rounded-xl" required />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={formData.password} onChange={handleInputChange} className="pl-10 pr-10 h-12 rounded-xl" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" />
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4 ml-2" /></>
              )}
            </Button>
          </form>

          <p className="text-center text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">Create Account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
