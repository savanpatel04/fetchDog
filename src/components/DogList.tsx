import React from "react";
import { Dog } from "../types/Dog";

interface DogListProps {
  dogs: Dog[];
  favorites: string[];
  toggleFavorite: (dogId: string) => void;
}

const DogList: React.FC<DogListProps> = ({ dogs, favorites, toggleFavorite }) => {
  return (
    <div className="dog-container">
      {dogs.map((dog) => (
        <div key={dog.id} className="dog-card">
          <img src={dog.img} alt={dog.name} />
          <h3>{dog.name}</h3>
          <p>
            <strong>Breed:</strong> {dog.breed}
          </p>
          <p>
            <strong>Age:</strong> {dog.age} years
          </p>
          <p>
            <strong>Location:</strong> {dog.zip_code}
          </p>
          <button onClick={() => toggleFavorite(dog.id)}>
            {favorites.includes(dog.id) ? "Remove Favorite" : "Add Favorite"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default DogList;
