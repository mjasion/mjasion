'use client';

import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();

  // 3D transform values based on scroll
  const rotateX = useTransform(scrollY, [0, 300], [0, 15]);
  const rotateY = useTransform(scrollY, [0, 300], [0, -10]);
  const translateZ = useTransform(scrollY, [0, 300], [0, -100]);

  // Mouse movement 3D transforms
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateXMouse = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 100, damping: 30 });
  const rotateYMouse = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / innerWidth;
      const y = (e.clientY - innerHeight / 2) / innerHeight;

      mouseX.set(x);
      mouseY.set(y);
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-bg perspective-1000">
      {/* Grid Background */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <Image
          src="https://framerusercontent.com/images/eVPQSYBoVqwchmpN78sjyYtovY.svg"
          alt="Grid Background"
          fill
          className="object-cover"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
          }}
        />
      </div>

      {/* Floating Elements Background */}
      <div className="absolute inset-0 overflow-hidden">
        <ul className="absolute inset-0">
          {Array.from({ length: 60 }).map((_, i) => {
            const delay = i * 0.1;
            const duration = 15 + (i % 10) * 2;
            const scale = 0.5 + (i % 4) * 0.25;
            const xOffset = (i % 10) * 120;
            const yOffset = Math.floor(i / 10) * 100;

            return (
              <motion.li
                key={i}
                className="absolute w-8 h-8 bg-blue-500/10 rounded-full backdrop-blur-sm border border-white/5"
                style={{
                  left: `${10 + xOffset}px`,
                  top: `${50 + yOffset}px`,
                  scale: scale,
                }}
                animate={{
                  x: [0, 30, -20, 0],
                  y: [0, -25, 15, 0],
                  rotate: [0, 180, 360],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: duration,
                  repeat: Infinity,
                  delay: delay,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </ul>
      </div>

      {/* Animated 3D background layers */}
      <div className="absolute inset-0 preserve-3d">
        <motion.div
          style={{
            rotateX: rotateX,
            rotateY: rotateY,
            translateZ: translateZ,
          }}
          animate={{
            x: mousePosition.x * 0.02,
            y: mousePosition.y * 0.02,
            rotateZ: mousePosition.x * 0.01,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 30 }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"
        />

        <motion.div
          style={{
            rotateX: useTransform(rotateX, value => value * -0.8),
            rotateY: useTransform(rotateY, value => value * 0.6),
            translateZ: useTransform(translateZ, value => value * 0.5),
          }}
          animate={{
            x: mousePosition.x * -0.03,
            y: mousePosition.y * -0.03,
            scale: [1, 1.1, 1],
            rotateZ: mousePosition.x * -0.02,
          }}
          transition={{
            x: { type: "spring", stiffness: 50, damping: 30 },
            y: { type: "spring", stiffness: 50, damping: 30 },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-3xl"
        />

        {/* Additional floating elements */}
        <motion.div
          animate={{
            y: [-20, 20, -20],
            rotateX: [0, 360],
            rotateZ: [0, 180],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 right-1/3 w-4 h-4 bg-blue-400 rounded-full opacity-60"
        />

        <motion.div
          animate={{
            y: [20, -20, 20],
            rotateY: [0, 360],
            rotateZ: [180, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-2/3 left-1/3 w-6 h-6 bg-purple-400 rounded-full opacity-40"
        />
      </div>

      {/* Main content with 3D transforms */}
      <motion.div
        className="relative z-10 text-center px-6 preserve-3d"
        style={{
          rotateX: rotateXMouse,
          rotateY: rotateYMouse,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Social Proof Section - matches LanderX */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center justify-center mb-8 space-x-3"
        >
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotateY: 180 }}
                animate={{ scale: 1, rotateY: 0 }}
                transition={{ delay: 0.1 * i, type: "spring" }}
                className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full border-2 border-white/10 flex items-center justify-center text-white text-xs font-bold"
              >
                {String.fromCharCode(65 + i)}
              </motion.div>
            ))}
          </div>
          <div className="text-left">
            <div className="flex items-center text-white/90 mb-1">
              <span className="text-sm font-medium">Join</span>
              <span className="text-lg font-bold mx-2 text-white">10,625</span>
              <span className="text-lg font-bold text-white">+</span>
            </div>
            <p className="text-sm text-gray-400">other loving customers</p>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50, rotateX: -20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            translateZ: 50,
          }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-center"
        >
          <span className="text-white">The best platform to grow your business</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30, rotateX: -15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ translateZ: 40 }}
          className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto text-center"
        >
          The most powerful tools to boost sales, hire the best people, and access exclusive market insights.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6, type: "spring" }}
          style={{ translateZ: 60 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              rotateY: 5,
              translateZ: 10,
              boxShadow: "0 25px 50px rgba(41, 52, 255, 0.5)"
            }}
            whileTap={{ scale: 0.95, rotateY: -2 }}
            className="btn-primary px-8 py-4 rounded-full text-white font-semibold text-lg transform-gpu"
            onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Get Started Now
          </motion.button>

          <motion.button
            whileHover={{
              scale: 1.05,
              rotateY: -5,
              translateZ: 10,
              borderColor: "rgba(255, 255, 255, 0.6)",
              backgroundColor: "rgba(255, 255, 255, 0.1)"
            }}
            whileTap={{ scale: 0.95, rotateY: 2 }}
            className="border border-white/20 px-8 py-4 rounded-full text-white font-semibold text-lg hover:border-white/40 transition-all duration-300 backdrop-blur-sm transform-gpu"
            onClick={() => document.getElementById('blog')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Book a Demo
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Enhanced 3D scroll indicator */}
      <motion.div
        initial={{ opacity: 0, translateZ: -50 }}
        animate={{ opacity: 1, translateZ: 0 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 preserve-3d"
      >
        <motion.div
          animate={{
            y: [0, 15, 0],
            rotateX: [0, 10, 0],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{
            rotateY: 15,
            translateZ: 20,
            scale: 1.1,
          }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center backdrop-blur-sm bg-white/5 transform-gpu"
        >
          <motion.div
            className="w-1 h-3 bg-gradient-to-b from-white to-blue-300 rounded-full mt-2"
            animate={{
              scaleY: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </section>
  );
}
