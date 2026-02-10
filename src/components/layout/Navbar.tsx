import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Menu, X, User, LogIn, Heart, Building, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userRole, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/properties", label: "Properties" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const getDashboardLink = () => {
    if (userRole === "admin") return "/admin/dashboard";
    if (userRole === "owner") return "/owner/dashboard";
    return "/tenant/dashboard";
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-card/95 backdrop-blur-md shadow-md py-3" : "bg-transparent py-5"
      )}
    >
      <nav className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div whileHover={{ rotate: 10 }} className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
            <Home className="w-5 h-5 text-primary-foreground" />
          </motion.div>
          <span className={cn("text-2xl font-bold transition-colors", isScrolled ? "text-foreground" : "text-white")}>
            Quick<span className="text-accent">Rent</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} to={link.href}
              className={cn("relative font-medium transition-colors hover:text-primary",
                isScrolled ? "text-foreground" : "text-white/90 hover:text-white",
                location.pathname === link.href && "text-primary"
              )}>
              {link.label}
              {location.pathname === link.href && (
                <motion.div layoutId="navbar-indicator" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full" />
              )}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link to={getDashboardLink()}>
                <Button variant={isScrolled ? "outline" : "secondary"} className="rounded-full px-6">
                  <User className="w-4 h-4 mr-2" /> Dashboard
                </Button>
              </Link>
              <Button onClick={handleLogout} className="rounded-full px-6 bg-accent hover:bg-accent/90 text-accent-foreground">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant={isScrolled ? "outline" : "secondary"} className="rounded-full px-6">
                  <LogIn className="w-4 h-4 mr-2" /> Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="rounded-full px-6 bg-accent hover:bg-accent/90 text-accent-foreground">Register</Button>
              </Link>
            </>
          )}
        </div>

        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={cn("md:hidden p-2 rounded-lg transition-colors", isScrolled ? "text-foreground" : "text-white")}>
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card border-t shadow-lg">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link key={link.href} to={link.href} onClick={() => setIsMobileMenuOpen(false)}
                  className={cn("py-2 px-4 rounded-lg font-medium transition-colors hover:bg-secondary",
                    location.pathname === link.href ? "bg-primary/10 text-primary" : "text-foreground"
                  )}>
                  {link.label}
                </Link>
              ))}
              <hr className="my-2 border-border" />
              {user ? (
                <>
                  <Link to={getDashboardLink()} onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full rounded-full"><User className="w-4 h-4 mr-2" /> Dashboard</Button>
                  </Link>
                  <Button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="w-full rounded-full bg-accent hover:bg-accent/90">
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full rounded-full"><LogIn className="w-4 h-4 mr-2" /> Login</Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full rounded-full bg-accent hover:bg-accent/90">Register</Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
