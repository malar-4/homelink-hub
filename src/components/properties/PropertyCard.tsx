import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MapPin, Bed, Bath, Square, Star, Calendar, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  bhk: number;
  bathrooms: number;
  area: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  amenities: string[];
  isFavorite?: boolean;
  onFavoriteToggle?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  onScheduleVisit?: (id: string) => void;
}

const PropertyCard = ({
  id,
  title,
  location,
  price,
  bhk,
  bathrooms,
  area,
  imageUrl,
  rating,
  reviewCount,
  isAvailable,
  amenities,
  isFavorite = false,
  onFavoriteToggle,
  onViewDetails,
  onScheduleVisit,
}: PropertyCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [favorite, setFavorite] = useState(isFavorite);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorite(!favorite);
    onFavoriteToggle?.(id);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="property-card bg-card rounded-2xl overflow-hidden shadow-md border border-border"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className={cn(
            "w-full h-full object-cover transition-transform duration-500",
            isHovered && "scale-110"
          )}
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
        
        {/* Availability Badge */}
        <Badge
          className={cn(
            "absolute top-3 left-3 font-medium",
            isAvailable
              ? "bg-quickrent-success text-white"
              : "bg-destructive text-destructive-foreground"
          )}
        >
          {isAvailable ? "Available" : "Not Available"}
        </Badge>

        {/* Favorite Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-card transition-colors"
        >
          <Heart
            className={cn(
              "w-5 h-5 transition-colors",
              favorite ? "fill-accent text-accent" : "text-muted-foreground"
            )}
          />
        </motion.button>

        {/* Price */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <p className="text-white/80 text-xs mb-0.5">Monthly Rent</p>
            <p className="text-white text-xl font-bold">{formatPrice(price)}</p>
          </div>
          <div className="flex items-center gap-1 bg-card/90 backdrop-blur-sm rounded-full px-2.5 py-1">
            <Star className="w-4 h-4 fill-quickrent-gold text-quickrent-gold" />
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-foreground mb-1 line-clamp-1">
          {title}
        </h3>
        <div className="flex items-center gap-1 text-muted-foreground mb-3">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm line-clamp-1">{location}</span>
        </div>

        {/* Property Details */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5">
            <Bed className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{bhk} BHK</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{bathrooms} Bath</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Square className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{area} sqft</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {amenities.slice(0, 3).map((amenity) => (
            <Badge
              key={amenity}
              variant="secondary"
              className="text-xs font-normal"
            >
              {amenity}
            </Badge>
          ))}
          {amenities.length > 3 && (
            <Badge variant="secondary" className="text-xs font-normal">
              +{amenities.length - 3} more
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 rounded-full"
            onClick={() => onViewDetails?.(id)}
          >
            <Eye className="w-4 h-4 mr-1.5" />
            View
          </Button>
          <Button
            className="flex-1 rounded-full bg-primary hover:bg-primary/90"
            onClick={() => onScheduleVisit?.(id)}
            disabled={!isAvailable}
          >
            <Calendar className="w-4 h-4 mr-1.5" />
            Schedule
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
