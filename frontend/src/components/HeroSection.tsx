import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import heroImage from "@/assets/hero-voting.jpeg";

const HeroSection = () => {
  const { isAuthenticated } = useAuth();
  const callToActionLink = isAuthenticated ? "/dashboard?view=candidates" : "/login";
  return (
    <section id="hero" className="pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
              <span className="shiny-wave">
                Your AI Civic Assistant for <span className="text-primary">Smarter Voting</span>
              </span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-lg">
              Compare candidates, track community signals, and engage
              peacefully—all in one platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="text-base font-semibold px-8" asChild>
                <Link to={callToActionLink}>Get Started</Link>
              </Button>
            </div>
          </div>

          {/* Right */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-4 bg-primary/10 rounded-2xl blur-2xl" />
              <img
                src={heroImage}
                alt="Person casting a vote"
                className="relative rounded-2xl shadow-2xl w-full object-cover aspect-[4/5]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
