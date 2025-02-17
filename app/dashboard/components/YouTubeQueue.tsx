"use client";

import { useCallback, useEffect, useState } from "react";
import { CurrentVideo } from "./CurrentVideo";
import { VideoSubmissionForm } from "./VideoSubmissionForm";
import { VideoQueue } from "./VideoQueue";
// import { generateShareableLink } from "@/lib/utils";
// import bg from "../img/Hero-Bg1.jpg";
import bg from "../../img/Hero-Bg2.jpg";
// import { ShareButton } from "./ShareButton";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
export default function YouTubeQueue() {
  const [videoUrl, setVideoUrl] = useState("");
  const [currentVideo, setCurrentVideo] = useState("");
  const [queue, setQueue] = useState<
    {
      id: string;
      upvotes: number;
      url: string;
      smallImg: string;
      title: string;
    }[]
  >([]);
  const [previewId, setPreviewId] = useState("");
  const session = useSession();
  const userEmail = session?.data?.user?.email;

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setVideoUrl(url);
    // setPreviewId(getYouTubeVideoId(url));
  };

  // Add youtube url to queue
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!videoUrl) {
        // alert("Invalid YouTube URL");
        toast({
          title: "Invalid YouTube URL",
          // description: "Friday, February 10, 2023 at 5:57 PM",
        });
        return;
      }

      try {
        const response = await axios.post(`/api/streams`, {
          url: videoUrl,
          email: userEmail,
        });

        if (response.status === 200) {
          // alert("Video added to queue!");
          toast({
            title: "Video added to queue.",
            // description: "Friday, February 10, 2023 at 5:57 PM",
          });
          setVideoUrl("");
          setPreviewId("");
          getQueue(); // Fetch updated queue only once
        } else {
          // alert("Failed to add video.");
          toast({
            title: "Failed to add video.",
            // description: "Friday, February 10, 2023 at 5:57 PM",
          });
        }
      } catch (error) {
        console.error("Error adding video:", error);
      }
    },
    [videoUrl, userEmail]
  ); // Dependencies

  // get data for queue
  const getQueue = useCallback(async () => {
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
      }, 30000); // Fetch every 5 seconds instead of every second

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [userEmail, getQueue]);

  // Api Calls for Voting Starts from here
  const upVote = async (streamId: string, index: number) => {
    try {
      // Optimistically update the UI
      // handleVote(index, 1);

      // Call the API
      await axios.post(`/api/streams/upvotes`, { streamId });

      // Fetch the latest queue from the backend for accuracy
      await getQueue();
    } catch (error) {
      console.error("Error upvoting:", error);
      // alert("Failed to upvote. Please try again.");
      toast({
        title: "Failed to upvote. Please try again.",
        // description: "Friday, February 10, 2023 at 5:57 PM",
      });

      // Revert UI update if API fails
      handleVote(index, -1);
    }
  };

  const downVote = async (streamId: string, index: number) => {
    try {
      // Optimistically update the UI
      // handleVote(index, -1);

      // Call the API
      await axios.post(`/api/streams/downvotes`, { streamId });

      // Fetch the latest queue from the backend for accuracy
      await getQueue();
    } catch (error) {
      console.error("Error downvoting:", error);
      alert("Failed to downvote. Please try again.");
      toast({
        title: "Failed to downvote. Please try again.",
        description: "Friday, February 10, 2023 at 5:57 PM",
      });

      // Revert UI update if API fails
      handleVote(index, 1);
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

  // const handleShare = async () => {
  //   const shareableLink = generateShareableLink(currentVideo);

  //   if (navigator.share) {
  //     try {
  //       await navigator.share({
  //         title: "Check out my YouTube Queue!",
  //         text: "I've created an awesome playlist. Check it out!",
  //         url: shareableLink,
  //       });
  //     } catch (error) {
  //       console.error("Error sharing:", error);
  //     }
  //   } else {
  //     // Fallback to copying to clipboard
  //     navigator.clipboard.writeText(shareableLink).then(
  //       () => {
  //         alert("Link copied to clipboard!");
  // toast({
  //   title: "Link copied to clipboard.",
  //   description: "Friday, February 10, 2023 at 5:57 PM",
  // })
  //       },
  //       (err) => {
  //         console.error("Could not copy text: ", err);
  //       }
  //     );
  //   }
  // };

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
          <div>{/* <ShareButton onShare={handleShare} /> */}</div>
        </div>

        <div className="md:grid gap-8 md:grid-cols-2 flex flex-col-reverse">
          <CurrentVideo currentVideo={currentVideo} />
          <VideoSubmissionForm
            videoUrl={videoUrl}
            previewId={previewId}
            handleUrlChange={handleUrlChange}
            handleSubmit={handleSubmit}
          />
        </div>

        <VideoQueue
          queue={queue}
          // handleVote={handleVote}
          upVote={upVote}
          downVote={downVote}
        />
      </div>
    </div>
  );
}
