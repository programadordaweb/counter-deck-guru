import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Sparkles, Zap, Shield, Target, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { CounterDeckResult } from "@/components/CounterDeckResult";

// Mock data - será substituído pela resposta da IA real
const mockCounterDeck = {
  counterName: "Deck Mega Cavaleiro + Bola de Fogo",
  cards: [
    {
      name: "Mega Cavaleiro",
      icon: "🤺",
      role: "Tanque Principal",
      explanation: "Use para absorver dano das tropas inimigas e criar contra-ataques devastadores. Posicione atrás da torre para acumular elixir."
    },
    {
      name: "Bola de Fogo",
      icon: "🔥",
      role: "Controle de Área",
      explanation: "Elimine enxames e tropas médias do oponente. Ideal para resetar cargas e criar vantagem de elixir."
    },
    {
      name: "Valquíria",
      icon: "⚔️",
      role: "Defesa Splash",
      explanation: "Perfeita contra tropas terrestres agrupadas. Use no centro para defender ambas as torres."
    },
    {
      name: "Mega Servos",
      icon: "🤖",
      role: "Suporte Aéreo",
      explanation: "Elimine balões e dragões infernais. Proteja seu Mega Cavaleiro em contra-ataques."
    },
    {
      name: "Tronco",
      icon: "🪵",
      role: "Controle Rápido",
      explanation: "Pare cargas de príncipes e elimine tropas baixas. Use para empurrar unidades inimigas."
    },
    {
      name: "Esqueletos",
      icon: "💀",
      role: "Cycle & Distração",
      explanation: "Carta de 1 elixir para distrair P.E.K.K.A e outras tropas pesadas. Use para acelerar o ciclo."
    },
    {
      name: "Arqueiras",
      icon: "🏹",
      role: "Suporte Terrestre",
      explanation: "Defesa versátil contra tropas aéreas e terrestres. Divida para defender contra cargas."
    },
    {
      name: "Canhão",
      icon: "⚙️",
      role: "Defesa de Estruturas",
      explanation: "Atraia e elimine montarias e tanques. Posicione estrategicamente para puxar tropas ao centro."
    }
  ]
};

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast.success("Imagem do deck inimigo carregada! ⚔️");
    }
  };

  const handleAnalyze = () => {
    if (!selectedImage) {
      toast.error("Envie uma imagem do deck primeiro!");
      return;
    }
    
    setIsAnalyzing(true);
    toast.info("Analisando deck inimigo... 🔍");
    
    // Simular análise - será substituído pela integração real
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResult(true);
      toast.success("Deck counter gerado com sucesso! 🏆");
    }, 2500);
  };

  const handleNewAnalysis = () => {
    setShowResult(false);
    setSelectedImage(null);
    setImagePreview(null);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-arena opacity-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-arena-blue/20 via-transparent to-transparent" />
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-float">
          <div className="inline-flex items-center gap-3 mb-4">
            <Zap className="w-12 h-12 text-gold animate-pulse" />
            <h1 className="text-6xl font-black bg-gradient-gold bg-clip-text text-transparent">
              Clash IA
            </h1>
            <Zap className="w-12 h-12 text-gold animate-pulse" />
          </div>
          <p className="text-xl text-muted-foreground mb-2">
            O Criador de Decks Counter Supremo
          </p>
          <p className="text-sm text-foreground/70 flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            Powered by Inteligência Artificial Lendária
            <Shield className="w-4 h-4" />
          </p>
        </div>

        {/* Main Content */}
        {!showResult ? (
          <Card className="max-w-2xl mx-auto shadow-card border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
                <Target className="w-8 h-8 text-primary" />
                Destrua Qualquer Deck
              </CardTitle>
              <CardDescription className="text-base">
                Envie uma imagem do deck inimigo e descubra o deck counter perfeito
              </CardDescription>
            </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Upload Area */}
            <div className="space-y-4">
              <label 
                htmlFor="deck-upload" 
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/40 transition-all group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-arena opacity-0 group-hover:opacity-10 transition-opacity" />
                <div className="flex flex-col items-center justify-center pt-5 pb-6 relative z-10">
                  {imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Deck Preview" 
                        className="max-h-48 rounded-lg shadow-glow"
                      />
                      <div className="absolute inset-0 bg-gradient-arena opacity-0 group-hover:opacity-20 transition-opacity rounded-lg" />
                    </div>
                  ) : (
                    <>
                      <Upload className="w-16 h-16 mb-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <p className="mb-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                        <span className="font-semibold">Clique para enviar</span> ou arraste a imagem
                      </p>
                      <p className="text-xs text-muted-foreground">PNG, JPG ou WEBP</p>
                    </>
                  )}
                </div>
                <input 
                  id="deck-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>

              {selectedImage && (
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{selectedImage.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                  >
                    Remover
                  </button>
                </div>
              )}
            </div>

            {/* Action Button */}
            <Button
              variant="hero"
              size="lg"
              className="w-full text-lg h-14"
              onClick={handleAnalyze}
              disabled={!selectedImage || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" />
                  Analisando Deck...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Gerar Deck Counter
                  <Zap className="w-5 h-5" />
                </>
              )}
            </Button>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4">
              <div className="flex items-center gap-2 p-3 bg-muted/20 rounded-lg border border-border/30">
                <Zap className="w-5 h-5 text-gold" />
                <span className="text-xs font-medium">Análise Instantânea</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted/20 rounded-lg border border-border/30">
                <Target className="w-5 h-5 text-primary" />
                <span className="text-xs font-medium">Counter Perfeito</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted/20 rounded-lg border border-border/30">
                <Shield className="w-5 h-5 text-secondary" />
                <span className="text-xs font-medium">Estratégia Detalhada</span>
              </div>
            </div>
          </CardContent>
        </Card>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            <Button
              variant="ghost"
              onClick={handleNewAnalysis}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Analisar Novo Deck
            </Button>
            
            <CounterDeckResult 
              cards={mockCounterDeck.cards}
              counterName={mockCounterDeck.counterName}
            />
          </div>
        )}

        {/* Footer Info */}
        <div className="text-center mt-12 space-y-2">
          <p className="text-sm text-muted-foreground">
            🏆 Prepare-se para subir de arena, guerreiro da torre!
          </p>
          <p className="text-xs text-muted-foreground/70">
            ⚔️ Counter absoluto detectado por IA • 🔥 Vitória garantida
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
