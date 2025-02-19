// components/Favorites.tsx
import React, { useState, useEffect } from "react";
import { getDogsByIds, getMatch } from "../services/api";
import { Dog } from "../types/Dog";

interface FavoritesProps {
  favorites: string[];
  removeFavorite: (dogId: string) => void;
  setMatchDog: (dog: Dog) => void; 
}

const FavoritesDog: React.FC<FavoritesProps> = ({ favorites, removeFavorite, setMatchDog }) => {
  const [favoriteDogs, setFavoriteDogs] = useState<Dog[]>([]);

  useEffect(() => {
    const fetchFavoriteDogs = async () => {
      if (favorites.length > 0) {
        const dogs = await getDogsByIds(favorites);
        setFavoriteDogs(dogs);
      } else {
        setFavoriteDogs([]);
      }
    };

    fetchFavoriteDogs();
  }, [favorites]);

  const handleGenerateMatch = async () => {
    try {
      const match = await getMatch(favorites);
      const matchedDog = favoriteDogs.find((dog) => dog.id === match.match);
      if (matchedDog) {
        setMatchDog(matchedDog); // Pass matched dog to parent
      }
    } catch (error) {
      console.error("Error generating match:", error);
      alert("Failed to generate a match. Try again.");
    }
  };

  return (
    <div className="fav-dog-container">
      <h1>Your Favorites</h1>
      {favoriteDogs.length === 0 ? (
        <p>No favorite dogs yet. Add some to see them here!</p>
      ) : (
        <div>
          <div className="dog-container">
            {favoriteDogs.map((dog) => (
              <div key={dog.id} className="dog-card">
                <img src={dog.img} alt={dog.name} />
                <div className="dog-details">
                  <h3>{dog.name}</h3>
                  <p><strong>Breed:</strong> {dog.breed}</p>
                  <p><strong>Age:</strong> {dog.age} years</p>
                  <p><strong>Location:</strong> {dog.zip_code}</p>
                  <button onClick={() => removeFavorite(dog.id)}>Remove from Favorites</button>
                </div>
              </div>
            ))}
            </div>
            <button  className="match-button" onClick={handleGenerateMatch} disabled={favorites.length === 0}>
              Generate Match
            </button>
        </div>
      )}
    </div>
  );
};

export default FavoritesDog;
