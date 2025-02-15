import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

interface ShareButtonProps {
  onShare: () => void;
}

export function ShareButton({ onShare }: ShareButtonProps) {
  return (
    <Button
      onClick={onShare}
      className="bg-white/0 hover:bg-white/10 text-violet-500/80 font-semibold py-2 px-4 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2"
    >
      <Share2 className="w-5 h-5" />
      Share Queue
    </Button>
  );
}
