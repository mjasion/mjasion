export const author = {
  name: 'Marcin Jasion',
  nickname: 'Marcin',
  designation: 'Senior Platform Engineer',
  email: 'hello@mjasion.pl',
  image: '/images/mjasion.jpg',
  summary:
    'I am a passionate Platform Engineer with 12 years of experience. I have a deep understanding of application and infrastructure architecture, and the software development lifecycle. As a problem solver, I am always eager to find new and innovative solutions to complex challenges.',
  socialLinks: [
    { name: 'GitHub', url: 'https://www.github.com/mjasion', icon: 'github' },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/marcinjasion',
      icon: 'linkedin',
    },
    { name: 'Instagram', url: 'https://www.instagram.com/night_fluo/', icon: 'instagram' },
    { name: 'Email', icon: 'mail', obfuscated: true },
  ],
  cvUrl:
    'https://pub-161b014b043f4380a88430689756374e.r2.dev/marcinjasion_cv_public.pdf',
};

export const skills = [
  {
    name: 'Kubernetes',
    logo: '/images/sections/skills/kubernetes.svg',
    summary:
      '5 years of extensive experience designing, deploying, and managing containerized applications at scale.',
    categories: ['container'],
    url: 'https://kubernetes.io/',
  },
  {
    name: 'Istio',
    logo: '/images/sections/skills/istio.svg',
    summary:
      '3 years of experience in deploying, configuring, securing, and managing service meshes.',
    categories: ['container'],
    url: 'https://istio.io',
  },
  {
    name: 'Go Development',
    logo: '/images/sections/skills/golang.svg',
    summary:
      '6 years of experience writing scalable, testable, and maintainable programs.',
    categories: ['programming'],
    url: 'https://golang.org/',
  },
  {
    name: 'AWS',
    logo: '/images/sections/skills/aws.svg',
    summary:
      '8 years of experience designing, deploying, and managing secure, scalable cloud solutions.',
    categories: ['cloud'],
    url: 'https://aws.amazon.com/',
  },
  {
    name: 'GCP',
    logo: '/images/sections/skills/google-cloud.svg',
    summary:
      '2 years of experience. Designed a multi-cloud platform using GKE with workloads on AWS and GCP.',
    categories: ['cloud'],
    url: 'https://cloud.google.com/',
  },
  {
    name: 'Docker',
    logo: '/images/sections/skills/docker.svg',
    summary:
      '8+ years using Docker for bug replicability, code isolation, and security.',
    categories: ['container', 'tools'],
  },
  {
    name: 'Linux',
    logo: '/images/sections/skills/linux.svg',
    summary:
      'Expertise in Linux administration, shell scripting, and automation.',
    categories: ['tools'],
  },
  {
    name: 'GitHub',
    logo: '/images/sections/skills/github.svg',
    summary:
      '8+ years using GitHub for collaboration, code management, and CI/CD with GitHub Actions.',
    categories: ['tools'],
  },
];

export const skillCategories = [
  'All',
  'Container',
  'Cloud',
  'Programming',
  'Tools',
];

export interface Experience {
  company: string;
  url: string;
  location: string;
  logo: string;
  overview: string;
  positions: {
    designation: string;
    start: string;
    end?: string;
    responsibilities: string[];
  }[];
}

export const experiences: Experience[] = [
  {
    company: 'Datachain (former Iterative.ai)',
    url: 'https://datachain.ai',
    location: 'Global (Remote)',
    logo: '/images/sections/experiences/dvc_ai_logo.jpeg',
    overview:
      'Datachain builds open-source tools for machine learning, offering team collaboration products as SaaS and self-hosted solutions.',
    positions: [
      {
        designation: 'Senior Platform Engineer',
        start: 'Jul 2022',
        end: 'Dec 2024',
        responsibilities: [
          'Designed a multi-cloud platform for running distributed ML experiments with billions of objects (AWS and GCP)',
          'Designed and implemented autoscaling of Pods on Kubernetes based on the Celery queue',
          'Designed the on-premise, enterprise edition of DVC Studio for arbitrary customer environments',
          'Implemented new CI/CD pipeline reducing feature delivery time by 50%',
          'Coordinated large-scale engineering efforts for SOC2 certification',
          'Achieved 40% reduction in cloud expenses by optimizing system designs',
        ],
      },
    ],
  },
  {
    company: 'Equinix',
    url: 'https://equinix.com',
    location: 'Warsaw, Poland',
    logo: '/images/sections/experiences/equinix_logo.jpeg',
    overview:
      'Equinix is the leader in the colocation data center market. Joined to implement CloudNative practices on K8S clusters.',
    positions: [
      {
        designation: 'Senior DevOps Engineer',
        start: 'Jul 2022',
        end: 'Apr 2024',
        responsibilities: [
          'Led migrations of 3 systems with 40 microservices for GDPR compliance',
          'Designed architecture and migration process from on-premise to cloud',
          'Delivered automation of cloud infrastructure (K8s, Istio, Observability, CD Pipelines)',
          'Mentored teammates to develop and maintain high quality infrastructure code',
        ],
      },
    ],
  },
  {
    company: 'Codility',
    url: 'https://codility.com',
    location: 'Warsaw, Poland',
    logo: '/images/sections/experiences/codility_logo.jpeg',
    overview:
      'Technical interview platform for testing coding skills. Joined for migration from EC2 to CloudNative Kubernetes.',
    positions: [
      {
        designation: 'Senior Site Reliability Engineer',
        start: 'Jan 2020',
        end: 'Jun 2020',
        responsibilities: [
          'Keeping online services and infrastructure running in good health',
          'Ensuring infrastructure security',
          'Mentoring teammates and educating engineers on cloud computing',
        ],
      },
      {
        designation: 'DevOps Engineer',
        start: 'Nov 2018',
        end: 'Dec 2019',
        responsibilities: [
          'Designing architecture for migration to Kubernetes',
          'Improving pipelines for CI/CD',
        ],
      },
    ],
  },
  {
    company: 'TouK',
    url: 'https://touk.pl',
    location: 'Warsaw, Poland',
    logo: '/images/sections/experiences/touk.svg',
    overview:
      'Software house building solutions for external clients. Changed to DevOps team to learn infrastructure and cloud solutions.',
    positions: [
      {
        designation: 'DevOps Engineer',
        start: 'Aug 2015',
        end: 'Feb 2018',
        responsibilities: [
          'ELK Stack for aggregating 50 TB of data — 16 nodes, 2TB memory, 50 TB storage',
          'Play Now — scalable infrastructure with Cloud Native approach for mobile operator',
          'Virginmobile MVNO — 2 years of maintenance and infrastructure improvements',
        ],
      },
      {
        designation: 'Java Developer',
        start: 'Jan 2014',
        end: 'Aug 2015',
        responsibilities: [
          'Developed application stack for managing product catalog for Play Mobile operator',
        ],
      },
    ],
  },
];

export const certifications = [
  {
    name: 'CKAD: Certified Kubernetes Application Developer',
    timeline: 'May 2020 - May 2023',
    organization: 'Linux Foundation',
    organizationUrl: 'https://www.linuxfoundation.org',
    overview:
      'Thorough understanding of Kubernetes key concepts and skills to design, deploy, and manage scalable and resilient applications.',
    certificateUrl:
      'https://www.youracclaim.com/badges/448c4beb-c7bb-427b-95cd-9b0669e77f81/linked_in_profile',
  },
  {
    name: 'CKA: Certified Kubernetes Administrator',
    timeline: 'Nov 2019 - Nov 2022',
    organization: 'Linux Foundation',
    organizationUrl: 'https://www.linuxfoundation.org',
    overview:
      'Skills and knowledge to design, build, and deploy cloud-native applications using Kubernetes.',
    certificateUrl:
      'https://www.youracclaim.com/badges/d07b5711-5692-4501-a311-18b6358bdf83/linked_in_profile',
  },
];

export const presentations = [
  {
    name: 'GitOps - Czyli konfigurowanie Kubernetesa Gitem',
    icon: 'github',
    date: '27.02.2020',
    meetup: 'SysOps/DevOps Warszawa MeetUp #48',
    meetupUrl:
      'https://www.sysopspolska.pl/multimedia/warszawa-meetup-48/',
    assets: [
      {
        title: 'Youtube',
        url: 'https://www.youtube.com/watch?v=Co-S25sBTEQ',
      },
    ],
  },
  {
    name: 'GitOps - Czyli konfigurowanie Kubernetesa Gitem',
    icon: 'github',
    date: '29.06.2019',
    meetup: 'Confitura 2019',
    meetupUrl: 'https://2019.confitura.pl/#home',
    assets: [
      {
        title: 'Youtube',
        url: 'https://www.youtube.com/watch?v=IJYxvyzHp8A',
      },
    ],
  },
  {
    name: 'Autoscaling GitLab CI',
    icon: 'gitlab',
    date: '27.06.2019',
    meetup: 'SysOps/DevOps Warszawa MeetUp #42',
    meetupUrl:
      'https://www.sysopspolska.pl/multimedia/warszawa-meetup-42/',
    assets: [
      { title: 'Youtube', url: 'https://youtu.be/u2hFb1ZpXYk' },
    ],
  },
];
