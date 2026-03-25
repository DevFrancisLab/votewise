import { Brain, Scale, Heart, Bell } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Assistant",
    description:
      "Ask anything about elections and candidates, get AI-powered insights instantly.",
  },
  {
    icon: Scale,
    title: "Candidates",
    description:
      "Explore candidate profiles, manifestos, and AI-analyzed signals.",
  },
  {
    icon: Heart,
    title: "Peace Mode",
    description:
      "Report activities anonymously and see aggregated trends with AI insights.",
  },
  {
    icon: Bell,
    title: "Youth Pulse",
    description:
      "Participate in occasional polls to show what matters most to youth.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Powerful <span className="text-primary">Features</span>
        </h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
          Everything you need to make informed civic decisions.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-card rounded-xl p-6 border border-border hover:shadow-lg hover:border-primary/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="text-primary" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
