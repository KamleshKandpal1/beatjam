import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Let Your Fans Set the Beat
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-300">
          Engage your audience like never before. Beat-Jam lets your fans choose
          the music for your stream, creating a truly interactive experience.
        </p>
        <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
          Get Started <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  );
}
