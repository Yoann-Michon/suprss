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
import { useUser } from "./context/UserContext";

const ManageCollection = lazy(()=>import("./pages/ManageCollection"));
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Layout = lazy(() => import("./component/layer/Layout"));
const Account = lazy(() => import("./pages/Account"));
const Settings = lazy(() => import("./pages/Settings"));
const ManageFeeds = lazy(() => import("./pages/ManageFeed"));
const Documentation = lazy(() => import("./pages/Documentation"));
const LoadingScreen = lazy(() => import("./pages/LoadingScreen"));
const Favorite =lazy(() => import("./pages/Favorites"));

const PrivateRoute = () => {
  const { user } = useUser();
  return user ? <Outlet /> : <Navigate to="/auth/login" />;
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { user, isLoading } = useUser();

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash || isLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <Router>
      <ArticleProvider>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route 
              path="/" 
              element={user ? <Navigate to="/home" /> : <Navigate to="/auth/login" />} 
            />
            
            <Route path="/auth/login" element={user ? <Navigate to="/home" /> : <Login />} />
            <Route path="/auth/register" element={user ? <Navigate to="/home" /> : <Register />} />
            
            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/manage_feed" element={<ManageFeeds />} />
                <Route path="/collections" element={<ManageCollection />} />
                <Route path="/article/:slug" element={<ArticlePage />} />
                <Route path="/favorite" element={<Favorite />} />
                <Route path="/account" element={<Account />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/documentation" element={<Documentation />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </ArticleProvider>
    </Router>
  );
};

export default App;
