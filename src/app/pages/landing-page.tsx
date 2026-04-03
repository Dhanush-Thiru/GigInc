import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Shield, Zap, TrendingUp, Clock, CloudRain, Wind, DollarSign, Award, Menu, X, Users } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

export function LandingPage() {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const heroImages = [
    "/images/hero1.jpg",
    "/images/hero2.jpg",
    "/images/hero3.jpg"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 overflow-hidden">
      {/* Floating Background Elements */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl"
        animate={{
          y: [0, 50, 0],
          x: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-40 h-40 bg-indigo-400/20 rounded-full blur-3xl"
        animate={{
          y: [0, -40, 0],
          x: [0, -30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="px-6 py-4 bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50"
      >
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Shield className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-900">InsureGig</span>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">How it Works</a>
            <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</a>
            <Button variant="outline" onClick={() => navigate("/auth")}>Login</Button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-blue-50 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col gap-1 pt-3 pb-2 border-t mt-3">
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium"
                >
                  How it Works
                </a>
                <a
                  href="#pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium"
                >
                  Pricing
                </a>
                <div className="px-4 pt-2">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => { setMobileMenuOpen(false); navigate("/auth"); }}>
                    Login
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1
              className="text-5xl font-bold text-blue-900 mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              AI Insurance for Delivery Partners
            </motion.h1>
            <motion.p
              className="text-xl text-gray-700 mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Protecting every delivery, every week.
            </motion.p>
            <motion.p
              className="text-lg text-gray-600 mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Protect your weekly income instantly with AI-powered insurance designed for delivery workers from Swiggy, Zomato, and more.
            </motion.p>
            <motion.div
              className="flex gap-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" onClick={() => navigate("/auth")} className="bg-blue-600 hover:bg-blue-700">
                  Get Started
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline">
                  Watch Demo
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ x: 100, opacity: 0, rotateY: -30 }}
            animate={{ x: 0, opacity: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{ perspective: 1000 }}
          >
            <motion.div
              className="rounded-2xl overflow-hidden shadow-2xl relative"
              whileHover={{
                rotateY: 5,
                rotateX: -5,
                scale: 1.02,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {heroImages.map((img, index) => (
                <motion.img
                  key={img}
                  src={img}
                  alt={`Delivery worker ${index + 1}`}
                  className="w-full h-auto absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: currentImageIndex === index ? 1 : 0 }}
                  transition={{ duration: 1 }}
                  style={{
                    position: index === 0 ? "relative" : "absolute",
                  }}
                />
              ))}

              {/* Floating Stats */}
              <motion.div
                className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 1.5, type: "spring" }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold text-blue-900">10K+</div>
                    <div className="text-xs text-gray-600">Active Users</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-6 left-6 bg-green-600/90 backdrop-blur-sm rounded-lg p-4 shadow-lg"
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 1.7, type: "spring" }}
                whileHover={{ scale: 1.1, rotate: -5 }}
              >
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-white" />
                  <div>
                    <div className="text-2xl font-bold text-white">₹2.5Cr</div>
                    <div className="text-xs text-green-100">Payouts Processed</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Problem Statement with Sliding Images */}
      <section className="bg-white py-16 relative overflow-hidden">
        {/* Sliding Background Images */}
        <div className="absolute inset-0 opacity-30">
          <motion.div
            className="flex gap-4 h-full"
            animate={{ x: [0, -1000] }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4 shrink-0">
                <img src="/images/delivery-rain.png" alt="" className="h-full w-auto object-cover" />
                <img src="/images/weather-rain.jpg" alt="" className="h-full w-auto object-cover" />
                <img src="/images/pollution-city.jpg" alt="" className="h-full w-auto object-cover" />
                <img src="/images/income-payment.jpg" alt="" className="h-full w-auto object-cover" />
              </div>
            ))}
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The Problem</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Delivery workers lose income during heavy rain, pollution, and other disruptions.
              Traditional insurance is slow and complicated. We make it instant and automatic.
            </p>
          </motion.div>

          {/* Problem Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              {
                icon: CloudRain,
                title: "Weather Impact",
                desc: "Heavy rain reduces deliveries by 60%",
                image: "/images/weather-rain.jpg"
              },
              {
                icon: Wind,
                title: "Pollution Risk",
                desc: "High AQI means fewer riders on road",
                image: "/images/pollution-city.jpg"
              },
              {
                icon: TrendingUp,
                title: "Income Loss",
                desc: "Lost earnings impact families",
                image: "/images/income-payment.jpg"
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                className="relative group"
                initial={{ opacity: 0, y: 50, rotateX: -20 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{
                  y: -10,
                  rotateY: 5,
                  scale: 1.05,
                }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="relative rounded-xl overflow-hidden shadow-lg h-64">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <item.icon className="w-10 h-10 mb-3" />
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-200">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
        {/* Animated Background Pattern */}
        <motion.div
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.h2
            className="text-3xl font-bold text-center text-gray-900 mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            How It Works
          </motion.h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                num: 1,
                title: "Sign Up",
                desc: "Quick registration with your delivery platform details",
                color: "blue",
                delay: 0
              },
              {
                num: 2,
                title: "Choose Plan",
                desc: "Select Normal or Premium coverage based on your needs",
                color: "indigo",
                delay: 0.2
              },
              {
                num: 3,
                title: "AI Monitors",
                desc: "Our AI tracks weather, AQI, and demand in real-time",
                color: "purple",
                delay: 0.4
              },
              {
                num: 4,
                title: "Auto Payout",
                desc: "Instant compensation when disruptions are detected",
                color: "green",
                delay: 0.6
              }
            ].map((step) => (
              <motion.div
                key={step.num}
                className="text-center relative"
                initial={{ opacity: 0, y: 50, rotateY: -30 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ duration: 0.6, delay: step.delay }}
                viewport={{ once: true }}
                whileHover={{
                  y: -15,
                  scale: 1.05,
                }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.div
                  className={`w-20 h-20 bg-${step.color}-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}
                  whileHover={{
                    rotate: 360,
                    scale: 1.2,
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  style={{
                    background: step.color === "blue" ? "#2563eb" :
                               step.color === "indigo" ? "#4f46e5" :
                               step.color === "purple" ? "#7c3aed" : "#10b981"
                  }}
                >
                  <span className="text-white text-3xl font-bold">{step.num}</span>
                </motion.div>
                <h3 className="font-semibold mb-2 text-lg">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>

                {/* Connecting Line */}
                {step.num < 4 && (
                  <motion.div
                    className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-blue-300 to-transparent"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: step.delay + 0.3 }}
                    viewport={{ once: true }}
                    style={{ transformOrigin: "left" }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.h2
            className="text-3xl font-bold text-center text-gray-900 mb-12"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Key Features
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "AI-Powered Detection",
                desc: "Advanced AI monitors weather, pollution, and delivery demand to automatically detect disruptions",
                color: "blue",
                image: "/images/feature-rain.jpg"
              },
              {
                icon: Clock,
                title: "Instant Claims",
                desc: "No paperwork, no waiting. Claims are automatically triggered and processed in minutes",
                color: "green",
                image: "/images/feature-payment.jpg"
              },
              {
                icon: TrendingUp,
                title: "Earnings Protection",
                desc: "Protect up to ₹3000/week with our Premium plan and keep your income stable",
                color: "blue",
                image: "/images/feature-city.jpg"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="group relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="p-6 border rounded-2xl transition-all overflow-hidden relative bg-white"
                  whileHover={{
                    y: -10,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    scale: 1.03,
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Background Image on Hover */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                    style={{
                      backgroundImage: `url(${feature.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center"
                    }}
                  />

                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    <feature.icon className={`w-12 h-12 text-${feature.color}-600 mb-4 relative z-10`} style={{ color: feature.color === "blue" ? "#2563eb" : "#10b981" }} />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2 relative z-10">{feature.title}</h3>
                  <p className="text-gray-600 relative z-10">
                    {feature.desc}
                  </p>

                  {/* 3D Effect Decorative Element */}
                  <motion.div
                    className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-2xl`}
                    style={{
                      background: feature.color === "blue" ? "rgba(37, 99, 235, 0.3)" : "rgba(16, 185, 129, 0.3)"
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Slider */}
      <section className="py-16 bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            className="text-3xl font-bold text-center text-gray-900 mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Trusted by Delivery Heroes
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Rajesh Kumar",
                role: "Zomato Partner",
                img: "/images/testimonial1.jpg",
                quote: "During monsoon, I used to lose ₹5000+ monthly. Now InsureGig covers my losses automatically!"
              },
              {
                name: "Priya Sharma",
                role: "Swiggy Partner",
                img: "/images/testimonial2.jpg",
                quote: "Best decision! No paperwork, instant payouts. The AI really works - got paid within 2 hours of heavy rain."
              },
              {
                name: "Mohammed Ali",
                role: "Delivery Executive",
                img: "/images/testimonial3.jpg",
                quote: "Finally, someone understands our struggles. Premium plan worth every rupee for peace of mind."
              }
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="relative"
                initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                whileHover={{
                  y: -10,
                  rotateY: 5,
                  scale: 1.05
                }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <motion.div
                      className="w-16 h-16 rounded-full overflow-hidden border-4 border-blue-600"
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <img src={testimonial.img} alt={testimonial.name} className="w-full h-full object-cover" />
                    </motion.div>
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                  <div className="flex gap-1 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.15 + i * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <Award className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white relative overflow-hidden">
        {/* Animated Background Circles */}
        <motion.div
          className="absolute top-10 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-10 left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
          <motion.h2
            className="text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Ready to Protect Your Income?
          </motion.h2>
          <motion.p
            className="text-xl mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join thousands of delivery workers who trust InsureGig
          </motion.p>

          <motion.div
            className="flex items-center justify-center gap-8 mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="text-center">
              <motion.div
                className="text-4xl font-bold"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                10K+
              </motion.div>
              <div className="text-sm text-blue-100">Active Users</div>
            </div>
            <div className="text-center">
              <motion.div
                className="text-4xl font-bold"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                ₹2.5Cr
              </motion.div>
              <div className="text-sm text-blue-100">Paid Out</div>
            </div>
            <div className="text-center">
              <motion.div
                className="text-4xl font-bold"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                98%
              </motion.div>
              <div className="text-sm text-blue-100">Satisfaction</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button size="lg" onClick={() => navigate("/auth")} className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6">
              Get Started Now
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p>&copy; 2026 InsureGig. Protecting delivery workers with AI.</p>
        </div>
      </footer>
    </div>
  );
}
