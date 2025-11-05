import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UrlShortener } from "@/components/UrlShortener";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CreditDisplay } from "@/components/CreditDisplay";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
    } else {
      setUser(user);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 pt-24 pb-12">
        <div className="text-center space-y-4 mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold">
            Meus Links
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Crie, gerencie e analise seus links encurtados em um só lugar
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-8">
          <CreditDisplay />
        </div>

        <UrlShortener />
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
