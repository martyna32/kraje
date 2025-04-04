import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [query, setQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weather, setWeather] = useState(null);

  const api_key = import.meta.env.VITE_SOME_KEY;

  useEffect(() => { //kraje 
    if (query === '') return;
    axios
      .get(`https://restcountries.com/v3.1/name/${query}`)
      .then((response) => {
        setCountries(response.data);
        setSelectedCountry(null); 
      })
      .catch((error) => {
        setCountries([]);
        setSelectedCountry(null);
      });
  }, [query]);

  useEffect(() => {
    if (!selectedCountry || !selectedCountry.capital) return;

    const capital = selectedCountry.capital[0]; // jesli ma stolice yk
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}`
      )
      .then((response) => {
        setWeather(response.data);
      })
      .catch((error) => {
        setWeather(null);
      });
  }, [selectedCountry, api_key]);

  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };

  const handleShowCountry = (country) => {
    setSelectedCountry(country);
    setWeather(null); // resetpogody
  };

  const renderCountries = () => {
    if (countries.length > 10) {
      return <p>Too many matches, please be more specific.</p>;
    }
    if (countries.length > 1) {
      return (
        <ul>
          {countries.map((country) => (
            <li key={country.name.common}>
              {country.name.common}
              <button onClick={() => handleShowCountry(country)}>
                Show
              </button>
            </li>
          ))}
        </ul>
      );
    }

    if (countries.length === 1) {
      const country = countries[0];
      return (
        <div>
          <h2>{country.name.common}</h2>
          <p>Capital: {country.capital ? country.capital[0] : 'Brak stolicy'}</p>
          <p>Area: {country.area}</p>
          <p>Languages: {Object.values(country.languages || {}).join(', ')}</p>
          <img src={country.flags[0]} alt={country.name.common} width="100" />
        </div>
      );
    }
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleSearchChange}
        placeholder="Search for a country"
      />
      {selectedCountry ? (
        <div>
          <h2>{selectedCountry.name.common}</h2>
          <p>Capital: {selectedCountry.capital ? selectedCountry.capital[0] : 'Brak stolicy'}</p>
          <p>Area: {selectedCountry.area}</p>
          Languages:<ul><li>{Object.values(selectedCountry.languages || {}).join(', ')}</li> </ul>
          <img src={selectedCountry.flags[0]} alt={selectedCountry.name.common} width="100" />
        </div>
      ) : (
        renderCountries()
      )}
    </div>
  );
}

export default App;
