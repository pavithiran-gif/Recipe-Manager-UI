// pages/RecipeManagerPage.tsx
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout"; // Ensure correct import path
import { RecipeCard } from "../../components/RecipeCard"; // Ensure correct import path
import axiosInstance from "../../utils/axiosConfig";
import CustomFloatButton from "../../components/CustomFloatButton";
import { Toast } from "@/components/ui/toast";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Toaster } from "@/components/ui/toaster"
// import { MenuItem, Select, InputLabel, FormControl, SelectChangeEvent } from "@mui/material";
import Combobox from "@/components/ui/combobox";
import { Folder, Tag } from "lucide-react";


const RecipeManagerPage: React.FC = () => {
  interface Recipe {
    RecipeID: number;
    RecipeName: string;
    Categories: string[];
    Tags: string[];
    // Add other properties as needed
  }

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get<Recipe[]>("/data/recipes");
        // console.log(`fetchRecipes response: ${JSON.stringify(response.data)}`);
        setRecipes(response.data);
        setFilteredRecipes(response.data); // Initialize with all recipes
        // Fetch categories
        const categoriesResponse = await axiosInstance.get("/data/categories");
        setCategories(categoriesResponse.data.map((category: any) => category.CategoryName)); // Adjust property names based on your response

        // Fetch tags
        const tagsResponse = await axiosInstance.get("/data/tags");
        setTags(tagsResponse.data.map((tag: any) => tag.TagName)); // Adjust property names based on your response

        setIsLoading(false);
      } catch (error) {
        Toast({ title: "Error fetching recipes", variant: "destructive" });
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleSearch = (value: string) => {
    const searchQuery = value.toLowerCase();
    const filtered = recipes.filter((recipe) =>
      recipe.RecipeName.toLowerCase().includes(searchQuery)
    );
    setFilteredRecipes(filtered);
  };


  const filterRecipes = (category: string, tag: string) => {
    let filtered = recipes;

    if (category) {
      filtered = filtered.filter((recipe) => recipe.Categories.includes(category));
    }

    if (tag) {
      filtered = filtered.filter((recipe) => recipe.Tags.includes(tag));
    }

    setFilteredRecipes(filtered);
  };

  const groupedOptions = recipes.map((recipe) => {
    const firstLetter = recipe.RecipeName[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
      ...recipe,
    };
  });

  return (
    <Layout>
      <div className="flex flex-col items-center h-full p-4 space-y-2">
      <Toaster />
        {/* Search Bar */}
        <div className="w-full max-w-[600px]">
        <div className="w-full mb-4">
        <Autocomplete
            options={groupedOptions.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
            groupBy={(option) => option.firstLetter}
            getOptionLabel={(option) => option.RecipeName}
            onInputChange={(event, value) => handleSearch(value)} // Filter dynamically
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Recipes..."
                variant="outlined"
                fullWidth
              />
            )}
            sx={{
              width: "80%", // Adjust length to make it slightly shorter
              maxWidth: "600px", // Prevent the bar from being too wide on large screens
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                backgroundColor: "#FFFFFF",
              },
              "& .MuiInputLabel-root": {
                color: "#999",
              },
            }}
          />
        </div>

          {/* Filter Section */}
          <div className="flex space-x-2">
          <Combobox 
            options={categories}
            value={selectedCategory}
            onChange={(category) => {
              setSelectedCategory(category);
              filterRecipes(category, selectedTag);
            }}
            placeholder="Category"
            icon={<Folder size={16} />}
          />

          <Combobox 
            options={tags}
            value={selectedTag}
            onChange={(tag) => {
              setSelectedTag(tag);
              filterRecipes(selectedCategory, tag);
            }}
            placeholder="Tag"
            icon={<Tag size={16} />}
          />

        </div>  
        </div>


        {/* Content */}
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.RecipeID} recipe={recipe} />
            ))}
          </div>
        )}

        {/* Float Button */}
        <CustomFloatButton />
      </div>
    </Layout>
  );
};

export default RecipeManagerPage;
