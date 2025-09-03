import { Card, CardMedia } from "@mui/material";

interface ArticleImageProps {
  image: string;
  title: string;
  colors: any;
}

export const ArticleImage = ({ image, title, colors }: ArticleImageProps) => {
  if (!image) return null;

  return (
    <Card sx={{ mb: 3, boxShadow: 'none', border: `1px solid ${colors.background.hover}` }}>
      <CardMedia
        component="img"
        image={image}
        alt={title}
        sx={{
          maxHeight: 400,
          objectFit: 'cover',
          borderRadius: 1,
        }}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    </Card>
  );
};