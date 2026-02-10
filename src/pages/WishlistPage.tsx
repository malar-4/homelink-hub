import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Home, Heart, ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyCard from "@/components/properties/PropertyCard";
import Footer from "@/components/layout/Footer";

// Mock wishlist data - will be replaced with real data
const mockWishlistProperties = [
  {
    id: "1",
    title: "Modern 2BHK Apartment in Anna Nagar",
    location: "Anna Nagar, Chennai",
    price: 25000,
    bhk: 2,
    bathrooms: 2,
    area: 1200,
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=60",
    rating: 4.5,
    reviewCount: 28,
    isAvailable: true,
    amenities: ["Car Parking", "Furnished", "WiFi", "Gym"],
  },
  {
    id: "4",
    title: "Luxury 4BHK Penthouse",
    location: "OMR, Chennai",
    price: 85000,
    bhk: 4,
    bathrooms: 4,
    area: 3500,
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=60",
    rating: 4.9,
    reviewCount: 62,
    isAvailable: true,
    amenities: ["Swimming Pool", "Gym", "Security", "Club House", "Car Parking"],
  },
];

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState(mockWishlistProperties.map((p) => p.id));
  const [properties, setProperties] = useState(mockWishlistProperties);

  const handleRemove = (id: string) => {
    setWishlist((prev) => prev.filter((item) => item !== id));
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/tenant/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
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
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            My Wishlist ❤️
          </h1>
          <p className="text-muted-foreground">
            {properties.length} {properties.length === 1 ? "property" : "properties"} saved
          </p>
        </motion.div>

        {properties.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">Start browsing properties and save your favorites!</p>
            <Link to="/tenant/dashboard">
              <Button className="rounded-full bg-primary hover:bg-primary/90">
                Browse Properties
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                {...property}
                isFavorite={true}
                onFavoriteToggle={handleRemove}
                onViewDetails={(id) => console.log("View:", id)}
                onScheduleVisit={(id) => console.log("Schedule:", id)}
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
