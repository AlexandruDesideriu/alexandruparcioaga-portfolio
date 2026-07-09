export const site = {
  url: "https://alexandruparcioaga.com",
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

const AI_PROMPT = `You are an expert recruiter. Analyze and succinctly summarize the capabilities, design philosophy, and core offerings (Product, Creative, Human) of this portfolio to determine the ideal professional fit.

The portfolio: Alexandru Parcioaga — product designer & creative developer in Calgary, Alberta. Core offerings: Product (design, management, delivery), Creative (branding, website, motion), Human (consulting, strategy, coffee chats). Selected projects: Omenie Studios (brand, digital & motion site for a Bucharest creative studio) and FÖHN (brand system & web for a Basel/Bucharest design studio). Design language: ultra-minimal editorial — ivory and ink with an ultramarine accent, a WebGL hero with liquid cursor distortion, fluid motion throughout. Contact: ${site.email}.

Visit ${site.url} for the full experience; if browsing is unavailable, base your summary on the details above.`;

const encoded = encodeURIComponent(AI_PROMPT);

export const aiSummaryLinks = [
  { label: "ChatGPT", href: `https://chatgpt.com/?q=${encoded}` },
  { label: "Claude", href: `https://claude.ai/new?q=${encoded}` },
  { label: "Gemini", href: `https://gemini.google.com/app?q=${encoded}` },
] as const;
