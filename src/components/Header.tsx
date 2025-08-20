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
      
    </header>;
};