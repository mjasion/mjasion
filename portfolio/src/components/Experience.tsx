'use client';

import { motion } from 'framer-motion';
import { Experience } from '@/types';

const experiences: Experience[] = [
  {
    id: '1',
    title: 'Senior Platform Engineer',
    company: 'Your Current Company',
    location: 'Remote',
    duration: '2023 - Present',
    description: 'Leading cloud infrastructure initiatives and Kubernetes deployments. Designed and implemented CI/CD pipelines, reducing deployment time by 60%. Mentored development teams on DevOps practices.',
    technologies: ['Kubernetes', 'AWS', 'Terraform', 'GitOps', 'Docker', 'Go'],
  },
  {
    id: '2',
    title: 'DevOps Engineer',
    company: 'Previous Company',
    location: 'City, Country',
    duration: '2021 - 2023',
    description: 'Architected and maintained cloud infrastructure supporting 1M+ users. Implemented monitoring and observability solutions, improving system reliability by 40%.',
    technologies: ['AWS', 'Kubernetes', 'Prometheus', 'Grafana', 'Python', 'Ansible'],
  },
  {
    id: '3',
    title: 'Cloud Engineer',
    company: 'Another Company',
    location: 'City, Country',
    duration: '2019 - 2021',
    description: 'Migrated legacy applications to cloud-native architecture. Implemented security best practices and compliance frameworks.',
    technologies: ['AWS', 'Docker', 'Jenkins', 'CloudFormation', 'Python'],
  },
];

export default function ExperienceSection() {
  return (
    <section id="experience" className="py-20 px-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Professional Experience
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            A journey through cloud engineering and platform development
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto perspective-1000">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -100, rotateY: -15, translateZ: -50 }}
              whileInView={{
                opacity: 1,
                x: 0,
                rotateY: 0,
                translateZ: 0,
              }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                delay: index * 0.15,
                duration: 0.8,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{
                translateZ: 20,
                rotateY: 2,
                scale: 1.02,
                transition: { type: "spring", stiffness: 300 }
              }}
              className="relative pl-8 pb-12 border-l-2 border-blue-500/30 last:border-l-0 transform-gpu"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Enhanced Timeline dot with 3D effect */}
              <motion.div
                className="absolute -left-2 top-0 w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full border-4 border-gray-900 shadow-lg"
                initial={{ scale: 0, rotateZ: -180 }}
                whileInView={{ scale: 1, rotateZ: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 + 0.3, type: "spring" }}
                whileHover={{
                  scale: 1.3,
                  rotateZ: 180,
                  boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)"
                }}
              />

              <motion.div
                className="bg-gray-900/50 rounded-lg p-6 ml-4 backdrop-blur-sm border border-gray-800/50 hover:border-blue-500/30 transition-all duration-300"
                initial={{ rotateX: -10, translateZ: -30 }}
                whileInView={{ rotateX: 0, translateZ: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 + 0.2, duration: 0.6 }}
                whileHover={{
                  translateZ: 30,
                  rotateX: 5,
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
                  backgroundColor: "rgba(17, 24, 39, 0.7)"
                }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.div
                  className="flex flex-col md:flex-row md:items-center md:justify-between mb-3"
                  style={{ translateZ: 10 }}
                >
                  <motion.h3
                    className="text-xl font-bold text-white"
                    whileHover={{
                      color: "#60a5fa",
                      translateZ: 5,
                    }}
                  >
                    {exp.title}
                  </motion.h3>
                  <motion.span
                    className="text-blue-400 font-medium"
                    style={{ translateZ: 8 }}
                  >
                    {exp.duration}
                  </motion.span>
                </motion.div>

                <motion.div
                  className="flex flex-col md:flex-row md:items-center mb-4"
                  style={{ translateZ: 12 }}
                >
                  <span className="text-gray-300 font-medium">{exp.company}</span>
                  <span className="hidden md:inline text-gray-500 mx-2">•</span>
                  <span className="text-gray-400">{exp.location}</span>
                </motion.div>

                <motion.p
                  className="text-gray-300 mb-4 leading-relaxed"
                  style={{ translateZ: 15 }}
                >
                  {exp.description}
                </motion.p>

                <motion.div
                  className="flex flex-wrap gap-2"
                  style={{ translateZ: 20 }}
                >
                  {exp.technologies.map((tech, techIndex) => (
                    <motion.span
                      key={tech}
                      className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium border border-blue-500/30"
                      initial={{ opacity: 0, scale: 0, rotateZ: -45 }}
                      whileInView={{ opacity: 1, scale: 1, rotateZ: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: index * 0.15 + techIndex * 0.05 + 0.5,
                        type: "spring",
                        stiffness: 200
                      }}
                      whileHover={{
                        scale: 1.1,
                        rotateZ: 5,
                        translateZ: 5,
                        backgroundColor: "rgba(59, 130, 246, 0.3)",
                        borderColor: "rgba(59, 130, 246, 0.6)"
                      }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
