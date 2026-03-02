import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Home, ArrowLeft, Upload, Plus, X, MapPin, IndianRupee,
  Bed, Image, FileText, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const allAmenities = [
  "Car Parking", "Two Wheeler Parking", "Furnished", "Semi-Furnished",
  "WiFi", "Gym", "Swimming Pool", "24/7 Security", "Water Supply",
  "Power Backup", "Club House", "Garden", "Lift", "CCTV",
  "Children's Play Area", "Intercom", "Fire Safety", "Visitor Parking"
];

const tamilNaduCities = [
  "Chennai", "Coimbatore", "Madurai", "Trichy", "Salem", "Tirunelveli",
  "Erode", "Vellore", "Thoothukudi", "Thanjavur", "Dindigul", "Nagercoil",
  "Hosur", "Kanchipuram", "Karur", "Tirupur", "Cuddalore", "Kumbakonam",
];

const AddPropertyPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    propertyType: "",
    bhk: "",
    price: "",
    city: "",
    location: "",
    address: "",
    amenities: [] as string[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files);
    setImageFiles((prev) => [...prev, ...newFiles]);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Please login first"); navigate("/login"); return; }
    
    // Check payment status
    const { data: payment } = await supabase
      .from("owner_payments")
      .select("id")
      .eq("owner_id", user.id)
      .eq("status", "completed")
      .gte("expires_at", new Date().toISOString())
      .maybeSingle();
    
    if (!payment) {
      toast.error("Please complete ₹1 payment on your dashboard before listing properties");
      navigate("/owner/dashboard");
      return;
    }
    
    if (!formData.title || !formData.price || !formData.city || !formData.location || !formData.bhk) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      // Insert property
      const { data: property, error: propError } = await supabase
        .from("properties")
        .insert({
          title: formData.title,
          description: formData.description || null,
          property_type: formData.propertyType || "2BHK",
          bhk: parseInt(formData.bhk),
          price_per_month: parseInt(formData.price),
          city: formData.city,
          location: formData.location,
          address: formData.address || null,
          amenities: formData.amenities,
          owner_id: user.id,
        })
        .select()
        .single();

      if (propError) throw propError;

      // Upload images
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const filePath = `${user.id}/${property.id}/${Date.now()}_${file.name}`;
        
        const { error: uploadError } = await supabase.storage
          .from("property-images")
          .upload(filePath, file);

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from("property-images")
            .getPublicUrl(filePath);

          await supabase.from("property_images").insert({
            property_id: property.id,
            image_url: urlData.publicUrl,
            display_order: i,
          });
        }
      }

      toast.success("Property listed successfully!");
      navigate("/owner/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to list property");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/owner/dashboard">
                <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
              </Link>
              <Link to="/" className="flex items-center gap-2">
                <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                  <Home className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground hidden sm:block">Quick<span className="text-accent">Rent</span></span>
              </Link>
            </div>
            <span className="font-semibold text-foreground">Add New Property</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">List Your Property 🏠</h1>
          <p className="text-muted-foreground">Fill in the details to list your property on QuickRent</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Details */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-primary" /> Basic Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Property Title *</Label>
                  <Input id="title" name="title" placeholder="e.g., Modern 2BHK Apartment in Anna Nagar" value={formData.title} onChange={handleChange} className="rounded-xl" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" placeholder="Describe your property in detail..." value={formData.description} onChange={handleChange} className="rounded-xl min-h-[120px]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Property Type *</Label>
                    <Select value={formData.propertyType} onValueChange={(v) => setFormData({ ...formData, propertyType: v })}>
                      <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Apartment">Apartment</SelectItem>
                        <SelectItem value="Independent House">Independent House</SelectItem>
                        <SelectItem value="Villa">Villa</SelectItem>
                        <SelectItem value="PG/Hostel">PG/Hostel</SelectItem>
                        <SelectItem value="Studio">Studio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>BHK *</Label>
                    <Select value={formData.bhk} onValueChange={(v) => setFormData({ ...formData, bhk: v })}>
                      <SelectTrigger className="rounded-xl"><Bed className="w-4 h-4 mr-2 text-primary" /><SelectValue placeholder="BHK" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 BHK</SelectItem>
                        <SelectItem value="2">2 BHK</SelectItem>
                        <SelectItem value="3">3 BHK</SelectItem>
                        <SelectItem value="4">4 BHK</SelectItem>
                        <SelectItem value="5">5+ BHK</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Location & Price */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> Location & Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>City *</Label>
                    <Select value={formData.city} onValueChange={(v) => setFormData({ ...formData, city: v })}>
                      <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select city" /></SelectTrigger>
                      <SelectContent>
                        {tamilNaduCities.map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Area/Locality *</Label>
                    <Input id="location" name="location" placeholder="e.g., Anna Nagar" value={formData.location} onChange={handleChange} className="rounded-xl" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Full Address</Label>
                  <Input id="address" name="address" placeholder="Complete address" value={formData.address} onChange={handleChange} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Monthly Rent (₹) *</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                    <Input id="price" name="price" type="number" placeholder="e.g., 25000" value={formData.price} onChange={handleChange} className="pl-10 rounded-xl" required />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Images */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Image className="w-5 h-5 text-primary" /> Property Images</CardTitle>
                <CardDescription>Upload high-quality images of your property</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
                  {previewImages.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-border">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 w-6 h-6 bg-destructive rounded-full flex items-center justify-center">
                        <X className="w-3 h-3 text-destructive-foreground" />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center cursor-pointer transition-colors">
                    <Plus className="w-6 h-6 text-muted-foreground mb-1" />
                    <span className="text-xs text-muted-foreground">Add Photo</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Amenities */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
                <CardDescription>Select all amenities available in your property</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {allAmenities.map((amenity) => (
                    <div key={amenity}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        formData.amenities.includes(amenity) ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => handleAmenityToggle(amenity)}>
                      <Checkbox checked={formData.amenities.includes(amenity)} onCheckedChange={() => handleAmenityToggle(amenity)} />
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Submit */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <div className="flex gap-4">
              <Button type="button" variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => navigate("/owner/dashboard")}>Cancel</Button>
              <Button type="submit" className="flex-1 h-12 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>
                {isSubmitting ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full" />
                ) : (
                  <><Upload className="w-5 h-5 mr-2" /> List Property</>
                )}
              </Button>
            </div>
          </motion.div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default AddPropertyPage;
