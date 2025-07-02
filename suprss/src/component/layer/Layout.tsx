import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = () => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", flexDirection: "row", backgroundColor: "#1A2027" }}>
        <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Header />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;