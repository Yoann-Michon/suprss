// context/ArticleContext.tsx
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api.service";

export interface Article {
  id: string;
  title: string;
  link: string;
  excerpt?: string;
  favorite: boolean;
  pubDate: Date;
  author?: string;
  feedId: string;
  userIdsRead?: string[];
  tags?: string[];
}

export interface ArticleContent {
  title: string;
  content: string;
  image?: string;
  author?: string;
  publishedTime?: string;
  siteName?: string;
}

interface ArticleContextType {
  showArticle: (article: Article, from?: string) => void;
  
  articles: Article[];
  setArticles: (articles: Article[]) => void;
  updateArticle: (articleId: string, updates: Partial<Article>) => void;
  
  toggleFavorite: (articleId: string) => Promise<Article>;
  markAsRead: (articleId: string) => Promise<void>;
  
  favoriteArticles: Article[];
  getFavoriteArticles: () => Article[];
  
  getArticlesByFeed: (feedId: string) => Article[];
  getArticlesByTag: (tag: string) => Article[];
  getReadArticles: () => Article[];
  getUnreadArticles: () => Article[];
  
  fetchArticleContent: (url: string) => Promise<ArticleContent | null>;
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
  const [articles, setArticles] = useState<Article[]>([]);

  // Navigation vers un article
  const showArticle = useCallback((article: Article, from?: string) => {
    const slug = article.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .slice(0, 100);

    const currentPath = from || window.location.pathname;

    navigate(`/article/${slug}`, {
      replace: false,
      state: { article, from: currentPath },
    });
  }, [navigate]);

  const updateArticle = useCallback((articleId: string, updates: Partial<Article>) => {
    setArticles(prev => 
      prev.map(article => 
        article.id === articleId 
          ? { ...article, ...updates }
          : article
      )
    );
  }, []);

  const toggleFavorite = useCallback(async (articleId: string): Promise<Article> => {
    try {
      const updatedArticle = await api<Article>(
        `/feed/articles/${articleId}/favorite`,
        { method: "POST" }
      );
      
      updateArticle(articleId, { favorite: updatedArticle.favorite });
      
      return updatedArticle;
    } catch (error) {
      console.error("Error toggling favorite:", error);
      throw error;
    }
  }, [updateArticle]);

  const markAsRead = useCallback(async (articleId: string): Promise<void> => {
    try {
      await api("/feed/articles/read", {
        method: "PATCH",
        body: JSON.stringify(articleId),
      });
      
      updateArticle(articleId, {
        userIdsRead: [...(articles.find(a => a.id === articleId)?.userIdsRead || []), "current_user"]
      });
    } catch (error) {
      console.error("Failed to mark article as read:", error);
      throw error;
    }
  }, [updateArticle, articles]);

  const getFavoriteArticles = useCallback(() => {
    return articles.filter(article => article.favorite);
  }, [articles]);

  const favoriteArticles = getFavoriteArticles();

  const getArticlesByFeed = useCallback((feedId: string) => {
    return articles.filter(article => article.feedId === feedId);
  }, [articles]);

  const getArticlesByTag = useCallback((tag: string) => {
    return articles.filter(article => 
      article?.tags?.includes(tag)
    );
  }, [articles]);

  const getReadArticles = useCallback(() => {
    return articles.filter(article => 
      article.userIdsRead && article.userIdsRead.length > 0
    );
  }, [articles]);

  const getUnreadArticles = useCallback(() => {
    return articles.filter(article => 
      !article.userIdsRead || article.userIdsRead.length === 0
    );
  }, [articles]);

  const fetchArticleContent = useCallback(async (url: string): Promise<ArticleContent | null> => {
    try {
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      
      if (data.contents) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, 'text/html');
        
        const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content');
        const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
        const ogDescription = doc.querySelector('meta[property="og:description"]')?.getAttribute('content');
        const siteName = doc.querySelector('meta[property="og:site_name"]')?.getAttribute('content');
        
        let mainContent = '';
        const contentSelectors = [
          'article',
          '[role="main"]',
          '.post-content',
          '.entry-content',
          '.content',
          '.article-body',
          'main'
        ];
        
        for (const selector of contentSelectors) {
          const element = doc.querySelector(selector);
          if (element) {
            const scripts = element.querySelectorAll('script, style, nav, footer, aside, .advertisement');
            scripts.forEach(el => el.remove());
            
            mainContent = element.innerHTML;
            break;
          }
        }
        
        if (!mainContent) {
          const paragraphs = Array.from(doc.querySelectorAll('p'))
            .slice(0, 5)
            .map(p => p.outerHTML)
            .join('');
          mainContent = paragraphs;
        }
        
        return {
          title: ogTitle || "",
          content: mainContent || ogDescription || '',
          image: ogImage || "",
          siteName: siteName || "",
          author: undefined,
          publishedTime: undefined
        };
      }
      
      return null;
    } catch (error) {
      console.error('Failed to fetch article content:', error);
      return null;
    }
  }, []);

  const contextValue: ArticleContextType = {
    showArticle,
    
    articles,
    setArticles,
    updateArticle,
    
    toggleFavorite,
    markAsRead,
    
    favoriteArticles,
    getFavoriteArticles,
    
    getArticlesByFeed,
    getArticlesByTag,
    getReadArticles,
    getUnreadArticles,
    
    fetchArticleContent,
  };

  return (
    <ArticleContext.Provider value={contextValue}>
      {children}
    </ArticleContext.Provider>
  );
};