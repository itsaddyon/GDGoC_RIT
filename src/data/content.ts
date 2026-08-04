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
  { name: "Organizer", role: "Chapter direction", accent: "var(--accent-blue)" },
  { name: "Events Lead", role: "Workshops and experiences", accent: "var(--accent-red)" },
  { name: "Tech Lead", role: "Build systems and prototyping", accent: "var(--accent-green)" },
  { name: "PR & Outreach", role: "Community voice and partnerships", accent: "var(--accent-yellow)" },
  { name: "Finance Lead", role: "Operations and sponsor flow", accent: "var(--accent-blue)" },
] as const;

export const ACHIEVEMENTS = [
  { value: "1,200+", label: "Students reached" },
  { value: "40+", label: "Events hosted" },
  { value: "25+", label: "Core team members" },
  { value: "15+", label: "Industry speakers" },
] as const;

export const UPCOMING_EVENTS = [
  {
    id: "info-session-2026",
    title: "GDG Info Session",
    date: "Aug 20, 2026",
    tag: "Kickoff",
    color: "var(--accent-blue)",
    desc: "Meet the core team and learn what we're building this year.",
  },
  {
    id: "android-study-jam",
    title: "Android Study Jam",
    date: "Sep 5, 2026",
    tag: "Workshop",
    color: "var(--accent-green)",
    desc: "Hands-on Jetpack Compose workshop, beginner friendly.",
  },
  {
    id: "cloud-study-jam",
    title: "Cloud Study Jam",
    date: "Sep 19, 2026",
    tag: "Workshop",
    color: "var(--accent-red)",
    desc: "Deploy your first app on Google Cloud, guided end-to-end.",
  },
] as const;

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
    q: "Who can join GDG on Campus RIT Roorkee?",
    a: "Any student at RIT Roorkee, regardless of branch or year. No prior coding experience required — we run beginner-friendly tracks alongside advanced ones.",
  },
  {
    q: "Is there a membership fee?",
    a: "No. Membership is free. Some in-person events may have limited seats, first come first served.",
  },
  {
    q: "How do I join the core team?",
    a: "We open core team recruitment at the start of each academic year. Follow our socials or check the Events page for announcements.",
  },
  {
    q: "Do I get a certificate for attending events?",
    a: "Yes, certificates are issued for workshops and study jams and appear in your student dashboard after attendance is marked.",
  },
] as const;
