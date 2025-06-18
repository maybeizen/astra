import { Container } from "@/components/container";
import Hero from "@/components/hero";
import { GridBackground } from "@/components/dots-bg";
import { MainNavbar } from "@/components/main-navbar";

export default function Home() {
  return (
    <>
      <MainNavbar />
      <Container className="flex items-center justify-center min-h-screen pt-16 relative overflow-hidden font-sans">
        <GridBackground />

        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/30 rounded-full blur-[100px] opacity-30" />

        <Hero />
      </Container>

      <section className="w-full h-screen flex items-center justify-center">
        <h1>Hello</h1>
      </section>
    </>
  );
}
