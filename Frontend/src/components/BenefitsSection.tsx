import { motion } from 'framer-motion';
import { ChefHat, Share2, Award, Users, BookOpen, Trophy } from 'lucide-react';

const benefits = [
  {
    icon: ChefHat,
    title: "Expert-Led Learning",
    description: "Learn from professional chefs and culinary experts worldwide"
  },
  {
    icon: Share2,
    title: "Community Sharing",
    description: "Share your recipes and get inspired by others in our community"
  },
  {
    icon: Award,
    title: "Quality Recipes",
    description: "Access to thousands of tested and verified recipes"
  },
  {
    icon: Users,
    title: "Collaborative Cooking",
    description: "Join cooking challenges and community events"
  },
  {
    icon: BookOpen,
    title: "Personal Cookbook",
    description: "Save and organize your favorite recipes in one place"
  },
  {
    icon: Trophy,
    title: "Recognition",
    description: "Earn badges and rewards for your contributions"
  }
];

export default function BenefitsSection() {
  const containerVariants = {
    hidden: {},
    visible: {
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
    <section className="py-20 bg-gradient-to-b from-white to-orange-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Join Our Community?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover the benefits of being part of our culinary family
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
                }}
                className="bg-white rounded-xl p-6 transform transition-all duration-300"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: index * 0.1 
                  }}
                  className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 mx-auto"
                >
                  <Icon className="w-8 h-8 text-orange-500" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}