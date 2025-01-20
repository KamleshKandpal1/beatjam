import { ReactNode } from "react";
import { Users, Music, Play } from "lucide-react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg text-center">
      <div className="inline-block mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

export function Features() {
  return (
    <section id="features" className="bg-gray-900 py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          Why Creators Love Beat-Jam
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Users className="h-12 w-12 text-purple-400" />}
            title="Boost Engagement"
            description="Let your fans feel more connected by influencing your stream's soundtrack."
          />
          <FeatureCard
            icon={<Music className="h-12 w-12 text-purple-400" />}
            title="Endless Variety"
            description="Access a vast library of tracks to keep your content fresh and exciting."
          />
          <FeatureCard
            icon={<Play className="h-12 w-12 text-purple-400" />}
            title="Easy Integration"
            description="Seamlessly integrate with popular streaming platforms and music services."
          />
        </div>
      </div>
    </section>
  );
}
