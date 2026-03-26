import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "About", href: "#footer" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-secondary">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <a href="#" className="text-secondary-foreground font-extrabold text-xl tracking-tight">
          VoteWise
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-secondary-foreground/70 hover:text-secondary-foreground text-sm font-medium transition-colors"
            >
              {l.label}
            </a>
          ))}
          <Button asChild>
            <Link to="/login">Get Started</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-secondary-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-secondary border-t border-secondary-foreground/10 px-4 pb-4">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-secondary-foreground/70 hover:text-secondary-foreground text-sm font-medium"
            >
              {l.label}
            </a>
          ))}
          <Button className="w-full mt-2" asChild>
            <Link to="/login">Get Started</Link>
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
