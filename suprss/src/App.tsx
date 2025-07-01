import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

const PrivateRoute = () => {
  return true ? (
      <Outlet />
  ) : (
    <Navigate to="/signin" />
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="auth/login" element={<Login />} />
        <Route path="auth/register" element={<Register />} />
        <Route path="/" element={<Navigate to="auth/login" />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="home" element={<Home />} />
            {/*<Route path="my_feed" element={<MyFeed />} />*/}
            {/*<Route path="shared_collections" element={<ShqredCollections />} />*/}
            {/*<Route path="favorite" element={<Favorite />} />*/}
            {/*<Route path="settings" element={<Settings />} />*/}
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};


export default App;
