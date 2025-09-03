import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import { useThemeColors } from "../component/ThemeModeContext";
import { useTranslation } from "react-i18next";
import { useArticle, type Article } from "../context/ArticleContext";
import { useEffect, useState } from "react";

const Favorites = () => {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const { showArticle } = useArticle();

  const [favoriteArticles, setFavoriteArticles] = useState<Article[]>([]);

  useEffect(() => {
    const allArticles: Article[] = JSON.parse(localStorage.getItem("allArticles") || "[]");
    setFavoriteArticles(allArticles.filter(a => a.favorite));
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: { xs: 2, md: 4 },
        backgroundColor: colors.background.default,
      }}
    >
      <Typography variant="h5" fontWeight={600} color={colors.text.primary} mb={3}>
        {t("pages.favorites.title", "Articles favoris")}
      </Typography>

      {favoriteArticles.length === 0 ? (
        <Typography color={colors.text.secondary}>
          {t("pages.favorites.empty", "Vous n'avez aucun article favori")}
        </Typography>
      ) : (
        <Stack spacing={3} direction="row" flexWrap="wrap">
          {favoriteArticles.map((article: Article) => (
            <Card
              key={article.id}
              sx={{
                minWidth: 280,
                maxWidth: 340,
                bgcolor: colors.background.paper,
                borderRadius: 3,
                boxShadow: 2,
                m: 1,
                flex: "1 1 300px",
              }}
            >
              <CardContent>
                <Typography variant="h6" color={colors.text.primary} fontWeight={600}>
                  {article.title}
                </Typography>
                <Typography variant="body2" color={colors.text.secondary} mb={1}>
                  {article.excerpt || ""}
                </Typography>
                <Typography variant="caption" color={colors.text.secondary}>
                  {article.author ? `${t("pages.favorites.by", "Par")} ${article.author}` : ""}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => showArticle(article, favoriteArticles)}>
                  {t("pages.favorites.view", "Voir l'article")}
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
