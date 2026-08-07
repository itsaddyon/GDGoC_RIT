export const DOMAINS = [
  {
    key: "android",
    title: "Android & Mobile",
    desc: "Kotlin, Jetpack Compose, and mobile product thinking from the first prototype to launch.",
    color: "var(--accent-green)",
  },
  {
    key: "web",
    title: "Web",
    desc: "Modern web platforms, motion-rich interfaces, and frontend systems that scale cleanly.",
    color: "var(--accent-blue)",
  },
  {
    key: "cloud",
    title: "Cloud",
    desc: "Google Cloud fundamentals, deployment pipelines, and practical infrastructure patterns.",
    color: "var(--accent-red)",
  },
  {
    key: "ai",
    title: "AI & ML",
    desc: "Applied machine learning, Gemini APIs, and product-minded AI experiments.",
    color: "var(--accent-yellow)",
  },
] as const;

export const TECHNOLOGIES = [
  "Android",
  "Web",
  "Cloud",
  "AI",
  "Gemini",
  "Firebase",
  "Kotlin",
  "Flutter",
  "Maps SDK",
  "Vertex AI",
  "ARCore",
  "BigQuery",
] as const;

export const PEOPLE = [
  {
    name: "Organizer",
    role: "Chapter direction",
    accent: "var(--accent-blue)",
  },
  {
    name: "Events Lead",
    role: "Workshops and experiences",
    accent: "var(--accent-red)",
  },
  {
    name: "Tech Lead",
    role: "Build systems and prototyping",
    accent: "var(--accent-green)",
  },
  {
    name: "PR & Outreach",
    role: "Community voice and partnerships",
    accent: "var(--accent-yellow)",
  },
  {
    name: "Finance Lead",
    role: "Operations and sponsor flow",
    accent: "var(--accent-blue)",
  },
] as const;

export const ACHIEVEMENTS = [
  { value: "1,200+", label: "Students reached" },
  { value: "20+", label: "Events hosted" },
  { value: "7", label: "Core team members" },
  { value: "50+", label: "Projects built" },
] as const;

export const EVENTS: any[] = [];

export const TESTIMONIALS = [
  {
    quote:
      "Joining GDG on Campus gave me my first real project experience — and my first internship lead.",
    name: "Ananya S.",
    role: "Web Domain, '25 batch",
  },
  {
    quote:
      "The study jams are the reason I stopped being afraid of the command line.",
    name: "Rohan V.",
    role: "Cloud Domain, '26 batch",
  },
  {
    quote:
      "Best community on campus for actually shipping things, not just talking about them.",
    name: "Priya M.",
    role: "AI/ML Domain, '25 batch",
  },
] as const;

export const FAQS = [
  {
    question: "What is GDG and GDGoC RIT?",
    answer:
      "Google Developer Groups (GDG) is a global community of developers who are interested in Google's developer technology. GDGoC (GDG on Campus) RIT is the official university chapter for Roorkee Institute of Technology. We host tech events, workshops, and hackathons to help students learn, build projects, and grow together.",
  },
  {
    question: "Who can join GDGoC RIT?",
    answer:
      "Anyone! Whether you are a first-year student just starting to code, or a final-year student building complex systems, GDGoC is open to all students from all branches. No prior coding experience is required for most of our introductory events.",
  },
  {
    question: "How do I become a member?",
    answer:
      "It's completely free! Simply click the 'Join us' button on our website, create a profile on the official GDG Community platform, and RSVP to our upcoming events.",
  },
  {
    question: "What kind of events do you host?",
    answer:
      "We host a wide variety of events including hands-on coding workshops, Study Jams (focused on Cloud, AI, and Android), expert tech talks, hackathons, and networking sessions.",
  },
  {
    question: "Are the events free to attend?",
    answer:
      "Yes! All GDGoC RIT events, workshops, and study jams are 100% free for students.",
  },
] as const;
