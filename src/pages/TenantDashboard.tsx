import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Home, Bell, User, LogOut, Heart, Calendar, Search, Menu, X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FilterBar from "@/components/properties/FilterBar";
import PropertyCard from "@/components/properties/PropertyCard";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const TenantDashboard = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<any>({});

  useEffect(() => {
    fetchProperties();
    if (user) fetchWishlist();
  }, [user]);

  const fetchProperties = async () => {
    setLoading(true);
    let query = supabase
      .from("properties")
      .select("*, property_images(image_url, display_order)")
      .eq("is_available", true)
      .order("created_at", { ascending: false });

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching properties:", error);
    } else {
      setProperties(data || []);
    }
    setLoading(false);
  };

  const fetchWishlist = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("wishlists")
      .select("property_id")
      .eq("user_id", user.id);
    if (data) setWishlist(data.map((w) => w.property_id));
  };

  const handleFavoriteToggle = async (id: string) => {
    if (!user) {
      toast.error("Please login to add to wishlist");
      navigate("/login");
      return;
    }
    const isFav = wishlist.includes(id);
    if (isFav) {
      await supabase.from("wishlists").delete().eq("user_id", user.id).eq("property_id", id);
      setWishlist((prev) => prev.filter((item) => item !== id));
      toast.success("Removed from wishlist");
    } else {
      await supabase.from("wishlists").insert({ user_id: user.id, property_id: id });
      setWishlist((prev) => [...prev, id]);
      toast.success("Added to wishlist");
    }
  };

  const handleViewDetails = (id: string) => navigate(`/property/${id}`);
  const handleScheduleVisit = (id: string) => {
    navigate(`/property/${id}?schedule=true`);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground hidden sm:block">
                Quick<span className="text-accent">Rent</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link to="/tenant/dashboard" className="text-foreground font-medium flex items-center gap-2">
                <Search className="w-4 h-4" /> Browse
              </Link>
              <Link to="/tenant/wishlist" className="text-muted-foreground hover:text-foreground flex items-center gap-2">
                <Heart className="w-4 h-4" /> Wishlist
                {wishlist.length > 0 && (
                  <Badge className="h-5 w-5 p-0 flex items-center justify-center bg-accent text-accent-foreground text-xs">
                    {wishlist.length}
                  </Badge>
                )}
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <span className="hidden sm:block font-medium">{displayName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="w-4 h-4 mr-2" /> Edit Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/tenant/wishlist")}>
                    <Heart className="w-4 h-4 mr-2" /> Wishlist
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="md:hidden py-4 border-t border-border">
              <nav className="flex flex-col gap-2">
                <Link to="/tenant/dashboard" className="px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <Search className="w-4 h-4" /> Browse
                </Link>
                <Link to="/tenant/wishlist" className="px-4 py-2 rounded-lg hover:bg-secondary text-foreground flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <Heart className="w-4 h-4" /> Wishlist ({wishlist.length})
                </Link>
              </nav>
            </motion.div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Welcome{user ? `, ${displayName}` : ""}! 👋
          </h1>
          <p className="text-muted-foreground">Find your perfect rental home from our verified listings</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <FilterBar />
        </motion.div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing <span className="text-foreground font-semibold">{properties.length}</span> properties
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full mx-auto" />
            <p className="text-muted-foreground mt-4">Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <Home className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No properties found</h2>
            <p className="text-muted-foreground">Properties will appear here once owners list them.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                title={property.title}
                location={`${property.location}, ${property.city}`}
                price={property.price_per_month}
                bhk={property.bhk}
                bathrooms={2}
                area={1200}
                imageUrl={property.property_images?.[0]?.image_url || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=60"}
                rating={4.5}
                reviewCount={0}
                isAvailable={property.is_available}
                amenities={property.amenities || []}
                isFavorite={wishlist.includes(property.id)}
                onFavoriteToggle={handleFavoriteToggle}
                onViewDetails={handleViewDetails}
                onScheduleVisit={handleScheduleVisit}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default TenantDashboard;
