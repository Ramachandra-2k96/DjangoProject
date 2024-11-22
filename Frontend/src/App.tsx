import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroSection from './components/HeroSection';
import CategoriesSection from './components/CategoriesSection';
import FeaturedRecipes from './components/FeaturedRecipes';
import TopContributors from './components/TopContributors';
import BenefitsSection from './components/BenefitsSection';
import TestimonialsSection from './components/TestimonialsSection';
import NewsletterSection from './components/NewsletterSection';
import Footer from './components/Footer';

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

function App() {
  return (
    <AnimatePresence mode="wait">
      <motion.main
        className="min-h-screen"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
        transition={{ duration: 0.6 }}
      >
        <HeroSection />
        <CategoriesSection />
        <FeaturedRecipes />
        <TopContributors />
        <BenefitsSection />
        <TestimonialsSection />
        <NewsletterSection />
        <Footer />
      </motion.main>
    </AnimatePresence>
  );
}

export default App;