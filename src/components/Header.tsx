import { Link2 } from "lucide-react";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-primary rounded-lg">
            <Link2 className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-semibold">ShortLink</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Criado por <span className="font-medium text-foreground">EllonMusk.dev</span>
        </p>
      </div>
    </header>
  );
};
