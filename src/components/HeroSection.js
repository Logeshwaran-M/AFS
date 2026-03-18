import React from 'react';
import { motion } from 'framer-motion';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section id="hero">
      <motion.div 
        className="hero-content"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h4>Designer Nameplates</h4>
        <h2>Give your home that <span>finishing touch</span></h2>
        <p>Online Preview - Free Delivery - AFS</p>
        <button className="btn-primary">Browse our collection →</button>
      </motion.div>
    </section>
  );
};

export default HeroSection;