import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
  Home, Bell, User, LogOut, Plus, Building, Calendar, 
  BarChart3, IndianRupee, Menu, X, Edit, Trash2, Eye,
  CheckCircle, XCircle, Clock, MessageSquare, Send, CreditCard, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"properties" | "visits">("properties");
  const [properties, setProperties] = useState<any[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [hasPaid, setHasPaid] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProperties();
      fetchVisits();
      checkPaymentStatus();
    }
  }, [user]);

  const checkPaymentStatus = async () => {
    if (!user) return;
    setPaymentLoading(true);
    const { data } = await supabase
      .from("owner_payments")
      .select("id, expires_at")
      .eq("owner_id", user.id)
      .eq("status", "completed")
      .gte("expires_at", new Date().toISOString())
      .maybeSingle();
    setHasPaid(!!data);
    setPaymentLoading(false);
  };

  const handleMockPayment = async () => {
    if (!user) return;
    setIsProcessingPayment(true);
    try {
      const { error } = await supabase.from("owner_payments").insert({
        owner_id: user.id,
        amount: 1,
        status: "completed",
      });
      if (error) throw error;
      setHasPaid(true);
      toast.success("Payment of ₹1 successful! You can now list properties and contact tenants.");
    } catch (err: any) {
      toast.error(err.message || "Payment failed");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const fetchProperties = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("properties")
      .select("*, property_images(image_url, display_order)")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });
    setProperties(data || []);
    setLoading(false);
  };

  const fetchVisits = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("visits")
      .select("*, properties(title)")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });
    
    // Fetch tenant profiles for each visit
    if (data) {
      const enrichedVisits = await Promise.all(
        data.map(async (visit) => {
          const { data: tenantProfile } = await supabase
            .from("profiles")
            .select("full_name, phone")
            .eq("user_id", visit.tenant_id)
            .maybeSingle();
          return { ...visit, tenantProfile };
        })
      );
      setVisits(enrichedVisits);
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    const { error } = await supabase.from("properties").delete().eq("id", propertyId);
    if (error) {
      toast.error("Failed to delete property");
    } else {
      toast.success("Property deleted");
      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
    }
  };

  const handleVisitAction = async (visitId: string, action: "accepted" | "rejected") => {
    const { error } = await supabase.from("visits").update({ status: action }).eq("id", visitId);
    if (error) {
      toast.error("Failed to update visit");
    } else {
      toast.success(`Visit ${action}`);
      fetchVisits();
    }
  };

  const handleReschedule = async () => {
    if (!selectedVisit || !rescheduleDate || !rescheduleTime) {
      toast.error("Please select date and time");
      return;
    }
    const { error } = await supabase.from("visits").update({
      status: "rescheduled",
      owner_proposed_date: rescheduleDate,
      owner_proposed_time: rescheduleTime,
    }).eq("id", selectedVisit.id);

    // Send message
    if (replyMessage && user) {
      await supabase.from("messages").insert({
        sender_id: user.id,
        receiver_id: selectedVisit.tenant_id,
        property_id: selectedVisit.property_id,
        visit_id: selectedVisit.id,
        content: replyMessage,
      });
    }

    if (!error) {
      toast.success("Visit rescheduled and message sent");
      setMessageDialogOpen(false);
      setReplyMessage("");
      setRescheduleDate("");
      setRescheduleTime("");
      fetchVisits();
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Owner";

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available": return <Badge className="bg-quickrent-success text-white">Available</Badge>;
      case "rented": return <Badge className="bg-blue-500 text-white">Rented</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getVisitStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return <Badge className="bg-quickrent-warning text-white"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "accepted": return <Badge className="bg-quickrent-success text-white"><CheckCircle className="w-3 h-3 mr-1" />Accepted</Badge>;
      case "rejected": return <Badge className="bg-destructive text-white"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      case "rescheduled": return <Badge className="bg-blue-500 text-white"><Calendar className="w-3 h-3 mr-1" />Rescheduled</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const stats = [
    { label: "Total Properties", value: properties.length.toString(), icon: Building, color: "bg-blue-500" },
    { label: "Active Listings", value: properties.filter(p => p.is_available).length.toString(), icon: CheckCircle, color: "bg-quickrent-success" },
    { label: "Pending Visits", value: visits.filter(v => v.status === "pending").length.toString(), icon: Clock, color: "bg-purple-500" },
    { label: "Monthly Earnings", value: `₹${properties.reduce((sum, p) => sum + (p.is_available ? 0 : p.price_per_month), 0).toLocaleString()}`, icon: IndianRupee, color: "bg-quickrent-gold" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground hidden sm:block">
                Quick<span className="text-accent">Rent</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <button onClick={() => setActiveTab("properties")}
                className={`font-medium flex items-center gap-2 ${activeTab === "properties" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                <Building className="w-4 h-4" /> My Properties
              </button>
              <button onClick={() => setActiveTab("visits")}
                className={`font-medium flex items-center gap-2 ${activeTab === "visits" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                <Calendar className="w-4 h-4" /> Visit Requests
                {visits.filter(r => r.status === "pending").length > 0 && (
                  <Badge className="h-5 px-1.5 bg-accent text-accent-foreground text-xs">
                    {visits.filter(r => r.status === "pending").length}
                  </Badge>
                )}
              </button>
            </nav>

            <div className="flex items-center gap-3">
              {hasPaid ? (
                <Link to="/owner/add-property">
                  <Button className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground hidden sm:flex">
                    <Plus className="w-4 h-4 mr-2" /> Add Property
                  </Button>
                </Link>
              ) : (
                <Button className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground hidden sm:flex" onClick={() => toast.error("Please complete ₹1 payment first to list properties")}>
                  <Plus className="w-4 h-4 mr-2" /> Add Property
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-quickrent-success/10 rounded-full flex items-center justify-center">
                      <Building className="w-4 h-4 text-quickrent-success" />
                    </div>
                    <span className="hidden sm:block font-medium">{displayName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Property Owner</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <Edit className="w-4 h-4 mr-2" /> Edit Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Owner Dashboard 🏠</h1>
          <p className="text-muted-foreground">Manage your properties and handle visit requests</p>
        </motion.div>

        {/* Payment Gate Banner */}
        {!paymentLoading && !hasPaid && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
            <Card className="border-accent bg-accent/5">
              <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center">
                    <CreditCard className="w-7 h-7 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Activate Your Owner Account</h3>
                    <p className="text-muted-foreground text-sm">Pay a nominal fee of <span className="font-bold text-accent">₹1/month</span> to list properties and contact tenants</p>
                  </div>
                </div>
                <Button
                  className="rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground h-12 px-8 font-semibold"
                  onClick={handleMockPayment}
                  disabled={isProcessingPayment}
                >
                  {isProcessingPayment ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full" />
                  ) : (
                    <><IndianRupee className="w-4 h-4 mr-2" /> Pay ₹1 Now</>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {hasPaid && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
            <div className="flex items-center gap-2 text-sm text-quickrent-success">
              <Shield className="w-4 h-4" /> Subscription active — you can list properties and contact tenants
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
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

        {activeTab === "properties" ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>My Properties</CardTitle>
                {hasPaid ? (
                  <Link to="/owner/add-property">
                    <Button className="rounded-full bg-accent hover:bg-accent/90">
                      <Plus className="w-4 h-4 mr-2" /> Add Property
                    </Button>
                  </Link>
                ) : (
                  <Button className="rounded-full bg-accent hover:bg-accent/90" onClick={() => toast.error("Please complete ₹1 payment first")}>
                    <Plus className="w-4 h-4 mr-2" /> Add Property
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full mx-auto" />
                  </div>
                ) : properties.length === 0 ? (
                  <div className="text-center py-12">
                    <Building className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">No properties listed yet. Add your first property!</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Property</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Rent</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {properties.map((property) => (
                          <TableRow key={property.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <img
                                  src={property.property_images?.[0]?.image_url || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400"}
                                  alt={property.title}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                                <span className="font-medium">{property.title}</span>
                              </div>
                            </TableCell>
                            <TableCell>{property.location}, {property.city}</TableCell>
                            <TableCell className="font-semibold">₹{property.price_per_month.toLocaleString()}</TableCell>
                            <TableCell>{getStatusBadge(property.is_available ? "available" : "rented")}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => navigate(`/property/${property.id}`)}>
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-destructive">
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Property</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "{property.title}"? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteProperty(property.id)} className="bg-destructive hover:bg-destructive/90">
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="border-border">
              <CardHeader><CardTitle>Visit Requests</CardTitle></CardHeader>
              <CardContent>
                {visits.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">No visit requests yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Property</TableHead>
                          <TableHead>Tenant</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {visits.map((visit) => (
                          <TableRow key={visit.id}>
                            <TableCell className="font-medium">{visit.properties?.title || "Property"}</TableCell>
                            <TableCell>{visit.tenantProfile?.full_name || "Tenant"}</TableCell>
                            <TableCell>{visit.proposed_date}</TableCell>
                            <TableCell>{visit.proposed_time}</TableCell>
                            <TableCell>{getVisitStatusBadge(visit.status)}</TableCell>
                            <TableCell>
                              {visit.status === "pending" && hasPaid && (
                                <div className="flex items-center gap-2">
                                  <Button size="sm" className="bg-quickrent-success hover:bg-quickrent-success/90" onClick={() => handleVisitAction(visit.id, "accepted")}>
                                    <CheckCircle className="w-3 h-3 mr-1" /> Accept
                                  </Button>
                                  <Button size="sm" variant="outline" className="text-destructive border-destructive" onClick={() => handleVisitAction(visit.id, "rejected")}>
                                    <XCircle className="w-3 h-3 mr-1" /> Reject
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => { setSelectedVisit(visit); setMessageDialogOpen(true); }}>
                                    <MessageSquare className="w-3 h-3 mr-1" /> Reschedule
                                  </Button>
                                </div>
                              )}
                              {visit.status === "pending" && !hasPaid && (
                                <span className="text-xs text-muted-foreground">Pay ₹1 to respond</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>

      {/* Reschedule Dialog */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule & Message Tenant</DialogTitle>
            <DialogDescription>Propose a new time and send a message to the tenant</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>New Date</Label>
              <Input type="date" value={rescheduleDate} onChange={(e) => setRescheduleDate(e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>New Time</Label>
              <Input type="time" value={rescheduleTime} onChange={(e) => setRescheduleTime(e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Message to Tenant</Label>
              <Textarea value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} placeholder="Explain why you'd like to reschedule..." className="rounded-xl" />
            </div>
            <Button className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90" onClick={handleReschedule}>
              <Send className="w-4 h-4 mr-2" /> Send Reschedule Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default OwnerDashboard;
