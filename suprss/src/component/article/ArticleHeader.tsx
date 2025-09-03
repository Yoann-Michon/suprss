import { Box, Button, Typography, Chip } from "@mui/material";
import { ArrowBack, OpenInNew } from "@mui/icons-material";
import type { Article } from "../../context/ArticleContext";

export interface ArticleHeaderProps {
  article: Article;
  colors: any;
  t: any;
  onBack: () => void;
  onOpenOriginal: () => void;
  siteName?: string;
}

export const ArticleHeader = ({ 
  article, 
  colors, 
  t, 
  onBack, 
  onOpenOriginal, 
  siteName 
}: ArticleHeaderProps) => {
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={onBack}
          sx={{
            color: colors.primary,
            textTransform: "none",
            "&:hover": {
              backgroundColor: colors.background.hover,
            },
          }}
        >
          {t("common.back")}
        </Button>

        <Button
          endIcon={<OpenInNew />}
          onClick={onOpenOriginal}
          variant="outlined"
          sx={{
            color: colors.primary,
            borderColor: colors.primary,
            textTransform: "none",
            "&:hover": {
              backgroundColor: colors.background.hover,
              borderColor: colors.primary,
            },
          }}
        >
          {t("pages.article.readOriginal") }
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color={colors.text.tertiary} gutterBottom>
          {article.author ?? t("pages.article.unknownAuthor")} • {new Date(article.pubDate).toLocaleDateString()}
          {siteName && ` • ${siteName}`}
        </Typography>
        
        {article.tags && article.tags.length > 0 && (
          <Box sx={{ mt: 1, mb: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
            {article.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: colors.primary,
                  color: colors.primary,
                  backgroundColor: `${colors.primary}10`,
                  "&:hover": {
                    backgroundColor: `${colors.primary}20`,
                  },
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    </>
  );
};
