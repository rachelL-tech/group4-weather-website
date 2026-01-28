// 引入渲染工具
import { renderHourlyForecast, renderDailySummary } from './render.js';
import { getCard2RenderData } from './api.js';

// 跳轉頁面

const homePageBtn = document.getElementById('homePageBtn');
const forecastPageBtn = document.getElementById('forecastPageBtn');

if (forecastPageBtn) {
  forecastPageBtn.addEventListener('click', () => {
    window.location.href = 'forecast.html';
  });
}

if (homePageBtn) {
  homePageBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
}

renderHourlyForecast();

const card2_Data = await getCard2RenderData();
renderDailySummary(card2_Data);
