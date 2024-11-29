// src/App.tsx
import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import NotFound from "./pages/404";
import RecipeManagerPage from "./pages/(logged-in)/RecipeManagerPage";
import RecipeFormPage from "./pages/(logged-in)/RecipeFormPage"
import Test from "./pages/test"
import RecipeDetailPage from "./pages/(logged-in)/RecipeDetailPage"
import RecipeFavoritePage from "./pages/(logged-in)/RecipeFavoritePage"
import RecipeEditPage from "./pages/(logged-in)/RecipeEditPage"

const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({
  element,
}) => {
  const isAuthenticated = useAuth();
  if (isAuthenticated === null) {
    return <div>Loading...</div>; // You can add a loading spinner here
  }
  return isAuthenticated ? element : <Login />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/undefined" element={<NotFound />} />
        <Route
          path="/recipes"
          element={<ProtectedRoute element={<RecipeManagerPage />} />}
        />
        <Route
          path="/recipeform"
          element={<ProtectedRoute element={<RecipeFormPage />} />}
        />
        <Route
          path="/favourite"
          element={<ProtectedRoute element={<RecipeFavoritePage />} />}
        />
        <Route
          path="/recipes/edit/:recipeId"
          element={<ProtectedRoute element={<RecipeEditPage />} />}
        />
        <Route path="/recipe/:recipeId" element={<RecipeDetailPage />} />
        <Route
          path="/test"
          element={<ProtectedRoute element={<Test />} />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
