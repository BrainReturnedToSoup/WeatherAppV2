import { useEffect, useState } from "react";

import WeatherDataPublisher from "../state-management/Weather_Data_Publisher";
import ComponentInterfaceRepo from "../state-management/Component_Interface_Repo";

import LocationSearchBar from "./LocationSearchBar";
import UseCurrentLocationButton from "./UseCurrentLocationButton";
import Forecast from "./Forecast";
import NavBar from "./NavBar";

import DateConverter from "../Tools/DateConverter";

import "../styles/CurrentWeather.css";
import "../styles/SideBar.css";

import WindIcon from "../assets/wind.png";
import HumidityIcon from "../assets/humidity.png";
import PrecipLevelIcon from "../assets/precip-level.png";

const defaultValues = {
  location: {
    name: "New York City",
    region: "NY",
    country: "United States",
  },
  temp: {
    temp_c: 24,
    temp_f: 75,
    unitPriority: "f", // Using Fahrenheit as the default unit
  },
  condition: {
    conditionText: "Partly Cloudy", // A common weather condition
  },
  windSpeed: {
    wind_kph: 16,
    wind_mph: 10, // Realistic wind speed values
    unitPriority: "mph", // Using miles per hour as the default unit
  },
  humidity: {
    humidity: 60, // Realistic humidity percentage
  },
  precipLevel: {
    precip_mm: 5, // Realistic precipitation level in millimeters
    precip_in: 0.2, // Realistic precipitation level in inches
    unitPriority: "in", // Using inches as the default unit
  },
  date: {
    local_time: "2023-10-10 12:00", // A future date and time
  },
};

const CurrentWeatherValues = {
  Location: function () {
    const [locationData, setLocation] = useState(() => {
      return defaultValues.location;
    });
    const nameEnums = "currentLocation";

    useEffect(() => {
      //subscribe to weather data on mount
      WeatherDataPublisher.subscribe(
        nameEnums,
        nameEnums,
        newLocationReceived.bind(this)
      );

      return () => {
        //unsubscribe on clean up
        WeatherDataPublisher.unsubscribe(nameEnums, nameEnums);
      };
    }, []);

    function newLocationReceived(locationData) {
      const { name, region, country } = locationData;

      //override the old state with new property data
      //doesn't delete non targeted or different data
      setLocation((oldLocationData) => ({
        ...oldLocationData,
        name,
        region,
        country,
      }));
    }

    return (
      <div className="location-container">
        <h1 className="location-name">{locationData?.name}</h1>
        <h2 className="location-region">{locationData?.region},</h2>
        <h3 className="location-country">{locationData?.country}</h3>
      </div>
    );
  },
  Date: function () {
    const [dateData, setDateData] = useState(() => {
      return defaultValues.date;
    });

    const nameEnums = "currentDate";

    useEffect(() => {
      WeatherDataPublisher.subscribe(
        nameEnums,
        nameEnums,
        newDateReceived.bind(this)
      );

      return () => {
        WeatherDataPublisher.unsubscribe(nameEnums, nameEnums);
      };
    });

    function newDateReceived(newDateData) {
      setDateData((oldDateData) => ({
        ...oldDateData,
        local_time: newDateData.local_time,
      }));
    }

    const { dayOfWeek, month, day } = DateConverter(dateData, "current");

    return (
      <div className="date-time-container">
        <h2 className="date">
          {dayOfWeek}, {month + " " + day}
        </h2>
      </div>
    );
  },

  Temp: function () {
    const [tempData, setTemp] = useState(() => {
      return defaultValues.temp;
    });

    const nameEnums = "currentTemp",
      toggleNameEnums = "toggleTempUnitPriority";

    useEffect(() => {
      //have the component supply one of the functions that alters the
      //state of said component. This way, other parts of the program
      //can simply look in the repo for the corresponding method
      //and then use said method to alter the component state. In this case,
      //simply executing the supplied method will toggle the unit priority to display
      ComponentInterfaceRepo.addMethod(
        toggleNameEnums,
        toggleUnitPriority.bind(this)
      );
      WeatherDataPublisher.subscribe(
        nameEnums,
        nameEnums,
        newTempReceived.bind(this)
      );

      return () => {
        //same rule applies for clean up on dismount
        ComponentInterfaceRepo.removeMethod(toggleNameEnums);
        WeatherDataPublisher.unsubscribe(nameEnums, nameEnums);
      };
    }, []);

    function newTempReceived(newTempData) {
      const { temp_c, temp_f } = newTempData;

      setTemp((oldTempData) => ({ ...oldTempData, temp_c, temp_f }));
    }

    //will be used in order to switch the visual unit priority.
    //Both units will be displayed, but one will be larger and
    //more apparent than the other
    function toggleUnitPriority() {
      setTemp((oldTempData) => ({
        ...oldTempData,
        unitPriority: oldTempData.unitPriority === "f" ? "c" : "f",
      }));
    }

    //will check the current unit priority, in which the variable values
    //will be based on the current unit priority. These variables are used
    //in the JSX returned below

    let temp1Val = null,
      temp2Val = null;

    if (tempData.unitPriority === "f") {
      temp1Val = tempData.temp_f + " °F";
      temp2Val = tempData.temp_c + " °C";
    } else if (tempData.unitPriority === "c") {
      temp1Val = tempData.temp_c + " °C";
      temp2Val = tempData.temp_f + " °F";
    }

    return (
      <div className="temp-container">
        <div className="temp-1-container">
          <h1 className="temp-1">{temp1Val}</h1>
        </div>
        <div className="temp-2-container">
          <h2 className="temp-2">{temp2Val}</h2>
        </div>
      </div>
    );
  },
  Condition: function () {
    const [conditionData, setCondition] = useState(() => {
        return defaultValues.condition;
      }),
      nameEnums = "currentCondition";

    useEffect(() => {
      WeatherDataPublisher.subscribe(
        nameEnums,
        nameEnums,
        newConditionReceived.bind(this)
      );

      return () => {
        WeatherDataPublisher.unsubscribe(nameEnums, nameEnums);
      };
    }, []);

    function newConditionReceived(newConditionData) {
      const { conditionText } = newConditionData;

      setCondition((oldConditionData) => ({
        ...oldConditionData,
        conditionText,
      }));
    }

    return (
      <div className="condition-container">
        <h1 className="condition">{conditionData.conditionText}</h1>
      </div>
    );
  },
  WindSpeed: function () {
    const [windSpeedData, setWindSpeedData] = useState(() => {
      return defaultValues.windSpeed;
    });

    const nameEnums = "currentWindSpeed",
      toggleNameEnums = "toggleWindSpeedUnitPriority";

    useEffect(() => {
      ComponentInterfaceRepo.addMethod(
        toggleNameEnums,
        toggleUnitPriority.bind(this)
      );
      WeatherDataPublisher.subscribe(
        nameEnums,
        nameEnums,
        newWindSpeedReceived.bind(this)
      );

      return () => {
        ComponentInterfaceRepo.removeMethod(toggleNameEnums);
        WeatherDataPublisher.unsubscribe(nameEnums, nameEnums);
      };
    }, []);

    function newWindSpeedReceived(newWindSpeedData) {
      const { wind_kph, wind_mph } = newWindSpeedData;

      setWindSpeedData((oldWindSpeedData) => ({
        ...oldWindSpeedData,
        wind_kph,
        wind_mph,
      }));
    }

    function toggleUnitPriority() {
      setWindSpeedData((oldWindSpeedData) => ({
        ...oldWindSpeedData,
        unitPriority: oldWindSpeedData.unitPriority === "mph" ? "kph" : "mph",
      }));
    }

    return (
      <div className="wind-speed-container">
        <img className="wind-speed-icon" alt="Wind Speed Icon" src={WindIcon} />
        <div className="wind-speed-values-container">
          <h1 className="wind-speed-1">
            {windSpeedData.unitPriority === "mph"
              ? windSpeedData.wind_mph + " mph"
              : windSpeedData.wind_kph + " kph"}
          </h1>
          <h2 className="wind-speed-2">
            {windSpeedData.unitPriority !== "mph"
              ? windSpeedData.wind_mph + " mph"
              : windSpeedData.wind_kph + " kph"}
          </h2>
        </div>
      </div>
    );
  },
  Humidity: function () {
    const [humidityData, setHumidityData] = useState(() => {
      return defaultValues.humidity;
    });

    const nameEnums = "currentHumidity";

    useEffect(() => {
      WeatherDataPublisher.subscribe(
        nameEnums,
        nameEnums,
        newHumidityReceived.bind(this)
      );

      return () => {
        WeatherDataPublisher.unsubscribe(nameEnums, nameEnums);
      };
    }, []);

    function newHumidityReceived(newHumidityData) {
      setHumidityData((oldHumidityData) => ({
        ...oldHumidityData,
        humidity: newHumidityData.humidity,
      }));
    }

    return (
      <div className="humidity-container">
        <img
          className="humidity-icon"
          alt="Humidity Icon"
          src={HumidityIcon}
        ></img>
        <h1 className="humidity">{humidityData.humidity + "%"}</h1>
      </div>
    );
  },
  PrecipLevel: function () {
    const [precipLevelData, setPrecipLevelData] = useState(() => {
      return defaultValues.precipLevel;
    });

    const nameEnums = "currentPrecipLevel",
      toggleNameEnums = "togglePrecipLevelUnitPriority";

    useEffect(() => {
      ComponentInterfaceRepo.addMethod(
        toggleNameEnums,
        toggleUnitPriority.bind(this)
      );
      WeatherDataPublisher.subscribe(
        nameEnums,
        nameEnums,
        newPrecipLevelReceived.bind(this)
      );

      return () => {
        ComponentInterfaceRepo.removeMethod(toggleNameEnums);
        WeatherDataPublisher.unsubscribe(nameEnums, nameEnums);
      };
    }, []);

    function newPrecipLevelReceived(newPrecipLevelData) {
      const { precip_mm, precip_in } = newPrecipLevelData;

      setPrecipLevelData((oldPrecipLevelData) => ({
        ...oldPrecipLevelData,
        precip_mm,
        precip_in,
      }));
    }

    function toggleUnitPriority() {
      setPrecipLevelData((oldPrecipLevelData) => ({
        ...oldPrecipLevelData,
        unitPriority: oldPrecipLevelData.unitPriority === "in" ? "mm" : "in",
      }));
    }

    return (
      <div className="precip-level-container">
        <img
          className="precip-level-icon"
          alt="Precip Level Icon"
          src={PrecipLevelIcon}
        ></img>
        <div className="precip-level-values-container">
          <h1 className="precip-level-1">
            {precipLevelData.unitPriority === "in"
              ? precipLevelData.precip_in + " in"
              : precipLevelData.precip_mm + " mm"}
          </h1>
          <h2 className="precip-level-2">
            {precipLevelData.unitPriority !== "in"
              ? precipLevelData.precip_in + " in"
              : precipLevelData.precip_mm + " mm"}
          </h2>
        </div>
      </div>
    );
  },
};
function CurrentWeather() {
  const { Location, Date, Temp, Condition, WindSpeed, Humidity, PrecipLevel } =
    CurrentWeatherValues;

  return (
    //the container div should change its background colors using a fading
    //style in order to represent the daylight based on the given time
    //it will do so using the isDay publisher
    <>
      <div className="main-current-weather-data-container">
        <NavBar />
        <Location />
        <Date />
        <Temp />
        <Condition />
      </div>
      <aside className="weather-app-side-bar">
        <div className="weather-data-retrieval-interface">
          <LocationSearchBar />
          <UseCurrentLocationButton />
        </div>
        <Forecast />
        <div className="secondary-current-weather-data-container">
          <WindSpeed />
          <Humidity />
          <PrecipLevel />
        </div>
      </aside>
    </>
  );
}

export default CurrentWeather;
