import { Box, Button } from "@mui/material";
import { Share, Favorite, FavoriteBorder } from "@mui/icons-material";

interface ArticleActionsProps {
  isFavorite: boolean;
  onShare: () => void;
  onToggleFavorite: () => void;
  colors: any;
  t: any;
  loading?: boolean;
}

export const ArticleActions = ({ 
  isFavorite, 
  onShare, 
  onToggleFavorite, 
  colors, 
  t,
  loading = false
}: ArticleActionsProps) => {
  return (
    <Box sx={{ mt: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
      <Button
        variant="outlined"
        startIcon={<Share />}
        onClick={onShare}
        disabled={loading}
        sx={{
          textTransform: "none",
          borderColor: colors.primary,
          color: colors.primary,
          "&:hover": {
            backgroundColor: colors.background.hover,
          },
        }}
      >
        {t('common.share') || 'Share'}
      </Button>
      
      <Button
        variant="outlined"
        startIcon={isFavorite ? <Favorite /> : <FavoriteBorder />}
        onClick={onToggleFavorite}
        disabled={loading}
        sx={{
          textTransform: "none",
          borderColor: colors.primary,
          color: colors.primary,
          "&:hover": {
            backgroundColor: colors.background.hover,
          },
        }}
      >
        {isFavorite 
          ? (t('pages.article.removeFromFavorites') || 'Remove from favorites')
          : (t('pages.article.addToFavorites') || 'Add to favorites')
        }
      </Button>
    </Box>
  );
};