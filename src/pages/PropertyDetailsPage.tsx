import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home, MapPin, Bed, Bath, Square, Star, Calendar, Heart,
  ArrowLeft, Car, Sofa, Wifi, Dumbbell, Shield, Droplets,
  Phone, Mail, ChevronLeft, ChevronRight, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import Footer from "@/components/layout/Footer";

// Mock data - will be replaced with real data
const mockProperty = {
  id: "1",
  title: "Modern 2BHK Apartment in Anna Nagar",
  description: "A beautifully designed 2BHK apartment with modern amenities. The apartment features spacious rooms with natural lighting, a modular kitchen, and a balcony overlooking the garden. Located in the heart of Anna Nagar with easy access to schools, hospitals, and shopping centers.",
  location: "Anna Nagar, Chennai",
  address: "42, 3rd Cross Street, Anna Nagar West, Chennai - 600040",
  price: 25000,
  bhk: 2,
  bathrooms: 2,
  area: 1200,
  images: [
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop&q=80",
  ],
  rating: 4.5,
  reviewCount: 28,
  isAvailable: true,
  amenities: ["Car Parking", "Furnished", "WiFi", "Gym", "24/7 Security", "Water Supply", "Power Backup"],
  ownerName: "Rajesh Kumar",
  ownerPhone: "+91 98765 43210",
  propertyType: "Apartment",
};

const mockReviews = [
  { id: "1", user: "Priya S.", rating: 5, content: "Excellent apartment! Very clean and well-maintained. The owner is very responsive.", date: "2026-01-15" },
  { id: "2", user: "Rahul K.", rating: 4, content: "Good location and amenities. Slightly noisy during peak hours.", date: "2026-01-10" },
  { id: "3", user: "Ananya P.", rating: 5, content: "Perfect for families. Spacious rooms and great ventilation.", date: "2025-12-20" },
];

const amenityIcons: Record<string, any> = {
  "Car Parking": Car,
  "Furnished": Sofa,
  "WiFi": Wifi,
  "Gym": Dumbbell,
  "24/7 Security": Shield,
  "Water Supply": Droplets,
  "Power Backup": Shield,
};

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("");
  const [visitMessage, setVisitMessage] = useState("");

  const property = mockProperty;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const nextImage = () => setCurrentImageIndex((i) => (i + 1) % property.images.length);
  const prevImage = () => setCurrentImageIndex((i) => (i - 1 + property.images.length) % property.images.length);

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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart className={cn("w-5 h-5", isFavorite ? "fill-accent text-accent" : "text-muted-foreground")} />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left - Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-2xl overflow-hidden"
            >
              <img
                src={property.images[currentImageIndex]}
                alt={property.title}
                className="w-full h-[400px] md:h-[500px] object-cover"
              />
              <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card">
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {property.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={cn("w-2.5 h-2.5 rounded-full transition-all", i === currentImageIndex ? "bg-accent w-6" : "bg-card/60")}
                  />
                ))}
              </div>
              <Badge className={cn("absolute top-4 left-4", property.isAvailable ? "bg-quickrent-success text-white" : "bg-destructive text-destructive-foreground")}>
                {property.isAvailable ? "Available" : "Not Available"}
              </Badge>
            </motion.div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {property.images.map((img, i) => (
                <button key={i} onClick={() => setCurrentImageIndex(i)} className={cn("w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all", i === currentImageIndex ? "border-primary" : "border-transparent opacity-60")}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Title & Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{property.title}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{property.address}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">{formatPrice(property.price)}</p>
                  <p className="text-sm text-muted-foreground">/month</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 p-4 bg-secondary/50 rounded-xl mb-6">
                <div className="flex items-center gap-2">
                  <Bed className="w-5 h-5 text-primary" />
                  <span className="font-medium">{property.bhk} BHK</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-5 h-5 text-primary" />
                  <span className="font-medium">{property.bathrooms} Bathrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Square className="w-5 h-5 text-primary" />
                  <span className="font-medium">{property.area} sqft</span>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-primary" />
                  <span className="font-medium">{property.propertyType}</span>
                </div>
              </div>

              {/* Description */}
              <Card className="border-border mb-6">
                <CardHeader><CardTitle>Description</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                </CardContent>
              </Card>

              {/* Amenities */}
              <Card className="border-border mb-6">
                <CardHeader><CardTitle>Amenities</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.amenities.map((amenity) => {
                      const Icon = amenityIcons[amenity] || Shield;
                      return (
                        <div key={amenity} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                          <Icon className="w-5 h-5 text-primary" />
                          <span className="text-sm font-medium">{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Reviews */}
              <Card className="border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Reviews & Ratings</CardTitle>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-quickrent-gold text-quickrent-gold" />
                      <span className="text-lg font-bold">{property.rating}</span>
                      <span className="text-muted-foreground">({property.reviewCount} reviews)</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="p-4 rounded-xl bg-secondary/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                            {review.user[0]}
                          </div>
                          <span className="font-medium">{review.user}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={cn("w-4 h-4", i < review.rating ? "fill-quickrent-gold text-quickrent-gold" : "text-muted")} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">{review.date}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Sidebar - Owner & Actions */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              {/* Owner Card */}
              <Card className="border-border mb-6">
                <CardHeader><CardTitle>Property Owner</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">{property.ownerName[0]}</span>
                    </div>
                    <div>
                      <p className="font-semibold">{property.ownerName}</p>
                      <p className="text-sm text-muted-foreground">Property Owner</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4 text-primary" />
                      <span>{property.ownerPhone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="space-y-3">
                <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full h-12 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground" disabled={!property.isAvailable}>
                      <Calendar className="w-5 h-5 mr-2" />
                      Schedule Visit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Schedule a Visit</DialogTitle>
                      <DialogDescription>Pick a date and time to visit {property.title}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label>Preferred Date</Label>
                        <Input type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} className="rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label>Preferred Time</Label>
                        <Input type="time" value={visitTime} onChange={(e) => setVisitTime(e.target.value)} className="rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label>Message (optional)</Label>
                        <Textarea value={visitMessage} onChange={(e) => setVisitMessage(e.target.value)} placeholder="Any additional message for the owner..." className="rounded-xl" />
                      </div>
                      <Button className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90" onClick={() => setIsScheduleOpen(false)}>
                        Send Visit Request
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" className="w-full h-12 rounded-xl" onClick={() => setIsFavorite(!isFavorite)}>
                  <Heart className={cn("w-5 h-5 mr-2", isFavorite ? "fill-accent text-accent" : "")} />
                  {isFavorite ? "Saved to Wishlist" : "Add to Wishlist"}
                </Button>
              </div>

              {/* Price Summary */}
              <Card className="border-border mt-6">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-3">Price Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monthly Rent</span>
                      <span className="font-medium">{formatPrice(property.price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Security Deposit</span>
                      <span className="font-medium">{formatPrice(property.price * 2)}</span>
                    </div>
                    <hr className="my-2 border-border" />
                    <div className="flex justify-between font-semibold">
                      <span>Move-in Cost</span>
                      <span className="text-primary">{formatPrice(property.price * 3)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetailsPage;
