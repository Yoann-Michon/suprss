import { Box, Typography, Skeleton } from "@mui/material";
import { Image as ImageIcon } from "@mui/icons-material";
import type { ArticleContent } from "../../context/ArticleContext";

interface ArticleContentProps {
  content: ArticleContent | null;
  loading: boolean;
  error: string | null;
  colors: any;
  t: any;
}

export const ArticleContentDisplay = ({ 
  content, 
  loading, 
  error, 
  colors, 
  t 
}: ArticleContentProps) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ borderBottom: `2px solid ${colors.background.hover}`, pb: 1 }}>
        {t("pages.article.content")}
      </Typography>
      
      {loading ? (
        <Box>
          <Skeleton variant="rectangular" height={200} sx={{ mb: 2, borderRadius: 1 }} />
          <Skeleton height={40} sx={{ mb: 1 }} />
          <Skeleton height={40} sx={{ mb: 1 }} />
          <Skeleton height={40} width="60%" />
        </Box>
      ) : error ? (
        <Box 
          sx={{ 
            p: 3, 
            bgcolor: colors.background.default, 
            borderRadius: 2,
            textAlign: 'center',
            border: `1px dashed ${colors.background.hover}`
          }}
        >
          <ImageIcon sx={{ fontSize: 48, color: colors.text.tertiary, mb: 1 }} />
          <Typography color={colors.text.secondary} gutterBottom>
            {error}
          </Typography>
          <Typography variant="body2" color={colors.text.tertiary}>
            {t("pages.article.clickReadOriginal") || 'Click "Read Original" to view the full article'}
          </Typography>
        </Box>
      ) : content ? (
        <Box 
          sx={{ 
            '& img': { 
              maxWidth: '100%', 
              height: 'auto',
              borderRadius: 1,
              mb: 2
            },
            '& p': { 
              mb: 2, 
              lineHeight: 1.7,
              fontSize: '1.1rem'
            },
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              color: colors.text.primary,
              fontWeight: 'bold',
              mt: 3,
              mb: 2
            },
            '& a': {
              color: colors.primary,
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            },
            '& blockquote': {
              borderLeft: `4px solid ${colors.primary}`,
              bgcolor: colors.background.default,
              p: 2,
              my: 2,
              borderRadius: 1,
              fontStyle: 'italic'
            },
            '& ul, & ol': {
              pl: 3,
              mb: 2
            },
            '& li': {
              mb: 1
            }
          }}
          dangerouslySetInnerHTML={{
            __html: content.content
          }}
        />
      ) : null}
    </Box>
  );
};