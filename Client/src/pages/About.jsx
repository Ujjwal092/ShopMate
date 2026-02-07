import { Users, Target, Award, Heart } from "lucide-react";
"use client";
import { motion } from "framer-motion";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description: "We put our customers at the heart of everything we do.",
    },
    {
      icon: Award,
      title: "Quality Products",
      description: "We ensure all products meet our high standards.",
    },
    {
      icon: Users,
      title: "Community",
      description: "Building lasting relationships with our customers.",
    },
    {
      icon: Target,
      title: "Innovation",
      description: "Constantly improving our platform and services.",
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
         
          <h1
            className="text-4xl font-bold text-foreground mb-6"
          >
            About ShopMate
          </h1>

          <p
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Your trusted e-commerce platform for quality products and exceptional service.
          </p>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {values.map((value, index) => (
            <motion.div
              key={index}
              className="glass-card p-6 rounded-xl text-center shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-500 cursor-pointer"
              whileHover={{ scale: 1.08 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <motion.div
                className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center"
                whileHover={{ rotate: 15 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <value.icon className="w-8 h-8 text-primary" />
              </motion.div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {value.title}
              </h3>
              
              <p className="text-muted-foreground">{value.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Our Story Section */}
        <motion.div
          className="glass-card p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-4">Our Story</h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            Founded with a vision to make online shopping simple and enjoyable,
            ShopMate has grown to become a trusted platform for thousands of
            customers worldwide. We believe that everyone deserves access to
            quality products at fair prices, backed by exceptional customer
            service.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
