import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Candidate {
  id: string;
  name: string;
  position: string;
  party: string;
  manifesto: string;
  image: string;
}

interface CandidateModalProps {
  candidate: Candidate;
  onCompare?: (candidate: Candidate) => void;
}

const CandidateModal = ({ candidate, onCompare }: CandidateModalProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <img
          src={candidate.image}
          alt={candidate.name}
          className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
        />
        <h2 className="text-2xl font-bold text-black">{candidate.name}</h2>
        <p className="text-lg text-gray-600">{candidate.position}</p>
        <Badge className="bg-red-600 text-white">{candidate.party}</Badge>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 text-black">Manifesto</h3>
        <p className="text-gray-700">{candidate.manifesto}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 text-black">AI Insights</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">
            Based on public statements and voting records, this candidate has shown strong commitment to {candidate.position.toLowerCase()} initiatives. AI analysis suggests alignment with {candidate.party.toLowerCase()} values.
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={() => onCompare?.(candidate)}>
          Compare
        </Button>
        <Button className="bg-red-600 hover:bg-red-700">
          Report Anonymous Activity
        </Button>
      </div>
    </div>
  );
};

export default CandidateModal;