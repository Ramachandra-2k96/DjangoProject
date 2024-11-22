import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useState } from 'react';

const contributors = [
  {
    name: "Chef Maria Romano",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1024&auto=format&fit=crop",
    specialty: "Italian Cuisine",
    recipes: 156,
    followers: "12.5K",
    bio: "Award-winning chef specializing in authentic Italian cuisine with a modern twist."
  },
  {
    name: "Alex Chen",
    image: "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?q=80&w=1024&auto=format&fit=crop",
    specialty: "Asian Fusion",
    recipes: 142,
    followers: "10.8K",
    bio: "Innovative chef combining traditional Asian flavors with contemporary techniques."
  },
  {
    name: "Isabella Martinez",
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=1024&auto=format&fit=crop",
    specialty: "Latin American Cuisine",
    recipes: 167,
    followers: "13.8K", 
    bio: "Creative chef blending traditional Latin American flavors with modern culinary techniques."
  },
  {
    name: "James Wilson",
    image: "https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?q=80&w=1024&auto=format&fit=crop",
    specialty: "Farm-to-Table",
    recipes: 145,
    followers: "11.2K",
    bio: "Sustainable cooking advocate focused on seasonal ingredients and zero-waste techniques."
  },
  {
    name: "Aisha Patel",
    image: "https://images.unsplash.com/photo-1589571894960-20bbe2828d0a?q=80&w=1024&auto=format&fit=crop", 
    specialty: "Indian Fusion",
    recipes: 178,
    followers: "14.5K",
    bio: "Innovative chef reimagining classic Indian dishes with contemporary global influences."
  }
];

function ContributorCard({ contributor, index }: { contributor: typeof contributors[0], index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      className="perspective-1000 w-full md:w-[calc(33.333%-1rem)]"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale: 1.05 }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="overflow-hidden bg-white rounded-xl shadow-lg"
      >
        <div className="relative">
          <motion.div
            className="overflow-hidden mx-auto mt-8 w-32 h-32 rounded-full"
            initial={{ rotate: 0 }}
            whileInView={{ rotate: 360 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: index * 0.2 }}
          >
            <img
              src={contributor.image}
              alt={contributor.name}
              className="object-cover w-full h-full"
            />
          </motion.div>
          
          <motion.div 
            className="p-6 text-center"
            style={{ transform: "translateZ(20px)" }}
          >
            <h3 className="mb-2 text-xl font-bold">{contributor.name}</h3>
            <p className="mb-3 font-medium text-orange-500">{contributor.specialty}</p>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="mb-4 text-sm text-gray-600"
            >
              {contributor.bio}
            </motion.p>

            <div className="flex gap-6 justify-center text-sm">
              <div>
                <span className="font-bold text-gray-900">{contributor.recipes}</span>
                <p className="text-gray-500">Recipes</p>
              </div>
              <div>
                <span className="font-bold text-gray-900">{contributor.followers}</span>
                <p className="text-gray-500">Followers</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function TopContributors() {
  return (
    <section className="py-20 bg-white">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-gray-900">
            Top Contributors
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Meet the culinary artists behind our most popular recipes
          </p>
        </motion.div>

        <div className="flex flex-col gap-6 md:flex-row">
          {contributors.map((contributor, index) => (
            <ContributorCard 
              key={index} 
              contributor={contributor} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}