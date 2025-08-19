import { useState } from "react";
import { History, Heart, X, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { BookItem } from "@/pages/Index";

interface FloatingButtonProps {
  recentBooks: BookItem[];
  favoriteBooks: BookItem[];
  onBookClick: (book: BookItem) => void;
}

export const FloatingButton = ({ recentBooks, favoriteBooks, onBookClick }: FloatingButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-primary hover:shadow-luxury text-primary-foreground rounded-2xl shadow-elevated hover:scale-105 transition-all duration-300 flex items-center justify-center z-40 border border-primary/20 backdrop-blur-sm"
      >
        {isOpen ? <X className="h-7 w-7" /> : <History className="h-7 w-7" />}
      </button>

      {/* Floating Card */}
      {isOpen && (
        <div className="fixed bottom-28 right-6 w-80 max-w-[calc(100vw-3rem)] z-50 animate-in slide-in-from-bottom-5 fade-in-0 duration-300">
          <Card className="bg-gradient-card border-border/50 shadow-luxury backdrop-blur-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-foreground">
                Biblioteca Pessoal
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="recent" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mx-4 mb-4">
                  <TabsTrigger value="recent" className="flex items-center gap-2">
                    <History className="h-3 w-3" />
                    Recentes
                  </TabsTrigger>
                  <TabsTrigger value="favorites" className="flex items-center gap-2">
                    <Heart className="h-3 w-3" />
                    Favoritos
                  </TabsTrigger>
                </TabsList>
                
                <div className="px-4 pb-4 max-h-80 overflow-y-auto">
                  <TabsContent value="recent" className="mt-0">
                    {recentBooks.length > 0 ? (
                      <div className="space-y-2">
                        {recentBooks.slice(0, 5).map((book) => (
                          <div
                            key={book.id}
                            onClick={() => {
                              onBookClick(book);
                              setIsOpen(false);
                            }}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-glass cursor-pointer transition-all duration-200"
                          >
                            <div className="w-8 h-11 bg-gradient-primary rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {book.imagem ? (
                                <img 
                                  src={book.imagem} 
                                  alt={book.livro}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <BookOpen className="h-3 w-3 text-primary-foreground" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-medium text-foreground truncate">
                                {book.livro}
                              </h4>
                              <p className="text-xs text-muted-foreground truncate">
                                {book.autor}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground text-center py-4">Nenhum livro recente</p>
                    )}
                  </TabsContent>

                  <TabsContent value="favorites" className="mt-0">
                    {favoriteBooks.length > 0 ? (
                      <div className="space-y-2">
                        {favoriteBooks.slice(0, 5).map((book) => (
                          <div
                            key={book.id}
                            onClick={() => {
                              onBookClick(book);
                              setIsOpen(false);
                            }}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-glass cursor-pointer transition-all duration-200"
                          >
                            <div className="w-8 h-11 bg-gradient-primary rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {book.imagem ? (
                                <img 
                                  src={book.imagem} 
                                  alt={book.livro}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <BookOpen className="h-3 w-3 text-primary-foreground" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-medium text-foreground truncate">
                                  {book.livro}
                                </h4>
                                <Heart className="h-3 w-3 text-red-500 fill-red-500 flex-shrink-0" />
                              </div>
                              <p className="text-xs text-muted-foreground truncate">
                                {book.autor}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground text-center py-4">Nenhum favorito ainda</p>
                    )}
                  </TabsContent>
                </div>

                {(recentBooks.length > 0 || favoriteBooks.length > 0) && (
                  <div className="px-4 pb-4 pt-2 border-t border-border">
                    <Badge variant="outline" className="text-xs">
                      {recentBooks.length + favoriteBooks.length} livros na biblioteca
                    </Badge>
                  </div>
                )}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};