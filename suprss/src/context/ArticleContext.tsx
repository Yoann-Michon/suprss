import { createContext, useContext, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export interface Article {
  title: string;
  description: string;
  content: string;
  thumbnail?: string;
  source?: string;
  link?: string;
}

interface ArticleContextType {
  showArticle: (article: Article, all?: Article[]) => void;
}

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

export const useArticle = (): ArticleContextType => {
  const context = useContext(ArticleContext);
  if (!context) {
    throw new Error("useArticle must be used within an ArticleProvider");
  }
  return context;
};

export const ArticleProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const showArticle = (article: Article, all: Article[] = []) => {
  const slug = article.title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 100);

  const currentPath = window.location.pathname;
    
  navigate(`/article/${slug}`, {
    replace: false,
    state: { article, all, from: currentPath },
  });
};

  return (
    <ArticleContext.Provider value={{ showArticle }}>
      {children}
    </ArticleContext.Provider>
  );
};
