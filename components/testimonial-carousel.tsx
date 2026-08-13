import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  role: string;
  photo: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  slidesToShow?: number;
}

export default function TestimonialCarousel({
  testimonials,
  autoPlay = true,
  autoPlayInterval = 4000,
  showArrows = true,
  showDots = true,
  slidesToShow = 3,
}: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-play logic
  useEffect(() => {
    if (!autoPlay || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, isHovered, testimonials.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Calculate visible slides based on screen size
  const getSlidesToShow = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 640) return 1;
      if (width < 1024) return 2;
      return slidesToShow;
    }
    return slidesToShow;
  };

  const visibleSlides = getSlidesToShow();
  const totalSlides = Math.ceil(testimonials.length / visibleSlides);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Premium Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/5 to-[#B8952E]/5 rounded-3xl -z-10" />

      {/* Carousel Container */}
      <div className="relative overflow-hidden rounded-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {testimonials.slice(currentIndex * visibleSlides, (currentIndex * visibleSlides) + visibleSlides).map((testimonial) => (
              <motion.div
                key={testimonial.id}
                className="bg-white p-6 rounded-2xl border border-[#D4AF37]/10 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 group"
                whileHover={{ y: -4 }}
              >
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 text-[#D4AF37]/20 group-hover:text-[#D4AF37]/50 transition-colors">
                  <Quote className="w-8 h-8" />
                </div>

                {/* Rating Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={`w-4 h-4 ${
                        index < testimonial.rating
                          ? 'text-[#D4AF37] fill-[#D4AF37]'
                          : 'text-gray-300 fill-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-[#4A3F35] font-light leading-relaxed mb-6 line-clamp-4 italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#D4AF37]/20 shrink-0">
                    <Image fill src={testimonial.photo} alt={testimonial.name} className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1A1A1A]">{testimonial.name}</h4>
                    <p className="text-sm text-[#D4AF37] font-medium">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      {showArrows && testimonials.length > visibleSlides && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-[#D4AF37] hover:text-white rounded-full shadow-lg border border-[#D4AF37]/20 transition-all duration-300 z-10 group"
          >
            <svg className="w-6 h-6 text-[#D4AF37] group-hover:text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-[#D4AF37] hover:text-white rounded-full shadow-lg border border-[#D4AF37]/20 transition-all duration-300 z-10 group"
          >
            <svg className="w-6 h-6 text-[#D4AF37] group-hover:text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Progress Dots */}
      {showDots && totalSlides > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-[#D4AF37] w-8'
                  : 'bg-gray-300 hover:bg-[#D4AF37]/50'
              }`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
        <motion.div
          className="h-full bg-[#D4AF37]"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentIndex + 1) / totalSlides) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}