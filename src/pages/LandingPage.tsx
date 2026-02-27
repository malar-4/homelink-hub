import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, Home, Shield, Users, Star, ArrowRight, Key, MapPin, Sparkles, TrendingUp, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import heroImage from "@/assets/hero-apartment.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }),
};

const LandingPage = () => {
  const features = [
    { icon: Search, title: "Smart Search", description: "Advanced filters for BHK, location, price & amenities across 100+ cities.", gradient: "from-primary/20 to-primary/5" },
    { icon: Shield, title: "Verified Listings", description: "Every property is vetted to ensure authenticity and quality standards.", gradient: "from-accent/20 to-accent/5" },
    { icon: Users, title: "Direct Connect", description: "Chat directly with owners—no middlemen, no hidden fees.", gradient: "from-quickrent-success/20 to-quickrent-success/5" },
    { icon: Key, title: "Instant Booking", description: "Schedule visits and secure your dream home in just a few taps.", gradient: "from-quickrent-gold/20 to-quickrent-gold/5" },
  ];

  const stats = [
    { value: "10K+", label: "Properties" },
    { value: "50K+", label: "Happy Tenants" },
    { value: "5K+", label: "Owners" },
    { value: "100+", label: "Cities" },
  ];

  const testimonials = [
    { name: "Priya Sharma", role: "Tenant · Chennai", content: "QuickRent made finding my apartment in Anna Nagar effortless. The filters are incredibly precise!", rating: 5, avatar: "PS" },
    { name: "Rajesh Kumar", role: "Owner · Coimbatore", content: "As an owner, I get quality tenant inquiries. The scheduling system saves me hours every week.", rating: 5, avatar: "RK" },
    { name: "Ananya Patel", role: "Tenant · Madurai", content: "I booked 3 visits in one evening and found my home by the weekend. Truly remarkable.", rating: 5, avatar: "AP" },
  ];

  const howItWorks = [
    { step: "01", title: "Create Account", description: "Register as a tenant or property owner in under 2 minutes.", icon: Users },
    { step: "02", title: "Discover Properties", description: "Browse verified listings with powerful search and filters.", icon: Search },
    { step: "03", title: "Schedule Visits", description: "Pick a convenient time to visit your shortlisted homes.", icon: Home },
    { step: "04", title: "Move In", description: "Complete formalities and settle into your new space.", icon: Key },
  ];

  const popularCities = [
    { name: "Chennai", properties: "2,500+", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&auto=format&fit=crop&q=60" },
    { name: "Coimbatore", properties: "800+", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&auto=format&fit=crop&q=60" },
    { name: "Bangalore", properties: "3,200+", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&auto=format&fit=crop&q=60" },
    { name: "Madurai", properties: "500+", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=60" },
    { name: "Hyderabad", properties: "2,800+", image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=400&auto=format&fit=crop&q=60" },
    { name: "Mumbai", properties: "4,100+", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&auto=format&fit=crop&q=60" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ─── Hero ─── */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Modern apartment" className="w-full h-full object-cover scale-105" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/95 via-foreground/75 to-foreground/40" />
        </div>

        <div className="container mx-auto px-4 relative z-10 pt-24 pb-16">
          <div className="max-w-2xl">
            <motion.span variants={fadeUp} initial="hidden" animate="visible" custom={0}
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent/15 backdrop-blur-md text-accent rounded-full text-sm font-semibold mb-8 border border-accent/20">
              <Sparkles className="w-4 h-4" /> India's Most Trusted Rental Platform
            </motion.span>

            <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
              className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
              Find Your <br /><span className="text-accent">Perfect Home</span>
            </motion.h1>

            <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
              className="text-lg md:text-xl text-white/70 mb-10 max-w-lg leading-relaxed">
              Discover verified rentals, connect with owners directly, and move in hassle-free across Tamil Nadu & 100+ Indian cities.
            </motion.p>

            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
              className="flex flex-col sm:flex-row gap-4">
              <Link to="/properties">
                <Button size="lg" className="rounded-full px-8 bg-accent hover:bg-accent/90 text-accent-foreground h-14 text-base font-semibold shadow-xl shadow-accent/20 transition-transform hover:scale-[1.02]">
                  <Search className="w-5 h-5 mr-2" /> Browse Properties
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" className="rounded-full px-8 h-14 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 transition-transform hover:scale-[1.02]">
                  List Your Property <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>

            {/* Stats Bar */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
              className="flex items-center gap-8 mt-16 pt-8 border-t border-white/10">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-white">{stat.value}</p>
                  <p className="text-white/50 text-sm mt-1 font-medium">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-1.5">
            <div className="w-1 h-2.5 bg-white/40 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Popular Cities ─── */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-14">
            <span className="text-sm font-semibold text-accent uppercase tracking-widest">Explore</span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-2">Popular Cities</h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Find your next home in India's most in-demand rental markets.</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularCities.map((city, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.5}>
                <Link to="/properties" className="group block">
                  <div className="relative rounded-2xl overflow-hidden aspect-[3/4] shadow-md">
                    <img src={city.image} alt={city.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white font-bold text-lg">{city.name}</p>
                      <p className="text-white/60 text-xs font-medium">{city.properties} properties</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="py-24 bg-secondary/40">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-14">
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">Why QuickRent</span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-2">Built for Modern Renters</h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Everything you need for a seamless rental experience.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="bg-card p-7 rounded-2xl border border-border hover:border-primary/30 shadow-sm hover:shadow-xl transition-all duration-500 group">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-14">
            <span className="text-sm font-semibold text-accent uppercase tracking-widest">Process</span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-2">How It Works</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="relative text-center group">
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-px bg-border" />
                )}
                <div className="relative inline-flex mb-5">
                  <div className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
                    <item.icon className="w-9 h-9 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-xs shadow-lg">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-24 bg-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-[0.03]" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-14">
            <span className="text-sm font-semibold text-accent uppercase tracking-widest">Testimonials</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mt-2">Loved by Thousands</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="bg-card/5 backdrop-blur-sm border border-white/10 p-7 rounded-2xl">
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-quickrent-gold text-quickrent-gold" />
                  ))}
                </div>
                <p className="text-white/80 mb-6 leading-relaxed">"{t.content}"</p>
                <div className="flex items-center gap-3 pt-5 border-t border-white/10">
                  <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center text-sm font-bold text-accent">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{t.name}</p>
                    <p className="text-white/50 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="relative rounded-3xl overflow-hidden p-10 md:p-20 text-center shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80" />
            <div className="absolute inset-0 bg-hero-pattern opacity-[0.08]" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-5">Ready to Find Your Dream Home?</h2>
              <p className="text-primary-foreground/70 max-w-xl mx-auto mb-10 text-lg">
                Join thousands of users discovering verified rentals across India every day.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" className="rounded-full px-10 bg-accent hover:bg-accent/90 text-accent-foreground h-14 text-base font-semibold shadow-xl shadow-accent/25 transition-transform hover:scale-[1.02]">
                    Get Started Free <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/properties">
                  <Button size="lg" variant="outline" className="rounded-full px-10 h-14 text-base font-semibold border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                    Browse Properties
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
