import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Home, Mail, ArrowLeft, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error("Please enter your email address"); return; }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
      toast.success("Password reset email sent!");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2.5 mb-10">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
            <Home className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground">Quick<span className="text-accent">Rent</span></span>
        </Link>

        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Check Your Email</h1>
            <p className="text-muted-foreground mb-8">
              We sent a password reset link to <strong>{email}</strong>. Check your inbox and click the link to reset your password.
            </p>
            <Link to="/login">
              <Button variant="outline" className="rounded-xl">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-foreground mb-1">Forgot Password?</h1>
            <p className="text-muted-foreground mb-8">
              Enter your email and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-12 rounded-xl" required />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 font-semibold" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send Reset Link <ArrowRight className="w-4 h-4 ml-2" /></>}
              </Button>
            </form>

            <p className="text-center text-muted-foreground mt-8 text-sm">
              Remember your password?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
