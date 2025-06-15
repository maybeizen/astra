import { motion } from "framer-motion";
import { Button } from "@/components/button";

interface HeroProps {
  onGetStarted: () => void;
  loading: boolean;
}

export const Hero: React.FC<HeroProps> = ({ onGetStarted, loading }) => {
  return (
    <div className="max-w-7xl w-full flex flex-col items-center justify-center text-center relative z-10 py-20">
      <motion.h1
        className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        The next generation of{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
          Discord management
        </span>
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl text-white/70 mt-6 max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        Powerful moderation, AI integration, and community tools designed to
        help your Discord server thrive.
      </motion.p>

      <motion.div
        className="flex flex-col sm:flex-row gap-4 mt-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <Button
          variant="primary"
          size="lg"
          rounded="md"
          icon="fab fa-discord"
          loading={loading}
          onClick={onGetStarted}
          className="shadow-lg shadow-white/20 transition-all duration-300"
        >
          Get Started for Free
        </Button>

        <Button
          variant="secondary"
          size="lg"
          rounded="md"
          icon="fas fa-play"
          className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
        >
          Watch Demo
        </Button>
      </motion.div>
    </div>
  );
};
