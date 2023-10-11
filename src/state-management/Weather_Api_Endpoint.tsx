class WeatherApiEndpoint {
  static #apiKey = `1ea79c090dd94fe586942809232508`;
  static #numOfDays = 3;

  //add the location at the end of this url, this can be a name, or perhaps the coords
  static #endPointUrl = `https://api.weatherapi.com/v1/forecast.json?key=${
    this.#apiKey
  }&days=${this.#numOfDays}&aqi=no&q=`;

  static getForecast(location) {
    const completeUrl = this.#endPointUrl + `${location}`;

    const forecastDataPromise = fetch(completeUrl).then((response) => {
      return response.json(); //return the promise instance of the response being parsed as JSON
    });

    return forecastDataPromise; //let the other parts of the program handle any errors
  }
}

export default WeatherApiEndpoint;
