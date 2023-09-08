import {
  createContext,
  useEffect,
  useContext,
  useReducer,
  useCallback,
} from "react";

const CityContext = createContext();
const BASE_URL = "http://localhost:8000";
const initializeState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "city/added":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: initializeState.currentCity,
      };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error("Unknown action type");
  }
}

function CityProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initializeState
  );

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const cityRes = await fetch(`${BASE_URL}/cities`);
        const cityData = await cityRes.json();
        dispatch({ type: "cities/loaded", payload: cityData });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error fetching cities",
        });
      }
    }

    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (Number(id) === currentCity.id) return;
      dispatch({ type: "loading" });
      try {
        const cityRes = await fetch(`${BASE_URL}/cities/${id}`);
        const cityData = await cityRes.json();
        dispatch({ type: "city/loaded", payload: cityData });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error getting a city",
        });
      }
    },
    [currentCity.id]
  );

  async function addCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const cityRes = await fetch(`${BASE_URL}/cities/`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const cityData = await cityRes.json();
      dispatch({ type: "city/added", payload: cityData });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error adding a city",
      });
    }
  }

  async function deleteCity(selectedId) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${BASE_URL}/cities/${selectedId}`, {
        method: "DELETE",
      });
      dispatch({ type: "city/deleted", payload: selectedId });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting city",
      });
    }
  }

  return (
    <CityContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
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
