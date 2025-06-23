const city_input = document.querySelector(".city_input");
const Searchbtn = document.querySelector(".Searchbtn");

const weather_info = document.querySelector(".weather_info");
const searchCity = document.querySelector(".searchCity");
const notFound = document.querySelector(".notFound");

const country_txt = document.querySelector(".country_txt");
const temprature = document.querySelector(".temprature");
const condition_txt = document.querySelector(".condition_txt");
const humidityValue_txt = document.querySelector(".humidityValue_txt");
const windValue_txt = document.querySelector(".windValue_txt");
const Weatherimg = document.querySelector(".Weatherimg");
const currentdate_txt = document.querySelector('.currentdate_txt');
const forecastItem_container = document.querySelector('.forecastItem_container');


const apiKey = '5ed2efc01076da0c975c4dcc12a4cb0b';




Searchbtn.addEventListener('click',()=>{
    if(city_input.value.trim() != ''){

        updateWeatherInfo(city_input.value);
        city_input.value = '';
        city_input.blur();
    }
})


city_input.addEventListener('keydown',(event)=>{
    if(event.key == 'Enter' && city_input.value.trim() != ''){
        
        updateWeatherInfo(city_input.value);
        city_input.value = '';
        city_input.blur();
    }


    });



    async function getFetchData(endpoint,city){
        const apiUrl = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apiKey}&units=metric`;
        const response = await fetch(apiUrl);
        return  response.json();
    }

  async function updateWeatherInfo(city){
        const weatherData = await getFetchData("weather",city);
        if(weatherData.cod != 200){
            showDisplaySection(notFound);
            return;
        }
  
        const {
            name:cityCountry,
            weather:[{id , main}],
            main:{temp,humidity},
            wind:{speed}
        }= weatherData;

        country_txt.innerText = cityCountry;
        temprature.innerText = `${Math.round(temp)}°C`;
        condition_txt.innerText = main;
        humidityValue_txt.innerText = humidity;
        windValue_txt.innerText = speed;
        currentdate_txt.innerText = getCurrentDate();
        Weatherimg.src = `/assets/weather/${showWeatherImage(id)}.svg`;
        await updateWeatherForecastInfo(city);


        showDisplaySection(weather_info);

    }



    function showDisplaySection(section){
        const sections = [notFound,weather_info,searchCity];
        sections.forEach(element => {
            element.classList.add("hide");
        });
        section.classList.remove('hide');

    }


    function showWeatherImage(id){
        if(id>=801 && id<=804){
            return "clouds";
        }
        else if (id == 800){
            return "clear";
        }
        else if(id>=701 && id <= 781){
            return "mist";
        }
        else if(id >= 600 && id <= 622){
            return "snow";
        }
        else if(id >= 500 && id <= 531){
            return "rain";
        }
        else if(id >= 300 && id <= 321){
            return "drizzle";
        }
        else if(id >= 200 && id <= 232){
            return "thunderstorm" ;
        }
    }




   function getCurrentDate(){
    const currentdate = new Date();
    const options = {
        weekday:'short',
        day: '2-digit',
        month: 'short'
    }
    return currentdate.toLocaleDateString('en-GB',options);
   }
    

   async function updateWeatherForecastInfo(city) {
       const ForecastData = await getFetchData("forecast",city);


       const timeTaken = '12:00:00';
       todayDate = new Date().toISOString().split('T')[0];


       forecastItem_container.innerHTML = '';
       const ForecastDataList = [...ForecastData.list];
       ForecastDataList.forEach((el,index) => {
        if(el.dt_txt.includes(timeTaken)&& !el.dt_txt.includes(todayDate)){
           
            console.log(el)
            updateForecastItems(el);
        } 
       });
   };

   function updateForecastItems(forecastElement){

    const{
        dt: date,
        weather:[{id}],
        main:{temp}

    }=forecastElement;


    const dateValue = new Date(forecastElement.dt * 1000);
    const options = {
        day:"2-digit",
        month:"short"
    }

    const dateResult = dateValue.toLocaleDateString('en-GB',options);


    const forecastItems = ` 
        <div class="forecast_item">
          <h5 class="forecastItem_data fontRegular">${dateResult}</h5>
         <img src="/assets/weather/${showWeatherImage(id)}.svg" class="forecastItem_image">
         <h5 class="forecastItem_temp">${Math.round(temp)}°C</h5>
       </div>`

    forecastItem_container.insertAdjacentHTML('beforeend',forecastItems);
  

   }


