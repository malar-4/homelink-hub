import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Home, Bell, User, LogOut, Plus, Building, Calendar, 
  BarChart3, IndianRupee, Menu, X, Edit, Trash2, Eye,
  CheckCircle, XCircle, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Footer from "@/components/layout/Footer";

// Mock data for owner's properties
const mockOwnerProperties = [
  {
    id: "1",
    title: "Modern 2BHK Apartment",
    location: "Anna Nagar, Chennai",
    price: 25000,
    status: "available",
    views: 234,
    inquiries: 12,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&auto=format&fit=crop&q=60",
  },
  {
    id: "2",
    title: "Spacious 3BHK Villa",
    location: "Velachery, Chennai",
    price: 45000,
    status: "rented",
    views: 567,
    inquiries: 28,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&auto=format&fit=crop&q=60",
  },
  {
    id: "3",
    title: "Cozy 1BHK Studio",
    location: "T.Nagar, Chennai",
    price: 15000,
    status: "available",
    views: 189,
    inquiries: 8,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&auto=format&fit=crop&q=60",
  },
];

// Mock visit requests
const mockVisitRequests = [
  {
    id: "1",
    propertyTitle: "Modern 2BHK Apartment",
    tenantName: "Priya Sharma",
    tenantPhone: "+91 98765 43210",
    requestedDate: "2026-02-10",
    requestedTime: "10:00 AM",
    status: "pending",
  },
  {
    id: "2",
    propertyTitle: "Cozy 1BHK Studio",
    tenantName: "Rahul Kumar",
    tenantPhone: "+91 87654 32109",
    requestedDate: "2026-02-08",
    requestedTime: "3:00 PM",
    status: "accepted",
  },
  {
    id: "3",
    propertyTitle: "Modern 2BHK Apartment",
    tenantName: "Ananya Patel",
    tenantPhone: "+91 76543 21098",
    requestedDate: "2026-02-12",
    requestedTime: "11:30 AM",
    status: "pending",
  },
];

const OwnerDashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"properties" | "visits">("properties");

  const stats = [
    { label: "Total Properties", value: "3", icon: Building, color: "bg-blue-500" },
    { label: "Active Listings", value: "2", icon: CheckCircle, color: "bg-quickrent-success" },
    { label: "Total Views", value: "990", icon: Eye, color: "bg-purple-500" },
    { label: "Monthly Earnings", value: "₹1", icon: IndianRupee, color: "bg-quickrent-gold" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-quickrent-success text-white">Available</Badge>;
      case "rented":
        return <Badge className="bg-blue-500 text-white">Rented</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getVisitStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-quickrent-warning text-white"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "accepted":
        return <Badge className="bg-quickrent-success text-white"><CheckCircle className="w-3 h-3 mr-1" />Accepted</Badge>;
      case "rejected":
        return <Badge className="bg-destructive text-white"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
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
              <button
                onClick={() => setActiveTab("properties")}
                className={`font-medium flex items-center gap-2 ${activeTab === "properties" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Building className="w-4 h-4" />
                My Properties
              </button>
              <button
                onClick={() => setActiveTab("visits")}
                className={`font-medium flex items-center gap-2 ${activeTab === "visits" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Calendar className="w-4 h-4" />
                Visit Requests
                <Badge className="h-5 px-1.5 bg-accent text-accent-foreground text-xs">
                  {mockVisitRequests.filter(r => r.status === "pending").length}
                </Badge>
              </button>
              <Link to="/owner/analytics" className="text-muted-foreground hover:text-foreground flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <Button className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground hidden sm:flex">
                <Plus className="w-4 h-4 mr-2" />
                Add Property
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                      <Building className="w-4 h-4 text-green-500" />
                    </div>
                    <span className="hidden sm:block font-medium">Rajesh K.</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Property Owner</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IndianRupee className="w-4 h-4 mr-2" />
                    Payments
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
            Owner Dashboard 🏠
          </h1>
          <p className="text-muted-foreground">
            Manage your properties and handle visit requests
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-border">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "properties" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>My Properties</CardTitle>
                <Button className="rounded-full bg-accent hover:bg-accent/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Property
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Property</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Rent</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead>Inquiries</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockOwnerProperties.map((property) => (
                        <TableRow key={property.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={property.image}
                                alt={property.title}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <span className="font-medium">{property.title}</span>
                            </div>
                          </TableCell>
                          <TableCell>{property.location}</TableCell>
                          <TableCell className="font-semibold">
                            ₹{property.price.toLocaleString()}
                          </TableCell>
                          <TableCell>{getStatusBadge(property.status)}</TableCell>
                          <TableCell>{property.views}</TableCell>
                          <TableCell>{property.inquiries}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Visit Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Property</TableHead>
                        <TableHead>Tenant</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Requested Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockVisitRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.propertyTitle}</TableCell>
                          <TableCell>{request.tenantName}</TableCell>
                          <TableCell>{request.tenantPhone}</TableCell>
                          <TableCell>{request.requestedDate}</TableCell>
                          <TableCell>{request.requestedTime}</TableCell>
                          <TableCell>{getVisitStatusBadge(request.status)}</TableCell>
                          <TableCell>
                            {request.status === "pending" && (
                              <div className="flex items-center gap-2">
                                <Button size="sm" className="bg-quickrent-success hover:bg-quickrent-success/90">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Accept
                                </Button>
                                <Button size="sm" variant="outline" className="text-destructive border-destructive">
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default OwnerDashboard;
