import { useState } from "react";

import WeatherApiEndpoint from "../state-management/Weather_Api_Endpoint";
import WeatherDataPublisher from "../state-management/Weather_Data_Publisher";

import "../styles/UseCurrentLocation.css";

function UseCurrentLocationButton() {
  const [fetchState, setFetchState] = useState(() => {
    return false;
  });

  function getLocation() {
    return new Promise((resolve, reject) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve(position);
          },
          (error) => {
            //throw error, and display error visually using the error box api

            reject(error);
          }
        );
      } else {
        //throw error, and display error visually using the error box api
      }
    });
  }

  function useCurrentLocation() {
    if (!fetchState) {
      setFetchState(true); //fetching process has been initiated

      const locationPromise = getLocation();

      locationPromise
        .then((position: GeolocationPosition) => {
          const { latitude, longitude } = position.coords;

          const coordString = `${latitude.toFixed(3)},${longitude.toFixed(3)}`;

          return coordString;
        })
        .then((coordString) => {
          return WeatherApiEndpoint.getForecast(coordString);
        })
        .then((data) => {
          WeatherDataPublisher.emitWeatherData(data);
        })
        .finally(() => {
          setFetchState(false);
        });
    }
  }
  return (
    <button
      type="button"
      className="use-current-location-button"
      onClick={useCurrentLocation}
    ></button>
  );
}

export default UseCurrentLocationButton;
