import { BookOpen } from "lucide-react";
import { GlobalSearch } from "./GlobalSearch";
import { BookItem } from "@/pages/Index";
interface HeaderProps {
  totalBooks?: number;
  availableBooks?: number;
  onBookSelect?: (book: BookItem, area: string) => void;
}
export const Header = ({
  totalBooks = 0,
  availableBooks = 0
}: Omit<HeaderProps, 'onBookSelect'>) => {
  return <header className="w-full border-b border-border/50 bg-surface-glass/95 backdrop-blur-xl supports-[backdrop-filter]:bg-surface-glass/95 shadow-card">
      <div className="container mx-auto px-4 py-5 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-primary shadow-glow">
              <BookOpen className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">Clássicos Jurídicos</h1>
              </div>
              <p className="text-sm text-muted-foreground font-medium">Biblioteca Digital Elegante</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-glow" />
            <span className="text-xs text-muted-foreground font-medium">Online</span>
          </div>
        </div>
        
        
      </div>
    </header>;
};