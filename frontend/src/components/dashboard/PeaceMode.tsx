import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const PeaceMode = ({ onClose }: { onClose?: () => void }) => {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [report, setReport] = useState("");

  const aggregatedSignals = {
    totalReports: 47,
    activeInvestigations: 12,
    resolvedCases: 35,
    hotspots: ["Downtown District", "University Campus", "Online Forums"],
  };

  const aiInsights = [
    "Increased reports of misinformation in social media campaigns",
    "Peaceful protest monitoring shows 85% compliance with guidelines",
    "AI detects potential escalation risks in 3 districts",
  ];

  const submitReport = () => {
    console.log("Report submitted:", report);
    setReport("");
    setIsReportOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-black">Civic Watch</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-black hover:bg-gray-100"
            >
              <X size={24} />
            </Button>
          </div>

          {/* Aggregated Signals */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4 text-black">Community Signals</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-black">{aggregatedSignals.totalReports}</div>
                <div className="text-sm text-gray-600">Total Reports</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-800">{aggregatedSignals.activeInvestigations}</div>
                <div className="text-sm text-gray-600">Investigating</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-800">{aggregatedSignals.resolvedCases}</div>
                <div className="text-sm text-gray-600">Resolved</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-800">{aggregatedSignals.hotspots.length}</div>
                <div className="text-sm text-gray-600">Hotspots</div>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2 text-black">Active Hotspots:</h3>
              <ul className="list-disc list-inside text-gray-700">
                {aggregatedSignals.hotspots.map((hotspot, index) => (
                  <li key={index}>{hotspot}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* AI Insights */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4 text-black">AI Analysis</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="space-y-2">
                {aiInsights.map((insight, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    <span className="text-gray-700">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Submit Report Button */}
          <div className="text-center">
            <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
              <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700">
                  Submit Anonymous Report
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Submit Anonymous Report</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Describe the incident or concern..."
                    value={report}
                    onChange={(e) => setReport(e.target.value)}
                    rows={4}
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsReportOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={submitReport} className="bg-red-600 hover:bg-red-700">
                      Submit Report
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeaceMode;