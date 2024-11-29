import React, { useState, useEffect } from 'react';
import { RecipeCardList } from './RecipeCard'; // Reuse existing RecipeCardList
import axiosInstance from "../utils/axiosConfig";
import { Loader2 } from 'lucide-react';

interface FavoriteRecipe {
  RecipeID: number;
  RecipeName: string;
  Description: string;
  ImagePath: string;
  // Add other necessary fields from your backend response
}

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<FavoriteRecipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/data/userfavorites');
        setFavorites(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching favorites:', err);
        setError('Failed to load favorite recipes');
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-8 text-center mb-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">My Favorite Recipes</h1>
      
      {favorites.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <p className="text-xl mb-2">You haven't added any favorite recipes yet.</p>
          <p className="text-sm text-gray-400">Explore recipes and add them to your favorites!</p>
        </div>
      ) : (
        <RecipeCardList recipes={favorites} />
      )}
    </div>
  );
};

export default FavoritesPage;