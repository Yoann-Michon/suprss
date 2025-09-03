import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { ArrowBack } from '@mui/icons-material';
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../component/ThemeModeContext";
import { useState, useEffect } from "react";
import { useArticle, type Article, type ArticleContent } from "../context/ArticleContext";
import { ArticleHeader } from "../component/article/ArticleHeader";
import { ArticleActions } from "../component/article/ArticleActions";
import { ArticleContentDisplay } from "../component/article/ArticleContent";
import { ArticleExcerpt } from "../component/article/ArticleExerpt";
import { ArticleImage } from "../component/article/ArticleImage";
import { ArticleLink } from "../component/article/ArticleLink";
import { ArticleTitle } from "../component/article/ArticleTitle";

const ArticleView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const colors = useThemeColors();

  const article: Article = location.state?.article;
  const from = location.state?.from || "/home";
  
  const [articleContent, setArticleContent] = useState<ArticleContent | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [contentError, setContentError] = useState<string | null>(null);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  
  const { toggleFavorite, fetchArticleContent, updateArticle, articles } = useArticle();

  const currentArticle = articles.find(a => a.id === article?.id) || article;

  useEffect(() => {
    if (article?.link) {
      loadArticleContent(article.link);
    }
  }, [article]);

  const loadArticleContent = async (url: string) => {
    setLoadingContent(true);
    setContentError(null);
    
    try {
      const content = await fetchArticleContent(url);
      if (content) {
        setArticleContent({
          ...content,
          title: content.title || article.title,
          author: content.author || article.author,
          publishedTime: content.publishedTime || article.pubDate.toISOString()
        });
      } else {
        setContentError(t("pages.article.contentError"));
      }
    } catch (error) {
      console.error('Failed to fetch article content:', error);
      setContentError(t("pages.article.contentError") );
    } finally {
      setLoadingContent(false);
    }
  };

  const handleClose = () => {
    navigate(from, { replace: true });
  };

  const handleOpenOriginal = () => {
    if (article?.link) {
      window.open(article.link, '_blank', 'noopener,noreferrer');
    }
  };

  const handleShare = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          url: article.link,
        });
      } catch (error) {
        await navigator.clipboard?.writeText(article.link);
      }
    } else if (article) {
      await navigator.clipboard?.writeText(article.link);
    }
  };

  const handleToggleFavorite = async () => {
    if (!currentArticle) return;
    
    setFavoriteLoading(true);
    try {
      await toggleFavorite(currentArticle.id);
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (!article) {
    return (
      <Box p={4}>
        <Typography color={colors.text.secondary}>
          {t("pages.home.noResults") }
        </Typography>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/home")}
          sx={{ mt: 2 }}
        >
          {t("common.back") }
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: colors.background.paper,
        p: 3,
        borderRadius: 2,
        color: colors.text.primary,
        maxWidth: "900px",
        margin: "0 auto",
        minHeight: "100vh",
      }}
    >
      <ArticleHeader
        article={currentArticle}
        colors={colors}
        t={t}
        onBack={handleClose}
        onOpenOriginal={handleOpenOriginal}
        siteName={articleContent?.siteName}
      />

      <ArticleTitle
        title={articleContent?.title || currentArticle.title}
        colors={colors}
      />

      <ArticleImage
        image={articleContent?.image || ""}
        title={articleContent?.title || currentArticle.title}
        colors={colors}
      />

      <ArticleExcerpt
        excerpt={currentArticle.excerpt || ""}
        colors={colors}
      />

      <ArticleContentDisplay
        content={articleContent}
        loading={loadingContent}
        error={contentError}
        colors={colors}
        t={t}
      />

      <ArticleLink
        link={currentArticle.link}
        colors={colors}
        t={t}
      />

      <ArticleActions
        isFavorite={currentArticle.favorite}
        onShare={handleShare}
        onToggleFavorite={handleToggleFavorite}
        colors={colors}
        t={t}
        loading={favoriteLoading}
      />
    </Box>
  );
};

export default ArticleView;