import WeatherDataPublisher from "../state-management/Weather_Data_Publisher";
import ComponentInterfaceRepo from "../state-management/Component_Interface_Repo";

import { useState, useEffect } from "react";

import "../styles/Forecast.css";
import DateConverter from "../Tools/DateConverter";

import PrecipChanceIcon from "../assets/precip-level.png";
const defaultValues = {
  forecast_days: [
    {
      date: "2023-10-10", // A future date and time
      temp_high: { temp_f: 72, temp_c: 22 }, // Realistic temperature values
      temp_low: { temp_f: 58, temp_c: 14 },
      condition: "Partly Cloudy", // A common weather condition
      daily_chance_of_precip: { chance_of_rain: 20, chance_of_snow: 0 }, // Realistic percentage values
    },
    {
      date: "2023-10-11",
      temp_high: { temp_f: 68, temp_c: 20 },
      temp_low: { temp_f: 54, temp_c: 12 },
      condition: "Sunny",
      daily_chance_of_precip: { chance_of_rain: 10, chance_of_snow: 0 },
    },
    {
      date: "2023-10-12",
      temp_high: { temp_f: 75, temp_c: 24 },
      temp_low: { temp_f: 61, temp_c: 16 },
      condition: "Partly Cloudy",
      daily_chance_of_precip: { chance_of_rain: 15, chance_of_snow: 0 },
    },
  ],
  unitPriority: "f", // Using Fahrenheit as the default unit
};

//  filteredDataObj =
//  {
//      date: dateText,
//      temp_high: {  temp_f: value, temp_c: value  },
//      temp_low: {  temp_f: value, temp_c: value  },
//      condition: conditionText,
//      daily_chance_of_precip: {  chance_of_rain: value, chance_of_snow: value  },
//  }

function SingleDayCard({ props }) {
  const {
    date,
    temp_high,
    temp_low,
    condition,
    daily_chance_of_precip,
    unitPriority,
  } = props;

  const { chance_of_rain, chance_of_snow } = daily_chance_of_precip;

  let tempHigh1, tempHigh2;
  let tempLow1, tempLow2;
  let chanceOfPrecipVal;

  //for determining where to put the various
  //temperature values based on unit priority
  if (unitPriority === "f") {
    tempHigh1 = temp_high.temp_f + " °F";
    tempHigh2 = temp_high.temp_c + " °C";

    tempLow1 = temp_low.temp_f + " °F";
    tempLow2 = temp_low.temp_c + " °C";
  } else if (unitPriority === "c") {
    tempHigh1 = temp_high.temp_c + " °C";
    tempHigh2 = temp_high.temp_f + " °F";

    tempLow1 = temp_low.temp_c + " °C";
    tempLow2 = temp_low.temp_f + " °F";
  }

  //for determining what precipitation value to represent
  if (chance_of_rain >= chance_of_snow) {
    chanceOfPrecipVal = chance_of_rain;
  } else if (chance_of_snow > chance_of_rain) {
    chanceOfPrecipVal = chance_of_snow;
  }

  const { dayOfWeek, month, day } = DateConverter(date, "forecast");

  return (
    <div className="forecast-day-card">
      <h1 className="forecast-day condition">{condition}</h1>
      <h1 className="forecast-day-date">
        {dayOfWeek}, {month} {day}
      </h1>
      <div className="forecast-day temp-high-container">
        <h1 className="forecast-day temp-high-name">High</h1>
        <h2 className="forecast-day temp-high-1">{tempHigh1}</h2>
        <h3 className="forecast-day temp-high-2">{tempHigh2}</h3>
      </div>
      <div className="forecast-day temp-low-container">
        <h1 className="forecast-day temp-low-name">Low</h1>
        <h2 className="forecast-day temp-low-1">{tempLow1}</h2>
        <h3 className="forecast-day temp-low-2">{tempLow2}</h3>
      </div>

      <div className="chance-of-precip-container">
        <img
          src={PrecipChanceIcon}
          className="precip-type-icon"
          alt="precip-type-icon"
        ></img>
        <h3 className="chance-of-precip">{chanceOfPrecipVal + "%"}</h3>
      </div>
    </div>
  );
}

function ForecastDayCards() {
  const [forecastDaysData, setForecastDaysData] = useState(() => {
    return defaultValues;
  });

  const nameEnums = "forecast",
    toggleNameEnums = "toggleForecastUnitPriority";

  useEffect(() => {
    //will be used to toggle the units of all the existing forecast cards at the same time
    ComponentInterfaceRepo.addMethod(
      toggleNameEnums,
      toggleUnitPriority.bind(this)
    );
    WeatherDataPublisher.subscribe(
      nameEnums,
      nameEnums,
      newForecastDaysData.bind(this)
    );

    return () => {
      ComponentInterfaceRepo.removeMethod(toggleNameEnums);
      WeatherDataPublisher.unsubscribe(nameEnums, nameEnums);
    };
  }, []);

  function newForecastDaysData(newForecastDaysData) {
    const updatedForecastDays = [...forecastDaysData.forecast_days];

    for (let i = 0; i < updatedForecastDays.length; i++) {
      updatedForecastDays[i] = {
        ...updatedForecastDays[i],
        ...newForecastDaysData[i],
      }; //will update the corresponding old days data object with the new days data object at the same index
    }

    setForecastDaysData((oldForecastDaysData) => ({
      ...oldForecastDaysData,
      forecast_days: updatedForecastDays, //sets the new updated array to state
    }));
  }

  function toggleUnitPriority() {
    setForecastDaysData((oldForecastDaysData) => ({
      ...oldForecastDaysData,
      unitPriority: oldForecastDaysData.unitPriority === "f" ? "c" : "f",
    })); //toggles the unit priority between f and c for customary and metric temp units
  }
  return (
    <>
      {forecastDaysData.forecast_days.map((dayObj, index) => {
        dayObj["unitPriority"] = forecastDaysData.unitPriority;

        //adds the unit priority to the day object,
        //so that the individual cards can decide which units to prioritize displaying

        return <SingleDayCard key={index} props={dayObj} />;
      })}
    </>
  );
}

function Forecast() {
  return (
    <div className="forecast-container">
      <h1 className="forecast-title">Forecast</h1>
      <ForecastDayCards />
    </div>
  );
}

export default Forecast;
