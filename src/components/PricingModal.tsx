import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown, Zap } from "lucide-react";
import { toast } from "sonner";

interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpgrade: () => void;
}

export const PricingModal = ({ open, onOpenChange, onUpgrade }: PricingModalProps) => {
  const handleUpgrade = () => {
    window.open("https://buy.stripe.com/test_28EaEXdqCf0w1z074A7bW00", "_blank");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center flex items-center justify-center gap-2">
            <Crown className="w-8 h-8 text-gold" />
            Escolha Seu Plano
            <Crown className="w-8 h-8 text-gold" />
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Plano Grátis */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mb-3">
                <Zap className="w-6 h-6 text-muted-foreground" />
              </div>
              <CardTitle className="text-2xl">Plano Grátis</CardTitle>
              <CardDescription className="text-lg font-bold mt-2">
                R$ 0,00
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary mt-0.5" />
                  <span className="text-sm">Análise por texto (digite as cartas)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary mt-0.5" />
                  <span className="text-sm">Counter decks básicos</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary mt-0.5" />
                  <span className="text-sm">Sugestões por arena</span>
                </div>
                <div className="flex items-start gap-2 opacity-50">
                  <span className="text-sm">❌ Upload de imagens</span>
                </div>
                <div className="flex items-start gap-2 opacity-50">
                  <span className="text-sm">❌ IA avançada para análise profunda</span>
                </div>
                <div className="flex items-start gap-2 opacity-50">
                  <span className="text-sm">❌ Histórico de análises</span>
                </div>
              </div>
              <Button variant="outline" className="w-full" disabled>
                Plano Atual
              </Button>
            </CardContent>
          </Card>

          {/* Plano Premium */}
          <Card className="border-gold/50 bg-gradient-arena relative overflow-hidden shadow-glow">
            <div className="absolute inset-0 bg-gradient-gold opacity-10" />
            <CardHeader className="text-center pb-4 relative z-10">
              <div className="mx-auto w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center mb-3">
                <Crown className="w-6 h-6 text-gold" />
              </div>
              <CardTitle className="text-2xl bg-gradient-gold bg-clip-text text-transparent">
                Plano Premium
              </CardTitle>
              <CardDescription className="text-lg font-bold mt-2 text-foreground">
                <span className="text-3xl">R$ 9,90</span>
                <span className="text-sm text-muted-foreground">/mês</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-gold mt-0.5" />
                  <span className="text-sm font-medium">✨ Upload de imagens de deck</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-gold mt-0.5" />
                  <span className="text-sm font-medium">🤖 IA avançada com análise detalhada</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-gold mt-0.5" />
                  <span className="text-sm font-medium">📊 Histórico completo de análises</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-gold mt-0.5" />
                  <span className="text-sm font-medium">🎯 Counter decks otimizados por arena</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-gold mt-0.5" />
                  <span className="text-sm font-medium">⚡ Análises ilimitadas</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-gold mt-0.5" />
                  <span className="text-sm font-medium">💎 Suporte prioritário</span>
                </div>
              </div>
              <Button 
                variant="hero" 
                className="w-full"
                onClick={handleUpgrade}
              >
                <Crown className="w-4 h-4 mr-2" />
                Assinar Premium
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Cancele quando quiser • Pagamento seguro via Abacate Pay
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
