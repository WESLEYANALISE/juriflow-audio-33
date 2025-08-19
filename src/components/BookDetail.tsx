import { useEffect, useState } from "react";
import { BookItem } from "@/pages/Index";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Download, ExternalLink, X, Heart } from "lucide-react";
import { YouTubePlayer } from "./YouTubePlayer";
import { isYouTubeUrl, extractYouTubeId } from "@/lib/utils";
interface BookDetailProps {
  book: BookItem;
  onBack: () => void;
  onFavorite?: (bookId: number, isFavorite: boolean) => void;
  isFavorite?: boolean;
}
export const BookDetail = ({
  book,
  onBack,
  onFavorite,
  isFavorite = false
}: BookDetailProps) => {
  const [showReader, setShowReader] = useState(false);
  const [contentUrl, setContentUrl] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const handleReadNow = () => {
    if (book.link) {
      if (isYouTubeUrl(book.link)) {
        const id = extractYouTubeId(book.link);
        if (id) {
          setVideoId(id);
          setIsVideo(true);
          setShowReader(true);
        }
      } else {
        setContentUrl(book.link);
        setIsVideo(false);
        setShowReader(true);
      }
    }
  };
  const handleDownload = () => {
    if (book.download) {
      window.open(book.download, '_blank', 'noopener,noreferrer');
    }
  };
  if (showReader) {
    return <div className="fixed inset-0 bg-background z-50">
        <Button onClick={() => {
        setShowReader(false);
        setContentUrl(null);
        setVideoId(null);
        setIsVideo(false);
      }} className="fixed top-4 right-4 z-60 bg-primary/20 backdrop-blur-sm border border-primary/30 text-foreground hover:bg-primary/30">
          <X className="h-4 w-4 mr-2" />
          Fechar
        </Button>
        <div className="w-full h-full">
          <div className="w-full h-full">
            {isVideo && videoId ? <YouTubePlayer videoId={videoId} onVideoEnd={() => setShowReader(false)} onVideoStart={() => {}} /> : contentUrl ? <iframe src={contentUrl} className="w-full h-full border-0" title={book.livro} sandbox="allow-same-origin allow-scripts allow-popups allow-forms" /> : null}
          </div>
        </div>
      </div>;
  }
  return <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 bg-primary/20 backdrop-blur-sm border border-primary/30 text-foreground hover:bg-primary/30">
        <ArrowLeft className="h-4 w-4" />
        Voltar para biblioteca
      </Button>

      {/* Book Cover and Action Buttons */}
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6">
            {/* Book Cover - Centralized */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-48 h-64 bg-gradient-primary rounded-lg flex items-center justify-center overflow-hidden shadow-lg">
                  {book.imagem ? <img src={book.imagem} alt={book.livro} className="w-full h-full object-cover" /> : <BookOpen className="h-16 w-16 text-primary-foreground" />}
                </div>
                {/* Favorite Heart */}
                {onFavorite && (
                  <button
                    onClick={() => onFavorite(book.id, !isFavorite)}
                    className="absolute -top-2 -right-2 w-10 h-10 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-border hover:bg-background transition-all duration-200 shadow-lg"
                  >
                    <Heart 
                      className={`h-5 w-5 transition-colors ${
                        isFavorite ? 'text-red-500 fill-red-500' : 'text-muted-foreground hover:text-red-500'
                      }`} 
                    />
                  </button>
                )}
              </div>
            </div>
            
            {/* Book Title and Author - After Cover */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-foreground leading-tight">
                {book.livro}
              </h1>
              <p className="text-lg text-primary font-medium">
                por {book.autor}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2 justify-center max-w-md mx-auto">
              <Button onClick={handleReadNow} disabled={!book.link} className="flex-1 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Ler agora
              </Button>
              <Button variant="secondary" onClick={handleDownload} disabled={!book.download} className="flex-1 flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>

            {/* Book Details */}
            <div className="space-y-6">
              {/* About the Book */}
              {book.sobre && <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Sobre o Livro
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {book.sobre}
                  </p>
                </div>}

              {/* Benefits */}
              {book.beneficios && <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Benefícios da Leitura
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {book.beneficios}
                  </p>
                </div>}

              {/* Additional Info */}
              <div className="pt-4 border-t border-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Autor:</span>
                    <span className="ml-2 text-foreground font-medium">{book.autor}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Categoria:</span>
                    <span className="ml-2 text-foreground font-medium">Clássico</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Leitura Online:</span>
                    <span className="ml-2 text-foreground font-medium">
                      {book.link ? 'Disponível' : 'Indisponível'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Download:</span>
                    <span className="ml-2 text-foreground font-medium">
                      {book.download ? 'Disponível' : 'Indisponível'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Actions */}
      {book.link && <Card>
          
        </Card>}
    </div>;
};