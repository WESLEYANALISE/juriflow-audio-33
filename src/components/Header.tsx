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
  availableBooks = 0,
  onBookSelect
}: HeaderProps) => {
  return <header className="sticky top-0 z-50 w-full border-b border-border bg-surface-glass/95 backdrop-blur supports-[backdrop-filter]:bg-surface-glass/95">
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="text-xl font-bold text-foreground">Clássicos Jurídicos</h1>
              </div>
              <p className="text-xs text-muted-foreground">Leitura e Download</p>
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        </div>
        
        {onBookSelect && <GlobalSearch onBookSelect={onBookSelect} />}
      </div>
    </header>;
};