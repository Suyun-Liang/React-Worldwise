import { useCity } from "../contexts/CityContext";

import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import CountryItem from "./CountryItem";
import Message from "./Message";

function CountryList() {
  const { cities, isLoading } = useCity();

  if (isLoading) return <Spinner />;
  if (!cities.length)
    return (
      <Message message="Add your first city by clicking on a city on the map" />
    );

  const countries = cities.reduce((result, city) => {
    if (!result.map((e) => e.country).includes(city.country)) {
      return [...result, { country: city.country, emoji: city.emoji }];
    } else {
      return result;
    }
  }, []);
  return (
    <ul className={styles.countryList}>
      {countries.map((e) => (
        <CountryItem country={e} key={e.country} />
      ))}
    </ul>
  );
}

export default CountryList;
