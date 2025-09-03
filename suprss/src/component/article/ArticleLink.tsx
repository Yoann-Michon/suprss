import { Box, Typography, Link } from "@mui/material";

interface ArticleLinkProps {
  link: string;
  colors: any;
  t: any;
}

export const ArticleLink = ({ link, colors, t }: ArticleLinkProps) => {
  return (
    <Box sx={{ mt: 4, p: 3, bgcolor: colors.background.default, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        {t("pages.article.readComplete") }
      </Typography>
      <Link
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          color: colors.primary,
          textDecoration: "none",
          wordBreak: "break-all",
          "&:hover": {
            textDecoration: "underline",
          },
        }}
      >
        {link}
      </Link>
    </Box>
  );
};