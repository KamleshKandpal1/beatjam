import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Youtube, ThumbsUp, ThumbsDown, Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";

interface VideoQueueProps {
  queue: {
    id: string;
    type: Boolean;
    url: string;
    extractedId: string;
    title: string;
    smallImg: string;
    bigImg: string;
    upvotes: number;
    userId: string;
    user: {
      id: string;
      email: string;
      provider: string;
    };
  }[];
  upVote: (streamId: string, index: number) => void;
  downVote: (streamId: string, index: number) => void;
  getQueue: () => Promise<void>;
}

export function VideoQueue({
  queue,
  upVote,
  downVote,
  getQueue,
}: VideoQueueProps) {
  const [sortedQueue, setSortedQueue] = useState([...queue]);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchQueue = async () => {
      setLoading(true); // Start loading
      await getQueue(); // Fetch queue data
      setLoading(false); // Stop loading
    };
    fetchQueue();
  }, []);

  // Sync sortedQueue when queue updates
  useEffect(() => {
    setSortedQueue([...queue].sort((a, b) => b.upvotes - a.upvotes));
  }, [queue]);

  const handleVote = (index: number, increment: number) => {
    setSortedQueue((prevQueue) => {
      const updatedQueue = [...prevQueue];
      updatedQueue[index] = {
        ...updatedQueue[index],
        upvotes: updatedQueue[index].upvotes + increment,
      };
      return updatedQueue.sort((a, b) => b.upvotes - a.upvotes);
    });
  };

  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const deleteStream = async (streamId: string) => {
    try {
      await axios.delete(`/api/streams/${streamId}`);
      toast.success("Stream deleted successfully!");
      getQueue();
    } catch (error) {
      console.log("Error deleting stream", error);
      toast.error("Error deleting stream");
    }
  };

  return (
    <Card className="p-6 backdrop-blur-sm bg-white/10 border-0 shadow-xl">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2 text-white">
          <Youtube className="w-8 h-8 text-violet-500" />
          Queue
        </h2>

        {loading ? (
          // Show skeleton loader while fetching
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="p-4 bg-white/20 border-0 rounded-lg animate-pulse flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-gray-300 w-24 h-18 rounded-md"></div>
                  <div className="bg-gray-300 h-4 w-40 rounded"></div>
                </div>
                <div className="flex gap-2">
                  <div className="bg-gray-300 h-8 w-8 rounded-full"></div>
                  <div className="bg-gray-300 h-8 w-8 rounded-full"></div>
                  {/* <div className="bg-gray-300 h-8 w-8 rounded-full"></div> */}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3 w-full h-[350px] p-2 overflow-hidden overflow-y-scroll scrollbar-none">
            {sortedQueue.map((video, index) => (
              <Card
                key={video.id}
                className="p-2 sm:p-4 hover:shadow-lg transition-all duration-300 bg-white/20 border-0"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex flex-col sm:flex-row w-full sm:items-center gap-4">
                    <div className="overflow-hidden rounded-md shadow-sm hidden sm:block">
                      <Image
                        src={video.smallImg}
                        alt="Video thumbnail"
                        width={96}
                        height={72}
                        className="w-24 h-18 object-cover transform hover:scale-105 transition-transform duration-300 cursor-pointer"
                      />
                    </div>
                    <span className="font-medium text-slate-500 text-sm md:text-base">
                      {video.title}
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-2 ">
                    <span className="font-bold w-12 md:text-center text-slate-500 text-lg flex gap-1">
                      {video.upvotes}{" "}
                      <span className="block sm:hidden">Votes</span>
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          upVote(video.id, index);
                          handleVote(index, 1);
                        }}
                        className="bg-green-500/20 hover:bg-green-500/40 text-white"
                      >
                        <ThumbsUp />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          downVote(video.id, index);
                          handleVote(index, -1);
                        }}
                        className="bg-red-500/20 hover:bg-red-500/40 text-white"
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                      {video.user?.email === userEmail && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => deleteStream(video.id)}
                          className="bg-red-500/20 hover:bg-red-500/40 text-white hover:text-red-500"
                        >
                          <Trash2Icon />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            {sortedQueue.length === 0 && (
              <div className="text-center py-8 text-white/80">
                No videos in queue. Add some!
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
