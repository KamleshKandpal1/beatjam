import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export function CTA() {
  return (
    <section className="bg-purple-900 py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Revolutionize Your Streams?
        </h2>
        <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
          Join thousands of creators who are taking their audience engagement to
          the next level with Beat-Jam.
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
          <Button
            size="lg"
            className="bg-white text-purple-900 hover:bg-gray-200"
          >
            Start Your Free Trial
          </Button>
          <Button
            size="lg"
            className="border-white text-white hover:bg-purple-800"
          >
            Watch Demo <Play className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
