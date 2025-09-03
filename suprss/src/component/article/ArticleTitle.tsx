import { Typography } from "@mui/material";

interface ArticleTitleProps {
  title: string;
  colors: any;
}

export const ArticleTitle = ({ title, colors }: ArticleTitleProps) => {
  return (
    <Typography 
      variant="h4" 
      gutterBottom 
      sx={{ 
        fontWeight: "bold",
        lineHeight: 1.3,
        mb: 3,
        color: colors.text.primary,
      }}
    >
      {title}
    </Typography>
  );
};