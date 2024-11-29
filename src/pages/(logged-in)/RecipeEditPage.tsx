// pages/RecipeFormPage.tsx
import React from "react";
import Layout from "../../components/Layout"; // Ensure correct import path
import EditRecipe from "../../components/EditRecipe"; // Ensure correct import path

const RecipeEditPage: React.FC = () => {
  return (
    <Layout>
      <EditRecipe />
    </Layout>
  );
};

export default RecipeEditPage;
