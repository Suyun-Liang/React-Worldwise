import { createContext, useState, useEffect, useContext } from "react";

const CityContext = createContext();
const BASE_URL = "http://localhost:8000";

function CityProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurentCity] = useState({});

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

  async function getCity(id) {
    try {
      setIsLoading(true);
      const cityRes = await fetch(`${BASE_URL}/cities/${id}`);
      const cityData = await cityRes.json();
      setCurentCity(cityData);
    } catch (error) {
      alert("There was an error");
    } finally {
      setIsLoading(false);
    }
  }

  async function addCity(newCity) {
    try {
      setIsLoading(true);
      const cityRes = await fetch(`${BASE_URL}/cities/`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const cityData = await cityRes.json();
      setCities((preCity) => [...preCity, cityData]);
    } catch (error) {
      alert("There was an error");
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteCity(selectedId) {
    try {
      setIsLoading(true);
      await fetch(`${BASE_URL}/cities/${selectedId}`, {
        method: "DELETE",
      });
      setCities((preCity) => preCity.filter((e) => e.id !== selectedId));
    } catch (error) {
      alert("There was an error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CityContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        addCity,
        deleteCity,
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
