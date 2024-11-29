import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Clock, Users } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";// import { Tooltip } from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";

// Utility function for safe JSON parsing
const safeJsonParse = (jsonString, defaultValue = []) => {
    try {
      return typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString || defaultValue;
    } catch (error) {
      console.error('JSON Parsing Error:', error);
      return defaultValue;
    }
  };
  
  const RecipeCard = ({ recipe }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [imageError, setImageError] = useState(false);
    const { toast } = useToast();
  
    // Parse complex fields
    const ingredients = safeJsonParse(recipe.Ingredients);
    // const instructions = safeJsonParse(recipe.Instructions);
    const categories = safeJsonParse(recipe.Categories);
  
    const navigate = useNavigate();
  

    useEffect(() => {
      let isMounted = true;
      const fetchFavorites = async () => {
          try {
              const response = await axiosInstance.get('/data/userfavorites/ids');
              if (isMounted) {
              const favoriteIds = response.data.recipeIds || [];
               setIsFavorite(new Set(favoriteIds).has(recipe.RecipeID));
              }
          } catch (error) {
              console.error('Error fetching favorite recipe IDs:', error);
          }
      };

      fetchFavorites();
        // Cleanup function to prevent state updates if component unmounts
  return () => {
    isMounted = false;
  };
  }, [recipe.RecipeID]);

    // Handle favorite toggle
    const handleFavoriteToggle = async (e) => {
      e.stopPropagation();
  
      try {
          if (isFavorite) {
              // Remove from favorites
              await axiosInstance.delete('/data/favorites', {
                  data: { recipeId: recipe.RecipeID }, // No need to send userId, it will be derived from the token on the server
              });
              setIsFavorite(false);
              toast({ title: 'Removed from favorites',
                description: recipe.RecipeName,
                className: "bg-red-100 text-red-800 border-red-200",
              });
          } else {
              // Add to favorites
              await axiosInstance.post('/data/favorites', {
                  recipeId: recipe.RecipeID, // Only recipeId is needed
              });
              setIsFavorite(true);
              toast({ title: 'Added to favorites',
                description: recipe.RecipeName,
                className: "bg-green-100 text-green-800 border-green-200",
              });
          }
      } catch (error) {
          console.error('Error toggling favorite:', error);
          toast({ title: 'Error', variant: 'destructive' });
      }
  };
  
    // Image error handling
    const handleImageError = () => {
      setImageError(true);
    };

    const handleCardClick = () => {
        navigate(`/recipe/${recipe.RecipeID}`);
      };
    
  
    return (
      <Card className="relative w-72 h-96 overflow-hidden group transition-all duration-300 hover:shadow-lg cursor-pointer" onClick={handleCardClick}>
        {/* Favorite Button */}
        <button 
          onClick={handleFavoriteToggle}
          className="absolute top-3 right-3 z-10 bg-white/50 rounded-full p-2 hover:bg-white/75 transition-all"
        >
          <Heart 
            className={`
              ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}
              transition-all duration-300 hover:scale-110
            `}
          />
        </button>
  
        {/* Image Section */}
        <div className="relative h-56 overflow-hidden">
        <img 
  src={`${import.meta.env.VITE_API_URL}${recipe.ImagePath}`} 
  alt={recipe.RecipeName}
  onError={handleImageError}
  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
/>
  
          {/* Hover Description Overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
            <p className="text-white text-center text-sm">
              {recipe.Description}
            </p>
          </div>
        </div>
  
        {/* Card Content */}
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold truncate">{recipe.RecipeName}</h3>
          </div>
          
          <div className="mt-2 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">{recipe.TotalTime} mins</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">{recipe.Servings} servings</span>
            </div>
          </div>
  
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {ingredients.length} Ingredients
            </span>
            <span className="text-sm text-gray-600">
              {categories[0] || 'No Category'}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  };
  
// Wrapper component to handle multiple recipes
const RecipeCardList = ({ recipes }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {recipes.map(recipe => (
        <RecipeCard key={recipe.RecipeID} recipe={recipe} />
      ))}
    </div>
  );
};

export { RecipeCard, RecipeCardList };