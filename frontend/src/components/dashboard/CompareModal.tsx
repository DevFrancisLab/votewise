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

interface CompareModalProps {
  candidates: Candidate[];
  onClose: () => void;
}

const CompareModal = ({ candidates, onClose }: CompareModalProps) => {
  if (candidates.length !== 2) return null;

  const [candidate1, candidate2] = candidates;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-black">Candidate Comparison</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Candidate 1 */}
        <div className="border rounded-lg p-4">
          <div className="text-center mb-4">
            <img
              src={candidate1.image}
              alt={candidate1.name}
              className="w-24 h-24 rounded-full mx-auto mb-2 object-cover"
            />
            <h3 className="text-lg font-semibold text-black">{candidate1.name}</h3>
            <p className="text-sm text-gray-600">{candidate1.position}</p>
            <Badge className="bg-red-600 text-white">{candidate1.party}</Badge>
          </div>
          <div>
            <h4 className="font-medium mb-2 text-black">Manifesto</h4>
            <p className="text-sm text-gray-700">{candidate1.manifesto}</p>
          </div>
        </div>

        {/* Candidate 2 */}
        <div className="border rounded-lg p-4">
          <div className="text-center mb-4">
            <img
              src={candidate2.image}
              alt={candidate2.name}
              className="w-24 h-24 rounded-full mx-auto mb-2 object-cover"
            />
            <h3 className="text-lg font-semibold text-black">{candidate2.name}</h3>
            <p className="text-sm text-gray-600">{candidate2.position}</p>
            <Badge className="bg-red-600 text-white">{candidate2.party}</Badge>
          </div>
          <div>
            <h4 className="font-medium mb-2 text-black">Manifesto</h4>
            <p className="text-sm text-gray-700">{candidate2.manifesto}</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Button onClick={onClose} className="bg-red-600 hover:bg-red-700">
          Close Comparison
        </Button>
      </div>
    </div>
  );
};

export default CompareModal;