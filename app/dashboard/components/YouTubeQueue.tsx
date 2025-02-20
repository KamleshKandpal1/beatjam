"use client";

import { useCallback, useEffect, useState } from "react";
import { CurrentVideo } from "./CurrentVideo";
import { VideoSubmissionForm } from "./VideoSubmissionForm";
import { VideoQueue } from "./VideoQueue";
import { generateShareableLink, getYouTubeVideoId } from "@/lib/utils";
import bg from "../../img/Hero-Bg2.jpg";
import { ShareButton } from "./ShareButton";
import axios from "axios";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
export default function YouTubeQueue() {
  const [videoUrl, setVideoUrl] = useState("");
  const [currentVideo, setCurrentVideo] = useState("");
  const [queue, setQueue] = useState<
    {
      id: string;
      type: boolean;
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
    }[]
  >([]);
  const [previewId, setPreviewId] = useState("");
  const session = useSession();
  const userEmail = session?.data?.user?.email;
  const [loading, setLoading] = useState(false);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setVideoUrl(url);
    setPreviewId(getYouTubeVideoId(url));
  };

  // Add youtube url to queue
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!videoUrl.trim()) return toast.error("Please enter a valid URL");

      if (!userEmail) {
        return toast.error("User email not found. Please login again.");
      }
      setLoading(true);
      try {
        const response = await axios.post(`/api/streams`, {
          url: videoUrl,
          email: userEmail,
        });

        if (response.status === 200) {
          toast.success("Video added to queue!");

          setVideoUrl("");
          setPreviewId("");
          getQueue(); // Fetch updated queue only once
        } else {
          toast.error("Error adding to queue!");
        }
      } catch (error) {
        console.error("Error adding video:", error);
      } finally {
        setLoading(false);
      }
    },
    [videoUrl, userEmail]
  ); // Dependencies

  // get data for queue
  const getQueue = useCallback(async () => {
    if (!userEmail) return; // Ensure userEmail is available
    try {
      const response = await axios.get(`/api/streams`, {
        params: {
          email: userEmail,
        },
      });
      // console.log(response);
      if (response.status === 200) {
        setQueue(response.data.streams);
        setCurrentVideo(response?.data?.streams[0]?.extractedId);
        // console.log(response.data.streams[0].upvotes);
      }
    } catch (error) {
      console.error("Error fetching streams:", error);
    }
  }, [userEmail]);

  useEffect(() => {
    if (userEmail) {
      getQueue(); // Fetch immediately

      const interval = setInterval(() => {
        getQueue();
        // console.log(queue);
      }, 300000); // Fetch every 5 seconds instead of every second

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [userEmail, getQueue]);

  // Api Calls for Voting Starts from here
  const upVote = async (streamId: string) => {
    try {
      // Call the API
      await axios.post(`/api/streams/upvotes`, { streamId });
      toast.success("Upvoted Successfully");
      getQueue();
    } catch (error) {
      console.error("Error upvoting:", error);

      // alert("Failed to upvote. Please try again.");
    }
  };

  const downVote = async (streamId: string, index: number) => {
    try {
      // Call the API
      await axios.post(`/api/streams/downvotes`, { streamId });
      toast.success("Downvoted Successfully");
      getQueue();
    } catch (error) {
      console.error("Error downvoting:", error);
      alert("Failed to downvote. Please try again.");
    }
  };

  const handleVote = (index: number, increment: number) => {
    setQueue((prevQueue) => {
      const newQueue = [...prevQueue];
      newQueue[index] = {
        ...newQueue[index],
        upvotes: newQueue[index].upvotes + increment,
      };
      newQueue.sort((a, b) => b.upvotes - a.upvotes);
      return newQueue;
    });
  };

  const handleShare = async () => {
    if (!currentVideo) {
      return toast.error("No video to share!");
    }
    const shareableLink = generateShareableLink(currentVideo);

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out my YouTube Queue!",
          text: "I've created an awesome playlist. Check it out!",
          url: shareableLink,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(shareableLink).then(
        () => {
          toast.success("Link copied to clipboard!");
        },
        (err) => {
          console.error("Could not copy text: ", err);
          toast.error("Failed to copy link!");
        }
      );
    }
  };

  return (
    <div
      className="relative bg-cover bg-center bg-no-repeat min-h-screen"
      style={{
        backgroundImage: `url(${bg.src})`,
      }}
    >
      <div className="container mx-auto p-4 space-y-8 relative">
        {/* Header */}
        <div className="text-center space-y-2 pt-6 flex items-center justify-between">
          <div></div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Music Queue
            </h1>
            <p className="text-white/80">Vote for the next song to be played</p>
          </div>
          <div>
            <ShareButton onShare={handleShare} />
          </div>
        </div>

        <div className="md:grid gap-8 md:grid-cols-2 flex flex-col-reverse">
          <CurrentVideo currentVideo={currentVideo} />
          <VideoSubmissionForm
            videoUrl={videoUrl}
            previewId={previewId}
            handleUrlChange={handleUrlChange}
            handleSubmit={handleSubmit}
            loading={loading}
          />
        </div>

        <VideoQueue
          queue={queue}
          // handleVote={handleVote}
          upVote={upVote}
          downVote={downVote}
          getQueue={getQueue}
        />
      </div>
    </div>
  );
}
