import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
  Home, Bell, User, LogOut, Shield, Users, Building, 
  BarChart3, Star, AlertTriangle, Menu, X, Ban, Check,
  TrendingUp, IndianRupee, Eye, MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface UserWithRole {
  user_id: string;
  role: string;
  created_at: string;
  full_name: string;
  phone: string | null;
  email?: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [propertyCount, setPropertyCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch user roles with profiles
    const { data: rolesData } = await supabase
      .from("user_roles")
      .select("user_id, role, created_at");

    const { data: profilesData } = await supabase
      .from("profiles")
      .select("user_id, full_name, phone");

    // Merge roles with profiles
    const merged: UserWithRole[] = (rolesData || [])
      .filter((r) => r.role === "tenant" || r.role === "owner")
      .map((role) => {
        const profile = profilesData?.find((p) => p.user_id === role.user_id);
        return {
          user_id: role.user_id,
          role: role.role,
          created_at: role.created_at,
          full_name: profile?.full_name || "Unknown",
          phone: profile?.phone || null,
        };
      });
    setUsers(merged);

    // Fetch reviews
    const { data: reviewsData } = await supabase
      .from("reviews")
      .select("*, properties(title)")
      .order("created_at", { ascending: false });
    setReviews(reviewsData || []);

    // Fetch property count
    const { count } = await supabase
      .from("properties")
      .select("id", { count: "exact", head: true });
    setPropertyCount(count || 0);

    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const tenantCount = users.filter((u) => u.role === "tenant").length;
  const ownerCount = users.filter((u) => u.role === "owner").length;

  const stats = [
    { label: "Tenants", value: tenantCount.toString(), icon: Users, color: "bg-blue-500" },
    { label: "Owners", value: ownerCount.toString(), icon: Building, color: "bg-green-500" },
    { label: "Properties", value: propertyCount.toString(), icon: Home, color: "bg-quickrent-gold" },
    { label: "Reviews", value: reviews.length.toString(), icon: MessageSquare, color: "bg-purple-500" },
  ];

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-quickrent-success text-white">Approved</Badge>;
      case "flagged":
        return <Badge className="bg-quickrent-warning text-foreground"><AlertTriangle className="w-3 h-3 mr-1" />Flagged</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="text-xl font-bold hidden sm:block">
                Quick<span className="text-accent">Rent</span>
                <span className="text-xs ml-2 px-2 py-0.5 bg-accent/20 rounded text-accent">Admin</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link to="/admin/dashboard" className="text-background font-medium flex items-center gap-2">
                <BarChart3 className="w-4 h-4" /> Dashboard
              </Link>
            </nav>

            <div className="flex items-center gap-3">
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
                  <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="icon" className="md:hidden text-background hover:bg-background/10"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Admin Dashboard 🛡️</h1>
          <p className="text-muted-foreground">Monitor and manage the QuickRent platform</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-2`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" /> Registered Users
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <Star className="w-4 h-4" /> Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Registered Users & Owners</CardTitle>
                <CardDescription>All registered tenants and property owners on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-muted-foreground text-center py-8">Loading users...</p>
                ) : users.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No registered users found</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Joined</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((u) => (
                          <TableRow key={u.user_id}>
                            <TableCell className="font-medium">{u.full_name}</TableCell>
                            <TableCell>{u.phone || "—"}</TableCell>
                            <TableCell>{getRoleBadge(u.role)}</TableCell>
                            <TableCell>{new Date(u.created_at).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Review Management</CardTitle>
                <CardDescription>Monitor reviews on properties</CardDescription>
              </CardHeader>
              <CardContent>
                {reviews.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No reviews yet</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Property</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Review</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reviews.map((review) => (
                          <TableRow key={review.id}>
                            <TableCell className="font-medium">{review.properties?.title || "Unknown"}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-quickrent-gold text-quickrent-gold' : 'text-muted'}`} />
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">{review.content || "—"}</TableCell>
                            <TableCell>{getStatusBadge(review.status)}</TableCell>
                            <TableCell>{new Date(review.created_at).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
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
