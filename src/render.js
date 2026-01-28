// Card 1
import { getIcon } from './icons.js'; // 引入函式

export function renderHourlyForecast(hoursData, selector = '.hourly-forecast') {
  const container = document.querySelector(selector);

  if (!container) return;

  // 假資料 (以後從 API 抓)
  // const hoursData = [
  //   { time: '現在', temp: '23°C', type: 'rainy' },
  //   { time: '00', temp: '21°C', type: 'rainy' },
  //   { time: '01', temp: '20°C', type: 'thunder' },
  //   { time: '02', temp: '20°C', type: 'cloudy' },
  //   { time: '03', temp: '23°C', type: 'sunny' },
  //   { time: '04', temp: '26°C', type: 'sunny' },
  // ];

  let html = '';

  hoursData.forEach((item) => {
    // 呼叫 getIcon(item.type) 拿到 SVG 字串
    html += `
            <div class="hourly-forecast__item">
                <div class="hourly-forecast__time">${item.time}</div>
                
                <div class="icon icon--small">
                    ${getIcon(item.type)} 
                </div>
                
                <div class="hourly-forecast__temp">${item.temp}</div>
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

  // CSS 樣式控制
  const barEl = document.getElementById('c2-bar');
  barEl.style.left = barLeft + '%';
  barEl.style.width = barWidth + '%';
}

// // 假資料 (以後從 API 抓)
// const fakeData = {
//   ok: true,
//   renderData: {
//     minT: 18,
//     maxT: 32,
//     barLeft: '25', // 模擬算出 25%
//     barWidth: '40', // 模擬算出 40%
//     weather: '雷陣雨',
//     comfortIndex: '悶熱',
//     chanceOfRain: 60,
//   },
// };

// // 假資料 (以後從 API 抓)
// const fakeErrorData = {
//   ok: false,
//   error: {
//     message: '無法連線到氣象資料服務，請稍後再試。',
//   },
// };