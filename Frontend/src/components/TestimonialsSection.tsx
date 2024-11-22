import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Home Chef',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1024&auto=format&fit=crop',
    rating: 5,
    text: "This platform has transformed my cooking journey. The community is incredibly supportive, and I've learned so many new techniques!",
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Food Blogger',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1024&auto=format&fit=crop',
    rating: 5,
    text: "The quality of recipes and the engagement from other food enthusiasts is outstanding. It's my go-to platform for culinary inspiration.",
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Culinary Student',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1024&auto=format&fit=crop',
    rating: 5,
    text: "As a culinary student, this platform has been an invaluable resource. The diverse range of recipes and cooking tips has greatly enhanced my learning experience.",
  },
  {
    id: 4,
    name: 'David Thompson',
    role: 'Restaurant Owner',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1024&auto=format&fit=crop',
    rating: 5,
    text: "I've discovered so many unique flavors and techniques here that have inspired new dishes for my restaurant. It's a goldmine for professional chefs too!",
  },
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-1 mb-4">
    {[...Array(rating)].map((_, i) => (
      <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
    ))}
  </div>
);

const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => (
  <motion.div
    className="w-full md:w-[550px] lg:w-[650px] flex-shrink-0 p-10 bg-white rounded-2xl shadow-xl"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ duration: 0.5 }}
  >
    <motion.div 
      className="flex flex-col items-center mb-8 text-center"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="relative mb-6 w-32 h-32">
        <motion.div 
          className="absolute inset-0 bg-orange-100 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1.1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        />
        <motion.img
          src={testimonial.image}
          alt={testimonial.name}
          className="object-cover relative z-10 w-full h-full rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
        />
      </div>
      <motion.h3 
        className="mb-2 text-2xl font-bold text-gray-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {testimonial.name}
      </motion.h3>
      <motion.p 
        className="font-medium text-orange-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {testimonial.role}
      </motion.p>
    </motion.div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
    >
      <StarRating rating={testimonial.rating} />
    </motion.div>

    <motion.p 
      className="text-xl leading-relaxed text-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      "{testimonial.text}"
    </motion.p>
  </motion.div>
);

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="overflow-hidden py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-6 text-5xl font-bold text-gray-900">What Our Community Says</h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            Join thousands of satisfied home chefs and food enthusiasts
          </p>
        </motion.div>

        <div className="flex relative justify-center items-center mx-auto max-w-6xl">
          <AnimatePresence mode="wait">
            <TestimonialCard key={testimonials[currentIndex].id} testimonial={testimonials[currentIndex]} />
          </AnimatePresence>

          <motion.button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 p-3 bg-white rounded-full shadow-lg transition-transform duration-200 -translate-y-1/2 hover:scale-110"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </motion.button>

          <motion.button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 p-3 bg-white rounded-full shadow-lg transition-transform duration-200 -translate-y-1/2 hover:scale-110"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </motion.button>
        </div>

        <div className="flex gap-3 justify-center mt-12">
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                index === currentIndex ? 'bg-orange-500 scale-125' : 'bg-gray-300'
              }`}
              whileHover={{ scale: 1.3 }}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
