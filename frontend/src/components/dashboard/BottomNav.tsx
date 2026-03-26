import { Brain, Scale, Shield, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface BottomNavProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const BottomNav = ({ activeView, setActiveView }: BottomNavProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Clear authentication state if exists
    toast.success("You have been logged out");
    navigate("/");
  };

  const navItems = [
    { id: "ai-assistant", label: "AI", icon: Brain },
    { id: "candidates", label: "Candidates", icon: Scale },
    { id: "peace-mode", label: "Civic", icon: Shield },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black shadow-2xl border-t border-gray-800 h-15">
      <div className="flex justify-around items-center h-full px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center justify-center py-3 px-4 rounded-lg transition-all duration-300 min-w-0 flex-1 ${
                isActive ? "text-red-600" : "text-white hover:text-gray-300"
              }`}
            >
              <Icon size={24} className={isActive ? "text-red-600" : "text-white"} />
              <span className={`text-xs mt-1 ${isActive ? "text-red-600" : "text-white"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center py-3 px-4 ml-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          <LogOut size={20} className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default BottomNav;