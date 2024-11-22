import { motion } from 'framer-motion';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Utensils,
  ChefHat,
  Coffee,
  Soup
} from 'lucide-react';

const floatingIcons = [
  { Icon: Utensils, delay: 0 },
  { Icon: ChefHat, delay: 0.2 },
  { Icon: Coffee, delay: 0.4 },
  { Icon: Soup, delay: 0.6 }
];

const socialLinks = [
  { Icon: Facebook, href: '#', label: 'Facebook' },
  { Icon: Twitter, href: '#', label: 'Twitter' },
  { Icon: Instagram, href: '#', label: 'Instagram' },
  { Icon: Youtube, href: '#', label: 'YouTube' }
];

const quickLinks = [
  { title: 'About Us', href: '#' },
  { title: 'Recipes', href: '#' },
  { title: 'Categories', href: '#' },
  { title: 'Submit Recipe', href: '#' },
  { title: 'Contact', href: '#' },
  { title: 'Privacy Policy', href: '#' }
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Floating Background Icons */}
      {floatingIcons.map(({ Icon, delay }, index) => (
        <motion.div
          key={index}
          className="absolute text-gray-800/5"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.5,
            y: [-20, 20],
            x: [-10, 10],
            rotate: [-10, 10]
          }}
          transition={{
            delay,
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          style={{
            left: `${25 * index}%`,
            top: `${20 + (index * 15)}%`,
          }}
        >
          <Icon size={48} />
        </motion.div>
      ))}

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <ChefHat className="text-orange-500" />
              RecipeShare
            </h3>
            <p className="text-gray-400 mb-6">
              Join our community of food lovers and share your culinary creations with the world.
            </p>
            <div className="flex gap-4">
              {socialLinks.map(({ Icon, href, label }, index) => (
                <motion.a
                  key={index}
                  href={href}
                  aria-label={label}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.2,
                    color: '#f97316'
                  }}
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.a
                    href={link.href}
                    whileHover={{ x: 5, color: '#f97316' }}
                    className="text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    {link.title}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <h3 className="text-lg font-semibold mb-6">Get in Touch</h3>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="bg-gray-800 rounded-lg p-6"
            >
              <p className="text-gray-400 mb-4">
                Have questions or suggestions? We'd love to hear from you.
              </p>
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(251, 146, 60, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-orange-500 text-white px-6 py-3 rounded-full font-medium"
              >
                Contact Us
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400"
        >
          <p>© {new Date().getFullYear()} RecipeShare. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
}