const axios = require("axios");

var returnFinalString = {};

module.exports.getLatLong = async item => {
    var url = "https://geocode.xyz/?locate="+item+"&json=1&auth=463298659515089173495x1955";
    try {
      const response = await axios.get(url);
      const data = response.data;
      returnFinalString["mainSearchItem"] = {
          searchString: item,
          searchStringLatt: data.latt,
          searchStringLongt: data.longt
      }
      return await this.getNearestCity(data.latt, data.longt);
    } catch (error) {
      console.log(error);
    }
};

module.exports.getNearestCity = async (lat, longt) => {
    var url = "https://www.metaweather.com/api/location/search/?lattlong="+ lat + ", " + longt; 
    try {
      const response = await axios.get(url);
      const data = response.data;
      returnFinalString["nearestCity"] = [];
      for(let ii=0; ii < data.length; ii++ ){
        var weather = await this.getWeatherInfoOfNearestCity(data[ii].woeid);
        var additionalInfo = await this.getAdditionalInfoOfNearestCity(data[ii].latt_long);
        console.log(additionalInfo);
        returnFinalString["nearestCity"].push(
        {
            city: data[ii].title,
            woeid: data[ii].woeid,
            latt_long: data[ii].latt_long,
            waterOrLand: additionalInfo.water === true ? "water" : "land",
            consolidated_weather: JSON.stringify(weather)
        });
      }
      return returnFinalString;
    } catch (error) {
      console.log(error);
    }
}

module.exports.getWeatherInfoOfNearestCity = async (woeid) => {
    var url = "https://www.metaweather.com/api/location/"+ woeid + "/"; 
    try {
      const response = await axios.get(url);
      const data = await response.data;
      console.log('----getWeatherInfoOfNearestCity-----');
      return data.consolidated_weather;
    }catch (error) {
      console.log(error);
    }
}

module.exports.getAdditionalInfoOfNearestCity = async (latt_longt) => {
  var url = "https://api.onwater.io/api/v1/results/"+ latt_longt + "?access_token=5Gyyme5AHesafzZN4MXh"; 
  try {
    const response = await axios.get(url);
    const data = await response.data;
    console.log('----getAdditionalInfoOfNearestCity-----');
    return data;
  }catch (error) {
    console.log(error);
  }
}