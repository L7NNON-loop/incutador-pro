import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Card } from "./ui/card";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, MapPin, Smartphone, Calendar } from "lucide-react";

interface LinkAnalyticsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  linkId: string | null;
  shortCode: string;
}

export const LinkAnalytics = ({ open, onOpenChange, linkId, shortCode }: LinkAnalyticsProps) => {
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && linkId) {
      loadAnalytics();
    }
  }, [open, linkId]);

  const loadAnalytics = async () => {
    if (!linkId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("link_analytics")
        .select("*")
        .eq("link_id", linkId)
        .order("clicked_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setAnalytics(data || []);
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const deviceStats = analytics.reduce((acc: any, item) => {
    const device = item.device_type || "Desconhecido";
    acc[device] = (acc[device] || 0) + 1;
    return acc;
  }, {});

  const locationStats = analytics.reduce((acc: any, item) => {
    const location = item.country || "Desconhecido";
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {});

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Analytics - {shortCode}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 border-0 bg-gradient-card">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Total de Cliques</h3>
                </div>
                <p className="text-3xl font-bold">{analytics.length}</p>
              </Card>

              <Card className="p-4 border-0 bg-gradient-card">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Calendar className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-semibold">Último Clique</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {analytics[0]
                    ? new Date(analytics[0].clicked_at).toLocaleString("pt-BR")
                    : "Nenhum clique ainda"}
                </p>
              </Card>
            </div>

            <Card className="p-4 border-0 bg-gradient-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-success/10">
                  <Smartphone className="h-5 w-5 text-success" />
                </div>
                <h3 className="font-semibold">Dispositivos</h3>
              </div>
              <div className="space-y-2">
                {Object.entries(deviceStats).map(([device, count]: [string, any]) => (
                  <div key={device} className="flex items-center justify-between">
                    <span className="text-sm">{device}</span>
                    <span className="text-sm font-semibold">{count}</span>
                  </div>
                ))}
                {Object.keys(deviceStats).length === 0 && (
                  <p className="text-sm text-muted-foreground">Nenhum dado disponível</p>
                )}
              </div>
            </Card>

            <Card className="p-4 border-0 bg-gradient-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-warning/10">
                  <MapPin className="h-5 w-5 text-warning" />
                </div>
                <h3 className="font-semibold">Localização</h3>
              </div>
              <div className="space-y-2">
                {Object.entries(locationStats).map(([location, count]: [string, any]) => (
                  <div key={location} className="flex items-center justify-between">
                    <span className="text-sm">{location}</span>
                    <span className="text-sm font-semibold">{count}</span>
                  </div>
                ))}
                {Object.keys(locationStats).length === 0 && (
                  <p className="text-sm text-muted-foreground">Nenhum dado disponível</p>
                )}
              </div>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
