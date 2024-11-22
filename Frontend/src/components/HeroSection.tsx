import { motion } from 'framer-motion';
import { ChefHat, Utensils, Clock } from 'lucide-react';

const floatingElements = [
  { Icon: ChefHat, delay: 0.2 },
  { Icon: Utensils, delay: 0.4 },
  { Icon: Clock, delay: 0.6 },
];

export default function HeroSection() {
  return (
    <div className="overflow-hidden relative min-h-screen">
      {/* Parallax Background */}
      <div className="absolute inset-0 z-0">
        <video
          className="object-cover absolute inset-0 w-full h-full"
          autoPlay
          loop
          muted
          playsInline
          style={{
            transform: 'translateZ(-1px) scale(2)',
          }}
        >
          <source src="https://videos.pexels.com/video-files/3255109/3255109-uhd_2560_1440_25fps.mp4" type="video/mp4" />
        </video>
      </div>
        <div className="absolute inset-0 bg-black/40" />

      {/* Content Container */}
      <div className="container flex relative z-10 items-center px-4 mx-auto h-screen">
        <div className="max-w-3xl">
          {/* Main Text */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-6 text-5xl font-bold leading-tight text-white md:text-7xl"
          >
            Share Your Culinary Journey
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mb-8 text-xl text-gray-200 md:text-2xl"
          >
            Join our community of passionate home chefs and food enthusiasts. Share recipes, discover new flavors, and create memorable dining experiences.
          </motion.p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <motion.a
              href="/login"
              whileHover={{ y: -4, boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}
              transition={{ duration: 0.2 }}
              className="inline-block px-8 py-4 text-lg font-semibold text-center text-white bg-orange-500 rounded-full transition-colors transform hover:bg-orange-600"
            >
              Start Sharing
            </motion.a>
            <motion.a
              href="/viewrecipie"
              whileHover={{ y: -4, boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}
              transition={{ duration: 0.2 }}
              className="px-8 py-4 text-lg font-semibold text-orange-500 bg-white rounded-full transition-colors transform hover:bg-gray-100"
            >
              Explore Recipes
            </motion.a>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {floatingElements.map(({ Icon, delay }, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: [0, -20, 0],
                rotate: [-5, 5, -5],
              }}
              transition={{
                delay,
                duration: 2,
                y: {
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                },
                rotate: {
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                },
              }}
              className="absolute text-white/80"
              style={{
                left: `${20 + index * 30}%`,
                top: `${30 + index * 15}%`,
              }}
            >
              <Icon size={32} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}