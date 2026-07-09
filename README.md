# Alexandru Parcioaga — Portfolio

Personal portfolio. Ultra-minimal editorial design on an ivory canvas with a
WebGL hero: the name and a spinning "PRODUCT ✦ CREATIVE ✦ HUMAN" text drum,
warped by a liquid mouse-trail distortion shader with RGB chromatic
aberration.

**Product. Creative. Human.**

## Stack

- [Next.js 15](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) + drei — WebGL hero
- Custom GLSL post-processing pass — liquid distortion + RGB shift
- [GSAP](https://gsap.com) + [Lenis](https://lenis.darkroom.engineering) — smooth scroll
- [Framer Motion](https://www.framer.com/motion/) — reveals, magnetic cursor & links
- Typeface: [Familjen Grotesk](https://fonts.google.com/specimen/Familjen+Grotesk) (self-hosted)

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production

```bash
npm run build
npm start
```

## Deployment

Push to GitHub and import the repository at
[vercel.com/new](https://vercel.com/new) — Next.js is auto-detected, no
configuration needed.

## Editing content

All personal data (name, role, email, social URLs, AI-summary prompt) lives
in [`src/lib/site.ts`](src/lib/site.ts).
