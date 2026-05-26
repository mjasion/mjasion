export function getReadingTime(body: string | undefined): number {
  return Math.max(1, Math.ceil((body?.split(/\s+/).length ?? 0) / 200));
}

export const categoryColors: Record<string, string> = {
  cloud: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  development: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  kubernetes: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
};

export const categoryLabels: Record<string, string> = {
  cloud: 'Cloud',
  development: 'Development',
  kubernetes: 'Kubernetes',
};

export const author = {
  name: 'Marcin Jasion',
  nickname: 'Marcin',
  designation: 'Senior Site Reliability Engineer',
  email: 'hello@mjasion.pl',
  image: '/images/mjasion.jpg',
  summaryShort:
    'Senior SRE. I work where code meets infrastructure — diagnosing incidents, fixing observability gaps, and making 1000+ services boring to operate.',
  summary:
    'Senior Site Reliability Engineer based in Warsaw. I work where code meets infrastructure — diagnosing incidents, fixing the observability gaps that hide them, and shipping the boring-but-important changes that prevent the next outage. Currently helping engineering teams operate a system of 1000+ services at NatWest Boxed. 13 years in tech: started as a Java developer, found my home in the messy middle where applications meet production.',
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
  cvUrl: '/cv/',
};

export const impactMetrics: { value: string; label: string }[] = [
  { value: '13+', label: 'years in production systems' },
  { value: '1000+', label: 'services in current scope' },
  { value: '40%', label: 'cloud cost saved by redesign' },
  { value: 'SOC2', label: 'certification delivered' },
];

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

export interface Experience {
  company: string;
  url: string;
  location: string;
  logo?: string;
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
    company: 'NatWest Boxed',
    url: 'https://www.natwestboxed.com',
    location: 'Warsaw, Poland',
    overview:
      'Banking-as-a-Service platform from NatWest Group. I support engineering teams operating a system of 1000+ services — incident response, observability, and reliability improvements across the platform.',
    positions: [
      {
        designation: 'Senior Site Reliability Engineer',
        start: 'Feb 2025',
        responsibilities: [
          'Support development teams resolving production incidents across a system of 1000+ services',
          'Improve observability — metrics, logs, traces — to shorten time-to-detect and time-to-diagnose',
          'Drive reliability improvements that prevent recurring outages and reduce on-call toil',
        ],
      },
    ],
  },
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
          'Designed and implemented Kubernetes Pod autoscaling based on Celery queue depth',
          'Designed the on-premise, enterprise edition of DVC Studio to run reliably in arbitrary customer environments (ESXi, Hyper-V, KVM)',
          'Implemented new CI/CD pipeline reducing feature delivery time by 50%',
          'Coordinated large-scale engineering efforts for SOC2 certification',
          'Achieved 40% reduction in cloud expenses by optimizing system designs',
          'Expanded GitOps + IaC coverage to improve disaster recovery resilience',
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
      'Equinix is the leader in the colocation data center market. Joined to implement CloudNative practices on Kubernetes and automate Istio Service Mesh for GDPR-compliant connectivity.',
    positions: [
      {
        designation: 'Senior DevOps Engineer',
        start: 'Aug 2020',
        end: 'Apr 2022',
        responsibilities: [
          'Led migrations of 3 systems (40 microservices) to make infrastructure GDPR compliant',
          'Designed architecture and migration process from on-premise to cloud',
          'Delivered automation of cloud infrastructure (K8s, Istio Service Mesh, observability, CD pipelines)',
          'Supported other teams in solving AWS, Kubernetes, and networking issues',
          'Mentored teammates on infrastructure code quality and design',
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
      'Technical interview platform for testing coding skills. Joined ahead of the migration from instance-based (EC2) infrastructure to CloudNative Kubernetes.',
    positions: [
      {
        designation: 'Senior Site Reliability Engineer',
        start: 'Jan 2020',
        end: 'Jul 2020',
        responsibilities: [
          'Kept online services and infrastructure running in good health',
          'Ensured infrastructure security against unauthorized access and interruptions',
          'Educated engineers on modern cloud computing standards and good practices',
        ],
      },
      {
        designation: 'DevOps Engineer',
        start: 'Nov 2018',
        end: 'Dec 2019',
        responsibilities: [
          'Designed architecture for migration from EC2 to Kubernetes',
          'Improved CI/CD pipelines and developer tooling',
        ],
      },
    ],
  },
  {
    company: 'F5 Networks',
    url: 'https://www.f5.com',
    location: 'Warsaw, Poland',
    overview:
      'F5 specializes in application security, multi-cloud management, and network security. Joined to develop a secure gateway for CloudNative services; project concluded with the NGINX acquisition.',
    positions: [
      {
        designation: 'Senior Software Engineer',
        start: 'Feb 2018',
        end: 'Oct 2018',
        responsibilities: [
          'Implemented CloudNative services in Go',
          'Designed pipelines for unit, integration, and end-to-end tests with multi-project execution',
          'Automated packaging into Amazon Machine Images (AMI)',
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
      'Software house building solutions for external clients. Moved from Java development to DevOps to gain experience as infrastructure administrator and cloud solutions architect.',
    positions: [
      {
        designation: 'DevOps Engineer',
        start: 'Aug 2015',
        end: 'Feb 2018',
        responsibilities: [
          'ELK Stack aggregating 50 TB of data for Play Mobile — 16 nodes, 2 TB memory',
          'Play Now — designed scalable Cloud Native delivery pipelines and third-party integrations for a new mobile operator',
          'Virginmobile MVNO — 2 years of infrastructure maintenance and architectural improvements',
          'Migrated parts of internal infrastructure to AWS (e.g. autoscaling GitLab runners)',
        ],
      },
      {
        designation: 'Java Developer',
        start: 'Jan 2014',
        end: 'Oct 2015',
        responsibilities: [
          'Developed application stack for managing product catalog for Play Mobile operator',
        ],
      },
    ],
  },
  {
    company: 'Risco Software',
    url: 'https://risco.pl',
    location: 'Warsaw, Poland',
    overview:
      'Software house delivering systems for financial institutions and private companies.',
    positions: [
      {
        designation: 'Java Developer',
        start: 'Dec 2012',
        end: 'Dec 2013',
        responsibilities: [
          'Express ELIXIR Adapter — immediate transfer system for CitiBank S.A.',
          'Maintained back-office systems for FM Bank and BankBPS',
          'Developed components of the Paymax mobile payment system',
        ],
      },
    ],
  },
];

export const certifications = [
  {
    name: 'AI_Devs 3: Agents',
    timeline: '2024',
    organization: 'AI_Devs',
    organizationUrl: 'https://www.aidevs.pl',
    overview:
      'Hands-on program on building production AI agents with LLMs — prompt engineering, tool use, RAG, and agentic workflows.',
    certificateUrl: 'https://www.aidevs.pl',
  },
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

export const giscus = {
  repo: 'mjasion/mjasion' as const,
  repoId: 'R_kgDOGQ6lZQ',
  category: 'General',
  categoryId: 'DIC_kwDOGQ6lZc4COgAu',
};

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
