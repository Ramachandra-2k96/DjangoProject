import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Clock, Users } from 'lucide-react';

const featuredRecipes = [
  {
    title: "Tuscan Herb Grilled Salmon",
    chef: "Maria Romano",
    time: "30 mins",
    servings: 4,
    image: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?q=80&w=2070&auto=format&fit=crop",
    difficulty: "Medium"
  },
  {
    title: "Mediterranean Quinoa Bowl",
    chef: "Alex Chen",
    time: "25 mins",
    servings: 2,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop",
    difficulty: "Easy"
  },
  {
    title: "Classic Tiramisu",
    chef: "Sophie Laurent",
    time: "45 mins",
    servings: 8,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=2070&auto=format&fit=crop",
    difficulty: "Advanced"
  }
];

function RecipeCard({ recipe, index }: { recipe: typeof featuredRecipes[0], index: number }) {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="relative w-full md:w-[calc(33.333%-1rem)] flex-shrink-0"
    >
      <motion.div
        whileHover={{ scale: 1.03 }}
        className="bg-white rounded-xl overflow-hidden shadow-lg"
      >
        <div className="relative h-64 overflow-hidden">
          <motion.img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
          />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
            style={{ y, opacity }}
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2">{recipe.title}</h3>
          <p className="text-gray-600 mb-4">By {recipe.chef}</p>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-gray-600">{recipe.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-gray-600">{recipe.servings} servings</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm">
              {recipe.difficulty}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function FeaturedRecipes() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured Recipes
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our hand-picked selection of extraordinary dishes
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-6">
          {featuredRecipes.map((recipe, index) => (
            <RecipeCard key={index} recipe={recipe} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}