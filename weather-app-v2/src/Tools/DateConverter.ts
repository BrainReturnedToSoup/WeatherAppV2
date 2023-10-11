function DateConverter(dateData, context) {
  const daysOf = {
    week: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    month: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
  };

  let dateObj;

  if (context === "current") {
    dateObj = new Date(dateData.local_time);
  } else if (context === "forecast") {
    dateObj = new Date(dateData + "T00:00:00"); 
    //have to concatenate time zone info, because the data in
    //this case is just a date without a time zone.
    //Without this, the converted date will be a day behind due
    //to using my local time zone
  }

  //for creating a proper date and time format, which derives from
  //the datetime standard structure in order to do so
  const dayOfWeek = daysOf.week[dateObj.getDay()],
    month = daysOf.month[dateObj.getMonth()],
    day = dateObj.getDate();

  return { dayOfWeek, month, day };
}

export default DateConverter;
