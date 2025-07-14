import {
  Box,
  Typography,
  CircularProgress,
  Stack,
  Card,
  CardContent,
  CardMedia,
  Button,
  Pagination,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useThemeColors } from "../component/ThemeModeContext";
import { useTranslation } from 'react-i18next';
import SearchBar from "../component/filter/SearchBar";
import FilterBar from "../component/filter/FilterBar";

export interface FeedItem {
  title: string;
  link: string;
  description: string;
  thumbnail: string;
  source: string;
}

const feedUrls = [
  {
    label: "TechCrunch",
    url: "https://api.rss2json.com/v1/api.json?rss_url=https://techcrunch.com/feed/",
  },
  {
    label: "Wired",
    url: "https://api.rss2json.com/v1/api.json?rss_url=https://www.wired.com/feed/rss",
  },
  {
    label: "The Verge",
    url: "https://api.rss2json.com/v1/api.json?rss_url=https://www.theverge.com/rss/index.xml",
  },
];

const ITEMS_PER_PAGE = 3;

const Home = () => {
  const [feeds, setFeeds] = useState<FeedItem[]>([]);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  
  // États pour les filtres
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [readState, setReadState] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sort, setSort] = useState<string[]>(["Newest"]);
  
  const colors = useThemeColors();
  const { t } = useTranslation();

  // Extraire les sources et catégories disponibles
  const availableSources = feedUrls.map(feed => feed.label);
  const availableCategories = ["AI", "Mobile", "Web", "Hardware"];

  useEffect(() => {
    (async () => {
      const items: FeedItem[] = [];
      for (const feed of feedUrls) {
        try {
          const res = await fetch(feed.url);
          const json = await res.json();
          if (json.items) {
            items.push(
              ...json.items.slice(0, 3).map((item: any) => ({
                title: item.title,
                link: item.link,
                description: item.description,
                thumbnail: item.thumbnail || item.enclosure?.link || "",
                source: feed.label,
              }))
            );
          }
        } catch (error) {
          console.error("Failed to fetch feed:", feed.label, error);
        }
      }
      setFeeds(items);
      setLoading(false);
    })();
  }, []);

  const filteredItems = feeds.filter((item) => {
    const matchesSearch = (item.title + item.description)
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchesSource = selectedSources.length === 0 || selectedSources.includes(item.source);
    const matchesCategory = selectedCategories.length === 0; 

    return matchesSearch && matchesSource && matchesCategory;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sort.includes("Oldest")) {
      return a.title.localeCompare(b.title); 
    }
    return b.title.localeCompare(a.title); 
  });

  const paginatedItems = sortedItems.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <Box p={2}>
      <SearchBar
        searchText={searchText}
        onSearchChange={(text) => {
          setSearchText(text);
          setPage(1); 
        }}
      />
      <FilterBar 
        sources={availableSources}
        categories={availableCategories}
        selectedSources={selectedSources}
        setSelectedSources={setSelectedSources}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        readState={readState}
        setReadState={setReadState}
        favorites={favorites}
        setFavorites={setFavorites}
        sort={sort}
        setSort={setSort}
      />
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        {t('home.allFeeds')}
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {sortedItems.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {t('home.noResults')}
            </Typography>
          ) : (
            <>
              <Stack spacing={3}>
                {paginatedItems.map((item, index) => (
                  <Card
                    key={index}
                    sx={{
                      display: "flex",
                      bgcolor: "transparent",
                      border: "none",
                      boxShadow: "none",
                      alignItems: "center",
                      maxHeight: 200,
                    }}
                  >
                    <CardContent
                      sx={{
                        flex: 1,
                        p: "16px !important",
                        display: "flex",
                        flexDirection: "column",
                        textAlign: "left",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        fontWeight={300}
                        color={colors.text.tertiary}
                        fontSize={13}
                      >
                        {item.source}
                      </Typography>
                      <Typography
                        variant="h6"
                        fontWeight={500}
                        fontSize={15}
                        gutterBottom
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          color: colors.text.tertiary,
                        }}
                        dangerouslySetInnerHTML={{
                          __html: item.description,
                        }}
                      />
                      <Button
                        title={t('home.read')}
                        variant="contained"
                        size="small"
                        href={item.link}
                        target="_blank"
                        sx={{
                          textTransform: "none",
                          width: "50px",
                          my: 1,
                          bgcolor: colors.background.selected,
                          color: colors.text.secondary,
                          borderRadius: 50,
                        }}
                      >
                        {t('home.read')}
                      </Button>
                    </CardContent>
                    {item.thumbnail && (
                      <CardMedia
                        component="img"
                        image={item.thumbnail}
                        alt={item.title}
                        sx={{
                          width: 300,
                          objectFit: "cover",
                          aspectRatio: "16/9",
                          m: 1,
                          borderRadius: 3,
                        }}
                      />
                    )}
                  </Card>
                ))}
              </Stack>

              {sortedItems.length > ITEMS_PER_PAGE && (
                <Box mt={4} display="flex" justifyContent="center">
                  <Pagination
                    count={Math.ceil(sortedItems.length / ITEMS_PER_PAGE)}
                    page={page}
                    onChange={(_, val) => setPage(val)}
                  />
                </Box>
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default Home;