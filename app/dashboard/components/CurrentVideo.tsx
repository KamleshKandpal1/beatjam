import { Card } from "@/components/ui/card";
import { Music2 } from "lucide-react";

interface CurrentVideoProps {
  currentVideo: string;
}

export function CurrentVideo({ currentVideo }: CurrentVideoProps) {
  return (
    <Card className="p-6 backdrop-blur-sm bg-white/10 border-0 shadow-xl">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Music2 className="w-5 h-5 text-white" />
          <h2 className="text-2xl font-bold text-white">Now Playing</h2>
        </div>
        {currentVideo ? (
          <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${currentVideo}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="aspect-video rounded-lg bg-gradient-to-br from-purple-400/50 to-purple-600/50 flex items-center justify-center">
            <p className="text-white/80">No video playing</p>
          </div>
        )}
      </div>
    </Card>
  );
}
