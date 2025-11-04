import { Link2, Zap, Shield, TrendingUp } from "lucide-react";

export const Hero = () => {
  return (
    <div className="text-center space-y-8 mb-12">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
        <Zap className="h-3 w-3 text-primary" />
        <span className="text-xs font-medium text-primary">Encurtamento instantâneo</span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2.5 bg-gradient-primary rounded-xl shadow-elegant">
            <Link2 className="h-7 w-7 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Encurtador de Links
        </h1>
        <p className="text-base text-muted-foreground max-w-xl mx-auto">
          Transforme URLs longas em links curtos e elegantes
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 text-primary" />
          <span>Instantâneo</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Shield className="h-3.5 w-3.5 text-primary" />
          <span>Seguro</span>
        </div>
        <div className="flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-primary" />
          <span>Rastreamento</span>
        </div>
      </div>
    </div>
  );
};
