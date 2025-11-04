export const Footer = () => {
  return (
    <footer className="mt-auto py-6 border-t border-border bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Todos os direitos reservados
          </p>
          <p className="text-xs text-muted-foreground">
            Criado por <span className="font-medium text-primary">EllonMusk.dev</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
