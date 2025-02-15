import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Youtube, ThumbsUp, ThumbsDown } from "lucide-react";
import Image from "next/image";

interface VideoQueueProps {
  queue: {
    id: string;
    votes: number;
    url: string;
    smallImg: string;
    title: string;
  }[];
  handleVote: (index: number, increment: number) => void;
}

export function VideoQueue({ queue, handleVote }: VideoQueueProps) {
  return (
    <Card className="p-6 backdrop-blur-sm bg-white/10 border-0 shadow-xl">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2 text-white">
          <Youtube className="w-8 h-8 text-violet-500" />
          Queue
        </h2>
        <div className="space-y-3">
          {queue.map((video, index) => (
            <Card
              key={video.id}
              className="p-4 hover:shadow-lg transition-all duration-300 bg-white/20 border-0"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="overflow-hidden rounded-md shadow-sm">
                    <Image
                      src={video?.smallImg}
                      alt="Video thumbnail"
                      width={96}
                      height={72}
                      className="w-24 h-18 object-cover transform hover:scale-105 transition-transform duration-300 cursor-pointer"
                    />
                  </div>
                  <span className="font-medium text-slate-500">
                    {video?.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg w-12 text-center text-white">
                    {video.votes}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleVote(index, 1)}
                    className="bg-green-500/20 hover:bg-green-500/40 text-white"
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleVote(index, -1)}
                    className="bg-red-500/20 hover:bg-red-500/40 text-white"
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          {queue.length === 0 && (
            <div className="text-center py-8 text-white/80">
              No videos in queue. Add some!
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
