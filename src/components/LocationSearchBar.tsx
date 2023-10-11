import { useState } from "react";

import WeatherApiEndpoint from "../state-management/Weather_Api_Endpoint";
import WeatherDataPublisher from "../state-management/Weather_Data_Publisher";

import "../styles/LocationSearchBar.css";

function LocationSearchBar() {
  const [fetchState, setFetchState] = useState(() => {
    return false;
  });

  function searchNewLocation(submitEvent) {
    submitEvent.preventDefault();

    if (!fetchState) {
      setFetchState(true); //being fetching

      const inputElement = submitEvent.target.querySelector(
          ".location-search-bar-input"
        ),
        inputValue = inputElement.value;

      WeatherApiEndpoint.getForecast(inputValue)
        .then((data) => {
          WeatherDataPublisher.emitWeatherData(data);
          inputElement.value = ""; //reset the input value to be empty only if such query was successful
        })
        .catch((error) => {
          //logic for displaying an error box to the user on the DOM, will use the component api to do so

          console.error(error, error.stack);
        })
        .finally(() => {
          setFetchState(false); //return state to zero after the promise is finished
        });
    }
  }

  return (
    <form className="location-search-bar" onSubmit={searchNewLocation}>
      <button type="submit" className="location-search-bar-submit-button"></button>
      <div className="location-search-bar-input-container">
        <input
          type="text"
          placeholder="Enter a location here. e.g. 'New York City'"
          className="location-search-bar-input"
        ></input>
      </div>
    </form>
  );
}

export default LocationSearchBar;
