"use client";

import { Container } from "@/components/container";
import { useState } from "react";
import { Hero } from "@/components/hero";
import { GridBackground } from "@/components/dots-bg";
import { MainNavbar } from "@/components/main-navbar";

const Home: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <>
      <MainNavbar />
      <Container className="flex items-center justify-center min-h-screen pt-16 relative overflow-hidden font-sans">
        <GridBackground />

        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/30 rounded-full blur-[100px] opacity-30" />

        <Hero onGetStarted={handleClick} loading={loading} />
      </Container>

      <section className="w-full h-screen flex items-center justify-center">
        <h1>Hello</h1>
      </section>
    </>
  );
};

export default Home;
