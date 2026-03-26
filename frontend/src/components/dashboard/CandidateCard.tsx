import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface Candidate {
  id: string;
  name: string;
  position: string;
  party: string;
  manifesto: string;
  image: string;
}

interface CandidateCardProps {
  candidate: Candidate;
  onViewDetails: (candidate: Candidate) => void;
  onCompare: (candidate: Candidate) => void;
  selected?: boolean;
}

const CandidateCard = ({ candidate, onViewDetails, onCompare, selected = false }: CandidateCardProps) => {
  return (
    <Card className={`h-full ${selected ? "border-2 border-red-600" : ""}`}>
      <CardHeader className="text-center">
        <img
          src={candidate.image}
          alt={candidate.name}
          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
        />
        <h3 className="text-lg font-semibold text-black">{candidate.name}</h3>
        <p className="text-sm text-gray-600">{candidate.position}</p>
        <p className="text-sm text-red-600 font-medium">{candidate.party}</p>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 line-clamp-2">{candidate.manifesto}</p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => onViewDetails(candidate)}
          className="flex-1"
        >
          View Details
        </Button>
        <Button
          onClick={() => onCompare(candidate)}
          className={`flex-1 ${selected ? "bg-gray-400 hover:bg-gray-500" : "bg-red-600 hover:bg-red-700"}`}
        >
          {selected ? "Selected" : "Compare"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CandidateCard;