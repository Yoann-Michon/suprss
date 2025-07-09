import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Layout from "./component/layer/Layout";
import SharedCollections from "./pages/SharedCollections";
import Account from "./pages/Account";
import Settings from "./pages/Settings";
import MyFeed from "./MyFeed";

const PrivateRoute = () => {
  const isAuthenticated = true; 
  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="auth/login" element={<Login />} />
        <Route path="auth/register" element={<Register />} />
        <Route path="/" element={<Navigate to="auth/login" />} />
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="home" element={<Home />} />
            <Route path="my_feed" element={<MyFeed />}/>
            <Route path="shared_collections" element={<SharedCollections />} />
            <Route path="account" element={<Account />} />
           <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};


export default App;
