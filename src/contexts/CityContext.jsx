import { createContext, useState, useEffect, useContext } from "react";

const CityContext = createContext();
const BASE_URL = "http://localhost:8000";

function CityProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(function () {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const cityRes = await fetch(`${BASE_URL}/cities`);
        const cityData = await cityRes.json();
        setCities(cityData);
      } catch (error) {
        alert("There was an error");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCities();
  }, []);

  return (
    <CityContext.Provider
      value={{
        cities,
        isLoading,
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

function useCity() {
  const value = useContext(CityContext);
  if (value === undefined) {
    throw new Error("use context outside of context provider function");
  }
  return value;
}

export { CityProvider, useCity };
