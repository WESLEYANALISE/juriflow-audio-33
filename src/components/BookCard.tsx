import { BookItem } from "@/pages/Index";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Download, Heart } from "lucide-react";
import { useState } from "react";

interface BookCardProps {
  book: BookItem;
  onClick: () => void;
  onFavorite?: (bookId: number, isFavorite: boolean) => void;
  isFavorite?: boolean;
}

export const BookCard = ({ book, onClick, onFavorite, isFavorite = false }: BookCardProps) => {
  const [localFavorite, setLocalFavorite] = useState(isFavorite);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavoriteState = !localFavorite;
    setLocalFavorite(newFavoriteState);
    onFavorite?.(book.id, newFavoriteState);
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:border-primary/30 border ${
        book.isRead ? 'bg-accent/50 border-accent' : 'bg-card border-border'
      } w-full`}
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="flex gap-3 p-3 sm:gap-4 sm:p-4">
          <div className="relative flex-shrink-0">
            <div className="w-24 h-32 sm:w-28 sm:h-36 bg-gradient-primary rounded-lg flex items-center justify-center overflow-hidden shadow-md">
              {book.imagem ? (
                <img 
                  src={book.imagem} 
                  alt={book.livro}
                  className="w-full h-full object-cover"
                />
              ) : (
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary-foreground" />
              )}
            </div>
            
            
            {/* Indicators */}
            <div className="absolute -top-1 -right-1 flex flex-col gap-1">
              {book.link && (
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded-full flex items-center justify-center">
                  <BookOpen className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary-foreground" />
                </div>
              )}
              {book.download && (
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Download className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-foreground text-xs sm:text-sm leading-tight line-clamp-2">
                {book.livro}
              </h3>
              {book.isRead && (
                <Badge variant="secondary" className="text-xs shrink-0">
                  Lida
                </Badge>
              )}
            </div>
            
            <p className="text-xs text-primary font-medium mb-1">
              {book.autor}
            </p>
            
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {book.sobre}
            </p>
            
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                Clássico
              </Badge>
              {book.download && (
                <Badge variant="secondary" className="text-xs">
                  Download
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};