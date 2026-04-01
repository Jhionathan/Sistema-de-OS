"use client";

import { useRef, useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { QrCode, Printer, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

type QRCodeGeneratorProps = {
  equipmentId: string;
  equipmentName: string;
};

export function QRCodeGenerator({ equipmentId, equipmentName }: QRCodeGeneratorProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const [baseUrl, setBaseUrl] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    // Definimos a baseUrl dinamicamente no client
    setBaseUrl(window.location.origin);
  }, []);

  const requestUrl = `${baseUrl}/tickets/new?equipmentId=${equipmentId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(requestUrl);
      setIsCopied(true);
      toast.success("Link copiado para a área de transferência");
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error("Erro ao copiar o link");
    }
  };

  const handlePrint = () => {
    const printContent = qrRef.current;
    if (!printContent) return;

    const originalContents = document.body.innerHTML;
    const originalStyle = document.body.style.cssText;

    // Estilo isolado para impressão
    document.body.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; text-align: center;">
        <h1 style="font-size: 24px; margin-bottom: 8px;">Solicitação de Serviço</h1>
        <p style="font-size: 16px; color: #666; margin-bottom: 24px;">Equipamento: <strong>${equipmentName}</strong></p>
        <div style="padding: 24px; border: 2px dashed #ccc; border-radius: 16px; display: inline-block;">
          ${printContent.innerHTML}
        </div>
        <p style="margin-top: 16px; font-size: 14px; color: #888;">Escaneie o QR Code com a câmera do celular para abrir um chamado.</p>
      </div>
    `;

    document.body.style.background = "#fff";
    
    window.print();

    // Restaura o estado original
    document.body.innerHTML = originalContents;
    document.body.style.cssText = originalStyle;
    window.location.reload(); // Recarrega para recuperar bindings de eventos do React
  };

  if (!baseUrl) return null; // Previne renderização antes do hidratação

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="border-b border-border bg-muted/40 px-6 py-4 flex items-center gap-3">
        <QrCode className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Acesso Rápido (QR Code)</h3>
      </div>
      
      <div className="p-6 flex flex-col items-center">
        <div 
          ref={qrRef}
          className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-center"
        >
          <QRCodeSVG 
            value={requestUrl} 
            size={180}
            level="H"
            includeMargin={false}
            fgColor="#0f172a"
          />
        </div>

        <p className="text-sm text-center text-muted-foreground mt-4 mb-6 max-w-[250px]">
          Posicione este QR Code na máquina para que o cliente relate problemas com 1 clique.
        </p>

        <div className="w-full flex flex-col gap-2">
          <button
            onClick={handlePrint}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Printer className="h-4 w-4" />
            Imprimir Etiqueta
          </button>
          
          <button
            onClick={handleCopyLink}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2.5 text-sm font-semibold text-foreground transition-colors"
          >
            {isCopied ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Copiado!
              </>
            ) : (
              <>Ouvir ou Copiar Link</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
