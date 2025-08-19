import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BookCard } from "./BookCard";
import { BookItem } from "@/pages/Index";
import { Loader2, Search } from "lucide-react";
import { Input } from "./ui/input";

interface BooksGridProps {
  selectedArea: string;
  onBookClick: (book: BookItem) => void;
  onBack: () => void;
  readBooks: Set<number>;
  onStatsUpdate?: (total: number, available: number) => void;
  highlightedBookId?: number | null;
  onFavorite?: (bookId: number, isFavorite: boolean) => void;
  favoriteBooks?: Set<number>;
}

export const BooksGrid = ({ selectedArea, onBookClick, onBack, readBooks, onStatsUpdate, highlightedBookId, onFavorite, favoriteBooks = new Set() }: BooksGridProps) => {
  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState<BookItem[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data, error } = await supabase
          .from("BIBLIOTECA-CLASSICOS")
          .select("*")
          .eq("area", selectedArea)
          .order("id", { ascending: false });

        if (error) {
          console.error("Error fetching books:", error);
          return;
        }

        // Map the data to match our BookItem interface
        const booksData = (data || []).map((item: any) => ({
          id: item.id,
          livro: item.livro || 'Sem título',
          autor: item.autor || 'Autor não especificado',
          sobre: item.sobre || '',
          imagem: item.imagem,
          link: item.link,
          download: item.download || null,
          beneficios: item.beneficios || null
        })) as BookItem[];
        
        // Sort books alphabetically by title
        const sortedBooks = booksData.sort((a, b) => a.livro.localeCompare(b.livro));
        setBooks(sortedBooks);
        setFilteredBooks(sortedBooks);
        
        // Update stats
        const availableDownloads = booksData.filter(book => book.download).length;
        onStatsUpdate?.(booksData.length, availableDownloads);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [selectedArea, onStatsUpdate]);

  useEffect(() => {
    const filtered = books.filter(book =>
      book.livro.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.autor.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [searchQuery, books]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Carregando livros...</span>
        </div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-lg font-medium text-foreground mb-2">
          Nenhum livro encontrado
        </h3>
        <p className="text-muted-foreground">
          Aguarde novos livros clássicos
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-primary/20 backdrop-blur-sm border border-primary/30 text-foreground hover:bg-primary/30 px-3 py-2 rounded-md transition-colors"
        >
          ← Voltar para áreas
        </button>
      </div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {selectedArea}
        </h2>
        <p className="text-muted-foreground mb-6">
          Livros clássicos para sua biblioteca pessoal
        </p>
        
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Pesquisar livros..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-surface-elevated border-border"
          />
        </div>
      </div>
      
      <div className="grid gap-3 sm:gap-4 md:gap-6">
        {filteredBooks.map((item) => (
          <div 
            key={item.id}
            data-book-id={item.id}
            className={`transition-all duration-500 ${
              highlightedBookId === item.id 
                ? 'ring-2 ring-yellow-400 ring-opacity-70 rounded-lg transform scale-[1.02]' 
                : ''
            }`}
          >
            <BookCard
              book={{...item, isRead: readBooks.has(item.id)}}
              onClick={() => onBookClick(item)}
              onFavorite={onFavorite}
              isFavorite={favoriteBooks.has(item.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};