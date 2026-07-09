import About from "@/components/About";
import AISummary from "@/components/AISummary";
import Capabilities from "@/components/Capabilities";
import Cursor from "@/components/Cursor";
import Footer from "@/components/Footer";
import Grain from "@/components/Grain";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import Preloader from "@/components/Preloader";
import Projects from "@/components/Projects";
import SmoothScroll from "@/components/SmoothScroll";

export default function Home() {
  return (
    <>
      <Preloader />
      <SmoothScroll />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Capabilities />
        <Projects />
        <About />
      </main>
      <Footer />
      <AISummary />
      <Grain />
    </>
  );
}
