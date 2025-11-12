import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Zap, Target, Shield, Swords } from "lucide-react";

interface EnemyCard {
  name: string;
  icon: string;
}

interface CounterCard {
  name: string;
  role: string;
  explanation: string;
  icon: string;
  counters: string[];
}

interface CounterDeckResultProps {
  enemyDeck: EnemyCard[];
  counterDeck: CounterCard[];
  counterName?: string;
  isAbsoluteCounter?: boolean;
  finalMessage?: string;
}

export const CounterDeckResult = ({ 
  enemyDeck,
  counterDeck, 
  counterName,
  isAbsoluteCounter = false,
  finalMessage = "🔥 Vá para a arena e mostre quem domina o campo, campeão da torre!"
}: CounterDeckResultProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with counter name */}
      {counterName && (
        <Card className={`border-gold/50 shadow-gold ${isAbsoluteCounter ? 'bg-gradient-gold/20' : 'bg-gradient-gold/10'}`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-3">
              <Trophy className="w-8 h-8 text-gold animate-pulse" />
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">
                  {isAbsoluteCounter ? '💥 Counter Absoluto Detectado!' : 'Counter Total Detectado'}
                </p>
                <h2 className="text-2xl font-black text-gold">{counterName}</h2>
              </div>
              <Trophy className="w-8 h-8 text-gold animate-pulse" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enemy Deck */}
      <Card className="shadow-card border-border/50 bg-destructive/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Swords className="w-6 h-6 text-destructive" />
            Deck Inimigo Detectado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {enemyDeck.map((card, index) => (
              <div
                key={index}
                className="relative p-3 rounded-lg bg-destructive/20 border border-destructive/50 text-center"
              >
                <div className="text-3xl mb-1">{card.icon}</div>
                <p className="text-sm font-medium text-foreground">{card.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Counter Deck */}
      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Shield className="w-6 h-6 text-primary" />
            Seu Deck Counter Perfeito
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {counterDeck.map((card, index) => (
              <div
                key={index}
                className="relative p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/50 transition-all hover:shadow-glow group"
              >
                <div className="absolute top-2 right-2">
                  <Badge variant="outline" className="bg-primary/20 text-primary border-primary/50">
                    #{index + 1}
                  </Badge>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="text-4xl">{card.icon}</div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                        {card.name}
                      </h3>
                      <Badge variant="secondary" className="text-xs mb-1">
                        {card.role}
                      </Badge>
                      {card.counters.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {card.counters.map((counter, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs bg-destructive/20 text-destructive border-destructive/50">
                              ⚔️ {counter}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {card.explanation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strategy Tips */}
      <Card className="shadow-card border-border/50 bg-card/50">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Target className="w-5 h-5" />
              <h3 className="font-bold">Estratégia de Batalha</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>Comece com defesa sólida usando suas cartas de baixo custo</span>
              </li>
              <li className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>Use cartas de contra-ataque após defender com sucesso</span>
              </li>
              <li className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>Mantenha pressão constante nas duas torres durante tempo duplo</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Final Message */}
      <div className="text-center p-6 rounded-lg bg-gradient-arena/20 border border-primary/30">
        <p className="text-lg font-bold text-foreground mb-2">{finalMessage}</p>
        <p className="text-sm text-muted-foreground">
          👑 Vitória garantida pela Clash IA
        </p>
      </div>
    </div>
  );
};
