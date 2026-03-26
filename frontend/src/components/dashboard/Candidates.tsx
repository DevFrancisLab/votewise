import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CandidateCard from "./CandidateCard";
import CandidateModal from "./CandidateModal";
import CompareModal from "./CompareModal";

interface Candidate {
  id: string;
  name: string;
  position: string;
  party: string;
  manifesto: string;
  aiScore: number;
  image: string;
}

const mockCandidates: Candidate[] = [
  {
    id: "1",
    name: "Alice Johnson",
    position: "Governor",
    party: "Progressive Party",
    manifesto: "Focus on sustainable development, education, and green infrastructure.",
    aiScore: 87,
    image: "/api/placeholder/150/150",
  },
  {
    id: "2",
    name: "Bob Smith",
    position: "Senator",
    party: "Conservative Alliance",
    manifesto: "Prioritize economic growth, job creation, and public safety.",
    aiScore: 74,
    image: "/api/placeholder/150/150",
  },
  {
    id: "3",
    name: "Carol Davis",
    position: "President",
    party: "Green Initiative",
    manifesto: "Environmental protection, renewable energy, and social programs.",
    aiScore: 91,
    image: "/api/placeholder/150/150",
  },
  {
    id: "4",
    name: "David Muhozi",
    position: "Ward Representative",
    party: "Unity Party",
    manifesto: "Local infrastructure, water access, and community safety.",
    aiScore: 68,
    image: "/api/placeholder/150/150",
  },
  {
    id: "5",
    name: "Emma Karanja",
    position: "County Representative",
    party: "People's Voice",
    manifesto: "Affordable housing, healthcare, and education outreach.",
    aiScore: 82,
    image: "/api/placeholder/150/150",
  },
];

const POSITION_OPTIONS = [
  "All",
  "Ward Representative",
  "County Representative",
  "Governor",
  "Senator",
  "President",
];

const Candidates = () => {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [compareCandidates, setCompareCandidates] = useState<Candidate[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [positionFilter, setPositionFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("aiScore");

  const filteredCandidates = useMemo(() => {
    const filtered = mockCandidates.filter((candidate) => {
      const matchesPosition =
        positionFilter === "All" || candidate.position === positionFilter;
      const matchesSearch = candidate.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPosition && matchesSearch;
    });

    return filtered.sort((a, b) => {
      if (sortOption === "alphaAsc") return a.name.localeCompare(b.name);
      if (sortOption === "alphaDesc") return b.name.localeCompare(a.name);
      return b.aiScore - a.aiScore;
    });
  }, [positionFilter, searchQuery, sortOption]);

  const handleCompare = (candidate: Candidate) => {
    const isSelected = compareCandidates.some((c) => c.id === candidate.id);
    if (isSelected) {
      setCompareCandidates((prev) => prev.filter((c) => c.id !== candidate.id));
      return;
    }
    if (compareCandidates.length >= 2) {
      return;
    }
    setCompareCandidates((prev) => [...prev, candidate]);
    if (compareCandidates.length === 1) {
      setIsCompareOpen(true);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-black">Candidates</h1>
          <p className="text-sm text-gray-600 mt-1">{filteredCandidates.length} candidates matched</p>
        </div>
        {compareCandidates.length > 0 && (
          <Button
            onClick={() => setIsCompareOpen(true)}
            className="bg-red-600 hover:bg-red-700"
          >
            Compare ({compareCandidates.length})
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <div className="w-full">
          <label className="block text-sm font-medium text-black mb-1">Filter by Position</label>
          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            {POSITION_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium text-black mb-1">Search by Name</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidates..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium text-black mb-1">Sort</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <option value="aiScore">AI Score (high to low)</option>
            <option value="alphaAsc">Name (A-Z)</option>
            <option value="alphaDesc">Name (Z-A)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCandidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            selected={compareCandidates.some((c) => c.id === candidate.id)}
            onViewDetails={setSelectedCandidate}
            onCompare={handleCompare}
          />
        ))}
      </div>

      {/* Candidate Details Modal */}
      <Dialog open={!!selectedCandidate} onOpenChange={() => setSelectedCandidate(null)}>
        <DialogContent className="max-w-2xl">
          {selectedCandidate && (
            <CandidateModal candidate={selectedCandidate} onCompare={handleCompare} />
          )}
        </DialogContent>
      </Dialog>

      {/* Compare Modal */}
      <Dialog open={isCompareOpen} onOpenChange={setIsCompareOpen}>
        <DialogContent className="max-w-4xl">
          <CompareModal
            candidates={compareCandidates}
            onClose={() => {
              setCompareCandidates([]);
              setIsCompareOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Candidates;