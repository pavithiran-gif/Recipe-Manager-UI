// pages/RecipeFormPage.tsx
import React from "react";
import Layout from "../../components/Layout"; // Ensure correct import path
import RecipeForm from "../../components/RecipeForm"; // Ensure correct import path

const RecipeFormPage: React.FC = () => {
  return (
    <Layout>
      <RecipeForm />
    </Layout>
  );
};

export default RecipeFormPage;
