import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import MainArea from "@/components/dashboard/MainArea";
import BottomNav from "@/components/dashboard/BottomNav";
import YouthPulse from "@/components/dashboard/YouthPulse";
import { useSearchParams } from "react-router-dom";

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const defaultView = useMemo(() => {
    return searchParams.get("view") || searchParams.get("active") || "ai-assistant";
  }, [searchParams]);
  const [activeView, setActiveView] = useState("ai-assistant");

  useEffect(() => {
    setActiveView(defaultView);
  }, [defaultView]);

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      <div className="hidden md:block">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
      </div>
      <div className="flex-1 flex flex-col pb-16 md:pb-0">
        <MainArea activeView={activeView} setActiveView={setActiveView} />
      </div>
      <BottomNav activeView={activeView} setActiveView={setActiveView} />
      <YouthPulse />
    </div>
  );
};

export default Dashboard;