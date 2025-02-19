import axios, { AxiosInstance } from "axios";
import { Dog, Match } from "../types/Dog";

const BASE_URL = "https://frontend-take-home-service.fetch.com";

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, 
});

api.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response?.status === 401) {
      
      sessionStorage.clear(); 
      
      window.location.href = "/"; 
    }
    return Promise.reject(error); 
  }
);

// Login user and store session
export const login = async (name: string, email: string): Promise<void> => {
  await api.post("/auth/login", { name, email });
};

// Logout user
export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

// Fetch all available breeds
export const getBreeds = async (): Promise<string[]> => {
  const { data } = await api.get<string[]>("/dogs/breeds");
  return data;
};


// Search for dogs based on filters
export const searchDogs = async (params: {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  size?: number;
  from?: number;
  sort?: string;
}): Promise<{ resultIds: string[]; total: number }> => {
  const { data } = await api.get("/dogs/search", { params });
  return data;
};

// Fetch detailed information for a list of dog IDs
export const getDogsByIds = async (ids: string[]): Promise<Dog[]> => {
  const { data } = await api.post("/dogs", ids);
  return data;
};

// Match a dog from the list of favorites
export const getMatch = async (ids: string[]): Promise<Match> => {
  const { data } = await api.post("/dogs/match", ids);
  return data;
};

export const fetchZipCode = async (city: string, state: string): Promise<any> => {
  try {
    const response = await api.post("/locations/search", {
      city,
      states: [state], 
      size: 100, 
    });
    return response.data; 
  } catch (error) {
    console.error("Error fetching zip code:", error);
    throw error;
  }
};
