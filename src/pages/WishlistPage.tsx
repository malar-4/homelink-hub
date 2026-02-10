import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Home, Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyCard from "@/components/properties/PropertyCard";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const WishlistPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchWishlist();
    else setLoading(false);
  }, [user]);

  const fetchWishlist = async () => {
    if (!user) return;
    setLoading(true);
    const { data: wishlistData } = await supabase
      .from("wishlists")
      .select("property_id")
      .eq("user_id", user.id);

    if (wishlistData && wishlistData.length > 0) {
      const propertyIds = wishlistData.map((w) => w.property_id);
      const { data: propertiesData } = await supabase
        .from("properties")
        .select("*, property_images(image_url, display_order)")
        .in("id", propertyIds);
      setProperties(propertiesData || []);
    } else {
      setProperties([]);
    }
    setLoading(false);
  };

  const handleRemove = async (id: string) => {
    if (!user) return;
    await supabase.from("wishlists").delete().eq("user_id", user.id).eq("property_id", id);
    setProperties((prev) => prev.filter((p) => p.id !== id));
    toast.success("Removed from wishlist");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/tenant/dashboard">
                <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
              </Link>
              <Link to="/" className="flex items-center gap-2">
                <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                  <Home className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground hidden sm:block">
                  Quick<span className="text-accent">Rent</span>
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-accent" />
              <span className="font-semibold">My Wishlist</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">My Wishlist ❤️</h1>
          <p className="text-muted-foreground">
            {properties.length} {properties.length === 1 ? "property" : "properties"} saved
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full mx-auto" />
          </div>
        ) : properties.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">Start browsing properties and save your favorites!</p>
            <Link to="/tenant/dashboard">
              <Button className="rounded-full bg-primary hover:bg-primary/90">Browse Properties</Button>
            </Link>
          </motion.div>
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
                isFavorite={true}
                onFavoriteToggle={handleRemove}
                onViewDetails={(id) => navigate(`/property/${id}`)}
                onScheduleVisit={(id) => navigate(`/property/${id}`)}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default WishlistPage;
