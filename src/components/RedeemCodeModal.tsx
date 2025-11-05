import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Gift, Loader2 } from "lucide-react";

interface RedeemCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const RedeemCodeModal = ({ open, onOpenChange, onSuccess }: RedeemCodeModalProps) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);

    try {
      const { data, error } = await supabase.rpc('redeem_code', {
        code_text: code.trim()
      });

      if (error) throw error;

      const result = data as any;

      if (result && result.success) {
        toast.success(result.message, {
          description: `Você recebeu ${result.credits_received} créditos! Total: ${result.total_credits}`,
        });
        setCode("");
        onSuccess();
        onOpenChange(false);
      } else {
        toast.error(result?.message || "Erro ao resgatar código");
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao resgatar código");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-primary rounded-xl shadow-elegant">
              <Gift className="h-6 w-6 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center">Resgatar Código Promocional</DialogTitle>
          <DialogDescription className="text-center">
            Digite o código para receber créditos gratuitamente
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleRedeem} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Código Promocional</Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Digite o código"
              className="uppercase"
              disabled={loading}
            />
          </div>

          <div className="bg-accent/50 p-3 rounded-lg space-y-1">
            <p className="text-xs font-medium">Códigos Disponíveis:</p>
            <p className="text-xs text-muted-foreground">Madara - 10 créditos</p>
            <p className="text-xs text-muted-foreground">EllonMusk - 50 créditos</p>
            <p className="text-xs text-muted-foreground">CarlitosM - 1000 créditos</p>
            <p className="text-xs text-muted-foreground">INC - 2 créditos</p>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-primary hover:opacity-90"
            disabled={loading || !code.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resgatando...
              </>
            ) : (
              <>
                <Gift className="mr-2 h-4 w-4" />
                Resgatar
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
