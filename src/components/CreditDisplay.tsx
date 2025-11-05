import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, Gift } from "lucide-react";
import { RedeemCodeModal } from "./RedeemCodeModal";

export const CreditDisplay = () => {
  const [credits, setCredits] = useState(0);
  const [showRedeemModal, setShowRedeemModal] = useState(false);

  useEffect(() => {
    loadCredits();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('credit-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_credits',
        },
        () => loadCredits()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadCredits = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("user_credits")
      .select("credits")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setCredits(data.credits);
    }
  };

  return (
    <>
      <Card className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg shadow-elegant">
              <Coins className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Seus Créditos</p>
              <p className="text-2xl font-bold text-primary">{credits}</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowRedeemModal(true)}
            className="gap-2"
          >
            <Gift className="h-4 w-4" />
            Resgatar Código
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          💡 Cada link encurtado custa 2 créditos
        </p>
      </Card>

      <RedeemCodeModal
        open={showRedeemModal}
        onOpenChange={setShowRedeemModal}
        onSuccess={loadCredits}
      />
    </>
  );
};
