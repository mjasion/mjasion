'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'backdrop-blur-xl bg-black/50 border-b border-white/10' : 'backdrop-blur-sm'
      }`}
      style={{ height: '68px' }}
    >
      <nav className="container mx-auto px-6 h-full">
        <div className="flex items-center justify-between h-full">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-xl font-bold text-white cursor-pointer"
            onClick={() => scrollToSection('hero')}
          >
            LanderX
          </motion.div>

          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-8">
              {[
                { id: 'features', label: 'Features' },
                { id: 'pricing', label: 'Pricing' },
                { id: 'blog', label: 'Blog' },
                { id: 'contact', label: 'Contact' }
              ].map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{
                    scale: 1.05,
                    y: -1
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection(item.id)}
                  className="relative px-4 py-2 text-white/80 hover:text-white transition-all duration-300 font-medium text-sm"
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{
              scale: 1.02,
              y: -1
            }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 px-6 py-2.5 rounded-lg text-white font-medium text-sm transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
          >
            Get Template
          </motion.button>
        </div>
      </nav>
    </motion.header>
  );
}
