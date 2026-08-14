import { createSlice } from "@reduxjs/toolkit";

// =====================================
// LOAD FAVORITES FROM LOCAL STORAGE
// =====================================

const storedFavorites = localStorage.getItem("favorites");

let parsedFavorites = [];

try {
  parsedFavorites = storedFavorites
    ? JSON.parse(storedFavorites)
    : [];
} catch (error) {
  console.error("Failed to parse stored favorites:", error);
  parsedFavorites = [];
}

// =====================================
// INITIAL STATE
// =====================================

const initialState = {
  favorites: Array.isArray(parsedFavorites) ? parsedFavorites : [],
};

// =====================================
// SLICE
// =====================================

const favoritesSlice = createSlice({
  name: "favorites",

  initialState,

  reducers: {
    // =====================================
    // SET ALL FAVORITES
    // =====================================

    setFavorites: (state, action) => {
      state.favorites = Array.isArray(action.payload)
        ? action.payload
        : [];

      localStorage.setItem(
        "favorites",
        JSON.stringify(state.favorites),
      );
    },

    // =====================================
    // ADD FAVORITE
    // =====================================

    addFavorite: (state, action) => {
      const property = action.payload;

      if (!property) {
        return;
      }

      const propertyId = property._id || property.id;

      if (!propertyId) {
        return;
      }

      const alreadyExists = state.favorites.some(
        (item) =>
          (item?._id || item?.id) === propertyId,
      );

      if (!alreadyExists) {
        state.favorites.push(property);

        localStorage.setItem(
          "favorites",
          JSON.stringify(state.favorites),
        );
      }
    },

    // =====================================
    // REMOVE FAVORITE
    // =====================================

    removeFavorite: (state, action) => {
      const propertyId = action.payload;

      state.favorites = state.favorites.filter(
        (item) =>
          (item?._id || item?.id) !== propertyId,
      );

      localStorage.setItem(
        "favorites",
        JSON.stringify(state.favorites),
      );
    },

    // =====================================
    // CLEAR ALL FAVORITES
    // =====================================

    clearFavorites: (state) => {
      state.favorites = [];

      localStorage.removeItem("favorites");
    },
  },
});

// =====================================
// EXPORT ACTIONS
// =====================================

export const {
  setFavorites,
  addFavorite,
  removeFavorite,
  clearFavorites,
} = favoritesSlice.actions;

// =====================================
// EXPORT REDUCER
// =====================================

export default favoritesSlice.reducer;