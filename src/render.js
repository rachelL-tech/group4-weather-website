// Card 1
import { getIcon } from './icons.js'; // 引入函式

export function renderHourlyForecast(hoursData, selector = '.hourly-forecast') {
  const container = document.querySelector(selector);

  if (!container) return;

  let html = '';

  // 呼叫 getIcon(item.type) 拿到 SVG 字串
  const list = hoursData.renderData || [];
  list.forEach((item) => {
      // item 裡面直接就有 time, icon, temp
      html += `
          <div class="hourly-forecast__item value-text">
              <div class="hourly-forecast__time label-text">${item.time}</div>
              <div class="icon">
                  ${getIcon(item.icon)}
              </div>
              <div class="hourly-forecast__temp value-text">${item.temp}°C</div>
          </div>
      `;
    });


  container.innerHTML = html;
}

// Card 2
/**
 * @param {Object} data - API 回傳的資料
 */
export function renderDailySummary(data) {
  const errorEl = document.getElementById('c2-error');
  const forecastRow = document.getElementById('c2-row');
  const highLights = document.getElementById('c2-highlights');
  const container = document.querySelector('.temp-bar');

  if (!container) return;

  // 資料失敗的情況
  if (!data.ok) {
    forecastRow.classList.add('is-hidden');
    highLights.classList.add('is-hidden');
    errorEl.classList.remove('is-hidden');
    errorEl.textContent = data.error.message;
    return;
  }

  // 資料成功的情況
  highLights.classList.remove('is-hidden');
  forecastRow.classList.remove('is-hidden');
  errorEl.classList.add('is-hidden');

  // 解構資料
  const { minT, maxT, barLeft, barWidth, weather, comfortIndex, chanceOfRain } = data.renderData;
  // 填入資料
  document.getElementById('c2-min').textContent = minT + '°C';
  document.getElementById('c2-max').textContent = maxT + '°C';
  document.getElementById('c2-weather').textContent = weather;
  document.getElementById('c2-comfort').textContent = comfortIndex;
  document.getElementById('c2-rain').textContent = chanceOfRain + '%';
  //
  const currentWeatherText = document.querySelector('.current-weather__text');
  console.log(data.renderData.weather)
  currentWeatherText.textContent = data.renderData.weather

  // CSS 樣式控制
  const barEl = document.getElementById('c2-bar');
  barEl.style.left = barLeft + '%';
  barEl.style.width = barWidth + '%';
}

// renderForecast
export function renderForecast(data,selector = '.forecast-list'){
  console.log(data)
  const container = document.querySelector(selector);
  const subtitle = document.querySelector(".subtitle");
  if (!container) return;

  if(!data || !data.renderData){
    container.innerHTML = '<div class = "error">暫無預報資料</div>';
    return
  } 

  subtitle.textContent = data.renderData[city];

  const forecastList = Object.entries(data.renderData);

  let html = '';

  forecastList.pop();

  forecastList.forEach(([weekday,values])=>{

    const dataStr = values[0];
    const iconType = values[1];
    const conditionText = values[2];

    const tempObj = values[3] || {};
    const maxT = tempObj['最高溫'] ?? '--';
    const minT = tempObj['最低溫'] ?? '--';

    const popObj = values[4] || {};
    const pop = popObj['降雨機率'] ?? '--';
    const popDisplay = pop === '--' ? '--' : `${pop}%`;
    
    const windObj = values[5] || {};
    const wind = windObj['風速'] ?? '--';

    html += `
      <article class = "forecast-list__row">

        <div class="day-item">
          <div class="day-item__weekday label-text">${weekday}</div>
          <div class="day-item__date value-text">${dataStr}</div>
        </div>

        <div class="forecast-list__icon">
          ${getIcon(iconType)}
        </div>

        <div class="forecast-list__condition value-text">${conditionText}</div>

        <div class="forecast-list__metrics">

          <div class="weather-metric">
            <div class="weather-metric__label label-text">高溫 / 低溫</div>
            <div class="weather-metric__value value-text">${maxT}° / ${minT}°</div>
          </div>

          <div class="weather-metric">
            <div class="weather-metric__label label-text">降雨機率</div>
            <div class="weather-metric__value value-text">${popDisplay}</div>
          </div>

          <div class="weather-metric">
            <div class="weather-metric__label label-text">風速</div>
            <div class="weather-metric__value value-text">${wind}m/s</div>
          </div>

        </div>
      </article>
    `;
  });
  container.innerHTML = html;
}

//  renderCurrentWeather
export function renderCurrentWeather(data){
  const tempEL = document.querySelector('.current-weather__temp');

  if (!tempEL || !data || !data.renderData) 
    return;

  const temp = data.renderData.T;
  tempEL.textContent = `${temp}°C`

  const weatherText = data.UIData?.Weather;
  console.log("目前背景天氣", weatherText)

  //在這邊切換背景
  WeatherManager.update(weatherText);
}

// renderLocationPopup
export function renderLocationPopup(data){
  const popUp = document.querySelector(".location-popup__container")
  if (!popUp) return
  popUp.innerHTML = `<h4>📍 即時位置資訊</h4>
      <p>離您最近的觀測站是：
        <span class="location-popup__staion-name">${data.StationName}</span>
      </p>
      <ul class="location-popup__info">
        <li>🌦️ 天氣狀況｜${data.Weather}</li>
        <li>🌡️ 目前溫度｜${data.AirTemperature}</li>
        <li>💧 相對濕度｜${data.RelativeHumidity}%</li>
        <li>☀️ 紫外線指數｜${data.UVIndex}</li>
      </ul>`
}

export function renderFakeData(){
  const CurrentWeatherData = {
    renderData: {
      T: 17,
    },
    UIData: {
      Weather: "陰有雷雨"
    }
  }
  renderCurrentWeather(CurrentWeatherData)

  const HourlyForecastData = {
    "ok": true,
    "renderData": [{
            "time": "now",
            "icon": "Cloudy",
            "temp": "22"
        },
        {
            "time": "18",
            "icon": "Sunny",
            "temp": "22"
        },
        {
            "time": "19",
            "icon": "Rainy",
            "temp": "21"
        },
        {
            "time": "20",
            "icon": "Rainy",
            "temp": "20"
        },
        {
            "time": "21",
            "icon": "Thunder",
            "temp": "20"
        },
        {
            "time": "22",
            "icon": "Thunder",
            "temp": "20"
        }
    ]
}
  renderHourlyForecast(HourlyForecastData)

  const dailySummaryData = {
    "ok": true,
    "renderData": {
        "minT": "16",
        "maxT": "22",
        "barLeft": "40",
        "barWidth": "40",
        "weather": "陰有雷雨",
        "comfortIndex": "稍有寒意至舒適",
        "chanceOfRain": "80"
    }
}
  renderDailySummary(dailySummaryData)
}

export function renderFakeForecast(){
  const fakeForecast = {
    "ok": true,
    "renderData": {
        "星期五": [
            "1/30",
            "Cloudy",
            "多雲時陰",
            {
                "最高溫": 22,
                "最低溫": 19
            },
            {
                "降雨機率": 20
            },
            {
                "風速": 3
            }
        ],
        "星期六": [
            "1/31",
            "Rainy",
            "陰短暫雨",
            {
                "最高溫": 19,
                "最低溫": 15
            },
            {
                "降雨機率": 60
            },
            {
                "風速": 3
            }
        ],
        "星期日": [
            "2/1",
            "Rainy",
            "陰短暫雨",
            {
                "最高溫": 16,
                "最低溫": 14
            },
            {
                "降雨機率": 30
            },
            {
                "風速": 4.5
            }
        ],
        "星期一": [
            "2/2",
            "Rainy",
            "陰短暫雨",
            {
                "最高溫": 17,
                "最低溫": 14
            },
            {
                "降雨機率": 30
            },
            {
                "風速": 4
            }
        ],
        "星期二": [
            "2/3",
            "Cloudy",
            "陰時多雲",
            {
                "最高溫": 20,
                "最低溫": 15
            },
            {
                "降雨機率": "--"
            },
            {
                "風速": 3
            }
        ],
        "星期三": [
            "2/4",
            "Sunny",
            "晴",
            {
                "最高溫": 23,
                "最低溫": 15
            },
            {
                "降雨機率": "--"
            },
            {
                "風速": 2
            }
        ],
        "星期四": [
            "2/5",
            "Sunny",
            "晴",
            {
                "最高溫": 23,
                "最低溫": 15
            },
            {
                "降雨機率": "--"
            },
            {
                "風速": 1
            }
        ],
        "比奇堡": "比奇堡"
    }
}
  renderForecast(fakeForecast)
}