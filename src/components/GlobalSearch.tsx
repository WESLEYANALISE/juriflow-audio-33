import { useState, useEffect, useRef } from "react";
import { Search, Book, X } from "lucide-react";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { supabase } from "@/integrations/supabase/client";
import { BookItem } from "@/pages/Index";

interface GlobalSearchProps {
  onBookSelect: (book: BookItem, area: string) => void;
}

export const GlobalSearch = ({ onBookSelect }: GlobalSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<(BookItem & { area: string })[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchBooks = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        setIsOpen(false);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("BIBLIOTECA-CLASSICOS")
          .select("*")
          .or(`livro.ilike.%${searchQuery}%,autor.ilike.%${searchQuery}%`)
          .limit(10);

        if (error) {
          console.error("Error searching books:", error);
          return;
        }

        const books = (data || []).map((item: any) => ({
          id: item.id,
          livro: item.livro || 'Sem título',
          autor: item.autor || 'Autor não especificado',
          sobre: item.sobre || '',
          imagem: item.imagem,
          link: item.link,
          download: item.download || null,
          beneficios: item.beneficios || null,
          area: item.area
        }));

        setSearchResults(books);
        setIsOpen(books.length > 0);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchBooks, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleBookClick = (book: BookItem & { area: string }) => {
    onBookSelect(book, book.area);
    setSearchQuery("");
    setIsOpen(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsOpen(false);
  };

  return (
    <div className="relative max-w-md mx-auto" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Pesquisar livros ou autores..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10 bg-surface-elevated border-border"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 max-h-96 overflow-y-auto z-50 bg-surface-elevated border-border shadow-lg">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">
              Pesquisando...
            </div>
          ) : searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.map((book) => (
                <div
                  key={book.id}
                  onClick={() => handleBookClick(book)}
                  className="flex items-center gap-3 p-3 hover:bg-surface-glass cursor-pointer border-b border-border last:border-b-0"
                >
                  <div className="w-10 h-14 bg-gradient-primary rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {book.imagem ? (
                      <img 
                        src={book.imagem} 
                        alt={book.livro}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Book className="h-4 w-4 text-primary-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground truncate">
                      {book.livro}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {book.autor} • {book.area}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              Nenhum livro encontrado
            </div>
          )}
        </Card>
      )}
    </div>
  );
};