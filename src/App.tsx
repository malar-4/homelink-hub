import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import TenantDashboard from "./pages/TenantDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PropertyDetailsPage from "./pages/PropertyDetailsPage";
import WishlistPage from "./pages/WishlistPage";
import AddPropertyPage from "./pages/AddPropertyPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/tenant/dashboard" element={<TenantDashboard />} />
            <Route path="/tenant/wishlist" element={<WishlistPage />} />
            <Route path="/owner/dashboard" element={<OwnerDashboard />} />
            <Route path="/owner/add-property" element={<AddPropertyPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/property/:id" element={<PropertyDetailsPage />} />
            <Route path="/properties" element={<TenantDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
