import React from "react";

interface FiltersProps {
  breeds: string[];
  states: { name: string; isoCode: string }[];
  cities: string[];
  zipCodes: string[];
  selectedBreed: string;
  selectedState: string;
  selectedCity: string;
  selectedZipCode: string;
  sortDirection: string;
  setSelectedBreed: React.Dispatch<React.SetStateAction<string>>;
  setSelectedState: React.Dispatch<React.SetStateAction<string>>;
  setSelectedCity: React.Dispatch<React.SetStateAction<string>>;
  setSelectedZipCode: React.Dispatch<React.SetStateAction<string>>;
  setSortDirection: React.Dispatch<React.SetStateAction<string>>;
}

const Filters: React.FC<FiltersProps> = ({
  breeds,
  states,
  cities,
  zipCodes,
  selectedBreed,
  selectedState,
  selectedCity,
  selectedZipCode,
  sortDirection,
  setSelectedBreed,
  setSelectedState,
  setSelectedCity,
  setSelectedZipCode,
  setSortDirection,
}) => {
  return (
    <div className="filter-container">
      <select value={selectedBreed} onChange={(e) => setSelectedBreed(e.target.value)}>
        <option value="">All Breeds</option>
        {breeds.map((breed) => (
          <option key={breed} value={breed}>
            {breed}
          </option>
        ))}
      </select>

      <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
        <option value="">All States</option>
        {states.map((state) => (
          <option key={state.isoCode} value={state.isoCode}>
            {state.name}
          </option>
        ))}
      </select>

      <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
        <option value="">All Cities</option>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>

      <select value={selectedZipCode} onChange={(e) => setSelectedZipCode(e.target.value)}>
        <option value="">All Zip Codes</option>
        {zipCodes.map((zip) => (
          <option key={zip} value={zip}>
            {zip}
          </option>
        ))}
      </select>

      <select value={sortDirection} onChange={(e) => setSortDirection(e.target.value)}>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
};

export default Filters;
