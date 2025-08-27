import { useLocation, useNavigate } from "react-router-dom";
import { Button, Box, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../component/ThemeModeContext";

const ArticleView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const colors = useThemeColors();

  const article = location.state?.article;
  const from = location.state?.from || "/home";

  const handleClose = () => {
    navigate(from, { replace: true });
  };

  if (!article) {
    return (
      <Typography color={colors.text.secondary}>
        {t("pages.myFeed.emptyState.title")}
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: colors.background.paper,
        p: 2,
        borderRadius: 1,
        color: colors.text.primary,
        maxWidth: "80%",
        justifySelf: "center",
      }}
    >
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleClose}
        sx={{
          color: colors.primary,
          mb: 2,
          "&:hover": {
            backgroundColor: colors.background.hover,
          },
        }}
      >
        {t("common.back")}
      </Button>

      <Typography variant="h4" gutterBottom>
        {article.title}
      </Typography>
      <Typography variant="subtitle1" color={colors.text.tertiary}>
        {article.description}
      </Typography>
    </Box>
  );
};
export default ArticleView;