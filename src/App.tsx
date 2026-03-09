import { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, type RouteObject } from "react-router-dom";
import { isLoggedIn } from "./utils/IsLoggedIn";
import { Toaster } from "./components/ui/sonner";
import { Loading } from "./components/ui/Loading";
import { publicRoutes } from "./routes/publicRoutes";
import { userRoutes } from "./routes/userRoutes";
import { adminRoutes } from "./routes/adminRoutes";
import { contractorRoutes } from "./routes/contractorRoutes";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useAuth, useReduxAuth } from "./hooks/use-auth";

const App = () => {
  useAuth();

  const { user } = useReduxAuth();
  const isAuthenticated = isLoggedIn();

  const getAuthenticatedRoutes = () => {
    if (!isAuthenticated || !user?.user?.role) return null;
    switch (user.user.role) {
      case "user":
        return userRoutes;
      case "contractor":
        return contractorRoutes;
      case "admin":
        return adminRoutes;
      default:
        return null;
    }
  };


  const authenticatedRoutes = getAuthenticatedRoutes();
  const renderRoutes = (routes: RouteObject[]) => {
    return routes.map((route, index) => {
      if (route.children) {
        return (
          <Route key={index} path={route.path} element={route.element}>
            {renderRoutes(route.children)}
          </Route>
        );
      }
      return <Route key={index} path={route.path} element={route.element} index={route.index} />;
    });
  };


  return (
    <>
      <Router>
        <Suspense fallback={<Loading />}>
          <ErrorBoundary>
            <Routes>
              {renderRoutes(publicRoutes)}
              {authenticatedRoutes && renderRoutes(authenticatedRoutes)}
              <Route path="*" element={isAuthenticated ? <Navigate to="/" /> : <Navigate to="/signin" />} />
            </Routes>
          </ErrorBoundary>
        </Suspense>
        <Toaster richColors={true} position="top-right" />
      </Router>
    </>
  )
}

export default App
