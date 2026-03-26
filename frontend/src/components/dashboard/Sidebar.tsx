import { Brain, Scale, Shield, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const Sidebar = ({ activeView, setActiveView }: SidebarProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout().then(() => {
      toast.success("You have been logged out");
      navigate("/");
    });
  };

  const navItems = [
    { id: "ai-assistant", label: "AI Assistant", icon: Brain },
    { id: "candidates", label: "Candidates", icon: Scale },
    { id: "peace-mode", label: "Civic Watch", icon: Shield },
  ];

  return (
    <div className="w-64 bg-black text-white min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-8">VoteWise AI</h2>
        <nav className="space-y-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeView === item.id
                    ? "bg-red-600 text-white"
                    : "hover:bg-gray-800"
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="mt-auto pt-8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;