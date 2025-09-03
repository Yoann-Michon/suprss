import { Box, Typography } from "@mui/material";

interface ArticleExcerptProps {
  excerpt: string;
  colors: any;
}

export const ArticleExcerpt = ({ excerpt, colors }: ArticleExcerptProps) => {
  if (!excerpt) return null;

  return (
    <Box
      sx={{
        bgcolor: colors.background.default,
        p: 3,
        borderRadius: 2,
        borderLeft: `4px solid ${colors.primary}`,
        mb: 3,
      }}
    >
      <Typography 
        variant="h6" 
        color={colors.text.secondary}
        sx={{
          fontStyle: "italic",
          lineHeight: 1.6,
        }}
        dangerouslySetInnerHTML={{
          __html: excerpt,
        }}
      />
    </Box>
  );
};