import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getYouTubeVideoId = (url: string) => {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^/&?\n]+)/
  );
  return match?.[1] || "";
};
export function generateShareableLink(
  queue: { id: string; votes: number; url: string }[]
) {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const queueData = encodeURIComponent(JSON.stringify(queue));
  return `${baseUrl}?queue=${queueData}`;
}
