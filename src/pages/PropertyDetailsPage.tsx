import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home, MapPin, Bed, Bath, Square, Star, Calendar, Heart,
  ArrowLeft, Car, Sofa, Wifi, Dumbbell, Shield, Droplets,
  Phone, Mail, ChevronLeft, ChevronRight, Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const amenityIcons: Record<string, any> = {
  "Car Parking": Car, "Furnished": Sofa, "WiFi": Wifi, "Gym": Dumbbell,
  "24/7 Security": Shield, "Water Supply": Droplets, "Power Backup": Shield,
};

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [property, setProperty] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [ownerProfile, setOwnerProfile] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("");
  const [visitMessage, setVisitMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) fetchProperty();
  }, [id]);

  // Auto-open schedule dialog when coming from Schedule button
  useEffect(() => {
    if (searchParams.get("schedule") === "true" && property && !loading) {
      setIsScheduleOpen(true);
    }
  }, [searchParams, property, loading]);

  useEffect(() => {
    if (user && id) checkWishlist();
  }, [user, id]);

  const fetchProperty = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("properties")
      .select("*, property_images(image_url, display_order)")
      .eq("id", id)
      .maybeSingle();

    if (data) {
      setProperty(data);
      // Fetch owner profile
      const { data: ownerData } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("user_id", data.owner_id)
        .maybeSingle();
      setOwnerProfile(ownerData);

      // Fetch reviews
      const { data: reviewsData } = await supabase
        .from("reviews")
        .select("*")
        .eq("property_id", id)
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      setReviews(reviewsData || []);
    }
    setLoading(false);
  };

  const checkWishlist = async () => {
    if (!user || !id) return;
    const { data } = await supabase
      .from("wishlists")
      .select("id")
      .eq("user_id", user.id)
      .eq("property_id", id)
      .maybeSingle();
    setIsFavorite(!!data);
  };

  const toggleFavorite = async () => {
    if (!user) { toast.error("Please login first"); navigate("/login"); return; }
    if (isFavorite) {
      await supabase.from("wishlists").delete().eq("user_id", user.id).eq("property_id", id);
      setIsFavorite(false);
      toast.success("Removed from wishlist");
    } else {
      await supabase.from("wishlists").insert({ user_id: user.id, property_id: id! });
      setIsFavorite(true);
      toast.success("Added to wishlist");
    }
  };

  const handleScheduleVisit = async () => {
    if (!user) { toast.error("Please login first"); navigate("/login"); return; }
    if (!visitDate || !visitTime) { toast.error("Please select date and time"); return; }
    setSubmitting(true);
    const { error } = await supabase.from("visits").insert({
      tenant_id: user.id,
      owner_id: property.owner_id,
      property_id: id!,
      proposed_date: visitDate,
      proposed_time: visitTime,
      message: visitMessage || null,
    });
    if (error) {
      toast.error("Failed to schedule visit");
    } else {
      // Send notification message to owner
      await supabase.from("messages").insert({
        sender_id: user.id,
        receiver_id: property.owner_id,
        property_id: id!,
        content: `🏠 New visit request for "${property.title}" on ${visitDate} at ${visitTime}.${visitMessage ? ` Message: ${visitMessage}` : ""}`,
      });
      toast.success("Visit request sent to the owner!");
      setIsScheduleOpen(false);
      setVisitDate("");
      setVisitTime("");
      setVisitMessage("");
    }
    setSubmitting(false);
  };

  const formatPrice = (price: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Property not found</h2>
          <Link to="/tenant/dashboard"><Button>Browse Properties</Button></Link>
        </div>
      </div>
    );
  }

  const images = property.property_images?.sort((a: any, b: any) => a.display_order - b.display_order).map((img: any) => img.image_url) || 
    ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop&q=80"];

  const nextImage = () => setCurrentImageIndex((i) => (i + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((i) => (i - 1 + images.length) % images.length);

  const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : "N/A";

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
                <span className="text-xl font-bold text-foreground hidden sm:block">Quick<span className="text-accent">Rent</span></span>
              </Link>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleFavorite}>
              <Heart className={cn("w-5 h-5", isFavorite ? "fill-accent text-accent" : "text-muted-foreground")} />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-2xl overflow-hidden">
              <img src={images[currentImageIndex]} alt={property.title} className="w-full h-[400px] md:h-[500px] object-cover" />
              {images.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_: string, i: number) => (
                  <button key={i} onClick={() => setCurrentImageIndex(i)}
                    className={cn("w-2.5 h-2.5 rounded-full transition-all", i === currentImageIndex ? "bg-accent w-6" : "bg-card/60")} />
                ))}
              </div>
              <Badge className={cn("absolute top-4 left-4", property.is_available ? "bg-quickrent-success text-white" : "bg-destructive text-destructive-foreground")}>
                {property.is_available ? "Available" : "Not Available"}
              </Badge>
            </motion.div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img: string, i: number) => (
                  <button key={i} onClick={() => setCurrentImageIndex(i)} className={cn("w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all", i === currentImageIndex ? "border-primary" : "border-transparent opacity-60")}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{property.title}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{property.address || `${property.location}, ${property.city}`}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">{formatPrice(property.price_per_month)}</p>
                  <p className="text-sm text-muted-foreground">/month</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 p-4 bg-secondary/50 rounded-xl mb-6">
                <div className="flex items-center gap-2"><Bed className="w-5 h-5 text-primary" /><span className="font-medium">{property.bhk} BHK</span></div>
                <div className="flex items-center gap-2"><Home className="w-5 h-5 text-primary" /><span className="font-medium">{property.property_type}</span></div>
              </div>

              {property.description && (
                <Card className="border-border mb-6">
                  <CardHeader><CardTitle>Description</CardTitle></CardHeader>
                  <CardContent><p className="text-muted-foreground leading-relaxed">{property.description}</p></CardContent>
                </Card>
              )}

              {property.amenities?.length > 0 && (
                <Card className="border-border mb-6">
                  <CardHeader><CardTitle>Amenities</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {property.amenities.map((amenity: string) => {
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
              )}

              {/* Reviews */}
              <Card className="border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Reviews & Ratings</CardTitle>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-quickrent-gold text-quickrent-gold" />
                      <span className="text-lg font-bold">{avgRating}</span>
                      <span className="text-muted-foreground">({reviews.length} reviews)</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {reviews.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No reviews yet</p>
                  ) : reviews.map((review) => (
                    <div key={review.id} className="p-4 rounded-xl bg-secondary/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={cn("w-4 h-4", i < review.rating ? "fill-quickrent-gold text-quickrent-gold" : "text-muted")} />
                          ))}
                        </div>
                      </div>
                      {review.content && <p className="text-sm text-muted-foreground">{review.content}</p>}
                      <p className="text-xs text-muted-foreground mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              {ownerProfile && (
                <Card className="border-border mb-6">
                  <CardHeader><CardTitle>Property Owner</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-bold text-primary">{ownerProfile.full_name?.[0] || "O"}</span>
                      </div>
                      <div>
                        <p className="font-semibold">{ownerProfile.full_name || "Property Owner"}</p>
                        <p className="text-sm text-muted-foreground">Property Owner</p>
                      </div>
                    </div>
                    {ownerProfile.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4 text-primary" />
                        <span>{ownerProfile.phone}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <div className="space-y-3">
                <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full h-12 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground" disabled={!property.is_available}>
                      <Calendar className="w-5 h-5 mr-2" /> Schedule Visit
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
                      <Button className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90" onClick={handleScheduleVisit} disabled={submitting}>
                        {submitting ? "Sending..." : "Send Visit Request"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" className="w-full h-12 rounded-xl" onClick={toggleFavorite}>
                  <Heart className={cn("w-5 h-5 mr-2", isFavorite ? "fill-accent text-accent" : "")} />
                  {isFavorite ? "Saved to Wishlist" : "Add to Wishlist"}
                </Button>
              </div>

              <Card className="border-border mt-6">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-3">Price Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monthly Rent</span>
                      <span className="font-medium">{formatPrice(property.price_per_month)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Security Deposit</span>
                      <span className="font-medium">{formatPrice(property.price_per_month * 2)}</span>
                    </div>
                    <hr className="my-2 border-border" />
                    <div className="flex justify-between font-semibold">
                      <span>Move-in Cost</span>
                      <span className="text-primary">{formatPrice(property.price_per_month * 3)}</span>
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
