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
  { value: "20+", label: "Events hosted" },
  { value: "7", label: "Core team members" },
  { value: "50+", label: "Projects built" },
] as const;

export const EVENTS = [
  {
    id: "antigravity",
    title: "Exploring Antigravity: Hands-On Experiments",
    date: "May 15, 2026",
    type: "Workshop",
    desc: "Join us for an exciting journey into the realm of advanced physics and experimental engineering at the \"Exploring Antigravity: Hands-On Experiments\" event! This hands-on workshop is designed to spark your curiosity and challenge your understanding of gravity, propulsion, and the limits of modern science.",
    color: "var(--accent-blue)",
  },
  {
    id: "vibecon26",
    title: "VibeCon '26 x GDGoC RIT : The AI Creator Showcase",
    date: "May 13, 2026",
    type: "Showcase",
    desc: "Get ready for the ultimate fusion of creativity and technology! VibeCon '26, in collaboration with GDGoC RIT, brings you the AI Creator Showcase—an exclusive, high-energy event designed for tech enthusiasts, digital creators, developers, and AI innovators.",
    color: "var(--accent-red)",
  },
  {
    id: "solutions-challenge",
    title: "Everything about Solutions Challenge 2026",
    date: "Apr 15, 2026",
    type: "Info Session",
    desc: "Are you ready to use tech to build a better world? Join us for \"Everything About Solutions Challenge 2026\" - an interactive session designed to guide you through Google's annual global hackathon.",
    color: "var(--accent-green)",
  },
  {
    id: "ctf-2026",
    title: "Capture the Flag (CTF) 2026",
    date: "Mar 26, 2026",
    type: "Competition",
    desc: "Gear up for the ultimate test of cybersecurity skills! GDG on Campus RIT presents Capture the Flag (CTF) 2026—a thrilling, fast-paced hacking competition where you'll solve real-world challenges in cryptography, reverse engineering, web security, and forensics.",
    color: "var(--accent-yellow)",
  },
  {
    id: "gemini-thon",
    title: "Gemini-Thon: Exploring Use Cases of Google Gemini",
    date: "Jan 3, 2026",
    type: "Hackathon",
    desc: "Are you ready to explore the future of AI? GDG on Campus RIT invites you to Gemini-Thon, a hands-on event dedicated to exploring the powerful capabilities and use cases of Google Gemini!",
    color: "var(--accent-blue)",
  },
  {
    id: "elevate-firebase",
    title: "Elevate Your Project: Firebase & Gemini at Glance",
    date: "Dec 20, 2025",
    type: "Workshop",
    desc: "Want to make a successful submission and secure a top spot in the HackSprint? Join us for an exclusive Info Session where we will deep-dive into the essential tools that can take your project from idea to impactful reality: Firebase and Gemini!",
    color: "var(--accent-yellow)",
  },
  {
    id: "pre-hackathon",
    title: "Pre-Hackathon Info Session - Workshop 01",
    date: "Dec 18, 2025",
    type: "Workshop",
    desc: "Hi Innovators! Are you ready to innovate, build, and compete? Join us for an enlightening Pre-Hackathon Info Session! Get exclusive insights into the rules of the hackathon and the best ways to prepare your projects for success.",
    color: "var(--accent-green)",
  },
  {
    id: "cloud-study-jam-2",
    title: "Cloud Study Jam 2025 Session 2 [Offline]",
    date: "Nov 17, 2025",
    type: "Study Jam",
    desc: "We're breaking down the basics of cloud computing in a fun and simple way. We've got the best tips and tricks to get the hang of Cloud Jam Study. It's all about understanding, learning, and stepping confidently into the tech future together.",
    color: "var(--accent-blue)",
  },
  {
    id: "cloud-study-jam-1",
    title: "Cloud Study Jam 2025 Kickstart",
    date: "Nov 3, 2025",
    type: "Study Jam",
    desc: "Hey there! Ready to kick off your cloud journey with the \"Cloud Jam Study 2025 Kickstart\"? We're breaking down the basics of cloud computing in a fun and simple way.",
    color: "var(--accent-red)",
  },
  {
    id: "sih-2025",
    title: "SIH 2025 Masterclass: From Idea to Grand Finale",
    date: "Sep 17, 2025",
    type: "Masterclass",
    desc: "Are you ready to innovate and make an impact on a national stage? This isn't just another info session. It's a strategic deep-dive designed to give you a definitive, expert-led session to unlock the secrets to a winning SIH journey.",
    color: "var(--accent-yellow)",
  },
  {
    id: "google-wizard",
    title: "Google Wizard Quiz Challenge",
    date: "Sep 15, 2025",
    type: "Competition",
    desc: "On the Eve of Engineers' Day 2025 We bring you the Google Wizardry Quiz Challenge. Calling all engineers and tech enthusiasts! This Engineers' Day, we're bringing you the ultimate tech showdown.",
    color: "var(--accent-green)",
  },
  {
    id: "launch-orientation",
    title: "GDG on Campus Chapter Launch & Orientation",
    date: "Sep 8, 2025",
    type: "Info Session",
    desc: "Join us for the grand launch of the Google Developer Group on Campus chapter at RIT Roorkee! This orientation event marks the beginning of an exciting journey into the world of Google's cutting-edge technologies and innovations.",
    color: "var(--accent-blue)",
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
    question: "What is GDG and GDGoC RIT?",
    answer: "Google Developer Groups (GDG) is a global community of developers who are interested in Google's developer technology. GDGoC (GDG on Campus) RIT is the official university chapter for Roorkee Institute of Technology. We host tech events, workshops, and hackathons to help students learn, build projects, and grow together.",
  },
  {
    question: "Who can join GDGoC RIT?",
    answer: "Anyone! Whether you are a first-year student just starting to code, or a final-year student building complex systems, GDGoC is open to all students from all branches. No prior coding experience is required for most of our introductory events.",
  },
  {
    question: "How do I become a member?",
    answer: "It's completely free! Simply click the 'Join us' button on our website, create a profile on the official GDG Community platform, and RSVP to our upcoming events.",
  },
  {
    question: "What kind of events do you host?",
    answer: "We host a wide variety of events including hands-on coding workshops, Study Jams (focused on Cloud, AI, and Android), expert tech talks, hackathons, and networking sessions.",
  },
  {
    question: "Are the events free to attend?",
    answer: "Yes! All GDGoC RIT events, workshops, and study jams are 100% free for students.",
  },
] as const;
