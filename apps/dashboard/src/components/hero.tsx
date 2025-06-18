"use client";

import { Button } from "@/components/button";

export default function Hero() {
  return (
    <div className="max-w-7xl w-full flex flex-col items-center justify-center text-center relative z-10 py-20">
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white max-w-3xl">
        The next generation of{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
          Discord management
        </span>
      </h1>

      <p className="text-lg md:text-xl text-white/70 mt-6 max-w-2xl">
        Powerful moderation, AI integration, and community tools designed to
        help your Discord server thrive.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mt-10">
        <Button
          variant="primary"
          size="lg"
          rounded="md"
          icon="fab fa-discord"
          onClick={() => {}}
          className="shadow-lg shadow-white/20 transition-all duration-300"
        >
          Get Started for Free
        </Button>

        <Button variant="glass" size="lg" rounded="md" icon="fas fa-play">
          Learn More
        </Button>
      </div>
    </div>
  );
}
