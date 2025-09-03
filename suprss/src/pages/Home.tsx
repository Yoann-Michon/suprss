import {
  Box,
  Typography,
  CircularProgress,
  Stack,
  Card,
  CardContent,
  Button,
  Pagination,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useThemeColors } from "../component/ThemeModeContext";
import { useTranslation } from "react-i18next";
import SearchBar from "../component/filter/SearchBar";
import FilterBar from "../component/filter/FilterBar";
import { useArticle, type Article } from "../context/ArticleContext";
import { api } from "../services/api.service";

const ITEMS_PER_PAGE = 10;

interface Feed {
  id: string;
  name: string;
}

const Home = () => {
  const { 
    articles, 
    setArticles, 
    showArticle, 
    markAsRead,
    getReadArticles,
    getUnreadArticles 
  } = useArticle();
  
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [readState, setReadState] = useState<string[]>([]);
  const [sort, setSort] = useState<string[]>([]);

  const colors = useThemeColors();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [articlesData, feedsData] = await Promise.all([
          api<Article[]>("/feed/articles", { method: "POST" }),
          api<Feed[]>("/feed")
        ]);
        
        console.log("Articles fetched:", articlesData);
        console.log("Feeds fetched:", feedsData);
        
        // Convertir les dates
        const processedArticles = articlesData.map(article => ({
          ...article,
          pubDate: new Date(article.pubDate)
        }));
        
        setArticles(processedArticles);
        setFeeds(feedsData);
        setSort([t('features.filters.newest')]);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t, setArticles]);

  const handleMarkAsRead = async (articleId: string) => {
    try {
      await markAsRead(articleId);
    } catch (error) {
      console.error("Failed to mark article as read:", error);
    }
  };

  const getFeedName = (feedId: string) => {
    const feed = feeds.find(f => f.id === feedId);
    return feed ? feed.name : t('features.filters.source');
  };

  const availableSources = feeds.map(feed => feed.name);

  const availableTags = Array.from(
    new Set(articles.flatMap(article => article.tags || []))
  ).sort();

  // Logique de filtrage
  const filteredItems = articles.filter((item) => {
    const matchesSearch =
      (item.title + (item.excerpt ?? ""))
        .toLowerCase()
        .includes(searchText.toLowerCase());

    const matchesSource =
      selectedSources.length === 0 || 
      selectedSources.includes(getFeedName(item.feedId));

    const matchesTags = 
      selectedCategories.length === 0 || 
      (item.tags && selectedCategories.some(tag => item.tags?.includes(tag)));

    const isRead = item.userIdsRead && item.userIdsRead.length > 0;
    const matchesReadState = 
      readState.length === 0 ||
      (readState.includes(t('features.filters.read')) && isRead) ||
      (readState.includes(t('features.filters.unread')) && !isRead);

    return matchesSearch && matchesSource && matchesTags && matchesReadState;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    const isOldest = sort.includes(t('features.filters.oldest'));
    
    if (isOldest) {
      return new Date(a.pubDate).getTime() - new Date(b.pubDate).getTime();
    }
    return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
  });

  const paginatedItems = sortedItems.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleArticleClick = async (article: Article) => {
    await handleMarkAsRead(article.id);
    showArticle(article, window.location.pathname);
  };

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
        categories={availableTags}
        selectedSources={selectedSources}
        setSelectedSources={setSelectedSources}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        readState={readState}
        setReadState={setReadState}
        sort={sort}
        setSort={setSort}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          {t("pages.home.allFeeds")}
        </Typography>
        
        <Typography variant="body2" color={colors.text.secondary}>
          {loading ? '' : `${sortedItems.length} ${t('pages.settings.collections.articles')}`}
        </Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
          <Typography variant="body2" sx={{ ml: 2, alignSelf: 'center' }}>
            {t('loading.message')}
          </Typography>
        </Box>
      ) : sortedItems.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {articles.length === 0 ? t('pages.myFeed.emptyState.title') : t("pages.home.noResults")}
          </Typography>
          {articles.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              {t('pages.myFeed.emptyState.description')}
            </Typography>
          )}
        </Box>
      ) : (
        <>
          <Stack spacing={2}>
            {paginatedItems.map((item) => {
              const isRead = item.userIdsRead && item.userIdsRead.length > 0;
              
              return (
                <Card
                  key={item.id}
                  sx={{
                    display: "flex",
                    bgcolor: "transparent",
                    boxShadow: "none",
                    cursor: "pointer",
                    transition: "all 0.2s ease-in-out",
                    opacity: isRead ? 0.7 : 1,
                    "&:hover": {
                      backgroundColor: colors.background.hover,
                      transform: "translateY(-1px)",
                      boxShadow: `0 4px 12px ${colors.primary}15`,
                    },
                    borderRadius: 2,
                    border: `1px solid ${colors.background.hover}`,
                    p: 1,
                  }}
                  onClick={() => handleArticleClick(item)}
                >
                  <CardContent
                    sx={{
                      flex: 1,
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "left",
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          bgcolor: `${colors.primary}15`,
                          color: colors.primary,
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontWeight: 500,
                        }}
                      >
                        {getFeedName(item.feedId)}
                      </Typography>
                      
                      <Typography
                        variant="caption"
                        color={colors.text.tertiary}
                        fontSize={12}
                      >
                        {new Date(item.pubDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                    
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      fontSize={16}
                      gutterBottom
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        lineHeight: 1.4,
                        color: isRead ? colors.text.secondary : colors.text.primary,
                      }}
                    >
                      {item.title}
                    </Typography>
                    
                    {item.excerpt && (
                      <Typography
                        variant="body2"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          color: colors.text.tertiary,
                          lineHeight: 1.5,
                          mb: 2,
                        }}
                        dangerouslySetInnerHTML={{
                          __html: item.excerpt,
                        }}
                      />
                    )}

                    {item.tags && item.tags.length > 0 && (
                      <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {item.tags.slice(0, 4).map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: "0.7rem",
                              height: "20px",
                              borderColor: `${colors.primary}40`,
                              color: colors.text.secondary,
                              backgroundColor: `${colors.primary}08`,
                              "&:hover": {
                                backgroundColor: `${colors.primary}15`,
                              },
                            }}
                          />
                        ))}
                        {item.tags.length > 4 && (
                          <Typography variant="caption" color={colors.text.tertiary} sx={{ alignSelf: "center" }}>
                            +{item.tags.length - 4}
                          </Typography>
                        )}
                      </Box>
                    )}

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" color={colors.text.tertiary}>
                          {item.author ?? t("pages.article.unknownAuthor")}
                        </Typography>
                        
                        {isRead && (
                          <Chip
                            label={t('features.filters.read')}
                            size="small"
                            sx={{
                              height: "18px",
                              fontSize: "0.65rem",
                              bgcolor: `${colors.primary}20`,
                              color: colors.primary,
                            }}
                          />
                        )}
                      </Box>

                      <Button
                        variant="contained"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleArticleClick(item);
                        }}
                        sx={{
                          textTransform: "none",
                          px: 2,
                          py: 0.5,
                          bgcolor: colors.primary,
                          color: "white",
                          borderRadius: 20,
                          fontSize: "0.8rem",
                          "&:hover": {
                            bgcolor: colors.primary,
                            opacity: 0.9,
                          },
                        }}
                      >
                        {t("pages.home.read")}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>

          {sortedItems.length > ITEMS_PER_PAGE && (
            <Box mt={4} display="flex" justifyContent="center">
              <Pagination
                count={Math.ceil(sortedItems.length / ITEMS_PER_PAGE)}
                page={page}
                onChange={(_, val) => setPage(val)}
                color="primary"
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: colors.text.primary,
                  },
                }}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default Home;