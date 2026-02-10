import { motion } from "framer-motion";
import { Users, Shield, Home, Heart, Target, Award, MapPin, Phone, Mail } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const AboutPage = () => {
  const team = [
    { name: "Arun Kumar", role: "Founder & CEO", avatar: "AK", desc: "10+ years in real estate technology" },
    { name: "Priya Lakshmi", role: "Head of Operations", avatar: "PL", desc: "Expert in property management" },
    { name: "Ravi Shankar", role: "CTO", avatar: "RS", desc: "Full-stack developer & architect" },
    { name: "Deepa Nair", role: "Head of Marketing", avatar: "DN", desc: "Digital marketing specialist" },
  ];

  const values = [
    { icon: Shield, title: "Trust & Transparency", desc: "Every listing is verified. No hidden fees, no surprises." },
    { icon: Heart, title: "Customer First", desc: "Your satisfaction drives every decision we make." },
    { icon: Target, title: "Innovation", desc: "We use cutting-edge technology to simplify house hunting." },
    { icon: Award, title: "Quality", desc: "We maintain the highest standards in all our services." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-10" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              About <span className="text-accent">QuickRent</span>
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
              We're on a mission to make finding your perfect rental home as simple and stress-free as possible across India.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Story</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Founded in 2024, QuickRent was born from a simple frustration — finding a rental home in India shouldn't be this hard. 
                Our founders experienced firsthand the challenges of dealing with brokers, fake listings, and lack of transparency.
              </p>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Today, QuickRent connects thousands of tenants directly with verified property owners across Tamil Nadu and beyond, 
                eliminating middlemen and creating a seamless rental experience.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                From Chennai to Coimbatore, Madurai to Trichy — we're expanding rapidly to cover every corner of India.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { value: "10K+", label: "Properties Listed" },
                { value: "50K+", label: "Happy Users" },
                { value: "100+", label: "Cities" },
                { value: "4.8★", label: "User Rating" },
              ].map((stat, i) => (
                <div key={i} className="bg-card p-6 rounded-2xl border border-border text-center shadow-md">
                  <p className="text-3xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">The principles that guide everything we do</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-card p-6 rounded-2xl border border-border shadow-md text-center"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">The passionate people behind QuickRent</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-card p-6 rounded-2xl border border-border shadow-md text-center"
              >
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">{member.avatar}</span>
                </div>
                <h3 className="font-semibold text-foreground">{member.name}</h3>
                <p className="text-sm text-accent font-medium">{member.role}</p>
                <p className="text-xs text-muted-foreground mt-2">{member.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
