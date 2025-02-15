"use client";

import { useEffect, useState } from "react";
import { CurrentVideo } from "./CurrentVideo";
import { VideoSubmissionForm } from "./VideoSubmissionForm";
import { VideoQueue } from "./VideoQueue";
import { generateShareableLink } from "@/lib/utils";
// import bg from "../img/Hero-Bg1.jpg";
import bg from "../../img/Hero-Bg2.jpg";
import { ShareButton } from "./ShareButton";
import axios from "axios";
import { useSession } from "next-auth/react";
export default function YouTubeQueue() {
  const [videoUrl, setVideoUrl] = useState("");
  const [currentVideo, setCurrentVideo] = useState("");
  const [queue, setQueue] = useState<
    {
      id: string;
      votes: number;
      url: string;
      smallImg: string;
      title: string;
    }[]
  >([]);
  const [previewId, setPreviewId] = useState("");
  const session = useSession();
  const userEmail = session?.data?.user?.email;

  // const REFRESH_INTERVAL_MS = 10 * 1000;
  // refresh-Stream
  // const refreshStream = async () => {
  //   const res = await axios.get(`/api/streams/myQueue`);
  //   // console.log(res);
  // };

  // useEffect(() => {
  //   refreshStream();
  //   // const interval = setInterval(() => {}, REFRESH_INTERVAL_MS);
  // }, []);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setVideoUrl(url);
    // setPreviewId(getYouTubeVideoId(url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl) {
      alert("Invalid Youtube Url");
      return;
    }

    try {
      const response = await axios.post(
        `/api/streams`,
        {
          url: videoUrl,
          email: userEmail, // Replace with the actual user's email
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response);

      if (response.status === 200) {
        alert("Video added to queue!");
        setVideoUrl("");
        setPreviewId("");
      } else {
        alert("Failed to add video.");
      }
    } catch (error) {
      console.error("Error adding video:", error);
      // alert("An error occurred. Please try again.");
    }
  };

  const getQueue = async () => {
    try {
      const response = await axios.get(`/api/streams`, {
        params: {
          email: userEmail,
        },
      });
      console.log(response);
      setCurrentVideo(response.data.streams[0].extractedId);
      if (response.status === 200) {
        setQueue(response.data.streams);
      }
    } catch (error) {
      console.error("Error fetching streams:", error);
    }
  };
  const REFRESH_INTERVAL_MS = 10 * 1000;

  useEffect(() => {
    const intervals = setInterval(() => {
      if (userEmail) {
        getQueue();
      }
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(intervals);
  }, [userEmail]);

  const handleVote = async (index: number, increment: number) => {
    const newQueue = [...queue];
    newQueue[index].votes += increment;
    newQueue.sort((a, b) => b.votes - a.votes);
    setQueue(newQueue);
    const res = await axios.post(`/api/streams/upvotes`);
    // console.log(res);
  };

  const handleShare = async () => {
    const shareableLink = generateShareableLink(queue);

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
          alert("Link copied to clipboard!");
        },
        (err) => {
          console.error("Could not copy text: ", err);
        }
      );
    }
  };

  return (
    // <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
    <div
      className="relative bg-cover bg-center bg-no-repeat min-h-screen"
      style={{
        backgroundImage: `url(${bg.src})`,
      }}
    >
      <div className="container mx-auto p-4 space-y-8 relative">
        {/* Decorative elements */}
        {/* <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply blur-2xl opacity-70 animate-blob" />
          <div className="absolute -top-4 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply blur-2xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply blur-2xl opacity-70 animate-blob animation-delay-4000" />
        </div> */}

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
          />
        </div>

        <VideoQueue queue={queue} handleVote={handleVote} />
      </div>
    </div>
  );
}
