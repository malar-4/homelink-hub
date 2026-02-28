import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Home, IndianRupee, SlidersHorizontal, X, Car, Sofa, Wifi, Dumbbell, Shield, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import LocationAutocomplete from "./LocationAutocomplete";

interface FilterBarProps {
  onFilterChange?: (filters: FilterState) => void;
}

interface FilterState {
  location: string;
  bhk: string;
  priceMin: number;
  priceMax: number;
  amenities: string[];
  propertyType: string;
  furnishing: string;
}

const amenitiesList = [
  { id: "car-parking", label: "Car Parking", icon: Car },
  { id: "two-wheeler", label: "Two Wheeler Parking", icon: Car },
  { id: "furnished", label: "Furnished", icon: Sofa },
  { id: "wifi", label: "WiFi", icon: Wifi },
  { id: "gym", label: "Gym", icon: Dumbbell },
  { id: "security", label: "24/7 Security", icon: Shield },
  { id: "water-supply", label: "Water Supply", icon: Droplets },
];


const FilterBar = ({ onFilterChange }: FilterBarProps) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    location: "", bhk: "", priceMin: 5000, priceMax: 100000,
    amenities: [], propertyType: "", furnishing: "",
  });
  const [priceRange, setPriceRange] = useState([5000, 50000]);

  const handleAmenityToggle = (amenityId: string) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((a) => a !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const clearFilters = () => {
    setFilters({ location: "", bhk: "", priceMin: 5000, priceMax: 100000, amenities: [], propertyType: "", furnishing: "" });
    setPriceRange([5000, 50000]);
  };

  const activeFiltersCount = (filters.location ? 1 : 0) + (filters.bhk ? 1 : 0) + (filters.propertyType ? 1 : 0) + (filters.furnishing ? 1 : 0) + filters.amenities.length;

  const formatPrice = (value: number) => value >= 100000 ? `₹${(value / 100000).toFixed(1)}L` : `₹${(value / 1000).toFixed(0)}K`;

  return (
    <div className="bg-card rounded-2xl shadow-lg border border-border p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <LocationAutocomplete
            value={filters.location}
            onChange={(value) => setFilters({ ...filters, location: value })}
            placeholder="Search any location in India..."
          />
        </div>

        <div className="w-full lg:w-40">
          <Select value={filters.bhk} onValueChange={(value) => setFilters({ ...filters, bhk: value })}>
            <SelectTrigger className="h-12 rounded-xl border-border"><Home className="w-5 h-5 text-primary mr-2" /><SelectValue placeholder="BHK" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 BHK</SelectItem>
              <SelectItem value="2">2 BHK</SelectItem>
              <SelectItem value="3">3 BHK</SelectItem>
              <SelectItem value="4">4 BHK</SelectItem>
              <SelectItem value="5+">5+ BHK</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full lg:w-72">
          <div className="flex flex-col gap-1 h-12 px-4 rounded-xl border border-border bg-background justify-center">
            <div className="flex items-center justify-between">
              <IndianRupee className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">
                {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
              </span>
            </div>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              min={1000}
              max={200000}
              step={1000}
              className="w-full"
            />
          </div>
        </div>

        <Sheet open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="h-12 rounded-xl border-border relative">
              <SlidersHorizontal className="w-5 h-5 mr-2" /> Filters
              {activeFiltersCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-accent text-accent-foreground text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center justify-between">
                Advanced Filters
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">Clear All</Button>
              </SheetTitle>
              <SheetDescription>Refine your property search with additional filters</SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <div className="space-y-4">
                <Label className="text-base font-semibold">Price Range (Monthly)</Label>
                <Slider value={priceRange} onValueChange={setPriceRange} min={1000} max={200000} step={1000} className="mt-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Property Type</Label>
                <Select value={filters.propertyType} onValueChange={(value) => setFilters({ ...filters, propertyType: value })}>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="independent-house">Independent House</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="pg">PG/Hostel</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Furnishing</Label>
                <Select value={filters.furnishing} onValueChange={(value) => setFilters({ ...filters, furnishing: value })}>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select furnishing" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="furnished">Fully Furnished</SelectItem>
                    <SelectItem value="semi-furnished">Semi Furnished</SelectItem>
                    <SelectItem value="unfurnished">Unfurnished</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Amenities</Label>
                <div className="grid grid-cols-1 gap-3">
                  {amenitiesList.map((amenity) => (
                    <div key={amenity.id}
                      className="flex items-center space-x-3 p-3 rounded-xl border border-border hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => handleAmenityToggle(amenity.id)}>
                      <Checkbox id={amenity.id} checked={filters.amenities.includes(amenity.id)} onCheckedChange={() => handleAmenityToggle(amenity.id)} />
                      <amenity.icon className="w-5 h-5 text-primary" />
                      <label htmlFor={amenity.id} className="text-sm font-medium cursor-pointer flex-1">{amenity.label}</label>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => { onFilterChange?.({ ...filters, priceMin: priceRange[0], priceMax: priceRange[1] }); setIsAdvancedOpen(false); }}>
                Apply Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <Button className="h-12 px-8 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground">
          <Search className="w-5 h-5 mr-2" /> Search
        </Button>
      </div>

      <AnimatePresence>
        {activeFiltersCount > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4 pt-4 border-t border-border">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {filters.location && (
                <Badge variant="secondary" className="gap-1.5">
                  {filters.location}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters({ ...filters, location: "" })} />
                </Badge>
              )}
              {filters.bhk && (
                <Badge variant="secondary" className="gap-1.5">
                  {filters.bhk} BHK
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters({ ...filters, bhk: "" })} />
                </Badge>
              )}
              {filters.amenities.map((amenity) => (
                <Badge key={amenity} variant="secondary" className="gap-1.5">
                  {amenitiesList.find((a) => a.id === amenity)?.label}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => handleAmenityToggle(amenity)} />
                </Badge>
              ))}
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={clearFilters}>Clear all</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterBar;
