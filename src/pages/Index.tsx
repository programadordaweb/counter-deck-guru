import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Sparkles, Zap, Shield, Target, ArrowLeft, FileText, Crown, LogOut, User } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { CounterDeckResult } from "@/components/CounterDeckResult";
import { PricingModal } from "@/components/PricingModal";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription } from "@/hooks/useSubscription";
import crownLogo from "@/assets/crown-logo.png";

interface EnemyCard {
  name: string;
  icon: string;
}

interface CounterCard {
  name: string;
  icon: string;
  role: string;
  explanation: string;
  counters: string[];
}

interface AnalysisResult {
  enemyDeck: EnemyCard[];
  counterDeck: CounterCard[];
  counterName: string;
  isAbsoluteCounter: boolean;
}

const Index = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [deckText, setDeckText] = useState("");
  const [arena, setArena] = useState<string>("1");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showPricing, setShowPricing] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  const { isPremium, loading: subscriptionLoading } = useSubscription();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
      } else {
        setUserEmail(user.email || null);
      }
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUserEmail(session.user.email || null);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Logout realizado com sucesso!");
    navigate("/auth");
  };

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

  const handleImageUploadClick = () => {
    if (!isPremium) {
      toast.error("📸 Upload de imagens é exclusivo para Premium!");
      setShowPricing(true);
      return;
    }
    document.getElementById('image-upload')?.click();
  };

  const handleAnalyze = async () => {
    if (!selectedImage && !imagePreview && !deckText.trim()) {
      toast.error("Envie uma imagem ou digite as cartas do deck!");
      return;
    }
    
    setIsAnalyzing(true);
    toast.info("Analisando deck inimigo... 🔍");
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-deck', {
        body: { 
          image: imagePreview,
          deckText: deckText.trim(),
          arena: parseInt(arena),
          isPremium
        }
      });

      if (error) {
        console.error('Erro ao analisar deck:', error);
        toast.error("Erro ao analisar deck. Tente novamente!");
        setIsAnalyzing(false);
        return;
      }

      console.log('Resultado da análise:', data);
      setAnalysisResult(data);
      setIsAnalyzing(false);
      setShowResult(true);
      
      if (data.isAbsoluteCounter) {
        toast.success("💥 Counter absoluto detectado! 🏆");
      } else {
        toast.success("Deck counter gerado com sucesso! ⚔️");
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
      toast.error("Erro ao analisar deck. Tente novamente!");
      setIsAnalyzing(false);
    }
  };

  const handleNewAnalysis = () => {
    setShowResult(false);
    setSelectedImage(null);
    setImagePreview(null);
    setDeckText("");
    setArena("1");
    setAnalysisResult(null);
  };

  const handleUpgrade = () => {
    setShowPricing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {isPremium && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-gold/20 border border-gold/30">
                <Crown className="w-4 h-4 text-gold" />
                <span className="text-sm font-medium text-gold">Premium</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {userEmail && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/50 border border-border/50">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground hidden md:inline">{userEmail}</span>
              </div>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {showResult && analysisResult ? (
        <CounterDeckResult 
          enemyDeck={analysisResult.enemyDeck}
          counterDeck={analysisResult.counterDeck}
          counterName={analysisResult.counterName}
          isAbsoluteCounter={analysisResult.isAbsoluteCounter}
          onNewAnalysis={handleNewAnalysis}
        />
      ) : (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <img src={crownLogo} alt="Clash IA Logo" className="w-16 h-16 object-contain" />
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-gold bg-clip-text text-transparent">
                Clash IA
              </h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Sua IA especialista em Clash Royale 👑
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-primary/30 bg-card/50 hover:border-primary transition-all">
              <CardHeader className="pb-3">
                <Sparkles className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-lg">IA Avançada</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Análise profunda com inteligência artificial de última geração
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-secondary/30 bg-card/50 hover:border-secondary transition-all">
              <CardHeader className="pb-3">
                <Shield className="w-8 h-8 text-secondary mb-2" />
                <CardTitle className="text-lg">Counter Perfeito</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Decks otimizados para cada arena e situação de jogo
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-accent/30 bg-card/50 hover:border-accent transition-all">
              <CardHeader className="pb-3">
                <Target className="w-8 h-8 text-accent mb-2" />
                <CardTitle className="text-lg">Estratégia Clara</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Explicação detalhada de cada carta e como usá-la
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-gold" />
                Selecione sua Arena
              </CardTitle>
              <CardDescription>
                Isso ajudará a IA a sugerir cartas disponíveis para sua arena
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={arena} onValueChange={setArena}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a arena" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 15 }, (_, i) => i + 1).map((arenaNum) => (
                    <SelectItem key={arenaNum} value={arenaNum.toString()}>
                      Arena {arenaNum}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Como você quer enviar o deck?
              </CardTitle>
              <CardDescription>
                {isPremium 
                  ? "Escolha entre enviar uma imagem ou digitar as cartas" 
                  : "Plano grátis: digite as cartas do deck. Assine Premium para enviar imagens!"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div 
                onClick={handleImageUploadClick}
                className={`cursor-pointer ${!isPremium ? 'opacity-50' : ''}`}
              >
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-primary/50 rounded-lg hover:border-primary transition-colors bg-card/50 hover:bg-card">
                  {imagePreview && isPremium ? (
                    <div className="space-y-4">
                      <img src={imagePreview} alt="Preview" className="max-h-64 rounded-lg shadow-card" />
                      <p className="text-sm text-muted-foreground">Clique para trocar a imagem</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-primary mb-4" />
                      <p className="text-lg font-medium mb-2">
                        {isPremium ? "Envie a imagem do deck inimigo" : "Upload de imagens (Premium)"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {isPremium ? "PNG, JPG ou WEBP" : "Assine o plano Premium para usar"}
                      </p>
                      {!isPremium && (
                        <Crown className="w-6 h-6 text-gold mt-2" />
                      )}
                    </>
                  )}
                </div>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={!isPremium}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Ou</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Digite as cartas do deck</p>
                </div>
                <Textarea
                  placeholder="Digite as 8 cartas do deck inimigo, separadas por vírgula&#10;Exemplo: Gigante, Bruxa, Príncipe, Dragão Infernal, Valquíria, Zap, Bola de Fogo, Coletor de Elixir"
                  value={deckText}
                  onChange={(e) => setDeckText(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
              </div>

              <Button 
                onClick={handleAnalyze}
                disabled={isAnalyzing || subscriptionLoading}
                size="lg"
                className="w-full bg-gradient-arena hover:shadow-glow transition-all"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                    Analisando deck...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Gerar Counter Deck
                  </>
                )}
              </Button>

              {!isPremium && (
                <Button 
                  onClick={() => setShowPricing(true)}
                  variant="outline"
                  size="lg"
                  className="w-full border-gold/30 hover:border-gold hover:bg-gold/10"
                >
                  <Crown className="w-5 h-5 mr-2 text-gold" />
                  Assinar Premium
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <PricingModal
        open={showPricing}
        onOpenChange={setShowPricing}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
};

export default Index;
