import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useEffect, useState, Suspense, lazy } from "react";
import ArticlePage from "./pages/ArticleView";
import { ArticleProvider } from "./context/ArticleContext";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Layout = lazy(() => import("./component/layer/Layout"));
const SharedCollections = lazy(() => import("./pages/SharedCollections"));
const Account = lazy(() => import("./pages/Account"));
const Settings = lazy(() => import("./pages/Settings"));
const MyFeed = lazy(() => import("./pages/MyFeed"));
const ManageFeeds = lazy(() => import("./pages/ManageFeed"));
const Documentation = lazy(() => import("./pages/Documentation"));
const LoadingScreen = lazy(() => import("./pages/LoadingScreen")); // ✨

const PrivateRoute = () => {
  const isAuthenticated = true;
  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" />;
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    
    <Router>
        <ArticleProvider>
        {showSplash ? (
          <LoadingScreen />
        ) : (
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<Navigate to="/auth/login" />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route element={<PrivateRoute />}>
                <Route element={<Layout />}>
                  <Route path="home" element={<Home />} />
                  <Route path="my_feed" element={<MyFeed />} />
                  <Route path="my_feed/manage" element={<ManageFeeds />} />
                  <Route path="shared_collections" element={<SharedCollections />} />
                  <Route path="article/:slug" element={<ArticlePage />} />
                  <Route path="account" element={<Account />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="documentation" element={<Documentation />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        )}
    </ArticleProvider>
      </Router>
  );
};

export default App;
