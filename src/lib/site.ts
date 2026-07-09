export const site = {
  name: "Alexandru Parcioaga",
  firstName: "ALEXANDRU",
  lastName: "PARCIOAGA",
  tagline: "Product. Creative. Human.",
  role: "Product Designer & Creative Developer",
  location: "Calgary, Alberta, Canada",
  timezone: "America/Calgary",
  email: "parc.alexandru@gmail.com",
  socials: {
    linkedin: "https://www.linkedin.com/in/parcioagaalexandru",
    instagram: "https://www.instagram.com/alexandruparcioaga",
  },
  year: new Date().getFullYear(),
} as const;

const AI_PROMPT =
  "You are an expert recruiter. Analyze and succinctly summarize the capabilities, design philosophy, and core offerings (Product, Creative, Human) of this portfolio website to determine the ideal professional fit.";

const encoded = encodeURIComponent(AI_PROMPT);

export const aiSummaryLinks = [
  { label: "ChatGPT", href: `https://chatgpt.com/?q=${encoded}` },
  { label: "Claude", href: `https://claude.ai/new?q=${encoded}` },
  { label: "Gemini", href: `https://gemini.google.com/app?q=${encoded}` },
] as const;
