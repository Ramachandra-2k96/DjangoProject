import { motion, useMotionValue, useAnimationControls } from 'framer-motion';
import { useEffect, useState } from 'react';
import CategoryCard from './CategoryCard';

const categories = [
  {
    title: 'Italian Cuisine',
    description: 'Authentic pasta, pizza, and Mediterranean flavors',
    image:
      'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?q=80&w=2070&auto=format&fit=crop',
    recipes: 245,
  },
  {
    title: 'Asian Fusion',
    description: 'Modern takes on traditional Asian dishes',
    image:
      'https://images.unsplash.com/photo-1617093727343-374698b1b08d?q=80&w=2070&auto=format&fit=crop',
    recipes: 189,
  },
  {
    title: 'Healthy Bowl',
    description: 'Nutritious and colorful bowl recipes',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2070&auto=format&fit=crop',
    recipes: 167,
  },
  {
    title: 'Desserts',
    description: 'Sweet treats and baking masterpieces',
    image:
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=2070&auto=format&fit=crop',
    recipes: 203,
  },
  {
    title: 'Grilled & BBQ',
    description: 'Perfect outdoor cooking recipes',
    image:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2070&auto=format&fit=crop',
    recipes: 156,
  },
];

const infiniteCategories = [...categories, ...categories, ...categories];

export default function CategoriesSection() {
  const [currentIndex, setCurrentIndex] = useState(categories.length);
  const controls = useAnimationControls();
  const x = useMotionValue(0);
  const cardWidth = 320;
  const totalWidth = categories.length * cardWidth;

  useEffect(() => {
    const autoScroll = setInterval(() => {
      const nextIndex = (currentIndex + 1) % categories.length;
      setCurrentIndex(nextIndex);
      controls.start({
        x: -(nextIndex * cardWidth),
        transition: { type: 'spring', stiffness: 300, damping: 30 },
      });
    }, 3000);
    return () => clearInterval(autoScroll);
  }, [currentIndex, controls, cardWidth]);

  const handleDragEnd = (_, info) => {
    const velocity = info.velocity.x;
    const currentX = x.get();

    let newIndex = Math.round(-currentX / cardWidth);

    if (Math.abs(velocity) > 500) {
      const direction = velocity < 0 ? 1 : -1;
      newIndex = Math.round((-currentX + direction * cardWidth) / cardWidth);
    }

    newIndex = Math.max(0, Math.min(infiniteCategories.length - 1, newIndex));

    setCurrentIndex(newIndex);
    controls.start({
      x: -(newIndex * cardWidth),
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    });
  };

  return (
    <motion.section
      className="py-20 bg-gray-50"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Categories
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover recipes from around the world, organized into beautiful
            collections
          </p>
        </motion.div>

        <motion.div
          className="overflow-hidden cursor-grab active:cursor-grabbing"
          whileTap={{ cursor: 'grabbing' }}
        >
          <motion.div
            drag="x"
            dragConstraints={{ right: 0, left: -totalWidth }}
            style={{ x }}
            animate={controls}
            onDragEnd={handleDragEnd}
            className="flex gap-4 py-8 px-4"
            dragElastic={0.1}
            dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
          >
            {infiniteCategories.map((category, index) => (
              <motion.div
                key={index}
                className="snap-center"
                style={{
                  filter: 'none', // Prevent gray overlay
                  WebkitFilter: 'none', // For Safari support
                }}
              >
                <CategoryCard {...category} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
