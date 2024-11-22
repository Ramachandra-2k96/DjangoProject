import { motion } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function NewsletterSection() {
  const [isFocused, setIsFocused] = useState(false);
  const [email, setEmail] = useState('');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-orange-50 to-white relative overflow-hidden">
      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [-10, 10, -10],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-10 left-[10%] text-orange-200"
      >
        <Sparkles size={24} />
      </motion.div>
      <motion.div
        animate={{
          y: [10, -10, 10],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-10 right-[10%] text-orange-200"
      >
        <Sparkles size={24} />
      </motion.div>

      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Join Our Culinary Community
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-gray-600 text-lg mb-8"
          >
            Get weekly recipes, cooking tips, and exclusive content delivered straight to your inbox
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="relative max-w-md mx-auto"
          >
            <motion.div
              animate={{
                scale: isFocused ? 1.02 : 1,
                boxShadow: isFocused 
                  ? "0 8px 30px rgba(0,0,0,0.12)" 
                  : "0 4px 6px rgba(0,0,0,0.05)"
              }}
              className="flex items-center bg-white rounded-full overflow-hidden p-1"
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="flex-1 px-6 py-3 outline-none text-gray-700"
              />
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(251, 146, 60, 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-orange-500 text-white px-6 py-3 rounded-full flex items-center gap-2 font-medium"
              >
                Subscribe
                <Send size={18} />
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-sm text-gray-500 mt-4"
          >
            Join 50,000+ food enthusiasts already subscribed
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}