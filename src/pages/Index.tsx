import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Zap, Shield, Target, FileText, Crown, LogOut } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CounterDeckResult } from "@/components/CounterDeckResult";
import { ArenaSelector } from "@/components/ArenaSelector";
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
  const [deckText, setDeckText] = useState("");
  const [arena, setArena] = useState<string>("1");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserEmail(user?.email || null);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUserEmail(session?.user?.email || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUserEmail(null);
    toast.success("Logout realizado com sucesso!");
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      if (authMode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });
        if (error) throw error;
        toast.success("✅ Conta criada! Verifique seu email para confirmar.");
        setShowAuthModal(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword,
        });
        if (error) throw error;
        toast.success("🎉 Login realizado com sucesso!");
        setShowAuthModal(false);
      }
      setAuthEmail("");
      setAuthPassword("");
    } catch (error: any) {
      toast.error(error.message || "Erro ao autenticar");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!userEmail) {
      toast.error("Faça login para gerar counter decks!");
      setShowAuthModal(true);
      return;
    }
    
    if (!deckText.trim()) {
      toast.error("Digite as cartas do deck!");
      return;
    }
    
    setIsAnalyzing(true);
    console.log('🎮 Iniciando análise de deck...');
    console.log('Arena selecionada:', arena);
    console.log('📝 Texto do deck:', deckText);
    toast.info("Analisando cartas do deck... 🔍");
    
    try {
      console.log('📡 Chamando edge function analyze-deck...');
      const { data, error } = await supabase.functions.invoke('analyze-deck', {
        body: { 
          deckText: deckText.trim(),
          arena: parseInt(arena)
        }
      });

      if (error) {
        console.error('❌ Erro ao analisar deck:', error);
        toast.error("Erro ao analisar deck. Tente novamente!");
        setIsAnalyzing(false);
        return;
      }

      console.log('✅ Resultado da análise recebido:', data);
      setAnalysisResult(data);
      setIsAnalyzing(false);
      setShowResult(true);
      
      if (data.isAbsoluteCounter) {
        toast.success("💥 Counter absoluto detectado! 🏆");
      } else {
        toast.success("Deck counter gerado com sucesso! ⚔️");
      }
    } catch (err) {
      console.error('❌ Erro inesperado:', err);
      toast.error("Erro ao analisar deck. Tente novamente!");
      setIsAnalyzing(false);
    }
  };

  const handleNewAnalysis = () => {
    setShowResult(false);
    setDeckText("");
    setArena("1");
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={crownLogo} alt="Clash IA" className="w-10 h-10" />
            <h2 className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">
              Clash IA
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {userEmail ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                    <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                      <AvatarImage src={`https://www.gravatar.com/avatar/${userEmail}?d=identicon`} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {userEmail[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center gap-3 p-2 border-b">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`https://www.gravatar.com/avatar/${userEmail}?d=identicon`} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {userEmail[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium truncate max-w-[150px]">{userEmail}</p>
                      <Badge variant="outline" className="w-fit text-xs">
                        Conta Ativa
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenuItem onClick={() => setShowProfileModal(true)} className="cursor-pointer">
                    Editar Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => setShowAuthModal(true)} variant="outline" className="gap-2">
                Login ou Criar Conta
              </Button>
            )}
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
              <ArenaSelector 
                selectedArena={arena} 
                onArenaSelect={setArena}
              />
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Digite o deck inimigo
              </CardTitle>
              <CardDescription>
                Informe as 8 cartas do deck que você quer contrar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                disabled={isAnalyzing}
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
            </CardContent>
          </Card>
        </div>
      )}

      {/* Auth Modal */}
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl bg-gradient-gold bg-clip-text text-transparent">
              {authMode === "login" ? "Entrar" : "Criar Conta"}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs value={authMode} onValueChange={(v) => setAuthMode(v as "login" | "signup")} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Cadastro</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="auth-email-login">Email</Label>
                  <Input
                    id="auth-email-login"
                    type="email"
                    placeholder="seu@email.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    required
                    disabled={authLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="auth-password-login">Senha</Label>
                  <Input
                    id="auth-password-login"
                    type="password"
                    placeholder="••••••••"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    required
                    disabled={authLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={authLoading}>
                  {authLoading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="auth-email-signup">Email</Label>
                  <Input
                    id="auth-email-signup"
                    type="email"
                    placeholder="seu@email.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    required
                    disabled={authLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="auth-password-signup">Senha</Label>
                  <Input
                    id="auth-password-signup"
                    type="password"
                    placeholder="••••••••"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    required
                    disabled={authLoading}
                    minLength={6}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={authLoading}>
                  {authLoading ? "Criando conta..." : "Criar conta"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Profile Modal */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center gap-4 py-4">
            <Avatar className="h-24 w-24 ring-4 ring-primary/20">
              <AvatarImage src={`https://www.gravatar.com/avatar/${userEmail}?d=identicon`} />
              <AvatarFallback className="text-2xl">{userEmail?.[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <div className="text-center space-y-1">
              <p className="text-sm font-medium">{userEmail}</p>
            </div>
            
            <div className="w-full space-y-4">
              <div className="text-sm text-muted-foreground text-center">
                Sua foto de perfil é gerada automaticamente pelo Gravatar.
                <br />
                Para alterá-la, crie uma conta em{" "}
                <a 
                  href="https://gravatar.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  gravatar.com
                </a>
                {" "}usando o email: <strong>{userEmail}</strong>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
