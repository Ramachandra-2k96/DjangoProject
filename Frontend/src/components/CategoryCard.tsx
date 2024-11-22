import { motion } from 'framer-motion';

interface CategoryCardProps {
  title: string;
  description: string;
  image: string;
  recipes: number;
}

export default function CategoryCard({
  title,
  description,
  image,
  recipes,
}: CategoryCardProps) {
  return (
    <motion.div
      className="relative flex-shrink-0 mx-4 w-80 h-96 perspective-1000"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      style={{
        willChange: 'transform', // Optimize performance
        backfaceVisibility: 'hidden', // Prevent flicker
      }}
    >
      <motion.div
        className="overflow-hidden relative w-full h-full rounded-2xl transform-gpu group"
        whileHover={{
          rotateY: 10,
          transition: {
            type: 'spring',
            stiffness: 300,
            damping: 30,
          },
        }}
        style={{
          isolation: 'isolate', // Prevent blending issues
          willChange: 'transform',
        }}
      >
        {/* Image Container */}
        <div
          className="absolute inset-0 bg-center bg-cover transform-gpu"
          style={{
            backgroundImage: `url(${image})`,
            willChange: 'transform',
            backfaceVisibility: 'hidden',
          }}
        />

        {/* Fixed gradient overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t to-transparent from-black/80 via-black/40"
          style={{
            mixBlendMode: 'normal',
            willChange: 'opacity',
            backfaceVisibility: 'hidden',
          }}
        />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300 group-hover:translate-y-[-10px]">
          <h3 className="mb-2 text-2xl font-bold">{title}</h3>
          <p className="mb-3 text-gray-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {description}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-orange-400">{recipes} Recipes</span>
            <motion.a
              href="/viewrecipie"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-sm font-medium bg-orange-500 rounded-full transition-colors hover:bg-orange-600"
              style={{ backfaceVisibility: 'hidden' }}
            >
              Explore
            </motion.a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
