import { Card } from "@/components/ui/card";
import arena1 from "@/assets/arena-1.png";
import arena2 from "@/assets/arena-2.png";
import arena3 from "@/assets/arena-3.png";
import arena4 from "@/assets/arena-4.png";
import arena5 from "@/assets/arena-5.png";
import arena6 from "@/assets/arena-6.png";
import arena7 from "@/assets/arena-7.png";
import arena8 from "@/assets/arena-8.png";
import arena9 from "@/assets/arena-9.png";
import arena10 from "@/assets/arena-10.png";
import arena11 from "@/assets/arena-11.png";
import arena12 from "@/assets/arena-12.png";
import arena13 from "@/assets/arena-13.png";
import arena14 from "@/assets/arena-14.png";
import arena15 from "@/assets/arena-15.png";
import arena16 from "@/assets/arena-16.png";
import arena17 from "@/assets/arena-17.png";
import arena18 from "@/assets/arena-18.png";
import arena19 from "@/assets/arena-19.png";
import arena20 from "@/assets/arena-20.png";

interface ArenaSelectorProps {
  selectedArena: string;
  onArenaSelect: (arena: string) => void;
}

const arenas = [
  { number: 1, name: "Arena de Treinamento", image: arena1 },
  { number: 2, name: "Arena de Ossos", image: arena2 },
  { number: 3, name: "Arena de Bárbaros", image: arena3 },
  { number: 4, name: "Arena P.E.K.K.A", image: arena4 },
  { number: 5, name: "Arena de Feitiços", image: arena5 },
  { number: 6, name: "Arena de Construtores", image: arena6 },
  { number: 7, name: "Arena Real", image: arena7 },
  { number: 8, name: "Arena Congelada", image: arena8 },
  { number: 9, name: "Arena da Selva", image: arena9 },
  { number: 10, name: "Arena do Hog Mountain", image: arena10 },
  { number: 11, name: "Arena Elétrica", image: arena11 },
  { number: 12, name: "Arena Batedeira", image: arena12 },
  { number: 13, name: "Arena do Pico Renegado", image: arena13 },
  { number: 14, name: "Arena Lendária", image: arena14 },
  { number: 15, name: "Arena Campeão", image: arena15 },
  { number: 16, name: "Arena Desafio", image: arena16 },
  { number: 17, name: "Arena Mestre", image: arena17 },
  { number: 18, name: "Arena Suprema", image: arena18 },
  { number: 19, name: "Arena Titã", image: arena19 },
  { number: 20, name: "Arena Final", image: arena20 },
];

export const ArenaSelector = ({ selectedArena, onArenaSelect }: ArenaSelectorProps) => {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2 sm:gap-3">
      {arenas.map((arena) => (
        <div
          key={arena.number}
          onClick={() => onArenaSelect(arena.number.toString())}
          className={`
            relative cursor-pointer transition-all duration-300 group
            rounded-lg overflow-hidden
            hover:scale-110 hover:z-10
            ${selectedArena === arena.number.toString() 
              ? 'ring-2 ring-accent shadow-gold scale-105 z-10' 
              : 'hover:ring-1 hover:ring-primary/50'
            }
          `}
        >
          <div className="relative aspect-square bg-card/50">
            <img 
              src={arena.image} 
              alt={arena.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-0 left-0 right-0 p-1 sm:p-1.5">
              <div className="font-bold text-foreground text-center text-[10px] sm:text-xs drop-shadow-lg">
                {arena.number}
              </div>
            </div>
          </div>
          {selectedArena === arena.number.toString() && (
            <div className="absolute top-1 right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-accent flex items-center justify-center shadow-lg">
              <span className="text-accent-foreground text-[8px] sm:text-[10px] font-bold">✓</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
