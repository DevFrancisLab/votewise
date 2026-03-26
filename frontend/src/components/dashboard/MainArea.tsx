import AIAssistant from "./AIAssistant";
import Candidates from "./Candidates";
import PeaceMode from "./PeaceMode";

interface MainAreaProps {
  activeView: string;
  setActiveView?: (view: string) => void;
}

const MainArea = ({ activeView, setActiveView }: MainAreaProps) => {
  return (
    <main className={`flex-1 p-6 ${activeView === 'candidates' ? 'bg-white' : 'bg-gray-50'}`}>
      {activeView === "ai-assistant" && <AIAssistant />}
      {activeView === "candidates" && <Candidates />}
      {activeView === "peace-mode" && <PeaceMode onClose={() => setActiveView?.("ai-assistant")} />}
    </main>
  );
};

export default MainArea;