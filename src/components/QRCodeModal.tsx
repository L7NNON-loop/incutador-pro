import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Download } from "lucide-react";

interface QRCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  qrCode: string | null;
  shortUrl: string;
}

export const QRCodeModal = ({ open, onOpenChange, qrCode, shortUrl }: QRCodeModalProps) => {
  const handleDownload = () => {
    if (!qrCode) return;

    const link = document.createElement("a");
    link.href = qrCode;
    link.download = `qrcode-${shortUrl}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code do Link</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          {qrCode && (
            <div className="p-4 bg-white rounded-lg">
              <img src={qrCode} alt="QR Code" className="w-64 h-64" />
            </div>
          )}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Escaneie para acessar:</p>
            <p className="font-mono text-sm text-primary">{shortUrl}</p>
          </div>
          <Button onClick={handleDownload} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Baixar QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
