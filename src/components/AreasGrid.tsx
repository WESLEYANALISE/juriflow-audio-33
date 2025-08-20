import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Scale, Award, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { GlobalSearch } from "./GlobalSearch";
import { BookItem } from "@/pages/Index";
interface Area {
  name: string;
  count: number;
  color: string;
  icon: React.ReactNode;
}
interface RecentBook {
  livro: string;
  imagem: string;
}
interface AreasGridProps {
  onAreaClick: (area: string) => void;
  onBookSelect?: (book: BookItem, area: string) => void;
}
export const AreasGrid = ({
  onAreaClick,
  onBookSelect
}: AreasGridProps) => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentBooks, setRecentBooks] = useState<RecentBook[]>([]);
  const getAreaConfig = (areaName: string) => {
    switch (areaName.toLowerCase()) {
      case 'classicos':
        return {
          color: "bg-gradient-to-br from-blue-400 to-blue-600",
          icon: <Scale className="w-5 h-5 md:w-6 md:h-6 text-white" />
        };
      case 'liderança':
        return {
          color: "bg-gradient-to-br from-orange-400 to-orange-600",
          icon: <Award className="w-5 h-5 md:w-6 md:h-6 text-white" />
        };
      case 'oratoria':
        return {
          color: "bg-gradient-to-br from-green-400 to-green-600",
          icon: <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-white" />
        };
      default:
        return {
          color: "bg-gradient-to-br from-purple-400 to-purple-600",
          icon: <Scale className="w-5 h-5 md:w-6 md:h-6 text-white" />
        };
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch recent books
        const {
          data: booksData
        } = await supabase.from("BIBLIOTECA-CLASSICOS").select("livro, imagem").not("imagem", "is", null).neq("imagem", "").order("id", {
          ascending: false
        }).limit(10);
        if (booksData) {
          setRecentBooks(booksData);
        }

        // Fetch areas
        const {
          data: areasData,
          error
        } = await supabase.from("BIBLIOTECA-CLASSICOS").select("area").not("area", "is", null);
        if (error) {
          console.error("Error fetching areas:", error);
          return;
        }

        // Count books by area
        const areaCounts = areasData.reduce((acc: Record<string, number>, item) => {
          const area = item.area;
          acc[area] = (acc[area] || 0) + 1;
          return acc;
        }, {});

        // Create areas array with counts and styling
        const areasDataFormatted = Object.entries(areaCounts).map(([areaName, count]) => {
          const config = getAreaConfig(areaName);
          return {
            name: areaName,
            count: count as number,
            color: config.color,
            icon: config.icon
          };
        });
        setAreas(areasDataFormatted);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Carregando áreas...</span>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl py-0 my-0 px-[7px]">
        <div className="text-center mb-6">
          <div className="relative inline-block mb-3">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent leading-tight">
              Clássicos Jurídicos
            </h1>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-primary rounded-full" />
          </div>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Acervo da Biblioteca Universitária - Descubra os grandes clássicos do direito
          </p>
        </div>

        {/* Global Search */}
        {onBookSelect && (
          <div className="mb-6">
            <GlobalSearch onBookSelect={onBookSelect} />
          </div>
        )}

        {/* Recent Books Carousel */}
        {recentBooks.length > 0 && <div className="mb-8">
            <div className="text-center mb-4">
              <h2 className="text-lg md:text-xl font-bold text-foreground mb-1">
                Últimos Livros Adicionados
              </h2>
              <p className="text-sm text-muted-foreground">
                Descubra as mais recentes adições ao nosso acervo
              </p>
            </div>
            <Carousel plugins={[Autoplay({
          delay: 2000,
          stopOnInteraction: false,
          stopOnMouseEnter: true
        })]} className="w-full max-w-4xl mx-auto" opts={{
          align: "start",
          loop: true
        }}>
              <CarouselContent className="-ml-1 md:-ml-2">
                {recentBooks.map((book, index) => <CarouselItem key={index} className="pl-1 md:pl-2 basis-1/4 md:basis-1/6">
                    <div className="group flex flex-col items-center">
                      <div className="relative overflow-hidden rounded-lg shadow-card hover:shadow-elevated transition-all duration-300">
                        <img src={book.imagem} alt={book.livro} className="w-16 h-20 md:w-20 md:h-26 object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <p className="text-xs text-center text-muted-foreground mt-1 line-clamp-2 max-w-[64px] md:max-w-[80px] leading-tight">{book.livro}</p>
                    </div>
                  </CarouselItem>)}
              </CarouselContent>
            </Carousel>
          </div>}
        
        {/* Subtle separator */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-px bg-border opacity-50"></div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-2xl mx-auto">
          {areas.map(area => <Card key={area.name} className={`${area.color} p-4 md:p-6 cursor-pointer hover:scale-[1.02] hover:shadow-luxury transition-all duration-300 border-0 text-white relative overflow-hidden group`} onClick={() => onAreaClick(area.name)}>
              {/* Subtle overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="text-center space-y-3 md:space-y-4 relative z-10">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-xl md:rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  {area.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg md:text-xl font-bold leading-tight">
                    {area.name}
                  </h3>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full text-xs md:text-sm inline-block py-1.5 px-3 md:py-2 md:px-4 shadow-md">
                    {area.count} {area.count === 1 ? 'livro' : 'livros'}
                  </div>
                </div>
              </div>
            </Card>)}
        </div>
      </div>
    </div>;
};