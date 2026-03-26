import { useState, useEffect } from "react";
import { X, ThumbsUp, ThumbsDown, Meh } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const YouthPulse = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    // Show popup after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleVote = (option: string) => {
    console.log("Youth vote submitted:", option);
    // TODO: Trigger AI aggregation in Civic Watch
    // This would update aggregated signals with youth sentiment data
    setHasVoted(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 2000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="shadow-lg border">
        <CardHeader className="relative pb-2">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1 h-6 w-6"
            onClick={() => setIsVisible(false)}
          >
            <X size={16} />
          </Button>
          <CardTitle className="text-sm text-center text-black">Citizen Pulse</CardTitle>
          <p className="text-xs text-center text-gray-600">
            How are you feeling about the upcoming election?
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          {hasVoted ? (
            <div className="text-center py-2">
              <p className="text-green-600 text-sm font-medium">Thank you!</p>
            </div>
          ) : (
            <div className="flex justify-center gap-2 py-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVote("positive")}
                className="flex flex-col items-center gap-1 p-2 h-auto"
              >
                <ThumbsUp size={16} className="text-green-600" />
                <span className="text-xs">Positive</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVote("neutral")}
                className="flex flex-col items-center gap-1 p-2 h-auto"
              >
                <Meh size={16} className="text-yellow-600" />
                <span className="text-xs">Neutral</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVote("negative")}
                className="flex flex-col items-center gap-1 p-2 h-auto"
              >
                <ThumbsDown size={16} className="text-red-600" />
                <span className="text-xs">Concerned</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default YouthPulse;