import { MessageSquare, Users, ShieldCheck } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    step: "01",
    title: "Ask the AI",
    description: "Get instant candidate insights and election info.",
  },
  {
    icon: Users,
    step: "02",
    title: "Browse Candidates",
    description: "Compare profiles, manifestos, and community signals.",
  },
  {
    icon: ShieldCheck,
    step: "03",
    title: "Engage Safely",
    description: "Submit anonymous reports and see aggregated signals.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          How It <span className="text-primary">Works</span>
        </h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16">
          Three simple steps to smarter civic engagement.
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((s, i) => (
            <div key={s.step} className="text-center space-y-4 relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-border" />
              )}
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto relative">
                <s.icon className="text-secondary-foreground" size={28} />
              </div>
              <span className="text-primary font-bold text-sm">{s.step}</span>
              <h3 className="font-bold text-xl">{s.title}</h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
