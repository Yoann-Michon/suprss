import {
  Box,
  Typography,
  CircularProgress,
  Stack,
  Card,
  CardContent,
  Button,
  Pagination,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useThemeColors } from "../component/ThemeModeContext";
import { useTranslation } from "react-i18next";
import SearchBar from "../component/filter/SearchBar";
import FilterBar from "../component/filter/FilterBar";
import { useArticle, type Article } from "../context/ArticleContext";
import { api } from "../services/api.service";

const ITEMS_PER_PAGE = 3;

const Home = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [readState, setReadState] = useState<string[]>([]);
  const [sort, setSort] = useState<string[]>(["Newest"]);

  const colors = useThemeColors();
  const { t } = useTranslation();
  const { showArticle } = useArticle();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const items = await api<Article[]>("/feed/articles", { method: "POST" });
        console.log(items);
        
        setArticles(items);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredItems = articles.filter((item) => {
    const matchesSearch =
      (item.title + (item.excerpt ?? ""))
        .toLowerCase()
        .includes(searchText.toLowerCase());

    const matchesSource =
      selectedSources.length === 0 || selectedSources.includes(item.feedId);

    const matchesCategory = selectedCategories.length === 0;

    return matchesSearch && matchesSource && matchesCategory;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sort.includes("Oldest")) {
      return new Date(a.pubDate).getTime() - new Date(b.pubDate).getTime();
    }
    return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
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
        sources={[]} 
        categories={["AI", "Mobile", "Web", "Hardware"]}
        selectedSources={selectedSources}
        setSelectedSources={setSelectedSources}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        readState={readState}
        setReadState={setReadState}
        sort={sort}
        setSort={setSort}
      />

      <Typography variant="h5" fontWeight="bold" gutterBottom>
        {t("pages.home.allFeeds")}
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : sortedItems.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {t("pages.home.noResults")}
        </Typography>
      ) : (
        <>
          <Stack spacing={3}>
            {paginatedItems.map((item) => (
              <Card
                key={item.id}
                sx={{
                  display: "flex",
                  bgcolor: "transparent",
                  boxShadow: "none",
                  alignItems: "center",
                  maxHeight: 200,
                }}
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
                  <Typography
                    variant="subtitle2"
                    fontWeight={300}
                    color={colors.text.tertiary}
                    fontSize={13}
                  >
                    {item.author ?? "Unknown"}
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
                      __html: item.excerpt ?? "",
                    }}
                  />
                  <Button
                    title={t("pages.home.read")}
                    variant="contained"
                    size="small"
                    onClick={() => showArticle(item)}
                    sx={{
                      textTransform: "none",
                      width: "50px",
                      my: 1,
                      bgcolor: colors.background.selected,
                      color: colors.text.secondary,
                      borderRadius: 50,
                    }}
                  >
                    {t("pages.home.read")}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Stack>

          {sortedItems.length > ITEMS_PER_PAGE && (
            <Box mt={4} display="flex" justifyContent="center">
              <Pagination
                id="pagination"
                count={Math.ceil(sortedItems.length / ITEMS_PER_PAGE)}
                page={page}
                onChange={(_, val) => setPage(val)}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default Home;
