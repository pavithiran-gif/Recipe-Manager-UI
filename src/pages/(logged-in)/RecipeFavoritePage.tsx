// pages/RecipeDetailPage.tsx
import React from "react";
import Layout from "../../components/Layout"; // Ensure correct import path
import FavoritesPage from "../../components/FavoritesPage"; // Ensure correct import path

const RecipeFavoritePage: React.FC = () => {
  return (
    <Layout>
      <FavoritesPage />
    </Layout>
  );
};

export default RecipeFavoritePage;
