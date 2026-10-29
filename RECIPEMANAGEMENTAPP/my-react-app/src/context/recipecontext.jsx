
import { createContext, useContext, useEffect, useState } from "react";

const RecipeContext = createContext(null);

const initialRecipes = [
  {
    id: 1,
    title: "Fresh Garden Salad",
    category: "Healthy",
    time: "15 min",
    servings: 2,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
    description: "A refreshing salad packed with fresh vegetables.",
    ingredients: [
      "2 cups lettuce",
      "1 cucumber",
      "1 tomato",
      "1 avocado",
      "Olive oil",
      "Salt and pepper",
    ],
    instructions: [
      "Wash and chop all vegetables.",
      "Add the vegetables to a large bowl.",
      "Drizzle with olive oil.",
      "Season with salt and pepper.",
      "Mix well and serve fresh.",
    ],
    favorite: false,
  },
  {
    id: 2,
    title: "Creamy Pasta",
    category: "Italian",
    time: "25 min",
    servings: 2,
    image:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800",
    description: "Delicious creamy pasta for a comforting meal.",
    ingredients: [
      "200g pasta",
      "1 cup cream",
      "2 garlic cloves",
      "Parmesan cheese",
      "Salt and pepper",
    ],
    instructions: [
      "Boil pasta until cooked.",
      "Saute garlic in a pan.",
      "Add cream and cheese.",
      "Mix in the pasta.",
      "Serve warm.",
    ],
    favorite: false,
  },
  {
    id: 3,
    title: "Berry Pancakes",
    category: "Breakfast",
    time: "20 min",
    servings: 2,
    image:
      "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800",
    description: "Fluffy pancakes topped with fresh berries.",
    ingredients: [
      "1 cup flour",
      "1 egg",
      "1 cup milk",
      "1 tbsp sugar",
      "Fresh berries",
    ],
    instructions: [
      "Mix flour, egg, milk, and sugar.",
      "Heat a pan.",
      "Pour the batter into small circles.",
      "Cook both sides until golden.",
      "Serve with fresh berries.",
    ],
    favorite: false,
  },
];

const getStoredRecipes = () => {
  if (typeof window === "undefined") {
    return initialRecipes;
  }

  try {
    const saved = window.localStorage.getItem("recipes");

    if (!saved) {
      return initialRecipes;
    }

    const parsedRecipes = JSON.parse(saved);
    return Array.isArray(parsedRecipes) ? parsedRecipes : initialRecipes;
  } catch (error) {
    console.error("Failed to load recipes from localStorage.", error);
    return initialRecipes;
  }
};

export function RecipeProvider({ children }) {
  const [recipes, setRecipes] = useState(getStoredRecipes);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem("recipes", JSON.stringify(recipes));
    } catch (error) {
      console.error("Failed to save recipes to localStorage.", error);
    }
  }, [recipes]);

  const addRecipe = (recipe = {}) => {
    setRecipes((prev) => [
      {
        ...recipe,
        id:
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : Date.now(),
        favorite: false,
      },
      ...prev,
    ]);
  };

  const deleteRecipe = (id) => {
    setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
  };

  const toggleFavorite = (id) => {
    setRecipes((prev) =>
      prev.map((recipe) =>
        recipe.id === id
          ? { ...recipe, favorite: !recipe.favorite }
          : recipe
      )
    );
  };

  return (
    <RecipeContext.Provider
      value={{ recipes, addRecipe, deleteRecipe, toggleFavorite }}
    >
      {children}
    </RecipeContext.Provider>
  );
}

// The context hook is intentionally exported alongside its provider.
// eslint-disable-next-line react-refresh/only-export-components
export function useRecipes() {
  const context = useContext(RecipeContext);

  if (!context) {
    throw new Error("useRecipes must be used within a RecipeProvider");
  }

  return context;
}
