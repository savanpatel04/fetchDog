import React from "react";
import { Dog } from "../types/Dog";

interface MatchedDogProps {
  matchedDog: Dog;
  matchDogRef: React.RefObject<HTMLDivElement | null>;
}

const MatchedDog: React.FC<MatchedDogProps> = ({ matchedDog, matchDogRef }) => {
  return (
    <div ref={matchDogRef} className="matched-dog-container">
      <h1>Matched Dog</h1>
      <div className="dog-card">
        <img src={matchedDog.img} alt={matchedDog.name} />
        <h3>{matchedDog.name}</h3>
        <p><strong>Breed:</strong> {matchedDog.breed}</p>
        <p><strong>Age:</strong> {matchedDog.age} years</p>
        <p><strong>Location:</strong> {matchedDog.zip_code}</p>
      </div>
    </div>
  );
};

export default MatchedDog;
