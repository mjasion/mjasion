'use client';

import { motion } from 'framer-motion';
import { Project } from '@/types';

const projects: Project[] = [
  {
    id: '1',
    title: 'Kubernetes Platform',
    description: 'Built a multi-tenant Kubernetes platform with GitOps workflows, automated deployments, and comprehensive monitoring.',
    technologies: ['Kubernetes', 'ArgoCD', 'Prometheus', 'Grafana', 'Helm'],
    github: 'https://github.com/username/k8s-platform',
  },
  {
    id: '2',
    title: 'Infrastructure as Code',
    description: 'Developed Terraform modules for AWS infrastructure provisioning with automated testing and compliance checks.',
    technologies: ['Terraform', 'AWS', 'Python', 'GitHub Actions'],
    github: 'https://github.com/username/terraform-modules',
  },
  {
    id: '3',
    title: 'Observability Stack',
    description: 'Implemented comprehensive observability solution with distributed tracing, metrics, and log aggregation.',
    technologies: ['Jaeger', 'Prometheus', 'ELK Stack', 'Go', 'Docker'],
    link: 'https://demo.example.com',
  },
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-20 px-6 bg-gray-900/30">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Featured Projects
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Some of the projects I&apos;ve worked on that showcase my technical expertise
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
            >
              <h3 className="text-xl font-bold text-white mb-3">
                {project.title}
              </h3>

              <p className="text-gray-300 mb-4 leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">
                {project.github && (
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-2 border border-gray-600 text-gray-300 hover:border-white hover:text-white transition-colors rounded"
                  >
                    View Code
                  </motion.a>
                )}
                {project.link && (
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-2 btn-primary text-white rounded"
                  >
                    Live Demo
                  </motion.a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
