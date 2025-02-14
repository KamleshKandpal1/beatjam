import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Youtube } from "lucide-react";
import type React from "react"; // Added import for React

interface VideoSubmissionFormProps {
  videoUrl: string;
  previewId: string;
  handleUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export function VideoSubmissionForm({
  videoUrl,
  previewId,
  handleUrlChange,
  handleSubmit,
}: VideoSubmissionFormProps) {
  return (
    <Card className="p-6 backdrop-blur-sm bg-white/10 border-0 shadow-xl">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Youtube className="w-5 h-5 text-white" />
          <h2 className="text-2xl font-bold text-white">Add to Queue</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Paste YouTube URL here"
              value={videoUrl}
              onChange={handleUrlChange}
              className="bg-white/20 text-white placeholder-white/50"
            />
            <Button
              type="submit"
              className="bg-violet-500 hover:bg-violet-600 text-white"
            >
              <Youtube className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
          {previewId && (
            <div className="aspect-video rounded-lg overflow-hidden shadow-lg transition-all duration-300">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${previewId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </form>
      </div>
    </Card>
  );
}
