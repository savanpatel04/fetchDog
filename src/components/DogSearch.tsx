import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { getBreeds, searchDogs, getDogsByIds, fetchZipCode} from "../services/api";
import { Dog } from "../types/Dog";
import FavoritesDog from "./FavoritesDog";
import MatchedDog from "./MatchedDog";
import { State, City } from "country-state-city";
import Filters from "./Filters";
import DogList from "./DogList";

const DogSearch: React.FC = () => {
  // state for filter
  const [breeds, setBreeds] = useState<string[]>([]);
  const [zipCodes, setZipCodes] = useState<string[]>([]); 
  const [states, setStates] = useState<{ name: string; isoCode: string }[]>([]);
  const [selectedState, setSelectedState] = useState<string>("");
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedBreed, setSelectedBreed] = useState<string>("");
  const [selectedZipCode, setSelectedZipCode] = useState<string>(""); 
  const [sortDirection, setSortDirection] = useState<string>("asc");

  // state for dogs and pagination
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [page, setPage] = useState<number>(0);

  //state for mathced dog
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null); 

  // state for smooth scrolling 
  const favoritesRef = useRef<HTMLDivElement | null>(null);
  const matchDogRef = useRef<HTMLDivElement | null>(null);

  const setMatchDog = (dog: Dog) => {
    setMatchedDog(dog);
  };

  // scroll to matched dog
  useLayoutEffect(() => {
    if (matchedDog && matchDogRef.current) {
      matchDogRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [matchedDog]);

  // fetch breeds of dogs
  useEffect(() => {
    const fetchBreeds = async () => {
      const breeds = await getBreeds();
      setBreeds(breeds);
    };
    fetchBreeds();
  }, []);

  // fetch dogs based on filter
  const fetchDogs = async () => {
    const { resultIds } = await searchDogs({
      breeds: selectedBreed ? [selectedBreed] : undefined,
      zipCodes: selectedZipCode ? [selectedZipCode] : undefined, 
      sort: `breed:${sortDirection}`,
      size: 25,
      from: page * 25, 
    });

    const dogs = await getDogsByIds(resultIds);
    setDogs(dogs);
  };

  //fetch zipcodes based on selection of city and state
  const fetchZipCodes = async () => {
    try {
      let allZipCodes = new Set<string>();
      let from = 0;
      let size = 100; 
      let hasMore = true;
      let count = 0;
  
      const cityFilter = selectedCity ? selectedCity : "";
      const stateFilter = selectedState ? selectedState : "";
  
       while (hasMore && count < 100) {
          const requestBody = {
            city: cityFilter,
            states: [stateFilter], 
            size: size,
            from: from,
        };
  
        const data = await fetchZipCode(cityFilter, stateFilter);
        const { results } = data;

        if (results.length === 0) {
          hasMore = false; 
          break;
        }
        
        results.forEach((location: { zip_code: string }) => {
          allZipCodes.add(location.zip_code);
          count += 1; 
        });
  
        from += size; 
      }
      const sortedZipCodes = Array.from(allZipCodes).sort((a, b) => a.localeCompare(b));
      setZipCodes(sortedZipCodes); 
  
      if (selectedZipCode && !sortedZipCodes.includes(selectedZipCode)) {
        setSelectedZipCode(""); 
      }
    } catch (error) {
      console.error("Error fetching zip codes:", error);
    }
  };

  //Update zipcodes when state or city change
  useEffect(() =>{
    if (selectedState || selectedCity) fetchZipCodes();
  }, [selectedState , selectedCity]);

  // update dog list when filter change
  useEffect(() => {
    fetchDogs();
  }, [selectedBreed, selectedZipCode, sortDirection, page]);

  //fetch state
  useEffect(() => {
    const usStates = State.getStatesOfCountry("US")
    .filter((state) => /^[A-Za-z]{2}$/.test(state.isoCode))  
    .map((state) => ({
      name: state.isoCode,  
      isoCode: state.isoCode,
    }));
    setStates(usStates);
  }, []);

 // updates cities when state change
  useEffect(() => {
    if (selectedState) {
      const citiesOfState = City.getCitiesOfState("US", selectedState).map(
        (city) => city.name
      );
      setCities(citiesOfState);
    } else {
      setCities([]); 
    }
  }, [selectedState]);

  // Toggle favorites
  const toggleFavorite = (dogId: string) => {
    setFavorites((prev) =>
      prev.includes(dogId) ? prev.filter((id) => id !== dogId) : [...prev, dogId]
    );
    favoritesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Remove favorite
  const removeFavorite = (dogId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== dogId));
  };

  return (
    <div className="dog-search-container">
    <h1>Dog Search</h1>
    <div className="filter-container">
    <Filters
        breeds={breeds}
        states={states}
        cities={cities}
        zipCodes={zipCodes}
        selectedBreed={selectedBreed}
        selectedState={selectedState}
        selectedCity={selectedCity}
        selectedZipCode={selectedZipCode}
        sortDirection={sortDirection}
        setSelectedBreed={setSelectedBreed}
        setSelectedState={setSelectedState}
        setSelectedCity={setSelectedCity}
        setSelectedZipCode={setSelectedZipCode}
        setSortDirection={setSortDirection}
      />
    </div>

    <div className="dog-container">
      <DogList dogs={dogs} favorites={favorites} toggleFavorite={toggleFavorite} />
    </div>

    <div className="page-button-container">
      <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="page-button">
        Previous
      </button>
      <button onClick={() => setPage((p) => p + 1)} className="page-button">Next</button>
    </div>

    <div ref={favoritesRef}>
     <FavoritesDog favorites={favorites} removeFavorite={removeFavorite} setMatchDog={setMatchDog}/>
    </div>

    <div ref={matchDogRef}>
     {matchedDog && <MatchedDog matchedDog={matchedDog} matchDogRef={matchDogRef} />}
    </div>

  </div>
  );
};

export default DogSearch;
