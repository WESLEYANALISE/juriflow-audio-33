import { useState, useEffect } from "react";
import { BooksGrid } from "@/components/BooksGrid";
import { BookDetail } from "@/components/BookDetail";
import { Header } from "@/components/Header";
import { AreasGrid } from "@/components/AreasGrid";
import { FloatingButton } from "@/components/FloatingButton";
export interface BookItem {
  id: number;
  livro: string;
  autor: string;
  sobre: string;
  imagem: string;
  link: string;
  download?: string;
  beneficios?: string;
  isRead?: boolean;
}
const Index = () => {
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [readBooks, setReadBooks] = useState<Set<number>>(new Set());
  const [favoriteBooks, setFavoriteBooks] = useState<Set<number>>(new Set());
  const [recentBooks, setRecentBooks] = useState<BookItem[]>([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [availableBooks, setAvailableBooks] = useState(0);
  const [highlightedBookId, setHighlightedBookId] = useState<number | null>(null);

  // Load favorites and recent books from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteBooks');
    const savedRecent = localStorage.getItem('recentBooks');
    if (savedFavorites) {
      setFavoriteBooks(new Set(JSON.parse(savedFavorites)));
    }
    if (savedRecent) {
      setRecentBooks(JSON.parse(savedRecent));
    }
  }, []);
  const handleBookSelect = (book: BookItem, area: string) => {
    setSelectedArea(area);
    setHighlightedBookId(book.id);

    // Smooth scroll to highlighted book after area loads
    setTimeout(() => {
      const bookElement = document.querySelector(`[data-book-id="${book.id}"]`);
      if (bookElement) {
        bookElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 500);

    // Remove highlight after 5 seconds
    setTimeout(() => {
      setHighlightedBookId(null);
    }, 5000);
  };
  const handleBookClick = (book: BookItem) => {
    // Add to recent books
    setRecentBooks(prev => {
      const filtered = prev.filter(b => b.id !== book.id);
      const newRecent = [book, ...filtered].slice(0, 10);
      localStorage.setItem('recentBooks', JSON.stringify(newRecent));
      return newRecent;
    });
    setReadBooks(prev => new Set(prev.add(book.id)));
    setSelectedBook(book);
  };
  const handleFavorite = (bookId: number, isFavorite: boolean) => {
    setFavoriteBooks(prev => {
      const newFavorites = new Set(prev);
      if (isFavorite) {
        newFavorites.add(bookId);
      } else {
        newFavorites.delete(bookId);
      }
      localStorage.setItem('favoriteBooks', JSON.stringify(Array.from(newFavorites)));
      return newFavorites;
    });
  };
  const favoriteBookItems = recentBooks.filter(book => favoriteBooks.has(book.id));
  return <div className="min-h-screen bg-background">
      {!selectedArea && !selectedBook && <Header totalBooks={totalBooks} availableBooks={availableBooks} />}
      <main className="container mx-auto py-6 max-w-4xl px-[8px]">
        {selectedBook ? <BookDetail book={selectedBook} onBack={() => setSelectedBook(null)} onFavorite={handleFavorite} isFavorite={favoriteBooks.has(selectedBook.id)} /> : selectedArea ? <BooksGrid selectedArea={selectedArea} onBookClick={handleBookClick} onBack={() => {
        setSelectedArea(null);
        setHighlightedBookId(null);
      }} readBooks={readBooks} onStatsUpdate={(total, available) => {
        setTotalBooks(total);
        setAvailableBooks(available);
      }} highlightedBookId={highlightedBookId} onFavorite={handleFavorite} favoriteBooks={favoriteBooks} /> : <AreasGrid onAreaClick={setSelectedArea} onBookSelect={handleBookSelect} />}
      </main>
      
      <FloatingButton recentBooks={recentBooks} favoriteBooks={favoriteBookItems} onBookClick={handleBookClick} />
    </div>;
};
export default Index;