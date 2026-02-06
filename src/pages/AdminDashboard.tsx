import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Home, Bell, User, LogOut, Shield, Users, Building, 
  BarChart3, Star, AlertTriangle, Menu, X, Ban, Check,
  TrendingUp, IndianRupee, Eye, MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Footer from "@/components/layout/Footer";

// Mock data for admin
const mockUsers = [
  { id: "1", name: "Priya Sharma", email: "priya@email.com", role: "tenant", status: "active", joinDate: "2026-01-15" },
  { id: "2", name: "Rajesh Kumar", email: "rajesh@email.com", role: "owner", status: "active", joinDate: "2026-01-10" },
  { id: "3", name: "Ananya Patel", email: "ananya@email.com", role: "tenant", status: "active", joinDate: "2026-01-20" },
  { id: "4", name: "Vikram Singh", email: "vikram@email.com", role: "owner", status: "suspended", joinDate: "2026-01-05" },
  { id: "5", name: "Meera Reddy", email: "meera@email.com", role: "tenant", status: "active", joinDate: "2026-01-25" },
];

const mockReviews = [
  { id: "1", property: "Modern 2BHK Apartment", user: "Priya Sharma", rating: 4, content: "Great property, nice location.", status: "approved" },
  { id: "2", property: "Spacious 3BHK Villa", user: "Anonymous", rating: 1, content: "This is a fake listing!", status: "flagged" },
  { id: "3", property: "Cozy 1BHK Studio", user: "Rahul Kumar", rating: 5, content: "Perfect for my needs!", status: "approved" },
];

const AdminDashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const stats = [
    { label: "Total Users", value: "1,234", change: "+12%", icon: Users, color: "bg-blue-500" },
    { label: "Active Properties", value: "456", change: "+8%", icon: Building, color: "bg-green-500" },
    { label: "Total Revenue", value: "₹456", change: "+23%", icon: IndianRupee, color: "bg-quickrent-gold" },
    { label: "Pending Reviews", value: "12", change: "-5%", icon: MessageSquare, color: "bg-purple-500" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-quickrent-success text-white">Active</Badge>;
      case "suspended":
        return <Badge className="bg-destructive text-white">Suspended</Badge>;
      case "approved":
        return <Badge className="bg-quickrent-success text-white">Approved</Badge>;
      case "flagged":
        return <Badge className="bg-quickrent-warning text-foreground"><AlertTriangle className="w-3 h-3 mr-1" />Flagged</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "tenant":
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Tenant</Badge>;
      case "owner":
        return <Badge variant="outline" className="border-green-500 text-green-500">Owner</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="text-xl font-bold hidden sm:block">
                Quick<span className="text-accent">Rent</span>
                <span className="text-xs ml-2 px-2 py-0.5 bg-accent/20 rounded text-accent">Admin</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/admin/dashboard" className="text-background font-medium flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </Link>
              <Link to="/admin/users" className="text-background/70 hover:text-background flex items-center gap-2">
                <Users className="w-4 h-4" />
                Users
              </Link>
              <Link to="/admin/properties" className="text-background/70 hover:text-background flex items-center gap-2">
                <Building className="w-4 h-4" />
                Properties
              </Link>
              <Link to="/admin/reviews" className="text-background/70 hover:text-background flex items-center gap-2">
                <Star className="w-4 h-4" />
                Reviews
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="text-background hover:bg-background/10 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 text-background hover:bg-background/10">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-accent-foreground" />
                    </div>
                    <span className="hidden sm:block font-medium">Admin</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Administrator</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Shield className="w-4 h-4 mr-2" />
                    Settings
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
                className="md:hidden text-background hover:bg-background/10"
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
            Admin Dashboard 🛡️
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage the QuickRent platform
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
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className={`text-sm font-medium flex items-center gap-1 ${stat.change.startsWith('+') ? 'text-quickrent-success' : 'text-destructive'}`}>
                      <TrendingUp className="w-3 h-3" />
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Reviews & Ratings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Approve, block, or manage tenants and property owners
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell>{user.joinDate}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {user.status === "active" ? (
                                <Button size="sm" variant="outline" className="text-destructive border-destructive">
                                  <Ban className="w-3 h-3 mr-1" />
                                  Block
                                </Button>
                              ) : (
                                <Button size="sm" className="bg-quickrent-success hover:bg-quickrent-success/90">
                                  <Check className="w-3 h-3 mr-1" />
                                  Unblock
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Review Management</CardTitle>
                <CardDescription>
                  Monitor and remove inappropriate or fake reviews
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Property</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Review</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockReviews.map((review) => (
                        <TableRow key={review.id}>
                          <TableCell className="font-medium">{review.property}</TableCell>
                          <TableCell>{review.user}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < review.rating ? 'fill-quickrent-gold text-quickrent-gold' : 'text-muted'}`}
                                />
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{review.content}</TableCell>
                          <TableCell>{getStatusBadge(review.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {review.status === "flagged" && (
                                <>
                                  <Button size="sm" className="bg-quickrent-success hover:bg-quickrent-success/90">
                                    <Check className="w-3 h-3 mr-1" />
                                    Approve
                                  </Button>
                                  <Button size="sm" variant="outline" className="text-destructive border-destructive">
                                    <Ban className="w-3 h-3 mr-1" />
                                    Remove
                                  </Button>
                                </>
                              )}
                              {review.status === "approved" && (
                                <Button size="sm" variant="outline" className="text-destructive border-destructive">
                                  <Ban className="w-3 h-3 mr-1" />
                                  Remove
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
