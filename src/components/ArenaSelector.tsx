import { Card } from "@/components/ui/card";
import { Crown } from "lucide-react";

interface ArenaSelectorProps {
  selectedArena: string;
  onArenaSelect: (arena: string) => void;
}

const arenas = [
  { number: 1, name: "Arena de Treinamento", color: "from-[hsl(120,40%,40%)] to-[hsl(120,40%,30%)]" },
  { number: 2, name: "Arena de Ossos", color: "from-[hsl(30,30%,45%)] to-[hsl(30,30%,35%)]" },
  { number: 3, name: "Arena de Bárbaros", color: "from-[hsl(25,50%,50%)] to-[hsl(25,50%,40%)]" },
  { number: 4, name: "Arena P.E.K.K.A", color: "from-[hsl(280,40%,45%)] to-[hsl(280,40%,35%)]" },
  { number: 5, name: "Arena de Feitiços", color: "from-[hsl(270,60%,50%)] to-[hsl(270,60%,40%)]" },
  { number: 6, name: "Arena de Construtores", color: "from-[hsl(200,50%,50%)] to-[hsl(200,50%,40%)]" },
  { number: 7, name: "Arena Real", color: "from-[hsl(220,70%,55%)] to-[hsl(220,70%,45%)]" },
  { number: 8, name: "Arena Congelada", color: "from-[hsl(195,60%,60%)] to-[hsl(195,60%,50%)]" },
  { number: 9, name: "Arena da Selva", color: "from-[hsl(140,50%,45%)] to-[hsl(140,50%,35%)]" },
  { number: 10, name: "Arena do Hog Mountain", color: "from-[hsl(15,60%,55%)] to-[hsl(15,60%,45%)]" },
  { number: 11, name: "Arena Elétrica", color: "from-[hsl(190,70%,55%)] to-[hsl(190,70%,45%)]" },
  { number: 12, name: "Arena Batedeira", color: "from-[hsl(30,70%,60%)] to-[hsl(30,70%,50%)]" },
  { number: 13, name: "Arena do Pico Renegado", color: "from-[hsl(345,60%,50%)] to-[hsl(345,60%,40%)]" },
  { number: 14, name: "Arena Lendária", color: "from-[hsl(50,90%,60%)] to-[hsl(40,90%,50%)]" },
  { number: 15, name: "Arena Campeão", color: "from-[hsl(35,95%,55%)] to-[hsl(25,95%,45%)]" },
];

export const ArenaSelector = ({ selectedArena, onArenaSelect }: ArenaSelectorProps) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
      {arenas.map((arena) => (
        <Card
          key={arena.number}
          onClick={() => onArenaSelect(arena.number.toString())}
          className={`
            relative cursor-pointer transition-all duration-300 p-4 
            hover:scale-105 hover:shadow-glow
            ${selectedArena === arena.number.toString() 
              ? 'ring-2 ring-gold shadow-gold scale-105' 
              : 'hover:ring-1 hover:ring-primary/50'
            }
          `}
        >
          <div className={`
            absolute inset-0 rounded-lg bg-gradient-to-br ${arena.color} opacity-80
          `} />
          <div className="relative flex flex-col items-center justify-center gap-2 text-center">
            <Crown className="w-6 h-6 text-foreground" />
            <div className="font-bold text-foreground text-sm">{arena.number}</div>
            <div className="text-xs text-foreground/90 hidden sm:block line-clamp-2">
              {arena.name}
            </div>
          </div>
          {selectedArena === arena.number.toString() && (
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold animate-pulse" />
          )}
        </Card>
      ))}
    </div>
  );
};
