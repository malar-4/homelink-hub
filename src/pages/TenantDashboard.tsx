import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Home, Bell, User, LogOut, Heart, Calendar, Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FilterBar from "@/components/properties/FilterBar";
import PropertyCard from "@/components/properties/PropertyCard";
import Footer from "@/components/layout/Footer";

// Mock data for properties
const mockProperties = [
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
    id: "2",
    title: "Spacious 3BHK Villa with Garden",
    location: "Velachery, Chennai",
    price: 45000,
    bhk: 3,
    bathrooms: 3,
    area: 2000,
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviewCount: 45,
    isAvailable: true,
    amenities: ["Car Parking", "Garden", "Security", "Power Backup"],
  },
  {
    id: "3",
    title: "Cozy 1BHK Studio Apartment",
    location: "T.Nagar, Chennai",
    price: 15000,
    bhk: 1,
    bathrooms: 1,
    area: 650,
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=60",
    rating: 4.2,
    reviewCount: 18,
    isAvailable: false,
    amenities: ["Furnished", "WiFi", "Water Supply"],
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
  {
    id: "5",
    title: "Budget-Friendly 2BHK Flat",
    location: "Adyar, Chennai",
    price: 18000,
    bhk: 2,
    bathrooms: 1,
    area: 900,
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60",
    rating: 4.0,
    reviewCount: 12,
    isAvailable: true,
    amenities: ["Two Wheeler Parking", "Water Supply"],
  },
  {
    id: "6",
    title: "Premium 3BHK with Sea View",
    location: "Besant Nagar, Chennai",
    price: 55000,
    bhk: 3,
    bathrooms: 2,
    area: 1800,
    imageUrl: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&auto=format&fit=crop&q=60",
    rating: 4.7,
    reviewCount: 38,
    isAvailable: true,
    amenities: ["Sea View", "Furnished", "Gym", "Security", "Power Backup"],
  },
];

const TenantDashboard = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const handleFavoriteToggle = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleViewDetails = (id: string) => {
    navigate(`/property/${id}`);
  };

  const handleScheduleVisit = (id: string) => {
    console.log("Schedule visit:", id);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground hidden sm:block">
                Quick<span className="text-accent">Rent</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/tenant/dashboard" className="text-foreground font-medium flex items-center gap-2">
                <Search className="w-4 h-4" />
                Browse
              </Link>
              <Link to="/tenant/wishlist" className="text-muted-foreground hover:text-foreground flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Wishlist
                {wishlist.length > 0 && (
                  <Badge className="h-5 w-5 p-0 flex items-center justify-center bg-accent text-accent-foreground text-xs">
                    {wishlist.length}
                  </Badge>
                )}
              </Link>
              <Link to="/tenant/visits" className="text-muted-foreground hover:text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                My Visits
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <span className="hidden sm:block font-medium">John Doe</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Heart className="w-4 h-4 mr-2" />
                    Wishlist
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Calendar className="w-4 h-4 mr-2" />
                    My Visits
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Nav */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t border-border"
            >
              <nav className="flex flex-col gap-2">
                <Link
                  to="/tenant/dashboard"
                  className="px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium flex items-center gap-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Search className="w-4 h-4" />
                  Browse
                </Link>
                <Link
                  to="/tenant/wishlist"
                  className="px-4 py-2 rounded-lg hover:bg-secondary text-foreground flex items-center gap-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Heart className="w-4 h-4" />
                  Wishlist ({wishlist.length})
                </Link>
                <Link
                  to="/tenant/visits"
                  className="px-4 py-2 rounded-lg hover:bg-secondary text-foreground flex items-center gap-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Calendar className="w-4 h-4" />
                  My Visits
                </Link>
              </nav>
            </motion.div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Welcome back, John! 👋
          </h1>
          <p className="text-muted-foreground">
            Find your perfect rental home from our verified listings
          </p>
        </motion.div>

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <FilterBar />
        </motion.div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing <span className="text-foreground font-semibold">{mockProperties.length}</span> properties
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <select className="bg-card border border-border rounded-lg px-3 py-1.5 text-sm">
              <option>Relevance</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest First</option>
              <option>Rating</option>
            </select>
          </div>
        </div>

        {/* Property Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProperties.map((property) => (
            <PropertyCard
              key={property.id}
              {...property}
              isFavorite={wishlist.includes(property.id)}
              onFavoriteToggle={handleFavoriteToggle}
              onViewDetails={handleViewDetails}
              onScheduleVisit={handleScheduleVisit}
            />
          ))}
        </div>

        {/* Load More */}
        <div className="flex justify-center mt-12">
          <Button variant="outline" size="lg" className="rounded-full px-8">
            Load More Properties
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TenantDashboard;
