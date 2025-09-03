import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
} from "@mui/material";
import { useThemeColors } from "../component/ThemeModeContext";
import { useTranslation } from "react-i18next";
import { useArticle } from "../context/ArticleContext";

const Favorites = () => {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const { favoriteArticles, showArticle } = useArticle();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: { xs: 2, md: 4 },
        backgroundColor: colors.background.default,
      }}
    >
      <Typography variant="h5" fontWeight={600} color={colors.text.primary} mb={3}>
        {t("pages.favorites.title") }
      </Typography>

      {favoriteArticles.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="body1" color={colors.text.secondary} gutterBottom>
            {t("pages.favorites.empty")}
          </Typography>
          <Typography variant="body2" color={colors.text.tertiary}>
            {t("pages.favorites.emptyDescription")}
          </Typography>
        </Box>
      ) : (
        <Stack spacing={3}>
          {favoriteArticles.map((article) => (
            <Card
              key={article.id}
              sx={{
                bgcolor: colors.background.paper,
                borderRadius: 2,
                border: `1px solid ${colors.background.hover}`,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 4px 12px ${colors.primary}15`,
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" color={colors.text.primary} fontWeight={600} sx={{ flex: 1, mr: 2 }}>
                    {article.title}
                  </Typography>
                  <Typography variant="caption" color={colors.text.tertiary}>
                    {new Date(article.pubDate).toLocaleDateString()}
                  </Typography>
                </Box>
                
                {article.excerpt && (
                  <Typography 
                    variant="body2" 
                    color={colors.text.secondary} 
                    mb={2}
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      lineHeight: 1.5,
                    }}
                  >
                    {article.excerpt}
                  </Typography>
                )}
                
                {article.tags && article.tags.length > 0 && (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
                    {article.tags.slice(0, 3).map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontSize: "0.7rem",
                          height: "22px",
                          borderColor: `${colors.primary}40`,
                          color: colors.text.secondary,
                          backgroundColor: `${colors.primary}08`,
                        }}
                      />
                    ))}
                    {article.tags.length > 3 && (
                      <Typography variant="caption" color={colors.text.tertiary} sx={{ alignSelf: "center" }}>
                        +{article.tags.length - 3}
                      </Typography>
                    )}
                  </Box>
                )}
                
                <Typography variant="caption" color={colors.text.tertiary}>
                  {article.author 
                    ? `${t("pages.favorites.by") } ${article.author}` 
                    : t("pages.article.unknownAuthor")
                  }
                </Typography>
              </CardContent>
              
              <CardActions sx={{ pt: 0 }}>
                <Button 
                  size="small" 
                  onClick={() => showArticle(article, '/favorite')}
                  sx={{
                    color: colors.primary,
                    "&:hover": {
                      backgroundColor: `${colors.primary}10`,
                    },
                  }}
                >
                  {t("pages.favorites.view")}
                </Button>
              </CardActions>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default Favorites;