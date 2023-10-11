class WeatherDataPublisher {
  static #subscriptions = {
    currentLocation: {},
    currentDate: {},

    currentTemp: {},
    currentCondition: {},
    isDay: {},
    currentWindSpeed: {},
    currentHumidity: {},
    currentPrecipLevel: {},

    forecast: {},
  };

  static #filterMethods = {
    currentLocation: (weatherData) => {
      const { name, region, country } = weatherData.location;
      return { name, region, country };
    },
    currentDate: (weatherData) => {
      const { localtime: local_time } = weatherData.location;
      return { local_time }; //returns date and time in the format standard DATETIME
    },

    currentTemp: (weatherData) => {
      const { temp_c, temp_f } = weatherData.current;
      return { temp_c, temp_f };
    },
    currentCondition: (weatherData) => {
      const { text: conditionText } = weatherData.current.condition;
      return { conditionText };
    },
    isDay: (weatherData) => {
      const { is_day } = weatherData.current;
      return { is_day };
    },
    currentWindSpeed: (weatherData) => {
      const { wind_kph, wind_mph } = weatherData.current;
      return { wind_kph, wind_mph };
    },
    currentHumidity: (weatherData) => {
      const { humidity } = weatherData.current;
      return { humidity };
    },
    currentPrecipLevel: (weatherData) => {
      const { precip_mm, precip_in } = weatherData.current;
      return { precip_mm, precip_in };
    },

    //can make the entire forecast filtering a single method, as such will return a single array
    //that will represent the entire forecast, but only with the necessary data to do so. This is because
    //the forecast will use the single array for rendering
    forecast: (weatherData) => {
      const forecastDataArr = weatherData.forecast.forecastday;

      const filteredForecastData = [];

      //create new objects with only the necessary data within them
      for (let forecastDayObj of forecastDataArr) {
        const filteredDataObj = {};

        filteredDataObj["date"] = forecastDayObj.date;

        filteredDataObj["temp_high"] = {
          temp_f: forecastDayObj.day.maxtemp_f,
          temp_c: forecastDayObj.day.maxtemp_c,
        };

        filteredDataObj["temp_low"] = {
          temp_f: forecastDayObj.day.mintemp_f,
          temp_c: forecastDayObj.day.mintemp_c,
        };

        filteredDataObj["condition"] = forecastDayObj.day.condition.text;

        filteredDataObj["daily_chance_of_precip"] = {
          chance_of_rain: forecastDayObj.day.daily_chance_of_rain,
          chance_of_snow: forecastDayObj.day.daily_chance_of_snow,
        };

        filteredForecastData.push(filteredDataObj);

        // each filtered object will look something like this vvv
        //
        //  filteredDataObj =
        //  {
        //      date: dateText, --> uses DATETIME standard format
        //      temp_high: {  temp_f: value, temp_c: value  },
        //      temp_low: {  temp_f: value, temp_c: value  },
        //      condition: conditionText,
        //      daily_chance_of_precip: {  chance_of_rain: value, chance_of_snow: value  },
        //  }
      }

      return filteredForecastData;
    },
  };

  static emitWeatherData(weatherData) {
    //will accept a weather data object,
    //in which it will distribute the necessary
    //data to the right subscribers

    //filter the data and emit to the corresponding subscribers
    for (let filterMethod in this.#filterMethods) {
      const filteredData = this.#filterMethods[filterMethod](weatherData);

      //since the subscriptions and filter methods share the same property names,
      //I can use the relationship to emit the right filtered data to the right subscribers
      for (let subscriber in this.#subscriptions[filterMethod]) {
        this.#subscriptions[filterMethod][subscriber](filteredData);
      }
    }
  }

  static subscribe(
    weatherDataType: string,
    methodName: string,
    entrypointMethod: Function
  ) {
    try {
      if (
        weatherDataType in this.#subscriptions &&
        !(methodName in this.#subscriptions[weatherDataType])
        //if the weather data type publisher exists, and if a method with a specific name isn't
        //already within the corresponding subscription list
      ) {
        this.#subscriptions[weatherDataType][methodName] = entrypointMethod;
      }
    } catch (error) {
      console.error(error, error.stack);
    }
  }

  static unsubscribe(weatherDataType: string, methodName: string) {
    try {
      if (
        weatherDataType in this.#subscriptions &&
        methodName in this.#subscriptions[weatherDataType]
        //if the weather data type publisher exists, and if a method with a specific name
        //exists within the corresponding subscription list
      ) {
        delete this.#subscriptions[weatherDataType][methodName];
      }
    } catch (error) {
      console.error(error, error.stack);
    }
  }
}

export default WeatherDataPublisher;
