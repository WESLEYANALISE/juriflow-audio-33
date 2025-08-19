import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Scale, Award, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";
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
}
export const AreasGrid = ({
  onAreaClick
}: AreasGridProps) => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentBooks, setRecentBooks] = useState<RecentBook[]>([]);
  const getAreaConfig = (areaName: string) => {
    switch (areaName.toLowerCase()) {
      case 'classicos':
        return {
          color: "bg-gradient-to-br from-blue-400 to-blue-600",
          icon: <Scale className="w-8 h-8 text-white" />
        };
      case 'liderança':
        return {
          color: "bg-gradient-to-br from-orange-400 to-orange-600",
          icon: <Award className="w-8 h-8 text-white" />
        };
      case 'oratoria':
        return {
          color: "bg-gradient-to-br from-green-400 to-green-600",
          icon: <MessageSquare className="w-8 h-8 text-white" />
        };
      default:
        return {
          color: "bg-gradient-to-br from-purple-400 to-purple-600",
          icon: <Scale className="w-8 h-8 text-white" />
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Acervo de Clássicos Jurídicos
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Acervo da Biblioteca Universitária
          </p>
          <p className="text-muted-foreground mb-6">
            organizada por áreas de especialização
          </p>
        </div>

        {/* Recent Books Carousel */}
        {recentBooks.length > 0 && <div className="mb-8">
            <h2 className="text-xl font-semibold text-center text-foreground mb-4">
              Últimos Livros
            </h2>
            <Carousel plugins={[Autoplay({
          delay: 2000,
          stopOnInteraction: false,
          stopOnMouseEnter: true
        })]} className="w-full max-w-4xl mx-auto" opts={{
          align: "start",
          loop: true
        }}>
              <CarouselContent className="-ml-2 md:-ml-4">
                {recentBooks.map((book, index) => <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/4 md:basis-1/6">
                    <div className="flex flex-col items-center">
                      <img src={book.imagem} alt={book.livro} className="w-20 h-26 object-cover rounded shadow-md hover:scale-105 transition-transform duration-200" />
                    </div>
                  </CarouselItem>)}
              </CarouselContent>
            </Carousel>
          </div>}
        
        {/* Subtle separator */}
        <div className="flex justify-center mb-8">
          <div className="w-32 h-px bg-border opacity-50"></div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
          {areas.map(area => <Card key={area.name} className={`${area.color} p-8 cursor-pointer hover:scale-105 transition-transform duration-200 border-0 text-white`} onClick={() => onAreaClick(area.name)}>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                  {area.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    {area.name}
                  </h3>
                  <div className="bg-white/20 rounded-full text-sm inline-block py-0 px-[16px]">
                    {area.count} {area.count === 1 ? 'livro disponível' : 'livros disponíveis'}
                  </div>
                </div>
              </div>
            </Card>)}
        </div>
      </div>
    </div>;
};