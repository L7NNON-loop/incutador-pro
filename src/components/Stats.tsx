import { useState, useEffect } from "react";
import { Link2, MousePointerClick, TrendingUp, Users } from "lucide-react";
import { Card } from "./ui/card";
import { supabase } from "@/integrations/supabase/client";

export const Stats = () => {
  const [stats, setStats] = useState({
    totalLinks: 0,
    totalClicks: 0,
    activeUsers: 0,
    growth: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Get total links
      const { count: linksCount } = await supabase
        .from("links")
        .select("*", { count: "exact", head: true });

      // Get total clicks
      const { data: linksData } = await supabase
        .from("links")
        .select("clicks");
      
      const totalClicks = linksData?.reduce((sum, link) => sum + (link.clicks || 0), 0) || 0;

      setStats({
        totalLinks: linksCount || 0,
        totalClicks,
        activeUsers: Math.floor((linksCount || 0) * 0.7), // Estimativa
        growth: 127,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const statItems = [
    {
      icon: Link2,
      label: "Links Criados",
      value: stats.totalLinks.toLocaleString(),
      color: "text-primary",
    },
    {
      icon: MousePointerClick,
      label: "Total de Cliques",
      value: stats.totalClicks.toLocaleString(),
      color: "text-accent",
    },
    {
      icon: Users,
      label: "Usuários Ativos",
      value: stats.activeUsers.toLocaleString(),
      color: "text-success",
    },
    {
      icon: TrendingUp,
      label: "Crescimento",
      value: `+${stats.growth}%`,
      color: "text-warning",
    },
  ];

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {statItems.map((stat, index) => (
            <Card
              key={index}
              className="p-6 text-center border-0 bg-gradient-card hover:shadow-elegant transition-all duration-300 animate-fade-in group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex p-3 rounded-full bg-secondary mb-3 group-hover:scale-110 transition-transform">
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
