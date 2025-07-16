import { Box } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useThemeColors } from "../ThemeModeContext";
import ArticlePage from "../../pages/ArticleView";

const Layout = () => {
  const colors = useThemeColors();
  const location = useLocation();
  const article = location.state?.article ?? null;
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: "row",
        backgroundColor: colors.background.default,
      }}
    >
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          backgroundColor: colors.background.default,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <Header />
        <Box sx={{ flexGrow: 1, height: "calc(100vh - 50px)", overflow: "auto", justifyContent: "center" }}>
          {article ? <ArticlePage /> : <Outlet />}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
